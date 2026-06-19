// Admin security dashboard: live feed of login attempts, security events,
// payment events, top offending IPs.
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { useState } from "react";

// Feed query function
const adminSecurityFeed = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden");

    const [attempts, events, payments, bannedIps, activeSessions, profiles] = await Promise.all([
      supabaseAdmin
        .from("login_attempts")
        .select("email, success, ip, user_agent, created_at")
        .order("created_at", { ascending: false })
        .limit(40),
      supabaseAdmin
        .from("security_events")
        .select("event_type, severity, email, ip, country, created_at, details")
        .order("created_at", { ascending: false })
        .limit(40),
      supabaseAdmin
        .from("payment_events")
        .select("provider, event_type, payment_id, amount, currency, signature_valid, created_at")
        .order("created_at", { ascending: false })
        .limit(20),
      supabaseAdmin
        .from("banned_ips")
        .select("ip, reason, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
      supabaseAdmin
        .from("user_sessions")
        .select("id, user_id, ip_address, device_type, browser_name, os, country, city, created_at")
        .order("created_at", { ascending: false })
        .limit(20),
      supabaseAdmin
        .from("profiles")
        .select("id, email"),
    ]);

    // Compute top failing IPs in JS (no RPC needed).
    const ipCounts = new Map<string, number>();
    (attempts.data ?? []).forEach((a: { success: boolean; ip: string | null }) => {
      if (a.success || !a.ip) return;
      ipCounts.set(a.ip, (ipCounts.get(a.ip) ?? 0) + 1);
    });
    const topIps = Array.from(ipCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));

    const emailMap = new Map(profiles.data?.map((p) => [p.id, p.email]) ?? []);
    const sessionsWithEmails = (activeSessions.data ?? []).map((s) => ({
      ...s,
      email: emailMap.get(s.user_id) ?? "unknown",
    }));

    return {
      attempts: attempts.data ?? [],
      events: events.data ?? [],
      payments: payments.data ?? [],
      bannedIps: bannedIps.data ?? [],
      activeSessions: sessionsWithEmails,
      topIps,
    };
  });

// CSV Export server function
const exportSecurityLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden");

    const { data: events } = await supabaseAdmin
      .from("security_events")
      .select("created_at, event_type, severity, email, ip, country, user_agent, details")
      .order("created_at", { ascending: false })
      .limit(1000);

    return events ?? [];
  });

// Admin management server functions
const banIpServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z.object({ ip: z.string().min(1), reason: z.string().optional() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden");

    await supabaseAdmin.from("banned_ips").upsert({
      ip: data.ip,
      reason: data.reason ?? "Manual ban by administrator",
    });

    const { writeAuditLog } = await import("@/lib/security.server");
    await writeAuditLog({
      actorId: context.userId,
      actorEmail: context.claims?.email ?? null,
      action: "ip.ban",
      targetType: "ip",
      targetId: data.ip,
      metadata: { reason: data.reason },
    });

    return { ok: true };
  });

const unbanIpServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ ip: z.string().min(1) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden");

    await supabaseAdmin.from("banned_ips").delete().eq("ip", data.ip);

    const { writeAuditLog } = await import("@/lib/security.server");
    await writeAuditLog({
      actorId: context.userId,
      actorEmail: context.claims?.email ?? null,
      action: "ip.unban",
      targetType: "ip",
      targetId: data.ip,
    });

    return { ok: true };
  });

const lockUserServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ email: z.string().email(), lock: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden");

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", data.email.toLowerCase())
      .maybeSingle();

    if (!profile) throw new Error("User profile not found");

    if (data.lock) {
      await supabaseAdmin.auth.admin.updateUserById(profile.id, {
        ban_duration: "87600h",
      });
      await supabaseAdmin.from("user_sessions").delete().eq("user_id", profile.id);
    } else {
      await supabaseAdmin.auth.admin.updateUserById(profile.id, {
        ban_duration: "none",
      });
    }

    const { writeAuditLog } = await import("@/lib/security.server");
    await writeAuditLog({
      actorId: context.userId,
      actorEmail: context.claims?.email ?? null,
      action: data.lock ? "user.lock" : "user.unlock",
      targetType: "user",
      targetId: profile.id,
      metadata: { email: data.email },
    });

    return { ok: true };
  });

const terminateSessionServerFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ sessionId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden");

    const { data: session } = await supabaseAdmin
      .from("user_sessions")
      .select("user_id, ip_address")
      .eq("id", data.sessionId)
      .maybeSingle();

    if (!session) throw new Error("Session not found");

    await supabaseAdmin.from("user_sessions").delete().eq("id", data.sessionId);

    const { writeAuditLog } = await import("@/lib/security.server");
    await writeAuditLog({
      actorId: context.userId,
      actorEmail: context.claims?.email ?? null,
      action: "session.terminate_admin",
      targetType: "session",
      targetId: data.sessionId,
      metadata: { userId: session.user_id, ip: session.ip_address },
    });

    return { ok: true };
  });

export const Route = createFileRoute("/_authenticated/admin/security")({
  head: () => ({ meta: [{ title: "Security — Admin" }] }),
  component: SecurityPage,
});

function SecurityPage() {
  const fetchFeed = useServerFn(adminSecurityFeed);
  const fetchCsv = useServerFn(exportSecurityLogs);
  const banIp = useServerFn(banIpServerFn);
  const unbanIp = useServerFn(unbanIpServerFn);
  const lockUser = useServerFn(lockUserServerFn);
  const terminateSession = useServerFn(terminateSessionServerFn);

  const queryClient = useQueryClient();

  const [banFormIp, setBanFormIp] = useState("");
  const [banFormReason, setBanFormReason] = useState("");
  const [lockEmail, setLockEmail] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-security"],
    queryFn: () => fetchFeed(),
    refetchInterval: 15_000,
  });

  const banMutation = useMutation({
    mutationFn: banIp,
    onSuccess: () => {
      setBanFormIp("");
      setBanFormReason("");
      queryClient.invalidateQueries({ queryKey: ["admin-security"] });
    },
    onError: (err: any) => alert(err.message ?? "Failed to ban IP"),
  });

  const unbanMutation = useMutation({
    mutationFn: unbanIp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-security"] });
    },
    onError: (err: any) => alert(err.message ?? "Failed to unban IP"),
  });

  const lockMutation = useMutation({
    mutationFn: lockUser,
    onSuccess: () => {
      setLockEmail("");
      alert("User status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-security"] });
    },
    onError: (err: any) => alert(err.message ?? "Failed to update user lock status"),
  });

  const terminateMutation = useMutation({
    mutationFn: terminateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-security"] });
    },
    onError: (err: any) => alert(err.message ?? "Failed to terminate session"),
  });

  const handleExport = async () => {
    try {
      const logs = await fetchCsv();
      const headers = ["Timestamp", "Event Type", "Severity", "Email", "IP", "Country", "User Agent", "Details"];
      const csvRows = [headers.join(",")];
      logs.forEach((e) => {
        csvRows.push(
          [
            e.created_at,
            e.event_type,
            e.severity,
            `"${e.email ?? ""}"`,
            e.ip ?? "",
            e.country ?? "",
            `"${(e.user_agent ?? "").replace(/"/g, '""')}"`,
            `"${JSON.stringify(e.details ?? {}).replace(/"/g, '""')}"`,
          ].join(",")
        );
      });
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", `security_logs_${new Date().toISOString().slice(0, 10)}.csv`);
      a.click();
    } catch (err) {
      alert("Failed to export logs");
    }
  };

  if (isLoading || !data) {
    return <div className="text-mute">Loading security feed…</div>;
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="font-serif text-4xl tracking-luxury mb-2">Security Hardening</h1>
          <p className="text-mute text-sm">Live security feed refreshes every 15 seconds.</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-luxury px-6 py-3 transition-colors"
        >
          Export Logs to CSV
        </button>
      </div>

      {/* Control Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Account Locks */}
        <Panel title="User Account Lockout Controls">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (confirm(`Are you sure you want to change lock status for ${lockEmail}?`)) {
                lockMutation.mutate({ data: { email: lockEmail, lock: true } });
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-mute mb-1">
                User Email
              </label>
              <input
                type="email"
                required
                value={lockEmail}
                onChange={(e) => setLockEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-white border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-red-700 hover:bg-red-800 text-white text-xs uppercase tracking-luxury px-4 py-2"
              >
                Lock Account
              </button>
              <button
                type="button"
                onClick={() => {
                  if (lockEmail) {
                    lockMutation.mutate({ data: { email: lockEmail, lock: false } });
                  }
                }}
                className="bg-neutral-800 hover:bg-black text-white text-xs uppercase tracking-luxury px-4 py-2"
              >
                Unlock Account
              </button>
            </div>
          </form>
        </Panel>

        {/* IP Banning */}
        <Panel title="Manually Ban IP Address">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              banMutation.mutate({ data: { ip: banFormIp, reason: banFormReason } });
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-mute mb-1">
                IP Address
              </label>
              <input
                type="text"
                required
                value={banFormIp}
                onChange={(e) => setBanFormIp(e.target.value)}
                placeholder="192.168.1.1"
                className="w-full bg-white border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-mute mb-1">
                Reason
              </label>
              <input
                type="text"
                value={banFormReason}
                onChange={(e) => setBanFormReason(e.target.value)}
                placeholder="Suspicious repeated automated hits"
                className="w-full bg-white border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white hover:bg-neutral-800 text-xs uppercase tracking-luxury px-4 py-2"
            >
              Add IP Ban
            </button>
          </form>
        </Panel>
      </div>

      {/* Active User Sessions */}
      <Panel title={`Active User Sessions (${data.activeSessions.length})`}>
        {data.activeSessions.length === 0 ? (
          <Empty>No active sessions tracked.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] tracking-luxury uppercase text-mute">
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2">User Email</th>
                  <th className="text-left py-2">IP</th>
                  <th className="text-left py-2">Device / OS</th>
                  <th className="text-left py-2">Location</th>
                  <th className="text-right py-2">Revoke</th>
                </tr>
              </thead>
              <tbody>
                {data.activeSessions.map((s) => (
                  <tr key={s.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="py-2 pr-2 font-mono text-xs">{s.email}</td>
                    <td className="py-2 pr-2 font-mono text-xs">{s.ip_address ?? "—"}</td>
                    <td className="py-2 pr-2 text-xs">
                      {s.device_type} · {s.os} ({s.browser_name})
                    </td>
                    <td className="py-2 pr-2 text-xs">
                      {s.city ? `${s.city}, ${s.country}` : s.country ?? "—"}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Revoke session for ${s.email}?`)) {
                            terminateMutation.mutate({ data: { sessionId: s.id } });
                          }
                        }}
                        className="text-red-700 hover:text-red-900 text-xs uppercase tracking-wider"
                      >
                        Terminate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Banned IPs List */}
      <Panel title={`Currently Banned IPs (${data.bannedIps.length})`}>
        {data.bannedIps.length === 0 ? (
          <Empty>No IPs are currently banned.</Empty>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-luxury uppercase text-mute">
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2">IP</th>
                <th className="text-left py-2">Reason</th>
                <th className="text-left py-2">Banned At</th>
                <th className="text-right py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.bannedIps.map((b) => (
                <tr key={b.ip} className="border-b border-neutral-100">
                  <td className="py-2 font-mono text-xs">{b.ip}</td>
                  <td className="py-2 text-xs">{b.reason ?? "—"}</td>
                  <td className="py-2 text-mute text-xs">{new Date(b.created_at).toLocaleString()}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Lift ban for IP ${b.ip}?`)) {
                          unbanMutation.mutate({ data: { ip: b.ip } });
                        }
                      }}
                      className="text-green-700 hover:text-green-900 text-xs uppercase tracking-wider"
                    >
                      Unban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {/* Top Offending IPs */}
      <Panel title={`Top Offending IPs (${data.topIps.length})`}>
        {data.topIps.length === 0 ? (
          <Empty>No failed attempts in the last 40 records.</Empty>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-luxury uppercase text-mute">
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2">IP</th>
                <th className="text-left py-2">Failed attempts</th>
                <th className="text-right py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.topIps.map((r) => (
                <tr key={r.ip} className="border-b border-neutral-100">
                  <td className="py-2 font-mono">{r.ip}</td>
                  <td className="py-2">{r.count}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => {
                        setBanFormIp(r.ip);
                        setBanFormReason("Too many failed login attempts");
                      }}
                      className="bg-black text-white hover:bg-neutral-800 text-[10px] uppercase tracking-wider px-3 py-1 transition-colors"
                    >
                      Ban IP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {/* Security Events List */}
      <Panel title="Recent Security Events">
        {data.events.length === 0 ? (
          <Empty>No events.</Empty>
        ) : (
          <ul className="space-y-2 text-sm">
            {data.events.map(
              (
                e: {
                  severity: string;
                  event_type: string;
                  email: string | null;
                  ip: string | null;
                  country: string | null;
                  created_at: string;
                },
                i: number
              ) => (
                <li key={i} className="border-b border-neutral-100 pb-2 pt-2 flex gap-4 items-baseline">
                  <span
                    className={`text-[10px] uppercase tracking-luxury px-2 py-0.5 ${
                      e.severity === "critical"
                        ? "bg-red-100 text-red-800"
                        : e.severity === "warning"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-neutral-100 text-neutral-800"
                    }`}
                  >
                    {e.severity}
                  </span>
                  <span className="font-mono text-xs">{e.event_type}</span>
                  <span className="text-mute text-xs">{e.email ?? "—"}</span>
                  <span className="text-mute text-xs">
                    {e.ip ?? "—"}
                    {e.country ? ` · ${e.country}` : ""}
                  </span>
                  <span className="ml-auto text-mute text-xs">
                    {new Date(e.created_at).toLocaleString()}
                  </span>
                </li>
              )
            )}
          </ul>
        )}
      </Panel>

      {/* Login Attempts List */}
      <Panel title="Recent Login Attempts">
        {data.attempts.length === 0 ? (
          <Empty>No attempts yet.</Empty>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-luxury uppercase text-mute">
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Result</th>
                <th className="text-left py-2">IP</th>
                <th className="text-right py-2">When</th>
              </tr>
            </thead>
            <tbody>
              {data.attempts.map(
                (
                  a: { email: string; success: boolean; ip: string | null; created_at: string },
                  i: number
                ) => (
                  <tr key={i} className="border-b border-neutral-100">
                    <td className="py-2">{a.email}</td>
                    <td className="py-2">
                      <span className={a.success ? "text-green-700" : "text-red-700"}>
                        {a.success ? "success" : "failed"}
                      </span>
                    </td>
                    <td className="py-2 font-mono text-xs">{a.ip ?? "—"}</td>
                    <td className="py-2 text-right text-mute text-xs">
                      {new Date(a.created_at).toLocaleString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </Panel>

      {/* Payment Events List */}
      <Panel title="Recent Payment Events">
        {data.payments.length === 0 ? (
          <Empty>No payment events yet. Configure the Razorpay webhook to populate this.</Empty>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-luxury uppercase text-mute">
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2">Event</th>
                <th className="text-left py-2">Payment ID</th>
                <th className="text-right py-2">Amount</th>
                <th className="text-left py-2 pl-4">Sig</th>
                <th className="text-right py-2">When</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map(
                (
                  p: {
                    event_type: string;
                    payment_id: string | null;
                    amount: number | null;
                    currency: string | null;
                    signature_valid: boolean | null;
                    created_at: string;
                  },
                  i: number
                ) => (
                  <tr key={i} className="border-b border-neutral-100">
                    <td className="py-2 font-mono text-xs">{p.event_type}</td>
                    <td className="py-2 font-mono text-xs">{p.payment_id ?? "—"}</td>
                    <td className="py-2 text-right">
                      {p.amount ? `${p.currency} ${p.amount}` : "—"}
                    </td>
                    <td className="py-2 pl-4">
                      {p.signature_valid === false ? "❌" : p.signature_valid === true ? "✅" : "—"}
                    </td>
                    <td className="py-2 text-right text-mute text-xs">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-neutral-50 border border-neutral-200 p-6 transition-all hover:shadow-sm">
      <h2 className="font-serif text-xl mb-4 tracking-luxury border-b border-neutral-200 pb-2">{title}</h2>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-mute text-sm">{children}</p>;
}
