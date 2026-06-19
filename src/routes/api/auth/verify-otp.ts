import { createFileRoute } from "@tanstack/react-router";
import crypto from "node:crypto";

export const Route = createFileRoute("/api/auth/verify-otp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { twilioClient, TWILIO_VERIFY_SERVICE_SID } = await import(/* @vite-ignore */ "@/lib/twilio");
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const {
            getClientIp,
            detectDeviceType,
            parseUserAgent,
            geoLookup,
            writeSecurityEvent,
          } = await import("@/lib/security.server");

          let body;
          try {
            body = await request.json();
          } catch {
            return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
          }

          const { phone, code } = body;

          if (!phone || !code) {
            return Response.json({ error: "Phone number and code are required." }, { status: 400 });
          }

          // 1. Verify OTP via Twilio
          let verificationCheck;
          try {
            verificationCheck = await twilioClient.verify.v2
              .services(TWILIO_VERIFY_SERVICE_SID)
              .verificationChecks.create({ to: phone, code });
          } catch (twilioErr: any) {
            console.error("Twilio check error:", twilioErr);
            return Response.json(
              { error: twilioErr?.message || "Verification code check failed." },
              { status: twilioErr?.status || 400 }
            );
          }

          if (verificationCheck.status !== "approved") {
            return Response.json({ error: "Invalid or expired verification code." }, { status: 400 });
          }

          // 2. Generate a strong, temporary, random secure password for the session handshake
          const tempSecurePassword = crypto.randomUUID() + "-" + crypto.randomBytes(16).toString("hex") + "A1!";

          // 3. Check if user already exists in profiles
          const { data: profile, error: profileErr } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("phone", phone)
            .maybeSingle();

          let userId: string;

          if (profile && profile.id) {
            userId = profile.id;
            // Update user password to our temporary password to perform authentication handshake
            const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
              password: tempSecurePassword,
            });
            if (updateErr) {
              console.error("Failed to update user password for OTP handshake:", updateErr);
              throw new Error("Internal server error during session initialization.");
            }
          } else {
            // Create user in Supabase
            const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
              phone,
              password: tempSecurePassword,
              phone_confirm: true,
              user_metadata: { full_name: "Valued Customer" },
            });

            if (createErr || !newUser.user) {
              console.error("Failed to create user in Supabase:", createErr);
              throw new Error(createErr?.message || "Failed to initialize user profile.");
            }
            userId = newUser.user.id;
          }

          // 4. Authenticate using Supabase with phone + temporary password
          const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            phone,
            password: tempSecurePassword,
          });

          if (authError || !authData.user || !authData.session) {
            console.error("Failed to sign in with password after handshake:", authError);
            throw new Error("Authentication handshake failed.");
          }

          // 5. Gather request context for session tracking
          const ip = getClientIp(request);
          const ua = request.headers.get("user-agent") ?? null;
          const deviceType = detectDeviceType(ua);
          const { browserName, browserVersion, os } = parseUserAgent(ua);
          const { country, city } = await geoLookup(ip);

          // 6. Create session in user_sessions table
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

          if (sessionErr || !sessionRow) {
            console.error("Could not initialize session row in database:", sessionErr);
            throw new Error("Could not initialize user session.");
          }

          // 7. Write security event
          await writeSecurityEvent({
            userId,
            eventType: "phone_otp_login",
            severity: "info",
            ip,
            userAgent: ua,
          });

          // 8. Construct response and set secure cookies
          const headers = new Headers();
          const secure = process.env.NODE_ENV === "production" ? "Secure;" : "";
          headers.append(
            "Set-Cookie",
            `sb-access-token=${authData.session.access_token}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=900`
          );
          headers.append(
            "Set-Cookie",
            `sb-refresh-token=${authData.session.refresh_token}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=604800`
          );
          headers.append(
            "Set-Cookie",
            `sb-session-id=${sessionRow.id}; HttpOnly; ${secure} SameSite=Strict; Path=/; Max-Age=2592000`
          );

          // Rotates password once more to ensure the temp secure password cannot be reused
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: crypto.randomUUID() + "-" + crypto.randomBytes(16).toString("hex") + "A2!",
          });

          return new Response(JSON.stringify({ success: true, user: authData.user }), {
            headers,
          });
        } catch (err: any) {
          console.error("verify-otp handler error:", err);
          return Response.json({ error: err?.message || "Internal server error." }, { status: 500 });
        }
      },
    },
  },
});
