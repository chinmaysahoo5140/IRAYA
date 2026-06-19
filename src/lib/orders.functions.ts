import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { orderNumber } from "./format";

const addressSchema = z.object({
  full_name: z.string().min(1).max(120),
  phone: z.string().min(7).max(20),
  email: z.string().email().max(255),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional().nullable(),
  city: z.string().min(1).max(80),
  state: z.string().min(1).max(80),
  pincode: z.string().min(4).max(12),
  country: z.string().min(2).max(60).default("India"),
});

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(50),
  shipping_address: addressSchema,
  idempotencyKey: z.string().min(8).max(80).regex(/^[a-zA-Z0-9_-]+$/).optional(),
}).strict();

const SHIPPING_FLAT = 250; // ₹250 flat domestic ship; free over ₹25000
const TAX_RATE = 0.05; // 5% GST placeholder

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => checkoutSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context;

    // Idempotency: if the same key already produced an order, return it.
    if (data.idempotencyKey) {
      const { data: existing } = await supabaseAdmin
        .from("orders")
        .select("id, order_number, total, currency")
        .eq("idempotency_key", data.idempotencyKey)
        .eq("user_id", userId)
        .maybeSingle();
      if (existing) return existing;
    }

    const ids = data.items.map((i) => i.productId);
    const { data: products, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, name, sku, price, currency, stock, product_images(url, sort_order)")
      .in("id", ids)
      .eq("status", "active");
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
        quantity: it.quantity,
      };
    });

    const shipping = subtotal >= 25000 ? 0 : SHIPPING_FLAT;
    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + shipping + tax;

    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .insert({
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
        idempotency_key: data.idempotencyKey ?? null,
      })
      .select("id, order_number, total, currency")
      .single();
    if (oErr) {
      // Race on idempotency_key: re-read.
      if (data.idempotencyKey && /idempotency_key/.test(oErr.message)) {
        const { data: existing } = await supabaseAdmin
          .from("orders")
          .select("id, order_number, total, currency")
          .eq("idempotency_key", data.idempotencyKey)
          .eq("user_id", userId)
          .maybeSingle();
        if (existing) return existing;
      }
      throw new Error("Could not create order");
    }

    const { error: iErr } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems.map((it) => ({ ...it, order_id: order.id })));
    if (iErr) throw new Error(iErr.message);

    // Fire-and-forget Sheets sync. Never blocks order placement.
    try {
      const { appendOrderToSheet } = await import("./sheets.server");
      void appendOrderToSheet(order.id).catch((e: unknown) => console.error("[sheets sync]", e));
    } catch (e) {
      console.error("[sheets sync init]", e);
    }

    return order;
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, status, total, currency, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMyOrder = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        "id, order_number, status, total, subtotal, shipping, tax, currency, email, phone, shipping_address, awb_code, courier_name, tracking_url, created_at, order_items(*)",
      )
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return order;
  });


export const trackOrder = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        orderNumber: z.string().trim().min(3).max(40),
        email: z.string().trim().email().max(255),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { checkRateLimit, getClientIp } = await import("@/lib/security.server");
    const req = getRequest();
    const ip = getClientIp(req) ?? "unknown";

    // Rate-limit: 10 track attempts per IP per hour.
    // Without this a scanner can enumerate all order numbers to harvest shipping addresses.
    const rl = await checkRateLimit(`track:${ip}`, 10, 60 * 60);
    if (!rl.allowed) {
      throw new Error("Too many tracking attempts. Please try again later.");
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("order_number, status, created_at, awb_code, courier_name, tracking_url")
      .eq("order_number", data.orderNumber)
      .ilike("email", data.email)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return order;
  });

