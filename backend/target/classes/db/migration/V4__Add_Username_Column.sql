ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE NOT NULL DEFAULT '';

-- Update existing users to have username based on their email (part before @)
UPDATE users 
SET username = SUBSTRING(email, 1, POSITION('@' IN email) - 1)
WHERE username = '' OR username IS NULL;
