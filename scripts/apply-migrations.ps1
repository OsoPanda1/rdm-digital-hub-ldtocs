# Migration runner for Supabase via direct Postgres connection
# Uses supabase CLI db query for each statement
# DB URL comes from SUPABASE_DB_URL env var (never hardcode credentials)

$DB_URL = $env:SUPABASE_DB_URL
if (-not $DB_URL) {
    Write-Host "ERROR: Set SUPABASE_DB_URL (e.g. in .env.local) before running migrations." -ForegroundColor Red
    exit 1
}
$BASE = "$PSScriptRoot\..\data\migrations"

function Run-Statements($file) {
    Write-Host "=== Running $file ===" -ForegroundColor Cyan
    Get-Content $file | ForEach-Object {
        # Skip comments and empty lines
        if ($_ -match '^\s*--' -or $_ -match '^\s*$' -or $_ -match '^\s*BEGIN;' -or $_ -match '^\s*COMMIT;') {
            return
        }
        # Build up multi-line statements
    }
}

# Run migration 001 - Isabella tables
Write-Host "=== Migration 001: Isabella Core Tables ===" -ForegroundColor Green

$statements = @(
    "CREATE EXTENSION IF NOT EXISTS pgcrypto",
    
    "CREATE TABLE IF NOT EXISTS isabella_sessions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid, session_key text, actor_id uuid, state jsonb, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now(), deleted_at timestamptz)",
    "CREATE INDEX IF NOT EXISTS idx_isabella_sessions_tenant ON isabella_sessions (tenant_id)",
    
    "CREATE TABLE IF NOT EXISTS isabella_messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), session_id uuid REFERENCES isabella_sessions(id) ON DELETE CASCADE, actor_id uuid, role text, content jsonb, sequence_no integer, created_at timestamptz DEFAULT now(), metadata jsonb)",
    "CREATE INDEX IF NOT EXISTS idx_isabella_messages_session ON isabella_messages (session_id)",
    
    "CREATE TABLE IF NOT EXISTS isabella_memory_items (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid, memory_scope text, session_id uuid, content text, content_json jsonb, source_type text, relevance numeric DEFAULT 0, expires_at timestamptz, checksum text, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now())",
    "CREATE INDEX IF NOT EXISTS idx_isabella_memory_scope ON isabella_memory_items (memory_scope)",
    
    "CREATE TABLE IF NOT EXISTS isabella_decisions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), decision_key text, session_id uuid REFERENCES isabella_sessions(id), summary text, confidence numeric, risk_level text, policy_status text, details jsonb, created_at timestamptz DEFAULT now())",
    
    "CREATE TABLE IF NOT EXISTS isabella_tools (name text PRIMARY KEY, description text, allowed boolean DEFAULT true, schema jsonb, created_at timestamptz DEFAULT now())",
    "CREATE TABLE IF NOT EXISTS isabella_tool_calls (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), decision_id uuid REFERENCES isabella_decisions(id), tool_name text REFERENCES isabella_tools(name), arguments jsonb, result jsonb, status text, created_at timestamptz DEFAULT now(), finished_at timestamptz)",
    
    "CREATE TABLE IF NOT EXISTS isabella_policies (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), policy_key text UNIQUE, description text, rules jsonb, version text, created_at timestamptz DEFAULT now())",
    "CREATE TABLE IF NOT EXISTS isabella_approvals (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), decision_id uuid REFERENCES isabella_decisions(id), approver_id uuid, status text, comment text, created_at timestamptz DEFAULT now())",
    
    "CREATE TABLE IF NOT EXISTS isabella_audit_logs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid, session_id uuid, actor_id uuid, event_type text, payload jsonb, trace_id text, created_at timestamptz DEFAULT now())"
)

foreach ($stmt in $statements) {
    Write-Host "Running: $($stmt.Substring(0, [Math]::Min(80, $stmt.Length)))..." -ForegroundColor Yellow
    $result = supabase db query --db-url $DB_URL $stmt 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: $result" -ForegroundColor Red
        exit 1
    }
    Write-Host "OK" -ForegroundColor Green
}

Write-Host "✓ Migration 001 complete" -ForegroundColor Green
