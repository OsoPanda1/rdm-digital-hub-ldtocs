# Isabella — Blueprint resumido

Rol: núcleo cognitivo gobernado para RDM/TAMV — no un chatbot.

Ciclo canónico: Perceive -> Remember -> Decide -> Act -> Audit

Entidades mínimas:
- isabella_sessions
- isabella_messages
- isabella_memory_items
- isabella_decisions
- isabella_tools
- isabella_tool_calls
- isabella_policies
- isabella_approvals
- isabella_audit_logs

Capas:
- Input, Context, Memory, Reasoning, Policy, Tool, Audit, Fallback

Reglas de seguridad:
- No ejecutar herramientas sin autorización y policy-gate.
- No exponer memoria fuera de scope.
- Trazabilidad completa (audit logs + trace ids).
- Persistir memoria y decisiones fuera de Vercel (Supabase).

Despliegue recomendado:
- UI: apps/ai-studio
- API handlers ligeros: apps/rdm-hub/api/v1/isabella
- Memoria y state: Supabase Postgres (migrations/...)
- Heavy reasoning: workers o servicio de inferencia (externo)
- Edge: auth, scope enforcement y routing
