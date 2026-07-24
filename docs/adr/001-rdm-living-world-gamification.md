# ADR-001: Transición de Gamificación XP clásica a RDM Living World

**Estado:** ACEPTADO  
**Fecha:** 2026-07-23  
**Autor:** Edwin / RDM Digital Hub — LDTOCS (MD-X4)

---

## 1. Contexto

### 1.1. Situación actual

El módulo de gamificación del RDM Digital Hub expone una API típica de 2010–2020:

- Perfil de XP y rango.
- Leaderboard.
- Quests relativamente estáticas.
- Badges básicos.

Esta arquitectura es suficiente para un sistema de puntos, pero no para una **experiencia tipo videojuego AAA**, ni para los objetivos de:

- alta retención diaria,
- exploración profunda del territorio,
- narrativa cultural,
- memoria viva y comunidad.

La propia API está diseñada como núcleo de dominio "preparado para evolucionar", aún en modo mock y sin persistencia ni narrativa avanzada.

### 1.2. Necesidades detectadas

Para que el usuario quiera:

- abrir la App varias veces al día,
- permanecer mucho tiempo en ella,
- sentir que entra a un mundo vivo,

se requiere pasar de:

> "Sistema de XP + leaderboard"

a:

> "RDM Living World: un territorio vivo gamificado, con avatar, colecciones, temporadas, narrativa, IA narradora y eventos dinámicos".

Las referencias actuales en gamificación cultural recomiendan arquitecturas que integran gamificación, IA, AR y narrativa con modelos de datos ricos y orientados a eventos.

---

## 2. Decisión

### 2.1. Declaración

Transformar el módulo de gamificación del RDM Digital Hub desde un modelo centrado en XP, leaderboard y quests estáticas hacia un **modelo de Living World**, con:

1. **Nuevo dominio de datos**
   - Entidades para jugador, avatar, árbol de habilidades, colecciones, temporadas, mundo y eventos comunitarios.
   - Esquema de base de datos capaz de representar un mundo persistente que evoluciona con el tiempo y la actividad.

2. **Arquitectura de eventos**
   - Capa de `PlayerEvents` y `WorldEvents` como eje del sistema.
   - Configuración de reglas de gamificación basadas en estos eventos (recompensas, narrativa, progresión).

3. **Narrativa estacional**
   - Temporadas temáticas (Minería Colonial, Leyendas, Revolución, Halloween, Navidad).
   - Flujos de usuario que integran estas temporadas en el Dashboard y en la interacción diaria.

4. **Persistencia y continuidad**
   - Diseño que garantice que el mundo se sienta vivo y persistente entre sesiones (estado del territorio, colecciones, progresión).

---

## 3. Esquema de datos: entidades y relaciones

Se adopta una arquitectura híbrida inspirada en referencias de gamificación cultural y modelos de datos de gamificación escalables.

### 3.1. Entidades principales

#### 3.1.1. Player

Tabla: `players`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador único |
| `external_id` | TEXT UNIQUE | Vinculado a auth (Supabase) |
| `display_name` | TEXT | Nombre visible |
| `home_territory_id` | FK → territories | Territorio base |
| `last_seen_at` | TIMESTAMPTZ | Última sesión |
| `created_at` | TIMESTAMPTZ | Registro |

Relaciones:
- 1–1 con `player_avatars`
- 1–N con `player_progressions`
- 1–N con `player_collections`
- 1–N con `player_currencies`
- 1–N con `player_events`

#### 3.1.2. PlayerAvatar

Tabla: `player_avatars`

| Campo | Tipo | Descripción |
|---|---|---|
| `player_id` | UUID PK, FK → players | Jugador dueño |
| `body_type` | TEXT | Tipo de cuerpo |
| `hair_style` | TEXT | Estilo de cabello |
| `skin_tone` | TEXT | Tono de piel |
| `base_outfit_id` | FK → items | Outfit base |
| `equipped_head_item_id` | FK → items | Casco, sombrero |
| `equipped_torso_item_id` | FK → items | Torso |
| `equipped_legs_item_id` | FK → items | Piernas |
| `equipped_feet_item_id` | FK → items | Botas |
| `equipped_pet_item_id` | FK → items | Mascota |
| `equipped_special_item_id` | FK → items | Insignia especial |
| `updated_at` | TIMESTAMPTZ | Última actualización |

