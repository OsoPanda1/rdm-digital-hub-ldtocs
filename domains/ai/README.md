# Dominio: AI / Isabella

Propósito: implementar Isabella como un subsistema cognitivo gobernado:
- memoria jerárquica,
- policy-gate,
- registro de decisiones y trazabilidad,
- capa de herramientas autorizadas.

Estructura propuesta:
- src/domain: entidades, value-objects, policies, events
- src/application: commands/queries/handlers
- src/infrastructure: memory, tools, model-router, policy-gate, audit
- src/api: adaptadores HTTP / job endpoints
- tests: unit / integration

Siguientes pasos:
1. Implementar migración SQL (migrations/001_create_isabella_tables.sql).
2. Añadir packages/ai-sdk con contracts (tipos TS).
3. Integrar handlers en apps/rdm-hub/api/v1/isabella.
4. Implementar policy-gate y audit-tracer conectando a Supabase.
