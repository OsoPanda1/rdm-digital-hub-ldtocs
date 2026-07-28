#!/bin/bash
# SPDX-License-Identifier: MIT
# RDM Digital Hub — VPS Bootstrap (Ubuntu 24.04)
# Run as root on fresh VPS: bash bootstrap-vps.sh
set -euo pipefail

echo "═══════════════════════════════════════════════════════════"
echo " RDM Digital Hub — VPS Bootstrap (Node Cero MD-X4)"
echo "═══════════════════════════════════════════════════════════"

# ─── System Update ────────────────────────────────────────────────────
echo "[1/8] System update..."
apt-get update -qq && apt-get upgrade -y -qq

# ─── Install Docker ───────────────────────────────────────────────────
echo "[2/8] Installing Docker..."
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

# ─── Install Docker Compose ───────────────────────────────────────────
echo "[3/8] Installing Docker Compose..."
if ! docker compose version &>/dev/null; then
  apt-get install -y docker-compose-plugin
fi

# ─── Create deploy user ──────────────────────────────────────────────
echo "[4/8] Creating deploy user..."
if ! id rdm-deploy &>/dev/null; then
  useradd -m -s /bin/bash rdm-deploy
  usermod -aG docker rdm-deploy
  echo "rdm-deploy ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/docker-compose" > /etc/sudoers.d/rdm-deploy
fi

# ─── Install useful tools ────────────────────────────────────────────
echo "[5/8] Installing utilities..."
apt-get install -y -qq git curl htop tmux unattended-upgrades

# ─── Firewall ─────────────────────────────────────────────────────────
echo "[6/8] Configuring firewall..."
if command -v ufw &>/dev/null; then
  ufw allow 22/tcp   # SSH
  ufw allow 80/tcp   # HTTP
  ufw allow 443/tcp  # HTTPS
  ufw --force enable
fi

# ─── Create deploy directory ─────────────────────────────────────────
echo "[7/8] Setting up deployment directory..."
DEPLOY_DIR="/opt/rdm-digital-hub"
mkdir -p "$DEPLOY_DIR"
chown rdm-deploy:rdm-deploy "$DEPLOY_DIR"

# ─── Clone repo ──────────────────────────────────────────────────────
echo "[8/8] Cloning repository..."
cd "$DEPLOY_DIR"
if [ ! -d .git ]; then
  sudo -u rdm-deploy git clone https://github.com/OsoPanda1/rdm-digital-hub-ldtocs.git .
fi

# ─── Log rotation ────────────────────────────────────────────────────
cat > /etc/logrotate.d/rdm-digital-hub << 'EOF'
/opt/rdm-digital-hub/deploy/logs/*.log {
  daily
  missingok
  rotate 14
  compress
  delaycompress
  notifempty
  create 0640 rdm-deploy rdm-deploy
}
EOF

echo ""
echo "═══════════════════════════════════════════════════════════"
echo " Bootstrap complete!"
echo ""
echo " Next steps:"
echo " 1. cd $DEPLOY_DIR"
echo " 2. cp deploy/.env.example deploy/.env"
echo " 3. Edit deploy/.env with your secrets"
echo " 4. sudo -u rdm-deploy bash deploy/scripts/deploy.sh --all"
echo "═══════════════════════════════════════════════════════════"