#### 3.1.3. Currencies

Tabla: `player_currencies`

| Campo | Tipo | Descripción |
|---|---|---|
| `player_id` | UUID PK, FK → players | Jugador |
| `currency_type` | TEXT PK | XP, COIN, CRYSTAL, PRESTIGE, HONOR, ENERGY, INFLUENCE, TERRITORIAL_IMPACT |
| `amount` | NUMERIC | Saldo actual |
| `updated_at` | TIMESTAMPTZ | Última actualización |

#### 3.1.4. ProgressionTree

Tabla: `progression_branches`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador |
| `key` | TEXT UNIQUE | EXPLORATION, HISTORY, PHOTO, GASTRONOMY, RADIO, COMMUNITY |
| `name` | TEXT | Nombre legible |
| `description` | TEXT | Descripción |

Tabla: `player_progressions`

| Campo | Tipo | Descripción |
|---|---|---|
| `player_id` | UUID PK, FK → players | Jugador |
| `branch_id` | UUID PK, FK → progression_branches | Rama |
| `level` | INT | Nivel actual en la rama |
| `points_allocated` | INT | Puntos asignados |
| `xp_in_branch` | NUMERIC | XP acumulado en la rama |
| `updated_at` | TIMESTAMPTZ | Última actualización |

#### 3.1.5. Items / Coleccionables

Tabla: `items`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador |
| `name` | TEXT | Nombre del item |
| `description` | TEXT | Descripción |
| `category` | TEXT | MINING, GASTRONOMY, LEGENDS, ARCHITECTURE, RADIO, COMMUNITY |
| `rarity` | TEXT | COMMON, UNCOMMON, RARE, EPIC, LEGENDARY, MYTHIC, UNIQUE |
| `icon_url` | TEXT | URL del icono |
| `model_url` | TEXT | URL del modelo 3D / AR |
| `territory_id` | FK → territories | Territorio asociado (opcional) |
| `season_id` | FK → seasons | Temporada exclusiva (opcional) |
| `is_avatar_cosmetic` | BOOLEAN | Es cosmético de avatar |
| `is_collection_item` | BOOLEAN | Es parte de una colección |
| `is_story_trigger` | BOOLEAN | Activa narrativa |

Tabla: `collections`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador |
| `key` | TEXT UNIQUE | Clave interna |
| `name` | TEXT | Nombre de la colección |
| `description` | TEXT | Descripción |
| `category` | TEXT | Categoría temática |
| `season_id` | FK → seasons | Temporada (opcional) |

Tabla: `collection_items`

| Campo | Tipo | Descripción |
|---|---|---|
| `collection_id` | UUID PK, FK → collections | Colección |
| `item_id` | UUID PK, FK → items | Item |
| `order_index` | INT | Orden dentro de la colección |

Tabla: `player_items`

| Campo | Tipo | Descripción |
|---|---|---|
| `player_id` | UUID PK, FK → players | Jugador |
| `item_id` | UUID PK, FK → items | Item obtenido |
| `obtained_at` | TIMESTAMPTZ | Fecha de obtención |
| `source_event_id` | FK → player_events | Evento que lo originó |

Tabla: `player_collections`

| Campo | Tipo | Descripción |
|---|---|---|
| `player_id` | UUID PK, FK → players | Jugador |
| `collection_id` | UUID PK, FK → collections | Colección |
| `progress_percentage` | NUMERIC | Progreso (0–100) |
| `completed_at` | TIMESTAMPTZ | Fecha de completado (nullable) |

#### 3.1.6. Seasons

