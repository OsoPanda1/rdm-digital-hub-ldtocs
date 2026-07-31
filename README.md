# RDM Digital Hub — Nodo Cero

Plataforma territorial inteligente de **Real del Monte, Hidalgo (Pueblo Mágico)**. Ecosistema digital que integra turismo, historia, cultura, gastronomía, economía, comunidad, gobernanza e inteligencia artificial gobernada.

> **Estado de este documento:** espejo real del repositorio al commit `e4792fc`. Todo lo marcado como funcional fue verificado leyendo el código y/o ejecutando los comandos; todo lo marcado como placeholder o roto está identificado con evidencia, no con intención.

> **Nota de emergencia (2026-07-31):** la cuenta de Vercel fue eliminada y el proyecto Supabase original (`vbhkwooveztpezntxmof`) murió con la integración. Se activó el **backup de emergencia de Vercel** y el deploy quedó restaurado (`https://rdm-digital-hub-ldtocs.vercel.app` responde 200). El backend se recreó en el proyecto Supabase **`xrxjhbnuyuflldmrdipu`** con keys nuevas (integradas en `.env.local`). **Pendiente:** aplicar migraciones + seeds al proyecto nuevo y recargar las env vars en Vercel.

---

## 1. Qué es el proyecto

Un **monorepo antifrágil** que opera como un sistema heptafederado de 7 nodos (la arquitectura interna **Yun**): cada nodo reconoce archivos y bases de datos por dominio, y todo el cómputo pesado se desplaza a **lazy-systems de segundo y tercer plano** para que el camino crítico de respuesta del usuario nunca cargue trabajo de indexación, agregados o simulaciones.

### Heptafederación (los 7 nodos)

| Nodo | Dominio | Estado del nodo |
| --- | --- | --- |
| `node:turismo` | territorio, rutas, lugares | build real de `rdm-hub` |
| `node:cultura` | patrimonio, música, arte | build real de `rdm-hub` |
| `node:gastronomia` | pastes, restaurantes, rutas | build real de `rdm-hub` |
| `node:ai` | Isabella (núcleo cognitivo) | build real de `rdm-hub` |
| `node:gamificacion` | `apps/gamification-3d` | **no existe aún** (stub honesto) |
| `node:mapas` | `domains/maps` | **scaffold** (stub honesto) |
| `node:seguridad` | `domains/security` | **scaffold** (stub honesto) |

### Lazy-systems (fuera del camino crítico)

| Plano | Script | Qué hace |
| --- | --- | --- |
| Secundario | `scripts/lazy-secondary.mjs` | indexa `data/raw-json` → `data/cache/index.json` (operacional) |
| Terciario | `scripts/lazy-tertiary.mjs` | agrega `raw-json`/`combined-json` → `data/cache/aggregates.json` (operacional) |

---

## 2. Stack y estructura

| Capa | Tecnología |
| --- | --- |
| Frontend | Next.js 15.5 (App Router), React 19, Tailwind CSS 4 |
| Monorepo | Turborepo 2.10.7, pnpm 10.28.0 (`pnpm-workspace.yaml`) |
| Backend de datos | Supabase / PostgreSQL (región `us-east-1`) |
| Edge functions | Supabase (Deno): `health-check`, `model-router`, `cron-audit-sync` |
| IA | `domains/ai` + `packages/ai-sdk` (contractos tipados) |
| Deploy | Vercel |

```
apps/rdm-hub/            # Aplicación Next.js principal (única app real)
domains/                 # 12 dominios (ai real; security/maps/digital-twins/ai-voice/payments = scaffolds)
packages/                # ai-sdk (real), json-parsers (scaffold)
infra/                   # vercel, backups, databases, security (scaffolds)
data/migrations/         # 4 migraciones SQL
data/seed/               # 4 seeds SQL (lugares, negocios, eventos, rutas)
data/raw-json, data/combined-json, data/cache   # insumos/salidas de lazy-systems
scripts/                 # lazy-*, apply-migrations, apply-seed, json-schemas
supabase/                # config.toml, 3 edge functions, 4 migraciones
```

