-- Create gallery_analytics table
CREATE TABLE IF NOT EXISTS gallery_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES client_galleries(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'download', 'bulk_download')),
  media_id UUID REFERENCES gallery_media(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_gallery_analytics_gallery_id ON gallery_analytics(gallery_id);
CREATE INDEX idx_gallery_analytics_event_type ON gallery_analytics(event_type);
CREATE INDEX idx_gallery_analytics_created_at ON gallery_analytics(created_at);
CREATE INDEX idx_gallery_analytics_media_id ON gallery_analytics(media_id);
