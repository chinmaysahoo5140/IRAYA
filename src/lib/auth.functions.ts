import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Strong password regex
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// Authentication utilities are dynamically imported from @/lib/auth.server inside server functions to avoid Node.js dependencies in client bundles.

export const checkAuthFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getAccessToken } = await import("@/lib/cookies.server");
  const accessToken = getAccessToken();
  if (!accessToken) return { user: null };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  
  // Blacklist check
  const { data: isBlacklisted } = await supabaseAdmin
    .from("token_blacklist")
    .select("token")
    .eq("token", accessToken)
    .maybeSingle();

  if (isBlacklisted) return { user: null };

  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return { user: null };

  return { user: data.user };
});

export const signInWithPasswordServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        email: z.string().email(),
        password: z.string(),
      })
      .parse(input)
  )
  .handler(async ({ data }) => {
    const { checkRateLimit, isAccountLocked, getClientIp, recordLoginAttempt, recordLoginEvent, checkLoginAnomaly, writeSecurityEvent, geoLookup, parseUserAgent, detectDeviceType } =
      await import("@/lib/security.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendSuspiciousLoginBlockedAlert, sendAccountLockedAlert, sendNewDeviceLoginAlert } =
      await import("@/lib/email.server");
    const { generateRandomToken } = await import("@/lib/auth.server");

    const req = getRequest();
    const ip = getClientIp(req);
    const ua = req?.headers.get("user-agent") ?? null;

    // Rate limit check
    const rl = await checkRateLimit(`login:${ip}`, 5, 15 * 60);
    if (!rl.allowed) {
      throw new Error("Too many login attempts. Try again in 15 minutes.");
    }

    // Account lockout check
    if (await isAccountLocked(data.email)) {
      // Send lock alert
      const unlockToken = generateRandomToken();
      await supabaseAdmin.from("email_verification_tokens").insert({
        token: unlockToken,
        action_type: "account_unlock",
        metadata: { email: data.email },
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });
      const origin = req?.headers.get("origin") ?? "http://localhost:8081";
      await sendAccountLockedAlert(data.email, {
        reason: "5 failed login attempts",
        unlockUrl: `${origin}/auth/unlock?token=${unlockToken}`,
      });

      throw new Error("Account is temporarily locked. An email has been sent with unlock instructions.");
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    await recordLoginAttempt(data.email, !authError, ip, ua);

    if (authError || !authData.user || !authData.session) {
      throw new Error("Invalid email or password");
    }

    const userId = authData.user.id;

    // Check if 2FA is enabled
    const { data: twoFa } = await supabaseAdmin
      .from("user_2fa")
      .select("totp_enabled, totp_secret")
      .eq("user_id", userId)
      .maybeSingle();

    if (twoFa?.totp_enabled) {
      // Return 2FA Challenge status without setting active session cookies
      const temp2faToken = generateRandomToken();
      // Store temp token in cache/db for 2FA validation
      await supabaseAdmin.from("email_verification_tokens").insert({
        token: temp2faToken,
        user_id: userId,
        action_type: "2fa_challenge",
        metadata: { 
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          email: data.email,
        },
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      });

      return {
        mfaRequired: true,
        tempToken: temp2faToken,
      };
    }

    // Check Geolocation Anomaly
    const anomaly = await checkLoginAnomaly(userId, data.email, ip, ua);
    if (anomaly.anomalous) {
      await writeSecurityEvent({
        userId,
        email: data.email,
        eventType: "suspicious_login_blocked",
        severity: "critical",
        ip,
        userAgent: ua,
        details: { reasons: anomaly.reasons },
      });

      const verifyToken = generateRandomToken();
      await supabaseAdmin.from("email_verification_tokens").insert({
        token: verifyToken,
        user_id: userId,
        action_type: "suspicious_login_verify",
        metadata: { 
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          email: data.email,
        },
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });

      const { country, city } = await geoLookup(ip);
      const origin = req?.headers.get("origin") ?? "http://localhost:8081";
      await sendSuspiciousLoginBlockedAlert(data.email, {
        ip: ip ?? "unknown",
        country: country ?? "unknown",
        city: city ?? "unknown",
        device: detectDeviceType(ua),
        verifyUrl: `${origin}/auth/verify-login?token=${verifyToken}`,
      });

      throw new Error("Login blocked due to anomalous activity. A confirmation email has been sent.");
    }

    // Create session and set cookies
    const deviceType = detectDeviceType(ua);
    const { browserName, browserVersion, os } = parseUserAgent(ua);
    const { country, city } = await geoLookup(ip);

    const { data: sessionRow, error: sessionErr } = await supabaseAdmin
      .from("user_sessions")
      .insert({
        user_id: userId,
        device_type: deviceType,
        browser_name: browserName,
        browser_version: browserVersion,
        os,
        ip_address: ip,
        country,
        city,
      })
      .select("id")
      .maybeSingle();

    if (sessionErr) {
      console.warn("[signInWithPasswordServerFn] Could not initialize session in database:", sessionErr.message);
    }

    const headers = new Headers();
    const secure = process.env.NODE_ENV === "production" ? "Secure;" : "";
    headers.append("Set-Cookie", `sb-access-token=${authData.session.access_token}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=900`);
    headers.append("Set-Cookie", `sb-refresh-token=${authData.session.refresh_token}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=604800`);
    
    const sessionId = sessionRow?.id ?? "no-session";
    headers.append("Set-Cookie", `sb-session-id=${sessionId}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=2592000`);

    // Record login events
    const loginHistory = await recordLoginEvent({
      userId,
      email: data.email,
      ip,
      userAgent: ua,
    });

    if (loginHistory.isNewDevice) {
      const blockToken = generateRandomToken();
      await supabaseAdmin.from("email_verification_tokens").insert({
        token: blockToken,
        user_id: userId,
        action_type: "session_block",
        metadata: { sessionId },
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });
      const origin = req?.headers.get("origin") ?? "http://localhost:8081";
      await sendNewDeviceLoginAlert(data.email, {
        ip: ip ?? "unknown",
        country: country ?? "unknown",
        device: `${os} (${browserName})`,
        blockUrl: `${origin}/auth/block-session?token=${blockToken}`,
      });
    }

    return new Response(JSON.stringify({ user: authData.user }), {
      headers,
    });
  });

export const signUpServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        email: z.string().email(),
        password: z.string(),
        full_name: z.string().optional(),
      })
      .parse(input)
  )
  .handler(async ({ data }) => {
    const { checkRateLimit, getClientIp, isBlockedUserAgent, writeSecurityEvent } = await import("@/lib/security.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const req = getRequest();
    const ip = getClientIp(req);
    const ua = req?.headers.get("user-agent") ?? null;

    if (isBlockedUserAgent(ua)) {
      throw new Error("Request blocked");
    }

    if (!STRONG_PASSWORD.test(data.password)) {
      throw new Error("Password must be 8+ characters, with an uppercase letter, lowercase letter, number, and special character.");
    }

    const rl = await checkRateLimit(`signup:${ip}`, 3, 60 * 60);
    if (!rl.allowed) {
      throw new Error("Too many sign-ups from this network. Please try again later.");
    }

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name ?? "" },
    });

    if (error) throw new Error(error.message);

    await writeSecurityEvent({
      email: data.email,
      eventType: "account_signup",
      severity: "info",
      ip,
      userAgent: ua,
    });

    return { ok: true };
  });

