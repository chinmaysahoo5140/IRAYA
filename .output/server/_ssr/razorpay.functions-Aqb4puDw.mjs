import { c as createServerRpc } from "./createServerRpc-T01JzlKW.mjs";
import { c as createServerFn } from "./server-CUdO2dQu.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DBKcBFEt.mjs";
import { createHmac, timingSafeEqual } from "node:crypto";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const createRazorpayOrder_createServerFn_handler = createServerRpc({
  id: "a6f1a7df2dd032270b33ae7f01da2576971e1b7652c3d182f28f0f762ce126d4",
  name: "createRazorpayOrder",
  filename: "src/lib/razorpay.functions.ts"
}, (opts) => createRazorpayOrder.__executeServer(opts));
const createRazorpayOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  orderId: stringType().uuid()
}).parse(input)).handler(createRazorpayOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  }
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    data: order,
    error
  } = await supabaseAdmin.from("orders").select("id, order_number, total, currency, status, user_id").eq("id", data.orderId).eq("user_id", context.userId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!order) throw new Error("Order not found");
  if (order.status !== "pending") throw new Error("Order is not pending payment");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64")
    },
    body: JSON.stringify({
      amount: Math.round(Number(order.total) * 100),
      currency: order.currency,
      receipt: order.order_number,
      notes: {
        order_id: order.id
      }
    })
  });
  if (!res.ok) throw new Error(`Razorpay error: ${res.status} ${await res.text()}`);
  const rp = await res.json();
  await supabaseAdmin.from("orders").update({
    razorpay_order_id: rp.id
  }).eq("id", order.id);
  return {
    razorpayOrderId: rp.id,
    amount: rp.amount,
    currency: rp.currency,
    keyId,
    orderNumber: order.order_number
  };
});
const verifyRazorpayPayment_createServerFn_handler = createServerRpc({
  id: "5e2c6a85ce8b9f3a92cd9b0a9b4d8f015d9ec2fa0b30eb31f8605ecef9f67199",
  name: "verifyRazorpayPayment",
  filename: "src/lib/razorpay.functions.ts"
}, (opts) => verifyRazorpayPayment.__executeServer(opts));
const verifyRazorpayPayment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  orderId: stringType().uuid(),
  razorpay_order_id: stringType().min(1).max(100),
  razorpay_payment_id: stringType().min(1).max(100),
  razorpay_signature: stringType().min(1).max(200)
}).parse(input)).handler(verifyRazorpayPayment_createServerFn_handler, async ({
  data,
  context
}) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw new Error("Razorpay not configured.");
  const {
    recordPaymentEvent
  } = await import("./security.server-BRG0sDb-.mjs");
  const expected = createHmac("sha256", keySecret).update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(data.razorpay_signature);
  const ok = a.length === b.length && timingSafeEqual(a, b);
  if (!ok) {
    await recordPaymentEvent({
      provider: "razorpay",
      eventType: "client_verify_invalid_signature",
      paymentId: data.razorpay_payment_id,
      orderId: data.orderId,
      signatureValid: false
    });
    throw new Error("Invalid payment signature");
  }
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    data: order,
    error
  } = await supabaseAdmin.from("orders").update({
    status: "paid",
    razorpay_payment_id: data.razorpay_payment_id,
    razorpay_signature: data.razorpay_signature
  }).eq("id", data.orderId).eq("user_id", context.userId).eq("razorpay_order_id", data.razorpay_order_id).select("id, order_number, status").single();
  if (error) throw new Error("Could not confirm payment");
  await recordPaymentEvent({
    provider: "razorpay",
    eventType: "client_verify_success",
    paymentId: data.razorpay_payment_id,
    orderId: data.orderId,
    signatureValid: true,
    status: "paid"
  });
  return order;
});
export {
  createRazorpayOrder_createServerFn_handler,
  verifyRazorpayPayment_createServerFn_handler
};