Tabla: `seasons`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador |
| `key` | TEXT UNIQUE | MINING_COLONIAL, LEGENDS, REVOLUTION, HALLOWEEN, CHRISTMAS |
| `name` | TEXT | Nombre de la temporada |
| `description` | TEXT | Descripción |
| `start_at` | TIMESTAMPTZ | Inicio |
| `end_at` | TIMESTAMPTZ | Fin |
| `theme_config_json` | JSONB | Decoraciones, HUD, música |

Tabla: `player_seasons`

| Campo | Tipo | Descripción |
|---|---|---|
| `player_id` | UUID PK, FK → players | Jugador |
| `season_id` | UUID PK, FK → seasons | Temporada |
| `progress_score` | NUMERIC | Progreso del jugador en la temporada |
| `rewards_claimed_json` | JSONB | Recompensas reclamadas |

#### 3.1.7. WorldState

Tabla: `world_state_snapshots`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador |
| `captured_at` | TIMESTAMPTZ | Timestamp del snapshot |
| `season_id` | FK → seasons | Temporada activa |
| `weather` | TEXT | SUNNY, RAIN, FOG, STORM |
| `temperature` | NUMERIC | Temperatura |
| `events_summary_json` | JSONB | Eventos activos, desafíos globales |

Tabla: `territories`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador |
| `name` | TEXT | Nombre del territorio |
| `type` | TEXT | TOWN, DISTRICT, POI |
| `parent_territory_id` | FK → territories | Padre (jerarquía) |
| `lat` | NUMERIC | Latitud |
| `lng` | NUMERIC | Longitud |
| `meta_json` | JSONB | Metadatos |

Tabla: `poi_state`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador |
| `territory_id` | FK → territories | POI |
| `status` | TEXT | OPEN, CLOSED, EVENT, MAINTENANCE |
| `current_event_id` | FK → world_events | Evento activo (nullable) |
| `updated_at` | TIMESTAMPTZ | Última actualización |

#### 3.1.8. Events (núcleo del modelo)

Tabla: `player_events`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador |
| `player_id` | FK → players | Jugador |
| `type` | TEXT | DISCOVER_POI, CAPTURE_PHOTO, LISTEN_RADIO, ATTEND_EVENT, COMPLETE_QUEST, SHARE_STORY, COLLECT_ITEM |
| `territory_id` | FK → territories | Territorio (nullable) |
| `poi_id` | FK → poi_state | POI (nullable) |
| `season_id` | FK → seasons | Temporada (nullable) |
| `payload_json` | JSONB | Detalles específicos del evento |
| `created_at` | TIMESTAMPTZ | Timestamp |

Tabla: `world_events`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador |
| `type` | TEXT | TERRITORY_EVENT, COMMUNITY_CHALLENGE, WEATHER_CHANGE, SPECIAL_VISIT, HISTORICAL_DISCOVERY |
| `territory_id` | FK → territories | Territorio (nullable) |
| `season_id` | FK → seasons | Temporada |
| `payload_json` | JSONB | Detalles |
| `starts_at` | TIMESTAMPTZ | Inicio |
| `ends_at` | TIMESTAMPTZ | Fin (nullable) |
| `created_at` | TIMESTAMPTZ | Creación |

Tabla: `community_challenges`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador |
| `key` | TEXT UNIQUE | Clave interna |
| `name` | TEXT | Nombre del desafío |
| `description` | TEXT | Descripción |
| `goal_type` | TEXT | PHOTOS, VISITS, LISTENS, COLLECTIONS_COMPLETED |
| `goal_target` | INT | Meta numérica |
| `current_progress` | INT | Progreso actual |
| `season_id` | FK → seasons | Temporada |
| `starts_at` | TIMESTAMPTZ | Inicio |
| `ends_at` | TIMESTAMPTZ | Fin |

### 3.2. Diagrama de relaciones

