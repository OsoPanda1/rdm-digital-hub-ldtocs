#!/bin/bash
##############################################################################
# RDM Digital Hub — Deploy Script (Produccion)
# Ejecutar en el VPS primario (Hostinger KVM 2)
# Uso: ./deploy.sh [--build] [--migrate] [--restart]
# SPDX-License-Identifier: MIT
##############################################################################

set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="${DEPLOY_DIR}/deploy.log"

# ─── Colores ───────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${BLUE}[$(date +%H:%M:%S)]${NC} $1" | tee -a "$LOG_FILE"; }
ok()   { echo -e "${GREEN}[✓]${NC} $1" | tee -a "$LOG_FILE"; }
warn() { echo -e "${YELLOW}[!]${NC} $1" | tee -a "$LOG_FILE"; }
err()  { echo -e "${RED}[✗]${NC} $1" | tee -a "$LOG_FILE"; }

# ─── Argumentos ────────────────────────────────────────────────────────────
BUILD=false
MIGRATE=false
RESTART=false

for arg in "$@"; do
  case $arg in
    --build)   BUILD=true ;;
    --migrate) MIGRATE=true ;;
    --restart) RESTART=true ;;
    --all)     BUILD=true; MIGRATE=true; RESTART=true ;;
    --help)
      echo "Uso: ./deploy.sh [--build] [--migrate] [--restart] [--all]"
      echo "  --build    Reconstruir imágenes Docker"
      echo "  --migrate  Ejecutar migraciones de DB"
      echo "  --restart  Forzar reinicio de todos los servicios"
      echo "  --all      Todo lo anterior"
      exit 0
      ;;
  esac
done

cd "$DEPLOY_DIR"

# ─── Pre-flight checks ────────────────────────────────────────────────────
log "🚀 RDM Digital Hub — Deploy Pipeline"
log "Directorio: $DEPLOY_DIR"
echo ""

# Verificar .env
if [ ! -f .env ]; then
  err "Archivo .env no encontrado. Copia .env.example a .env y configura."
  exit 1
fi

# Verificar docker-compose
if [ ! -f docker-compose.yml ]; then
  err "docker-compose.yml no encontrado."
  exit 1
fi

# Verificar Docker
if ! command -v docker &> /dev/null; then
  err "Docker no instalado. Ejecuta: curl -fsSL https://get.docker.com | sh"
  exit 1
fi

if ! docker compose version &> /dev/null; then
  err "Docker Compose no disponible."
  exit 1
fi

ok "Docker $(docker --version | awk '{print $3}') disponible"

# Verificar acme.json
if [ ! -f traefik/acme.json ]; then
  log "Creando acme.json..."
  touch traefik/acme.json
  chmod 600 traefik/acme.json
  ok "acme.json creado con permisos 600"
fi

# ─── Validate secrets (block placeholders) ────────────────────────────────
PLACEHOLDER_VALUES=("CHANGE_ME" "your-" "placeholder")
SECRET_VARS=("DB_PASSWORD" "SUPABASE_JWT_SECRET" "MEXA_API_SECURE_KEY" "YUN_SIGNING_SECRET")
SECRETS_OK=true
for var in "${SECRET_VARS[@]}"; do
  val="${!var:-}"
  for ph in "${PLACEHOLDER_VALUES[@]}"; do
    if [[ "$val" == *"$ph"* ]]; then
      err "$var contiene valor placeholder '$ph' — actualiza deploy/.env antes de desplegar"
      SECRETS_OK=false
      break
    fi
  done
done
if [ "$SECRETS_OK" = false ]; then
  exit 1
fi
ok "Secrets validated"

# ─── Source .env ───────────────────────────────────────────────────────────
set -a
source .env
set +a

# ─── Build ─────────────────────────────────────────────────────────────────
if [ "$BUILD" = true ]; then
  log "📦 Construyendo imágenes..."
  docker compose build --no-cache 2>&1 | tee -a "$LOG_FILE"
  ok "Imágenes construidas"
fi

# ─── Migration ─────────────────────────────────────────────────────────────
if [ "$MIGRATE" = true ]; then
  log "🔄 Ejecutando migraciones de base de datos..."
  
  # Verificar que PostgreSQL esté corriendo
  if ! docker compose exec -T postgres pg_isready -U rdm -d rdm_db -q 2>/dev/null; then
    warn "PostgreSQL no está listo aún, esperando..."
    sleep 10
  fi
  
  # Drizzle migrate (si el contenedor de API existe)
  if docker compose ps rdm-api | grep -q "running"; then
    docker compose exec -T rdm-api npx drizzle-kit push --force 2>&1 | tee -a "$LOG_FILE"
    ok "Migraciones aplicadas"
  else
    warn "API no está corriendo, saltando migraciones"
  fi
fi

# ─── Restart / Pull ────────────────────────────────────────────────────────
if [ "$RESTART" = true ]; then
  log "🔄 Reiniciando servicios..."
  docker compose down --remove-orphans
  docker compose up -d
  ok "Servicios reiniciados"
else
  log "🔄 Actualizando servicios (rolling)..."
  docker compose pull 2>&1 | tee -a "$LOG_FILE" || true
  docker compose up -d --remove-orphans 2>&1 | tee -a "$LOG_FILE"
  ok "Servicios actualizados"
fi

# ─── Post-deploy health checks ────────────────────────────────────────────
log "⏳ Esperando a que los servicios arranquen..."
sleep 15

HEALTHY=true

# Verificar Traefik
if docker compose exec -T traefik traefik healthcheck --ping >/dev/null 2>&1; then
  ok "Traefik: healthy"
else
  err "Traefik: unhealthy"
  HEALTHY=false
fi

# Verificar API
if curl -sf "http://localhost:8080/healthz" >/dev/null 2>&1; then
  ok "API: healthy"
elif curl -sf "https://${API_HOST:-api.visitarealdelmonte.online}/healthz" >/dev/null 2>&1; then
  ok "API: healthy (via HTTPS)"
else
  warn "API: healthcheck no alcanzable externamente (puede necesitar DNS)"
fi

# Verificar Frontend
if curl -sf "https://${SITE_HOST:-visitarealdelmonte.online}/" >/dev/null 2>&1; then
  ok "Frontend: healthy"
else
  warn "Frontend: healthcheck no alcanzable (puede necesitar DNS/TLS)"
fi

# Verificar PostgreSQL
if docker compose exec -T postgres pg_isready -U rdm -d rdm_db -q 2>/dev/null; then
  ok "PostgreSQL: healthy"
else
  err "PostgreSQL: unhealthy"
  HEALTHY=false
fi

# Verificar Redis
if docker compose exec -T redis redis-cli ping 2>/dev/null | grep -q "PONG"; then
  ok "Redis: healthy"
else
  warn "Redis: no responde"
fi

# ─── Resumen ───────────────────────────────────────────────────────────────
echo ""
if [ "$HEALTHY" = true ]; then
  ok "✅ Deploy completado exitosamente"
else
  warn "⚠️  Deploy completado con advertencias"
fi

# Mostrar estado
echo ""
log "📊 Estado de servicios:"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null

echo ""
log "🌐 URLs:"
log "  Frontend:  https://${SITE_HOST:-visitarealdelmonte.online}"
log "  API:       https://${API_HOST:-api.visitarealdelmonte.online}"
log "  Dashboard: https://${DASHBOARD_HOST:-traefik.visitarealdelmonte.online}"
echo ""
log "📋 Logs: docker compose logs -f [servicio]"
