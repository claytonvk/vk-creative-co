-- Add theme_color field to client_galleries
ALTER TABLE client_galleries
ADD COLUMN theme_color TEXT DEFAULT '#1a1a1a';

-- Add comment
COMMENT ON COLUMN client_galleries.theme_color IS 'Custom accent color for gallery theme (hex format)';
