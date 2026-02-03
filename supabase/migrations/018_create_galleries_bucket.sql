-- Create storage bucket for gallery media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'galleries',
  'galleries',
  TRUE,
  NULL, -- No file size limit (allows large video files)
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for galleries bucket
CREATE POLICY "Admins can upload to galleries bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'galleries' AND is_admin()
);

CREATE POLICY "Admins can update galleries bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'galleries' AND is_admin());

CREATE POLICY "Admins can delete from galleries bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'galleries' AND is_admin());

CREATE POLICY "Anyone can view galleries bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'galleries');
