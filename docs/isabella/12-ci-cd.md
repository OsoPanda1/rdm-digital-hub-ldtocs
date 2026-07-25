# CI/CD y Quality Gates

**Versión:** 1.0.0

---

## Pipeline Architecture

```
Push/PR → Lint → TypeCheck → Unit Tests → Integration Tests →
SAST → Secret Scan → Build → Deploy (staging) → E2E → Deploy (production)
```

---

## Quality Gates (Bloqueantes)

| Gate | Herramienta | Threshold | Bloquea merge |
|------|------------|-----------|---------------|
| Lint | ESLint + Prettier | 0 errores | ✅ |
| TypeCheck | TypeScript `--noEmit` | 0 errores | ✅ |
| Unit Tests | Vitest | 100% passing | ✅ |
| Coverage | Vitest --coverage | ≥85% | ✅ |
| Integration Tests | Vitest | 100% passing | ✅ |
| SAST | npm audit / CodeQL | 0 critical | ✅ |
| Secret Scan | gitleaks / truffleHog | 0 secrets | ✅ |
| TODO/TBD | grep | 0 in production code | ✅ |
| ADR Coverage | Custom script | Any arch change has ADR | ✅ |

---

## Workflows (GitHub Actions)

### CI Pipeline
```yaml
name: CI
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm test --coverage
      - run: pnpm test:integration

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=critical
      - uses: gitleaks/gitleaks-action@v2
```

---

## Scripts de Package.json

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "build": "tsc && vite build",
    "db:migrate": "drizzle-kit push:pg",
    "db:generate": "drizzle-kit generate:pg",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

## Release Strategy

- **Semantic Versioning:** `MAJOR.MINOR.PATCH`
  - MAJOR: Breaking changes to API or schema
  - MINOR: New features, skills, endpoints
  - PATCH: Bug fixes, security patches
- **Changelog:** Automatizado desde commits conventional (`feat:`, `fix:`, `security:`)
- **Release notes:** Incluyen ADR links, migration steps, breaking changes

---

## Branch Strategy

```
main (production)
  ↑
develop (integration)
  ↑
feature/* (features)
fix/* (bug fixes)
security/* (security patches)
docs/* (documentation)
```

### Rules
- PR required para merge a `develop` y `main`
- Minimum 1 approval para `develop`
- Minimum 2 approvals para `main` (incluye FED-3 o FED-7)
- Squash merge en `develop`, merge commit en `main`
- No force push a `main` o `develop`
- Tags en releases: `v1.0.0`
