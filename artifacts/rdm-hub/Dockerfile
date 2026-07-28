# SPDX-License-Identifier: MIT
# RDM Digital Hub — Frontend (Vite build + nginx serve)
#
# Vite outputs to dist/public/ (configured in vite.config.ts outDir).
# Shared libs export raw TS — Vite resolves and bundles them directly.

# ─── BUILD ───────────────────────────────────────────────────────────
FROM node:20-alpine AS build
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY artifacts/rdm-hub/package.json artifacts/rdm-hub/
COPY lib/api-client-react/package.json lib/api-client-react/
COPY lib/api-zod/package.json lib/api-zod/

RUN pnpm install --frozen-lockfile
COPY . .

# Vite inlines env vars at build time
ENV VITE_API_URL=https://api.visitarealdelmonte.online
ENV VITE_API_BASE_URL=https://api.visitarealdelmonte.online/v1
ENV VITE_API_GATEWAY=https://api.visitarealdelmonte.online
ENV VITE_SITE_URL=https://visitarealdelmonte.online

RUN pnpm --filter @workspace/rdm-hub run build

# ─── SERVE ───────────────────────────────────────────────────────────
FROM nginx:alpine AS production

# Vite outDir is dist/public — copy contents directly into nginx html root
COPY --from=build /app/artifacts/rdm-hub/dist/public /usr/share/nginx/html
COPY deploy/nginx/frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 22942

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=15s \
  CMD wget -qO- http://localhost:22942/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
