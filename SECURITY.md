# Política de Seguridad

## Versiones Soportadas

Actualmente, RDM Digital Hub está en fase alpha. Solo la última versión de `main` recibe parches de seguridad.

| Version | Soportada |
|---------|-----------|
| main (último commit) | ✅ |
| Otras ramas | ❌ |

## Reportar una Vulnerabilidad

**NO abras issues públicos para vulnerabilidades de seguridad.**

En su lugar, envía un reporte a:

1. **GitHub Security Advisories**: [https://github.com/OsoPanda1/rdm-digital-hub-ldtocs/security/advisories](https://github.com/OsoPanda1/rdm-digital-hub-ldtocs/security/advisories)
2. **Email**: [INSERTAR CORREO DE SEGURIDAD]

### Proceso

1. **Reportas** la vulnerabilidad (recibes confirmación en <48h).
2. **Evaluamos** el reporte (severidad, impacto, alcance).
3. **Desarrollamos** un fix en privado.
4. **Publicamos** un advisory + fix en <14 días (crítico) o <30 días (medio/bajo).
5. **Revelamos** el reporte después del fix.

### Expectativas

- Recibirás actualizaciones cada 72h.
- Coordinaremos la divulgación contigo.
- Damos crédito público a los reporteros (a menos que prefieran anonimato).

## Prácticas de Seguridad del Proyecto

### Protecciones Activas

- **pnpm minimumReleaseAge: 1440** — protege contra ataques de supply chain (1 día de retraso en npm packages nuevos).
- **pnpm onlyBuiltDependencies** — solo 4 paquetes pueden ejecutar scripts de post-instalación.
- **pnpm overrides** — parches de seguridad transitivos para js-yaml, fast-uri, brace-expansion, undici, @babel/core, dompurify, @tanstack/start-server-core.
- **Supabase RLS** — Row Level Security en todas las tablas.
- **PKCE Flow** — OAuth con Proof Key for Code Exchange.
- **Criptografía Post-Cuántica** — resistencia contra ataques cuánticos.
- **Doble Hexágono** — modelo de autorización en dos capas para APIs.

### Variables de Entorno Sensibles

```env
# NUNCA commitees estos valores
SUPABASE_SERVICE_ROLE_KEY=  # Acceso total a DB
SUPABASE_JWT_SECRET=        # Firma de tokens
VITE_SENTRY_DSN=            # Acceso a telemetría
TURNSTILE_SECRET_KEY=       # Protección anti-bot
STRIPE_SECRET_KEY=          # Procesamiento de pagos
```

## Buenas Prácticas para Contribuyentes

1. **Nunca incluyas secrets en el código** — usa variables de entorno.
2. **No uses `console.log` de secrets** — ni en debug.
3. **Sanitiza inputs** — toda entrada de usuario debe validarse con Zod.
4. **Usa `guardSupabase()`** — antes de cualquier operación Supabase.
5. **Evita `any`** — erosiona el type safety que protege contra vulnerabilidades.

## Marco Legal

Este proyecto opera bajo el **RFC-0001** ([RFC-0001-MANIFEST.md](./RFC-0001-MANIFEST.md)), que establece un régimen de licenciamiento híbrido por capas. Las violaciones de seguridad que resulten en acceso no autorizado a componentes TAMV‑PRCL (propietarios) o TAMV‑EOL (Isabella AI) pueden constituir violaciones de secreto industrial y estar sujetas a acciones legales conforme a la legislación mexicana.

## Reconocimientos

Agradecemos a la comunidad por ayudar a mantener este proyecto seguro. Reportes válidos serán reconocidos en nuestro archivo de seguridad.
