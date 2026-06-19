import { c as createServerRpc } from "./createServerRpc-T01JzlKW.mjs";
import { c as createServerFn, g as getRequest } from "./server-CUdO2dQu.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DBKcBFEt.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, a as arrayType, s as stringType, e as enumType, n as numberType } from "../_libs/zod.mjs";
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
async function assertAdmin(userId) {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    data,
    error
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}
async function audit(userId, action, targetType, targetId, metadata) {
  const {
    writeAuditLog,
    getClientIp
  } = await import("./security.server-BRG0sDb-.mjs");
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const req = getRequest();
  const {
    data: u
  } = await supabaseAdmin.auth.admin.getUserById(userId);
  await writeAuditLog({
    actorId: userId,
    actorEmail: u?.user?.email ?? null,
    action,
    targetType,
    targetId,
    ip: getClientIp(req),
    metadata: metadata ?? null
  });
}
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}
const adminListProducts_createServerFn_handler = createServerRpc({
  id: "9932f7d91182148199cbc8b49e99aa83ab2855e0f2166e0d0e38e6c091b587df",
  name: "adminListProducts",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListProducts.__executeServer(opts));
const adminListProducts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListProducts_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    data,
    error
  } = await supabaseAdmin.from("products").select("id, slug, name, description, price, discount_price, stock, status, featured, created_at, category_id, categories(name,slug), product_images(url, sort_order)").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const productInput = objectType({
  id: stringType().uuid().optional(),
  name: stringType().min(1).max(160),
  category_slug: enumType(["bags", "footwear"]),
  description: stringType().max(4e3).optional().default(""),
  price: numberType().min(0).max(1e7),
  discount_price: numberType().min(0).max(1e7).nullable().optional(),
  stock: numberType().int().min(0).max(1e5),
  status: enumType(["draft", "active", "archived"]).default("active"),
  variants: stringType().max(400).optional().default(""),
  // comma-separated sizes
  images: arrayType(stringType().min(1)).max(8).default([])
  // storage paths
});
const adminUpsertProduct_createServerFn_handler = createServerRpc({
  id: "8552c7bea139694beea39d17e69f323a972d63fd26947a65dd6b49554eb191c8",
  name: "adminUpsertProduct",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpsertProduct.__executeServer(opts));
const adminUpsertProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => productInput.parse(input)).handler(adminUpsertProduct_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    data: cat,
    error: cErr
  } = await supabaseAdmin.from("categories").select("id").eq("slug", data.category_slug).single();
  if (cErr || !cat) throw new Error("Invalid category");
  const slug = data.id ? void 0 : `${slugify(data.name)}-${Math.random().toString(36).slice(2, 7)}`;
  const row = {
    name: data.name,
    description: data.description,
    price: data.price,
    discount_price: data.discount_price ?? null,
    stock: data.stock,
    status: data.status,
    category_id: cat.id,
    currency: "INR"
  };
  let productId;
  if (data.id) {
    const {
      error
    } = await supabaseAdmin.from("products").update(row).eq("id", data.id);
    if (error) throw new Error(error.message);
    productId = data.id;
  } else {
    const {
      data: ins,
      error
    } = await supabaseAdmin.from("products").insert({
      ...row,
      slug
    }).select("id").single();
    if (error) throw new Error(error.message);
    productId = ins.id;
  }
  if (data.images.length > 0) {
    await supabaseAdmin.from("product_images").delete().eq("product_id", productId);
    const imgRows = data.images.map((url, i) => ({
      product_id: productId,
      url,
      sort_order: i,
      alt: data.name
    }));
    const {
      error
    } = await supabaseAdmin.from("product_images").insert(imgRows);
    if (error) throw new Error(error.message);
  }
  await supabaseAdmin.from("product_variants").delete().eq("product_id", productId);
  if (data.variants.trim().length > 0) {
    const names = data.variants.split(",").map((s) => s.trim()).filter(Boolean);
    const vRows = names.map((name, i) => ({
      product_id: productId,
      name,
      sort_order: i,
      stock: 0
    }));
    if (vRows.length > 0) await supabaseAdmin.from("product_variants").insert(vRows);
  }
  await audit(context.userId, data.id ? "product.update" : "product.create", "product", productId, {
    name: data.name
  });
  return {
    id: productId
  };
});
const adminDeleteProduct_createServerFn_handler = createServerRpc({
  id: "0ddf57ac23192120a1e98e48f57343c6fe83e8a1ddcf5df54be83354a1f768ad",
  name: "adminDeleteProduct",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteProduct.__executeServer(opts));
const adminDeleteProduct = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  id: stringType().uuid()
}).parse(input)).handler(adminDeleteProduct_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    error
  } = await supabaseAdmin.from("products").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  await audit(context.userId, "product.delete", "product", data.id);
  return {
    ok: true
  };
});
const adminSignImage_createServerFn_handler = createServerRpc({
  id: "1eebec19e04bfe989f1927af14cf4b054b098222893399fbc6b947df32f11ab0",
  name: "adminSignImage",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminSignImage.__executeServer(opts));
const adminSignImage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  path: stringType().min(1).max(500)
}).parse(input)).handler(adminSignImage_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    data: signed
  } = await supabaseAdmin.storage.from("product-images").createSignedUrl(data.path, 60 * 60 * 24 * 7);
  return {
    url: signed?.signedUrl ?? null
  };
});
const adminListOrders_createServerFn_handler = createServerRpc({
  id: "573be2cdf3c95bfa88f6bb3d2080ff0b0c620db545ac53f2f5a039a50348d737",
  name: "adminListOrders",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListOrders.__executeServer(opts));
const adminListOrders = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListOrders_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    data,
    error
  } = await supabaseAdmin.from("orders").select("id, order_number, status, total, currency, email, phone, shipping_address, awb_code, courier_name, tracking_url, created_at, order_items(name, quantity, price)").order("created_at", {
    ascending: false
  }).limit(200);
  if (error) throw new Error(error.message);
  return data ?? [];
});
const adminUpdateOrderStatus_createServerFn_handler = createServerRpc({
  id: "9505b54584006d8459dff4f0d9b2b1ccc184fc05200648ce850e9f9f7ee3f723",
  name: "adminUpdateOrderStatus",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUpdateOrderStatus.__executeServer(opts));
const adminUpdateOrderStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  orderId: stringType().uuid(),
  status: enumType(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]),
  awb_code: stringType().max(60).optional(),
  courier_name: stringType().max(80).optional(),
  tracking_url: stringType().url().max(500).optional()
}).parse(input)).handler(adminUpdateOrderStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    orderId,
    ...patch
  } = data;
  const {
    error
  } = await supabaseAdmin.from("orders").update(patch).eq("id", orderId);
  if (error) throw new Error(error.message);
  await audit(context.userId, "order.update_status", "order", orderId, patch);
  return {
    ok: true
  };
});
const adminStats_createServerFn_handler = createServerRpc({
  id: "fc54988025651b0d207f9ef4346d9f0fe848ff17785294a4a080cffaee281f4f",
  name: "adminStats",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminStats.__executeServer(opts));
const adminStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminStats_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const [{
    count: products
  }, {
    count: orders
  }, {
    data: revenueRow
  }] = await Promise.all([supabaseAdmin.from("products").select("*", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("orders").select("*", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("orders").select("total").in("status", ["paid", "processing", "shipped", "delivered"])]);
  const revenue = (revenueRow ?? []).reduce((s, r) => s + Number(r.total), 0);
  return {
    products: products ?? 0,
    orders: orders ?? 0,
    revenue
  };
});
const adminUploadImage_createServerFn_handler = createServerRpc({
  id: "72eaf964ab7ce14d623874daf7be210de5431691ecf47076df88fef9c15ca3d3",
  name: "adminUploadImage",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminUploadImage.__executeServer(opts));
const adminUploadImage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((input) => objectType({
  base64Data: stringType(),
  fileName: stringType(),
  contentType: stringType()
}).parse(input)).handler(adminUploadImage_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    secureImageUpload
  } = await import("./security.server-BRG0sDb-.mjs");
  const buffer = Buffer.from(data.base64Data, "base64");
  const url = await secureImageUpload(buffer, data.fileName, data.contentType);
  const parts = url.split("/storage/v1/object/public/product-images/");
  const path = parts.length > 1 ? parts[1] : url;
  return {
    path,
    url
  };
});
export {
  adminDeleteProduct_createServerFn_handler,
  adminListOrders_createServerFn_handler,
  adminListProducts_createServerFn_handler,
  adminSignImage_createServerFn_handler,
  adminStats_createServerFn_handler,
  adminUpdateOrderStatus_createServerFn_handler,
  adminUploadImage_createServerFn_handler,
  adminUpsertProduct_createServerFn_handler
};
