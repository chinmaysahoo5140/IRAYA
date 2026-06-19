
-- Wipe catalog
DELETE FROM public.wishlist;
DELETE FROM public.product_images;
DELETE FROM public.product_variants;
DELETE FROM public.products;
DELETE FROM public.categories;

-- New columns
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_price NUMERIC;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS sheet_synced BOOLEAN NOT NULL DEFAULT false;

-- Seed categories
INSERT INTO public.categories (slug, name, description, sort_order)
VALUES
  ('bags', 'Bags', 'Handcrafted bags', 1),
  ('footwear', 'Footwear', 'Handcrafted footwear', 2);

-- Grant anon SELECT on public catalog tables (storefront browses without login)
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.product_images TO anon;
GRANT SELECT ON public.product_variants TO anon;

-- Public read policies (idempotent)
DROP POLICY IF EXISTS "anon read categories" ON public.categories;
CREATE POLICY "anon read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon read products" ON public.products;
CREATE POLICY "anon read products" ON public.products FOR SELECT TO anon, authenticated USING (status = 'active');

DROP POLICY IF EXISTS "anon read product_images" ON public.product_images;
CREATE POLICY "anon read product_images" ON public.product_images FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon read product_variants" ON public.product_variants;
CREATE POLICY "anon read product_variants" ON public.product_variants FOR SELECT TO anon, authenticated USING (true);
