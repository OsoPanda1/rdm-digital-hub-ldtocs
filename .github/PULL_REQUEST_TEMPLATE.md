# Título sugerido
infra(isabella): add AI domain (Isabella) skeleton, migrations and api handler

## Qué incluye este PR
- Migración SQL para tablas core de Isabella
- Tipos/runtime contracts en packages/ai-sdk
- Estructura mínima del dominio en domains/ai (policy-gate, audit-tracer, handler)
- Endpoint Next.js para recibir percepciones en apps/rdm-hub
- Documentación inicial en docs/isabella/blueprint.md

## Pasos para probar localmente
1. Extraer o crear branch: infra/isabella-onboarding
2. Aplicar migración en Supabase/Postgres
3. Instalar dependencias: pnpm install
4. Levantar la app rdm-hub en dev: pnpm --filter apps/rdm-hub dev
5. POST a /api/v1/isabella con payload de prueba

## Checklist
- [ ] Migraciones aplicadas en Supabase
- [ ] Variables de entorno configuradas (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, etc)
- [ ] Tests unitarios (pendiente)
