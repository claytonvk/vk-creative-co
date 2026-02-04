-- Create portfolio_shoots table
CREATE TABLE portfolio_shoots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  shoot_date DATE,
  location TEXT,
  cover_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portfolio_shoots_slug ON portfolio_shoots(slug);
CREATE INDEX idx_portfolio_shoots_display_order ON portfolio_shoots(display_order);
CREATE INDEX idx_portfolio_shoots_is_published ON portfolio_shoots(is_published);
CREATE INDEX idx_portfolio_shoots_is_featured ON portfolio_shoots(is_featured);

-- Create shoot_media table (ad-hoc uploaded images for a shoot)
CREATE TABLE shoot_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoot_id UUID NOT NULL REFERENCES portfolio_shoots(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'image',
  filename TEXT NOT NULL,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shoot_media_shoot_id ON shoot_media(shoot_id);
CREATE INDEX idx_shoot_media_display_order ON shoot_media(display_order);

-- Create shoot_gallery_links table (links to existing gallery images)
CREATE TABLE shoot_gallery_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoot_id UUID NOT NULL REFERENCES portfolio_shoots(id) ON DELETE CASCADE,
  gallery_id UUID NOT NULL REFERENCES client_galleries(id) ON DELETE CASCADE,
  gallery_media_id UUID NOT NULL REFERENCES gallery_media(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shoot_id, gallery_media_id)
);

CREATE INDEX idx_shoot_gallery_links_shoot_id ON shoot_gallery_links(shoot_id);
CREATE INDEX idx_shoot_gallery_links_gallery_media_id ON shoot_gallery_links(gallery_media_id);

-- Create shoot_tags table (junction table for category tags)
CREATE TABLE shoot_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoot_id UUID NOT NULL REFERENCES portfolio_shoots(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shoot_id, category_id)
);

CREATE INDEX idx_shoot_tags_shoot_id ON shoot_tags(shoot_id);
CREATE INDEX idx_shoot_tags_category_id ON shoot_tags(category_id);

-- Slug generation function for portfolio shoots
CREATE OR REPLACE FUNCTION generate_shoot_slug(shoot_title TEXT, shoot_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base slug from title
  base_slug := lower(trim(shoot_title));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  IF base_slug = '' THEN
    base_slug := 'shoot';
  END IF;

  final_slug := base_slug;

  -- Check for uniqueness
  LOOP
    IF shoot_id IS NOT NULL THEN
      IF NOT EXISTS (SELECT 1 FROM portfolio_shoots WHERE slug = final_slug AND id != shoot_id) THEN
        RETURN final_slug;
      END IF;
    ELSE
      IF NOT EXISTS (SELECT 1 FROM portfolio_shoots WHERE slug = final_slug) THEN
        RETURN final_slug;
      END IF;
    END IF;

    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Updated_at trigger function (reuse if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_shoots_updated_at
  BEFORE UPDATE ON portfolio_shoots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shoot_media_updated_at
  BEFORE UPDATE ON shoot_media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
