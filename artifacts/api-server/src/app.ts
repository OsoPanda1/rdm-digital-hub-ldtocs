import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import router from "./routes";
import { logger } from "./lib/logger";
import { attachRdmIdentity } from "./lib/security";
import { tracingMiddleware } from "./lib/tracing";

const NODE_ENV = process.env.NODE_ENV ?? "development";
const FEDERATION_MODE =
  process.env.RDM_FEDERATION_MODE ?? "heptafederado-dev";
const SECURITY_PROFILE =
  process.env.RDM_SECURITY_PROFILE ?? "dev-relaxed";
const OBSERVABILITY_MODE =
  process.env.RDM_OBSERVABILITY_MODE ?? "verbose";

// ── CORS Allowlist (PennyLane pattern: explicit origins, never reflect) ──
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const app: Express = express();

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

app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV === "production" ? undefined : false,
  }),
);

// CORS: explicit allowlist in production, permissive in dev only
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server)
      if (!origin) return callback(null, true);

      // In development, allow all origins
      if (NODE_ENV !== "production") return callback(null, true);

      // In production, check allowlist
      if (ALLOWED_ORIGINS.length === 0) {
        logger.warn("ALLOWED_ORIGINS is empty — CORS will reject all cross-origin requests.");
        return callback(new Error("CORS: No allowed origins configured."));
      }
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      logger.warn({ origin }, "CORS: Origin not in allowlist.");
      return callback(new Error(`CORS: Origin ${origin} not allowed.`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
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

// --------- 404 ---------

app.use((req, res) => {
  logger.warn({ path: req.path, method: req.method }, "API route not found");
  res.status(404).json({ error: "Not Found", path: req.path });
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

  // Never leak stack traces in production
  const message = NODE_ENV === "production" ? "Internal Server Error" : err.message;

  res.status(500).json({
    error: "Internal Server Error",
    message,
    path: req.path,
  });
});

export default app;
