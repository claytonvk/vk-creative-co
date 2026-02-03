-- Create client_galleries table
CREATE TABLE IF NOT EXISTS client_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  event_date DATE,
  description TEXT,
  theme TEXT NOT NULL DEFAULT 'minimal' CHECK (theme IN ('minimal', 'romantic', 'editorial')),
  access_mode TEXT NOT NULL DEFAULT 'guest_link' CHECK (access_mode IN ('guest_link', 'client_account')),
  access_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  allow_downloads BOOLEAN DEFAULT TRUE,
  allow_bulk_download BOOLEAN DEFAULT TRUE,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_client_galleries_access_token ON client_galleries(access_token);
CREATE INDEX idx_client_galleries_client_email ON client_galleries(client_email);
CREATE INDEX idx_client_galleries_is_published ON client_galleries(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_client_galleries_expires_at ON client_galleries(expires_at);

-- Add updated_at trigger
CREATE TRIGGER update_client_galleries_updated_at
  BEFORE UPDATE ON client_galleries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
