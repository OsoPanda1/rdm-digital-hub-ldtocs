# Plan Maestro: Nodo Cero MD-X4

**Dominio:** `visitarealdelmonte.online`
**Presupuesto:** ≤ 25 USD/mes
**Fecha:** Julio 2026

---

## Resumen Ejecutivo

| Componente | Proveedor | Costo/mes | Rol |
|---|---|---|---|
| **Nodo Primario** | Hostinger KVM 2 | ≈$9 | Producción (Docker + Coolify) |
| **Nodo Standby** | Hetzner Cloud CX22 | ≈$5 | DR warm standby |
| **Backups Remotos** | Backblaze B2 | ≈$3 | 50-100 GB cifrados |
| **Dominio** | Hostinger | ≈$1.5 | visitarealdelmonte.online |
| **TOTAL** | | **≈$18.50** | **$6.50 margen** |

---

## Arquitectura

```
┌──────────────────────────────────────────────────────┐
│                 DNS (Hostinger Panel)                 │
│    visitarealdelmonte.online → IP nodo primario      │
│    api.visitarealdelmonte.online → IP nodo primario  │
└─────────────────────┬────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
     ┌────▼────┐           ┌────▼────┐
     │ PRIMARY │  pg_dump   │ STANDBY │
     │Hostinger│ ─────────► │Hetzner  │
     │ KVM 2   │  cada 6h   │ CX22    │
     │ 2v/8GB  │  via B2    │ 2v/4GB  │
     │ $9/mes  │            │ $5/mes  │
     └────┬────┘            └────┬────┘
          │                      │
     ┌────▼──────────────────────▼────┐
     │     Stack MD-X4 (Docker)       │
     │  ┌─────────┐  ┌──────────┐    │
     │  │ Traefik │  │PostgreSQL│    │
     │  │  (TLS)  │  │  16-alp  │    │
     │  └─────────┘  └──────────┘    │
     │  ┌─────────┐  ┌──────────┐    │
     │  │ API     │  │ Frontend │    │
     │  │ :8080   │  │ :22942   │    │
     │  └─────────┘  └──────────┘    │
     │  ┌─────────┐  ┌──────────┐    │
     │  │  Redis  │  │ Backup   │    │
     │  │ :6379   │  │ Worker   │    │
     │  └─────────┘  └──────────┘    │
     └───────────────────────────────┘
```

---

## Node Principal: Hostinger KVM 2

### Especificaciones
- **2 vCPU** AMD EPYC dedicados
- **8 GB RAM** DDR5
- **100 GB NVMe** SSD
- **8 TB** transferencia mensual
- **Ubuntu 24.04 LTS**

### Stack de software
1. **Docker Engine** + Docker Compose
2. **Coolify** (PaaS self-hosted) o docker-compose directo
3. **Traefik v3.3** — reverse proxy, TLS automático
4. **PostgreSQL 16** — base de datos principal
5. **Redis 7** — cache, rate limiting, sesiones
6. **RDM API** — Node/Express en puerto 8080
7. **RDM Frontend** — React/Vite en puerto 22942

### Instalación inicial

```bash
# 1. Conectar al VPS via SSH
ssh root@IP_HOSTINGER

# 2. Actualizar sistema
apt update && apt upgrade -y

# 3. Instalar Docker
curl -fsSL https://get.docker.com | sh

# 4. Instalar Docker Compose plugin
apt install -y docker-compose-plugin

# 5. Clonar repo
cd /opt
git clone https://github.com/OsoPanda1/rdm-digital-hub-ldtocs.git
cd rdm-digital-hub-ldtocs/deploy

# 6. Configurar variables
cp .env.example .env
nano .env  # Rellenar passwords, secrets, etc.

# 7. Generar hash bcrypt para dashboard
apt install -y apache2-utils
htpasswd -nB admin  # Copiar output a DASHBOARD_AUTH en .env

# 8. Crear acme.json
touch traefik/acme.json
chmod 600 traefik/acme.json

# 9. Desplegar
chmod +x scripts/*.sh
./scripts/deploy.sh --all
```

### DNS (panel Hostinger)

| Tipo | Nombre | Valor | TTL |
|---|---|---|---|
| A | @ | IP_HOSTINGER | 300 |
| A | www | IP_HOSTINGER | 300 |
| A | api | IP_HOSTINGER | 300 |
| A | traefik | IP_HOSTINGER | 300 |

---

## Node Standby: Hetzner CX22

### Especificaciones
- **2 vCPU** AMD EPYC compartidos
- **4 GB RAM**
- **40 GB SSD**
- **20 TB** transferencia
- **≈$5/mes**

### Configuración

```bash
# 1. Provisionar en Hetzner Cloud Console
#    - Ubuntu 24.04
#    - Región: Falkenstein (más barata)

# 2. Conectar SSH
ssh root@IP_HETZNER

# 3. Instalar Docker
curl -fsSL https://get.docker.com | sh

# 4. Clonar repo
cd /opt
git clone https://github.com/OsoPanda1/rdm-digital-hub-ldtocs.git
cd rdm-digital-hub-ldtocs/deploy

# 5. Configurar .env (mismo que primario)
cp .env.example .env
nano .env

# 6. No levantar servicios — solo mantener imagen lista
docker compose pull
```

### Procedimiento DR

```bash
# En caso de desastre en nodo primario:
cd /opt/rdm-digital-hub-ldtocs/deploy
./scripts/restore.sh

# Esto:
# 1. Descarga último backup de B2
# 2. Descifra y restaura PostgreSQL
# 3. Levanta todos los servicios
# 4. Actualiza DNS en Hostinger para apuntar a Hetzner
```

