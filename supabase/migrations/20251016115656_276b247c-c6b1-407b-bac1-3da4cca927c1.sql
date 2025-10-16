-- Ensure user initialization function to create profile and default role on first login
CREATE OR REPLACE FUNCTION public.ensure_user_initialized()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create minimal profile if missing (email/full_name are optional in schema)
  INSERT INTO public.profiles (id)
  VALUES (auth.uid())
  ON CONFLICT (id) DO NOTHING;

  -- Assign default 'customer' role if missing
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'customer')
  ON CONFLICT DO NOTHING;
END;
$$;