```
players ──1:1──▶ player_avatars
players ──1:N──▶ player_currencies
players ──1:N──▶ player_progressions ──N:1──▶ progression_branches
players ──1:N──▶ player_items ──N:1──▶ items
players ──1:N──▶ player_collections ──N:1──▶ collections
players ──1:N──▶ player_seasons ──N:1──▶ seasons
players ──1:N──▶ player_events ──N:1──▶ territories (opt)
                                    ──N:1──▶ poi_state (opt)
                                    ──N:1──▶ seasons (opt)

collections ──N:N──▶ items (via collection_items)

items ──N:1──▶ territories (opt)
items ──N:1──▶ seasons (opt)

seasons ──1:N──▶ world_events
seasons ──1:N──▶ community_challenges
seasons ──1:N──▶ player_seasons

territories ──N:1──▶ territories (self-ref: parent)
territories ──1:N──▶ poi_state
territories ──1:N──▶ player_events (opt)
territories ──1:N──▶ world_events (opt)

world_state_snapshots ──N:1──▶ seasons

community_challenges ──N:N──▶ world_events (via community_challenge_events)
```

---

## 4. Entidades de dominio que reemplazan la API XP clásica

### 4.1. Antes

Dominios principales:
- `XP` (campo numérico por usuario).
- `Rank` (tier calculado por XP).
- `Quest` (lista predefinida).
- `Badge` (lista de strings).

### 4.2. Después

Nuevos dominios:

1. **Player + PlayerAvatar** — El usuario deja de ser un `userId` y pasa a ser un **personaje** con identidad visual y narrativa.

2. **Currencies** — XP pasa a ser solo una de las múltiples monedas internas, ya no el eje único.

3. **ProgressionTree** — La progresión se distribuye en ramas (Exploración, Historia, Fotografía, Gastronomía, Radio, Comunidad).

4. **Items + Collections** — Badges se sustituyen por **coleccionables con rareza**, álbumes y sets temáticos.

5. **Seasons** — La experiencia se organiza en temporadas, con contenido, retos y recompensas específicas.

6. **WorldState + Events** — Se incorpora un estado de mundo que permite clima, eventos territoriales, desafíos comunitarios y narrativa dinámica.

La API deja de entregar "XP y rango" y empieza a servir:
- estado de jugador,
- estado de mundo,
- estado de colecciones y temporadas,
- stream de eventos.

---

## 5. Endpoints de la API Living World

### 5.1. Legados (mantenidos por retrocompatibilidad)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/gamification/profile` | XP, rango, badges (legacy) |
| GET | `/api/v1/gamification/leaderboard` | Ranking por XP |
| GET | `/api/v1/gamification/quests` | Quests estáticas |
| POST | `/api/v1/gamification/award-xp` | Asignar XP manual |
| GET | `/api/v1/gamification/ranks` | Tiers de rango |

### 5.2. Living World (nuevos)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/living-world/player/:id` | Perfil completo del jugador (avatar, currencies, progression, collections) |
| GET | `/api/v1/living-world/player/:id/avatar` | Avatar y cosméticos equipados |
| GET | `/api/v1/living-world/player/:id/collections` | Colecciones del jugador con progreso |
| GET | `/api/v1/living-world/player/:id/seasons/current` | Temporada activa y progreso |
| GET | `/api/v1/living-world/world/state` | Estado del mundo (clima, eventos, temporada) |
| GET | `/api/v1/living-world/world/map-layer` | Capa del mapa (POIs, eventos, decoraciones) |
| GET | `/api/v1/living-world/events/community-challenges` | Desafíos comunitarios activos |
| POST | `/api/v1/living-world/player/action` | Registrar acción del jugador (dispara recompensas) |

---

## 6. Integración de narrativa estacional en el flujo de usuario

### 6.1. Flujo actual

- Usuario abre App.
- Ve XP, rango, quests y leaderboard.
- Interactúa poco con el territorio y la narrativa.

### 6.2. Flujo propuesto (Living World)

1. **Pantalla inicial (home)**
   La App consulta:
   - `GET /world/state`
   - `GET /player/profile`
   - `GET /player/avatar`
   - `GET /player/seasons/current`

   Renderiza:
   ```
   REAL DEL MONTE
   Buenos días Edwin
   18°C · Hoy hay 3 eventos

   [Avatar del jugador]
   Nivel 18 · Guardián del Monte
   Barra de XP + ramas de habilidades
   ```

