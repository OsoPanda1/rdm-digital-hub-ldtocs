#!/bin/bash
# SPDX-License-Identifier: MIT
# RDM Digital Hub — VPS Bootstrap (Ubuntu 24.04)
# Run as root on fresh VPS: bash bootstrap-vps.sh
set -euo pipefail

echo "═══════════════════════════════════════════════════════════"
echo " RDM Digital Hub — VPS Bootstrap (Node Cero MD-X4)"
echo "═══════════════════════════════════════════════════════════"

# ─── Detect IPv4 & System Update ────────────────────────────────────────────
SERVER_IP=$(curl -4 -s ifconfig.me || hostname -I | awk '{print $1}')
echo "Server IP: $SERVER_IP"

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

# ─── Swap (1GB) — prevent OOM on small VPS ──────────────────────────
echo "[5/8] Configuring swap..."
if ! swapon --show | grep -q .; then
  fallocate -l 1G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "  ✓ 1GB swap created"
else
  echo "  ✓ Swap already active"
fi

# ─── Fail2ban ────────────────────────────────────────────────────────
echo "[6/8] Installing fail2ban..."
apt-get install -y -qq fail2ban
if [ -f /etc/fail2ban/jail.conf ]; then
  cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22
EOF
  systemctl enable fail2ban
  systemctl restart fail2ban
  echo "  ✓ fail2ban configured (5 retries → 1h ban)"
fi

# ─── SSH Hardening ────────────────────────────────────────────────────
echo "[7/8] Hardening SSH..."
SSHD_CONFIG=/etc/ssh/sshd_config
if grep -q "^PermitRootLogin" "$SSHD_CONFIG"; then
  sed -i 's/^PermitRootLogin.*/PermitRootLogin prohibit-password/' "$SSHD_CONFIG"
else
  echo "PermitRootLogin prohibit-password" >> "$SSHD_CONFIG"
fi
if grep -q "^PasswordAuthentication" "$SSHD_CONFIG"; then
  sed -i 's/^PasswordAuthentication.*/PasswordAuthentication no/' "$SSHD_CONFIG"
else
  echo "PasswordAuthentication no" >> "$SSHD_CONFIG"
fi
systemctl restart sshd
echo "  ✓ SSH hardened (root key-only, no passwords)"

# ─── Install useful tools ────────────────────────────────────────────
echo "[8/8] Installing utilities..."
apt-get install -y -qq git curl htop tmux unattended-upgrades

# ─── Firewall ─────────────────────────────────────────────────────────
echo "Configuring firewall..."
if command -v ufw &>/dev/null; then
  ufw allow 22/tcp   # SSH
  ufw allow 80/tcp   # HTTP
  ufw allow 443/tcp  # HTTPS
  ufw --force enable
fi

# ─── Create deploy directory ─────────────────────────────────────────
echo "Setting up deployment directory..."
DEPLOY_DIR="/opt/rdm-digital-hub"
mkdir -p "$DEPLOY_DIR"
chown rdm-deploy:rdm-deploy "$DEPLOY_DIR"

# ─── Clone repo ──────────────────────────────────────────────────────
echo "Cloning repository..."
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

# ─── Unattended upgrades (auto security patches) ────────────────────
cat > /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
echo "  ✓ Unattended upgrades enabled"

# ─── Summary ──────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════"
echo " Bootstrap complete!"
echo " Server IP: $SERVER_IP"
echo ""
echo " Next steps:"
echo " 1. ssh rdm-deploy@$SERVER_IP  (from your local machine)"
echo " 2. cd $DEPLOY_DIR"
echo " 3. cp deploy/.env.example deploy/.env"
echo " 4. nano deploy/.env        ← fill in ALL secrets"
echo " 5. sudo -u rdm-deploy bash deploy/scripts/deploy.sh --all"
echo ""
echo " For GitHub Actions deploy:"
echo "   Add secrets to GitHub repo:"
echo "     Settings → Secrets → Actions → New repository secret"
echo "     - VPS_SSH_KEY:     SSH private key for rdm-deploy"
echo "     - VPS_HOST:        $SERVER_IP"
echo "     - VPS_KNOWN_HOSTS: 'ssh-keyscan -H $SERVER_IP' output"
echo "═══════════════════════════════════════════════════════════"
