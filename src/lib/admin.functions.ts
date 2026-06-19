// Admin-only server fns. Every handler re-checks has_role(admin) via supabaseAdmin
// before performing any write, and writes an audit log entry.
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

async function audit(
  userId: string,
  action: string,
  targetType: string | null,
  targetId: string | null,
  metadata?: Record<string, unknown>,
) {
  const { writeAuditLog, getClientIp } = await import("@/lib/security.server");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const req = getRequest();
  const { data: u } = await supabaseAdmin.auth.admin.getUserById(userId);
  await writeAuditLog({
    actorId: userId,
    actorEmail: u?.user?.email ?? null,
    action,
    targetType,
    targetId,
    ip: getClientIp(req),
    metadata: metadata ?? null,
  });
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, slug, name, description, price, discount_price, stock, status, featured, created_at, category_id, categories(name,slug), product_images(url, sort_order)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const productInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(160),
  category_slug: z.enum(["bags", "footwear"]),
  description: z.string().max(4000).optional().default(""),
  price: z.number().min(0).max(10_000_000),
  discount_price: z.number().min(0).max(10_000_000).nullable().optional(),
  stock: z.number().int().min(0).max(100000),
  status: z.enum(["draft", "active", "archived"]).default("active"),
  variants: z.string().max(400).optional().default(""), // comma-separated sizes
  images: z.array(z.string().min(1)).max(8).default([]), // storage paths
});

export const adminUpsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => productInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // resolve category
    const { data: cat, error: cErr } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("slug", data.category_slug)
      .single();
    if (cErr || !cat) throw new Error("Invalid category");

    const slug = data.id ? undefined : `${slugify(data.name)}-${Math.random().toString(36).slice(2, 7)}`;

    const row = {
      name: data.name,
      description: data.description,
      price: data.price,
      discount_price: data.discount_price ?? null,
      stock: data.stock,
      status: data.status,
      category_id: cat.id,
      currency: "INR",
    };

    let productId: string;
    if (data.id) {
      const { error } = await supabaseAdmin.from("products").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
      productId = data.id;
    } else {
      const { data: ins, error } = await supabaseAdmin
        .from("products")
        .insert({ ...row, slug: slug! })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      productId = ins.id;
    }

    // Replace images
    if (data.images.length > 0) {
      await supabaseAdmin.from("product_images").delete().eq("product_id", productId);
      const imgRows = data.images.map((url, i) => ({
        product_id: productId,
        url,
        sort_order: i,
        alt: data.name,
      }));
      const { error } = await supabaseAdmin.from("product_images").insert(imgRows);
      if (error) throw new Error(error.message);
    }

    // Replace variants
    await supabaseAdmin.from("product_variants").delete().eq("product_id", productId);
    if (data.variants.trim().length > 0) {
      const names = data.variants.split(",").map((s) => s.trim()).filter(Boolean);
      const vRows = names.map((name, i) => ({
        product_id: productId,
        name,
        sort_order: i,
        stock: 0,
      }));
      if (vRows.length > 0) await supabaseAdmin.from("product_variants").insert(vRows);
    }

    await audit(context.userId, data.id ? "product.update" : "product.create", "product", productId, { name: data.name });
    return { id: productId };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.userId, "product.delete", "product", data.id);
    return { ok: true };
  });

// Sign a storage path so admin UI can preview images
export const adminSignImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => z.object({ path: z.string().min(1).max(500) }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed } = await supabaseAdmin.storage
      .from("product-images")
      .createSignedUrl(data.path, 60 * 60 * 24 * 7);
    return { url: signed?.signedUrl ?? null };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, status, total, currency, email, phone, shipping_address, awb_code, courier_name, tracking_url, created_at, order_items(name, quantity, price)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]),
        awb_code: z.string().max(60).optional(),
        courier_name: z.string().max(80).optional(),
        tracking_url: z.string().url().max(500).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { orderId, ...patch } = data;
    const { error } = await supabaseAdmin.from("orders").update(patch).eq("id", orderId);
    if (error) throw new Error(error.message);
    await audit(context.userId, "order.update_status", "order", orderId, patch);
    return { ok: true };
  });

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ count: products }, { count: orders }, { data: revenueRow }] = await Promise.all([
      supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("orders").select("total").in("status", ["paid", "processing", "shipped", "delivered"]),
    ]);
    const revenue = (revenueRow ?? []).reduce((s, r) => s + Number(r.total), 0);
    return { products: products ?? 0, orders: orders ?? 0, revenue };
  });

export const adminUploadImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => 
    z.object({
      base64Data: z.string(),
      fileName: z.string(),
      contentType: z.string(),
    }).parse(input)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { secureImageUpload } = await import("@/lib/security.server");
    const buffer = Buffer.from(data.base64Data, "base64");
    const url = await secureImageUpload(buffer, data.fileName, data.contentType);
    
    // Extract path from public URL to match local patterns if needed
    const parts = url.split("/storage/v1/object/public/product-images/");
    const path = parts.length > 1 ? parts[1] : url;

    return { path, url };
  });