2. **Mapa vivo / Dashboard 3D**
   Se carga `world_state_snapshots` + `poi_state` + `seasons`. Se aplica el `theme_config_json` de la temporada.

3. **Narrativa estacional**
   La temporada actual define:
   - Tipos de eventos (`world_events`).
   - Coleccionables exclusivos (`items` ligados a `season_id`).
   - Quests temáticas (`community_challenges`).

   Ejemplo: Temporada **Minería Colonial** agrega quests de minas, objetos legendarios de minería, cinemáticas en POIs mineros, cambios visuales en el mapa.

4. **IA Narradora / Realito**
   La IA consume `player_events` recientes, `player_collections`, `progression_branches` y `world_events` activos para proponer misiones personalizadas.

5. **Sesión y retorno**
   Cada sesión registra eventos, actualiza progresión y colecciones, modifica el estado del mundo. Al volver, el jugador ve cambios persistentes.

---

## 7. Estrategias para mundo persistente

### 7.1. Event-driven
Cada acción genera un `player_event`. Cada cambio territorial genera un `world_event`. Servicios backend consumen estos eventos para actualizar progresión, colecciones, currencies, challenges, narrativa e IA.

### 7.2. Snapshots y caching
`world_state_snapshots` guarda estados agregados. El frontend carga un snapshot inicial y se suscribe a cambios vía WebSockets / SSE.

### 7.3. Seasons como eje temporal
Las temporadas segmentan el tiempo en "arcos narrativos". Al cambiar, el mundo cambia visualmente y habilita/deshabilita contenido.

### 7.4. Persistencia de avatar y colecciones
`player_avatar` y `player_items` son persistentes. Cada sesión muestra aspecto actual, objetos raros y colecciones progresando.

### 7.5. Integración de IA y narrativa
La IA narradora se alimenta de eventos y estado para sugerir misiones, generar descripciones y proponer rutas personalizadas.

---

## 8. Consecuencias

### 8.1. Lo que se vuelve más fácil
- Diseñar contenido temático por temporada.
- Crear experiencias tipo videojuego (colecciones, temporadas, retos comunitarios).
- Medir impacto territorial más allá de visitas y puntos.
- Integrar IA narradora y recomendaciones inteligentes.

### 8.2. Lo que se vuelve más difícil
- Mayor complejidad de modelo de datos y lógica.
- Necesidad de definir reglas claras de balanceo (economía interna).
- Riesgo de sobrecargar la interfaz si no se diseña bien.
- Necesidad de asegurar rendimiento y escalabilidad (event-driven + snapshots).

### 8.3. Alternativas consideradas
- Mantener modelo XP + quests y solo añadir cosméticos simples (rechazada: no alcanza el nivel de "Living World" deseado).
- Externalizar gamificación en un servicio SaaS genérico (rechazada: no encaja con la identidad territorial y la narrativa propia).

---

## 9. Roadmap de implementación

| Fase | Entregable | Estado |
|---|---|---|
| **Fase 0** | ADR aprobado, esquema de datos definido | ACEPTADO |
| **Fase 1** | API mock con todos los endpoints Living World | EN PROCESO |
| **Fase 2** | Tablas Supabase + Drizzle ORM | PENDIENTE |
| **Fase 3** | Frontend: avatar, HUD, colecciones, mapa vivo | PENDIENTE |
| **Fase 4** | Primera temporada (Minería Colonial) | PENDIENTE |
| **Fase 5** | IA narradora integrada | PENDIENTE |
| **Fase 6** | Eventos comunitarios en vivo | PENDIENTE |

---

## 10. Referencias

- Living World model: Guild Wars 2 seasonal content architecture
- Gamification in cultural heritage: sciencedirect.com/science/article/pii/S1875952126000303
- AI + gamification + AR in tourism: arxiv.org/pdf/2506.04090.pdf
- Gamification UX motivation: linkedin.com/pulse/gamification-ux-boosting-user-motivation-retention
- Gamification API architecture: aworld.org/blog/gamification-engagement
