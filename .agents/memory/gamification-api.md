---
name: Gamification API Routes
description: Live gamification REST endpoints in api-server; mock data until Supabase wired.
---

## Rule
The gamification API lives in `artifacts/api-server/src/routes/gamification.ts` and is registered in `routes/index.ts`. All 5 endpoints return mock data until Supabase/Drizzle is connected.

## Endpoints
- `GET /api/v1/gamification/profile` — XP, rank, nextRank, streak, badges
- `GET /api/v1/gamification/leaderboard` — top 7 players
- `GET /api/v1/gamification/quests` — mission list with progress
- `POST /api/v1/gamification/award-xp` — body: { userId, amount, reason }
- `GET /api/v1/gamification/ranks` — all rank tier definitions

## Rank tiers (XP thresholds)
Visitante (0) → Explorador (100) → Minero (500) → Cronista (1500) → Guardián (4000) → Leyenda RDM (10000)

**Why:** GamificationHUD in the navbar polls `/api/v1/gamification/profile` on every page load. When this endpoint was missing, every page load produced a 404 in API logs and the HUD showed no data.

**How to apply:** When adding Supabase, replace the `buildMockProfile` function in gamification.ts with real DB queries via Drizzle. The endpoint shape must stay identical (the frontend types match it).
