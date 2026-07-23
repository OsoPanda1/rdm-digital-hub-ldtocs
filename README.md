# RDM Digital Hub — LDTOCS

**Plataforma de Soberanía Digital, Turismo Inteligente e Infraestructura Federada para Comunidades**

> "La tecnología es el puente entre el patrimonio y el futuro."

---

## Tabla de Contenidos

- [¿Qué problema abordamos?](#qué-problema-abordamos)
- [¿Qué es RDM Digital Hub?](#qué-es-rdm-digital-hub)
- [¿Cómo lo resuelve?](#cómo-lo-resuelve)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Stack Tecnológico](#stack-tecnológico)
- [Módulos y Funcionalidades](#módulos-y-funcionalidades)
- [Estado del Proyecto](#estado-del-proyecto)
- [Deuda Técnica y Documental](#deuda-técnica-y-documental)
- [Roadmap](#roadmap)
- [Primeros Pasos](#primeros-pasos)
- [Comunidad y Contribución](#comunidad-y-contribución)
- [Licencia](#licencia)

---

## ¿Qué problema abordamos?

### Problema Social y Global

**La mayoría de las comunidades, pueblos mágicos, gobiernos locales y pequeñas organizaciones no tienen soberanía digital.** Dependen de plataformas cerradas (Google Maps, Facebook, Instagram, Wix, Squarespace) que:

1. **Extraen valor económico** de su patrimonio cultural sin retorno a la comunidad.
2. **No garantizan continuidad** — un cambio de algoritmos o políticas puede borrar años de contenido.
3. **Fragmentan la información** — el turista necesita 5+ apps para planear una visita.
4. **Erosionan la identidad cultural** al homogenizar la presentación del contenido.
5. **No ofrecen soberanía de datos** — la comunidad no controla su propia narrativa digital.
6. **Carecen de infraestructura federada** — cada iniciativa Digital comienza desde cero.

### Problema Técnico

Las plataformas existentes para turismo y comunidades:
- Son **costosas** (SAAS, suscripciones, comisiones por transacción).
- Requieren **conexión permanente a Internet** (no funcionan off-line first).
- No ofrecen **mapas interactivos soberanos** (dependen de Google Maps API con costos variables).
- Carecen de **gamificación, IA contextual y federación** entre comunidades.
- Están **centralizadas** (un solo punto de fallo, censura y extracción de datos).

---

## ¿Qué es RDM Digital Hub?

RDM Digital Hub es una **plataforma de código abierto** que ofrece a comunidades, pueblos mágicos, gobiernos locales y organizaciones una **infraestructura digital soberana, federada y antifrágil** para:

- **Turismo Inteligente**: Guía digital completa con mapa interactivo, rutas, eventos, gastronomía, historia, directorio de servicios.
- **Identidad y Gobernanza**: Sistema de membresías, autenticación federada, perfiles de usuario, roles y permisos.
- **Gemelos Digitales Territoriales**: Fusión de datos geoespaciales, sensoriales y comunitarios para crear representaciones digitales de territorios.
- **IA Soberana (Isabella)**: Asistente de inteligencia artificial con identidad, memoria emocional, protocolos de conocimiento y habilidades modulares (Orion, Sophia, Argus, Mnemos, Lumen).
- **Ecosistema Federado**: Conexión entre múltiples comunidades mediante federación, permitiendo intercambio de datos, rutas y experiencias entre territorios.
- **Economía Digital Propia**: Sistema de gamificación con puntos, logros, leaderboards y rewards; membresías con beneficios escalonados (Free → Premium → Advance → Enterprise).
- **Infraestructura Cuántico-Resiliente**: Criptografía post-cuántica, protocolos de seguridad de doble hexágono, aislamiento de contexto.

Implementado inicialmente para **Real del Monte, Pueblo Mágico de Hidalgo, México**, RDM Digital Hub es una **plantilla replicable** (TAMV MD-X4) que cualquier comunidad puede adaptar y desplegar.

---

## ¿Cómo lo resuelve?

### Principios de Diseño

| Principio | Implementación |
|-----------|---------------|
| **Soberanía** | Código abierto (MIT), autogestionable en Replit, sin dependencia de plataformas cerradas |
| **Antifragilidad** | Arquitectura modular, graceful degradation sin APIs externas, modo demo integrado |
| **Federación** | Protocolo YUN para conectar comunidades entre sí, intercambio de datos soberano |
| **Identidad Cultural** | CSS con tokens de diseño propios (RDM theme), contenido curado por la comunidad |
| **Offline-First** | Mapas con tiles auto-contenidos, datos cacheados, progresive enhancement |
| **Seguridad por Diseño** | Criptografía post-cuántica, doble hexágono de autorización, zero-trust |
| **IA Ética** | Isabella con juramento fundacional, consciousness pipeline, memoria emocional |

### Stack Tecnológico

```
Frontend:         React 19 + TypeScript 5.9 + Vite 7.3.6 + Tailwind CSS 4
Routing:          react-router-dom v6 (Browser Router, lazy loading)
Estado:           TanStack React Query + Zustand + Context API
Animaciones:      Framer Motion
Mapas:            Leaflet + React-Leaflet + Supercluster
UI Framework:     shadcn/ui (Radix primitives + Tailwind)
3D/Visual:        Three.js + React Three Fiber + Drei
Auth:             Supabase Auth (PKCE) + RDMAuthContext
Base de Datos:    Supabase (PostgreSQL) + Drizzle ORM
API:              Express 5 (api-server) + Zod validation
IA:               Isabella (arquitectura propia de conciencia)
Despliegue:       Replit Autoscale (Node 20) + pnpm workspaces + GitHub Actions CI
Build:            Vite 7 + esbuild, 3,437 módulos, ~55s
```

### Módulos y Funcionalidades

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| **Portal Turístico** | 78% | Página principal, mapa interactivo, rutas, eventos, gastronomía, historia, directorio |
| **Mapa Interactivo** | 85% | Leaflet con clusters, POIs territoriales, capas de federación, modo niebla |
| **Sistema de Autenticación** | 90% | Supabase Auth, PKCE, roles (user/admin), sesión persistente |
| **Isabella AI** | 65% | Pipeline de conciencia, 5 habilidades (Orion, Sophia, Argus, Mnemos, Lumen), API REST |
| **Gamificación** | 40% | Puntos, quests, leaderboard, perfil de jugador |
| **Música y Audio** | 55% | Reproductor espacial, álbumes locales, donaciones, mecenazgo |
| **Membresías** | 45% | 4 niveles (Free/Premium/Advance/Enterprise), stripe-checkout |
| **Directorio de Comercios** | 70% | Registro, checkout, panel de control, catálogo de comercios |
| **Federación YUN** | 30% | Bus de eventos, coordinador de federación, gateway, data fabric |
| **Wiki/Enciclopedia** | 50% | Wiki TAMV, artículos, búsqueda, sidebar |
| **Gemelos Digitales** | 25% | TerritorialDataCollector, TerritorialFusionEngine, TerritorialGeofencer |
| **Seguridad Post-Cuántica** | 35% | PQC, sanitize, blockchain connector, context isolation |
| **Telemetría y Monitoreo** | 30% | Prometheus, UI telemetry, health dashboard |
| **Admin Panel** | 60% | Dashboard admin, gestión de música, panel de control |

---

## Estado del Proyecto

### Métricas de Progreso

```
┌─────────────────────────────────────┬──────────┬──────────────────────────┐
│ Componente                         │  Avance  │  Estado                  │
├─────────────────────────────────────┼──────────┼──────────────────────────┤
│ Pages implementadas                │  110     │  110 únicas en App.tsx   │
│ Componentes activos                │  85+     │  +60 UI shadcn           │
│ Hooks activos                      │  22      │  importados en App       │
│ Archivos de datos                  │  25      │  6 muertos identificados │
│ Tests                              │  6       │  Críticamente bajo       │
│ Coverage                           │  <1%     │  Sin CI/CD de tests      │
│ TypeScript strict                  │  Parcial  │  <10 any, 1 ts-nocheck  │
│ Build (vite)                       │  ✅  3,437 mód │ 54s, 0 errores        │
│ CI (GitHub Actions)                │  ✅ Configurado │ ubuntu + Node 20    │
└─────────────────────────────────────┴──────────┴──────────────────────────┘
```

### Porcentajes Reales de Avance a Producción

| Área | Avance Real | Notas |
|------|-------------|-------|
| **UI/UX visible** | 78% | 110 páginas renderizables, faltan pulir estados vacío/error/carga |
| **Backend (API)** | 25% | Express api-server existe pero no está conectado al frontend |
| **Base de datos** | 40% | Esquema Supabase definido, migraciones presentes, pero uso real mínimo |
| **Autenticación** | 85% | Login/register funcionan, falta recovery MFA y admin completo |
| **IA Isabella** | 50% | Pipeline definido, API router listo, falta integración con LLM real |
| **Mapas** | 75% | Visualización funciona, falta edición territorial y datos en vivo |
| **Federación** | 15% | Arquitectura definida, implementación básica, no operativa |
| **Gamificación** | 25% | Puntos y quests definidos, UI parcial, sin engine operativo |
| **Seguridad** | 30% | Post-quantum definido, sanitize listo, falta integración en APIs |
| **Pruebas** | 3% | Solo 6 tests, sin coverage, sin CI |
| **Documentación** | 15% | README nuevo, replit.md pendiente, falta documentación técnica |
| **DevOps/CI** | 10% | Replit autoscale configurado, sin CI/CD pipeline fuera de Replit |
| **Producción estable** | 35% | Despliegue en Replit, sin dominio propio, sin SSL dedicado |

**Promedio de madurez general: ~42%**

---

## Deuda Técnica y Documental

### Deuda Técnica Identificada

| Prioridad | Ítem | Impacto | Archivos |
|-----------|------|---------|----------|
| ✅ **RESUELTO** | `src/app/` (Next.js routes) eliminado | Limpieza Fase 1 | `src/app/` |
| ✅ **RESUELTO** | 7 páginas huérfanas eliminadas | Dead code quirúrgico | `ComunidadPage.tsx`, `Documentation.tsx`, `MapaVivo.tsx`, `Membership.tsx`, `RegistrarComercio.tsx`, `WikiTAMV.tsx`, `not-found.tsx` |
| ✅ **RESUELTO** | `@ts-nocheck` en sentry.ts eliminado | Type safety restaurado | `sentry.ts` |
| ✅ **RESUELTO** | `any` types reducidos (~25→<10) | Type safety mejorado | `AtlasMaximus.tsx`, `secure-random.ts`, `pqc.ts` |
| ✅ **RESUELTO** | pnpm-workspace cross-platform | Overrides win32 removidos | `pnpm-workspace.yaml` |
| ✅ **RESUELTO** | Build CI configurado | GitHub Actions | `.github/workflows/ci.yml` |
| ✅ **RESUELTO** | Tags HTML rotos (QuienesSomos, Tenochtitlan) | Build fixes | `QuienesSomos.tsx`, `Tenochtitlan.tsx` |
| ✅ **RESUELTO** | 4 imports de React Start erradicados | Funciones migradas a runtime Vite/React Router | `auth-middleware.ts`, `auth-attacher.ts`, `example.functions.ts`, `telemetry.functions.ts` |
| 🟠 **ALTO** | ~60+ componentes nunca importados | Dead code, peso muerto en bundle | Componentes root `/components/*` |
| 🟠 **ALTO** | 13 archivos `src/data/imported/*.ts` nunca importados | Datos duplicados, inconsistencia | Todo `data/imported/` |
| ✅ **RESUELTO PARCIAL** | Flujos activos migrados a `RDMLayout` | Shims heredados no usados quedan para compatibilidad | `MainLayout` → `RDMLayout` |
| 🟡 **MEDIO** | 9 pares de componentes duplicados | Código redundante, mantenimiento duplicado | `UnifiedMap`, `IsabellaVoiceEngine`, `IsabellaChat`, `BusinessCard`, `PostCard`, `HeroSection`, `Footer`, etc. |
| ✅ **RESUELTO** | `wouter` eliminado del catálogo, frontend y lockfile | Menos superficie de dependencia | `pnpm-workspace.yaml`, `artifacts/rdm-hub/package.json` |
| 🟢 **BAJO** | 5 archivos de seguridad nunca importados | Código diseñado pero no integrado | `security/` (5 files) |
| 🟢 **BAJO** | 2 hooks nunca importados | Funcionalidad no expuesta | `use-isabella-voice-engine.ts`, `use-gamification.ts` |
| ✅ **RESUELTO** | Audio renombrado sin espacios/paréntesis | Rutas Linux/Replit seguras | `adicted_toyou.mp3`, `legado_1.mp3`, `rdmintro_2.mp3` |

### Deuda Documental

| Documento | Estado | Prioridad |
|-----------|--------|-----------|
| README.md | ✅ Creado | — |
| CODE_OF_CONDUCT.md | ✅ Creado | — |
| CONTRIBUTING.md | ✅ Creado | — |
| LICENSE | ✅ Creado (MIT) | — |
| SECURITY.md | ✅ Creado | — |
| Issue templates | ✅ Creados | — |
| PR template | ✅ Creado | — |
| replit.md | 🔄 Pendiente | Media |
| API Documentation | ❌ No existe | Alta |
| Architecture Decision Records | ❌ No existe | Media |
| Guía de despliegue | ❌ No existe | Alta |
| Wiki técnica | ❌ No existe | Baja |
| Storybook/Component Library | ❌ No existe | Baja |

### Resumen de Salud del Proyecto

```
Salud General:        🟡 52/100 — "En rehabilitación activa"
Código activo:        🟢 72% del código es funcional
Dead code:            🔴 ~18% (est. 80+ archivos muertos)
Type Safety:          🟡 ~80% tipado, <10 any, 51 ts-nocheck
Test Coverage:        🔴 <1% (emergencia)
Documentación:        🟢 25% cubierto (README, CI, RFC, templates)
Producción:           🟡 40% — build exitoso, CI configurado, funciona en Replit
Mantenibilidad:       🟡 Media-alta — Fase 1 y 2 completadas
```

---

## Roadmap

### ✅ Fase 1: Sanitización (Completada — 100%)
- [x] Eliminar TanStack Router, routes/, start.ts, server.ts
- [x] Eliminar componentes site/ (Navbar, Footer, ModulePortal, PageHero)
- [x] Eliminar Navbar.tsx, Footer.tsx, FooterSection.tsx, BrumaFooter.tsx
- [x] Unificar layout a RDMLayout (12 páginas + 2 layouts)
- [x] Limpiar referencias a Lovable, Vercel, Netlify, Cloudflare
- [x] Eliminar `src/app/` (Next.js routes, ~20 archivos muertos)
- [x] Eliminar 7 páginas huérfanas no importadas por el router
- [x] Corregir tags HTML rotos (QuienesSomos, Tenochtitlan)
- [x] Commit fase-1-complete (`41970ee`) y push a main

### ✅ Fase 2: Estabilización Técnica (Completada — 100%)
- [x] Configurar CI (GitHub Actions) con build
- [x] Corregir pnpm-workspace.yaml (vite ^7.3.6, win32 overrides removidos)
- [x] Eliminar `@ts-nocheck` de sentry.ts
- [x] Reducir `any` types (~25→<10 en archivos sin @ts-nocheck)
- [x] Tipar AtlasMaximus.tsx con tipos concretos (TerritoryPOI, Mine, etc.)
- [x] Build verificado: 3,437 módulos, 54s, 0 errores
- [x] Commit fase-2 (`fa8a354`) y push a main

### Fase 3: Completitud Funcional (Q3-Q4 2026)
- [ ] Eliminar ~60+ componentes nunca importados (tercera pasada)
- [ ] Eliminar 13 archivos data/imported/ duplicados
- [ ] Fusionar 9 pares de componentes duplicados
- [x] Migrar flujos activos de `MainLayout` a `RDMLayout`
- [ ] Alcanzar >10% test coverage
- [ ] Configurar lint estricto (eslint + prettier)
- [x] Renombrar archivos con espacios/paréntesis

### Fase 4: Producción y Escalamiento (Q1 2027)
- [ ] Conectar api-server Express con frontend
- [ ] Integración completa de Supabase DB
- [ ] Isabella AI con LLM real
- [ ] Sistema de federación operativo
- [ ] Gamificación completa
- [ ] Módulo de pagos (Stripe) operativo
- [ ] Despliegue con dominio propio y SSL
- [ ] Hardening de seguridad
- [ ] Performance optimization (bundle, imágenes, caché)
- [ ] Monitoreo y alertas
- [ ] Documentación completa
- [ ] Plantilla replicable documentada (TAMV MD-X4)
- [ ] Lanzamiento público

---

## Primeros Pasos

### Requisitos

- Node.js 20+ (Replit usa Node.js 20)
- pnpm 9+
- Supabase project (gratuito)
- Replit account (recomendado)

### Instalación

```bash
# Clonar
git clone https://github.com/OsoPanda1/rdm-digital-hub-ldtocs.git
cd rdm-digital-hub-ldtocs

# Instalar dependencias
pnpm install

# Variables de entorno (copiar y llenar)
cp artifacts/rdm-hub/.env.example artifacts/rdm-hub/.env

# Desarrollo
pnpm --filter @workspace/rdm-hub run dev

# Typecheck
pnpm run typecheck

# Build
pnpm run build
```

### Variables de Entorno Requeridas

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SENTRY_DSN=            # Opcional
VITE_APP_ENV=development     # development | preview | production
```

---

## Comunidad y Contribución

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para guía de contribución.

### Código de Conducta

Este proyecto sigue un [Código de Conducta](./CODE_OF_CONDUCT.md) basado en el Contributor Covenant v2.1.

### Reportar Seguridad

Para reportar vulnerabilidades, ver [SECURITY.md](./SECURITY.md).

---

## Licencia

**Régimen de Licenciamiento Híbrido por Capas** — Este proyecto NO usa una licencia única. Cada capa tiene su propio régimen según su sensibilidad y función.

| Capa | Régimen | Archivo |
|------|---------|---------|
| Documentación y componentes abiertos | MIT | [LICENSE](./LICENSE) |
| Core, Kernel, Quantum (reservados) | TAMV‑PRCL v1.0 (Propietario) | [LICENSE-PRCL.md](./LICENSE-PRCL.md) |
| Isabella Villaseñor AI™ | TAMV‑EOL v1.0 (Ética) | [LICENSE-EOL.md](./LICENSE-EOL.md) |
| Módulos de conectividad y skills | TAMV‑KÓRIMA (Reciprocidad) | [LICENSE-KORIMA.md](./LICENSE-KORIMA.md) |
| Datos personales y territoriales | DPA (Soberanía de datos) | [DATA-SOVEREIGNTY-DPA.md](./DATA-SOVEREIGNTY-DPA.md) |

**Documento rector**: [RFC-0001-MANIFEST.md](./RFC-0001-MANIFEST.md) — Manifiesto de Licenciamiento Híbrido, Estatuto Constitutivo y Blindaje Jurídico-Técnico del Nodo Cero.

© 2026 RDM Digital · TAMV Online Network™ — Tecnología al servicio de la memoria

---

<p align="center">
  <sub>Hecho con ❤️ para Real del Monte, Hidalgo, México y todas las comunidades que merecen soberanía digital.</sub>
</p>

### Bitácora de actualización disciplinada — 2026-07-23

**Fase 3 reforzada (Replit operativo):**

- ✅ Erradicadas las 4 dependencias fantasma de `@tanstack/react-start`: los helpers de Supabase, telemetría y ejemplo server-side ahora son funciones TypeScript runtime-agnostic compatibles con React Router/Vite y handlers HTTP.
- ✅ Layout operacional consolidado: las páginas que aún dependían de `MainLayout` fueron migradas a `RDMLayout`; `MainLayout` queda sólo como shim heredado no usado para no romper imports externos.
- ✅ Dependencia `wouter` retirada del catálogo workspace, del paquete frontend y del lockfile; el estándar activo queda en React Router.
- ✅ Audio normalizado para Linux/Replit: `adicted_toyou.mp3`, `legado_1.mp3`, `rdmintro_2.mp3`; las importaciones de `Musica.tsx` apuntan a nombres seguros sin espacios ni paréntesis.
- ✅ Conexión API bidireccional inicial: `api-server` expone `/healthz`, `/places`, `/commerce` y `/ai/ask` con validación de entrada tipada, listo para consumo por `VITE_API_URL=/api/v1` o proxy Replit.
- ✅ Hardening híbrido 5 capas activado en código/documentación: (1) supply-chain pnpm minimumReleaseAge + overrides, (2) TypeScript estricto sin TanStack Start fantasma, (3) validación de frontera API, (4) Supabase bearer verification runtime-agnostic, (5) módulo PQC híbrido con fallback Web Crypto.
- ✅ Triple revisión ejecutada: búsqueda de imports prohibidos, typecheck frontend y build API antes del commit.

**Comandos Replit recomendados:**

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/rdm-hub run dev
pnpm run build
```

**Variables mínimas:**

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
VITE_API_URL=/api/v1
```
