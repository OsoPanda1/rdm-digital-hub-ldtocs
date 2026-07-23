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
Frontend:         React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4
Routing:          react-router-dom (Browser Router, lazy loading)
Estado:           TanStack React Query + Zustand + Context API
Animaciones:      Framer Motion
Mapas:            Leaflet + React-Leaflet + Supercluster
UI Framework:     shadcn/ui (Radix primitives + Tailwind)
3D/Visual:        Three.js + React Three Fiber + Drei
Auth:             Supabase Auth (PKCE) + RDMAuthContext
Base de Datos:    Supabase (PostgreSQL) + Drizzle ORM
API:              Express 5 (api-server) + Zod validation
IA:               Isabella (arquitectura propia de conciencia)
Despliegue:       Replit Autoscale + pnpm workspaces
Build:            esbuild (CJS bundle), TypeScript estricto
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
│ Pages implementadas                │  121     │  110 únicas en App.tsx   │
│ Componentes activos                │  85+     │  +60 UI shadcn           │
│ Hooks activos                      │  24      │  22 importados           │
│ Archivos de datos                  │  28      │  13 muertos (data/imported)│
│ Tests                              │  6       │  Críticamente bajo       │
│ Coverage                           │  <1%     │  Sin CI/CD de tests      │
│ TypeScript strict                  │  Parcial  │  20 as any, 29 :any     │
│ Build (tsc --noEmit)               │  No probado │ Pendiente en Replit   │
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

**Promedio de madurez general: ~38%**

---

## Deuda Técnica y Documental

### Deuda Técnica Identificada

| Prioridad | Ítem | Impacto | Archivos |
|-----------|------|---------|----------|
| 🔴 **CRÍTICO** | 20 archivos Next.js (`src/app/api/`) muertos | Confusión, peso muerto, posible builds rotos | `src/app/api/*/route.ts` |
| 🔴 **CRÍTICO** | 4 archivos importan `@tanstack/react-start` (eliminado) | Build falla si se incluyen en tsconfig | `auth-middleware.ts`, `auth-attacher.ts`, `example.functions.ts`, `telemetry.functions.ts` |
| 🔴 **CRÍTICO** | 7 unguarded Supabase env vars | Runtime error si faltan variables | `IsabellaChat.tsx`, `RealitoBubble.tsx`, `RealitoOrb.tsx`, `RealitoChat.tsx`, `RealitoAI.tsx`, `useIsabella.ts`, TTS API route |
| 🟠 **ALTO** | ~60+ componentes nunca importados | Dead code, peso muerto en bundle | Componentes root `/components/*` |
| 🟠 **ALTO** | 7 páginas huérfanas no enlazadas desde App.tsx | Contenido invisible | `ComunidadPage.tsx`, `Documentation.tsx`, `MapaVivo.tsx`, `Membership.tsx`, `RegistrarComercio.tsx`, `WikiTAMV.tsx`, `not-found.tsx` |
| 🟠 **ALTO** | 13 archivos `src/data/imported/*.ts` nunca importados | Datos duplicados, inconsistencia | Todo `data/imported/` |
| 🟠 **ALTO** | 6 sistemas de layout diferentes | Complejidad arquitectónica innecesaria | `PublicLayout`, `RdmLayout`, `MainLayout`, `RDMLayout`, `AppShell`, `SovereignPageShell` |
| 🟡 **MEDIO** | 9 pares de componentes duplicados | Código redundante, mantenimiento duplicado | `UnifiedMap`, `IsabellaVoiceEngine`, `IsabellaChat`, `BusinessCard`, `PostCard`, `HeroSection`, `Footer`, etc. |
| 🟡 **MEDIO** | 20 `as any` + 29 `: any` type annotations | Type safety erosionado | Dispersos en 15+ archivos |
| 🟡 **MEDIO** | `@ts-nocheck` en sentry.ts | Tipo bypass total | `sentry.ts` |
| 🟡 **MEDIO** | wouter en catálogo pero no usado | Dependencia innecesaria | `pnpm-workspace.yaml` |
| 🟢 **BAJO** | 5 archivos de seguridad nunca importados | Código diseñado pero no integrado | `security/` (5 files) |
| 🟢 **BAJO** | 2 hooks nunca importados | Funcionalidad no expuesta | `use-isabella-voice-engine.ts`, `use-gamification.ts` |
| 🟢 **BAJO** | ~51 override de plataformas esbuild en pnpm-workspace | Mantenimiento excesivo | `pnpm-workspace.yaml` (lines 77-157) |
| 🟢 **BAJO** | Nombre de archivo con paréntesis y espacios | Potenciales issues en Linux | `adicted_toyou).mp3`, `Legado (1).mp3`, `rdmintro (2).mp3` |

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
Salud General:        🟡 45/100 — "En rehabilitación activa"
Código activo:        🟢 70% del código es funcional
Dead code:            🔴 ~20% (est. 100+ archivos muertos)
Type Safety:          🟡 ~70% tipado, 30% any/bypass
Test Coverage:        🔴 <1% (emergencia)
Documentación:        🔴 15% cubierto
Producción:           🟡 35% — funciona en Replit pero no en producción real
Mantenibilidad:       🟡 Media — requiere refactor fase 1
```

---

## Roadmap

### Fase 1: Sanitización (En Progreso — 70%)
- [x] Eliminar TanStack Router, routes/, start.ts, server.ts
- [x] Eliminar componentes site/ (Navbar, Footer, ModulePortal, PageHero)
- [x] Eliminar Navbar.tsx, Footer.tsx, FooterSection.tsx, BrumaFooter.tsx
- [x] Unificar layout a RDMLayout (12 páginas + 2 layouts)
- [x] Limpiar referencias a Lovable, Vercel, Netlify, Cloudflare
- [x] Commit y push a main
- [ ] Eliminar `src/app/api/` (20 archivos Next.js muertos) ⬅️ **SIGUIENTE**
- [ ] Eliminar 4 archivos TanStack Start residuales
- [ ] Eliminar ~60+ componentes nunca importados
- [ ] Eliminar 13 archivos data/imported/ duplicados
- [ ] Fusionar 9 pares de componentes duplicados
- [ ] Consolidar 6 layouts a 1 (RDMLayout)

### Fase 2: Estabilización Técnica (Q3 2026)
- [ ] Corregir 7 unguarded Supabase env vars
- [ ] Reducir `any` types de 49 a <10
- [ ] Eliminar `@ts-nocheck` de sentry.ts
- [ ] Configurar CI (GitHub Actions) con typecheck + lint
- [ ] Alcanzar >10% test coverage
- [ ] Configurar lint estricto (eslint + prettier)
- [ ] Limpiar pnpm-workspace.yaml overrides (reducir 51 líneas)
- [ ] Renombrar archivos con espacios/parentesis

### Fase 3: Completitud Funcional (Q4 2026)
- [ ] Conectar api-server Express con frontend
- [ ] Integración completa de Supabase DB
- [ ] Isabella AI con LLM real
- [ ] Sistema de federación operativo
- [ ] Gamificación completa
- [ ] Módulo de pagos (Stripe) operativo
- [ ] Despliegue con dominio propio y SSL

### Fase 4: Producción y Escalamiento (Q1 2027)
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
