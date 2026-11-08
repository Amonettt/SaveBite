-- Allow anon (not-logged-in) visitors to create/update/delete offers and
-- donations attributed to the demo admin user, so all features work
-- without signing in.

CREATE POLICY "Anon can create offers as demo user"
  ON food_offers FOR INSERT
  TO anon
  WITH CHECK (user_id = 'bb679753-d1bc-4055-acd0-fc8d2adea0d9');

CREATE POLICY "Anon can update demo user offers"
  ON food_offers FOR UPDATE
  TO anon
  USING (user_id = 'bb679753-d1bc-4055-acd0-fc8d2adea0d9')
  WITH CHECK (user_id = 'bb679753-d1bc-4055-acd0-fc8d2adea0d9');

CREATE POLICY "Anon can delete demo user offers"
  ON food_offers FOR DELETE
  TO anon
  USING (user_id = 'bb679753-d1bc-4055-acd0-fc8d2adea0d9');

CREATE POLICY "Anon can create donations as demo user"
  ON donations FOR INSERT
  TO anon
  WITH CHECK (donor_id = 'bb679753-d1bc-4055-acd0-fc8d2adea0d9');

CREATE POLICY "Anon can update demo user donations"
  ON donations FOR UPDATE
  TO anon
  USING (donor_id = 'bb679753-d1bc-4055-acd0-fc8d2adea0d9')
  WITH CHECK (donor_id = 'bb679753-d1bc-4055-acd0-fc8d2adea0d9');

CREATE POLICY "Anon can delete demo user donations"
  ON donations FOR DELETE
  TO anon
  USING (donor_id = 'bb679753-d1bc-4055-acd0-fc8d2adea0d9');
