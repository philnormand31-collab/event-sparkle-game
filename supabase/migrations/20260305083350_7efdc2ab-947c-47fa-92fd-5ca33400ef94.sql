
-- Create storage bucket for legal documents
INSERT INTO storage.buckets (id, name, public) VALUES ('legal-documents', 'legal-documents', true);

-- Allow anyone to read legal documents
CREATE POLICY "Anyone can view legal documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'legal-documents');

-- Allow admins to upload legal documents
CREATE POLICY "Admins can upload legal documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'legal-documents' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to update legal documents
CREATE POLICY "Admins can update legal documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'legal-documents' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete legal documents
CREATE POLICY "Admins can delete legal documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'legal-documents' AND public.has_role(auth.uid(), 'admin'));
