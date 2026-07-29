#!/bin/bash
# RDM Digital Hub — Fly.io Setup
# Uso: bash deploy/scripts/setup-fly.sh
# Pre-requisito: flyctl instalado (https://fly.io/docs/hands-on/install-flyctl/)
set -euo pipefail

echo "═══ RDM Digital Hub — Fly.io Setup ═══"
echo ""

# ─── 1. Login ───
echo "[1/5] Logging in to Fly.io..."
flyctl auth login

# ─── 2. Create app ───
echo "[2/5] Creating Fly.io app..."
if ! flyctl apps list 2>/dev/null | grep -q rdm-api; then
  flyctl apps create rdm-api --org personal
  echo "  ✓ App 'rdm-api' created"
else
  echo "  ✓ App 'rdm-api' already exists"
fi

# ─── 3. Set secrets ───
echo "[3/5] Setting secrets from deploy/.env..."
if [ ! -f deploy/.env ]; then
  echo "  ⚠ deploy/.env not found. Create it first:"
  echo "    cp deploy/.env.example deploy/.env && nano deploy/.env"
  exit 1
fi

set -a
source deploy/.env
set +a

flyctl secrets set \
  DATABASE_URL="$DATABASE_URL" \
  SUPABASE_JWT_SECRET="$SUPABASE_JWT_SECRET" \
  MEXA_API_SECURE_KEY="$MEXA_API_SECURE_KEY" \
  YUN_SIGNING_SECRET="$YUN_SIGNING_SECRET" \
  ALLOWED_ORIGINS="https://visitarealdelmonte.online,https://www.visitarealdelmonte.online" \
  JWT_EXPECTED_AUDIENCE="${JWT_EXPECTED_AUDIENCE:-authenticated}" \
  JWT_EXPECTED_ISSUER="${JWT_EXPECTED_ISSUER:-}" \
  OPENAI_API_KEY="${OPENAI_API_KEY:-}" \
  OPENAI_MODEL="${OPENAI_MODEL:-gpt-4o-mini}"

echo "  ✓ Secrets set on Fly.io"

# ─── 4. Create volume ───
echo "[4/5] Creating persistent volume..."
if ! flyctl volumes list 2>/dev/null | grep -q rdm_data; then
  flyctl volumes create rdm_data --region iad --size 1
  echo "  ✓ Volume 'rdm_data' created (1GB)"
else
  echo "  ✓ Volume 'rdm_data' already exists"
fi

# ─── 5. Deploy ───
echo "[5/5] Deploying to Fly.io..."
flyctl deploy --dockerfile artifacts/api-server/Dockerfile

echo ""
echo "═══ Setup complete ═══"
echo "  App:    https://rdm-api.fly.dev"
echo "  Admin:  flyctl dashboard"
echo ""
echo " Next step: configure domain"
echo "  flyctl certs add api.visitarealdelmonte.online"
echo "═══════════════════════"
