# RDM Digital Hub — LDTOCS

> “La tecnología es el puente entre el patrimonio y el futuro.”  
> “Nosotros no imitamos el futuro, nosotros somos el futuro. Lo soñamos, lo creamos, lo sentimos y definitivamente lo vivimos.”  
> — Anubis Villaseñor, Urban Legent · Alianzas LATAM 2020–2025

Plataforma de **Soberanía Digital**, **Turismo Inteligente** e **Infraestructura Federada** para comunidades, implementada inicialmente como nodo replicable **TAMV MD-X4** en Real del Monte, Hidalgo, México.

> **Entre montañas y neblina — RDM Digital Hub. Orgullosamente realmontenses.**

---

## Índice

- [Visión y Problema](#visión-y-problema)  
- [Definición del Hub](#definición-del-hub)  
- [Cómo lo resolvemos](#cómo-lo-resolvemos)  
- [Arquitectura y Federaciones TAMV](#arquitectura-y-federaciones-tamv)  
- [Stack Tecnológico](#stack-tecnológico)  
- [Módulos y Funcionalidades](#módulos-y-funcionalidades)  
- [Gamificación Phygital](#gamificación-phygital)  
- [Estado del Proyecto](#estado-del-proyecto)  
- [Primeros Pasos (Local y Replit)](#primeros-pasos-local-y-replit)  
- [Licencias y Gobernanza](#licencias-y-gobernanza)

---

## Visión y Problema

### Problema Social

Las comunidades, pueblos mágicos y gobiernos locales operan bajo **cero soberanía digital**, al depender de plataformas centralizadas y opacas:

- Extracción de valor cultural y económico sin retorno tangible.  
- Fragilidad institucional por cambios arbitrarios de políticas y algoritmos.  
- Fragmentación de herramientas turísticas y cívicas.  
- Erosión identitaria por interfaces homogéneas diseñadas para otros contextos.  
- Datos territoriales almacenados en infraestructuras ajenas al control comunitario.

### Problema Técnico

Las soluciones tradicionales son:

- Costosas y dependientes de conectividad continua.  
- Sin soporte robusto *offline-first*.  
- Sin IA ética integrada al territorio.  
- Basadas en arquitecturas centralizadas con puntos únicos de fallo.

---

## Definición del Hub

**RDM Digital Hub** es una infraestructura **digital soberana, federada y antifrágil** que integra:

- **Turismo Inteligente:** mapas vectoriales, rutas patrimoniales, eventos y directorios locales.  
- **Gobernanza y Memoria:** autenticación segura con perfiles multi-rol y enciclopedias comunitarias.  
- **Gemelos Digitales Territoriales:** fusión de capas geoespaciales y telemetría ambiental.  
- **IA Soberana (Isabella):** asistente con pipeline de conciencia ética y skills modulares (Orion, Sophia, Argus, Mnemos, Lumen).  
- **Ecosistema YUN (7 Federaciones TAMV):** conexión interoperable entre múltiples territorios bajo soberanía compartida.

> Aquí no imitamos ciudades inteligentes ajenas. Construimos un **territorio inteligente soberano**, desde Real del Monte hacia LATAM.

---

## Cómo lo resolvemos

### Principios de Diseño

- **Soberanía:** código abierto, autogestionable, libre de monopolios tecnológicos.  
- **Antifragilidad:** arquitectura modular con degradación elegante ante fallos de red o APIs.  
- **Federación Distribuida:** modelo soberano de 7 federaciones TAMV como columna vertebral.  
- **Offline-First:** operación autónoma usando datos cacheados y mapas vectoriales autocontenidos.  
- **Seguridad Cuántico-Resiliente:** criptografía post-cuántica y esquemas de doble hexágono de autorización.

> “Nosotros no imitamos el futuro, nosotros somos el futuro. Lo soñamos, lo creamos, lo sentimos y definitivamente lo vivimos.”  
> Esta frase es el principio rector de diseño: la tecnología como extensión viva del territorio, no como máscara.

---

## Arquitectura y Federaciones TAMV

El núcleo opera sobre un **bus de datos federado (YUN)** que sincroniza las 7 dimensiones soberanas del modelo TAMV:

1. **F1: Identidad Soberana**  
   - Autenticación descentralizada, PKCE y pasaportes digitales comunitarios.  
2. **F2: Patrimonio y Memoria Colectiva**  
   - Archivos históricos, corpus de tradición oral, enciclopedias territoriales.  
3. **F3: Turismo Inteligente y Redes Territoriales**  
   - Rutas dinámicas, puntos de interés (POIs), gestión de flujos de visitantes.  
4. **F4: Economía Local y Comercios**  
   - Pasarelas de comercio justo, directorios interoperables, membresías territoriales.  
5. **F5: Gemelos Digitales y Sensores**  
   - Fusión geoespacial, monitoreo ambiental y telemetría en tiempo real.  
6. **F6: Inteligencia Colectiva (Isabella AI)**  
   - Nodos de IA con gobernanza algorítmica y skills especializados.  
7. **F7: Resiliencia e Infraestructura Cuántica**  
   - Blindaje criptográfico post-cuántico, observabilidad y redundancia antifrágil.

---

## Stack Tecnológico

**Frontend**

- React 19 + TypeScript 5.9  
- Vite 7.3.6  
- Tailwind CSS 4 / shadcn/ui (Radix + Tailwind)  
- React Router v6 (lazy loading, SPA robusta)  
- TanStack React Query + Zustand + Context API

**Mapas y Visualización**

- Leaflet + React-Leaflet  
- Clusterización con Supercluster  
- Capas territoriales y gemelos digitales

**Backend / API**

- Express 5 (`api-server`)  
- Validación con Zod + tipos OpenAPI (Orval)  
- Supabase (PostgreSQL + Auth)  
- Bus federado YUN + UnifiedEventBus para telemetría y federaciones

**Infraestructura y CI**

- Monorepo pnpm workspaces  
- Node.js 20 (Replit Autoscale)  
- GitHub Actions CI/CD  
- Observabilidad: métricas, trazas y logs estructurados

---

## Módulos y Funcionalidades

| Módulo                 | Madurez | Descripción Técnica                                               |
|------------------------|:-------:|-------------------------------------------------------------------|
| Portal Turístico       | 78%     | Interfaz principal, mapa interactivo, rutas y directorio.        |
| Mapa Interactivo       | 85%     | Leaflet + clustering, POIs y capas territoriales.                |
| Autenticación          | 90%     | Supabase Auth con PKCE, multi-rol y sesiones persistentes.       |
| Isabella AI            | 65%     | Pipeline de conciencia, skills modulares, API REST soberana.     |
| Federación YUN         | 30%     | Bus de eventos federado y pasarela de 7 nodos TAMV.              |
| Seguridad PQC          | 35%     | Criptografía post-cuántica y sanitización de fronteras.          |
| Gamificación Phygital  | 40%     | Sistema de juego territorial, XP, misiones, loot y temporadas.   |

---

## Gamificación Phygital

**Tipo de juego:**  
Sistema de **gamificación territorial phygital** con progresión persistente, cooperativo-competitivo, sobre Real del Monte:

- Exploración geolocalizada.  
- Interacción con comercios y puntos de interés vía QR y eventos.  
- XP + RDM Points + loot boxes + cosméticos.  
- Misiones narrativas (“Ruta del Minero”, “Ruta de la Plata”, “Ruta de Leyendas”).  
- Leaderboards por temporada de 90 días.  
- Festival trimestral con cierre de temporada y distribución de recompensas.

**Modelo de juego (especificación técnica)**

- **Gameplay loop:**  
  `descubrir → interactuar → validar → recompensar → subir de nivel → desbloquear misiones/rangos/skins → competir en temporada`.

- **Entidades principales:**  
  Player, POI, Commerce, Quest, Reward, Season, Inventory, Event.

- **Rank tiers:**  
  `explorador`, `cronista`, `minero-legendario`, `guardian-del-pueblo`.

- **Progressión:**  
  XP no lineal, RDM Points como moneda blanda, streaks, misiones encadenadas.

- **Superficies de UI:**  
  Map view, player profile, quest hub, leaderboard, merchant panel, membership.

> La especificación detallada del sistema de juego vive en  
> `features/gamification/GAME_DESIGN_RDM_PHYGITAL.md` dentro del monorepo.

---

## Estado del Proyecto

- Build verificado de **3,437 módulos** en ~54s sin errores de compilación.  
- CI automatizado con GitHub Actions.  
- API server Express integrado con endpoints clave:
  - `/api/healthz`  
  - `/api/territory/places`  
  - `/api/territory/commerce`  
  - `/api/territory/ai/ask`  
- Documentación de agentes sincronizada en `.agents/memory`.  
- Infraestructura de despliegue enfocada en **Replit**, sin dependencia de Vercel / Netlify / Lovable.

---

## Primeros Pasos (Local y Replit)

### Requisitos

- Node.js 20+  
- pnpm 9+  
- Instancia activa de Supabase (URL + anon key)

### Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/OsoPanda1/rdm-digital-hub-ldtocs.git
cd rdm-digital-hub-ldtocs

# Instalar dependencias del monorepo
pnpm install

# Configurar variables de entorno del frontend
cp artifacts/rdm-hub/.env.example artifacts/rdm-hub/.env
# Editar .env con:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...

# Ejecutar entorno de desarrollo del Hub
pnpm --filter @workspace/rdm-hub run dev
```

### Ejecución en Replit

- Configurar en **Secrets** del Repl:

  - `VITE_SUPABASE_URL`  
  - `VITE_SUPABASE_ANON_KEY`

- Backend / API:

  - Usar `artifacts/api-server/.replit-artifact/artifact.toml` como configuración de servicio.  
  - Health check en `/api/healthz`.  
  - Puerto interno `8080` (Node 20 Autoscale).

---

## Licencias y Gobernanza

Régimen de licenciamiento por capas del ecosistema:

- **Componentes Abiertos y Documentación:** MIT (`LICENSE`)  
- **Core y Kernel TAMV:** TAMV-PRCL v1.0 (`LICENSE-PRCL.md`)  
- **Isabella AI:** TAMV-EOL v1.0 (`LICENSE-EOL.md`)  
- **Conectividad y Skills:** TAMV-KÓRIMA (`LICENSE-KORIMA.md`)  
- **Datos Territoriales:** DPA (`DATA-SOVEREIGNTY-DPA.md`)

---

© 2026 **RDM Digital · TAMV Online Network™** — Tecnología al servicio de la memoria.  
**Hecho con ❤️ para Real del Monte, Hidalgo, México y todas las comunidades que merecen soberanía digital.**  
**Entre montañas y neblina — RDM Digital Hub. Orgullosamente realmontenses.**
