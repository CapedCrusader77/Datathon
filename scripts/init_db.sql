-- POLICEGPT Database Initialization Script
-- PostgreSQL schema bootstrap

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For full-text search
CREATE EXTENSION IF NOT EXISTS "vector";   -- For pgvector (optional)

-- Enable UUID default
ALTER DATABASE policegpt_db SET timezone = 'Asia/Kolkata';

-- Insert seed data for Karnataka districts
INSERT INTO districts (id, name, code, created_at) VALUES
  (gen_random_uuid(), 'Bangalore Urban', 'BLR-U', NOW()),
  (gen_random_uuid(), 'Bangalore Rural', 'BLR-R', NOW()),
  (gen_random_uuid(), 'Mysore', 'MYS', NOW()),
  (gen_random_uuid(), 'Hubli-Dharwad', 'HBL', NOW()),
  (gen_random_uuid(), 'Mangalore', 'MNG', NOW()),
  (gen_random_uuid(), 'Belgaum', 'BLG', NOW()),
  (gen_random_uuid(), 'Gulbarga', 'GLB', NOW()),
  (gen_random_uuid(), 'Tumkur', 'TMK', NOW()),
  (gen_random_uuid(), 'Davangere', 'DVG', NOW()),
  (gen_random_uuid(), 'Shimoga', 'SMG', NOW()),
  (gen_random_uuid(), 'Raichur', 'RCR', NOW()),
  (gen_random_uuid(), 'Kolar', 'KLR', NOW())
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_firs_status ON firs(status);
CREATE INDEX IF NOT EXISTS idx_firs_category ON firs(category);
CREATE INDEX IF NOT EXISTS idx_firs_district ON firs(district_id);
CREATE INDEX IF NOT EXISTS idx_firs_date ON firs(date_filed);
CREATE INDEX IF NOT EXISTS idx_firs_urgency ON firs(urgency_score DESC);
CREATE INDEX IF NOT EXISTS idx_suspects_risk ON suspects(risk_level);
CREATE INDEX IF NOT EXISTS idx_audit_officer ON audit_logs(officer_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_session ON conversation_history(session_id, timestamp);

-- Full text search index on FIR descriptions
CREATE INDEX IF NOT EXISTS idx_firs_description_gin ON firs USING GIN(to_tsvector('english', COALESCE(description, '')));
