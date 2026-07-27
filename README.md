<p align="center">
  <a href="https://github.com/OsoPanda1/rdm-digital-hub-ldtocs">
    <img src="public/tamv-rdm-framework-logo.svg" alt="TAMV Online Network — RDM Digital Hub" width="100%">
  </a>
</p>

<p align="center">
  <a href="https://orcid.org/0009-0008-5050-1539"><img src="https://img.shields.io/badge/ORCID-0009--0008--5050--1539-A6CE39?style=for-the-badge&logo=orcid&logoColor=white" alt="ORCID"></a>
  <a href="https://doi.org/10.5281/zenodo.20606361"><img src="https://img.shields.io/badge/DOI-10.5281%2Fzenodo.20606361-0298C5?style=for-the-badge&logo=doi&logoColor=white" alt="DOI Zenodo"></a>
  <a href="https://replit.com/"><img src="https://img.shields.io/badge/Platform-Replit_Autoscale-0F7BFF?style=for-the-badge&logo=replit&logoColor=white" alt="Replit Autoscale"></a>
  <a href="./LICENSE-PRCL.md"><img src="https://img.shields.io/badge/License-TAMV--PRCL-blueviolet?style=for-the-badge" alt="License: TAMV-PRCL"></a>
</p>

<table align="center" cellpadding="10">
  <tr>
    <td align="center" width="33%">
      <img src="artifacts/rdm-hub/public/images/logotamv.jpg" alt="TAMV Online Network" height="80"><br/>
      <strong>TAMV Online Network</strong><br/>
      <small>Marca del ecosistema</small>
    </td>
    <td align="center" width="33%">
      <img src="artifacts/rdm-hub/public/images/logo-rdm-digital.png" alt="RDM Digital Hub" height="80"><br/>
      <strong>RDM Digital Hub</strong><br/>
      <small>Nodo cero MD-X4</small>
    </td>
    <td align="center" width="33%">
      <img src="artifacts/rdm-hub/public/images/isabella-ai-logo.png" alt="Isabella AI" height="80"><br/>
      <strong>Isabella AI</strong><br/>
      <small>Motor IA Conversacional</small>
    </td>
  </tr>
</table>

---

<h1 align="center">RDM Digital Hub — LDTOCS</h1>

<p align="center">
  <em>"La tecnologia es el puente entre el patrimonio y el futuro."</em><br/>
  <strong>Anubis Villasenor — Urban Legend</strong>
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node-20.x-3C873A?logo=node.js&logoColor=white" alt="Node.js 20.x"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.9"></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-7.3.6-646CFF?logo=vite&logoColor=white" alt="Vite 7.3.6"></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white" alt="Supabase PostgreSQL"></a>
</p>
<p align="center">
  <a href="https://github.com/OsoPanda1/rdm-digital-hub-ldtocs/actions"><img src="https://img.shields.io/github/actions/workflow/status/OsoPanda1/rdm-digital-hub-ldtocs/ci.yml?label=CI&logo=github" alt="GitHub Actions CI"></a>
  <a href="./LICENSE-PRCL.md"><img src="https://img.shields.io/badge/License-TAMV--PRCL-blueviolet" alt="License: TAMV-PRCL"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/Software-MIT-green" alt="Software: MIT"></a>
</p>

---

Plataforma de **Soberania Digital**, **Turismo Inteligente** e **Infraestructura Federada** para comunidades, implementada como nodo replicable **TAMV MD-X4** en Real del Monte, Hidalgo, Mexico.

---

## Indice

