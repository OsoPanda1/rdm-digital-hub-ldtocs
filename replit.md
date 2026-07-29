# RDM Digital Hub — Real del Monte, Hidalgo

Sovereign Digital Infrastructure platform for Real del Monte: smart tourism, local commerce, AI assistant (Isabella), Cognitive Kernel, TAMV Podcast, gamification, YUN Constitutional Realm, and community services.

## Stack
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui (`artifacts/rdm-hub/`)
- **Backend:** Node.js 20 + Express 5 (`artifacts/api-server/`)
- **Database:** Supabase (PostgreSQL) + Drizzle ORM (`lib/`, `supabase/`)
- **Shared libs:** `lib/` (DB schema, Zod validators, React Query hooks, Isabella AI engine)

## How to run
- **Install deps:** `pnpm install` (root)
- **Frontend dev:** `pnpm --filter @workspace/rdm-hub run dev` (PORT 22942)
- **API dev:** `pnpm --filter @workspace/api-server run dev` (PORT 8080)
- Both are configured as Replit workflows and start automatically.

## Custom Domain: visitarealdelmonte.online
Production URL: `https://visitarealdelmonte.online`

### Step-by-step Deployment (Replit Shell)

```bash
# 1. Fix merge conflict if present (from GitHub web editor)
git fetch origin
git reset --hard origin/main

# 2. Set Replit Secrets (Settings → Secrets panel)
#    Required: DATABASE_URL, SUPABASE_JWT_SECRET, MEXA_API_SECURE_KEY, YUN_SIGNING_SECRET
#    Frontend: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

# 3. Install dependencies
pnpm install

# 4. Push schema to database (creates all 26 tables)
pnpm --filter @workspace/db run push

# 5. Build production
pnpm run build

# 6. Verify server starts
pnpm --filter @workspace/api-server run start
# Ctrl+C after verifying "listening" log
```

### Replit Dashboard Setup
1. Go to **Settings → Domains** in your Replit project
2. Click **Custom Domain** → enter `visitarealdelmonte.online`
3. Replit will show DNS records to configure at your registrar

### DNS Configuration (at your registrar)
Add these DNS records:
- **Type A** → Name: `@` → Value: Replit's IP (from dashboard)
- **Type CNAME** → Name: `www` → Value: your-replit-project.repl.co

### Environment Variables
The following env vars are configured in `.replit` userenv and are used at runtime:
- `ALLOWED_ORIGINS` — `https://visitarealdelmonte.online,https://www.visitarealdelmonte.online`
- `VITE_API_URL` — `/api/v1` (relative, same origin)
- `VITE_API_BASE_URL` — `/api/v1` (relative, same origin)
- `VITE_API_GATEWAY` — `/api` (relative, same origin)
- `VITE_SITE_URL` — `https://visitarealdelmonte.online`

### Automated Deployment
Run `bash scripts/deploy-production.sh` for automated pre-flight checks, schema push, and build.

## Required Replit Secrets
Add these in Replit Secrets panel. Server refuses to start without mandatory secrets.

### Mandatory (server crashes without these)
- `DATABASE_URL` — PostgreSQL connection string
- `MEXA_API_SECURE_KEY` — Mexa API federation mask signing key
- `YUN_SIGNING_SECRET` — YUN message bus HMAC signing key
- `SUPABASE_JWT_SECRET` — Supabase JWT verification secret (from Supabase Dashboard > Settings > API > JWT Secret). REQUIRED in production.

### Frontend
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public key

### Optional
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (backend admin operations)
- `ALLOWED_ORIGINS` — Comma-separated allowed CORS origins (production)
- `LOG_LEVEL` — Log level (default: info)

## Architecture Highlights
- **Isabella Cognitive Kernel:** 17-module cognitive OS (Meta-Reasoner, Capability Fabric, 7-level Memory, Planner, Verifier, Knowledge Graph, Confidence, Context, Learning, Security, Emergency, Simulation, Agent Coordinator, Evaluator)
- **YUN Constitutional Realm:** 8 immutable principles, OPA policy engine, PQC hybrid crypto (X25519+Ed25519, Kyber+Dilithium planned), 4-plane perception, resilience modes
- **THE C.R.O.W.N.:** 10 cognitive skills + BookPI telemetry + failover
- **30+ Kernel API endpoints** at `/api/kernel/*`
- **35+ YUN API endpoints** at `/api/yun/*`

## Security
- JWT auth at boundary (Supabase HS256, zero dependencies)
- Global rate limiting (100 req/min/IP)
- Role-based access control (RBAC) on all sensitive routes
- HSTS, CSP, COEP/COOP/CORP headers in production
- 30s request timeout (slowloris defense)
- Prototype pollution prevention in validation
- Environment validation at startup (fail-fast)

## Licensing
Unified framework — see LICENSE-TAMV-HUB.md (Contract) + LICENSE (MIT for source code):
- **MIT**: Source code (all components)
- **TAMV-HUB**: Data, content, AI models, territorial governance, service operation, digital identity

## User preferences
- Language: Spanish (project is for Real del Monte, Hidalgo, Mexico)
- Keep existing project structure and stack
- Priority features: gamification, virtual store, immersive maps, audio, messaging, municipal services, user/business registration, prizes