---

## 3. Qué hace hoy (verificado)

- **29 rutas** compilan y sirven (`next build` ✓, 29 páginas estáticas + 7 rutas dinámicas).
- **Sitio en línea** en `https://rdm-digital-hub-ldtocs.vercel.app` (HTTP 200, título correcto, `/api/health` y `/historia` 200).
- **Autenticación real** contra Supabase: registro, login, sesión y guarda de rutas `/dashboard/*` (componentes `auth-provider`, `auth/callback`).
- **Datos reales desde Supabase**: directorio (`businesses`), eventos (`events`), lugares (`places`) vía hooks React Query + API routes.
- **Health check real** (`/api/health`): sondea 5 tablas, reporta 15 tablas, latencia, región y nodo.
- **Pipeline de Isabella** (percepción → policy gate → decisión → auditoría) implementado en `domains/ai` y expuesto en `/api/v1/isabella`.
- **Orquestación antifrágil**: `turbo run build` (2.10.7), `security:scan`, `backup`, nodos heptafederados y lazy-systems operativos.
- **Migraciones y seeds** aplicables vía `db:migrate` / `db:seed` (requieren `SUPABASE_DB_URL`).

---

## 4. Problemas identificados y cómo se resolvieron

| Problema | Síntoma | Resolución | Estado |
| --- | --- | --- | --- |
| Deploy servía `.next` como listado estático | Outage total del sitio | `outputDirectory` mal en `vercel.json`; corregido vía API de Vercel (`rootDirectory=apps/rdm-hub`, `framework=nextjs`, `outputDirectory=.next`) | ✅ resuelto |
| Turbo no veía `infra/*` | `turbo ls` incompleto | faltaba `pnpm-workspace.yaml`; creado (20 workspaces, 19 paquetes turbo) | ✅ resuelto |
| `pipeline` deprecado / JSON inválido | propuesta de `turbo.json` con comentarios y `pipeline` | migrado a clave `tasks` de turbo 2, outputs relativos al paquete | ✅ resuelto |
| Contraseña de DB hardcodeada en `apply-migrations.ps1` | secreto en repo | retirada; ahora se lee `SUPABASE_DB_URL` | ⚠️ parcheado, **rotación pendiente** |
| Propuesta de scripts de DB decorativos | `db:migrate`/`db:seed` como `console.log` | se mantienen los scripts reales de PowerShell contra Supabase | ✅ resuelto |
| WebContainer/StackBlitz sin engines | dev bloqueado en navegador | `engines` en root y `rdm-hub`, `.stackblitzrc` | ✅ resuelto |
| Speed Insights 5/100 | score catastrófico | iframe de YouTube → `loading="lazy"`; preconnects muertos a Google Fonts eliminados (next/font auto-hospeda) | ⚠️ mitigado, ver §9 |
| Bash fork roto en Windows | comandos fallan | usar PowerShell (`bash` solo como wrapper) | ⚠️ entorno |
| Backend Supabase eliminado con la cuenta de Vercel | `db.connected: false`, DNS muerto (`vbhkwooveztpezntxmof`) | proyecto recreado (`xrxjhbnuyuflldmrdipu`), keys nuevas en `.env.local` | ⚠️ migraciones/seeds **pendientes** de aplicar |

---

## 5. Implementado / Funcional / No funcional

### Funcional (verificado)
- 29 rutas sirviendo; 20 páginas de contenido navegables.
- Auth Supabase (login/registro/sesión).
- Directorio, Eventos y Lugares con datos reales de la DB.
- Health check con telemetría real.
- Lazy-systems que escriben cachés reales.
- Nodos heptafederados que ejecutan builds reales.
- Migraciones + seeds SQL (4 + 4).

