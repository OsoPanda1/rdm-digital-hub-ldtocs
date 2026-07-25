# Despliegue e Infraestructura

**Versión:** 1.0.0

---

## Ambientes

| Ambiente | URL | Propósito |
|----------|-----|-----------|
| **Development** | `localhost:3000` | Desarrollo local |
| **Staging** | `staging.tamv.net` | QA y testing |
| **Production** | `api.tamv.net` | Producción |
| **Radio** | `localhost` (AzuraCast) | TAMV 92.5 FM |

---

## Stack de Despliegue

| Componente | Tecnología | Ubicación |
|-----------|-----------|-----------|
| API Server | Node.js 20 + Express | Replit |
| Frontend | React 19 + Vite 7 | Replit |
| Database | PostgreSQL (Helium) | Replit / Supabase |
| Radio | AzuraCast Docker | WSL Ubuntu (local) |
| CDN | Replit Object Storage | 5 buckets |
| Git | GitHub | OsoPanda1/rdm-digital-hub-ldtocs |

---

## Variables de Entorno Obligatorias

```bash
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=disable

# AzuraCast Radio
AZURACAST_URL=http://localhost:8000
AZURACAST_API_KEY=your-key
AZURACAST_STATION=tamv925

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.com

# Admin (auto-role on login)
ADMIN_EMAIL=tamvonlinenetwork@outlook.es
```

---

## Replit Deployment

### Configuración Replit
- **Runtime:** Node.js 20
- **Package Manager:** pnpm (workspaces)
- **Build:** `pnpm install && pnpm build`
- **Run:** `pnpm start` o `node dist/index.js`
- **Port:** 3000 (configurable)
- **Health Check:** `GET /api/health`

### Replit Secrets (en el panel de Replit)
```
DATABASE_URL=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
AZURACAST_API_KEY=...
```

### Replit Object Storage Buckets
| Bucket | Propósito |
|--------|-----------|
| `rdm-assets` | Imágenes, videos, banners |
| `rdm-audio` | Archivos de audio (radio) |
| `rdm-docs` | Documentos del patrimonio |
| `rdm-xr` | Escenas XR/USDZ/GLTF |
| `rdm-backups` | Backups de datos |

---

## AzuraCast Deployment (Local)

### Docker Compose (WSL Ubuntu)
```bash
# Iniciar
wsl -d Ubuntu -e sudo service docker start
wsl -d Ubuntu -e docker compose -f /var/azuracast/docker-compose.yml up -d

# Verificar
wsl -d Ubuntu -e docker ps

# Logs
wsl -d Ubuntu -e docker logs azuracast --tail 50
```

### Puertos
| Puerto | Servicio |
|--------|---------|
| 80 | Web UI (HTTP) |
| 443 | Web UI (HTTPS) |
| 8000 | Stream de audio + API |
| 8005 | Additional streaming |
| 2022 | SFTP (archivos) |

### Credenciales
- **Admin:** admin / tamv-rdm-2026
- **Timezone:** America/Mexico_City

---

## Database Migrations

```bash
# Generar migración
pnpm db:generate

# Aplicar migración
pnpm db:migrate

# Studio (UI para ver datos)
pnpm db:studio
```

### Tablas Principales
| Tabla | Propósito |
|-------|-----------|
| `citizens` | Usuarios del ecosistema |
| `citizen_roles` | Roles por federación |
| `isabella_sessions` | Sesiones de conversación |
| `isabella_messages` | Mensajes de Isabella |
| `isabella_knowledge` | Base de conocimiento |
| `isabella_decisions` | Decision Records |
| `isabella_memory` | Memoria persistente |
| `isabella_evaluation_results` | Resultados de evaluación |
| `living_world_players` | Jugadores del Living World |
| `living_world_achievements` | Logros desbloqueados |
| `wiki_articles` | Artículos de la wiki |

---

## Backup Strategy

| Dato | Método | Frecuencia |
|------|--------|-----------|
| PostgreSQL | pg_dump | Diario |
| Replit State | Replit built-in | Continuo |
| AzuraCast | docker volume backup | Semanal |
| Git | GitHub remote | Continuo |
| Object Storage | Replit built-in | Continuo |

---

## Scaling Notes

Isabella está diseñada para escalar verticalmente (más RAM/CPU en Replit) antes que horizontalmente. Para escalar horizontalmente:

1. **API Server:** Stateless, puede replicarse detrás de load balancer
2. **Database:** Read replicas para PostgreSQL
3. **Memory Fabric:** Redis para cache distribuido
4. **AzuraCast:** Un solo instancia por estación de radio
5. **BookPI:** Append-only, puede sharding por federationId
