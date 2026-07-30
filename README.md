# RDM Digital Hub — Nodo Cero

Plataforma territorial inteligente de **Real del Monte, Hidalgo, México**. Monorepo Next.js 15 + Turborepo + Supabase desplegado en Vercel.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 App Router (React 19) |
| Monorepo | pnpm workspaces + Turborepo |
| Estilos | Tailwind CSS v4 + PostCSS |
| Base de datos | Supabase (Postgres + Auth + Edge Functions) |
| Estado cliente | TanStack Query + Zustand |
| Mapas | Leaflet + react-leaflet |
| Visualización | Recharts + Three.js / @react-three/fiber |
| Auth | Supabase SSR (Auth UI + Server Client) |
| AI | Isabella — núcleo cognitivo gobernado |
| Analytics | Vercel Analytics + Speed Insights |
| Seguridad | CSP, X-Frame-Options, HSTS, Permissions-Policy |

## Estructura del monorepo

```
nodo-cero-isabella/
├── apps/
│   └── rdm-hub/          # Next.js 15 App Router — frontend principal
│       ├── app/
│       │   ├── page.tsx           # Landing page (server component)
│       │   ├── layout.tsx         # Root layout (fonts, providers, nav, footer)
│       │   ├── globals.css        # Tailwind v4 + tema oscuro RDM
│       │   ├── providers.tsx      # QueryProvider + AuthProvider + Toaster
│       │   ├── robots.ts          # SEO
│       │   ├── sitemap.ts         # Sitemap dinámico
│       │   ├── auth/              # Login + Register + Callback OAuth
│       │   ├── explorar/          # Mapa, lugares, rutas, gemelo digital
│       │   ├── historia/          # Cronología, minería, mitos, dichos
│       │   ├── cultura/           # Patrimonio, galería, música, archivo, arte
│       │   ├── gastronomia/       # Pastes, ruta gastronómica, restaurantes
│       │   ├── economia/          # Negocios, comercios, membresías
│       │   ├── comunidad/         # Feed, wiki, enciclopedia, leaderboard
│       │   ├── isabella/          # Chat con IA gobernada
│       │   ├── gobernanza/        # Federaciones, políticas, RFCs, transparencia
│       │   ├── directorio/        # Negocios con filtro por categoría
│       │   ├── eventos/           # Calendario de eventos
│       │   ├── acerca/            # Plataforma, equipo, filosofía, contacto
│       │   ├── dashboard/         # Layout protegido con sidebar
│       │   │   ├── territorio/    # Stats de cobertura territorial
│       │   │   ├── economia/      # Métricas y barras por categoría
│       │   │   ├── comunidad/     # Actividad y stats de usuarios
│       │   │   └── observabilidad/# Health check, telemetría, federaciones
│       │   ├── not-found.tsx      # 404 personalizado
│       │   └── api/
│       │       ├── health/        # Health check endpoint
│       │       ├── places/        # CRUD lugares turísticos
│       │       ├── negocios/      # CRUD directorio de negocios
│       │       ├── eventos/       # CRUD eventos
│       │       ├── data/          # Datos agregados
│       │       ├── v1/isabella/   # Isabella POST/GET (percepción → decisión)
│       │       └── auth/callback/ # Supabase OAuth callback
│       ├── components/
│       │   ├── navbar.tsx         # Navbar sticky con auth state
│       │   ├── footer.tsx         # Footer 4 columnas
│       │   └── ui/                # Button, Card, Badge, Input, Tabs
│       ├── providers/
│       │   ├── auth-provider.tsx  # Contexto de autenticación Supabase
│       │   └── query-provider.tsx # TanStack Query provider
│       ├── lib/
│       │   ├── supabase/client.ts # Browser client
│       │   ├── supabase/server.ts # Server client (cookies)
│       │   ├── env.ts             # Validación Zod de env vars
│       │   ├── utils.ts           # cn() con clsx + tailwind-merge
│       │   └── data.ts            # Datos estáticos demo
│       ├── middleware.ts          # Trace ID + Node ID headers
│       ├── next.config.mjs        # CSP + security headers + caching
│       └── tsconfig.json          # Path alias @/* → ./*
│
├── packages/
│   └── ai-sdk/                   # @nodo-cero/ai-sdk — tipos compartidos AI
│       └── src/contracts.ts       # IsabellaPerception, IsabellaDecision, etc.
│
├── domains/                       # Domain-driven packages (contratos)
│   ├── ai/                        # @nodo-cero/domain-ai — processPerception, policy-gate, audit-tracer
│   ├── identity/                  # @nodo-cero/domain-identity — Profile, AuthSession
│   ├── tourism/                   # @nodo-cero/domain-tourism — Place, Route, Event
│   ├── economy/                   # @nodo-cero/domain-economy — Business, Membership, Transaction
│   ├── governance/                # @nodo-cero/domain-governance — Federation, Policy, RFC
│   ├── observability/             # @nodo-cero/domain-observability — HealthCheck, Metric, AuditEvent
│   └── pqc/                       # @nodo-cero/domain-pqc — PQCConfig, PQCSignature, PQCKeyPair
│
├── data/
│   └── migrations/                # SQL migrations para Supabase
│       ├── 001_create_isabella_tables.sql    # 9 tablas: sessions, messages, memory, decisions, etc.
│       ├── 002_create_profiles_tables.sql    # Profiles de usuario
│       ├── 003_create_places_tables.sql      # Lugares, rutas, eventos
│       └── 004_create_economy_tables.sql     # Negocios, membresías, transacciones
│
├── supabase/
│   ├── config.toml                # Config local Supabase
│   ├── import_map.json
│   └── functions/                 # Edge Functions
│       ├── health-check/          # Status del nodo
│       ├── model-router/          # Routing de modelos AI
│       └── cron-audit-sync/       # Sync programado de logs de auditoría
│
├── vercel.json                    # Build config monorepo + rutas + regiones
├── turbo.json                     # Pipeline Turborepo
├── tsconfig.base.json             # Config base TypeScript
├── pnpm-workspace.yaml
└── .gitignore
```

