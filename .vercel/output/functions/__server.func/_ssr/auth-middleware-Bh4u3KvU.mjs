import { b as createMiddleware, g as getRequest } from "./server-CP7xr6_V.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, "base64").toString("ascii").split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const { getCookie, setCookie, deleteCookie } = await import("./server-CP7xr6_V.mjs").then(function(n) {
      return n.e;
    });
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      throw new Error("Supabase URL or Publishable Key is missing");
    }
    const request = getRequest();
    if (!request?.headers) {
      throw new Error("Unauthorized: No request headers available");
    }
    const { getClientIp, validateRequestTimestamp, writeSecurityEvent } = await import("./security.server-BRG0sDb-.mjs");
    const { supabaseAdmin } = await import("./client.server-ijnlFj_c.mjs");
    const ip = getClientIp(request);
    if (ip) {
      const { data: isBanned } = await supabaseAdmin.from("banned_ips").select("ip").eq("ip", ip).maybeSingle();
      if (isBanned) {
        throw new Error("Forbidden: Your IP address is banned");
      }
    }
    try {
      validateRequestTimestamp(request);
    } catch (err) {
      throw new Error(`Unauthorized: ${err.message}`);
    }
    let accessToken = getCookie("sb-access-token") ?? null;
    const refreshToken = getCookie("sb-refresh-token") ?? null;
    let token = accessToken;
    let userId = null;
    let claims = null;
    if (token) {
      const { data: isBlacklisted } = await supabaseAdmin.from("token_blacklist").select("token").eq("token", token).maybeSingle();
      if (isBlacklisted) {
        token = null;
      }
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: void 0,
        persistSession: false,
        autoRefreshToken: false
      }
    });
    if (token) {
      const { data, error } = await supabase.auth.getClaims(token);
      if (!error && data?.claims?.sub) {
        userId = data.claims.sub;
        claims = data.claims;
      } else {
        token = null;
      }
    }
    if (!token && refreshToken) {
      try {
        const { data: refreshData, error: refreshError } = await supabaseAdmin.auth.refreshSession({
          refresh_token: refreshToken
        });
        if (refreshError || !refreshData.session) {
          const errMsg = refreshError?.message ?? "";
          if (errMsg.includes("already been used") || errMsg.includes("invalid_grant")) {
            const expiredPayload = accessToken ? decodeJwtPayload(accessToken) : null;
            await writeSecurityEvent({
              // Do NOT use expiredPayload.sub to sign out — it is unverified.
              // Log the raw decoded email only for alerting, never for security decisions.
              email: expiredPayload?.email ?? null,
              eventType: "refresh_token_reuse_attack",
              severity: "critical",
              ip,
              userAgent: request.headers.get("user-agent"),
              details: { error: errMsg, note: "Token sub unverified; no signOut performed" }
            });
          }
          throw new Error("Unauthorized: Session refresh failed");
        }
        const newSession = refreshData.session;
        const secure = true;
        setCookie("sb-access-token", newSession.access_token, {
          httpOnly: true,
          secure,
          sameSite: "strict",
          path: "/",
          maxAge: 15 * 60
        });
        setCookie("sb-refresh-token", newSession.refresh_token, {
          httpOnly: true,
          secure,
          sameSite: "strict",
          path: "/",
          maxAge: 7 * 24 * 60 * 60
        });
        token = newSession.access_token;
        userId = newSession.user.id;
        const { data: claimsData } = await supabase.auth.getClaims(token);
        claims = claimsData?.claims;
        const sessionId = getCookie("sb-session-id");
        if (sessionId) {
          await supabaseAdmin.from("user_sessions").update({ last_active: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sessionId);
        }
      } catch (err) {
        deleteCookie("sb-access-token", { path: "/" });
        deleteCookie("sb-refresh-token", { path: "/" });
        deleteCookie("sb-session-id", { path: "/" });
        throw new Error("Unauthorized: Session expired");
      }
    }
    if (!token || !userId) {
      throw new Error("Unauthorized: Access denied");
    }
    const authSupabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      auth: {
        storage: void 0,
        persistSession: false,
        autoRefreshToken: false
      }
    });
    return next({
      context: {
        supabase: authSupabase,
        userId,
        claims,
        token
      }
    });
  }
);
export {
  requireSupabaseAuth as r
};
