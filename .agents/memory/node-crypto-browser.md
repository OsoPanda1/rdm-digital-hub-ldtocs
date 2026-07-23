---
name: node:crypto in browser bundle
description: Server-only files using node:crypto get transitively imported by client code; Vite externalizes node:crypto but throws at runtime.
status: FIXED
---

## Implementation
- `artifacts/rdm-hub/src/isabella/api/middleware.ts` — `createHmac` browser shim (returns sentinel in browser); `process.env.*` replaced with `import.meta.env.VITE_*`; `Buffer` replaced with `atob`-based `base64UrlDecode`