| Seccion | Descripcion |
|---------|-------------|
| [Vision y Problematica](#vision-y-problematica-territorial) | El desafio social y tecnico que resuelve |
| [Arquitectura del Hub](#definicion-del-hub-nodo-cero-md-x4) | Que es el RDM Digital Hub |
| [7 Federaciones TAMV](#modelo-de-gobernanza-las-7-federaciones-del-tamv) | Modelo de gobernanza federada |
| [YUN — Constucion y Motor](#yun--motor-de-gobernanza-constitucional) | Bus de eventos, motor OPA, PQC, percepcion |
| [Monorepo y Estructura](#arquitectura-de-software-y-monorepo) | Estructura del repositorio |
| [Stack Tecnologico](#stack-tecnologico-unificado) | Tecnologias y justificacion |
| [Matriz de Madurez](#modulos-y-matriz-de-madurez) | 22 modulos auditados con % real |
| [Gamificacion y Living World](#gamificacion-phygital-territorial) | Sistema de juego territorial |
| [Banners Distribuidos](#sistema-de-banners--publicidad-distribuida) | 80 banners en toda la plataforma |
| [Isabella AI Engine](#isabella-ai-engine--omega-core-v40-enterprise) | IA conversacional con arquitectura completa |
| [THE C.R.O.W.N.](#the-crown--capas-de-razonamiento-optimizado) | 10 skills, BookPI, failover, capability gateway |
| [Podcast TAMV](#podcast-tamv--spotify-integration) | Podcast episodicos via Spotify |
| [Seguridad y Hardening](#seguridad-y-production-hardening) | Production hardening, PQC, PennyLane patterns |
| [Despliegue](#despliegue-e-infraestructura-soberana) | Replit Autoscale + Variables de entorno |
| [Respaldo Academico](#respaldo-academico-y-ciencia-abierta) | CITIS 2026, ORCID, Zenodo |
| [Licenciamiento](#regimen-de-licenciamiento) | Licencias multicapa |

---

## Vision y Problematica Territorial

### El Desafio Social

Comunidades locales y pueblos magicos operan bajo **cero soberania digital**, expuestos a la intermediacion extractiva de plataformas monopolisticas:

- **Extractivismo Economico:** perdida sistematica de capital local sin retorno a la comunidad.
- **Fragil Institucional:** vulnerabilidad ante cambios unilaterales en algoritmos y politicas de datos.
- **Fragmentacion:** turismo, comercio, cultura y civismo dispersos en apps desconectadas.
- **Erosion Identitaria:** interfaces genericas que ignoran patrimonio historico intangible.

### El Desafio Tecnico

1. **Dependencia de conectividad:** inoperatividad en zonas de montana.
2. **Sin gobernanza algoritmica:** ausencia de IA etica con contexto cultural.
3. **Puntos unicos de fallo:** arquitecturas centralizadas susceptibles a caidas.

---

## Definicion del Hub (Nodo Cero MD-X4)

**RDM Digital Hub** es la primera infraestructura **digital soberana, federada y antifragil** disenada desde el territorio:

- **Turismo Inteligente:** cartografia vectorial en tiempo real, clusterizacion de POIs, geofencing cultural.
- **Podcast TAMV:** episodios de cultura territorial integrados via Spotify.
- **Comercio Soberano:** conexion directa P2P sin comision extractiva.
- **IA Colectiva (Isabella AI):** asistente conversacional con pipelines eticos y arquitectura modular de skills.
- **Gemelos Digitales:** fusion de capas geoespaciales y datos territoriales.

---

## Modelo de Gobernanza: Las 7 Federaciones del TAMV

Articuladas por el bus de eventos **YUN**:

```text
                  ┌─────────────────────────────────────────┐
                  │          BUS DE EVENTOS YUN             │
                  └────────────────────┬────────────────────┘
                                       │
     ┌──────────┬──────────┬───────────┼───────────┬──────────┬──────────┐
     ▼          ▼          ▼           ▼           ▼          ▼          ▼
 ┌───────┐  ┌───────┐  ┌───────┐   ┌───────┐   ┌───────┐  ┌───────┐  ┌───────┐
 │  F1   │  │  F2   │  │  F3   │   │  F4   │   │  F5   │  │  F6   │  │  F7   │
 │Identid│  │Memoria│  │Turismo│   │Economí│   │Gemelos│  │  IA   │  │  PQC  │
 └───────┘  └───────┘  └───────┘   └───────┘   └───────┘  └───────┘  └───────┘
```

| Federacion | Nombre | Funcion |
|-----------|--------|---------|
| **F1** | Identidad Soberana | Autenticacion descentralizada, PKCE, reputacion civica |
| **F2** | Patrimonio y Memoria | Archivos inmutables, tradicion oral, enciclopedia territorial |
| **F3** | Turismo Inteligente | Rutas dinamicas, geofencing, mapas de calor |
| **F4** | Economia Local | Directorio comercial, intercambio justo, lealtad territorial |
| **F5** | Gemelos Digitales | Representacion 3D, monitoreo ambiental, mapas offline-first |
| **F6** | IA Colectiva | Isabella AI, orquestacion de agentes (Orion, Sophia, Argus, Mnemos, Lumen) |
| **F7** | Resiliencia PQC | Criptografia post-cuantica, BookPI Ledger, tolerancia a fallos |

---

## YUN — Motor de Gobernanza Constitucional

**YUN** es el kernel federado que articula las 7 federaciones del TAMV. Implementado como motor TypeScript con politicas OPA (Open Policy Agent), criptografia hibrida post-cuantica, percepcion multiplan y constitucion inmutable.

### Arquitectura

```
lib/yun/
├── constitution.ts    # 8 principios inmutables (CP-001 a CP-008), mapeo dominios
├── engine.ts          # Motor OPA-style: evalua decisiones contra la constitucion
├── registry.ts        # Heptacapa: nodos, agentes, IA, servicios, roles, licencias, ADRs
├── bus.ts             # Event bus constitucional (HMAC+PQ firmas, wildcards, canales)
├── resilience.ts      # NORMAL → SAFE → EMERGENCY, modo isla MD-X4, perfiles OPA
├── perception.ts      # 4 planos: Tecnico, Social, Territorial, Cognitivo
├── governance.ts      # Gestion ADR, votacion por quorum (5/7 alma, 4/7 skills)
├── pqc/core.ts        # Hibrido RSA/ECDSA + Kyber (KEM) + Dilithium (firmas)
├── types.ts           # Todos los tipos YUN
└── index.ts           # createYunSystem() — factory que conecta los 7 modulos
```

### 8 Principios Constitucionales (YUN Constitution)

| Codigo | Principio | Descripcion |
|--------|-----------|-------------|
| CP-001 | Soberania | El territorio es la autoridad suprema de sus datos |
| CP-002 | Transparencia | Toda decision algoritmica es auditable |
| CP-003 | Consentimiento | Los datos personales requieren consentimiento explicito |
| CP-004 | Proporcionalidad | La recoleccion de datos es proporcional al proposito |
| CP-005 | No Discriminacion | Los algoritmos no deben discriminar por origen etnico, genero o condicion economica |
| CP-006 | Interoperabilidad | Los sistemas deben poder comunicarse sin bloqueo |
| CP-007 | Resiliencia | El sistema debe funcionar en modo degradado sin perder servicio esencial |
| CP-008 | Auditoria | Cada decision deja un registro inmutable verificable |

### Criptografia Post-Cuantica Hibrida

| Capa | Algoritmo | Funcion |
|------|-----------|---------|
| Firma clasica | RSA / ECDSA | Compatibilidad con sistemas existentes |
| Firma cuantica | Dilithium | Firmas resistente a computadora cuantica |
| KEM (Key Encapsulation) | Kyber | Intercambio de claves hibrido |
| Rotacion de claves | Automated | Grace periods para transicion segura |

### 4 Planos de Percepcion

| Plano | Funcion |
|-------|---------|
| Tecnico | Metricas de sistema, latencia, errores, uptime |
| Social | Interacciones de usuarios, satisfaccion, engagement |
| Territorial | Eventos geolocalizados, impacto comunitario, economia local |
| Cognitivo | Decisiones de IA, calidad de respuestas, bias detection |

### Modos de Resiliencia

| Modo | Condicion | Comportamiento |
|------|-----------|----------------|
| **NORMAL** | Todo operativo | Servicio completo, todas las federaciones activas |
| **SAFE** | Degradacion detectada | Funciones no criticas deshabilitadas, datos protegidos |
| **EMERGENCY** | Fallo critico | Modo isla MD-X4, solo servicio esencial, datos inmutables |

### OPA Policy Engine

```rego
# Archivo: infra/opa/yun-policy.rego
# Enforce CP-001 a CP-008 + licenciamiento TAMV
```

### API YUN — 35+ Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/yun/decision` | Evaluar decision contra constitucion |
| GET | `/api/yun/constitution` | Ver principios activos |
| POST | `/api/yun/registry/nodes` | Registrar nodo federado |
| GET | `/api/yun/registry/nodes` | Listar nodos |
| POST | `/api/yun/bus/emit` | Emitir evento constitucional |
| GET | `/api/yun/bus/events` | Escuchar eventos (SSE) |
| GET | `/api/yun/resilience/status` | Estado de resiliencia |
| POST | `/api/yun/resilience/degrade` | Forzar modo degradado |
| GET | `/api/yun/perception/signals` | Sensores multiplan |
| POST | `/api/yun/governance/adr` | Crear ADR |
| POST | `/api/yun/governance/vote` | Votar ADR (quorum) |
| POST | `/api/yun/pqc/sign` | Firma hibrida PQC |
| POST | `/api/yun/pqc/verify` | Verificar firma hibrida |
| POST | `/api/yun/pqc/encrypt` | Encriptar con Kyber |
| POST | `/api/yun/pqc/decrypt` | Desencriptar con Kyber |

Ver `routes/yun.ts` para el listado completo.

---

## Arquitectura de Software y Monorepo

```text
rdm-digital-hub-ldtocs/
├── artifacts/
│   ├── api-server/               # Backend Express 5 — API Gateway (Node.js 20)
│   │   └── src/
│   │       ├── routes/           # 21 archivos de rutas (100+ endpoints)
│   │       ├── lib/isabella/     # Isabella Ω-Core v4.0 Enterprise (25 modulos)
│   │       ├── lib/yun/          # YUN Constitution Engine (10 modulos)
│   │       ├── lib/crown/        # THE C.R.O.W.N. — 10 skills + BookPI (15 archivos)
│   │       ├── lib/ai/           # Capa AI: ISA API, Mexa API, Knowledge (3 archivos)
│   │       ├── middlewares/       # Validacion Zod, auth, error handling
│   │       ├── db/               # Drizzle ORM client, schema
│   │       └── lib/env.ts        # Type-safe env config
│   └── rdm-hub/                  # Frontend SPA (React 19 + Vite 7 + Tailwind)
│       └── src/
│           ├── pages/            # 112 paginas
│           ├── components/       # 211 componentes (shadcn/ui + Leaflet + Three.js)
│           ├── modules/          # 13 modulos especializados
│           ├── hooks/            # Custom React hooks
│           ├── stores/           # Zustand stores
│           └── assets/           # 100+ imagenes, audio, video
├── lib/                          # Librerias compartidas del workspace
│   ├── db/                       # Schema Drizzle ORM compartido
│   ├── api-zod/                  # Validacion Zod para API
│   ├── api-spec/                 # OpenAPI spec + Orval codegen
│   └── api-client-react/         # Clientes API tipados (React hooks)
├── docs/                         # Documentacion tecnica
│   ├── adr/                      # Architecture Decision Records
│   ├── foundational/             # Documento Fundacional CANONIZADO (frozen)
│   └── isabella/                 # 15 archivos de documentacion Isabella
├── infra/
│   └── opa/                      # YUN OPA policy engine (Rego, data, ADR index)
├── .github/workflows/ci.yml     # CI: lint, security (Gitleaks), test, build
├── .agents/memory/               # Memoria de agentes IA
├── pnpm-workspace.yaml           # Workspaces con catalog protocol
└── package.json                  # Root workspace
```

### Numeros Clave

| Metrica | Valor |
|---------|-------|
| Paginas frontend | 112 |
| Componentes UI | 211 |
| Modulos especializados | 13 |
| API route files | 21 |
| API endpoints totales | 100+ |
| Isabella modules | 25 |
| YUN modules | 10 |
| C.R.O.W.N. skills | 10 + BookPI + Failover |
| Workspace libs | 4 |
| ADRs documentados | 3 |
| Assets multimedia | 100+ |

---

## Stack Tecnologico Unificado

| Capa | Tecnologia | Funcion |
|------|-----------|---------|
| **Frontend** | React 19 + TypeScript 5.9 | Renderizado reactivo con tipado estricto |
| **Build** | Vite 7.3.6 | Compilacion incremental, HMR |
| **Estilos** | Tailwind CSS + shadcn/ui | Diseno accesible, responsivo |
| **Routing** | React Router v7 | Lazy loading, navegacion SPA |
| **Estado** | Zustand | State management liviano |
| **Mapas** | Leaflet + Supercluster | Capas vectoriales, clusterizacion de POIs |
| **3D** | Three.js + React Three Fiber | Gemelos digitales, visualizaciones |
| **Animaciones** | Framer Motion | Transiciones y micro-interacciones |
| **Backend** | Express 5 + Node.js 20 | API Gateway asincrona |
| **DB** | Supabase (PostgreSQL) | Persistencia relacional con RLS |
| **ORM** | Drizzle ORM | Type-safe queries, migrations |
| **Validacion** | Zod | Schema validation end-to-end |
| **API Spec** | OpenAPI + Orval | Codegen de clientes tipados |
| **Podcast** | Spotify Embed API | Episodios de cultura territorial |
| **Gobernanza** | OPA (Rego) | YUN constitutional policy engine |
| **PQC** | Kyber + Dilithium (hibrido) | Criptografia post-cuantica |
| **Despliegue** | Replit Autoscale | Contenedores auto-escalables |

---

## Modulos y Matriz de Madurez

Auditoria real del codebase — porcentajes basados en codigo funcional vs. stubs/placeholders.

| # | Modulo | % | Estado | Archivos Clave |
|---|--------|---|--------|---------------|
| 1 | **Portal Turistico** | `78%` | 🟡 | `Index.tsx`, `Lugares.tsx`, `QuienesSomos.tsx` |
| 2 | **Motor Mapas** | `82%` | 🟢 | `Mapa.tsx`, `UnifiedMap.tsx`, `TerritorialSVGMap.tsx` |
| 3 | **Auth / Identidad** | `75%` | 🟡 | `RDMAuthContext.tsx`, `rbac.ts` |
| 4 | **Podcast TAMV** | `72%` | 🟡 | `Podcast.tsx`, `SpotifyPodcastPlayer.tsx`, `routes/podcast.ts` |
| 5 | **Musica Territorial** | `72%` | 🟡 | `Musica.tsx`, `SpatialPlayer.tsx` |
| 6 | **Gamificacion Phygital** | `60%` | 🟠 | `GamificationHUD.tsx`, `engine.ts`, `routes/gamification.ts` |
| 7 | **RDM Living World** | `58%` | 🟠 | `schema.ts`, `narrator.ts`, SQL triggers, ADR-001/003 |
| 8 | **Banners Comerciales** | `88%` | 🟢 | `banners-data.ts` (80), `BannerManager.tsx` |
| 9 | **Panel Admin** | `55%` | 🟠 | `Dashboard.tsx` — CRUD negocios funcional |
| 10 | **Isabella AI Engine** | `75%` | 🟡 | `routes/isabella.ts` (18 endpoints), `isabella/` (25 modulos) |
| 11 | **YUN Federation** | `85%` | 🟢 | `routes/yun.ts` (35+ endpoints), `lib/yun/` (10 modulos) |
| 12 | **Seguridad PQC** | `82%` | 🟢 | `yun/pqc/core.ts`, `isabella/crypto/federation.ts`, `isabella/security/` |
| 13 | **Directorio Comercios** | `80%` | 🟢 | `Comercios.tsx`, `BusinessCard.tsx` — Supabase live |
| 14 | **Transporte Local** | `55%` | 🟠 | `TransporteLocal.tsx` — datos cargan |
| 15 | **Wiki / Enciclopedia** | `65%` | 🟠 | `Wiki.tsx` — lectura Supabase |
| 16 | **Rutas Turisticas** | `82%` | 🟢 | `Rutas.tsx` — 6 rutas completas |
| 17 | **Ecoturismo** | `78%` | 🟡 | `Ecoturismo.tsx` — 6 actividades |
| 18 | **Donaciones** | `60%` | 🟠 | `Donar.tsx` — Stripe checkout funcional |
| 19 | **Realito AI Chat** | `68%` | 🟡 | `RealitoBubble.tsx` — chat UI + SSE |
| 20 | **Telemetria** | `55%` | 🟠 | `sentry.ts`, `TelemetryDashboard.tsx` |
| 21 | **Search / UX** | `55%` | 🟠 | `SearchOverlay.tsx` — client-side |
| 22 | **Digital Twins** | `48%` | 🟠 | `Map3DTwin.tsx` — conceptual |

### Leyenda

| Estado | Significado |
|--------|-------------|
| 🟢 80-100% | Produccion viable — pulido menor pendiente |
| 🟡 60-79% | Funcional — gaps notables en logica/persistencia |
| 🟠 40-59% | Parcial — UI funcional, datos mock o sin backend |
| 🔴 0-39% | Conceptual — arquitectura disenada, sin implementacion |

---

## Checklist de Funcionalidades Pendientes

### Produccion Cercana (pulido menor)

- [ ] **Podcast:** transcripcion automatica, busqueda full-text, estadisticas de escucha
- [ ] **Banners:** admin CRUD, click tracking, A/B testing
- [ ] **Mapas:** markers desde DB, heatmap layer, offline-first caching
- [ ] **Rutas:** booking funcional, "Descargar Mapa" real, reviews
- [ ] **Comercios:** detail page, reviews, photo galleries

### Funcional pero Incompleto

- [ ] **Portal:** image CDN, booking flow, SEO coverage, i18n
- [ ] **Auth:** JWT validation (actualmente spoofable headers), RLS policies, 2FA
- [ ] **Musica:** recommendation engine con datos reales, listening history
- [ ] **Isabella:** backend persistence (no in-memory), RAG pipeline real
- [ ] **Ecoturismo:** weather integration, trail calculator, user reviews
- [ ] **Donaciones:** donation history, tax receipts, recurring donations

### Requieren Trabajo Significativo

- [ ] **Gamificacion:** quest completion real, QR check-in, seasonal resets
- [ ] **Living World:** schema en produccion, world event scheduling, season rotation
- [ ] **Panel Admin:** analytics con datos reales, user management, audit log
- [ ] **Transporte:** real-time tracking, booking, schedules
- [ ] **Wiki:** article authoring, search, version history
- [ ] **Telemetry:** structured logging, Web Vitals, alerting
- [ ] **Search:** server-side search, fuzzy matching, autocomplete

### Conceptual (sin implementacion)

- [ ] **Digital Twins:** IoT sensor integration, BIM loading, 3D rendering
- [ ] **YUN cross-node:** P2P sync real entre nodos MD-X4

---

## Gamificacion Phygital Territorial

Sistema de **juego territorial phygital** que transforma la experiencia turistica en aventura interactiva.

### Bucle de Juego

```
Descubrir POI → Interactuar (QR/Sensor) → Validacion Criptografica → Recompensa (XP/Points) → Subir Nivel
```

### Rangos de Prestigio

1. **Explorador** — Rango base
2. **Cronista** — Rango intermedio
3. **Minero Legendario** — Rango avanzado
4. **Guardian del Pueblo** — Estatus maximo territorial

### Recompensas

- **RDM Points** canjeables en comercios participantes
- **Temporadas trimestrales (90 dias)** con leaderboards y premiacion en festivales

---

## RDM Living World — Arquitectura de Juego

Sistema evolutivo con gamificacion, narrativa inteligente, economia interna y coleccion de patrimonio.

### Decisiones de Arquitectura

| ADR | Estado | Contenido |
|-----|--------|-----------|
| ADR-001 | ACEPTADO | Esquema de datos, roadmap 6 fases |
| ADR-003 | ACEPTADO | Economia 8 monedas, prestigio territorial |
| ADR-004 | ACEPTADO | Isabella Omega Core v4.0 Enterprise |

### Base de Datos (Drizzle ORM + Supabase)

Schema en `artifacts/api-server/src/db/schema.ts`:

- **players** / **player_avatars** — Identidad y avatar
- **territories** / **poi_state** — POIs y eventos
- **seasons** / **world_state_snapshots** — Temporadas
- **player_currencies** — 8 tipos de moneda
- **progression_branches** / **player_progressions** — 6 ramas
- **items** / **collections** / **player_items** — Coleccionables
- **world_events** / **community_challenges** — Eventos y retos
- **narrative_messages** — Mensajes de Realito e Isabella
- **isabellaMemory** — Memoria persistente de Isabella
- **isabellaEvaluationResults** — Evaluaciones de calidad IA

### Economia Interna (ADR-003)

| Moneda | Uso |
|--------|-----|
| XP | Progresion general |
| COIN | Compras de cosmeticos |
| CRYSTAL | Recompensas raras |
| PRESTIGE | Logros comunitarios |
| HONOR | Acciones eticas |
| ENERGY | Stamina de sesion |
| INFLUENCE | Activar eventos globales |
| TERRITORIAL_IMPACT | Impacto positivo en territorio |

### Triggers SQL

`supabase/triggers/rdm_world_state.sql` — 5 triggers automaticos para sincronizar snapshots, retos, actividad de jugadores y estado de POIs.

---

## Sistema de Banners — Publicidad Distribuida

**80 banners** distribuidos en todas las paginas con rotacion automatica.

| Categoria | Cantidad | Paginas |
|-----------|----------|---------|
| Comercio Local | 16 | Directorio, Comercios, Homepage |
| Turismo | 12 | Mapa, Rutas, Ecoturismo |
| Cultura | 10 | Cultura, Patrimonio, Historia |
| Tecnologia | 10 | Isabella AI, FAQ, Arquitectura |
| Gastronomia | 8 | Gastronomia, Ruta del Paste |
| Eventos | 8 | Eventos, Comunidad |
| Membresias | 6 | Membresias, Premium |
| Podcast | 5 | Podcast |
| Musica | 5 | Musica |
| **Total** | **80** | |

**BannerManager** — route-aware, rotacion 30min, dismiss persistente, grid responsive, auto-hide en admin/auth.

---

## Isabella AI Engine — Omega Core v4.0 Enterprise

Motor de **IA Conversacional** con arquitectura completa de gobernanza etica, memoria, criptografia federada y skills modulares.

### Backend — 18 Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/isabella/chat` | Conversacion con clasificacion de intencion |
| GET | `/api/isabella/stream` | SSE streaming de decisiones |
| GET | `/api/isabella/decisions` | Historial de decisiones |
| GET | `/api/isabella/status` | Salud del sistema |
| POST | `/api/isabella/feedback` | Feedback del usuario |
| GET | `/api/isabella/knowledge` | Base de conocimiento |
| POST | `/api/isabella/knowledge` | Agregar entrada |
| POST | `/api/tts-isabella` | Text-to-Speech proxy |
| GET | `/api/isabella/sessions` | Sesiones activas |
| POST | `/api/isabella/sessions/:id/close` | Cerrar sesion |
| POST | `/api/isabella/cognitive/process` | Procesamiento cognitivo |
| GET | `/api/isabella/soul/status` | Estado del alma (SOUL) |
| POST | `/api/isabella/memory/recall` | Recall de memoria multiescalar |
| POST | `/api/isabella/memory/store` | Almacenar en memoria |
| GET | `/api/isabella/federation/status` | Estado de federacion |
| POST | `/api/isabella/crypto/sign` | Firma de payloads |
| GET | `/api/isabella/evaluation/quality` | Metricas de calidad |
| GET | `/api/isabella/skills/registry` | Registro de skills |

### Omega Core — 25 Modulos TypeScript

```
lib/isabella/
├── types.ts                  # Sistema de tipos completo (Core, SOUL, Federation, Crypto, Skills)
├── index.ts                  # Barrel export unificado
├── soul/
│   └── identity.ts           # SOUL identity, 7 agentes, 16 politicas eticas, 7 NEVER rules
├── core/
│   ├── personality.ts        # Motor de personalidad 3S, 5 modos
│   └── orchestrator.ts       # Orquestador cognitivo, 17 patrones de intencion
├── memory/
│   ├── engine.ts             # Motor de memoria multiescalar (7 tipos)
│   ├── librarian.ts          # Adaptador Librarian
│   ├── multiscale-rag.ts     # RAG multi-escala
│   └── score-pra.ts          # Scoring de relevancia
├── crypto/
│   └── federation.ts         # Mascaras SHA-256, firma de payloads
├── evaluation/
│   └── engine.ts             # 4 metricas de calidad/etica
├── skills/
│   └── registry.ts           # Registro ClawHub + 7 builtins
├── fair/
│   └── metrics.ts            # Deteccion de bias (5 patrones), guardrails
├── genesis/
│   ├── bookpi.ts             # BookPI Ledger
│   ├── context-engine.ts     # Motor de contexto
│   ├── ethical-firewall.ts   # Firewall etico
│   ├── interpretability.ts   # Explicabilidad
│   ├── knowledge-layer.ts    # Capa de conocimiento
│   └── reasoner.ts           # Razonador
├── security/
│   ├── anubis-sentinel.ts    # Sentinel de seguridad
│   ├── dual-layer.ts         # Seguridad dual capa
│   └── pqc-crypto.ts         # PQC para Isabella
├── event-bus/
│   └── index.ts              # Event bus tipado
├── xrai/
│   └── renderer.ts           # Generacion de escenas XR, 5 formatos de export
└── types/
    └── decision-record.ts    # Tipos de registro de decisiones
```

### Capa AI Adicional

```
lib/ai/
├── isa-api.ts            # Core cognitivo ISA, prompt guard, parser de intenciones
├── mexa-api.ts           # Capa de criptografia de soberania Mexa
└── knowledge.ts          # 19 entradas de conocimiento TAMV (5 dominios)
```

### Frontend

| Componente | Estado |
|-----------|--------|
| IsabellaChat | Chat UI con hashing federado |
| IsabellaVoiceEngine | STT + TTS con emociones |
| IsabellaOrb | Orbe animado que abre chat |
| useIsabella / useIsabellaSSE | Streaming chat + SSE |
| isabellaStore (Zustand) | Estado global |
| isabella-guardian | Politica de seguridad (NORMAL/SAFE/EMERGENCY) |
| ExperienceOrchestrator | Motor de decisiones geoespaciales |

### Base de Datos

- **isabella_sessions** — Persistencia de conversaciones
- **isabella_decisions** — Auditoria con mode (NORMAL/SAFE/EMERGENCY)
- **isabella_feedback** — Calificaciones de usuarios
- **isabella_knowledge** — Base de conocimiento para RAG
- **isabellaMemory** — Memoria persistente de Isabella
- **isabellaEvaluationResults** — Evaluaciones de calidad

---

## THE C.R.O.W.N. — Capas de Razonamiento Optimizado

Capa de **orquestacion cognitiva** que extiende Isabella con 10 skills especializados, BookPI telemetry y failover automatico.

### Arquitectura

```
lib/crown/
├── index.ts                # Barrel export
├── types.ts                # Tipos C.R.O.W.N.
├── capability-gateway.ts   # Gateway de capacidades — routing inteligente a skills
├── provider-failover.ts    # Failover automatico entre providers (OpenAI → Mexa → local)
├── bookpi-telemetry.ts     # Telemetria BookPI — metrics, audit trail, usage tracking
└── skills/
    ├── architecture-reasoning.ts    # Razonamiento arquitectonico
    ├── continuous-learning.ts       # Aprendizaje continuo
    ├── digital-twin.ts              # Gemelos digitales
    ├── execution-fabric.ts          # Fabrica de ejecucion
    ├── knowledge-fabric.ts          # Tejido de conocimiento
    ├── massive-context.ts           # Contexto masivo (>100k tokens)
    ├── memory-fabric.ts             # Tejido de memoria
    ├── multi-agent-collective.ts    # Colectivo multi-agente
    ├── self-evaluation.ts           # Auto-evaluacion
    └── strategic-intelligence.ts    # Inteligencia estrategica
```

### 10 Skills

| Skill | Funcion |
|-------|---------|
| Architecture Reasoning | Analisis y diseno de arquitecturas de software |
| Continuous Learning | Aprendizaje incremental de interacciones |
| Digital Twin | Interaccion con gemelos digitales territoriales |
| Execution Fabric | Orquestacion de tareas complejas |
| Knowledge Fabric | Tejido de conocimiento interconectado |
| Massive Context | Procesamiento de contexto >100k tokens |
| Memory Fabric | Memoria persistente de largo plazo |
| Multi-Agent Collective | Coordinacion colectiva de agentes |
| Self-Evaluation | Autoevaluacion continua de calidad |
| Strategic Intelligence | Razonamiento estrategico de largo plazo |

### Failover

El **ProviderFailover** gestiona automaticamente la conmutacion entre providers de IA:

1. **OpenAI** (produccion) → 2. **Mexa API** (fallback soberano) → 3. **Local** (modo isla)

Cada provider tiene metricas de latencia, tasa de exito y costo asociado.

---

## Podcast TAMV — Spotify Integration

Sistema de **podcast episodico** para contenido de cultura territorial de Real del Monte. Reemplaza el anterior sistema de Radio FM (AzuraCast/Liquidsoap, eliminado en commit `2984a1a`).

### Stack

| Componente | Tecnologia |
|-----------|-----------|
| Episodios | Spotify Embed API (iframe) |
| Backend | Express `/api/podcast/*` |
| Frontend | `Podcast.tsx` + `SpotifyPodcastPlayer.tsx` |
| Datos | Spotify RSS feed |

### API Podcast

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/podcast/episodes` | Listar episodios |
| GET | `/api/podcast/episode/:id` | Detalle de episodio |
| GET | `/api/podcast/search` | Buscar episodios |

### Frontend

- **Podcast.tsx** — Pagina principal con listado de episodios
- **SpotifyPodcastPlayer.tsx** — Widget de reproduccion Spotify embebido

---

## Seguridad y Production Hardening

Produccion endurecida siguiendo patrones de PennyLane (PennyLaneAI/pennylane) — gitleaks, CI concurrency, pre-commit hooks, coverage thresholds.

### Commits de Hardening

| Commit | Contenido |
|--------|-----------|
| `36dfcd7` | CSS color system audit (7 archivos) |
| `9068822` | Documentacion completa (15 archivos, 2,126 lineas) |
| `2984a1a` | Radio → Podcast migration (18 archivos) |
| `d9c6d52` | **P0 Production Hardening** (13 archivos, +647/-88 lineas) |

### P0 Hardening (`d9c6d52`)

| Area | Cambio | Archivo |
|------|--------|---------|
| **Env安全** | Hardcoded fallbacks eliminados | `mexa-api.ts`, `yun/index.ts` |
| **Env config** | Type-safe env validation at startup | `lib/env.ts` |
| **CORS** | `origin: true` → explicit allowlist (`ALLOWED_ORIGINS`) | `app.ts` |
| **Error handling** | Global error handler `(err, req, res, next)` | `app.ts` |
| **Tracing** | Lightweight span-based tracing, slow span alerts >1s | `lib/tracing.ts`, `app.ts` |
| **Validation** | Zod-style middleware for critical routes | `middlewares/validate.ts` |
| **Health** | DB connectivity check (`SELECT 1`), pool stats | `routes/health.ts` |
| **Graceful shutdown** | `SIGTERM`/`SIGINT` handlers + `closeDb()` | `index.ts` |
| **Gitignore** | `.env`, `.env.local`, `.env.*.local` patterns | `.gitignore` |
| **CI/CD** | Lint, security (Gitleaks), test, build, concurrency groups | `.github/workflows/ci.yml` |

### Secrets Policy

NO hardcoded fallbacks. Server refuses to start without:
- `MEXA_API_SECURE_KEY` — Mexican sovereignty API key
- `YUN_SIGNING_SECRET` — YUN event bus HMAC signing key

### CI/CD Pipeline

| Job | Steps |
|-----|-------|
| **lint** | typecheck + build |
| **security** | Gitleaks secret scanning |
| **test** | PostgreSQL service container + vitest |
| **build** | Full build verification |

Scheduled weekly tests + concurrency groups prevent duplicate runs.

---

## Despliegue e Infraestructura Soberana

### Variables de Entorno (Replit Secrets)

```env
VITE_SUPABASE_URL=https://tu-instancia.supabase.co
VITE_SUPABASE_ANON_KEY=tu-llave-publica-anonima
MEXA_API_SECURE_KEY=tu-llave-mexa
YUN_SIGNING_SECRET=tu-secreto-yun
NODE_ENV=production
PORT=8080
```

### Ejecucion Local

```bash
git clone https://github.com/OsoPanda1/rdm-digital-hub-ldtocs.git
cd rdm-digital-hub-ldtocs
pnpm install

# Frontend
pnpm --filter @workspace/rdm-hub run dev

# Backend
pnpm --filter @workspace/api-server run dev
```

### Replit

- Backend: `artifacts/api-server/.replit-artifact/artifact.toml`
- Health check: `/api/healthz` (includes DB connectivity)
- Puerto interno: 8080 (Node 20 Autoscale)

### Seguridad del Monorepo

- **minimumReleaseAge: 1440** — paquetes npm deben tener 1+ dia de publicacion (defensa supply-chain)
- **Exclusiones:** solo `@replit/*` y `stripe-replit-sync`
- **Overrides:** exclusiones de plataforma para esbuild, lightningcss, tailwindcss/oxide, rollup (solo linux-x64)

---

## Respaldo Academico y Ciencia Abierta (CITIS 2026)

- **Conferencia:** XII International Conference on Science, Technology, and Innovation for Society (CITIS 2026)
- **ORCID:** [0009-0008-5050-1539](https://orcid.org/0009-0008-5050-1539)
- **DOI Zenodo:** [10.5281/zenodo.20606361](https://doi.org/10.5281/zenodo.20606361)

```bibtex
@article{castillo2026rdmdigital,
  author    = {Castillo Trejo, Edwin Oswaldo (Anubis Villasenor)},
  title     = {RDM Digital Hub: Arquitectura Tecnologica Territorial},
  journal   = {TAMV Online Network Publications},
  year      = {2026},
  doi       = {10.5281/zenodo.20606361}
}
```

---

## Regimen de Licenciamiento

| Componente | Licencia | Archivo |
|-----------|---------|---------|
| Software abierto y documentacion | MIT | `LICENSE` |
| Kernel tecnologico TAMV | TAMV-PRCL v1.0 | `LICENSE-PRCL.md` |
| Motor de IA (Isabella) | TAMV-EOL v1.0 | `LICENSE-EOL.md` |
| Interoperabilidad y conectores | TAMV-KORIMA | `LICENSE-KORIMA.md` |
| Hibrido | TAMV-HYBRID | `LICENSE-HYBRID.md` |
| Datos territoriales y soberania | DPA | `DATA-SOVEREIGNTY-DPA.md` |

---

**Hecho con ❤️ para Real del Monte, Hidalgo, Mexico.**
**Entre montanas y neblina — RDM Digital Hub. Orgullosamente realmontenses.**

© 2026 RDM Digital · TAMV Online Network
