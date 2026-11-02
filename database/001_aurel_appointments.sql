-- AUREL Dermatology: private appointment request storage.
-- Run only in a clinic-controlled Supabase project after reviewing this migration.
-- This script does not alter any existing CRM/real-estate tables.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS public.aurel_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 8 AND 20),
  email text CHECK (email IS NULL OR char_length(email) <= 160),
  service text NOT NULL CHECK (service IN ('acne-care','pigmentation','laser-treatments','hair-scalp','skin-rejuvenation','chemical-peels','general')),
  preferred_date date NOT NULL,
  preferred_time text NOT NULL CHECK (preferred_time IN ('Morning','Afternoon','Evening')),
  consent_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','contacted','confirmed','completed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS aurel_appointments_created_at_idx ON public.aurel_appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS aurel_appointments_status_idx ON public.aurel_appointments(status,preferred_date);
ALTER TABLE public.aurel_appointments ENABLE ROW LEVEL SECURITY;
-- No public or authenticated policies: server-side service_role is the ONLY access path.
REVOKE ALL ON public.aurel_appointments FROM anon, authenticated;
GRANT ALL ON public.aurel_appointments TO service_role;
NOTIFY pgrst, 'reload schema';
COMMIT;