export const logoutServerFn = createServerFn({ method: "POST" }).handler(async () => {
  const { getAccessToken, getSessionIdCookie } = await import("@/lib/cookies.server");
  const accessToken = getAccessToken();
  const sessionId = getSessionIdCookie();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  if (accessToken) {
    // Decode expiry time
    const { decodeJwtPayload } = await import("@/lib/auth.server");
    const payload = decodeJwtPayload(accessToken);
    const expiresAt = payload?.exp ? new Date(payload.exp * 1000).toISOString() : new Date(Date.now() + 15 * 60 * 1000).toISOString();
    
    // Invalidate access token
    await supabaseAdmin.from("token_blacklist").insert({
      token: accessToken,
      expires_at: expiresAt,
    });
  }

  if (sessionId) {
    // Invalidate user session
    await supabaseAdmin.from("user_sessions").delete().eq("id", sessionId);
  }

  // Clear cookies
  const headers = new Headers();
  const secure = process.env.NODE_ENV === "production" ? "Secure;" : "";
  headers.append("Set-Cookie", `sb-access-token=; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=0`);
  headers.append("Set-Cookie", `sb-refresh-token=; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=0`);
  headers.append("Set-Cookie", `sb-session-id=; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=0`);

  return new Response(JSON.stringify({ ok: true }), {
    headers,
  });
});

