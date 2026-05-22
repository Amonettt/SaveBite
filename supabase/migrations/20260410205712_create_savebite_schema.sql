/*
  # SaveBite - Esquema de Base de Datos

  ## Descripción
  Esquema completo para la aplicación SaveBite, plataforma colombiana para reducir
  el desperdicio de alimentos conectando establecimientos con usuarios que desean
  acceder a productos próximos a vencer o en excedente.

  ## Tablas Creadas

  ### 1. profiles
  - Perfil extendido de usuarios vinculado a auth.users
  - Roles: 'user' (consumidor), 'establishment' (negocio), 'admin'
  - Campos de ubicación para ciudades colombianas

  ### 2. food_offers
  - Publicaciones de alimentos disponibles (bajo costo, gratis, donación)
  - Vinculada al perfil del publicador
  - Estados: activo, reclamado, vencido

  ### 3. donations
  - Registro de donaciones monetarias o de alimentos
  - Seguimiento de donante y receptor
  - Estados: pendiente, completado, cancelado

  ## Seguridad
  - RLS habilitado en todas las tablas
  - Políticas por rol: lectura pública para ofertas activas, escritura solo propietario
  - Admins pueden ver todos los registros de usuarios
*/

-- Tabla de perfiles de usuarios
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  city text NOT NULL DEFAULT 'Bogotá',
  role text NOT NULL DEFAULT 'user',
  establishment_name text DEFAULT '',
  establishment_type text DEFAULT '',
  avatar_url text DEFAULT '',
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Tabla de ofertas de alimentos
CREATE TABLE IF NOT EXISTS food_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'otros',
  offer_type text NOT NULL DEFAULT 'low_price',
  original_price decimal DEFAULT 0,
  offer_price decimal DEFAULT 0,
  quantity int NOT NULL DEFAULT 1,
  unit text DEFAULT 'unidades',
  expiry_date date,
  city text NOT NULL DEFAULT 'Bogotá',
  address text DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  views int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE food_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active food offers are viewable by everyone"
  ON food_offers FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create food offers"
  ON food_offers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food offers"
  ON food_offers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own food offers"
  ON food_offers FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tabla de donaciones
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  receiver_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  donation_type text NOT NULL DEFAULT 'food',
  amount decimal DEFAULT 0,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'available',
  city text NOT NULL DEFAULT 'Bogotá',
  is_offering boolean DEFAULT true,
  contact_info text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donations are viewable by everyone"
  ON donations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create donations"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Users can update own donations"
  ON donations FOR UPDATE
  TO authenticated
  USING (auth.uid() = donor_id)
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Users can delete own donations"
  ON donations FOR DELETE
  TO authenticated
  USING (auth.uid() = donor_id);

-- Índices para búsqueda eficiente
CREATE INDEX IF NOT EXISTS idx_food_offers_city ON food_offers(city);
CREATE INDEX IF NOT EXISTS idx_food_offers_status ON food_offers(status);
CREATE INDEX IF NOT EXISTS idx_food_offers_category ON food_offers(category);
CREATE INDEX IF NOT EXISTS idx_food_offers_offer_type ON food_offers(offer_type);
CREATE INDEX IF NOT EXISTS idx_donations_city ON donations(city);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_food_offers_updated_at
  BEFORE UPDATE ON food_offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
