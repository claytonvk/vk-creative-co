-- Create admin_users table for admin access control
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'admin', -- 'admin' or 'super_admin'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active) WHERE is_active = TRUE;

-- Add updated_at trigger
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
