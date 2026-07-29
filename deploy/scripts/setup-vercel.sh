#!/bin/bash
# RDM Digital Hub — Vercel Setup
# Uso: bash deploy/scripts/setup-vercel.sh
# Pre-requisito: Node.js, pnpm, y vercel CLI instalado (npm i -g vercel)
set -euo pipefail

echo "═══ RDM Digital Hub — Vercel Setup ═══"
echo ""

# ─── 1. Login ───
echo "[1/3] Logging in to Vercel..."
vercel login

# ─── 2. Deploy frontend ───
echo "[2/3] Deploying frontend to Vercel..."
cd artifacts/rdm-hub
vercel --prod --yes
cd ../..

echo "  ✓ Frontend deployed"

# ─── 3. Configure domain ───
echo "[3/3] Configuring custom domain..."
echo "  Run these commands AFTER deployment:"
echo ""
echo "  vercel domains add visitarealdelmonte.online"
echo "  vercel domains add www.visitarealdelmonte.online"
echo ""
echo " Then add the following DNS records at your registrar:"
echo "  visitarealdelmonte.online   CNAME   cname.vercel-dns.com"
echo "  www.visitarealdelmonte.online CNAME cname.vercel-dns.com"
echo ""
echo "═══ Setup complete ═══"
echo "  Dashboard: vercel --dashboard"
echo "═══════════════════════"
