-- Add practitioner columns to diagnostics table
ALTER TABLE diagnostics 
ADD COLUMN IF NOT EXISTS practitioner_id text,
ADD COLUMN IF NOT EXISTS practitioner_name text;

-- Create index for practitioner queries
CREATE INDEX IF NOT EXISTS idx_diagnostics_practitioner ON diagnostics(practitioner_id);

