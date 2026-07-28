#!/bin/bash
# SPDX-License-Identifier: MIT
# RDM Digital Hub — Standalone Health Check
set -euo pipefail

SITE_URL="${SITE_URL:-https://visitarealdelmonte.online}"
API_URL="${API_URL:-https://api.visitarealdelmonte.online}"
DOMAINS=("$SITE_URL" "$API_URL")

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "═══════════════════════════════════════════════════════════"
echo " RDM Digital Hub — Health Check"
echo " $(date)"
echo "═══════════════════════════════════════════════════════════"

ALL_OK=true

for url in "${DOMAINS[@]}"; do
  HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
  if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 400 ]; then
    echo -e " ${GREEN}✓${NC} $url — HTTP $HTTP_CODE"
  elif [ "$HTTP_CODE" = "000" ]; then
    echo -e " ${RED}✗${NC} $url — UNREACHABLE"
    ALL_OK=false
  else
    echo -e " ${YELLOW}!${NC} $url — HTTP $HTTP_CODE"
    ALL_OK=false
  fi
done

# Check API health endpoint specifically
API_HEALTH=$(curl -sf --max-time 10 "$API_URL/healthz" 2>/dev/null || echo '{"ok":false}')
if echo "$API_HEALTH" | grep -q '"ok":true\|"ok": true'; then
  echo -e " ${GREEN}✓${NC} API health: OK"
else
  echo -e " ${RED}✗${NC} API health: FAIL"
  ALL_OK=false
fi

echo ""
if [ "$ALL_OK" = true ]; then
  echo -e " ${GREEN}All checks passed${NC}"
  exit 0
else
  echo -e " ${RED}Some checks failed${NC}"
  exit 1
fi
