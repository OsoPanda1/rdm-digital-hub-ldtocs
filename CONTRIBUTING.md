# Guía de Contribución

Gracias por tu interés en contribuir a RDM Digital Hub. Este documento establece las pautas para contribuir al proyecto.

## 🌍 Filosofía

RDM Digital Hub es un proyecto de **soberanía digital comunitaria**. Toda contribución debe alinearse con:

- **Impacto comunitario**: ¿Ayuda a comunidades a ser digitalmente soberanas?
- **Sostenibilidad**: ¿Es mantenible a largo plazo por voluntarios?
- **Accesibilidad**: ¿Puede ser usado por personas sin formación técnica avanzada?
- **Identidad cultural**: ¿Respeta y potencia la identidad de las comunidades?

## 🚀 Primeros Pasos

1. Lee el [README.md](./README.md) para entender el proyecto.
2. Revisa los [issues existentes](https://github.com/OsoPanda1/rdm-digital-hub-ldtocs/issues).
3. Comunica tu intención antes de empezar (abre un issue o discute en un issue existente).
4. Sigue nuestra [plantilla de PR](./.github/PULL_REQUEST_TEMPLATE.md).

## 📋 Requisitos Técnicos

### Antes de contribuir

- Node.js 20+, pnpm 9+
- TypeScript 5.9+
- Familiaridad con React 19, Vite 7, Tailwind CSS 4

### Estándares de Código

- **TypeScript estricto**: No usar `any`, evitar `as any` y `@ts-nocheck`.
- **React 19**: Usar `use()` para promesas, evitar `forwardRef` (obsoleto).
- **Sin `import React`**: React 19 auto-importa.
- **Tailwind CSS 4**: Usar `@theme` en lugar de `@apply` para tokens de diseño.
- **Importaciones**: Usar alias `@/` (mapeado a `src/`).
- **CSS Modules**: Evitar, preferir Tailwind utility classes.

### Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

tipos: feat | fix | refactor | chore | docs | test | style | perf
scope: rdm-hub | api-server | db | lib | isabella | maps | auth | etc.
```

Ejemplos:
```
feat(rdm-hub): añade mapa interactivo con clusters de POIs
fix(auth): corrige redirect después de login PKCE
refactor(layout): unifica MainLayout y RDMLayout
docs(readme): actualiza porcentajes de avance
```

### Branch Strategy

- `main` — producción (protegido, requiere CI verde + review)
- `develop` — integración
- `feat/<nombre>` — nuevas funcionalidades
- `fix/<nombre>` — correcciones
- `refactor/<nombre>` — refactorización

## 🧪 Testing

Actualmente en <1% coverage. Toda contribución debe incluir tests:

```bash
pnpm run typecheck  # Type checking obligatorio
pnpm run test       # Test runner (cuando esté configurado)
```

## 📁 Estructura del Proyecto

```
├── artifacts/
│   ├── rdm-hub/          # Frontend principal (React + Vite)
│   ├── api-server/       # API Express
│   └── mockup-sandbox/   # Prototipos y experimentos
├── lib/
│   ├── api-client-react/ # Cliente API generado
│   ├── api-spec/        # Especificación OpenAPI
│   ├── api-zod/         # Esquemas Zod de la API
│   └── db/              # Esquemas Drizzle ORM
├── scripts/             # Scripts de automatización
└── .github/             # Templates de issues y PRs
```

## ⚖️ Licencia

Este proyecto opera bajo un **régimen de licenciamiento híbrido por capas** (ver [LICENSE-HYBRID.md](./LICENSE-HYBRID.md)). Al contribuir, aceptas que tus contribuciones queden sujetas al régimen que corresponda según la capa donde se realicen:

- **`src/core/`, `src/kernel/`, `src/quantum/`** → TAMV‑PRCL v1.0 (Propietario)
- **`src/isabella/`** → TAMV‑EOL v1.0 (Ética)
- **`src/connect/`, componentes KÓRIMA** → TAMV‑KÓRIMA (Reciprocidad)
- **Documentación, tests, config** → MIT

No contribuyas si no estás de acuerdo con los términos de la licencia aplicable a cada capa.

## ❓ Preguntas

Abre un issue con la etiqueta `question` o contacta a los mantenedores.

---

**¿No sabes por dónde empezar?** Busca issues etiquetados con `good first issue` o `help wanted`.
