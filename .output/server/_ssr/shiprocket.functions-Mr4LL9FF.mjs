import { c as createServerRpc } from "./createServerRpc-T01JzlKW.mjs";
import { c as createServerFn } from "./server-CUdO2dQu.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DBKcBFEt.mjs";
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
async function getToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (!email || !password) throw new Error("Shiprocket not configured.");
  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });
  if (!res.ok) throw new Error(`Shiprocket auth failed: ${res.status}`);
  const j = await res.json();
  return j.token;
}
const createShiprocketShipment_createServerFn_handler = createServerRpc({
  id: "75138d6bbf1699872b76cc40857535b1861c176f2f123a4c54f31bbad1ef836e",
  name: "createShiprocketShipment",
  filename: "src/lib/shiprocket.functions.ts"
}, (opts) => createShiprocketShipment.__executeServer(opts));
const createShiprocketShipment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  orderId: stringType().uuid()
}).parse(input)).handler(createShiprocketShipment_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    data: roleRow
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!roleRow) throw new Error("Forbidden: admin role required");
  const {
    data: order,
    error
  } = await supabaseAdmin.from("orders").select("*, order_items(*)").eq("id", data.orderId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!order) throw new Error("Order not found");
  const token = await getToken();
  const addr = order.shipping_address;
  const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      order_id: order.order_number,
      order_date: new Date(order.created_at).toISOString().slice(0, 10),
      pickup_location: "Primary",
      billing_customer_name: addr.full_name,
      billing_address: addr.line1,
      billing_address_2: addr.line2 ?? "",
      billing_city: addr.city,
      billing_pincode: addr.pincode,
      billing_state: addr.state,
      billing_country: addr.country,
      billing_email: addr.email,
      billing_phone: addr.phone,
      shipping_is_billing: true,
      order_items: order.order_items.map((it) => ({
        name: it.name,
        sku: it.sku ?? `IRY-${it.product_id.slice(0, 8)}`,
        units: it.quantity,
        selling_price: it.price
      })),
      payment_method: "Prepaid",
      sub_total: order.subtotal,
      length: 30,
      breadth: 25,
      height: 5,
      weight: 0.5
    })
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Shiprocket create failed: ${JSON.stringify(body)}`);
  const sr = body;
  await supabaseAdmin.from("orders").update({
    shiprocket_order_id: String(sr.order_id),
    shiprocket_shipment_id: String(sr.shipment_id),
    awb_code: sr.awb_code ?? null,
    status: "processing"
  }).eq("id", order.id);
  return {
    ok: true,
    shipment_id: sr.shipment_id,
    awb: sr.awb_code
  };
});
export {
  createShiprocketShipment_createServerFn_handler
};