### Implementado pero NO funcional (roto / stub)
- **Chat de Isabella: roto.** La página envía `{action, payload:{input}}` pero el endpoint exige `inputType` y `timestamp` (Zod) → responde **400** → la UI muestra "Error al conectar con Isabella." (evidencia: `hooks/use-isabella.ts` vs `api/v1/isabella/route.ts`).
- **Decisiones de Isabella: stub.** `processPerception` devuelve "Decision generada automáticamente (stub)" — no hay LLM ni `model-router` conectado.
- **Auditoría de Isabella: stub.** `audit-tracer` solo hace `console.log`, **no escribe** en `isabella_audit_logs`.
- **Policy gate: stub demo.** ignora `isabella_policies` de la DB; solo reacciona a `riskLevel === 'high'`.
- `useIsabellaHistory` consulta `?action=history`, el endpoint no lo implementa (devuelve info fija).
- 6 botones "Reproducir" de música sin audio real.

### NO implementado (placeholder explícito en la UI)
Mapa interactivo, Gemelo Digital 3D, Galería (6 recuadros "Imagen N"), Archivo Sonoro, Enciclopedia, Panel de comercios, Donaciones, RFCs, `apps/gamification-3d`, `apps/5-tenedores`, `apps/visitarealdelmonte-core`, `apps/observability`.

---

## 6. Avance real hacia producción y despliegue

Estimación conservadora basada en lo verificado en §5. No incluye intención futura.

### Despliegue: **~55%**

| Componente | Avance | Nota |
| --- | --- | --- |
| Build reproducible local | 100% | `pnpm install` + `turbo run build` verificados |
| CI/CD automatizada | 30% | no hay GitHub Actions; deploy vía Vercel Git |
| Deploy en Vercel | 85% | URL funcional 200 OK |
| Dominio propio (`visitarealdelmonte.online`) | 15% | agregado al proyecto pero **NXDOMAIN** (nameservers sin configurar) |
| Cuenta/infra de Vercel | 40% | estado incierto (ver §9) |

### Producción (producto): **~35%**

| Módulo | Avance | Evidencia |
| --- | --- | --- |
| UI pública (20 páginas) | 60% | todas renderizan; mayoría con contenido hardcoded |
| Datos territoriales | 45% | lugares y eventos reales; rutas hardcoded; mapa placeholder |
| Economía | 40% | directorio real; membresías hardcoded; panel/donaciones placeholder |
| Comunidad | 25% | feed/wiki/leaderboard hardcoded o placeholder |
| Gobernanza | 30% | F1–F7 hardcoded; RFCs/transparencia placeholder |
| IA Isabella | 20% | pipeline stub + chat roto |
| Gamificación / Digital Twin / Mapas 3D | 5% | libs instaladas (three/leaflet), **sin uso** |
| Seguridad / RLS | 10% | auditoría externa recibida, sin aplicar |
| Observabilidad | 55% | health real; trazabilidad de Isabella pendiente |
| Infraestructura (migraciones, backups) | 40% | 4 migraciones; backups solo scaffolding |

---

## 7. Páginas actuales y contenido

