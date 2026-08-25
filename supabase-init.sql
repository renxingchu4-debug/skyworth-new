-- ============================================================
-- SKYWORTH Central America - Supabase Table Initialization
-- Run this SQL ONCE in: Supabase Dashboard → SQL Editor → New query → Paste → Run
-- This script is idempotent (safe to re-run).
-- ============================================================

-- 1. Main data tables (JSONB-backed)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS mallItems (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User-linked tables (have relational columns for SQL queries in Supabase Dashboard)
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  user_id TEXT,
  user_name TEXT,
  province TEXT,
  store TEXT,
  course_id TEXT,
  course_title TEXT,
  passed BOOLEAN,
  answer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS surveys (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  user_id TEXT,
  user_name TEXT,
  province TEXT,
  store TEXT,
  tv_model TEXT,
  prize TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "learningRecords" (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  user_id TEXT,
  user_name TEXT,
  province TEXT,
  store TEXT,
  course_id TEXT,
  course_title TEXT,
  specialization_id TEXT,
  video_progress FLOAT,
  video_completed BOOLEAN,
  quiz_completed BOOLEAN,
  points_earned INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS redemptions (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  user_id TEXT,
  user_name TEXT,
  province TEXT,
  store TEXT,
  item_id TEXT,
  item_name TEXT,
  cost INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "salesRecords" (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  user_id TEXT,
  user_name TEXT,
  province TEXT,
  store TEXT,
  model TEXT,
  barcode_number TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_created ON surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_records_created ON "salesRecords"(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_records_user_id ON "salesRecords"(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_created ON "learningRecords"(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_records_user_id ON "learningRecords"(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON attempts(user_id);

-- 4. Helper RPC for server-side table creation (called by server.js as a fallback)
-- This lets server.js auto-create tables in future projects via RPC
CREATE OR REPLACE FUNCTION exec_sql(p_sql TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE p_sql;
END;
$$;
-- Allow service_role to call this RPC
GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO service_role;

-- ============================================================
-- DONE. All 8 tables + indexes + exec_sql RPC are now ready.
-- ============================================================
