
CREATE TABLE public.legal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Anyone can read legal documents"
  ON public.legal_documents FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can update
CREATE POLICY "Admins can update legal documents"
  ON public.legal_documents FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert legal documents"
  ON public.legal_documents FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed the two documents
INSERT INTO public.legal_documents (slug, title, content) VALUES
  ('mentions-legales', 'Mentions légales', ''),
  ('cgv', 'Conditions Générales de Vente', '');
