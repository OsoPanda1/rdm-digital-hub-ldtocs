# RDM Digital LTOS — Política de Seguridad

RDM Digital LTOS es una plataforma territorial crítica para el ecosistema de Real del Monte. La seguridad de los datos, de los usuarios y de la infraestructura es prioritaria.

## Alcance

- Repositorio `rdm-digital-ltos` y todos sus módulos.
- Aplicaciones web (visitante, admin).
- Servicios de dominio (IA, gemelo territorial, economía, analítica, cultura).
- Supabase (Auth · Postgres · Storage · Edge Functions).
- Despliegue en Cloudflare Pages / Workers.

## Reportar una vulnerabilidad

Envía un correo cifrado a **security@realdelmonte.example** con:

- Descripción técnica reproducible.
- Impacto estimado.
- PoC (si aplica).

Compromiso de respuesta:

| Severidad | Acuse | Mitigación | Disclosure |
|-----------|-------|------------|------------|
| Crítica   | 24 h  | 72 h       | coordinado |
| Alta      | 48 h  | 7 días     | coordinado |
| Media     | 5 días| 30 días    | coordinado |
| Baja      | 10 días| backlog   | a discreción |

No realices pruebas destructivas, no accedas a datos de terceros, no hagas DoS.

## Controles obligatorios

1. **Secret hygiene**: ningún secreto en código. Service-role aislado en `*.server.ts`. CI ejecuta `gitleaks` + `trufflehog` en cada PR.
2. **Zero Trust frontend**: el navegador solo usa la `publishable key`. Toda escritura privilegiada pasa por Edge Function autenticada que verifica `has_role()`.
3. **RLS por defecto**: toda tabla pública en `public` tiene RLS habilitada y políticas explícitas; `USING (true)` está prohibido salvo lectura genuinamente pública.
4. **Roles en tabla separada**: `user_roles` + función `SECURITY DEFINER` `has_role()`. Jamás en `profiles`.
5. **CSP / HSTS / headers**: ver `public/_headers`.
6. **Dependencias**: `npm audit --audit-level=high` bloquea merge; CodeQL semanal.
7. **Backups**: PITR Supabase + verificación mensual de restore.
8. **Observabilidad**: logs estructurados (JSON), Sentry para errores, PostHog para producto.

## Roles

- **Security lead**: define política, revisa hallazgos, aprueba excepciones.
- **DPO**: cumplimiento de privacidad y respuesta a titulares de datos.
- **On-call**: responde incidentes según `docs/RUNBOOK.md`.

## Auditoría

- Logs de auth + admin retenidos 90 días.
- Migraciones SQL revisadas en PR por al menos 1 reviewer con rol `db-reviewer`.
- Cambios a políticas RLS requieren PR etiquetado `security-review` y aprobación del security lead.
