
-- 1. payment_events: server-write, admin-read
CREATE TABLE public.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  event_type text NOT NULL,
  payment_id text,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  amount numeric(12,2),
  currency text,
  status text,
  signature_valid boolean,
  ip text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_payment_events_order ON public.payment_events(order_id);
CREATE INDEX idx_payment_events_payment ON public.payment_events(payment_id);
GRANT SELECT ON public.payment_events TO authenticated;
GRANT ALL ON public.payment_events TO service_role;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view payment events" ON public.payment_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. login_events: user reads own, admin reads all, server writes
CREATE TABLE public.login_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  ip text,
  country text,
  city text,
  user_agent text,
  device_type text,
  is_new_device boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_login_events_user ON public.login_events(user_id, created_at DESC);
GRANT SELECT ON public.login_events TO authenticated;
GRANT ALL ON public.login_events TO service_role;
ALTER TABLE public.login_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own login events" ON public.login_events
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 3. security_events: admin-only read, server-only write
CREATE TABLE public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text,
  event_type text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  ip text,
  country text,
  user_agent text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_security_events_created ON public.security_events(created_at DESC);
GRANT SELECT ON public.security_events TO authenticated;
GRANT ALL ON public.security_events TO service_role;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view security events" ON public.security_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. idempotency_keys: server-only
CREATE TABLE public.idempotency_keys (
  key text PRIMARY KEY,
  user_id uuid,
  scope text NOT NULL,
  response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours')
);
CREATE INDEX idx_idem_expires ON public.idempotency_keys(expires_at);
GRANT ALL ON public.idempotency_keys TO service_role;
ALTER TABLE public.idempotency_keys ENABLE ROW LEVEL SECURITY;
-- no policies = no client access

-- 5. Add idempotency_key column to orders
ALTER TABLE public.orders ADD COLUMN idempotency_key text UNIQUE;

-- 6. Drop duplicate anon-read policies (the "Anyone reads ..." policies stay)
DROP POLICY IF EXISTS "anon read categories" ON public.categories;
DROP POLICY IF EXISTS "anon read product_images" ON public.product_images;
DROP POLICY IF EXISTS "anon read product_variants" ON public.product_variants;
DROP POLICY IF EXISTS "anon read products" ON public.products;
