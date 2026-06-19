// Hourly + daily security cleanup. Called by pg_cron.
//   apikey header = Supabase anon key (standard pattern, see schedule-jobs-options)
//
// Hourly: prune rate_limits + idempotency_keys
// Daily : prune login_attempts (>90d), login_events (>180d), security_events (>180d)
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/cron/cleanup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
      // SECURITY: This endpoint is protected by a dedicated secret that is NOT
      // the public anon key (which ships in the browser bundle via VITE_*).
      // Set CRON_SECRET to a strong, private random value (e.g. openssl rand -hex 64)
      // in your server environment / Cloudflare Workers secrets — never in .env source control.
      const cronSecret = request.headers.get("x-cron-secret");
      const expected = process.env.CRON_SECRET;
      if (!expected || cronSecret !== expected) {
        return new Response("Unauthorized", { status: 401 });
      }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const now = Date.now();
        const hourAgo = new Date(now - 60 * 60 * 1000).toISOString();
        const d30 = new Date(now - 30 * 86400_000).toISOString();
        const d90 = new Date(now - 90 * 86400_000).toISOString();
        const d180 = new Date(now - 180 * 86400_000).toISOString();

        const results: Record<string, number | string> = {};

        // 1. Rate limits pruning (hourly)
        const r1 = await supabaseAdmin.from("rate_limits").delete().lt("created_at", hourAgo).select("key");
        results.rate_limits = r1.error ? r1.error.message : (r1.data?.length ?? 0);

        // 2. Idempotency keys pruning
        const r2 = await supabaseAdmin.from("idempotency_keys").delete().lt("expires_at", new Date(now).toISOString()).select("key");
        results.idempotency_keys = r2.error ? r2.error.message : (r2.data?.length ?? 0);

        // 3. Purge expired token blacklist rows
        const rBlacklist = await supabaseAdmin.from("token_blacklist").delete().lt("expires_at", new Date(now).toISOString()).select("token");
        results.token_blacklist = rBlacklist.error ? rBlacklist.error.message : (rBlacklist.data?.length ?? 0);

        // 4. Purge inactive user_sessions (>30 days)
        const rSessions = await supabaseAdmin.from("user_sessions").delete().lt("last_active", d30).select("id");
        results.user_sessions = rSessions.error ? rSessions.error.message : (rSessions.data?.length ?? 0);

        // 5. Prune old logs (daily cadence)
        const r3 = await supabaseAdmin.from("login_attempts").delete().lt("created_at", d90).select("id");
        results.login_attempts = r3.error ? r3.error.message : (r3.data?.length ?? 0);

        const r4 = await supabaseAdmin.from("login_events").delete().lt("created_at", d180).select("id");
        results.login_events = r4.error ? r4.error.message : (r4.data?.length ?? 0);

        const r5 = await supabaseAdmin.from("security_events").delete().lt("created_at", d180).select("id");
        results.security_events = r5.error ? r5.error.message : (r5.data?.length ?? 0);

        // Alert administrators and prompt key/secret rotation review
        try {
          const { sendEmail } = await import("@/lib/email.server");
          const { data: adminRoles } = await supabaseAdmin
            .from("user_roles")
            .select("user_id")
            .eq("role", "admin");
          
          if (adminRoles && adminRoles.length > 0) {
            const adminIds = adminRoles.map((r) => r.user_id);
            const { data: adminProfiles } = await supabaseAdmin
              .from("profiles")
              .select("email")
              .in("id", adminIds);
            
            const adminEmails = adminProfiles?.map((p) => p.email).filter(Boolean) as string[] ?? [];
            for (const email of adminEmails) {
              await sendEmail({
                to: email,
                subject: "IRAYA Security: Automated Cleanup & Maintenance Report",
                html: `
                  <h2>Security Maintenance Complete</h2>
                  <p>The automated cleanup cron job has completed successfully. Summary of operations:</p>
                  <ul>
                    <li><strong>Pruned rate limits:</strong> ${results.rate_limits} records</li>
                    <li><strong>Pruned expired token blacklist:</strong> ${results.token_blacklist} records</li>
                    <li><strong>Pruned inactive user sessions (&gt;30 days):</strong> ${results.user_sessions} records</li>
                    <li><strong>Pruned old login attempts (&gt;90 days):</strong> ${results.login_attempts} records</li>
                    <li><strong>Pruned old login events (&gt;180 days):</strong> ${results.login_events} records</li>
                    <li><strong>Pruned old security events (&gt;180 days):</strong> ${results.security_events} records</li>
                  </ul>
                  <p><strong>Key Rotation Reminder:</strong> This is a automated reminder to audit API secrets (Supabase, Razorpay, Resend) and rotate credentials regularly to comply with security standards.</p>
                  <p>Time of execution: ${new Date(now).toUTCString()}</p>
                `,
              });
            }
          }
        } catch (err) {
          console.error("Failed to alert admin during security cleanup:", err);
        }

        return Response.json({ ok: true, deleted: results });
      },
    },
  },
});
