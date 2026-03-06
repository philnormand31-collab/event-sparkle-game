
-- RLS policies for legal-documents bucket (for PDF uploads)
CREATE POLICY "Anyone can read legal documents files"
ON storage.objects FOR SELECT
USING (bucket_id = 'legal-documents');

CREATE POLICY "Admins can upload legal documents files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'legal-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update legal documents files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'legal-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete legal documents files"
ON storage.objects FOR DELETE
USING (bucket_id = 'legal-documents' AND public.has_role(auth.uid(), 'admin'));
