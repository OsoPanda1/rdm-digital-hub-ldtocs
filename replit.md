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
- **YUN Constitutional Realm:** 8 immutable principles, OPA policy engine, PQC hybrid crypto (Kyber+Dilithium), 4-plane perception, resilience modes
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

## User preferences
- Language: Spanish (project is for Real del Monte, Hidalgo, Mexico)
- Keep existing project structure and stack
- Priority features: gamification, virtual store, immersive maps, audio, messaging, municipal services, user/business registration, prizes
