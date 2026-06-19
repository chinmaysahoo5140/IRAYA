// Client-callable security server fns. Logic lives in security.server.ts.
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const emailInput = z.object({ email: z.string().email().max(254) });
const attemptInput = z.object({
  email: z.string().email().max(254),
  success: z.boolean(),
  userId: z.string().uuid().optional().nullable(),
});

export const precheckLogin = createServerFn({ method: "POST" })
  .validator((input: unknown) => emailInput.parse(input))
  .handler(async ({ data }) => {
    const { checkRateLimit, isAccountLocked, getClientIp, isBlockedUserAgent, writeSecurityEvent } =
      await import("@/lib/security.server");
    const req = getRequest();
    const ip = getClientIp(req) ?? "unknown";
    const ua = req?.headers.get("user-agent") ?? null;

    if (isBlockedUserAgent(ua)) {
      await writeSecurityEvent({
        email: data.email,
        eventType: "blocked_user_agent",
        severity: "warning",
        ip,
        userAgent: ua,
      });
      return { allowed: false, reason: "Request blocked." };
    }

    const rl = await checkRateLimit(`login:${ip}`, 5, 15 * 60);
    if (!rl.allowed) {
      await writeSecurityEvent({
        email: data.email,
        eventType: "rate_limit_login",
        severity: "warning",
        ip,
        userAgent: ua,
      });
      return { allowed: false, reason: "Too many sign-in attempts. Please try again in 15 minutes." };
    }
    if (await isAccountLocked(data.email)) {
      await writeSecurityEvent({
        email: data.email,
        eventType: "account_locked",
        severity: "warning",
        ip,
        userAgent: ua,
      });
      return { allowed: false, reason: "Account temporarily locked after repeated failures. Try again in 30 minutes." };
    }
    return { allowed: true };
  });

export const recordLogin = createServerFn({ method: "POST" })
  .validator((input: unknown) => attemptInput.parse(input))
  .handler(async ({ data }) => {
    const { recordLoginAttempt, recordLoginEvent, getClientIp } = await import("@/lib/security.server");
    const req = getRequest();
    const ip = getClientIp(req);
    const ua = req?.headers.get("user-agent") ?? null;

    await recordLoginAttempt(data.email, data.success, ip, ua);

    let isNewDevice = false;
    if (data.success) {
      const r = await recordLoginEvent({
        userId: data.userId ?? null,
        email: data.email,
        ip,
        userAgent: ua,
      });
      isNewDevice = r.isNewDevice;
    }
    return { ok: true, isNewDevice };
  });

export const precheckSignup = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({}).parse(input ?? {}))
  .handler(async () => {
    const { checkRateLimit, getClientIp, isBlockedUserAgent } = await import("@/lib/security.server");
    const req = getRequest();
    const ip = getClientIp(req) ?? "unknown";
    const ua = req?.headers.get("user-agent") ?? null;
    if (isBlockedUserAgent(ua)) return { allowed: false, reason: "Request blocked." };
    const rl = await checkRateLimit(`signup:${ip}`, 3, 60 * 60);
    if (!rl.allowed) {
      return { allowed: false, reason: "Too many sign-ups from this network. Please try again later." };
    }
    return { allowed: true };
  });

// User-facing read of their own recent login history.
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listMyLoginEvents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("login_events")
      .select("ip, country, city, user_agent, device_type, is_new_device, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(20);
    return data ?? [];
  });
