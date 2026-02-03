-- Create gallery_media table
CREATE TABLE IF NOT EXISTS gallery_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES client_galleries(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'image' CHECK (file_type IN ('image', 'video')),
  filename TEXT NOT NULL,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_gallery_media_gallery_id ON gallery_media(gallery_id);
CREATE INDEX idx_gallery_media_display_order ON gallery_media(display_order);
CREATE INDEX idx_gallery_media_file_type ON gallery_media(file_type);

-- Add updated_at trigger
CREATE TRIGGER update_gallery_media_updated_at
  BEFORE UPDATE ON gallery_media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
