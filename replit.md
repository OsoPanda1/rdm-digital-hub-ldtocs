# RDM Digital Hub — LDTOCS

Plataforma de soberanía digital, turismo inteligente e infraestructura federada para comunidades. Implementado inicialmente para Real del Monte, Pueblo Mágico de Hidalgo, México.

## Run & Operate

- `pnpm --filter @workspace/rdm-hub run dev` — frontend (port 22942)
- `pnpm --filter @workspace/api-server run dev` — API server (port 5000)
- `pnpm run typecheck` — full typecheck
- `pnpm run build` — typecheck + build
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind CSS 4 + shadcn/ui
- Routing: react-router-dom (lazy-loaded pages)
- State: TanStack React Query + Zustand
- Auth: Supabase Auth (PKCE)
- DB: PostgreSQL + Drizzle ORM
- Maps: Leaflet + React-Leaflet + Supercluster
- IA: Isabella (pipeline de conciencia propia)
- API: Express 5 + Zod validation
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/rdm-hub/` — Frontend React principal (~110 páginas)
- `artifacts/api-server/` — API Express
- `lib/db/` — Esquemas Drizzle ORM
- `lib/api-client-react/` — Cliente API generado
- `lib/api-spec/` — Especificación OpenAPI
- `lib/api-zod/` — Esquemas Zod de la API
- `.replit` — Configuración del workspace Replit

## Architecture decisions

- **Soberanía primero**: Sin dependencia de plataformas cerradas, todo open source (MIT).
- **Modularidad**: Cada feature (turismo, mapas, IA, gamificación) es un módulo independiente.
- **Federación**: Protocolo YUN para conectar comunidades entre sí.
- **Seguridad por diseño**: Doble hexágono de autorización, criptografía post-cuántica.
- **Layout unificado**: RDMLayout como único layout activo (Fase 1 completada).

## Product

- Guía turística digital completa para Real del Monte (mapa, rutas, eventos, gastronomía, historia)
- Asistente IA Isabella con identidad y memoria
- Sistema de membresías (Free → Premium → Advance → Enterprise)
- Directorio de comercios con registro y checkout
- Mapa interactivo con POIs, clusters y territorial data fusion
- Gamificación: puntos, quests, leaderboard
- Wiki/Enciclopedia TAMV
- Portal de música y audio espacial
- Panel de administración

## User preferences

- Usar `pnpm` siempre (nunca npm o yarn)
- TypeScript estricto: evitar `any`, prohibido `@ts-nocheck`
- React 19: no usar `forwardRef` (obsoleto), no importar `React`
- Tailwind CSS 4: usar `@theme` en lugar de `@apply`
- Commits en español (conventional commits)

## Gotchas

- Git Bash en Windows tiene problemas de fork(); usar PowerShell o WSL
- No borrar `pnpm-lock.yaml` manualmente
- `pnpm minimumReleaseAge: 1440` — esperar 1 día para paquetes nuevos
- Los archivos `src/app/api/` son Next.js legacy (Fase 1 pending cleanup)
- `src/data/imported/` contiene datos duplicados (Fase 1 pending cleanup)

## Pointers

- [README.md](./README.md) — visión completa, arquitectura, deuda técnica
- [CONTRIBUTING.md](./CONTRIBUTING.md) — guía de contribución
- [SECURITY.md](./SECURITY.md) — política de seguridad
- [RFC-0001-MANIFEST.md](./RFC-0001-MANIFEST.md) — Manifiesto de licenciamiento híbrido, estatuto constitutivo y blindaje jurídico-técnico
- [LICENSE-HYBRID.md](./LICENSE-HYBRID.md) — Marco de licenciamiento por capas
- [LICENSE-PRCL.md](./LICENSE-PRCL.md) — TAMV‑PRCL v1.0 (Propietario, Secreto Industrial)
- [LICENSE-EOL.md](./LICENSE-EOL.md) — TAMV‑EOL v1.0 (Licencia Ética Isabella)
- [LICENSE-KORIMA.md](./LICENSE-KORIMA.md) — TAMV‑KÓRIMA (Bienes públicos con reciprocidad)
- [DATA-SOVEREIGNTY-DPA.md](./DATA-SOVEREIGNTY-DPA.md) — Soberanía de datos
- `pnpm-workspace.yaml` — catálogo de versiones y overrides de seguridad
