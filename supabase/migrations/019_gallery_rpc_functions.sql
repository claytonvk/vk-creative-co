-- RPC function to increment gallery view count
CREATE OR REPLACE FUNCTION increment_gallery_view_count(gallery_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE client_galleries
  SET view_count = view_count + 1
  WHERE id = gallery_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function to increment gallery download count
CREATE OR REPLACE FUNCTION increment_gallery_download_count(gallery_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE client_galleries
  SET download_count = download_count + 1
  WHERE id = gallery_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_gallery_view_count(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_gallery_download_count(UUID) TO anon, authenticated;
