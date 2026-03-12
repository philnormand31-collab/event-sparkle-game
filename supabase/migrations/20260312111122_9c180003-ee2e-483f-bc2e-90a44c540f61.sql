
CREATE TABLE public.about_page (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL DEFAULT '',
  image_url text DEFAULT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid DEFAULT NULL
);

ALTER TABLE public.about_page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read about page"
  ON public.about_page FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can update about page"
  ON public.about_page FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert about page"
  ON public.about_page FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.about_page (content) VALUES ('');

INSERT INTO storage.buckets (id, name, public) VALUES ('about-images', 'about-images', true);

CREATE POLICY "Anyone can view about images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'about-images');

CREATE POLICY "Admins can upload about images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'about-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete about images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'about-images' AND public.has_role(auth.uid(), 'admin'::app_role));
