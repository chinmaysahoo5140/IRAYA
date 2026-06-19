import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

type RazorpayWebhookBody = {
  event: string;
  payload: {
    payment?: { entity: { id: string; order_id: string; amount: number; currency: string; status: string; notes?: { order_id?: string } } };
    order?: { entity: { id: string; amount: number; currency: string; status: string; notes?: { order_id?: string } } };
  };
};

export const Route = createFileRoute("/api/razorpay/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
          console.error("[razorpay/webhook] RAZORPAY_WEBHOOK_SECRET not set");
          return new Response("Not configured", { status: 503 });
        }

        const signature = request.headers.get("x-razorpay-signature") ?? "";
        const body = await request.text();

        const expected = createHmac("sha256", secret).update(body).digest("hex");
        const sig = Buffer.from(signature);
        const exp = Buffer.from(expected);
        const ok = sig.length === exp.length && timingSafeEqual(sig, exp);

        const { recordPaymentEvent, getClientIp } = await import("@/lib/security.server");
        const ip = getClientIp(request);

        if (!ok) {
          await recordPaymentEvent({
            provider: "razorpay",
            eventType: "invalid_signature",
            signatureValid: false,
            ip,
            payload: { rawLength: body.length },
          });
          return new Response("Invalid signature", { status: 401 });
        }

        let parsed: RazorpayWebhookBody;
        try {
          parsed = JSON.parse(body) as RazorpayWebhookBody;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const payment = parsed.payload.payment?.entity;
        const order = parsed.payload.order?.entity;
        const rpOrderId = payment?.order_id ?? order?.id ?? null;
        const internalOrderId = (payment?.notes?.order_id ?? order?.notes?.order_id) ?? null;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Resolve internal order id from notes OR razorpay_order_id.
        let targetOrderId: string | null = internalOrderId ?? null;
        if (!targetOrderId && rpOrderId) {
          const { data: o } = await supabaseAdmin
            .from("orders")
            .select("id")
            .eq("razorpay_order_id", rpOrderId)
            .maybeSingle();
          targetOrderId = o?.id ?? null;
        }

        await recordPaymentEvent({
          provider: "razorpay",
          eventType: parsed.event,
          paymentId: payment?.id ?? null,
          orderId: targetOrderId,
          amount: payment?.amount ? payment.amount / 100 : (order?.amount ? order.amount / 100 : null),
          currency: payment?.currency ?? order?.currency ?? null,
          status: payment?.status ?? order?.status ?? null,
          signatureValid: true,
          ip,
          payload: parsed as unknown,
        });

        // Idempotent payment confirmation: check if payment_id has already been used on another order.
        if ((parsed.event === "payment.captured" || parsed.event === "order.paid") && payment) {
          if (payment.id) {
            const { data: existingOrder } = await supabaseAdmin
              .from("orders")
              .select("id, status")
              .eq("razorpay_payment_id", payment.id)
              .maybeSingle();

            if (existingOrder) {
              if (existingOrder.id !== targetOrderId) {
                // Critical security incident: payment ID reuse/sharing attack
                const { writeSecurityEvent } = await import("@/lib/security.server");
                await writeSecurityEvent({
                  eventType: "payment_id_reuse_detected",
                  severity: "critical",
                  ip,
                  details: {
                    paymentId: payment.id,
                    targetOrderId,
                    originalOrderId: existingOrder.id,
                  },
                });
                return new Response("Payment ID already used", { status: 400 });
              }
              // If it is the same order, it's just a duplicate webhook delivery.
              return new Response("ok", { status: 200 });
            }
          }

          if (targetOrderId) {
            await supabaseAdmin
              .from("orders")
              .update({
                status: "paid",
                razorpay_payment_id: payment.id,
                razorpay_order_id: payment.order_id,
              })
              .eq("id", targetOrderId)
              .neq("status", "paid"); // don't double-update
          }
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
