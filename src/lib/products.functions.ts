// Public product reads. Uses supabaseAdmin so loaders on public routes
// (SSR / prerender) don't need a bearer token. Projection is explicit —
// no PII columns exposed. Image URLs are stored as storage paths and
// converted to signed URLs (or kept as-is if already absolute URLs).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { notFound } from "@tanstack/react-router";

async function signImage(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? null;
}

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("id, slug, name, description, image_url, sort_order")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

const listInput = z.object({
  category: z.string().optional(),
  featured: z.boolean().optional(),
  limit: z.number().int().min(1).max(60).optional(),
});

export const listProducts = createServerFn({ method: "GET" })
  .validator((input: unknown) => listInput.parse(input ?? {}))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("products")
      .select(
        "id, slug, name, description, price, discount_price, compare_at_price, currency, stock, featured, category_id, categories(slug,name), product_images(url, alt, sort_order)",
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (data.category) {
      const { data: cat } = await supabaseAdmin
        .from("categories")
        .select("id")
        .eq("slug", data.category)
        .maybeSingle();
      if (cat?.id) q = q.eq("category_id", cat.id);
      else return [];
    }
    if (data.featured) q = q.eq("featured", true);
    if (data.limit) q = q.limit(data.limit);

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    return Promise.all(
      (rows ?? []).map(async (r) => ({
        ...r,
        image: await signImage(r.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0]?.url),
      })),
    );
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .validator((input: unknown) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .select(
        "id, slug, name, description, story, price, discount_price, compare_at_price, currency, sku, stock, featured, categories(slug,name), product_images(url, alt, sort_order), product_variants(id,name,sku,price_override,stock,sort_order)",
      )
      .eq("slug", data.slug)
      .eq("status", "active")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw notFound();

    const images = await Promise.all(
      (row.product_images ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(async (im) => ({ ...im, url: (await signImage(im.url)) ?? "" })),
    );
    return {
      ...row,
      images,
      variants: (row.product_variants ?? []).sort((a, b) => a.sort_order - b.sort_order),
    };
  });
