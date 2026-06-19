-- SQL Migration: Security Hardening

-- 1. Create token_blacklist table
CREATE TABLE IF NOT EXISTS public.token_blacklist (
  token text PRIMARY KEY,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_expires ON public.token_blacklist(expires_at);
ALTER TABLE public.token_blacklist ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.token_blacklist TO service_role;

-- 2. Create user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_type text,
  browser_name text,
  browser_version text,
  os text,
  ip_address text,
  country text,
  city text,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions(user_id);
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, DELETE ON public.user_sessions TO authenticated;
GRANT ALL ON public.user_sessions TO service_role;

DROP POLICY IF EXISTS "Users view own sessions" ON public.user_sessions;
CREATE POLICY "Users view own sessions" ON public.user_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users delete own sessions" ON public.user_sessions;
CREATE POLICY "Users delete own sessions" ON public.user_sessions
  FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 3. Create user_2fa table
CREATE TABLE IF NOT EXISTS public.user_2fa (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  totp_secret text NOT NULL,
  totp_enabled boolean DEFAULT false,
  backup_codes text[] DEFAULT '{}'::text[],
  failed_attempts integer DEFAULT 0,
  locked_until timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.user_2fa ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.user_2fa TO service_role;

-- 4. Create banned_ips table
CREATE TABLE IF NOT EXISTS public.banned_ips (
  ip text PRIMARY KEY,
  reason text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.banned_ips ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.banned_ips TO service_role;
GRANT SELECT ON public.banned_ips TO authenticated;

DROP POLICY IF EXISTS "Admins manage banned_ips" ON public.banned_ips;
CREATE POLICY "Admins manage banned_ips" ON public.banned_ips
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 5. Create email_verification_tokens table
CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
  token text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  metadata jsonb,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.email_verification_tokens TO service_role;

-- 6. Apply Row Level Security to existing tables

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users manage own profile" ON public.profiles;
CREATE POLICY "Users manage own profile" ON public.profiles
  FOR ALL TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

-- user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins manage user roles" ON public.user_roles;
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage user roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- addresses
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users insert own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users update own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users delete own addresses" ON public.addresses;

CREATE POLICY "Users view own addresses" ON public.addresses
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own addresses" ON public.addresses
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own addresses" ON public.addresses
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users delete own addresses" ON public.addresses
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon read categories" ON public.categories;
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Anyone reads categories" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.categories
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon read products" ON public.products;
DROP POLICY IF EXISTS "Anyone reads active products" ON public.products;
DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Anyone reads active products" ON public.products
  FOR SELECT TO anon, authenticated
  USING (status = 'active' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- product_images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon read product_images" ON public.product_images;
DROP POLICY IF EXISTS "Admins manage product images" ON public.product_images;
CREATE POLICY "Anyone reads product images" ON public.product_images
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage product images" ON public.product_images
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- product_variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon read product_variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admins manage product variants" ON public.product_variants;
CREATE POLICY "Anyone reads product variants" ON public.product_variants
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage product variants" ON public.product_variants
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- wishlist
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users insert own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users delete own wishlist" ON public.wishlist;
CREATE POLICY "Users view own wishlist" ON public.wishlist
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own wishlist" ON public.wishlist
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own wishlist" ON public.wishlist
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

CREATE POLICY "Users view own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own order items" ON public.order_items;
CREATE POLICY "Users view own order items" ON public.order_items
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  ));

-- admin_audit_log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view audit log" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Admins view audit log" ON public.admin_audit_log;
CREATE POLICY "Admins view audit log" ON public.admin_audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- login_attempts
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins view login attempts" ON public.login_attempts;
CREATE POLICY "Admins view login attempts" ON public.login_attempts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- login_events
ALTER TABLE public.login_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own login events" ON public.login_events;
CREATE POLICY "Users view own login events" ON public.login_events
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- security_events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins view security events" ON public.security_events;
CREATE POLICY "Admins view security events" ON public.security_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- payment_events
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins view payment events" ON public.payment_events;
CREATE POLICY "Admins view payment events" ON public.payment_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
