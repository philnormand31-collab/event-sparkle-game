
-- Role system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- User roles policies
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Service content table
CREATE TABLE public.service_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_key TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);
ALTER TABLE public.service_content ENABLE ROW LEVEL SECURITY;

-- Everyone can read service content
CREATE POLICY "Anyone can read service content" ON public.service_content
  FOR SELECT USING (true);

-- Only admins can insert/update
CREATE POLICY "Admins can insert service content" ON public.service_content
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service content" ON public.service_content
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Seed with the 4 services
INSERT INTO public.service_content (service_key) VALUES
  ('livecode'), ('numericode'), ('mobilplay'), ('playcorner');

-- Storage bucket for service images
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);

CREATE POLICY "Anyone can view service images" ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY "Admins can upload service images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service images" ON storage.objects
  FOR DELETE USING (bucket_id = 'service-images' AND public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_service_content_updated_at
  BEFORE UPDATE ON public.service_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
