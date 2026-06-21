import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Decode JWT payload without signature verification
function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString('ascii')
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const requireSupabaseAuth = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    // New TanStack Start server API — no vinxi/http needed
    const { getCookie, setCookie, deleteCookie } = await import('@tanstack/react-start/server');

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      throw new Error("Supabase URL or Publishable Key is missing");
    }

    const request = getRequest();
    if (!request?.headers) {
      throw new Error('Unauthorized: No request headers available');
    }

    const { getClientIp, validateRequestTimestamp, writeSecurityEvent } = await import('@/lib/security.server');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    
    // 1. IP Ban check
    const ip = getClientIp(request);
    if (ip) {
      const { data: isBanned } = await supabaseAdmin
        .from('banned_ips')
        .select('ip')
        .eq('ip', ip)
        .maybeSingle();
      if (isBanned) {
        throw new Error('Forbidden: Your IP address is banned');
      }
    }

    // 2. Request Timestamp signing/validation
    try {
      validateRequestTimestamp(request);
    } catch (err) {
      throw new Error(`Unauthorized: ${(err as Error).message}`);
    }

    let accessToken = getCookie('sb-access-token') ?? null;
    const refreshToken = getCookie('sb-refresh-token') ?? null;

    let token = accessToken;
    let userId: string | null = null;
    let claims: any = null;

    // 3. Blacklist check on current access token
    if (token) {
      const { data: isBlacklisted } = await supabaseAdmin
        .from('token_blacklist')
        .select('token')
        .eq('token', token)
        .maybeSingle();

      if (isBlacklisted) {
        token = null;
      }
    }

    const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Verify token if present
    if (token) {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) {
        userId = data.user.id;
        claims = decodeJwtPayload(token);

        // Enforce verification: signed-up email users must verify their email.
        const isEmailVerified = claims?.email_verified === true;
        const isPhoneVerified = claims?.phone_verified === true;
        if (claims?.email && !isEmailVerified && !isPhoneVerified) {
          throw new Error('Unauthorized: Email verification required');
        }
      } else {
        token = null; // Token expired or invalid
      }
    }

    // 4. If access token invalid/expired, try refresh token rotation
    if (!token && refreshToken) {
      try {
        const { data: refreshData, error: refreshError } = await supabaseAdmin.auth.refreshSession({
          refresh_token: refreshToken,
        });

        if (refreshError || !refreshData.session) {
          // Check for token reuse error (refresh token replay attack)
          const errMsg = refreshError?.message ?? '';
          if (errMsg.includes('already been used') || errMsg.includes('invalid_grant')) {
            // SECURITY: We cannot trust the `sub` from the unverified expired access token.
            // An attacker could craft a JWT with a forged `sub` to trigger signOut on a
            // victim's account. We only log the incident here.
            // Supabase's refresh token rotation already invalidates the reused token server-side.
            const expiredPayload = accessToken ? decodeJwtPayload(accessToken) : null;

            await writeSecurityEvent({
              // Do NOT use expiredPayload.sub to sign out — it is unverified.
              // Log the raw decoded email only for alerting, never for security decisions.
              email: expiredPayload?.email ?? null,
              eventType: 'refresh_token_reuse_attack',
              severity: 'critical',
              ip,
              userAgent: request.headers.get('user-agent'),
              details: { error: errMsg, note: 'Token sub unverified; no signOut performed' },
            });
          }
          throw new Error('Unauthorized: Session refresh failed');
        }

        // Token refresh succeeded! Set new cookies
        const newSession = refreshData.session;
        const secure = process.env.NODE_ENV === 'production';

        setCookie('sb-access-token', newSession.access_token, {
          httpOnly: true,
          secure,
          sameSite: 'strict',
          path: '/',
          maxAge: 15 * 60,
        });

        setCookie('sb-refresh-token', newSession.refresh_token, {
          httpOnly: true,
          secure,
          sameSite: 'strict',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
        });

        // Update context details
        token = newSession.access_token;
        userId = newSession.user.id;
        
        claims = decodeJwtPayload(token);

        // Enforce verification: signed-up email users must verify their email.
        const isEmailVerified = claims?.email_verified === true;
        const isPhoneVerified = claims?.phone_verified === true;
        if (claims?.email && !isEmailVerified && !isPhoneVerified) {
          throw new Error('Unauthorized: Email verification required');
        }

        // Update session active timestamp — non-fatal: don't block auth if table is temporarily unavailable
        const sessionId = getCookie('sb-session-id');
        if (sessionId) {
          supabaseAdmin
            .from('user_sessions')
            .update({ last_active: new Date().toISOString() })
            .eq('id', sessionId)
            .then(({ error }) => {
              if (error) console.warn('[auth-middleware] session update skipped:', error.message);
            });
        }
      } catch (err) {
        // Clear invalid cookies
        deleteCookie('sb-access-token', { path: '/' });
        deleteCookie('sb-refresh-token', { path: '/' });
        deleteCookie('sb-session-id', { path: '/' });
        throw new Error('Unauthorized: Session expired');
      }
    }

    if (!token || !userId) {
      throw new Error('Unauthorized: Access denied');
    }

    // Authenticate supabase context instance
    const authSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    return next({
      context: {
        supabase: authSupabase,
        userId,
        claims,
        token,
      },
    });
  },
);

