-- Add favorite_driver column safely for production
-- Compatible with Flyway and PostgreSQL without procedural blocks

-- Add column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS favorite_driver VARCHAR(20);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_users_favorite_driver ON users(favorite_driver);
