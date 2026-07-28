#!/bin/bash
##############################################################################
# RDM Digital Hub — DR Restore Script
# Ejecutar en el nodo standby (Hetzner) para restaurar desde B2
# Uso: ./restore.sh [backup-file]
##############################################################################

set -euo pipefail

RESTORE_DIR="/tmp/rdm-restore"
BACKUP_FILE="${1:-}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${BLUE}[$(date +%H:%M:%S)]${NC} $1"; }
ok()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; }

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# ─── Verificar .env ────────────────────────────────────────────────────────
if [ ! -f .env ]; then
  err ".env no encontrado. Configura las variables de backup."
  exit 1
fi

set -a
source .env
set +a

# ─── Descargar último backup de B2 ─────────────────────────────────────────
mkdir -p "$RESTORE_DIR"

if [ -z "$BACKUP_FILE" ]; then
  log "📦 Descargando último backup de Backblaze B2..."
  
  if ! command -v b2 &> /dev/null; then
    pip install --quiet --no-cache-dir b2
  fi
  
  b2 authorize-account "$BACKUP_KEY" "$BACKUP_SECRET" >/dev/null 2>&1
  
  # Listar y descargar el más reciente
  LATEST=$(b2 ls --long "$BACKUP_BUCKET" "pg-dumps/latest.sql.gz.enc" 2>/dev/null | tail -1 | awk '{print $NF}')
  
  if [ -z "$LATEST" ]; then
    err "No se encontró backup en B2"
    exit 1
  fi
  
  b2 download-file-by-name "$BACKUP_BUCKET" "pg-dumps/latest.sql.gz.enc" \
    -o "${RESTORE_DIR}/latest.sql.gz.enc" >/dev/null 2>&1
  
  BACKUP_FILE="${RESTORE_DIR}/latest.sql.gz.enc"
  ok "Backup descargado: $(du -h "$BACKUP_FILE" | cut -f1)"
fi

# ─── Descifrar y restaurar ─────────────────────────────────────────────────
log "🔄 Restaurando base de datos..."

# Detener API temporalmente
docker compose stop rdm-api 2>/dev/null || true

# Descifrar dump
DUMP_DECRYPTED="${RESTORE_DIR}/restore.sql.gz"
openssl enc -aes-256-cbc -d -salt -pbkdf2 \
  -pass env:DB_PASSWORD \
  -in "$BACKUP_FILE" \
  -out "$DUMP_DECRYPTED"

# Restaurar en PostgreSQL
gunzip -c "$DUMP_DECRYPTED" | docker compose exec -T postgres \
  psql -U rdm -d rdm_db --single-transaction 2>&1

# Limpiar
rm -f "$DUMP_DECRYPTED"

ok "Base de datos restaurada"

# ─── Reiniciar servicios ───────────────────────────────────────────────────
log "🔄 Reiniciando servicios..."
docker compose up -d

sleep 10

# Health check
if curl -sf "http://localhost:8080/healthz" >/dev/null 2>&1; then
  ok "API restaurada y funcionando"
else
  warn "API iniciándose, verificar logs: docker compose logs rdm-api"
fi

# ─── Limpiar ───────────────────────────────────────────────────────────────
rm -rf "$RESTORE_DIR"

echo ""
ok "✅ Restauración DR completada"
log "🌐 Verificar: https://${SITE_HOST:-visitarealdelmonte.online}"