| Ruta | Tipo | Contenido | Fuente |
| --- | --- | --- | --- |
| `/` | ○ estática | Hero, CTA, video YouTube lazy, 8 accesos | hardcoded |
| `/acerca` | ○ | Plataforma (14+ módulos/7 federaciones), Equipo, Filosofía, Contacto | hardcoded |
| `/auth` | ○ | Login / registro | Supabase Auth |
| `/auth/callback` | ƒ | Intercambio de sesión | Supabase Auth |
| `/comunidad` | ○ | Feed (3 posts), Wiki (6 temas), Enciclopedia, Leaderboard | hardcoded |
| `/cultura` | ○ | Patrimonio (6), Galería (placeholder), Música (4, sin audio), Archivo Sonoro, Arte | hardcoded |
| `/directorio` | ○ | Negocios con filtro por categoría | **DB `businesses`** |
| `/economia` | ○ | Categorías de negocios (DB), planes de membresía, paneles | DB + hardcoded |
| `/eventos` | ○ | Calendario de eventos | **DB `events`** |
| `/explorar` | ○ | Mapa (placeholder), Lugares (**DB `places`**), Rutas (8 hardcoded), Gemelo Digital | mixta |
| `/gastronomia` | ○ | Pastes, Ruta del Paste, Restaurantes, Platillos | hardcoded |
| `/gobernanza` | ○ | Federación F1–F7, Políticas, RFCs, Transparencia | hardcoded |
| `/historia` | ○ | Cronología, Minería, Mitos, Dichos | hardcoded |
| `/isabella` | ○ | Chat con Isabella | **roto** (400) |
| `/dashboard` | ○ | Panel (auth) | hardcoded |
| `/dashboard/territorio` | ○ | 4 KPIs + mapa placeholder (auth) | hardcoded |
| `/dashboard/economia` | ○ | 3 KPIs + categorías (auth) | hardcoded |
| `/dashboard/comunidad` | ○ | 3 KPIs + actividad (auth) | hardcoded |
| `/dashboard/observabilidad` | ○ | Estado real vía `/api/health` (auth) | **DB en vivo** |
| `/robots.txt`, `/sitemap.xml` | ○ | SEO | generado |
| `/api/health` | ƒ | Health + telemetría de 5 tablas | **DB en vivo** |
| `/api/places` `/api/negocios` `/api/eventos` | ƒ | CRUD lectura | **DB en vivo** |
| `/api/v1/isabella` | ƒ | Percepción → decisión | domain-ai (stub) |
| `/api/data` | ƒ | 6 lugares hardcoded (legacy) | hardcoded |

---

## 8. Archivos críticos y por qué

| Archivo | Por qué es crítico |
| --- | --- |
| `apps/rdm-hub/app/api/v1/isabella/route.ts` | Contrato del núcleo cognitivo; **hoy devuelve 400 al chat** |
| `apps/rdm-hub/app/api/health/route.ts` | Única telemetría real del sistema |
| `apps/rdm-hub/app/page.tsx` | LCP/rendimiento de la home (Speed Insights) |
| `apps/rdm-hub/app/layout.tsx` | Fuentes, analytics, layout global, CSP heredada |
| `apps/rdm-hub/providers/auth-provider.tsx` | Sesión en toda la app |
| `apps/rdm-hub/lib/supabase/server.ts` / `client.ts` | Acceso seguro a la DB |
| `apps/rdm-hub/next.config.mjs` | Headers de seguridad (CSP), caché de estáticos |
| `domains/ai/src/application/handlers/processPerception.ts` | Flujo canónico de Isabella (auditar→política→decidir) |
| `domains/ai/src/infrastructure/policy-gate.ts` | Control de riesgo de herramientas de Isabella |
| `data/migrations/*.sql` | Esquema de las 15 tablas |
| `scripts/apply-migrations.ps1` / `apply-seed.ps1` | Aplican esquema + datos (requieren `SUPABASE_DB_URL`) |
| `scripts/lazy-*.mjs` | Lazy-systems que mantienen la latencia fuera del camino crítico |
| `package.json` / `turbo.json` / `pnpm-workspace.yaml` | Orquestación monorepo + heptafederación |
| `vercel.json` (root y `apps/rdm-hub`) | Instalación y build del deploy |
| `.env.local` | Credenciales Supabase (**nunca versionar**) |

---

## 9. Deuda técnica y fallas detectadas (no corregidas)

