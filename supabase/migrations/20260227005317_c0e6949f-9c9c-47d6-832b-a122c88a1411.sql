
-- Drop the restrictive policies and recreate them as permissive
DROP POLICY IF EXISTS "Anyone can read service content" ON public.service_content;
DROP POLICY IF EXISTS "Admins can insert service content" ON public.service_content;
DROP POLICY IF EXISTS "Admins can update service content" ON public.service_content;

-- Recreate as PERMISSIVE policies (default)
CREATE POLICY "Anyone can read service content"
  ON public.service_content
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert service content"
  ON public.service_content
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service content"
  ON public.service_content
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
