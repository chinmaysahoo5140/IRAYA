import { c as createServerRpc } from "./createServerRpc-BZ-1rN-j.js";
import { h as createServerFn } from "./server-C1RKXgFD.js";
import { r as requireSupabaseAuth } from "./auth-middleware-HVhdhqZn.js";
import { z } from "zod";
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
import "@supabase/supabase-js";
const adminSecurityFeed_createServerFn_handler = createServerRpc({
  id: "1a6a134719f4b7d428fa66f37db345d640a7d613f26d0d5c860228812597bbb3",
  name: "adminSecurityFeed",
  filename: "src/routes/_authenticated/admin/security.tsx"
}, (opts) => adminSecurityFeed.__executeServer(opts));
const adminSecurityFeed = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminSecurityFeed_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    data: roleRow
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!roleRow) throw new Error("Forbidden");
  const [attempts, events, payments, bannedIps, activeSessions, profiles] = await Promise.all([supabaseAdmin.from("login_attempts").select("email, success, ip, user_agent, created_at").order("created_at", {
    ascending: false
  }).limit(40), supabaseAdmin.from("security_events").select("event_type, severity, email, ip, country, created_at, details").order("created_at", {
    ascending: false
  }).limit(40), supabaseAdmin.from("payment_events").select("provider, event_type, payment_id, amount, currency, signature_valid, created_at").order("created_at", {
    ascending: false
  }).limit(20), supabaseAdmin.from("banned_ips").select("ip, reason, created_at").order("created_at", {
    ascending: false
  }).limit(50), supabaseAdmin.from("user_sessions").select("id, user_id, ip_address, device_type, browser_name, os, country, city, created_at").order("created_at", {
    ascending: false
  }).limit(20), supabaseAdmin.from("profiles").select("id, email")]);
  const ipCounts = /* @__PURE__ */ new Map();
  (attempts.data ?? []).forEach((a) => {
    if (a.success || !a.ip) return;
    ipCounts.set(a.ip, (ipCounts.get(a.ip) ?? 0) + 1);
  });
  const topIps = Array.from(ipCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([ip, count]) => ({
    ip,
    count
  }));
  const emailMap = new Map(profiles.data?.map((p) => [p.id, p.email]) ?? []);
  const sessionsWithEmails = (activeSessions.data ?? []).map((s) => ({
    ...s,
    email: emailMap.get(s.user_id) ?? "unknown"
  }));
  return {
    attempts: attempts.data ?? [],
    events: events.data ?? [],
    payments: payments.data ?? [],
    bannedIps: bannedIps.data ?? [],
    activeSessions: sessionsWithEmails,
    topIps
  };
});
const exportSecurityLogs_createServerFn_handler = createServerRpc({
  id: "17ca8a4339cbb04b419005d658d94f6ad96de94bdd053e2744cf2316606153aa",
  name: "exportSecurityLogs",
  filename: "src/routes/_authenticated/admin/security.tsx"
}, (opts) => exportSecurityLogs.__executeServer(opts));
const exportSecurityLogs = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(exportSecurityLogs_createServerFn_handler, async ({
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    data: roleRow
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!roleRow) throw new Error("Forbidden");
  const {
    data: events
  } = await supabaseAdmin.from("security_events").select("created_at, event_type, severity, email, ip, country, user_agent, details").order("created_at", {
    ascending: false
  }).limit(1e3);
  return events ?? [];
});
const banIpServerFn_createServerFn_handler = createServerRpc({
  id: "2e4f317df8bf23d2870c4ea332074504c9569f356035cdcb9a83b33ff9adc18f",
  name: "banIpServerFn",
  filename: "src/routes/_authenticated/admin/security.tsx"
}, (opts) => banIpServerFn.__executeServer(opts));
const banIpServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  ip: z.string().min(1),
  reason: z.string().optional()
}).parse(input)).handler(banIpServerFn_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    data: roleRow
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!roleRow) throw new Error("Forbidden");
  await supabaseAdmin.from("banned_ips").upsert({
    ip: data.ip,
    reason: data.reason ?? "Manual ban by administrator"
  });
  const {
    writeAuditLog
  } = await import("./security.server-BRG0sDb-.js");
  await writeAuditLog({
    actorId: context.userId,
    actorEmail: context.claims?.email ?? null,
    action: "ip.ban",
    targetType: "ip",
    targetId: data.ip,
    metadata: {
      reason: data.reason
    }
  });
  return {
    ok: true
  };
});
const unbanIpServerFn_createServerFn_handler = createServerRpc({
  id: "70930d746d8a8f75bd06c967d8d1fb638cee57d9c00d197d2af2221a22cccda0",
  name: "unbanIpServerFn",
  filename: "src/routes/_authenticated/admin/security.tsx"
}, (opts) => unbanIpServerFn.__executeServer(opts));
const unbanIpServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  ip: z.string().min(1)
}).parse(input)).handler(unbanIpServerFn_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    data: roleRow
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!roleRow) throw new Error("Forbidden");
  await supabaseAdmin.from("banned_ips").delete().eq("ip", data.ip);
  const {
    writeAuditLog
  } = await import("./security.server-BRG0sDb-.js");
  await writeAuditLog({
    actorId: context.userId,
    actorEmail: context.claims?.email ?? null,
    action: "ip.unban",
    targetType: "ip",
    targetId: data.ip
  });
  return {
    ok: true
  };
});
const lockUserServerFn_createServerFn_handler = createServerRpc({
  id: "4258783d4619a23f44b699b15ef558125dc21b709181a0a2aff93d15a7001a82",
  name: "lockUserServerFn",
  filename: "src/routes/_authenticated/admin/security.tsx"
}, (opts) => lockUserServerFn.__executeServer(opts));
const lockUserServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  email: z.string().email(),
  lock: z.boolean()
}).parse(input)).handler(lockUserServerFn_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    data: roleRow
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!roleRow) throw new Error("Forbidden");
  const {
    data: profile
  } = await supabaseAdmin.from("profiles").select("id").eq("email", data.email.toLowerCase()).maybeSingle();
  if (!profile) throw new Error("User profile not found");
  if (data.lock) {
    await supabaseAdmin.auth.admin.updateUserById(profile.id, {
      ban_duration: "87600h"
    });
    await supabaseAdmin.from("user_sessions").delete().eq("user_id", profile.id);
  } else {
    await supabaseAdmin.auth.admin.updateUserById(profile.id, {
      ban_duration: "none"
    });
  }
  const {
    writeAuditLog
  } = await import("./security.server-BRG0sDb-.js");
  await writeAuditLog({
    actorId: context.userId,
    actorEmail: context.claims?.email ?? null,
    action: data.lock ? "user.lock" : "user.unlock",
    targetType: "user",
    targetId: profile.id,
    metadata: {
      email: data.email
    }
  });
  return {
    ok: true
  };
});
const terminateSessionServerFn_createServerFn_handler = createServerRpc({
  id: "cff4dae90332bd1231eb60786b6d8342f9fea9ea3fd8cb8e88f0dd0b49a7b83e",
  name: "terminateSessionServerFn",
  filename: "src/routes/_authenticated/admin/security.tsx"
}, (opts) => terminateSessionServerFn.__executeServer(opts));
const terminateSessionServerFn = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => z.object({
  sessionId: z.string().uuid()
}).parse(input)).handler(terminateSessionServerFn_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.js");
  const {
    data: roleRow
  } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!roleRow) throw new Error("Forbidden");
  const {
    data: session
  } = await supabaseAdmin.from("user_sessions").select("user_id, ip_address").eq("id", data.sessionId).maybeSingle();
  if (!session) throw new Error("Session not found");
  await supabaseAdmin.from("user_sessions").delete().eq("id", data.sessionId);
  const {
    writeAuditLog
  } = await import("./security.server-BRG0sDb-.js");
  await writeAuditLog({
    actorId: context.userId,
    actorEmail: context.claims?.email ?? null,
    action: "session.terminate_admin",
    targetType: "session",
    targetId: data.sessionId,
    metadata: {
      userId: session.user_id,
      ip: session.ip_address
    }
  });
  return {
    ok: true
  };
});
export {
  adminSecurityFeed_createServerFn_handler,
  banIpServerFn_createServerFn_handler,
  exportSecurityLogs_createServerFn_handler,
  lockUserServerFn_createServerFn_handler,
  terminateSessionServerFn_createServerFn_handler,
  unbanIpServerFn_createServerFn_handler
};
