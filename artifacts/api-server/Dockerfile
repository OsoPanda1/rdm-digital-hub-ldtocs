# SPDX-License-Identifier: MIT
# RDM Digital Hub — API Server (Node 20 + pnpm)
#
# Build: esbuild bundles src/index.ts → dist/index.mjs
# Shared libs (@workspace/db, @workspace/api-zod) export raw TS — esbuild
# resolves and bundles them directly, no separate build step required.

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ─── DEPENDENCIES ────────────────────────────────────────────────────
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY artifacts/api-server/package.json artifacts/api-server/
COPY lib/db/package.json lib/db/
COPY lib/api-zod/package.json lib/api-zod/

RUN pnpm install --frozen-lockfile --prod=false

# ─── BUILD ───────────────────────────────────────────────────────────
# Copy full source tree (libs export raw TS, esbuild bundles everything)
COPY . .

RUN pnpm --filter @workspace/api-server run build

# ─── PRODUCTION ──────────────────────────────────────────────────────
FROM node:20-alpine AS production
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy workspace root metadata
COPY --from=base /app/package.json pnpm-workspace.yaml ./

# Copy API server build output + package.json
COPY --from=base /app/artifacts/api-server/package.json artifacts/api-server/
COPY --from=base /app/artifacts/api-server/dist artifacts/api-server/dist/

# Copy shared lib source (referenced at runtime by workspace protocol)
COPY --from=base /app/lib/db/package.json lib/db/
COPY --from=base /app/lib/db/src lib/db/src/
COPY --from=base /app/lib/api-zod/package.json lib/api-zod/
COPY --from=base /app/lib/api-zod/src lib/api-zod/src/

# Copy production node_modules
COPY --from=base /app/node_modules node_modules/
COPY --from=base /app/artifacts/api-server/node_modules artifacts/api-server/node_modules/
COPY --from=base /app/lib/db/node_modules lib/db/node_modules/
COPY --from=base /app/lib/api-zod/node_modules lib/api-zod/node_modules/

# Non-root user
RUN addgroup -g 1001 -S rdm && adduser -S rdm -u 1001 -G rdm
USER rdm

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=30s \
  CMD wget -qO- http://localhost:8080/healthz || exit 1

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
