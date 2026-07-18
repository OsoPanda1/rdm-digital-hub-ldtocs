# AGENTS.md — Session State

## Objective
- "Protocolo de Congelamiento por Fases" — audit, test, freeze, deploy, hardening de todas las fases. App pública en producción con Vercel Authentication desactivado.
- URL: `https://rdm-digital-hub-ldtocs-3p3m56rwp-osopanda1-3342s-projects.vercel.app`
- Custom domains: `www.visitarealdelmonte.online`, `visitarealdelmonte.online`

## Completed
- **Fase 0–3**: YUN, DB Core, Data Gateway (38 tests), FederationBus (35 tests), Isabella (65 tests)
- **Fase 4**: Vercel deploy prebuilt + auth desactivado vía CLI (app pública HTTP 200)
- **Fase 5**: 43 tests frontend (gamification, music, validation, twins, time-theme)
- **Fase 6**: deps faltantes, vitest configs unificados, `auth.js`/`telemetry.js` → TS, `ai-text-demo/` eliminado

## Hardening (this session)
- Kernel health: `Math.random()` → hash determinístico
- FederationBus: OFFLINE status (< 0.2), `ruteToFed` → `routeToFed` (source + tests)
- Oath Isabella: patrones beneficencia + justicia agregados, `as keyof typeof` removido
- Middleware ISA: `as any` process.env → type-safe `Record<string, Record<string, string>>`
- Telemetry counter: `let` mutable global → closure encapsulado
- Vercel CSP: dominios Sentry removidos (no instalado)
- Sentry dead code: `initSentry()` removido de `main.tsx`
- `.vercelignore`: `public/weather-sandbox/` + `.env*` (excepto `env.example`), null rewrite removido

## Test Status (148/148 passing)
- YUN Core: `vitest run --config vitest.yun-core.config.ts` (67 tests)
- Data Gateway: `vitest run --config vitest.data-gateway.config.ts` (38 tests)
- Frontend: `vitest run --config vitest.frontend.config.ts` (43 tests)

## Known Issues (low priority)
- `@radix-ui/react-toast` unused (sonner es el toaster real)
- ~15 `as any` casts en tests y wasm interop (intencional)
- module-level state en algunos archivos (menor impacto)
- Magic numbers en telemeta.config.ts (10k, 80%, 10% — documentados)

## Shell
- Cygwin fork exhaustion crónico. Workaround: `node -e "child_process.execSync('cmd', {shell:'cmd.exe'})"`
- `exec bash --login` reinicia shell

## Remote
- `ldtocs` → `git@github.com:OsoPanda1/rdm-digital-hub-ldtocs.git`
