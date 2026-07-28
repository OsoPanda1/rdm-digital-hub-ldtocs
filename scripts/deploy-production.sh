#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
#  RDM Digital Hub — Production Deployment Script
#  Run on Replit Shell after merging main and setting Replit Secrets.
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

echo "═══ RDM Production Deployment ═══"

# ── 1. Pre-flight checks ──
echo ""
echo "▸ Checking required environment variables..."
REQUIRED_VARS=("DATABASE_URL" "SUPABASE_JWT_SECRET" "MEXA_API_SECURE_KEY" "YUN_SIGNING_SECRET")
MISSING=()
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    MISSING+=("$var")
  fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "  ✗ Missing required Replit Secrets:"
  for m in "${MISSING[@]}"; do
    echo "    - $m"
  done
  echo ""
  echo "  Add them in: Replit → Settings → Secrets"
  exit 1
fi
echo "  ✓ All required secrets present"

# ── 2. Pull latest code ──
echo ""
echo "▸ Pulling latest code..."
git fetch origin
CURRENT=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
if [ "$CURRENT" != "$REMOTE" ]; then
  echo "  Local is behind. Resetting to origin/main..."
  git reset --hard origin/main
else
  echo "  ✓ Already up to date"
fi

# ── 3. Install dependencies ──
echo ""
echo "▸ Installing dependencies..."
pnpm install --frozen-lockfile

# ── 4. Sync database schema ──
echo ""
echo "▸ Pushing Drizzle schema to database..."
pnpm --filter @workspace/db run push
echo "  ✓ Database schema synced"

# ── 5. Build production ──
echo ""
echo "▸ Building production artifacts..."
pnpm run build
echo "  ✓ Build complete"

# ── 6. Verify custom domain ──
echo ""
echo "▸ Custom domain status:"
echo "  Target: https://visitarealdelmonte.online"
echo "  If not configured yet:"
echo "    1. Replit → Settings → Domains → Custom Domain"
echo "    2. Enter: visitarealdelmonte.online"
echo "    3. Configure DNS at your registrar (CNAME → your-repl.repl.co)"

# ── 7. Verify Replit Secrets for custom domain ──
echo ""
echo "▸ Verifying domain-related secrets..."
DOMAIN_VARS=("ALLOWED_ORIGINS" "VITE_SITE_URL")
for var in "${DOMAIN_VARS[@]}"; do
  if [ -n "${!var:-}" ]; then
    echo "  ✓ $var = ${!var}"
  else
    echo "  ⚠ $var not set (using .replit userenv defaults)"
  fi
done

echo ""
echo "═══ Deployment Ready ═══"
echo "  Frontend:  PORT 22942"
echo "  API:       PORT 8080 at /api"
echo "  Domain:    https://visitarealdelmonte.online"
echo "═══════════════════════════"
