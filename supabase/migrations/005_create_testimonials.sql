-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT, -- e.g., "Bride", "Business Owner"
  author_image_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_testimonials_display_order ON testimonials(display_order);
CREATE INDEX idx_testimonials_is_featured ON testimonials(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_testimonials_is_published ON testimonials(is_published) WHERE is_published = TRUE;

-- Add updated_at trigger
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
