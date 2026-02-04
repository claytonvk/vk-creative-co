-- Enable RLS on all new tables
ALTER TABLE portfolio_shoots ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoot_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoot_gallery_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoot_tags ENABLE ROW LEVEL SECURITY;

-- portfolio_shoots policies
CREATE POLICY "Allow public read on published portfolio_shoots"
  ON portfolio_shoots FOR SELECT
  TO public
  USING (is_published = true OR is_admin());

CREATE POLICY "Allow admin insert on portfolio_shoots"
  ON portfolio_shoots FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on portfolio_shoots"
  ON portfolio_shoots FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on portfolio_shoots"
  ON portfolio_shoots FOR DELETE
  TO authenticated
  USING (is_admin());

-- shoot_media policies
CREATE POLICY "Allow public read on shoot_media via published shoot"
  ON shoot_media FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_shoots
      WHERE portfolio_shoots.id = shoot_media.shoot_id
      AND (portfolio_shoots.is_published = true OR is_admin())
    )
  );

CREATE POLICY "Allow admin insert on shoot_media"
  ON shoot_media FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on shoot_media"
  ON shoot_media FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on shoot_media"
  ON shoot_media FOR DELETE
  TO authenticated
  USING (is_admin());

-- shoot_gallery_links policies
CREATE POLICY "Allow public read on shoot_gallery_links via published shoot"
  ON shoot_gallery_links FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_shoots
      WHERE portfolio_shoots.id = shoot_gallery_links.shoot_id
      AND (portfolio_shoots.is_published = true OR is_admin())
    )
  );

CREATE POLICY "Allow admin insert on shoot_gallery_links"
  ON shoot_gallery_links FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on shoot_gallery_links"
  ON shoot_gallery_links FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on shoot_gallery_links"
  ON shoot_gallery_links FOR DELETE
  TO authenticated
  USING (is_admin());

-- shoot_tags policies
CREATE POLICY "Allow public read on shoot_tags via published shoot"
  ON shoot_tags FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_shoots
      WHERE portfolio_shoots.id = shoot_tags.shoot_id
      AND (portfolio_shoots.is_published = true OR is_admin())
    )
  );

CREATE POLICY "Allow admin insert on shoot_tags"
  ON shoot_tags FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on shoot_tags"
  ON shoot_tags FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on shoot_tags"
  ON shoot_tags FOR DELETE
  TO authenticated
  USING (is_admin());
