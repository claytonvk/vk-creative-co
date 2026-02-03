-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT, -- Optional grouping (e.g., "Booking", "Pricing", "Sessions")
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_faqs_display_order ON faqs(display_order);
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_is_published ON faqs(is_published) WHERE is_published = TRUE;

-- Add updated_at trigger
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