// 2FA Functions
export const setup2faServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { generateBase32Secret } = await import("@/lib/auth.server");
    const { userId } = context;

    // Generate a proper Base32 TOTP secret (required by authenticator apps — RFC 4648).
    // 20 bytes = 160 bits, standard TOTP security level.
    const secret = generateBase32Secret(20);
    const email = context.claims?.email ?? "User";
    const otpauthUri = `otpauth://totp/IRAYA:${email}?secret=${secret}&issuer=IRAYA`;

    // Save pending secret
    await supabaseAdmin.from("user_2fa").upsert({
      user_id: userId,
      totp_secret: secret,
      totp_enabled: false,
    });

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUri)}`;

    return { secret, qrUrl };
  });

export const confirm2faServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        code: z.string().length(6),
        secret: z.string(),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { verifyTotp, generateRandomToken, hashBackupCode } = await import("@/lib/auth.server");
    const { userId } = context;

    const validated = verifyTotp(data.secret, data.code);
    if (!validated) {
      throw new Error("Invalid verification code");
    }

    // Generate 10 backup codes and hash them with the user's ID as a per-user salt
    const backupCodesRaw = Array.from({ length: 10 }, () => generateRandomToken(4));
    const hashedBackupCodes = backupCodesRaw.map((code) => hashBackupCode(code, userId));

    await supabaseAdmin.from("user_2fa").update({
      totp_enabled: true,
      backup_codes: hashedBackupCodes,
    }).eq("user_id", userId);

    await supabaseAdmin.from("security_events").insert({
      user_id: userId,
      email: context.claims?.email,
      event_type: "2fa_enabled",
      severity: "info",
      ip: context.claims?.ip,
    });

    return { backupCodes: backupCodesRaw };
  });

export const verify2faServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        code: z.string(),
        tempToken: z.string(),
      })
      .parse(input)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getClientIp, detectDeviceType, parseUserAgent, geoLookup } = await import("@/lib/security.server");
    const { verifyTotp, hashBackupCode } = await import("@/lib/auth.server");
    
    const tokenRecord = await supabaseAdmin
      .from("email_verification_tokens")
      .select("*")
      .eq("token", data.tempToken)
      .eq("action_type", "2fa_challenge")
      .maybeSingle();

    if (tokenRecord.error || !tokenRecord.data) {
      throw new Error("2FA challenge expired or invalid");
    }

    const { user_id: userIdOrNull, metadata } = tokenRecord.data;
    if (!userIdOrNull) throw new Error("2FA challenge token has no user");
    const userId = userIdOrNull;
    const { access_token, refresh_token, email } = metadata as any;

    const { data: twoFa } = await supabaseAdmin
      .from("user_2fa")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!twoFa) throw new Error("2FA not configured");
    if (!twoFa.totp_secret) throw new Error("2FA secret not configured");

    // Check Lockout
    if (twoFa.locked_until && new Date(twoFa.locked_until) > new Date()) {
      throw new Error("2FA locked due to too many failed attempts. Try again later.");
    }

    let verified = false;
    let isBackupCode = false;

    // Check TOTP
    if (data.code.length === 6) {
      verified = verifyTotp(twoFa.totp_secret, data.code);
    } else {
      // Check Backup Code
      const hashedCode = hashBackupCode(data.code, userId);
      const backupCodes = twoFa.backup_codes ?? [];
      const codeIndex = backupCodes.indexOf(hashedCode);
      if (codeIndex !== -1) {
        verified = true;
        isBackupCode = true;
        // Remove the used backup code (one-time use)
        const updatedBackupCodes = [...backupCodes];
        updatedBackupCodes.splice(codeIndex, 1);
        await supabaseAdmin.from("user_2fa").update({ backup_codes: updatedBackupCodes }).eq("user_id", userId);
      }
    }

    const req = getRequest();
    const ip = getClientIp(req);
    const ua = req?.headers.get("user-agent") ?? null;

    if (!verified) {
      const fails = (twoFa.failed_attempts || 0) + 1;
      const lockedUntil = fails >= 5 ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : null;
      await supabaseAdmin.from("user_2fa").update({
        failed_attempts: fails,
        locked_until: lockedUntil,
      }).eq("user_id", userId);

      throw new Error(lockedUntil ? "Too many failed 2FA attempts. Locked for 30 minutes." : "Invalid 2FA code");
    }

    // Reset failed attempts
    await supabaseAdmin.from("user_2fa").update({ failed_attempts: 0, locked_until: null }).eq("user_id", userId);

    // Create session
    const deviceType = detectDeviceType(ua);
    const { browserName, browserVersion, os } = parseUserAgent(ua);
    const { country, city } = await geoLookup(ip);

    const { data: sessionRow, error: sessionErr } = await supabaseAdmin
      .from("user_sessions")
      .insert({
        user_id: userId,
        device_type: deviceType,
        browser_name: browserName,
        browser_version: browserVersion,
        os,
        ip_address: ip,
        country,
        city,
      })
      .select("id")
      .single();

    if (sessionErr || !sessionRow) throw new Error("Could not initialize session: " + sessionErr?.message);

    // Clear verification token
    await supabaseAdmin.from("email_verification_tokens").delete().eq("token", data.tempToken);

    // Set auth cookies
    const headers = new Headers();
    const secure = process.env.NODE_ENV === "production" ? "Secure;" : "";
    headers.append("Set-Cookie", `sb-access-token=${access_token}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=900`);
    headers.append("Set-Cookie", `sb-refresh-token=${refresh_token}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=604800`);
    headers.append("Set-Cookie", `sb-session-id=${sessionRow.id}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=2592000`);

    return new Response(JSON.stringify({ success: true }), {
      headers,
    });
  });

// Session List and Management
export const listMySessions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("user_sessions")
      .select("*")
      .eq("user_id", context.userId)
      .order("last_active", { ascending: false });

    const { getSessionIdCookie } = await import("@/lib/cookies.server");
    const currentSessionId = getSessionIdCookie();

    return (data ?? []).map((s) => ({
      ...s,
      isCurrent: s.id === currentSessionId,
    }));
  });

export const terminateSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context;

    await supabaseAdmin
      .from("user_sessions")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);

    const { getCookie, deleteCookie } = await import('@tanstack/react-start/server');
    const currentSessionId = getCookie('sb-session-id');
    if (data.id === currentSessionId) {
      deleteCookie('sb-access-token', { path: '/' });
      deleteCookie('sb-refresh-token', { path: '/' });
      deleteCookie('sb-session-id', { path: '/' });
    }

    return { ok: true };
  });

export const terminateAllOtherSessions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context;

    const { getCookie } = await import('@tanstack/react-start/server');
    const currentSessionId = getCookie('sb-session-id');

    if (currentSessionId) {
      await supabaseAdmin
        .from("user_sessions")
        .delete()
        .eq("user_id", userId)
        .neq("id", currentSessionId);
    } else {
      await supabaseAdmin.from("user_sessions").delete().eq("user_id", userId);
    }

    return { ok: true };
  });

export const changePasswordServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ newPassword: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getClientIp, writeSecurityEvent } = await import("@/lib/security.server");
    const { sendPasswordChangedAlert } = await import("@/lib/email.server");
    const req = getRequest();
    const ip = getClientIp(req);

    if (!STRONG_PASSWORD.test(data.newPassword)) {
      throw new Error("Password must be 8+ characters, with an uppercase letter, lowercase letter, number, and special character.");
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(context.userId, {
      password: data.newPassword,
    });

    if (error) throw new Error(error.message);

    await writeSecurityEvent({
      userId: context.userId,
      email: context.claims?.email,
      eventType: "password_changed",
      severity: "warning",
      ip,
    });

    const origin = req?.headers.get("origin") ?? "http://localhost:8081";
    if (context.claims?.email) {
      await sendPasswordChangedAlert(context.claims.email, {
        ip: ip ?? "unknown",
        resetUrl: `${origin}/auth/forgot-password`,
      });
    }

    return { ok: true };
  });

export const get2faStatusServerFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("user_2fa")
      .select("totp_enabled")
      .eq("user_id", context.userId)
      .maybeSingle();
    return { enabled: data?.totp_enabled ?? false };
  });


