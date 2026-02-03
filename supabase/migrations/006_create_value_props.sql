-- Create value_props table for homepage value propositions
CREATE TABLE IF NOT EXISTS value_props (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT, -- Lucide icon name (e.g., "camera", "heart", "star")
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_value_props_display_order ON value_props(display_order);
CREATE INDEX idx_value_props_is_published ON value_props(is_published) WHERE is_published = TRUE;

-- Add updated_at trigger
CREATE TRIGGER update_value_props_updated_at
  BEFORE UPDATE ON value_props
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
