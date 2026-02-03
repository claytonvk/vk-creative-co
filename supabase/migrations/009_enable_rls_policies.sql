-- Enable Row Level Security on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_props ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Allow public read on categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin insert on categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on categories"
  ON categories FOR DELETE
  TO authenticated
  USING (is_admin());

-- Portfolio images policies
CREATE POLICY "Allow public read on published portfolio_images"
  ON portfolio_images FOR SELECT
  TO public
  USING (is_published = true OR is_admin());

CREATE POLICY "Allow admin insert on portfolio_images"
  ON portfolio_images FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on portfolio_images"
  ON portfolio_images FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on portfolio_images"
  ON portfolio_images FOR DELETE
  TO authenticated
  USING (is_admin());

-- Investment packages policies
CREATE POLICY "Allow public read on published investment_packages"
  ON investment_packages FOR SELECT
  TO public
  USING (is_published = true OR is_admin());

CREATE POLICY "Allow admin insert on investment_packages"
  ON investment_packages FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on investment_packages"
  ON investment_packages FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on investment_packages"
  ON investment_packages FOR DELETE
  TO authenticated
  USING (is_admin());

-- FAQs policies
CREATE POLICY "Allow public read on published faqs"
  ON faqs FOR SELECT
  TO public
  USING (is_published = true OR is_admin());

CREATE POLICY "Allow admin insert on faqs"
  ON faqs FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on faqs"
  ON faqs FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on faqs"
  ON faqs FOR DELETE
  TO authenticated
  USING (is_admin());

-- Testimonials policies
CREATE POLICY "Allow public read on published testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (is_published = true OR is_admin());

CREATE POLICY "Allow admin insert on testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (is_admin());

-- Value props policies
CREATE POLICY "Allow public read on published value_props"
  ON value_props FOR SELECT
  TO public
  USING (is_published = true OR is_admin());

CREATE POLICY "Allow admin insert on value_props"
  ON value_props FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on value_props"
  ON value_props FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on value_props"
  ON value_props FOR DELETE
  TO authenticated
  USING (is_admin());

-- Site settings policies
CREATE POLICY "Allow public read on site_settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin insert on site_settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on site_settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on site_settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (is_admin());

-- Admin users policies (only super admins can manage)
CREATE POLICY "Allow admin read on admin_users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Allow super admin insert on admin_users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND is_active = TRUE
    )
  );

CREATE POLICY "Allow super admin update on admin_users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND is_active = TRUE
    )
  );

CREATE POLICY "Allow super admin delete on admin_users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND is_active = TRUE
    )
  );
