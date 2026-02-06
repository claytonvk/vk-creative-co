-- Create a function to check client email status for authentication flow
-- Uses SECURITY DEFINER to bypass RLS since unauthenticated users need to check their email
CREATE OR REPLACE FUNCTION check_client_email_status(check_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  client_record RECORD;
BEGIN
  SELECT id, user_id, name INTO client_record
  FROM clients
  WHERE email = check_email
  LIMIT 1;

  IF client_record IS NULL THEN
    RETURN json_build_object('status', 'not_found');
  END IF;

  IF client_record.user_id IS NOT NULL THEN
    RETURN json_build_object('status', 'sign_in');
  END IF;

  RETURN json_build_object(
    'status', 'set_password',
    'clientName', COALESCE(client_record.name, '')
  );
END;
$$;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION check_client_email_status(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION check_client_email_status(TEXT) TO authenticated;

-- Function to link a client record to an auth user during registration
-- Uses SECURITY DEFINER to bypass RLS since the user_id is NULL before linking
CREATE OR REPLACE FUNCTION link_client_to_user(
  client_email TEXT,
  auth_user_id UUID,
  client_name TEXT,
  client_phone TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_client RECORD;
BEGIN
  -- Check if client record exists
  SELECT id INTO existing_client
  FROM clients
  WHERE email = client_email
  LIMIT 1;

  IF existing_client IS NOT NULL THEN
    -- Update existing client record with user_id
    UPDATE clients
    SET user_id = auth_user_id,
        name = client_name,
        phone = client_phone
    WHERE id = existing_client.id;

    RETURN json_build_object('success', true);
  ELSE
    -- Create new client record
    INSERT INTO clients (user_id, email, name, phone)
    VALUES (auth_user_id, client_email, client_name, client_phone);

    RETURN json_build_object('success', true);
  END IF;

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

GRANT EXECUTE ON FUNCTION link_client_to_user(TEXT, UUID, TEXT, TEXT) TO authenticated;
