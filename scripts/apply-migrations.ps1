# Migration runner for Supabase via direct Postgres connection
# Runs each migration file statement-by-statement (supabase CLI uses prepared statements,
# so multi-statement batches and leading '--' comments are not accepted).
# DB URL comes from SUPABASE_DB_URL env var (never hardcode credentials)

$ErrorActionPreference = "Continue"
$DB_URL = $env:SUPABASE_DB_URL
if (-not $DB_URL) {
    Write-Host "ERROR: Set SUPABASE_DB_URL (e.g. in .env.local) before running migrations." -ForegroundColor Red
    exit 1
}
$BASE = "$PSScriptRoot\..\data\migrations"

Get-ChildItem "$BASE\*.sql" | Sort-Object Name | ForEach-Object {
    Write-Host "=== Running migration $($_.Name) ===" -ForegroundColor Cyan
    $current = ""
    foreach ($line in Get-Content $_.FullName) {
        if ($line -match '^\s*--' -or $line -match '^\s*$') { continue }
        $current += $line + "`n"
        if ($line -match ';\s*$') {
            $stmt = $current.Trim()
            if ($stmt -notmatch '^BEGIN' -and $stmt -notmatch '^COMMIT') {
                $result = supabase db query --db-url $DB_URL $stmt 2>&1
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "ERROR: $result" -ForegroundColor Red
                    exit 1
                }
                Write-Host "OK" -ForegroundColor Green
            }
            $current = ""
        }
    }
}

Write-Host "Migrations complete" -ForegroundColor Green
