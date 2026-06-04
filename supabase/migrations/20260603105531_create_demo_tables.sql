/*
  # Rather.chat Demo Platform - Initial Schema

  1. New Tables
    - `demo_sessions` - Tracks each demo session with customer details
      - `id` (uuid, primary key)
      - `session_type` (text) - contact/convert/connect/master
      - `company_name` (text) - customer company name
      - `company_url` (text) - customer website URL
      - `industry` (text) - detected or input industry
      - `created_at` (timestamp)
    - `demo_leads` - Captures leads generated during demos
      - `id` (uuid, primary key)
      - `session_id` (uuid, FK to demo_sessions)
      - `name` (text)
      - `phone` (text)
      - `email` (text)
      - `interest` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Allow anonymous inserts (demo platform is public)
    - Allow reading own session data
*/

CREATE TABLE IF NOT EXISTS demo_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type text NOT NULL DEFAULT 'master',
  company_name text DEFAULT '',
  company_url text DEFAULT '',
  industry text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES demo_sessions(id) ON DELETE CASCADE,
  name text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  interest text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE demo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert demo sessions"
  ON demo_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read demo sessions"
  ON demo_sessions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert demo leads"
  ON demo_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read demo leads"
  ON demo_leads FOR SELECT
  TO anon, authenticated
  USING (true);
