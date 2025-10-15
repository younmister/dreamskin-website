/*
  # Create Dream Skin Diagnostic System Database

  ## Overview
  This migration creates the complete database schema for the Dream Skin client diagnostic application.

  ## New Tables

  ### `clients`
  Stores all client information shared across all diagnostic types.
  - `id` (uuid, primary key) - Unique client identifier
  - `first_name` (text, required) - Client's first name
  - `last_name` (text, required) - Client's last name
  - `date_of_birth` (date, required) - Client's date of birth
  - `phone` (text, required) - Client's phone number (formatted)
  - `email` (text, required) - Client's email address
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### `diagnostics`
  Stores all diagnostic records for all service types (Massage, Skincare, Head Spa).
  - `id` (uuid, primary key) - Unique diagnostic identifier
  - `client_id` (uuid, foreign key) - References clients table
  - `diagnostic_type` (text, required) - Type: 'massage', 'skincare', or 'headspa'
  - `answers` (jsonb, required) - All diagnostic answers stored as JSON
  - `signature_data` (text) - Base64 encoded signature image
  - `created_at` (timestamptz) - Diagnostic creation timestamp
  - `completed_at` (timestamptz) - When diagnostic was completed

  ## Security
  - RLS enabled on all tables
  - Public access for read/write (as this is a single-location iPad app)
  - Future: Can be restricted to authenticated users if auth is added

  ## Indexes
  - Client search by name
  - Diagnostic filtering by type and date
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create diagnostics table
CREATE TABLE IF NOT EXISTS diagnostics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  diagnostic_type text NOT NULL CHECK (diagnostic_type IN ('massage', 'skincare', 'headspa')),
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  signature_data text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_diagnostics_client ON diagnostics(client_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_type ON diagnostics(diagnostic_type);
CREATE INDEX IF NOT EXISTS idx_diagnostics_created ON diagnostics(created_at DESC);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (single-location iPad app)
-- Note: For production with auth, these should be restricted to authenticated users

CREATE POLICY "Allow public read access to clients"
  ON clients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to clients"
  ON clients FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to clients"
  ON clients FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to diagnostics"
  ON diagnostics FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to diagnostics"
  ON diagnostics FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to diagnostics"
  ON diagnostics FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();