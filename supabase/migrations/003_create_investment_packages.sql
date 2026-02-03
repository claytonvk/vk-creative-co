-- Create investment_packages table
CREATE TABLE IF NOT EXISTS investment_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL, -- Price in cents
  price_display TEXT, -- Custom display text like "Starting at $2,500"
  description TEXT,
  features JSONB DEFAULT '[]'::JSONB, -- Array of feature strings
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  badge_text TEXT, -- Optional badge like "Most Popular"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_investment_packages_display_order ON investment_packages(display_order);
CREATE INDEX idx_investment_packages_is_featured ON investment_packages(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_investment_packages_is_published ON investment_packages(is_published) WHERE is_published = TRUE;

-- Add updated_at trigger
CREATE TRIGGER update_investment_packages_updated_at
  BEFORE UPDATE ON investment_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
