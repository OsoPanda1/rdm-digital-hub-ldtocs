#!/bin/sh
##############################################################################
# RDM Digital Hub — Backup Worker
# Ejecuta dumps de PostgreSQL cifrados y sube a Backblaze B2
# Frecuencia: cada 6 horas (configurable via cron del contenedor)
# SPDX-License-Identifier: MIT
##############################################################################

set -eu

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="${BACKUP_DIR}/rdm_${TIMESTAMP}.sql.gz.enc"
LATEST_LINK="${BACKUP_DIR}/latest.sql.gz.enc"

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $1"; }

# ─── Esperar a que PostgreSQL esté listo ───────────────────────────────────
log "Esperando a PostgreSQL..."
until pg_isready -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" -q; do
  sleep 2
done
log "PostgreSQL listo."

# ─── Dump + compresión + cifrado ────────────────────────────────────────────
log "Iniciando backup: ${TIMESTAMP}"
pg_dump -h "$PGHOST" -U "$PGUSER" -d "$PGDATABASE" \
  --format=custom \
  --compress=9 \
  --verbose 2>/dev/null \
| openssl enc -aes-256-cbc -salt -pbkdf2 \
  -pass env:DB_PASSWORD \
  -out "$DUMP_FILE"

chmod 600 "$DUMP_FILE"
ln -sf "$DUMP_FILE" "$LATEST_LINK"

DUMP_SIZE=$(du -h "$DUMP_FILE" | cut -f1)
log "Backup completado: ${DUMP_FILE} (${DUMP_SIZE})"

# ─── Subir a Backblaze B2 (si están configuradas las credenciales) ──────────
if [ -n "${BACKUP_KEY:-}" ] && [ -n "${BACKUP_SECRET:-}" ]; then
  log "Subiendo a Backblaze B2..."
  
  # Instalar b2 CLI si no existe
  if ! command -v b2 >/dev/null 2>&1; then
    pip install --quiet --no-cache-dir b2 >/dev/null 2>&1
  fi
  
  b2 authorize-account "$BACKUP_KEY" "$BACKUP_SECRET" >/dev/null 2>&1
  
  # Subir dump
  b2 upload-file "$BACKUP_BUCKET" "$DUMP_FILE" "pg-dumps/$(basename $DUMP_FILE)" >/dev/null 2>&1
  
  # Subir latest link
  b2 upload-file "$BACKUP_BUCKET" "$LATEST_LINK" "pg-dumps/latest.sql.gz.enc" --delete-if-present >/dev/null 2>&1
  
  log "Upload a B2 completado."
else
  log "B2 no configurado, backup local solamente."
fi

# ─── Limpiar backups antiguos ──────────────────────────────────────────────
RETENTION=${BACKUP_RETENTION_DAYS:-30}
log "Limpiando backups > ${RETENTION} días..."
find "$BACKUP_DIR" -name "rdm_*.sql.gz.enc" -mtime "+${RETENTION}" -delete 2>/dev/null || true
log "Limpieza completada."

# ─── Reportar tamaño total de backups locales ──────────────────────────────
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "rdm_*.sql.gz.enc" 2>/dev/null | wc -l)
log "Estado: ${BACKUP_COUNT} backups, ${TOTAL_SIZE} total"

log "Ciclo de backup finalizado."