---

## Backups Remotos: Backblaze B2

### Configuración inicial

```bash
# 1. Crear cuenta en backblaze.com
# 2. Crear bucket: rdm-digital-hub-backups
# 3. Generar application key
# 4. Agregar credenciales a .env:
#    BACKUP_BUCKET=rdm-digital-hub-backups
#    BACKUP_KEY=tu_key_id
#    BACKUP_SECRET=tu_application_key
```

### Frecuencia
- **Cada 6 horas**: dump de PostgreSQL cifrado (AES-256-CBC)
- **Retención**: 30 días de backups locales, infinitos en B2
- **Costo estimado**: ≈$3/mes para 50-100 GB

### Verificar backups

```bash
# Ver último backup
docker compose exec backup-worker ls -la /backups/

# Descargar desde B2
b2 ls rdm-digital-hub-backups pg-dumps/
```

---

## Monitoreo y Healthchecks

### Endpoints de salud
- **API**: `https://api.visitarealdelmonte.online/healthz`
- **Frontend**: `https://visitarealdelmonte.online/`
- **Traefik Dashboard**: `https://traefik.visitarealdelmonte.online/`

### Docker healthchecks
Todos los servicios tienen healthchecks configurados:
- **Traefik**: ping cada 30s
- **API**: curl /healthz cada 30s
- **Frontend**: curl cada 30s
- **PostgreSQL**: pg_isready cada 30s
- **Redis**: PING cada 30s

### Comandos útiles

```bash
# Ver estado de servicios
docker compose ps

# Ver logs en tiempo real
docker compose logs -f

# Verificar un servicio específico
docker compose logs --tail=50 rdm-api

# Reiniciar un servicio
docker compose restart rdm-api

# Verificar certificados SSL
openssl s_client -connect visitarealdelmonte.online:443 -servername visitarealdelmonte.online
```

---

## Seguridad

### Checklist pre-producción
- [ ] `acme.json` permisos 600
- [ ] `.env` no versionado en Git
- [ ] Dashboard protegido con bcrypt auth
- [ ] Firewall (UFW/iptables) solo puertos 80, 443, 22
- [ ] SSH hardening (key-only, no password)
- [ ] Docker socket montado read-only
- [ ] `exposedByDefault: false` en Traefik
- [ ] Rate limiting en API
- [ ] CORS configurado con dominios exactos
- [ ] JWT secret fuerte (≥32 chars)
- [ ] DB password fuerte (≥16 chars)
- [ ] Backups cifrados con AES-256

### Firewall (UFW)

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (redirect a HTTPS)
ufw allow 443/tcp   # HTTPS
ufw enable
```

---

## Escalamiento

### Si el tráfico crece
1. **Vertical**: Upgrade Hostinger a KVM 4 ($13/mes, 4v/16GB)
2. **Horizontal**: Agregar segundo nodo Hetzner como worker
3. **CDN**: Cloudflare免费 plan para cachear frontend

### Si el presupuesto crece
- Hostinger KVM 4 ($13) + Hetzner CX32 ($8) + B2 ($3) = $24/mes
- O: Hostinger KVM 2 + Hetzner CX32 + managed Redis + B2 = $22/mes

---

## Comandos de Deploy

```bash
# Deploy completo (construir + migrar + reiniciar)
./scripts/deploy.sh --all

# Solo rebuild de imágenes
./scripts/deploy.sh --build

# Solo migraciones de DB
./scripts/deploy.sh --migrate

# Deploy rolling (sin downtime)
./scripts/deploy.sh

# Restore DR
./scripts/restore.sh
```

---

## Costo Mensual Detallado

| Item | Costo | Notas |
|---|---|---|
| Hostinger KVM 2 | $8.79 | 2v/8GB/100GB NVMe |
| Hetzner CX22 | $4.59 | 2v/4GB/40GB SSD |
| Backblaze B2 | $2.70 | 50GB × $0.006/GB |
| Dominio .online | $1.50 | Renovación prorrateada |
| **Subtotal** | **$17.58** | |
| **Margen disponible** | **$7.42** | Para variaciones |

### Notas de precio
- Hostinger: precio promocional 24 meses ($8.79/mes), renewal $14.99/mes
- Hetzner: precio estable, sin renewal hike
- Backblaze: pay-per-use, escala lineal
- Dominio: ~$15/año para .online

---

## Runbook de Emergencia

### Scenario 1: Nodo primario caído
```bash
# 1. Actualizar DNS en Hostinger para apuntar a Hetzner
# 2. En Hetzner:
cd /opt/rdm-digital-hub-ldtocs/deploy
./scripts/restore.sh
# 3. Verificar: curl https://visitarealdelmonte.online
```

### Scenario 2: Base de datos corrupta
```bash
# 1. Detener API
docker compose stop rdm-api

# 2. Restaurar último dump
./scripts/restore.sh backups/rdm_YYYYMMDD_HHMMSS.sql.gz.enc

# 3. Reiniciar API
docker compose start rdm-api
```

### Scenario 3: Certificados SSL expirados
```bash
# 1. Borrar certificados viejos
rm traefik/acme.json
touch traefik/acme.json
chmod 600 traefik/acme.json

# 2. Reiniciar Traefik
docker compose restart traefik

# 3. Verificar logs
docker compose logs -f traefik | grep -i acme
```

---

*Plan Maestro MD-X4 v1.0 — Julio 2026*
*Presupuesto total: ≤25 USD/mes | Stack: Docker + Traefik + PostgreSQL*
