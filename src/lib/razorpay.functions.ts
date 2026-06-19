// Razorpay create-order + signature verification.
// Requires RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET secrets. Public key
// (VITE_RAZORPAY_KEY_ID) is also needed on the client to open Checkout.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createHmac, timingSafeEqual } from "node:crypto";

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ orderId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, total, currency, status, user_id")
      .eq("id", data.orderId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("Order not found");
    if (order.status !== "pending") throw new Error("Order is not pending payment");

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: Math.round(Number(order.total) * 100),
        currency: order.currency,
        receipt: order.order_number,
        notes: { order_id: order.id },
      }),
    });
    if (!res.ok) throw new Error(`Razorpay error: ${res.status} ${await res.text()}`);
    const rp = (await res.json()) as { id: string; amount: number; currency: string };

    await supabaseAdmin.from("orders").update({ razorpay_order_id: rp.id }).eq("id", order.id);

    return {
      razorpayOrderId: rp.id,
      amount: rp.amount,
      currency: rp.currency,
      keyId,
      orderNumber: order.order_number,
    };
  });

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        razorpay_order_id: z.string().min(1).max(100),
        razorpay_payment_id: z.string().min(1).max(100),
        razorpay_signature: z.string().min(1).max(200),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay not configured.");

    const { recordPaymentEvent } = await import("@/lib/security.server");

    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(data.razorpay_signature);
    const ok = a.length === b.length && timingSafeEqual(a, b);
    if (!ok) {
      await recordPaymentEvent({
        provider: "razorpay",
        eventType: "client_verify_invalid_signature",
        paymentId: data.razorpay_payment_id,
        orderId: data.orderId,
        signatureValid: false,
      });
      throw new Error("Invalid payment signature");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      })
      .eq("id", data.orderId)
      .eq("user_id", context.userId)
      .eq("razorpay_order_id", data.razorpay_order_id)
      .select("id, order_number, status")
      .single();
    if (error) throw new Error("Could not confirm payment");

    await recordPaymentEvent({
      provider: "razorpay",
      eventType: "client_verify_success",
      paymentId: data.razorpay_payment_id,
      orderId: data.orderId,
      signatureValid: true,
      status: "paid",
    });

    return order;
  });
