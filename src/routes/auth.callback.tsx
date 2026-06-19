import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Server function that runs the PKCE code exchange on the server and sets
// the httpOnly cookies that your auth-middleware expects.
const exchangeCodeServerFn = createServerFn({ method: "GET" })
  .validator((input: unknown) =>
    z.object({ code: z.string() }).parse(input)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getClientIp, detectDeviceType, parseUserAgent, geoLookup } = await import("@/lib/security.server");
    const { setCookie, getRequest } = await import("@tanstack/react-start/server");

    // Exchange the authorization code for a session (PKCE)
    const { data: sessionData, error } = await supabaseAdmin.auth.exchangeCodeForSession(data.code);

    if (error || !sessionData.session) {
      throw new Error(error?.message ?? "Failed to exchange code for session");
    }

    const session = sessionData.session;
    const req = getRequest();
    const ip = getClientIp(req);
    const ua = req?.headers.get("user-agent") ?? null;

    // Create a session row so the rest of the app can track device info
    const deviceType = detectDeviceType(ua);
    const { browserName, browserVersion, os } = parseUserAgent(ua);
    const { country, city } = await geoLookup(ip);

    const { data: sessionRow } = await supabaseAdmin
      .from("user_sessions")
      .insert({
        user_id: session.user.id,
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

    // Set the httpOnly cookies that requireSupabaseAuth expects
    const secure = process.env.NODE_ENV === "production";

    setCookie("sb-access-token", session.access_token, {
      httpOnly: true,
      secure,
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    setCookie("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    if (sessionRow) {
      setCookie("sb-session-id", sessionRow.id, {
        httpOnly: true,
        secure,
        sameSite: "strict",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return { ok: true };
  });

export const Route = createFileRoute("/auth/callback")({
  validateSearch: z.object({
    code: z.string().optional(),
    error: z.string().optional(),
    error_description: z.string().optional(),
  }).parse,

  beforeLoad: async ({ search }) => {
    // Handle OAuth errors from Supabase (e.g. user denied access)
    if (search.error) {
      throw redirect({
        to: "/auth",
        search: { redirect: undefined },
      });
    }

    if (!search.code) {
      // No code and no error — shouldn't normally happen. Go home.
      throw redirect({ to: "/" });
    }

    // Exchange the PKCE code for a session on the server and set cookies.
    await exchangeCodeServerFn({ data: { code: search.code } });

    throw redirect({ to: "/account" });
  },

  component: () => (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h2 className="font-serif text-2xl tracking-luxury mb-4">Completing Sign In</h2>
        <div className="animate-pulse text-xs tracking-luxury uppercase text-mute">
          Setting up your session...
        </div>
      </div>
    </div>
  ),
});