## Principios de arquitectura

- **Server-first**: Landing page es server component. API routes usan Next.js server runtime
- **Domain-driven**: Cada dominio tiene su propio paquete con contratos tipados y lógica aislada
- **Gobernanza por policy-gate**: Isabella evalúa cada percepción contra políticas antes de decidir
- **Audit trail completo**: Toda decisión de Isabella se registra en audit_logs
- **Tema oscuro soberano**: Paleta RDM (oro #c8a356, terracota #b85c3c, fondo #0a0b0e)
- **Monitoreo nativo**: Observabilidad integrada con health checks y telemetría federada

## Requisitos

- Node.js >= 22
- pnpm >= 8
- Supabase project (gratuito en [supabase.com](https://supabase.com))

## Instalación

```bash
pnpm install
```

## Variables de entorno

Crear `apps/rdm-hub/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_NODE_ID=nd-rdm-hub-001
NEXT_PUBLIC_NODE_NAME=Nodo Cero
NEXT_PUBLIC_POSTHOG_KEY=         # opcional
NEXT_PUBLIC_POSTHOG_HOST=        # opcional
```

## Desarrollo

```bash
pnpm dev
# → http://localhost:3000
```

## Build

```bash
pnpm build
```

## Deploy en Vercel

1. Conectar repo en [vercel.com/new](https://vercel.com/new)
2. Configurar **Root Directory**: `apps/rdm-hub`
3. Agregar **Environment Variables** del `.env.local.example`
4. El `vercel.json` en la raíz maneja el build y ruteo automáticamente

### Funcionalidades clave

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page con navegación a todas las secciones |
| `/explorar` | Mapa interactivo, lugares, rutas, gemelo digital 3D |
| `/historia` | Cronología minera, mitos, dichos populares |
| `/cultura` | Galería, música, archivo histórico, arte local |
| `/gastronomia` | Pastes, ruta gastronómica, restaurantes y platillos |
| `/economia` | Directorio de negocios, membresías, donaciones |
| `/comunidad` | Feed social, wiki colaborativa, enciclopedia, ranking |
| `/isabella` | Chat con IA gobernada por políticas (policy-gate) |
| `/gobernanza` | Federaciones, políticas, RFCs, transparencia |
| `/directorio` | Negocios locales con filtro por categoría |
| `/eventos` | Calendario de eventos del Pueblo Mágico |
| `/acerca` | Plataforma, equipo, filosofía, contacto |
| `/dashboard` | Panel protegido con sidebar y 4 subpáginas |
| `/api/health` | Health check del nodo |
| `/api/v1/isabella` | Endpoint REST de Isabella (POST percepciones) |

## Licencia

RDM Digital Hub — Nodo Cero. Real del Monte, Hidalgo, México.
