-- Create gallery_clients junction table
CREATE TABLE IF NOT EXISTS gallery_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES client_galleries(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(gallery_id, client_id)
);

-- Create indexes
CREATE INDEX idx_gallery_clients_gallery_id ON gallery_clients(gallery_id);
CREATE INDEX idx_gallery_clients_client_id ON gallery_clients(client_id);
