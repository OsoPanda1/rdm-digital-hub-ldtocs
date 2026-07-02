# YUN Event Standard – Modelo de eventos y sistema nervioso

Versión: v1.0
Ámbito: Eventos de negocio, salud, seguridad y federación en YUN

---

## 1. Objetivo

Este documento define el modelo de eventos que funciona como sistema nervioso de YUN: cómo se estructuran, qué contienen, cómo se consumen y qué reglas rigen su uso.

---

## 2. Topics base

Cada dominio tiene su topic de eventos:

| Topic | Dominio |
|---|---|
| `identity.events` | Identity Domain |
| `commerce.events` | Commerce Domain |
| `knowledge.events` | Knowledge Domain |
| `telemetry.events` | Telemetry Domain |
| `gameplay.events` | Gameplay Domain |

Topics transversales:

| Topic | Uso |
|---|---|
| `federations.events` | Salud, incidentes y políticas de federaciones |
| `security.events` | Eventos de seguridad y auditoría |

---

## 3. Esquema mínimo de evento

Todo evento debe incluir:

| Campo | Tipo | Descripción |
|---|---|---|
| `event_type` | string | Tipo de evento (ej. `user.created`, `payment.failed`) |
| `domain` | string | Dominio origen del evento |
| `federation_id` | string | Federación afectada o relevante (ej. `fed1`, `fed7`) |
| `entity_id` | string | Identificador de la entidad afectada |
| `trace_id` | string | Identificador de trazabilidad distribuida |
| `timestamp` | ISO 8601 | Momento de generación del evento |
| `severity` | string | Severidad: `info`, `warning`, `error`, `critical` |
| `payload` | object | Datos del evento (controlado, sin PII cruda) |

---

## 4. Reglas de eventos

### 4.1 Generación

- Toda operación relevante genera evento.
- Los eventos se publican en el topic correspondiente al dominio.

### 4.2 Contenido

- Ningún evento debe contener información sensible sin cifrado o anonimización.
- El `payload` debe ser un objeto controlado y documentado por dominio.

### 4.3 Consumo

- Todos los consumidores deben poder ignorar eventos que no les correspondan sin fallar.
- Los consumidores deben manejar eventos duplicados de forma idempotente.

### 4.4 Trazabilidad

- Todo evento debe incluir `trace_id` para permitir trazabilidad distribuida.
- El `trace_id` se propaga a través de llamadas entre dominios y servicios.

---

## 5. Eventos de federación

Eventos específicos del modelo heptafederado:

| event_type | Descripción |
|---|---|
| `FederationHealthChanged` | Cambio de estado de salud de una federación |
| `FederationPolicyUpdated` | Actualización de políticas de una federación |
| `FederationIncident` | Incidente que afecta a una federación |

---

## 6. Eventos de seguridad

| event_type | Descripción |
|---|---|
| `security.alert` | Alerta de seguridad detectada |
| `security.incident` | Incidente de seguridad en curso |
| `security.resolved` | Incidente de seguridad resuelto |

---

## 7. Evolución

- Este documento se versiona junto con YUN.
- Los esquemas de eventos se documentan por dominio en la documentación técnica correspondiente.
- Los cambios en esquemas de eventos requieren ADR si son breaking changes.
