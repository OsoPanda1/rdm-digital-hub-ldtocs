/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import router from "./routes";
import { logger } from "./lib/logger";
import { attachRdmIdentity, rateLimitByRoute } from "./lib/security";
import { attachJwtIdentity } from "./middlewares/auth";
import { tracingMiddleware } from "./lib/tracing";
import { loadEnv } from "./lib/env";

const NODE_ENV = process.env.NODE_ENV ?? "development";
const FEDERATION_MODE =
  process.env.RDM_FEDERATION_MODE ?? "heptafederado-dev";
const SECURITY_PROFILE =
  process.env.RDM_SECURITY_PROFILE ?? "dev-relaxed";
const OBSERVABILITY_MODE =
  process.env.RDM_OBSERVABILITY_MODE ?? "verbose";

// â”€â”€ CORS Allowlist (PennyLane pattern: explicit origins, never reflect) â”€â”€
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const app: Express = express();

// â”€â”€ Validate environment at startup (production: fail fast; dev: warn + fallbacks) â”€â”€
loadEnv();

// â”€â”€ Trust proxy (required for rate limiting and IP extraction behind LB) â”€â”€
app.set("trust proxy", NODE_ENV === "production" ? 1 : false);

// --------- LOGGING ESTRUCTURADO ---------

app.use(
  pinoHttp({
    logger,
    autoLogging: {
      ignore: (req) => req.url === "/api/healthz",
    },
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
          federationMode: FEDERATION_MODE,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
    customProps() {
      return {
        nodeEnv: NODE_ENV,
        securityProfile: SECURITY_PROFILE,
        observabilityMode: OBSERVABILITY_MODE,
      };
    },
  }),
);

// --------- SEGURIDAD BASE ---------

const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.supabase.co"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "img-src": ["'self'", "data:", "blob:", "https://*.supabase.co", "https://*.hostinger.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "connect-src": ["'self'", "https://*.supabase.co", "https://api.visitarealdelmonte.online"],
  "frame-ancestors": ["'none'"],
  "form-action": ["'self'"],
  "base-uri": ["'self'"],
  "upgrade-insecure-requests": [],
};

app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV === "production"
      ? { directives: CSP_DIRECTIVES }
      : false,
    hsts: NODE_ENV === "production" ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    permissionsPolicy: {
      camera: [],
      "display-capture": [],
      fullscreen: [],
      geolocation: [],
      microphone: [],
      payment: [],
    },
    crossOriginEmbedderPolicy: NODE_ENV === "production",
    crossOriginOpenerPolicy: NODE_ENV === "production",
    crossOriginResourcePolicy: NODE_ENV === "production" ? { policy: "cross-origin" } : false,
  }),
);

// CORS: explicit allowlist in production, permissive in dev only
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (NODE_ENV !== "production") {
        const devOrigins = ["http://localhost:3000", "http://localhost:5173", "http://localhost:22942", "http://0.0.0.0:22942"];
        if (devOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
          return callback(null, true);
        }
        callback(new Error(`CORS: Dev origin ${origin} not allowed.`));
        return;
      }

      if (ALLOWED_ORIGINS.length === 0) {
        logger.warn("ALLOWED_ORIGINS is empty — CORS will reject all cross-origin requests.");
        callback(new Error("CORS: No allowed origins configured."));
        return;
      }
      if (ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      logger.warn({ origin }, "CORS: Origin not in allowlist.");
      callback(new Error(`CORS: Origin ${origin} not allowed.`));
    },
    credentials: true,
  }),
);

// Custom CORS error handler — return 403 JSON instead of 500
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.message.startsWith("CORS:")) {
    res.status(403).json({ ok: false, error: { code: "CORS_ERROR", message: err.message } });
    return;
  }
  next(err);
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// â”€â”€ Global rate limiter (100 req/min/IP) â€” defense against brute force â”€â”€
const globalRateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
const GLOBAL_RATE_LIMIT = 100;
const GLOBAL_RATE_WINDOW_MS = 60_000;
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of globalRateLimitBuckets) {
    if (bucket.resetAt <= now) globalRateLimitBuckets.delete(key);
  }
}, 300_000); // cleanup every 5 min

app.use((req, res, next) => {
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
  const now = Date.now();
  const bucket = globalRateLimitBuckets.get(clientIp);
  if (bucket && bucket.resetAt > now && bucket.count >= GLOBAL_RATE_LIMIT) {
    res.status(429).json({ ok: false, error: "Rate limit exceeded", retryAfter: Math.ceil((bucket.resetAt - now) / 1000) });
    return;
  }
  if (!bucket || bucket.resetAt <= now) {
    globalRateLimitBuckets.set(clientIp, { count: 1, resetAt: now + GLOBAL_RATE_WINDOW_MS });
  } else {
    bucket.count++;
  }
  next();
});

// â”€â”€ Request timeout (30s) â€” defense against slowloris â”€â”€
app.use((_req, res, next) => {
  res.setTimeout(30_000, () => {
    if (!res.headersSent) {
      res.status(503).json({ ok: false, error: "Request timeout" });
    }
  });
  next();
});

// â”€â”€ AUTH: JWT verification (PennyLane pattern: verify at boundary) â”€â”€
// attachJwtIdentity runs FIRST â€” extracts identity from verified Supabase JWT.
// attachRdmIdentity runs SECOND â€” fills in IP and ensures identity exists for anon.
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || null;
if (!JWT_SECRET) {
  logger.warn("SUPABASE_JWT_SECRET not set â€” running in dev-relaxed mode (anonymous access)");
}
app.use(attachJwtIdentity(JWT_SECRET));
app.use(attachRdmIdentity);

// --------- CONTEXTO DE SEGURIDAD HEPTAFEDERADO ---------

app.use((req, _res, next) => {
  (req as any).rdmSecurityContext = {
    securityProfile: SECURITY_PROFILE,
    federationMode: FEDERATION_MODE,
  };
  next();
});

// --------- TRACING (PennyLane pattern: observability from start) ---------

app.use(tracingMiddleware);

// --------- RUTEADOR PRINCIPAL ---------

app.use("/api", router);

// --------- ROOT HEALTH (Docker healthcheck) ---------

app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true });
});

// --------- 404 ---------

app.use((req, res) => {
  logger.warn({ path: req.path, method: req.method }, "API route not found");
  res.status(404).json({ ok: false, error: { code: "NOT_FOUND", message: "Route not found" } });
});

// --------- GLOBAL ERROR HANDLER (PennyLane pattern) ---------
// Catches all unhandled errors from async routes and middleware.

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(
    {
      err: { message: err.message, stack: err.stack },
      path: req.path,
      method: req.method,
    },
    "Unhandled error",
  );

  res.status(500).json({
    ok: false,
    error: { code: "INTERNAL_ERROR", message: "Internal server error" },
  });
});

export default app;
