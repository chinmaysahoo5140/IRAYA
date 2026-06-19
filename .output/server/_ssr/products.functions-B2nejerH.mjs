import { c as createServerRpc } from "./createServerRpc-T01JzlKW.mjs";
import { c as createServerFn } from "./server-CUdO2dQu.mjs";
import { y as notFound } from "../_libs/tanstack__router-core.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, b as booleanType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "../_libs/tanstack__history.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
async function signImage(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    data
  } = await supabaseAdmin.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? null;
}
const listCategories_createServerFn_handler = createServerRpc({
  id: "74cf57a5ce5acc5ff7716c464d5de5a2260685d83f4d25828e2026fb3932cf53",
  name: "listCategories",
  filename: "src/lib/products.functions.ts"
}, (opts) => listCategories.__executeServer(opts));
const listCategories = createServerFn({
  method: "GET"
}).handler(listCategories_createServerFn_handler, async () => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    data,
    error
  } = await supabaseAdmin.from("categories").select("id, slug, name, description, image_url, sort_order").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const listInput = objectType({
  category: stringType().optional(),
  featured: booleanType().optional(),
  limit: numberType().int().min(1).max(60).optional()
});
const listProducts_createServerFn_handler = createServerRpc({
  id: "51ad93d03c52987e0e52d0164e41771f8765a8919d8a537367eaf795dff9b9d8",
  name: "listProducts",
  filename: "src/lib/products.functions.ts"
}, (opts) => listProducts.__executeServer(opts));
const listProducts = createServerFn({
  method: "GET"
}).validator((input) => listInput.parse(input ?? {})).handler(listProducts_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  let q = supabaseAdmin.from("products").select("id, slug, name, description, price, discount_price, compare_at_price, currency, stock, featured, category_id, categories(slug,name), product_images(url, alt, sort_order)").eq("status", "active").order("created_at", {
    ascending: false
  });
  if (data.category) {
    const {
      data: cat
    } = await supabaseAdmin.from("categories").select("id").eq("slug", data.category).maybeSingle();
    if (cat?.id) q = q.eq("category_id", cat.id);
    else return [];
  }
  if (data.featured) q = q.eq("featured", true);
  if (data.limit) q = q.limit(data.limit);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return Promise.all((rows ?? []).map(async (r) => ({
    ...r,
    image: await signImage(r.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0]?.url)
  })));
});
const getProductBySlug_createServerFn_handler = createServerRpc({
  id: "934a19e0a64899030ca094a104b50f8fc2c2f2533d480be67184ceddaf6faaf0",
  name: "getProductBySlug",
  filename: "src/lib/products.functions.ts"
}, (opts) => getProductBySlug.__executeServer(opts));
const getProductBySlug = createServerFn({
  method: "GET"
}).validator((input) => objectType({
  slug: stringType().min(1)
}).parse(input)).handler(getProductBySlug_createServerFn_handler, async ({
  data
}) => {
  const {
    supabaseAdmin
  } = await import("./client.server-ijnlFj_c.mjs");
  const {
    data: row,
    error
  } = await supabaseAdmin.from("products").select("id, slug, name, description, story, price, discount_price, compare_at_price, currency, sku, stock, featured, categories(slug,name), product_images(url, alt, sort_order), product_variants(id,name,sku,price_override,stock,sort_order)").eq("slug", data.slug).eq("status", "active").maybeSingle();
  if (error) throw new Error(error.message);
  if (!row) throw notFound();
  const images = await Promise.all((row.product_images ?? []).sort((a, b) => a.sort_order - b.sort_order).map(async (im) => ({
    ...im,
    url: await signImage(im.url) ?? ""
  })));
  return {
    ...row,
    images,
    variants: (row.product_variants ?? []).sort((a, b) => a.sort_order - b.sort_order)
  };
});
export {
  getProductBySlug_createServerFn_handler,
  listCategories_createServerFn_handler,
  listProducts_createServerFn_handler
};
