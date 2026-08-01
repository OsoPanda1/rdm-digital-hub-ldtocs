# TAMV OS Kernel — Núcleo soberano unificado

Puerto del núcleo `core/tamv-os-kernel` del repo `rdm-smart-city-os` al monorepo
`rdm-nodo-cero-digital-hub`, adaptado para desplegar en **Vercel** sin
infraestructura externa (sin Kafka, sin `pg` Pool, sin Kubernetes).

## Qué se clonó y cómo se adaptó

| Origen (rdm-smart-city-os) | Destino | Adaptación |
| --- | --- | --- |
| `core/tamv-os-kernel/src/domain/canonical-domain.ts` | `packages/tamv-kernel/src/domain/canonical-domain.ts` | Íntegro (agregados, estados y reglas de transición) |
| `core/tamv-os-kernel/src/types.ts` | `packages/tamv-kernel/src/types.ts` | Íntegro |
| `core/tamv-os-kernel/src/event-store.ts` | `packages/tamv-kernel/src/event-store.ts` | `pg.Pool` → Data API de Supabase con service role; hash SHA-256 y versionado por stream conservados |
| `core/tamv-os-kernel/src/event-bus.ts` | `packages/tamv-kernel/src/event-bus.ts` | Kafka → bus en proceso con fan-out y circuit breaker (5 fallos / 30 s) |
| `core/tamv-os-kernel/src/kernel.ts` | `packages/tamv-kernel/src/kernel.ts` | `EventEmitter` de Node → suscriptores del bus; añadido singleton `getKernel()` |

Descartado por incompatibilidad con serverless: `api-gateway/edge-kernel` (Go),
`ai/isabella-core` (Python), `infra/kubernetes`, `infra/docker`. Su función la
cubren las rutas `app/api/v1/*` de `apps/rdm-hub`.

## Modelo de datos

`data/migrations/006_create_tamv_event_store.sql` (aplicada en Lovable Cloud).

- Ledger **append-only** `public.tamv_event_store`.
- Unicidad `(stream_id, stream_version)` → concurrencia optimista.
- `event_hash` = SHA-256 del evento canónico + stream + versión → detección de manipulación.
- RLS: lectura solo para sesiones autenticadas; **escritura exclusiva del service role** (el navegador nunca escribe el ledger).

## Interconexión

```
Navegador / Edge / Backoffice
        │  POST /api/v1/kernel
        ▼
apps/rdm-hub/app/api/v1/kernel/route.ts   (validación Zod, zero trust)
        ▼
TamvOSKernel.emit()  →  publishEvent()  →  appendEvent()  →  Supabase (ledger)
                                   │
                                   └─→ fan-out a servicios de dominio registrados
```

### API

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/v1/kernel` | Publica un evento cívico (`type`, `federation`, `source`, `payload`, `streamId?`) |
| `GET` | `/api/v1/kernel?limit=50` | Últimos eventos + estado del kernel |
| `GET` | `/api/v1/kernel?streamId=X` | Replay completo de un stream |
| `GET` | `/api/v1/kernel?streamId=X&verify=1` | Verificación de integridad hash del stream |

### Registrar un servicio de dominio

```ts
import { getKernel } from "@nodo-cero/tamv-kernel";

getKernel().register({
  name: "tourism-projection",
  async handle(event) {
    if (event.type !== "TOURISM_INTERACTION") return;
    // proyección / materialización
  },
});
```

## Variables de entorno

`apps/rdm-hub/.env.local` (y en Vercel → Project Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # requerido para escribir el ledger
NEXT_PUBLIC_NODE_ID=nd-rdm-hub-001
NEXT_PUBLIC_NODE_NAME=Nodo Cero
```

## Despliegue

`vercel.json` en la raíz ya apunta al monorepo:

```json
{ "installCommand": "pnpm install --no-frozen-lockfile", "buildCommand": "pnpm --filter rdm-hub build" }
```

`pnpm-workspace.yaml` incluye `packages/*`, por lo que `@nodo-cero/tamv-kernel`
se resuelve automáticamente como dependencia workspace de `rdm-hub`.
