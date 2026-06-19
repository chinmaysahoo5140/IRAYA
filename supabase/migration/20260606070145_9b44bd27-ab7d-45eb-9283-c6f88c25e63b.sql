
-- Orders: explicit admin-only write policies. Normal order creation/updates happen
-- via server functions using the service-role client (which bypasses RLS).
CREATE POLICY "Admins can insert orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- user_roles: prevent any client-side privilege escalation. Role grants must
-- happen exclusively via trusted server code using the service role.
CREATE POLICY "No client inserts on user_roles" ON public.user_roles
  AS RESTRICTIVE FOR INSERT TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "No client updates on user_roles" ON public.user_roles
  AS RESTRICTIVE FOR UPDATE TO anon, authenticated
  USING (false) WITH CHECK (false);

CREATE POLICY "No client deletes on user_roles" ON public.user_roles
  AS RESTRICTIVE FOR DELETE TO anon, authenticated
  USING (false);
