# Deploy RDM Digital Hub — Fly.io + Vercel (100% gratis)

## Stack

```
visitarealdelmonte.online
  ├── Frontend → Vercel (React/Vite, CDN global, HTTPS gratis)
  ├── API      → Fly.io (Express 5, Docker, sin sleep)
  └── DB       → Supabase (PostgreSQL gratis, ya existente)
```

## 1. Prerrequisitos

Instalar en tu máquina:

```bash
# Fly.io CLI
curl -L https://fly.io/install.sh | sh

# Vercel CLI
npm install -g vercel

# Ya deberías tener Node.js y pnpm
```

## 2. Configurar secrets

```bash
cd C:\Users\tamvo\rdm-digital-hub-ldtocs
cp deploy/.env.example deploy/.env
```

Edita `deploy/.env` y llena **todos** los valores:
- `DB_PASSWORD` — pass de tu DB en Supabase
- `SUPABASE_JWT_SECRET` — de Supabase Dashboard → Settings → API → JWT Secret
- `MEXA_API_SECURE_KEY` — genera una clave fuerte: `openssl rand -hex 32`
- `YUN_SIGNING_SECRET` — genera otra: `openssl rand -hex 32`

## 3. Desplegar API (Fly.io)

```bash
bash deploy/scripts/setup-fly.sh
```

Esto:
- Inicia sesión en Fly.io
- Crea la app `rdm-api`
- Sube todos los secrets desde `deploy/.env`
- Crea un volumen persistente de 1GB
- Despliega el Dockerfile

Después, configura el dominio:
```bash
flyctl certs add api.visitarealdelmonte.online
```
Sigue las instrucciones para agregar el CNAME en tu DNS.

## 4. Desplegar Frontend (Vercel)

**Opción A — CLI:**
```bash
bash deploy/scripts/setup-vercel.sh
```

**Opción B — Dashboard (más fácil):**
1. Ve a https://vercel.com
2. New Project → Import Git Repository → `OsoPanda1/rdm-digital-hub-ldtocs`
3. Root Directory: `artifacts/rdm-hub`
4. Framework Preset: **Vite**
5. Build Command: `pnpm install --frozen-lockfile && pnpm --filter @workspace/rdm-hub run build`
6. Output Directory: `dist`
7. Deploy

Después del deploy:
- Ve a Project Settings → Domains
- Agrega `visitarealdelmonte.online`
- Agrega `www.visitarealdelmonte.online`
- Sigue las instrucciones de DNS

## 5. DNS

En tu registrador (donde compraste el dominio), configura:

```
visitarealdelmonte.online    CNAME → cname.vercel-dns.com
www.visitarealdelmonte.online CNAME → cname.vercel-dns.com
api.visitarealdelmonte.online  CNAME → rdm-api.fly.dev
```

## 6. Verificar

```bash
# API
curl https://api.visitarealdelmonte.online/healthz

# Frontend
curl https://visitarealdelmonte.online
```

## Dashboard

- **Vercel**: https://vercel.com (logs, deploy history, domains)
- **Fly.io**: `flyctl dashboard` (logs, metrics, scaling)
- **Supabase**: https://supabase.com (DB, auth, storage)
