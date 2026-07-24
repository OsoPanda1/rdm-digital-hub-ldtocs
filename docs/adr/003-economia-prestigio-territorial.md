# ADR-003: Economía interna y prestigio territorial del RDM Living World

**Estado:** ACEPTADO  
**Fecha:** 2026-07-23  
**Autor:** Edwin / RDM Digital Hub — LDTOCS (MD-X4)  
**Relacionado:** ADR-001 (RDM Living World Gamification)

---

## 1. Contexto

El sistema actual usa XP como única moneda de progresión.  
Para un Living World con motivación alta y contexto territorial, se requiere:

- Una economía interna con múltiples tipos de valor.
- Un modelo de prestigio que refleje impacto real en el territorio.

La literatura reciente sobre gamificación y juegos serios en patrimonio cultural recomienda combinar elementos de progresión, coleccionables y reputación, con cuidado de evitar explotaciones o comportamientos nocivos.

---

## 2. Decisión

Introducir una **economía interna de múltiples monedas** y un sistema explícito de **prestigio territorial**, modelados en `player_currencies` y reglas de negocio.

### Monedas del ecosistema

| Moneda | Icono | Uso | Obtención |
|---|---|---|---|
| `XP` | ✨ | Progresión base (nivel general) | Acciones de exploración, historia, misiones |
| `COIN` | 🪙 | Economía interna (compras de avatar, consumibles) | Logros, retos diarios, visitas |
| `CRYSTAL` | 💎 | Recompensas raras, logros especiales | Colecciones completas, descubrimientos únicos |
| `PRESTIGE` | 🏆 | Logros visibles, retos difíciles | Retos de alta dificultad, logros comunitarios |
| `HONOR` | 🏅 | Acciones éticas, cuidado del territorio | Reportar daños, apoyar eventos, evitar abuso |
| `ENERGY` | ⚡ | Stamina / límites de sesión | Regeneración temporal (evita spam) |
| `INFLUENCE` | 🌐 | Capacidad de afectar eventos globales | Participación comunitaria sostenida |
| `TERRITORIAL_IMPACT` | 🌍 | Métrica de impacto positivo en territorio | Visitas, registros, aportes, participación |

---

## 3. Modelo de datos

La tabla `player_currencies` almacena cantidades por tipo de moneda (ver `src/db/schema.ts`):

- Cada fila representa el saldo actual de una moneda para un jugador.
- Se actualiza exclusivamente a través de eventos (`player_events`), nunca por edición manual directa.

### Reglas de negocio

| Moneda | Incrementa con | Disminuye con | Cap por acción |
|---|---|---|---|
| XP | Exploración, misiones, retos comunitarios | Nunca | 500 |
| COIN | Logros, visitas, retos diarios | Compra de cosméticos | 100 |
| CRYSTAL | Colecciones completas, eventos únicos | Nunca | 10 |
| PRESTIGE | Retos de alta dificultad, logros comunitarios | Nunca | 25 |
| HONOR | Cuidado del territorio, acciones éticas | Comportamiento nocivo | 50 |
| ENERGY | Regeneración (1 cada 30 min, max 100) | Acciones del jugador | - |
| INFLUENCE | Participación comunitaria sostenida | Uso en activación de eventos | 5 |
| TERRITORIAL_IMPACT | Visitas, registros, aportes | Nunca | Calculado |

---

## 4. Uso en el juego

### 4.1. Jugador

El usuario ve:

- **XP:** barra de nivel principal.
- **Monedas:** UI tipo videojuego (coins, cristales, medallas).
- **Prestigio:** insignias visuales, rankings no competitivos pero representativos.
- **Impacto territorial:** indicadores de cuánto ha contribuido al tejido local.

### 4.2. IA narradora

Realito e Isabella usan estas monedas para:

- Proponer misiones que equilibren ramas de progreso.
- Recomendar desafíos que incrementen `HONOR` y `TERRITORIAL_IMPACT`.
- Ajustar narrativa a la economía del jugador (no ofrecer retos imposibles si la energía es baja).

---

## 5. Seguridad y equilibrio

- Todas las operaciones de economía se registran como `player_events`.
- Se usan transacciones para garantizar integridad.
- Se definen límites:
  - Máximos por acción.
  - Protección contra abuso (bots, spam, farming).
- Se revisa regularmente el balance de monedas para evitar inflación o incentivos perversos.

---

## 6. Consecuencias

### Positivas
- Aumenta la profundidad de la experiencia.
- Permite diseñar rutas de progreso variadas y significativas.
- Da espacio para identidad territorial a través de `TERRITORIAL_IMPACT` y `HONOR`.

### Negativas / desafíos
- Mayor complejidad de diseño y balance de economía.
- Necesidad de monitoreo constante y ajustes finos.

---

## 7. Relación con ADR-001

Este ADR extiende el esquema de datos de ADR-001 con reglas de negocio concretas para las 8 monedas. La tabla `player_currencies` del schema.ts almacena los saldos, y la tabla `player_events` registra cada transacción.

---

## Referencias

- ADR-001: `docs/adr/001-rdm-living-world-gamification.md`
- Schema: `artifacts/api-server/src/db/schema.ts`
- Gamificación cultural: sciencedirect.com/science/article/pii/S1875952126000303
