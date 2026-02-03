-- Enable RLS on gallery tables
ALTER TABLE client_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_analytics ENABLE ROW LEVEL SECURITY;

-- Admin policies for client_galleries
CREATE POLICY "Admins can do everything with galleries" ON client_galleries
  FOR ALL USING (is_admin());

-- Public can view published galleries by token (handled in application layer)
CREATE POLICY "Anyone can view published galleries" ON client_galleries
  FOR SELECT USING (is_published = TRUE);

-- Admin policies for gallery_media
CREATE POLICY "Admins can do everything with gallery_media" ON gallery_media
  FOR ALL USING (is_admin());

-- Public can view media of published galleries
CREATE POLICY "Anyone can view media of published galleries" ON gallery_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM client_galleries
      WHERE client_galleries.id = gallery_media.gallery_id
      AND client_galleries.is_published = TRUE
    )
  );

-- Admin policies for clients
CREATE POLICY "Admins can do everything with clients" ON clients
  FOR ALL USING (is_admin());

-- Clients can view their own profile
CREATE POLICY "Clients can view own profile" ON clients
  FOR SELECT USING (auth.uid() = user_id);

-- Clients can update their own profile
CREATE POLICY "Clients can update own profile" ON clients
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies for gallery_clients
CREATE POLICY "Admins can do everything with gallery_clients" ON gallery_clients
  FOR ALL USING (is_admin());

-- Clients can view their own gallery associations
CREATE POLICY "Clients can view own gallery links" ON gallery_clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = gallery_clients.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Admin policies for gallery_analytics
CREATE POLICY "Admins can do everything with analytics" ON gallery_analytics
  FOR ALL USING (is_admin());

-- Anyone can insert analytics (for tracking views/downloads)
CREATE POLICY "Anyone can insert analytics" ON gallery_analytics
  FOR INSERT WITH CHECK (TRUE);
