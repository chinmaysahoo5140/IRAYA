import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/send-otp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { getTwilioClient, getVerifyServiceSid } = await import(/* @vite-ignore */ "@/lib/twilio");
          const { getClientIp, checkRateLimit } = await import("@/lib/security.server");

          let body;
          try {
            body = await request.json();
          } catch {
            return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
          }

          const { phone } = body;

          // 1. Validate phone number format (E.164 format: e.g. +1234567890)
          const E164_REGEX = /^\+[1-9]\d{1,14}$/;
          if (!phone || !E164_REGEX.test(phone)) {
            return Response.json(
              { error: "Invalid phone number format. Must be E.164 format (e.g. +1234567890)." },
              { status: 400 }
            );
          }

          // 2. Rate limiting (e.g., max 3 OTP requests per 10 minutes per phone number)
          const limitKey = `otp:send:${phone}`;
          const rl = await checkRateLimit(limitKey, 3, 600);
          if (!rl.allowed) {
            return Response.json(
              { error: "Too many OTP requests. Please try again in 10 minutes." },
              { status: 429 }
            );
          }

          // 3. Request verification from Twilio
          const twilioClient = getTwilioClient();
          const verifyServiceSid = getVerifyServiceSid();
          const verification = await twilioClient.verify.v2
            .services(verifyServiceSid)
            .verifications.create({ to: phone, channel: "sms" });

          return Response.json({ success: true, sid: verification.sid });
        } catch (err: any) {
          console.error("Twilio send-otp error:", err);
          return Response.json(
            { error: err?.message || "Failed to send verification code." },
            { status: err?.status || 500 }
          );
        }
      },
    },
  },
});
