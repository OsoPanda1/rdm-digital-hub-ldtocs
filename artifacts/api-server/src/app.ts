import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import router from "./routes";
import { logger } from "./lib/logger";

// Variables de entorno clave para la heptafederación y seguridad.
// Estas vienen del artifact.toml y del entorno de Replit.
const NODE_ENV = process.env.NODE_ENV ?? "development";
const FEDERATION_MODE =
  process.env.RDM_FEDERATION_MODE ?? "heptafederado-dev";
const SECURITY_PROFILE =
  process.env.RDM_SECURITY_PROFILE ?? "dev-relaxed";
const OBSERVABILITY_MODE =
  process.env.RDM_OBSERVABILITY_MODE ?? "verbose";

const app: Express = express();

// --------- LOGGING ESTRUCTURADO ---------

app.use(
  pinoHttp({
    logger,
    autoLogging: {
      // En producción puedes desactivar autoLogging para endpoints de health
      // para reducir ruido en logs.
      ignorePaths: ["/api/healthz"],
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

// Helmet: cabeceras de seguridad (XSS, clickjacking, etc.)
app.use(
  helmet({
    // Puedes ajustar según necesidades de tu frontend (por ejemplo, CSP).
    contentSecurityPolicy: NODE_ENV === "production" ? undefined : false,
  }),
);

// CORS: habilita solo lo que necesitas; ahora ponemos algo genérico.
app.use(
  cors({
    origin: true, // En producción puedes restringir a tu dominio (RDM Hub / Vercel).
    credentials: true,
  }),
);

// Body parsers.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------- MIDDLEWARES TRANSVERSALES DE SEGURIDAD ---------

// Aquí puedes integrar tus módulos de seguridad del monorepo:
// - sanitize.ts, PostQuantumCrypto.ts, ContextIsolation.ts, rate-limiter, etc.
// Ejemplo de placeholder:

app.use((req, res, next) => {
  // Ejemplo: marcar contexto de seguridad para downstream middlewares.
  (req as any).rdmSecurityContext = {
    securityProfile: SECURITY_PROFILE,
    federationMode: FEDERATION_MODE,
  };

  next();
});

// Aquí podrías insertar un rate-limiter basado en SECURITY_PROFILE:
// if (SECURITY_PROFILE === "prod-hardened") { app.use(rateLimiterMiddleware); }

// --------- RUTEADOR PRINCIPAL ---------

// Todas las rutas del API cuelgan de /api y se organizan por federaciones dentro de router.
// - /api/healthz            -> health.ts
// - /api/territory/*        -> territory.ts
// - /api/isabella/*         -> (futuras rutas IA)
// - /api/gamification/*     -> (futuras rutas de juego)
// - /api/payments/*         -> (futuras rutas de monetización)
// - /api/telemetry/*        -> (futuras rutas de métricas)
app.use("/api", router);

// --------- MANEJO DE RUTA NO ENCONTRADA ---------

app.use((req, res) => {
  logger.warn(
    {
      path: req.path,
      method: req.method,
    },
    "API route not found",
  );

  res.status(404).json({
    error: "Not Found",
    path: req.path,
  });
});

export default app;
