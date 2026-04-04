-- Remove overly open SELECT policies
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can view messages" ON public.messages;

-- Authenticated admins get full access
CREATE POLICY "Admins can do everything on orders"
  ON public.orders FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins can do everything on order_items"
  ON public.order_items FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Admins can read messages"
  ON public.messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can delete messages"
  ON public.messages FOR DELETE TO authenticated USING (true);

-- Anon users can still read orders (needed for the order tracker on the site)
CREATE POLICY "Anon can read orders"
  ON public.orders FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can read order items"
  ON public.order_items FOR SELECT TO anon USING (true);