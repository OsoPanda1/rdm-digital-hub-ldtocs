```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    ██████  ██████  ███    ███     ██   ██ ██    ██ ██████     ║
║                    ██   ██ ██   ██ ████  ████     ██   ██ ██    ██ ██   ██    ║
║                    ██   ██ ██   ██ ██ ████ ██     ███████ ██    ██ ██████     ║
║                    ██   ██ ██   ██ ██  ██  ██     ██   ██ ██    ██ ██   ██    ║
║                    ██████  ██████  ██      ██     ██   ██  ██████  ██████     ║
║                                                                              ║
║                         ╔═══════════════════════╗                            ║
║                         ║  R D M   D I G I T A L  ║                            ║
║                         ║     H U B   ·   N O D O     ║                            ║
║                         ║        C E R O          ║                            ║
║                         ╚═══════════════════════╝                            ║
║                                                                              ║
║          Plataforma Territorial Inteligente de Real del Monte                ║
║                     Pueblo Mágico · Hidalgo · México                        ║
║                                                                              ║
║                    ●  Next.js 15  ●  Supabase  ●  Isabella AI               ║
║                    ●  Turborepo   ●  React 19  ●  Federated Governance      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

<br>

<div align="center">

[![Licencia](https://img.shields.io/badge/license-Proprietary-gold?style=for-the-badge&labelColor=0a0b0e&color=c8a356)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white&labelColor=0a0b0e)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black&labelColor=0a0b0e)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white&labelColor=0a0b0e)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0a0b0e)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=0a0b0e)](https://tailwindcss.com)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white&labelColor=0a0b0e)](https://pnpm.io)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white&labelColor=0a0b0e)](https://turbo.build)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white&labelColor=0a0b0e)](https://vercel.com)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white&labelColor=0a0b0e)](https://threejs.org)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white&labelColor=0a0b0e)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/Zustand-443e38?style=for-the-badge&logo=&logoColor=white&labelColor=0a0b0e)](https://zustand-demo.pmnd.rs)

</div>

<br>

---

# 📋 Índice

1. [El Problema](#-el-problema)
2. [La Solución](#-la-solución)
3. [¿Qué es Nodo Cero?](#-qué-es-nodo-cero)
4. [Arquitectura del Sistema](#-arquitectura-del-sistema)
5. [Stack Tecnológico](#-stack-tecnológico)
6. [Estructura del Monorepo](#-estructura-del-monorepo)
7. [Las 14 Páginas Temáticas](#-las-14-páginas-temáticas)
8. [Isabella — Núcleo Cognitivo Gobernado](#-isabella--núcleo-cognitivo-gobernado)
9. [Modelo de Gobernanza Federada](#-modelo-de-gobernanza-federada)
10. [Domains — Contratos y Lógica de Negocio](#-domains--contratos-y-lógica-de-negocio)
11. [Supabase Edge Functions](#-supabase-edge-functions)
12. [Base de Datos — Migraciones SQL](#-base-de-datos--migraciones-sql)
13. [Seguridad y Performance](#-seguridad-y-performance)
14. [Roadmap Técnico](#-roadmap-técnico)
15. [Requisitos e Instalación](#-requisitos-e-instalación)
16. [Variables de Entorno](#-variables-de-entorno)
17. [Comandos](#-comandos)
18. [Deploy en Vercel](#-deploy-en-vercel)
19. [Contribuir](#-contribuir)
20. [Créditos y Filosofía](#-créditos-y-filosofía)

<br>

---

## 🔴 El Problema

Real del Monte — Pueblo Mágico con más de **500 años de historia minera, cultural y gastronómica** — carecía de una plataforma digital unificada que reflejara su identidad territorial. Los problemas identificados:

| Problema | Impacto |
|----------|---------|
| **Fragmentación de datos** | La información turística, histórica, económica y cultural estaba dispersa en sitios estáticos, redes sociales y documentos sin estructura |
| **Sin gobierno de datos** | No existía un modelo de propiedad, trazabilidad ni auditoría de la información del territorio |
| **IA sin gobernanza** | Cualquier implementación de IA carecía de controles, políticas y auditoría — riesgos de sesgo, desinformación y decisiones no trazables |
| **Sin identidad digital soberana** | El pueblo no tenía control sobre su representación digital ni los datos generados en su territorio |
| **Economía local invisible** | Los negocios locales (pasteurías, hospedajes, artesanos) no tenían presencia digital unificada ni métricas de impacto |
| **Memoria colectiva en riesgo** | La historia oral, mitos, dichos y tradiciones no estaban catalogados ni preservados digitalmente |
| **Sin observabilidad territorial** | No existía monitoreo del estado del territorio, sus servicios ni su comunidad digital |

<br>

---

## 🟢 La Solución

**RDM Digital Hub — Nodo Cero** es la primera plataforma territorial inteligente de un Pueblo Mágico mexicano, construida sobre un modelo de **soberanía digital federada**. No es un sitio web turístico más: es el **núcleo cognitivo y operativo del territorio en el plano digital**.

> Un solo monorepo. Cero silos. Gobernanza desde el primer commit.

<br>

---

## 🎯 ¿Qué es Nodo Cero?

Nodo Cero es el **primer nodo de una red federada de territorios inteligentes**. Funciona como:

- **🕸️ Portal territorial** — 14 páginas que cubren cada dimensión de Real del Monte: historia, cultura, gastronomía, economía, gobernanza, comunidad, eventos, directorio
- **🧠 Núcleo cognitivo gobernado** — Isabella, un sistema de IA con auditoría, políticas y trazabilidad obligatoria en cada decisión
- **🏛️ Plataforma de gobernanza** — Federaciones, políticas, RFCs y transparencia en un modelo de gobierno participativo
- **📊 Panel de control** — Dashboard protegido con métricas de territorio, economía, comunidad y observabilidad en tiempo real
- **🔌 API pública** — Endpoints REST para health, lugares, negocios, eventos y cognición (Isabella)
- **🗄️ Base de datos soberana** — 4 migraciones SQL que definen el esquema completo del territorio en Supabase/Postgres
- **⚡ Edge Functions** — 3 funciones serverless para health checks, routing de modelos AI y sincronización de auditoría

<br>

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENTE (Browser)                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │  Next.js │ │  React   │ │  TanStack│ │  Zustand │ │  react-leaflet   │  │
│  │  App     │ │  19      │ │  Query   │ │  State   │ │  @react-three    │  │
│  │  Router  │ │          │ │  Cache   │ │  Store   │ │  /drei / fiber   │  │
│  └────┬─────┘ └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
└───────┼─────────────────────────────────────────────────────────────────────┘
        │                           ▲
        │ HTTPS                     │ SSR / Streaming
        ▼                           │
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SERVER (Next.js + Vercel)                           │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  middleware.ts                    Trace ID · Node ID · Island Mode   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  API Routes  │  │  Server      │  │  Server      │  │  Auth        │  │
│  │  /api/*      │  │  Components  │  │  Actions     │  │  Callback    │  │
│  └──────┬───────┘  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────┼───────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DOMAIN LAYER (packages)                             │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  @nodo-cero/ai-sdk      Tipos compartidos del sistema cognitivo     │  │
│  │  @nodo-cero/domain-ai   Percepción · Policy Gate · Auditoría        │  │
│  │  @nodo-cero/domain-*    6 dominios adicionales (identidad,          │  │
│  │                         turismo, economía, gobernanza,              │  │
│  │                         observabilidad, PQC)                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATA + INFRASTRUCTURE LAYER                            │
│                                                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────────────────┐  │
│  │  Supabase      │  │  Supabase      │  │  Supabase Edge Functions     │  │
│  │  Postgres      │  │  Auth         │  │  · health-check              │  │
│  │  (4 migrations)│  │  (SSR + OAuth) │  │  · model-router              │  │
│  │                │  │                │  │  · cron-audit-sync           │  │
│  └────────────────┘  └────────────────┘  └──────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Vercel Edge Network · 3 regiones (sfo1, iad1, gru1)                │  │
│  │  Vercel Analytics · Speed Insights · Cron Jobs                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

<br>

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| **Framework** | Next.js | 15.2+ (App Router) | SSR, streaming, server components, API routes |
| **UI** | React | 19.2+ | Componentes, hooks, server components |
| **Lenguaje** | TypeScript | 5.8+ | Tipado estricto en toda la codebase |
| **Monorepo** | pnpm + Turborepo | 8+ / 1.10+ | Workspaces, build caching, pipelines paralelos |
| **Estilos** | Tailwind CSS | 4.2+ | Utility-first, PostCSS, tema oscuro RDM |
| **Fuentes** | DM Sans + Playfair Display | Google Fonts | Sans-serif para UI, Serif para títulos |
| **Base de datos** | Supabase Postgres | — | 9 tablas Isabella + profiles + places + economy |
| **Auth** | Supabase SSR | 0.6+ | Server/client auth, cookies, OAuth callback |
| **Cache cliente** | TanStack Query | 5.83+ | staleTime 5min, gcTime 30min, retry 1 |
| **Estado** | Zustand | 5.0+ | Estado global ligero |
| **Mapas** | Leaflet + react-leaflet | 1.9+ / 5.0+ | Mapas interactivos, capas, marcadores |
| **3D** | Three.js + @react-three/fiber + drei | 0.185+ | Gemelo digital, visualizaciones |
| **Gráficas** | Recharts | 2.15+ | Barras, líneas, radar para dashboards |
| **Animaciones** | Framer Motion | 12.42+ | Transiciones, layout animations |
| **Iconos** | Lucide React | 0.577+ | Iconos SVG consistentes |
| **Notificaciones** | Sonner | 2.0+ | Toasts estilizados |
| **Analytics** | Vercel Analytics + Speed Insights | 1.5+ / 1.2+ | Métricas de uso y performance |
| **Validación** | Zod | 3.24+ | Env vars, percepciones Isabella |
| **Edge Functions** | Supabase Edge Functions | Deno | health-check, model-router, cron-audit-sync |
| **AI SDK** | @nodo-cero/ai-sdk | workspace | IsabellaPerception, IsabellaDecision, contracts |
| **Post-Quantum** | @nodo-cero/domain-pqc | workspace | Kyber512, firmas, config PQC |

<br>

---

## 📁 Estructura del Monorepo

```
nodo-cero-isabella/
│
├── 📦 apps/
│   └── 🚀 rdm-hub/                          # ★ Next.js 15 App Router — El frontend
│       ├── app/
│       │   ├── layout.tsx                   # Root layout · DM Sans + Playfair · Providers · Analytics
│       │   ├── page.tsx                     # Landing page (server component, hero + grid navegación)
│       │   ├── providers.tsx                # QueryProvider + AuthProvider + Toaster
│       │   ├── globals.css                  # Tailwind v4 · Tema oscuro soberano RDM
│       │   ├── robots.ts                    # SEO · Disallow /api/ /dashboard/ /auth/
│       │   ├── sitemap.ts                   # 13 URLs · changeFrequency · priority
│       │   ├── not-found.tsx                # 404 personalizado con vínculo al inicio
│       │   │
│       │   ├── 📁 auth/                     # Login · Register · Callback OAuth Supabase
│       │   ├── 📁 explorar/                 # Mapa · Lugares · Rutas · Gemelo Digital 3D
│       │   ├── 📁 historia/                 # Cronología minera · Mitos · Dichos populares
│       │   ├── 📁 cultura/                  # Patrimonio · Galería · Música · Archivo · Arte
│       │   ├── 📁 gastronomia/              # Pastes · Ruta gastronómica · Restaurantes · Platillos
│       │   ├── 📁 economia/                 # Negocios · Comercios · Membresías · Donaciones
│       │   ├── 📁 comunidad/                # Feed social · Wiki · Enciclopedia · Leaderboard
│       │   ├── 📁 isabella/                 # ★ Chat con IA gobernada (policy-gate + audit trail)
│       │   ├── 📁 gobernanza/               # Federaciones · Políticas · RFCs · Transparencia
│       │   ├── 📁 directorio/               # Directorio de negocios con filtro por categoría
│       │   ├── 📁 eventos/                  # Calendario de eventos del Pueblo Mágico
│       │   ├── 📁 acerca/                   # Plataforma · Equipo · Filosofía · Contacto
│       │   │
│       │   ├── 📁 dashboard/                # ★ Layout protegido con sidebar + auth guard
│       │   │   ├── layout.tsx               # DashboardNav lateral + main
│       │   │   ├── page.tsx                 # Panel principal · Bienvenida + cards de estado
│       │   │   ├── _components/
│       │   │   │   └── dashboard-nav.tsx    # Sidebar con 6 rutas + signOut
│       │   │   ├── 📁 territorio/           # Stats cobertura · lugares · rutas · visitantes
│       │   │   ├── 📁 economia/             # Métricas económicas · barras por categoría
│       │   │   ├── 📁 comunidad/            # Usuarios · contribuciones · actividad reciente
│       │   │   └── 📁 observabilidad/       # ★ Health check real · uptime · telemetría · federaciones
│       │   │
│       │   └── 📁 api/                      # ★ API REST interna
│       │       ├── 📁 health/               # GET → { status, node, uptime, region }
│       │       ├── 📁 places/               # GET (filtro cat) + POST (crear lugar)
│       │       ├── 📁 negocios/             # GET (filtro cat) + POST (crear negocio)
│       │       ├── 📁 eventos/              # GET + POST
│       │       ├── 📁 data/                 # GET → datos agregados
│       │       ├── 📁 v1/isabella/          # ★ POST percepción → processPerception → decisión
│       │       └── 📁 auth/callback/        # Supabase OAuth · exchangeCodeForSession
│       │
│       ├── 📁 components/
│       │   ├── navbar.tsx                   # Sticky · backdrop-blur · auth-aware · oculta en dashboard
│       │   ├── footer.tsx                   # 4 columnas · links a secciones · legal
│       │   └── 📁 ui/                       # ★ Componentes reutilizables
│       │       ├── button.tsx               # Variants: primary, secondary, danger, ghost
│       │       ├── card.tsx                 # Card + CardHeader + CardContent + CardTitle
│       │       ├── badge.tsx                # Variants: default, success, warning, danger, info
│       │       ├── input.tsx                # Input con estilo RDM consistente
│       │       └── tabs.tsx                 # Tabs client-side reutilizables
│       │
│       ├── 📁 providers/
│       │   ├── auth-provider.tsx            # Contexto Supabase · getSession + onAuthStateChange + signOut
│       │   └── query-provider.tsx           # TanStack Query · staleTime 5min · gcTime 30min
│       │
│       ├── 📁 lib/
│       │   ├── 📁 supabase/
│       │   │   ├── client.ts               # createBrowserClient (browser runtime)
│       │   │   └── server.ts               # createServerClient + cookies (server runtime)
│       │   ├── env.ts                       # Zod validation client + server env vars
│       │   ├── utils.ts                     # cn() = clsx + twMerge
│       │   └── data.ts                      # Datos estáticos: lugares, negocios, eventos, historia
│       │
│       ├── middleware.ts                    # Trace ID · Node ID en headers de cada request
│       ├── next.config.mjs                  # CSP · Security headers · Cache · Server Actions 2mb
│       ├── postcss.config.mjs               # @tailwindcss/postcss plugin
│       ├── tsconfig.json                    # baseUrl + paths @/ → ./*
│       ├── .env.local.example
│       └── package.json                     # Next 15 · React 19 · Supabase · TanStack · Three · Leaflet
│
│
├── 📦 packages/
│   └── 📘 ai-sdk/                           # @nodo-cero/ai-sdk
│       └── src/
│           └── contracts.ts                 # ★ IsabellaPerception · IsabellaDecision · IsabellaMemoryItem
│                                           #   · IsabellaToolCall · IsabellaPolicy · IsabellaAuditEvent
│
│
├── 📦 domains/                              # ★ Domain-Driven Design packages
│   ├── 📘 ai/                               # @nodo-cero/domain-ai
│   │   ├── src/
│   │   │   ├── application/
│   │   │   │   └── handlers/
│   │   │   │       └── processPerception.ts # ★ Flujo canónico: auditar → policy-gate → decidir → auditar
│   │   │   └── infrastructure/
│   │   │       ├── policy-gate.ts           # ★ Policy Gate: allowed / denied / requires_approval
│   │   │       └── audit-tracer.ts          # ★ Audit trail · stub → Supabase isabella_audit_logs
│   │   └── package.json
│   │
│   ├── identity/                            # @nodo-cero/domain-identity — Profile, AuthSession
│   ├── tourism/                             # @nodo-cero/domain-tourism — Place, Route, Event
│   ├── economy/                             # @nodo-cero/domain-economy — Business, Membership, Transaction
│   ├── governance/                          # @nodo-cero/domain-governance — Federation, Policy, RFC
│   ├── observability/                       # @nodo-cero/domain-observability — HealthCheck, Metric, AuditEvent
│   └── pqc/                                 # @nodo-cero/domain-pqc — PQCConfig, PQCSignature, PQCKeyPair
│
│
├── 📁 supabase/
│   ├── config.toml                          # Configuración local Supabase
│   ├── import_map.json
│   └── 📁 functions/                        # ★ Edge Functions (Deno)
│       ├── health-check/                    # Status del nodo · uptime · versión
│       ├── model-router/                    # Ruteo de modelos AI (stub)
│       └── cron-audit-sync/                 # Sync periódico de logs de auditoría
│
│
├── 📁 data/
│   └── 📁 migrations/                       # ★ 4 migraciones SQL
│       ├── 001_create_isabella_tables.sql   # 9 tablas: sessions · messages · memory · decisions
│       │                                   #   · tools · tool_calls · policies · approvals · audit_logs
│       ├── 002_create_profiles_tables.sql   # profiles · roles · permissions
│       ├── 003_create_places_tables.sql     # places · routes · events
│       └── 004_create_economy_tables.sql    # businesses · memberships · transactions
│
│
├── 📁 docs/
│   ├── README.md
│   └── 📁 isabella/
│       └── blueprint.md                    # Plano de Isabella · flujos · políticas · memoria
│
├── 📁 infra/
│   └── 📁 vercel/
│       └── README.md                       # Configuración de despliegue Vercel
│
├── 📁 .github/
│   ├── workflows/
│   │   └── ci.yml                          # CI · pnpm install → turbo build → lint → test
│   └── PULL_REQUEST_TEMPLATE.md
│
│
├── vercel.json                             # Build monorepo · rutas · 3 regiones · env vars
├── turbo.json                              # Pipeline Turborepo: build, dev, lint
├── tsconfig.base.json                      # Base TS: ES2022, Bundler, strict, react-jsx
├── pnpm-workspace.yaml                     # Workspaces: apps/*, packages/*, domains/*
├── package.json                            # Root: turbo dev/build/lint scripts
└── .gitignore                              # node_modules, .next, .env, .turbo, dist, coverage
```

<br>

---

## 🌐 Las 14 Páginas Temáticas

Cada página (excepto landing y dashboard) usa un sistema de **tabs internos** que permite navegar entre subsecciones sin recargar la página.

| # | Ruta | Secciones (tabs) | Tipo | Auth |
|---|------|-------------------|------|------|
| 1 | `/` | Hero + grid de navegación a 8 secciones | Server | No |
| 2 | `/auth` | Login · Register · Callback OAuth | Client | No |
| 3 | `/explorar` | 🗺️ Mapa · 📍 Lugares · 🛤️ Rutas · 🏗️ Gemelo Digital 3D | Client | No |
| 4 | `/historia` | 📜 Cronología · ⛏️ Minería · 🧙 Mitos · 🗣️ Dichos | Client | No |
| 5 | `/cultura` | 🏛️ Patrimonio · 🖼️ Galería · 🎵 Música · 📚 Archivo · 🎨 Arte | Client | No |
| 6 | `/gastronomia` | 🥟 Pastes · 🗺️ Ruta gastronómica · 🍽️ Restaurantes · 📋 Platillos | Client | No |
| 7 | `/economia` | 💼 Negocios · 🏪 Comercios · 💳 Membresías · ❤️ Donar | Client | No |
| 8 | `/comunidad` | 📰 Feed · 📖 Wiki · 📚 Enciclopedia · 🏆 Leaderboard | Client | No |
| 9 | `/isabella` | 💬 Chat con Isabella (AI con policy-gate + audit trail) | Client | No |
| 10 | `/gobernanza` | 🏛️ Federaciones · 📜 Políticas · 📋 RFCs · 🔍 Transparencia | Client | No |
| 11 | `/directorio` | 🔎 Buscador de negocios con filtro por categoría | Client | No |
| 12 | `/eventos` | 📅 Calendario de eventos del Pueblo Mágico | Client | No |
| 13 | `/acerca` | ℹ️ Plataforma · 👥 Equipo · 🧭 Filosofía · 📞 Contacto | Client | No |
| 14 | `/dashboard/*` | 📊 Panel protegido con sidebar + 4 subpáginas | Client | ✅ Sí |

<br>

---

## 🧠 Isabella — Núcleo Cognitivo Gobernado

Isabella es el **núcleo cognitivo del territorio**. No es un chatbot común: cada percepción que recibe pasa por un **flujo canónico de gobernanza** antes de producir una decisión.

### 🔄 Flujo Canónico de Isabella

```
        ┌──────────┐
        │  Usuario  │
        │  (chat)   │
        └────┬─────┘
             │ POST /api/v1/isabella
             ▼
     ┌───────────────┐
     │   Percepción  │  ← IsabellaPerception { sessionId, actorId, inputType, payload, timestamp }
     │   (Zod val)   │
     └───────┬───────┘
             │
             ▼
     ┌───────────────┐
     │ 🖊️ Audit     │  ← isabella_audit_logs: "perception.received"
     │   Trace       │
     └───────┬───────┘
             │
             ▼
     ┌───────────────┐
     │ 🚦 Policy    │  ← policyGate(perception) → allowed / denied / requires_approval
     │   Gate       │
     └───────┬───────┘
             │
             ├── denied ──────────────→ 📄 Decisión: policyStatus = "denied"
             │                                   └── 🖊️ Audit: "decision.created"
             │
             ├── requires_approval ──→ 📄 Decisión: policyStatus = "requires_approval"
             │                                   └── 🖊️ Audit: "decision.created"
             │                                   └── ⏳ Approval pendiente (isabella_approvals)
             │
             └── allowed ────────────→ 🤖 Decisión automática (stub → futura tool execution)
                                         └── 🖊️ Audit: "decision.created"
                                         └── 🛠️ Tool calls (pendiente)
```

### 🗄️ Tablas de Isabella (Migration 001)

| Tabla | Propósito |
|-------|-----------|
| `isabella_sessions` | Sesiones cognitivas por actor/tenant |
| `isabella_messages` | Historial de mensajes por sesión |
| `isabella_memory_items` | Memoria por alcance (inmediata · sesión · proyecto · territorial · histórica) |
| `isabella_decisions` | Decisiones producidas con confianza, riesgo y status de política |
| `isabella_tools` | Catálogo de herramientas que Isabella puede ejecutar |
| `isabella_tool_calls` | Ejecuciones de herramientas asociadas a decisiones |
| `isabella_policies` | Políticas de gobernanza con reglas versionadas |
| `isabella_approvals` | Aprobaciones humanas para decisiones de alto riesgo |
| `isabella_audit_logs` | Trazabilidad completa de cada evento del sistema |

<br>

---

## 🏛️ Modelo de Gobernanza Federada

El proyecto implementa un modelo de **7 federaciones** que representan los dominios de soberanía del territorio digital:

| Federación | Descripción | Estado |
|------------|-------------|--------|
| **F1 — Gobernanza** | Políticas, RFCs, transparencia, toma de decisiones | ✅ Operational |
| **F2 — Identidad y Acceso** | Auth, perfiles, roles, permisos federados | ✅ Operational |
| **F3 — Datos Territoriales** | Lugares, rutas, gemelo digital, capas de mapa | ⚠️ Degraded |
| **F4 — Comercio y Monetización** | Negocios, membresías, transacciones, donaciones | ✅ Operational |
| **F5 — IA Cognitiva** | Isabella, memory, policies, approvals, audit | ✅ Operational |
| **F6 — Comunidad y Contenido** | Feed, wiki, enciclopedia, leaderboard, cultura | ✅ Operational |
| **F7 — Observabilidad** | Health checks, telemetría, uptime, alertas | ✅ Operational |

<br>

---

## 📦 Domains — Contratos y Lógica de Negocio

El monorepo contiene **7 paquetes de dominio**, cada uno con contratos TypeScript y lógica aislada:

### 🤖 ai — @nodo-cero/domain-ai
```typescript
// processPerception.ts — Flujo canónico completo
export async function processPerception(
  perception: IsabellaPerception
): Promise<IsabellaDecision> {
  // 1. Audit perception received
  // 2. Resolve policy gate (risk-based rules)
  // 3. Generate decision with policyStatus + toolCalls
  // 4. Audit decision created
  return decision;
}
```

### 🔐 identity — @nodo-cero/domain-identity
`Profile`, `AuthSession`, `Role`, `Permission`

### 🗺️ tourism — @nodo-cero/domain-tourism
`Place`, `Route`, `Event`, `Category`

### 💰 economy — @nodo-cero/domain-economy
`Business`, `Membership`, `Transaction`, `Subscription`

### ⚖️ governance — @nodo-cero/domain-governance
`Federation`, `Policy`, `RFC`, `Vote`

### 📊 observability — @nodo-cero/domain-observability
`HealthCheck`, `Metric`, `AuditEvent`, `Alert`

### 🔐 pqc — @nodo-cero/domain-pqc
`PQCConfig`, `PQCSignature`, `PQCKeyPair` (post-quantum cryptography readiness)

<br>

---

## ⚡ Supabase Edge Functions

| Función | Ruta | Propósito |
|---------|------|-----------|
| **health-check** | `/health-check` | Status del nodo, uptime, versión, región |
| **model-router** | `/model-router` | Ruteo de requests AI entre modelos (stub) |
| **cron-audit-sync** | (cron) | Sync periódico de logs de auditoría entre nodos |

<br>

---

## 🗄️ Base de Datos — Migraciones SQL

| Migración | Tablas | Propósito |
|-----------|--------|-----------|
| `001` | 9 tablas | Sistema Isabella completo (sesiones, mensajes, memoria, decisiones, herramientas, políticas, aprobaciones, auditoría) |
| `002` | 3 tablas | Perfiles de usuario, roles, permisos |
| `003` | 3 tablas | Lugares turísticos, rutas, eventos |
| `004` | 3 tablas | Negocios, membresías, transacciones |

<br>

---

## 🛡️ Seguridad y Performance

### Seguridad implementada

```
┌─────────────────────────────────────────────────────────────┐
│  Content-Security-Policy                                     │
│  ├── default-src 'self'                                      │
│  ├── script-src 'self' 'unsafe-inline' 'unsafe-eval'         │
│  │   + Cloudflare Challenges + Vercel Scripts                │
│  ├── style-src 'self' 'unsafe-inline' + Google Fonts         │
│  ├── img-src 'self' data: blob: https:                       │
│  ├── font-src 'self' + fonts.gstatic.com                     │
│  ├── connect-src 'self' + Supabase (REST + WS) + Vercel APIs │
│  ├── frame-ancestors 'none'                                  │
│  ├── base-uri 'self'                                         │
│  └── form-action 'self'                                      │
├─────────────────────────────────────────────────────────────┤
│  X-Frame-Options: DENY                                       │
│  X-Content-Type-Options: nosniff                             │
│  Referrer-Policy: strict-origin-when-cross-origin            │
│  Permissions-Policy: camera=(), microphone=(), geolocation=(self) │
│  Cache-Control (api): no-store, must-revalidate              │
│  Cache-Control (assets): public, max-age=31536000, immutable │
│  Server Actions body limit: 2mb                              │
│  Middleware: Trace ID + Node ID por request                   │
│  Env vars: Zod validation con throw en producción            │
└─────────────────────────────────────────────────────────────┘
```

### Performance

| Estrategia | Implementación |
|------------|---------------|
| **SSR parcial** | Landing page server component (sin JS de cliente) |
| **Caching** | TanStack Query staleTime 5min, gcTime 30min |
| **Assets** | Cache público 1 año con immutable |
| **Fonts** | next/font/google + preconnect + swap display |
| **Build** | Turborepo caching remoto y local |
| **Edge** | Middleware en Edge Runtime (latencia mínima) |
| **CDN** | Vercel Edge Network, 3 regiones (SFO, IAD, GRU) |
| **Monitoreo** | Vercel Analytics + Speed Insights + health endpoint |

<br>

---

## 🗺️ Roadmap Técnico

- [ ] **Fase 1 — Fundación** ✅ Monorepo · 14 páginas · API REST · Domains · Migraciones SQL
- [ ] **Fase 2 — Isabella Real** 🔄 Integración con LLM real (OpenAI/Anthropic) · Memoria persistente · Tool execution
- [ ] **Fase 3 — Gemelo Digital** 🏗️ Mapa 3D interactivo con datos en tiempo real · Capas históricas
- [ ] **Fase 4 — Federación** 🌐 Multi-nodo · Sync entre nodos · Consenso federado
- [ ] **Fase 5 — Economía** 💳 Membresías · Pagos · Tokenización de activos territoriales
- [ ] **Fase 6 — PQC** 🔐 Post-quantum cryptography para firmas y comunicaciones entre nodos
- [ ] **Fase 7 — App Móvil** 📱 React Native o PWA con capacidades offline

<br>

---

## 📋 Requisitos e Instalación

| Requisito | Versión mínima |
|-----------|---------------|
| Node.js | ≥ 22 |
| pnpm | ≥ 8 |
| Git | ≥ 2.30 |
| Supabase | Proyecto activo (gratuito) |

```bash
# 1. Clonar
git clone https://github.com/OsoPanda1/rdm-digital-hub-ldtocs.git
cd rdm-digital-hub-ldtocs

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp apps/rdm-hub/.env.local.example apps/rdm-hub/.env.local
# Editar .env.local con tus credenciales de Supabase

# 4. Iniciar desarrollo
pnpm dev
# → http://localhost:3000
```

<br>

---

## 🔐 Variables de Entorno

```env
# ─────────────────────────────────────────────────────────────
# Supabase (obligatorio)
# ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ─────────────────────────────────────────────────────────────
# Identidad del Nodo
# ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_NODE_ID=nd-rdm-hub-001
NEXT_PUBLIC_NODE_NAME=Nodo Cero — Real del Monte

# ─────────────────────────────────────────────────────────────
# Isabella AI (opcional para desarrollo)
# ─────────────────────────────────────────────────────────────
ISABELLA_CORE_ENDPOINT=https://isabella.example/api
ISABELLA_API_KEY=sk-...

# ─────────────────────────────────────────────────────────────
# Post-Quantum Cryptography (opcional)
# ─────────────────────────────────────────────────────────────
PQC_ALGORITHM_STANDARD=kyber512

# ─────────────────────────────────────────────────────────────
# Analytics (opcional)
# ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

<br>

---

## 🚀 Comandos

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia todos los workspaces en paralelo (Turborepo) |
| `pnpm dev --filter rdm-hub` | Solo el frontend Next.js en puerto 3000 |
| `pnpm build` | Build de producción de todos los workspaces |
| `pnpm build --filter rdm-hub` | Build solo de la app |
| `pnpm lint` | Lint de todos los workspaces |
| `pnpm test` | Tests (pendiente de implementar) |
| `pnpm turbo run build --cache-dir=.turbo` | Build con caché local |

<br>

---

## ▲ Deploy en Vercel

### Paso 1 — Conectar el repositorio

```
Vercel Dashboard → Add New → Project
→ Import Git Repository → OsoPanda1/rdm-digital-hub-ldtocs
```

### Paso 2 — Configurar el proyecto

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/rdm-hub` |
| **Build Command** | `cd ../.. && pnpm install && pnpm --filter rdm-hub build` |
| **Install Command** | `pnpm install` |
| **Output Directory** | `.next` (auto) |

### Paso 3 — Variables de Entorno

Agregar desde las Secrets de Vercel o directamente:

| Nombre | Descripción |
|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key de Supabase |
| `NEXT_PUBLIC_NODE_ID` | `nd-rdm-hub-001` |

### Paso 4 — Desplegar

```bash
# Opcional: deploy desde CLI
vercel --prod
```

### Paso 5 — Domain (opcional)

Configurar dominio personalizado `visitarealdelmonte.online` en:
```
Vercel Dashboard → Project → Domains
```

<details>
<summary><b>📋 El archivo <code>vercel.json</code> ya está configurado:</b></summary>

```json
{
  "version": 2,
  "name": "nodo-cero-rdm",
  "buildCommand": "cd ../.. && pnpm install && pnpm --filter rdm-hub build",
  "installCommand": "pnpm install",
  "builds": [
    { "src": "apps/rdm-hub/package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "apps/rdm-hub/$1" }
  ],
  "regions": ["sfo1", "iad1", "gru1"],
  "functions": {
    "apps/rdm-hub/app/api/**/*.ts": { "memory": 512, "maxDuration": 10 }
  }
}
```
</details>

<br>

---

## 🤝 Contribuir

Este es un proyecto de **soberanía territorial**. Las contribuciones deben alinearse con la filosofía del Nodo Cero:

1. **Fork** el repositorio
2. Crea una rama: `git checkout -b feat/mi-aporte`
3. Sigue la estructura de domains existente
4. Asegura que tu código pase: `pnpm lint && pnpm build`
5. Abre un Pull Request contra `main`

<br>

---

## 📜 Créditos y Filosofía

**RDM Digital Hub — Nodo Cero** es un proyecto de **soberanía digital territorial**. No es una app, no es un sitio web: es la **representación digital gobernada de un territorio con 500 años de historia**.

> *"La tecnología no debe extraer valor del territorio — debe amplificar su memoria, su cultura y su autonomía."*

### Principios

- **Datos soberanos** — La información del territorio pertenece al territorio
- **Gobernanza primero** — Toda decisión cognitiva es auditada, política-evaluada y trazable
- **Federación nativa** — Un nodo es el primero de muchos
- **Memoria perpetua** — La historia, mitos, dichos y cultura no se pierden en el olvido digital
- **Economía local** — La plataforma existe para servir a quienes habitan el territorio, no al revés

---

<div align="center">

<br>

**Real del Monte, Hidalgo, México** — Pueblo Mágico desde 2004

**Nodo Cero · RDM Digital Hub**

[![Hecho en México](https://img.shields.io/badge/Hecho_en_México-0a0b0e?style=for-the-badge&labelColor=0a0b0e&color=c8a356)]()

</div>
