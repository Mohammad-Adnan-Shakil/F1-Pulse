-- Fix favorite_driver column for production deployment
-- This migration addresses the issue where User entity expects favorite_driver column but it doesn't exist in production database

-- Add column if it doesn't exist (safe operation)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'favorite_driver'
        AND table_schema = current_schema()
    ) THEN
        ALTER TABLE users ADD COLUMN favorite_driver VARCHAR(20);
    END IF;
END $$;

-- Add index if it doesn't exist (safe operation)
CREATE INDEX IF NOT EXISTS idx_users_favorite_driver ON users(favorite_driver);

-- Set default value for existing rows (optional, safe operation)
UPDATE users SET favorite_driver = NULL WHERE favorite_driver IS NULL;

COMMIT;
