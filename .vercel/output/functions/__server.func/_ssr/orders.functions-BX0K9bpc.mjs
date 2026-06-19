import { c as createServerRpc } from "./createServerRpc-BxNuaMNd.mjs";
import { c as createServerFn, g as getRequest } from "./server-CP7xr6_V.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Bh4u3KvU.mjs";
import { o as orderNumber } from "./format-Sk5HC8SH.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, a as arrayType, n as numberType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
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
const addressSchema = objectType({
  full_name: stringType().min(1).max(120),
  phone: stringType().min(7).max(20),
  email: stringType().email().max(255),
  line1: stringType().min(1).max(200),
  line2: stringType().max(200).optional().nullable(),
  city: stringType().min(1).max(80),
  state: stringType().min(1).max(80),
  pincode: stringType().min(4).max(12),
  country: stringType().min(2).max(60).default("India")
});
const checkoutSchema = objectType({
  items: arrayType(objectType({
    productId: stringType().uuid(),
    quantity: numberType().int().min(1).max(20)
  })).min(1).max(50),
  shipping_address: addressSchema,
  idempotencyKey: stringType().min(8).max(80).regex(/^[a-zA-Z0-9_-]+$/).optional()
}).strict();
const SHIPPING_FLAT = 250;
const TAX_RATE = 0.05;
const createOrder_createServerFn_handler = createServerRpc({
  id: "7f92d135aa3763ddd5bf6d4d9f84832b6b591cbaa35dcc4048b4b1beed8e7bf3",
  name: "createOrder",
  filename: "src/lib/orders.functions.ts"
}, (opts) => createOrder.__executeServer(opts));
const createOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => checkoutSchema.parse(input)).handler(createOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    userId
  } = context;
  if (data.idempotencyKey) {
    const {
      data: existing
    } = await supabaseAdmin.from("orders").select("id, order_number, total, currency").eq("idempotency_key", data.idempotencyKey).eq("user_id", userId).maybeSingle();
    if (existing) return existing;
  }
  const ids = data.items.map((i) => i.productId);
  const {
    data: products,
    error: pErr
  } = await supabaseAdmin.from("products").select("id, name, sku, price, currency, stock, product_images(url, sort_order)").in("id", ids).eq("status", "active");
  if (pErr) throw new Error("Could not load products");
  const byId = new Map((products ?? []).map((p) => [p.id, p]));
  let subtotal = 0;
  const orderItems = data.items.map((it) => {
    const p = byId.get(it.productId);
    if (!p) throw new Error("Product unavailable");
    if (p.stock < it.quantity) throw new Error(`Insufficient stock for ${p.name}`);
    const lineTotal = Number(p.price) * it.quantity;
    subtotal += lineTotal;
    const img = (p.product_images ?? []).sort((a, b) => a.sort_order - b.sort_order)[0]?.url;
    return {
      product_id: p.id,
      name: p.name,
      sku: p.sku,
      image_url: img ?? null,
      price: p.price,
      quantity: it.quantity
    };
  });
  const shipping = subtotal >= 25e3 ? 0 : SHIPPING_FLAT;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;
  const {
    data: order,
    error: oErr
  } = await supabaseAdmin.from("orders").insert({
    user_id: userId,
    order_number: orderNumber(),
    status: "pending",
    email: data.shipping_address.email,
    phone: data.shipping_address.phone,
    subtotal,
    shipping,
    tax,
    total,
    currency: "INR",
    shipping_address: data.shipping_address,
    idempotency_key: data.idempotencyKey ?? null
  }).select("id, order_number, total, currency").single();
  if (oErr) {
    if (data.idempotencyKey && /idempotency_key/.test(oErr.message)) {
      const {
        data: existing
      } = await supabaseAdmin.from("orders").select("id, order_number, total, currency").eq("idempotency_key", data.idempotencyKey).eq("user_id", userId).maybeSingle();
      if (existing) return existing;
    }
    throw new Error("Could not create order");
  }
  const {
    error: iErr
  } = await supabaseAdmin.from("order_items").insert(orderItems.map((it) => ({
    ...it,
    order_id: order.id
  })));
  if (iErr) throw new Error(iErr.message);
  try {
    const {
      appendOrderToSheet
    } = await import("./sheets.server-iwSikOIv.mjs");
    void appendOrderToSheet(order.id).catch((e) => console.error("[sheets sync]", e));
  } catch (e) {
    console.error("[sheets sync init]", e);
  }
  return order;
});
const listMyOrders_createServerFn_handler = createServerRpc({
  id: "3265360dd1bb8505874dca36fc08c120c489507fb549e4925a945a8286e7a79a",
  name: "listMyOrders",
  filename: "src/lib/orders.functions.ts"
}, (opts) => listMyOrders.__executeServer(opts));
const listMyOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyOrders_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data,
    error
  } = await supabase.from("orders").select("id, order_number, status, total, currency, created_at").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getMyOrder_createServerFn_handler = createServerRpc({
  id: "b407145077ca1f696815c0a6843d9d3ec6cd17b486611e8fb35e8e52b34e9e73",
  name: "getMyOrder",
  filename: "src/lib/orders.functions.ts"
}, (opts) => getMyOrder.__executeServer(opts));
const getMyOrder = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(getMyOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: order,
    error
  } = await supabase.from("orders").select("id, order_number, status, total, subtotal, shipping, tax, currency, email, phone, shipping_address, awb_code, courier_name, tracking_url, created_at, order_items(*)").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  return order;
});
const trackOrder_createServerFn_handler = createServerRpc({
  id: "d74efaed9d368b50c737966712aaf37f9bc30edca8be1eed754f166b39b69dcd",
  name: "trackOrder",
  filename: "src/lib/orders.functions.ts"
}, (opts) => trackOrder.__executeServer(opts));
const trackOrder = createServerFn({
  method: "POST"
}).validator((input) => objectType({
  orderNumber: stringType().trim().min(3).max(40),
  email: stringType().trim().email().max(255)
}).parse(input)).handler(trackOrder_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    checkRateLimit,
    getClientIp
  } = await import("./security.server-BRG0sDb-.mjs");
  const req = getRequest();
  const ip = getClientIp(req) ?? "unknown";
  const rl = await checkRateLimit(`track:${ip}`, 10, 60 * 60);
  if (!rl.allowed) {
    throw new Error("Too many tracking attempts. Please try again later.");
  }
  const {
    data: order,
    error
  } = await supabaseAdmin.from("orders").select("order_number, status, created_at, awb_code, courier_name, tracking_url").eq("order_number", data.orderNumber).ilike("email", data.email).maybeSingle();
  if (error) throw new Error(error.message);
  return order;
});
export {
  createOrder_createServerFn_handler,
  getMyOrder_createServerFn_handler,
  listMyOrders_createServerFn_handler,
  trackOrder_createServerFn_handler
};
