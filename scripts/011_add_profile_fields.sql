-- Add profile fields: department, study_year, roll_number
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS study_year TEXT,
ADD COLUMN IF NOT EXISTS roll_number TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.department IS 'User department/branch';
COMMENT ON COLUMN public.profiles.study_year IS 'User study year/semester';
COMMENT ON COLUMN public.profiles.roll_number IS 'User college roll number (optional)';
