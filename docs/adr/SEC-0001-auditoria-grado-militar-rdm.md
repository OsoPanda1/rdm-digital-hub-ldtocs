# ADR-SEC-0001 — Auditoría de Grado Militar RDM Digital Hub

Fecha: 2026-07-24  
Estado: Aceptado para remediación inmediata

## Decisión

Se adopta la auditoría de grado militar como registro oficial de riesgos para el Hub. La lista de 100 fallas críticas queda consolidada en diez dominios: gobernanza/identidad, DPA, continuidad operativa, observabilidad, Living World, Isabella, radio, frontend, administración/comercio y licenciamiento/gobernanza comunitaria.

## Criterio de grado militar

Un subsistema sólo puede declararse listo para producción si elimina puntos únicos de fallo evitables, expone trazabilidad de cambios, aplica controles de acceso explícitos, registra telemetría útil, define estados degradados y mantiene un plan de contingencia operable por humanos.

## Controles implementados en esta iteración

1. Middleware central de identidad/RBAC por encabezados operativos `x-rdm-role`, `x-user-id` y `x-rdm-subject`.
2. Rate limiting en rutas críticas de Isabella, radio, telemetría y gamificación.
3. Eventos de auditoría estructurados para cambios de conocimiento, acciones Living World y asignación de XP.
4. Endpoint `/api/telemetry/status` para operadores y `/api/telemetry/events` para ingestión básica.
5. Health check con estado `ok` o `degraded`, razones explícitas y señales de telemetría.
6. Baseline SQL de RLS/DPA para Supabase en `supabase/policies/001_dpa_rls.sql`.

## Acciones obligatorias siguientes

- Conectar RBAC a Supabase Auth/JWT y retirar confianza directa en encabezados salvo detrás de gateway confiable.
- Persistir auditoría/telemetría en Postgres o un colector OpenTelemetry.
- Aplicar y probar RLS en staging antes de producción.
- Crear runbooks de caída de Supabase, radio, API y pérdida de conectividad territorial.
