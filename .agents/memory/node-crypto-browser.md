---
name: node:crypto in browser bundle
description: Server-only files using node:crypto get transitively imported by client code; Vite externalizes node:crypto but throws at runtime.
---

## Rule
Any file using `import { createHmac } from 'node:crypto'` that ends up in the client bundle will crash with "Module externalized for browser compatibility." Shim or remove before bundling.

**Why:** `TerritorialFusionEngine` (client-side) imports `IsabellaConsciousnessPipeline` → `ports` → `middleware.ts` which had `import { createHmac } from 'node:crypto'`. Vite externalizes node built-ins but they throw when accessed at runtime in the browser.

**How to apply:**
- Replace `import { createHmac } from 'node:crypto'` with a browser-safe shim that returns a placeholder digest
- Also replace `process.env.*` references in the same file with `import.meta.env.VITE_*` equivalents
- File: `artifacts/rdm-hub/src/isabella/api/middleware.ts`
