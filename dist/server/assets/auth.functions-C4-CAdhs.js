import { c as createServerRpc } from "./createServerRpc-BZ-1rN-j.js";
import { h as createServerFn, a as getRequest } from "./server-C1RKXgFD.js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { r as requireSupabaseAuth } from "./auth-middleware-HVhdhqZn.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const checkAuthFn_createServerFn_handler = createServerRpc({
  id: "06d1c4397d8d80e59d6dd7a014172b24d07d1c906cfbffadfded6d2e704e3ac2",
  name: "checkAuthFn",
  filename: "src/lib/auth.functions.ts"
}, (opts) => checkAuthFn.__executeServer(opts));
const checkAuthFn = createServerFn({
  method: "GET"
}).handler(checkAuthFn_createServerFn_handler, async () => {
  const {
    getAccessToken
  } = await import("./cookies.server-C2nrfYxb.js");
  const accessToken = getAccessToken();
  if (!accessToken) return {
    user: null
  };
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    data: isBlacklisted
  } = await supabaseAdmin.from("token_blacklist").select("token").eq("token", accessToken).maybeSingle();
  if (isBlacklisted) return {
    user: null
  };
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
  const {
    data,
    error
  } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return {
    user: null
  };
  return {
    user: data.user
  };
});
const signInWithPasswordServerFn_createServerFn_handler = createServerRpc({
  id: "a0d3c0fd56dc0ec1b203f8fc17c7f212b37ea6a3d6d9255b9a6f445828607116",
  name: "signInWithPasswordServerFn",
  filename: "src/lib/auth.functions.ts"
}, (opts) => signInWithPasswordServerFn.__executeServer(opts));
const signInWithPasswordServerFn = createServerFn({
  method: "POST"
}).validator((input) => z.object({
  email: z.string().email(),
  password: z.string()
}).parse(input)).handler(signInWithPasswordServerFn_createServerFn_handler, async ({
  data
}) => {
  const {
    checkRateLimit,
    isAccountLocked,
    getClientIp,
    recordLoginAttempt,
    recordLoginEvent,
    checkLoginAnomaly,
    writeSecurityEvent,
    geoLookup,
    parseUserAgent,
    detectDeviceType
  } = await import("./security.server-BRG0sDb-.js");
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    sendSuspiciousLoginBlockedAlert,
    sendAccountLockedAlert,
    sendNewDeviceLoginAlert
  } = await import("./email.server-w0MXyg9U.js");
  const {
    generateRandomToken
  } = await import("./auth.server-CsM-4OAP.js");
  const req = getRequest();
  const ip = getClientIp(req);
  const ua = req?.headers.get("user-agent") ?? null;
  const rl = await checkRateLimit(`login:${ip}`, 5, 15 * 60);
  if (!rl.allowed) {
    throw new Error("Too many login attempts. Try again in 15 minutes.");
  }
  if (await isAccountLocked(data.email)) {
    const unlockToken = generateRandomToken();
    await supabaseAdmin.from("email_verification_tokens").insert({
      token: unlockToken,
      action_type: "account_unlock",
      metadata: {
        email: data.email
      },
      expires_at: new Date(Date.now() + 15 * 60 * 1e3).toISOString()
    });
    const origin = req?.headers.get("origin") ?? "http://localhost:8081";
    await sendAccountLockedAlert(data.email, {
      reason: "5 failed login attempts",
      unlockUrl: `${origin}/auth/unlock?token=${unlockToken}`
    });
    throw new Error("Account is temporarily locked. An email has been sent with unlock instructions.");
  }
  const {
    data: authData,
    error: authError
  } = await supabaseAdmin.auth.signInWithPassword({
    email: data.email,
    password: data.password
  });
  await recordLoginAttempt(data.email, !authError, ip, ua);
  if (authError || !authData.user || !authData.session) {
    throw new Error("Invalid email or password");
  }
  const userId = authData.user.id;
  const {
    data: twoFa
  } = await supabaseAdmin.from("user_2fa").select("totp_enabled, totp_secret").eq("user_id", userId).maybeSingle();
  if (twoFa?.totp_enabled) {
    const temp2faToken = generateRandomToken();
    await supabaseAdmin.from("email_verification_tokens").insert({
      token: temp2faToken,
      user_id: userId,
      action_type: "2fa_challenge",
      metadata: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        email: data.email
      },
      expires_at: new Date(Date.now() + 5 * 60 * 1e3).toISOString()
    });
    return {
      mfaRequired: true,
      tempToken: temp2faToken
    };
  }
  const anomaly = await checkLoginAnomaly(userId, data.email, ip, ua);
  if (anomaly.anomalous) {
    await writeSecurityEvent({
      userId,
      email: data.email,
      eventType: "suspicious_login_blocked",
      severity: "critical",
      ip,
      userAgent: ua,
      details: {
        reasons: anomaly.reasons
      }
    });
    const verifyToken = generateRandomToken();
    await supabaseAdmin.from("email_verification_tokens").insert({
      token: verifyToken,
      user_id: userId,
      action_type: "suspicious_login_verify",
      metadata: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        email: data.email
      },
      expires_at: new Date(Date.now() + 15 * 60 * 1e3).toISOString()
    });
    const {
      country: country2,
      city: city2
    } = await geoLookup(ip);
    const origin = req?.headers.get("origin") ?? "http://localhost:8081";
    await sendSuspiciousLoginBlockedAlert(data.email, {
      ip: ip ?? "unknown",
      country: country2 ?? "unknown",
      city: city2 ?? "unknown",
      device: detectDeviceType(ua),
      verifyUrl: `${origin}/auth/verify-login?token=${verifyToken}`
    });
    throw new Error("Login blocked due to anomalous activity. A confirmation email has been sent.");
  }
  const deviceType = detectDeviceType(ua);
  const {
    browserName,
    browserVersion,
    os
  } = parseUserAgent(ua);
  const {
    country,
    city
  } = await geoLookup(ip);
  const {
    data: sessionRow,
    error: sessionErr
  } = await supabaseAdmin.from("user_sessions").insert({
    user_id: userId,
    device_type: deviceType,
    browser_name: browserName,
    browser_version: browserVersion,
    os,
    ip_address: ip,
    country,
    city
  }).select("id").single();
  if (sessionErr) throw new Error("Could not initialize session");
  const headers = new Headers();
  const secure = "Secure;";
  headers.append("Set-Cookie", `sb-access-token=${authData.session.access_token}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=900`);
  headers.append("Set-Cookie", `sb-refresh-token=${authData.session.refresh_token}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=604800`);
  headers.append("Set-Cookie", `sb-session-id=${sessionRow.id}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=2592000`);
  const loginHistory = await recordLoginEvent({
    userId,
    email: data.email,
    ip,
    userAgent: ua
  });
  if (loginHistory.isNewDevice) {
    const blockToken = generateRandomToken();
    await supabaseAdmin.from("email_verification_tokens").insert({
      token: blockToken,
      user_id: userId,
      action_type: "session_block",
      metadata: {
        sessionId: sessionRow.id
      },
      expires_at: new Date(Date.now() + 15 * 60 * 1e3).toISOString()
    });
    const origin = req?.headers.get("origin") ?? "http://localhost:8081";
    await sendNewDeviceLoginAlert(data.email, {
      ip: ip ?? "unknown",
      country: country ?? "unknown",
      device: `${os} (${browserName})`,
      blockUrl: `${origin}/auth/block-session?token=${blockToken}`
    });
  }
  return new Response(JSON.stringify({
    user: authData.user
  }), {
    headers
  });
});
const signUpServerFn_createServerFn_handler = createServerRpc({
  id: "35978e2419cc50dddeacc534bc89e7064e2b8ce08105e4feee0f7c83f6558128",
  name: "signUpServerFn",
  filename: "src/lib/auth.functions.ts"
}, (opts) => signUpServerFn.__executeServer(opts));
const signUpServerFn = createServerFn({
  method: "POST"
}).validator((input) => z.object({
  email: z.string().email(),
  password: z.string(),
  full_name: z.string().optional()
}).parse(input)).handler(signUpServerFn_createServerFn_handler, async ({
  data
}) => {
  const {
    checkRateLimit,
    getClientIp,
    isBlockedUserAgent,
    writeSecurityEvent
  } = await import("./security.server-BRG0sDb-.js");
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
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
  const {
    error
  } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.full_name ?? ""
    }
  });
  if (error) throw new Error(error.message);
  await writeSecurityEvent({
    email: data.email,
    eventType: "account_signup",
    severity: "info",
    ip,
    userAgent: ua
  });
  return {
    ok: true
  };
});
const logoutServerFn_createServerFn_handler = createServerRpc({
  id: "5468b12d0dce68e830e883a63b1dd4aa4723696bd2a0eb3e4f2400fc3fcaff4e",
  name: "logoutServerFn",
  filename: "src/lib/auth.functions.ts"
}, (opts) => logoutServerFn.__executeServer(opts));
const logoutServerFn = createServerFn({
  method: "POST"
}).handler(logoutServerFn_createServerFn_handler, async () => {
  const {
    getAccessToken,
    getSessionIdCookie
  } = await import("./cookies.server-C2nrfYxb.js");
  const accessToken = getAccessToken();
  const sessionId = getSessionIdCookie();
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  if (accessToken) {
    const {
      decodeJwtPayload
    } = await import("./auth.server-CsM-4OAP.js");
    const payload = decodeJwtPayload(accessToken);
    const expiresAt = payload?.exp ? new Date(payload.exp * 1e3).toISOString() : new Date(Date.now() + 15 * 60 * 1e3).toISOString();
    await supabaseAdmin.from("token_blacklist").insert({
      token: accessToken,
      expires_at: expiresAt
    });
  }
  if (sessionId) {
    await supabaseAdmin.from("user_sessions").delete().eq("id", sessionId);
  }
  const headers = new Headers();
  const secure = "Secure;";
  headers.append("Set-Cookie", `sb-access-token=; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=0`);
  headers.append("Set-Cookie", `sb-refresh-token=; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=0`);
  headers.append("Set-Cookie", `sb-session-id=; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=0`);
  return new Response(JSON.stringify({
    ok: true
  }), {
    headers
  });
});
const setup2faServerFn_createServerFn_handler = createServerRpc({
  id: "be483e9e42c205c6c13091877a789f444afdfc857e317f374ec0a6ce52792cf0",
  name: "setup2faServerFn",
  filename: "src/lib/auth.functions.ts"
}, (opts) => setup2faServerFn.__executeServer(opts));
const setup2faServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(setup2faServerFn_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    generateBase32Secret
  } = await import("./auth.server-CsM-4OAP.js");
  const {
    userId
  } = context;
  const secret = generateBase32Secret(20);
  const email = context.claims?.email ?? "User";
  const otpauthUri = `otpauth://totp/IRAYA:${email}?secret=${secret}&issuer=IRAYA`;
  await supabaseAdmin.from("user_2fa").upsert({
    user_id: userId,
    totp_secret: secret,
    totp_enabled: false
  });
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUri)}`;
  return {
    secret,
    qrUrl
  };
});
const confirm2faServerFn_createServerFn_handler = createServerRpc({
  id: "81d621abc236bb8841e8fb237186b9ec0d2c6a365f27112db1c0d0bf89fd2254",
  name: "confirm2faServerFn",
  filename: "src/lib/auth.functions.ts"
}, (opts) => confirm2faServerFn.__executeServer(opts));
const confirm2faServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  code: z.string().length(6),
  secret: z.string()
}).parse(input)).handler(confirm2faServerFn_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    verifyTotp,
    generateRandomToken,
    hashBackupCode
  } = await import("./auth.server-CsM-4OAP.js");
  const {
    userId
  } = context;
  const validated = verifyTotp(data.secret, data.code);
  if (!validated) {
    throw new Error("Invalid verification code");
  }
  const backupCodesRaw = Array.from({
    length: 10
  }, () => generateRandomToken(4));
  const hashedBackupCodes = backupCodesRaw.map((code) => hashBackupCode(code, userId));
  await supabaseAdmin.from("user_2fa").update({
    totp_enabled: true,
    backup_codes: hashedBackupCodes
  }).eq("user_id", userId);
  await supabaseAdmin.from("security_events").insert({
    user_id: userId,
    email: context.claims?.email,
    event_type: "2fa_enabled",
    severity: "info",
    ip: context.claims?.ip
  });
  return {
    backupCodes: backupCodesRaw
  };
});
const verify2faServerFn_createServerFn_handler = createServerRpc({
  id: "07995b0a058f02f571d729587a5a45876b02355e9fc2a6990793c510add58fe2",
  name: "verify2faServerFn",
  filename: "src/lib/auth.functions.ts"
}, (opts) => verify2faServerFn.__executeServer(opts));
const verify2faServerFn = createServerFn({
  method: "POST"
}).validator((input) => z.object({
  code: z.string(),
  tempToken: z.string()
}).parse(input)).handler(verify2faServerFn_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    getClientIp,
    detectDeviceType,
    parseUserAgent,
    geoLookup
  } = await import("./security.server-BRG0sDb-.js");
  const {
    verifyTotp,
    hashBackupCode
  } = await import("./auth.server-CsM-4OAP.js");
  const tokenRecord = await supabaseAdmin.from("email_verification_tokens").select("*").eq("token", data.tempToken).eq("action_type", "2fa_challenge").maybeSingle();
  if (tokenRecord.error || !tokenRecord.data) {
    throw new Error("2FA challenge expired or invalid");
  }
  const {
    user_id: userIdOrNull,
    metadata
  } = tokenRecord.data;
  if (!userIdOrNull) throw new Error("2FA challenge token has no user");
  const userId = userIdOrNull;
  const {
    access_token,
    refresh_token,
    email
  } = metadata;
  const {
    data: twoFa
  } = await supabaseAdmin.from("user_2fa").select("*").eq("user_id", userId).single();
  if (!twoFa) throw new Error("2FA not configured");
  if (!twoFa.totp_secret) throw new Error("2FA secret not configured");
  if (twoFa.locked_until && new Date(twoFa.locked_until) > /* @__PURE__ */ new Date()) {
    throw new Error("2FA locked due to too many failed attempts. Try again later.");
  }
  let verified = false;
  if (data.code.length === 6) {
    verified = verifyTotp(twoFa.totp_secret, data.code);
  } else {
    const hashedCode = hashBackupCode(data.code, userId);
    const backupCodes = twoFa.backup_codes ?? [];
    const codeIndex = backupCodes.indexOf(hashedCode);
    if (codeIndex !== -1) {
      verified = true;
      const updatedBackupCodes = [...backupCodes];
      updatedBackupCodes.splice(codeIndex, 1);
      await supabaseAdmin.from("user_2fa").update({
        backup_codes: updatedBackupCodes
      }).eq("user_id", userId);
    }
  }
  const req = getRequest();
  const ip = getClientIp(req);
  const ua = req?.headers.get("user-agent") ?? null;
  if (!verified) {
    const fails = (twoFa.failed_attempts || 0) + 1;
    const lockedUntil = fails >= 5 ? new Date(Date.now() + 30 * 60 * 1e3).toISOString() : null;
    await supabaseAdmin.from("user_2fa").update({
      failed_attempts: fails,
      locked_until: lockedUntil
    }).eq("user_id", userId);
    throw new Error(lockedUntil ? "Too many failed 2FA attempts. Locked for 30 minutes." : "Invalid 2FA code");
  }
  await supabaseAdmin.from("user_2fa").update({
    failed_attempts: 0,
    locked_until: null
  }).eq("user_id", userId);
  const deviceType = detectDeviceType(ua);
  const {
    browserName,
    browserVersion,
    os
  } = parseUserAgent(ua);
  const {
    country,
    city
  } = await geoLookup(ip);
  const {
    data: sessionRow
  } = await supabaseAdmin.from("user_sessions").insert({
    user_id: userId,
    device_type: deviceType,
    browser_name: browserName,
    browser_version: browserVersion,
    os,
    ip_address: ip,
    country,
    city
  }).select("id").single();
  if (!sessionRow) throw new Error("Could not initialize session");
  await supabaseAdmin.from("email_verification_tokens").delete().eq("token", data.tempToken);
  const headers = new Headers();
  const secure = "Secure;";
  headers.append("Set-Cookie", `sb-access-token=${access_token}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=900`);
  headers.append("Set-Cookie", `sb-refresh-token=${refresh_token}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=604800`);
  headers.append("Set-Cookie", `sb-session-id=${sessionRow.id}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=2592000`);
  return new Response(JSON.stringify({
    success: true
  }), {
    headers
  });
});
const listMySessions_createServerFn_handler = createServerRpc({
  id: "27c6a8f3a486a1fe9e0ebb5e008b7ae011f79eeb90681c5496b9a9d09b6f70e4",
  name: "listMySessions",
  filename: "src/lib/auth.functions.ts"
}, (opts) => listMySessions.__executeServer(opts));
const listMySessions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMySessions_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    data
  } = await supabaseAdmin.from("user_sessions").select("*").eq("user_id", context.userId).order("last_active", {
    ascending: false
  });
  const {
    getSessionIdCookie
  } = await import("./cookies.server-C2nrfYxb.js");
  const currentSessionId = getSessionIdCookie();
  return (data ?? []).map((s) => ({
    ...s,
    isCurrent: s.id === currentSessionId
  }));
});
const terminateSession_createServerFn_handler = createServerRpc({
  id: "9a47419efc5357090981ea782cb467e0ba0f1997f9e04a3ffd50e525c202d583",
  name: "terminateSession",
  filename: "src/lib/auth.functions.ts"
}, (opts) => terminateSession.__executeServer(opts));
const terminateSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  id: z.string().uuid()
}).parse(input)).handler(terminateSession_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    userId
  } = context;
  await supabaseAdmin.from("user_sessions").delete().eq("id", data.id).eq("user_id", userId);
  const {
    getCookie,
    deleteCookie
  } = await import("./server-C8PAU-Ko.js");
  const currentSessionId = getCookie("sb-session-id");
  if (data.id === currentSessionId) {
    deleteCookie("sb-access-token", {
      path: "/"
    });
    deleteCookie("sb-refresh-token", {
      path: "/"
    });
    deleteCookie("sb-session-id", {
      path: "/"
    });
  }
  return {
    ok: true
  };
});
const terminateAllOtherSessions_createServerFn_handler = createServerRpc({
  id: "753bae9d6d697882a272e30d2f37b648143ad3f1643d55b1eaf3440c601ba4ff",
  name: "terminateAllOtherSessions",
  filename: "src/lib/auth.functions.ts"
}, (opts) => terminateAllOtherSessions.__executeServer(opts));
const terminateAllOtherSessions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(terminateAllOtherSessions_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    userId
  } = context;
  const {
    getCookie
  } = await import("./server-C8PAU-Ko.js");
  const currentSessionId = getCookie("sb-session-id");
  if (currentSessionId) {
    await supabaseAdmin.from("user_sessions").delete().eq("user_id", userId).neq("id", currentSessionId);
  } else {
    await supabaseAdmin.from("user_sessions").delete().eq("user_id", userId);
  }
  return {
    ok: true
  };
});
const changePasswordServerFn_createServerFn_handler = createServerRpc({
  id: "c54c041a51f0bd82d88c68f476e9fc7845294a7420241b76161a5bd003f4d5f9",
  name: "changePasswordServerFn",
  filename: "src/lib/auth.functions.ts"
}, (opts) => changePasswordServerFn.__executeServer(opts));
const changePasswordServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  newPassword: z.string()
}).parse(input)).handler(changePasswordServerFn_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    getClientIp,
    writeSecurityEvent
  } = await import("./security.server-BRG0sDb-.js");
  const {
    sendPasswordChangedAlert
  } = await import("./email.server-w0MXyg9U.js");
  const req = getRequest();
  const ip = getClientIp(req);
  if (!STRONG_PASSWORD.test(data.newPassword)) {
    throw new Error("Password must be 8+ characters, with an uppercase letter, lowercase letter, number, and special character.");
  }
  const {
    error
  } = await supabaseAdmin.auth.admin.updateUserById(context.userId, {
    password: data.newPassword
  });
  if (error) throw new Error(error.message);
  await writeSecurityEvent({
    userId: context.userId,
    email: context.claims?.email,
    eventType: "password_changed",
    severity: "warning",
    ip
  });
  const origin = req?.headers.get("origin") ?? "http://localhost:8081";
  if (context.claims?.email) {
    await sendPasswordChangedAlert(context.claims.email, {
      ip: ip ?? "unknown",
      resetUrl: `${origin}/auth/forgot-password`
    });
  }
  return {
    ok: true
  };
});
const get2faStatusServerFn_createServerFn_handler = createServerRpc({
  id: "f8fc6907bb5e4e9589219b29e96be1223aa5d22c62252d4ff7be7670854d5f42",
  name: "get2faStatusServerFn",
  filename: "src/lib/auth.functions.ts"
}, (opts) => get2faStatusServerFn.__executeServer(opts));
const get2faStatusServerFn = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(get2faStatusServerFn_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    data
  } = await supabaseAdmin.from("user_2fa").select("totp_enabled").eq("user_id", context.userId).maybeSingle();
  return {
    enabled: data?.totp_enabled ?? false
  };
});
export {
  changePasswordServerFn_createServerFn_handler,
  checkAuthFn_createServerFn_handler,
  confirm2faServerFn_createServerFn_handler,
  get2faStatusServerFn_createServerFn_handler,
  listMySessions_createServerFn_handler,
  logoutServerFn_createServerFn_handler,
  setup2faServerFn_createServerFn_handler,
  signInWithPasswordServerFn_createServerFn_handler,
  signUpServerFn_createServerFn_handler,
  terminateAllOtherSessions_createServerFn_handler,
  terminateSession_createServerFn_handler,
  verify2faServerFn_createServerFn_handler
};
