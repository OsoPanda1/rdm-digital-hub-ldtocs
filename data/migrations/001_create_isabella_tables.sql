-- Migration: Isabella core tables (minimal viable)
-- Run this in Supabase/Postgres (use your migrations tooling)

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Sessions
CREATE TABLE IF NOT EXISTS isabella_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  session_key text,
  actor_id uuid,
  state jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_isabella_sessions_tenant ON isabella_sessions (tenant_id);

-- Messages / turns
CREATE TABLE IF NOT EXISTS isabella_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES isabella_sessions(id) ON DELETE CASCADE,
  actor_id uuid,
  role text, -- 'user' | 'system' | 'assistant' | 'tool'
  content jsonb,
  sequence_no integer,
  created_at timestamptz DEFAULT now(),
  metadata jsonb
);

CREATE INDEX IF NOT EXISTS idx_isabella_messages_session ON isabella_messages (session_id);

-- Memory items
CREATE TABLE IF NOT EXISTS isabella_memory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  memory_scope text, -- immediate|session|project|territorial|historical
  session_id uuid,
  content text,
  content_json jsonb,
  source_type text, -- user|system|event|summary
  relevance numeric DEFAULT 0,
  expires_at timestamptz,
  checksum text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_isabella_memory_scope ON isabella_memory_items (memory_scope);

-- Decisions
CREATE TABLE IF NOT EXISTS isabella_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_key text,
  session_id uuid REFERENCES isabella_sessions(id),
  summary text,
  confidence numeric,
  risk_level text, -- low|medium|high
  policy_status text, -- allowed|denied|requires_approval
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Tool catalog + calls
CREATE TABLE IF NOT EXISTS isabella_tools (
  name text PRIMARY KEY,
  description text,
  allowed boolean DEFAULT true,
  schema jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS isabella_tool_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id uuid REFERENCES isabella_decisions(id),
  tool_name text REFERENCES isabella_tools(name),
  arguments jsonb,
  result jsonb,
  status text, -- pending|running|success|error
  created_at timestamptz DEFAULT now(),
  finished_at timestamptz
);

-- Policies and approvals
CREATE TABLE IF NOT EXISTS isabella_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_key text UNIQUE,
  description text,
  rules jsonb,
  version text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS isabella_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id uuid REFERENCES isabella_decisions(id),
  approver_id uuid,
  status text, -- pending|approved|rejected
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS isabella_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  session_id uuid,
  actor_id uuid,
  event_type text,
  payload jsonb,
  trace_id text,
  created_at timestamptz DEFAULT now()
);

COMMIT;
