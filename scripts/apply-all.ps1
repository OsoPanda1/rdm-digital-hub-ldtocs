# Applies migrations + seeds to the project database and verifies row counts.
# Reads SUPABASE_DB_URL (or POSTGRES_PASSWORD_POSTGRES_URL_NON_POOLING) from apps/rdm-hub/.env.local
# or from the SUPABASE_DB_URL env var if set.

$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot

$dbUrl = $env:SUPABASE_DB_URL
if (-not $dbUrl) {
    $lines = Get-Content "$root\apps\rdm-hub\.env.local"
    foreach ($line in $lines) {
        if ($line -match '^POSTGRES_PASSWORD_POSTGRES_URL_NON_POOLING="?(.+)"?$') { $dbUrl = $Matches[1] }
        if ($line -match '^SUPABASE_DB_URL="?(.+)"?$') { $dbUrl = $Matches[1] }
    }
}
if (-not $dbUrl) { Write-Host "ERROR: SUPABASE_DB_URL not found in env or .env.local" -ForegroundColor Red; exit 1 }
$env:SUPABASE_DB_URL = $dbUrl

Write-Host ("Using DB: " + $dbUrl.Substring(0, [Math]::Min(45, $dbUrl.Length)) + "...") -ForegroundColor Yellow

& "$root\scripts\apply-migrations.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }
& "$root\scripts\apply-seed.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "`n########## VERIFY ##########" -ForegroundColor Green
foreach ($table in @("places", "businesses", "events", "routes", "isabella_messages")) {
    $r = supabase db query --db-url $dbUrl "SELECT count(*) AS $table FROM public.$table" 2>$null
    Write-Host "$table : $r"
}

Write-Host "`n-- sample place --" -ForegroundColor Green
$r = supabase db query --db-url $dbUrl "SELECT name, cat, lat, lng, address FROM public.places LIMIT 3" 2>$null
Write-Host $r

Write-Host "`nDONE" -ForegroundColor Green
