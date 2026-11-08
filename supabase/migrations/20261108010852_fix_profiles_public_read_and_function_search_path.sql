-- Fix: profiles SELECT was restricted to authenticated only, but food_offers
-- and donations (both publicly readable) join to profiles for author info.
-- Anon visitors browsing offers/donations got a schema error on the join.
-- Allow anon to read profiles so the public list views work without login.

DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Fix function search_path warning from the security advisor.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
