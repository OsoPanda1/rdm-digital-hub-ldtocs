# ADR-001: Supabase para Identity

Fecha: 2026-07-01
Estado: Accepted

---

## Contexto

TAMV Online y el Nodo Cero necesitan un sistema de identidad integrado que proporcione autenticación, autorización, RLS (Row Level Security) y APIs rápidas para manejar usuarios, perfiles, roles y badges.

La alternativa era construir un sistema de identidad desde cero o integrar un proveedor externo con menos control sobre los datos.

## Decisión

Usar Supabase Postgres como base de identidad del dominio Identity.

- Autenticación gestionada por Supabase Auth.
- Base de datos Postgres con RLS para control de acceso a nivel de fila.
- APIs REST y Realtime integradas.

## Alternativas consideradas

- **Firebase Auth**: Dependencia excesiva de Google, menor control sobre datos.
- **Auth0**: Costo creciente con escala, menor integración con Postgres.
- **Sistema custom**: Alto costo de desarrollo y mantenimiento.

## Consecuencias

- Dependencia gestionada de Supabase como proveedor de identidad.
- Separación clara de identidad del resto del ecosistema.
- RLS proporciona seguridad a nivel de base de datos.
- APIs listas para uso reducen tiempo de desarrollo.
- Datos de identidad centralizados en un dominio claro.