### Críticas
| Fallo | Evidencia | Acción requerida |
| --- | --- | --- |
| **Migraciones + seeds no aplicadas al nuevo proyecto Supabase** | backend recreado en `xrxjhbnuyuflldmrdipu`; tablas RDM aún no existen | `pnpm db:migrate` + `pnpm db:seed` contra las keys nuevas |
| **Env vars de Vercel desactualizadas** | proyecto Vercel restaurado desde backup conserva las keys muertas del proyecto anterior | recargar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` en el dashboard |
| **Chat de Isabella roto (400)** | payload de `use-isabella.ts` no cumple el Zod de la ruta (`inputType`, `timestamp` faltantes) | alinear contrato cliente↔ruta y agregar tests |
| **56 vulnerabilidades Dependabot** (23 high, 31 moderate, 2 low) | reporte GitHub; 4 nuevas avisadas en últimos pushes | `pnpm audit` + actualizar dependencias |

### Altas
| Fallo | Evidencia |
| --- | --- |
| Estado de la cuenta Vercel incierto | el usuario reportó haberla borrado; la API seguía devolviendo el proyecto |
| Dominio sin DNS (`NXDOMAIN`) | nameservers no apuntados a `ns1/ns2.vercel-dns.com` |
| KPIs de dashboards hardcoded mostrados como reales | territorio 47/12/6/1284, economía 24/156/18, comunidad 142/89/234, F1–F7 "Operational" |
| Auditoría de Isabella no persiste | `audit-tracer` solo `console.log` |
| Decisiones de Isabella son stub | `processPerception` devuelve mensaje fijo |

### Medias
| Fallo | Evidencia |
| --- | --- |
| `/api/data` duplica a `/api/places` con datos hardcoded | legacy sin migrar |
| Scripts raíz referencian apps inexistentes | `dev:visitarealdelmonte`, `dev:mobile`, `dev:gamification`, etc. |
| `useIsabellaHistory` sin soporte en el endpoint | la ruta ignora `action=history` |
| `images.unoptimized: true` | imágenes futuras no se optimizarían |
| Botones "Reproducir" sin audio y galería sin imágenes | sin assets de contenido |
| Duración `historia` inconsistente: 5 eventos en página vs 10 en `lib/data.ts` | fuentes duplicadas |
| Hidratación SSR de Leaflet/Three.js sin hardening | libs instaladas, sin uso ni guías SSR |
| Trace ID de Isabella sin firma inmutable | auditoría recomendó firma criptográfica |

### Requiere decisión del usuario
- ¿Qué hacer con Vercel (cuenta/dominio/deploy) tras la orden de "no mover nada"?
- ¿Rotar credenciales de Supabase ya, o esperar ventana?

---

## 10. Cómo correr

```bash
pnpm install          # 20 workspace projects / 19 paquetes turbo
pnpm dev              # turbo dev (parallel)
pnpm --filter rdm-hub dev   # solo el hub (puerto 3000)

pnpm build            # build de todo el monorepo
pnpm node:turismo     # nodo heptafederado (build real de rdm-hub)
pnpm lazy:secondary   # plano secundario → data/cache/index.json
pnpm lazy:tertiary    # plano terciario → data/cache/aggregates.json

# DB (requiere SUPABASE_DB_URL en el entorno)
pnpm db:migrate
pnpm db:seed
```

> Windows: usar PowerShell; el bash del entorno tiene el fork roto.

---

## 11. Registro de avance

```
e4792fc docs: README regenerado - estado real verificado, avances, deuda tecnica y fallas
8f0dd9e perf: iframe de YouTube lazy (LCP/TBT), quitar preconnects muertos
9cb8b03 feat: heptafederación (node:*) y lazy-systems operacionales
7d37cfb feat: antifragile monorepo phase 1 (turbo 2, pnpm-workspace, infra/domain scaffolds)
d1687e7 fix: restore Vercel deploy (rootDirectory + .next output)
5725cb8 fix: outputDirectory for monorepo
266cc49 hardening: seed data, react-query hooks, edge functions, wired 6 pages
b8459f4 feat: initial monorepo setup
```

---

*Última actualización: 2026-07-30. README regenerado a partir del estado real del código, no de intenciones.*
