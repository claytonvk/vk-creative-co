-- Create portfolio_images table
CREATE TABLE IF NOT EXISTS portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_portfolio_images_category ON portfolio_images(category_id);
CREATE INDEX idx_portfolio_images_display_order ON portfolio_images(display_order);
CREATE INDEX idx_portfolio_images_is_featured ON portfolio_images(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_portfolio_images_is_published ON portfolio_images(is_published) WHERE is_published = TRUE;

-- Add updated_at trigger
CREATE TRIGGER update_portfolio_images_updated_at
  BEFORE UPDATE ON portfolio_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
