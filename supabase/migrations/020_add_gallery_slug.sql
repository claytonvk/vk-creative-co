-- Add slug field to client_galleries
ALTER TABLE client_galleries
ADD COLUMN slug TEXT UNIQUE;

-- Create index for slug lookups
CREATE INDEX idx_client_galleries_slug ON client_galleries(slug);

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION generate_gallery_slug(gallery_name TEXT, gallery_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert name to lowercase, replace spaces with hyphens, remove special chars
  base_slug := lower(regexp_replace(gallery_name, '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  -- If empty, use 'gallery'
  IF base_slug = '' THEN
    base_slug := 'gallery';
  END IF;

  final_slug := base_slug;

  -- Check for uniqueness and add suffix if needed
  WHILE EXISTS (SELECT 1 FROM client_galleries WHERE slug = final_slug AND id != gallery_id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing galleries to have slugs
UPDATE client_galleries
SET slug = generate_gallery_slug(name, id)
WHERE slug IS NULL;

-- Make slug NOT NULL after populating
ALTER TABLE client_galleries
ALTER COLUMN slug SET NOT NULL;
