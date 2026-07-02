# ADR-002: Arquitectura event-driven

Fecha: 2026-07-01
Estado: Accepted

---

## Contexto

El ecosistema YUN consta de múltiples dominios (Identity, Commerce, Knowledge, Telemetry, Gameplay) y federaciones (Fed1–Fed7) que necesitan comunicarse sin crear dependencias directas frágiles.

La alternativa era usar llamadas síncronas directas entre servicios, lo cual genera acoplamiento fuerte y puntos únicos de fallo.

## Decisión

Adoptar un bus de eventos como sistema nervioso de YUN.

- Todo cambio significativo en un dominio genera un evento trazable.
- Los dominios se comunican preferentemente mediante eventos.
- Se define un esquema estándar de eventos con campos obligatorios.

## Alternativas consideradas

- **Llamadas síncronas directas**: Mayor acoplamiento, menor resiliencia.
- **Colas punto a punto**: Menor flexibilidad que un bus de eventos central.
- **Shared database**: Viola el principio de separación por dominio.

## Consecuencias

- Mayor complejidad inicial en el diseño del bus de eventos.
- Mayor resiliencia futura: los dominios pueden fallar independientemente.
- Trazabilidad mejorada: cada cambio queda registrado como evento.
- Escalabilidad: nuevos consumidores se suscriben sin modificar productores.
