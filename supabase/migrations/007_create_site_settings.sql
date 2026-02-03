-- Create site_settings table for key-value storage of all site copy
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  value_json JSONB, -- For structured data
  category TEXT, -- Group settings: 'hero', 'about', 'contact', 'footer', etc.
  description TEXT, -- Admin-facing description of what this setting controls
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_site_settings_category ON site_settings(category);

-- Add updated_at trigger
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
