-- Create telemetry cache table for multi-layer caching strategy
-- This table stores telemetry data with session and driver context
-- Cache keys use format: sessionKey_driverNumber (e.g., "9158_1")

CREATE TABLE telemetry_cache (
    id IDENTITY PRIMARY KEY,
    session_key VARCHAR(50) NOT NULL,           -- e.g., "9158"
    driver_number INTEGER NOT NULL,           -- e.g., 1, 2, 3
    meeting_key VARCHAR(20) NOT NULL,        -- e.g., "1217"
    telemetry_json CLOB NOT NULL,             -- Complete telemetry data (TEXT for H2, JSONB for PostgreSQL)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite index for efficient cache lookups
    UNIQUE (session_key, driver_number)
);

-- Add indexes for performance
CREATE INDEX idx_telemetry_cache_session_driver ON telemetry_cache(session_key, driver_number);
CREATE INDEX idx_telemetry_cache_created_at ON telemetry_cache(created_at);
CREATE INDEX idx_telemetry_cache_last_accessed ON telemetry_cache(last_accessed);
