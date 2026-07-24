# RDM Digital Hub — Real del Monte, Hidalgo

Sovereign Digital Infrastructure platform for Real del Monte: smart tourism, local commerce, AI assistant (Isabella), TAMV 92.5 radio, gamification, and community services.

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

## Required Secrets
Add these in Replit Secrets to enable auth and data features:
- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — your Supabase service role key (backend only)
- `AZURACAST_URL` — AzuraCast radio server URL (optional, for live radio)
- `AZURACAST_API_KEY` — AzuraCast API key (optional)

## User preferences
- Language: Spanish (project is for Real del Monte, Hidalgo, Mexico)
- Keep existing project structure and stack
- Priority features: gamification, virtual store, immersive maps, audio, messaging, municipal services, user/business registration, prizes
