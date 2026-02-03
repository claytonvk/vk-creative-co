-- Create storage bucket for portfolio images
-- Note: Run this in the Supabase dashboard SQL editor or via CLI
-- Storage bucket creation is typically done via the Supabase dashboard or API

-- This SQL creates the bucket policies assuming a bucket named 'portfolio' exists
-- You must first create the bucket in Supabase Dashboard > Storage > New Bucket

-- Create the bucket (this may need to be done via dashboard)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
-- Note: This is usually already enabled by default

-- Policy: Allow public read access to portfolio bucket
CREATE POLICY "Allow public read on portfolio bucket"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'portfolio');

-- Policy: Allow authenticated admins to upload
CREATE POLICY "Allow admin upload to portfolio bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio'
    AND is_admin()
  );

-- Policy: Allow authenticated admins to update
CREATE POLICY "Allow admin update on portfolio bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio'
    AND is_admin()
  );

-- Policy: Allow authenticated admins to delete
CREATE POLICY "Allow admin delete from portfolio bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio'
    AND is_admin()
  );
