# Seed runner for Supabase via direct Postgres connection
# Uses --file because seed files begin with '--' comment lines that the CLI
# would otherwise parse as flags.
# DB URL comes from SUPABASE_DB_URL env var (never hardcode credentials)

$ErrorActionPreference = "Continue"
$DB_URL = $env:SUPABASE_DB_URL
if (-not $DB_URL) {
    Write-Host "ERROR: Set SUPABASE_DB_URL (e.g. in .env.local) before running seed." -ForegroundColor Red
    Write-Host "TIP: read -r 'export SUPABASE_DB_URL=...' | pnpm db:seed" -ForegroundColor Yellow
    exit 1
}
$BASE = "$PSScriptRoot\..\data\seed"

Get-ChildItem "$BASE\*.sql" | Sort-Object Name | ForEach-Object {
    Write-Host "=== Seeding $($_.Name) ===" -ForegroundColor Cyan
    $result = supabase db query --db-url $DB_URL --file $_.FullName 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: $result" -ForegroundColor Red
        exit 1
    }
    Write-Host "OK" -ForegroundColor Green
}

Write-Host "Seed complete" -ForegroundColor Green
