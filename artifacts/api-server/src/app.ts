import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import router from "./routes";
import { logger } from "./lib/logger";

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
      ignorePaths: ["/api/healthz"], // menos ruido para health.
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

app.use(
  cors({
    origin: true, // En prod puedes restringir al dominio del RDM Hub.
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------- CONTEXTO DE SEGURIDAD HEPTAFEDERADO ---------

app.use((req, _res, next) => {
  (req as any).rdmSecurityContext = {
    securityProfile: SECURITY_PROFILE,
    federationMode: FEDERATION_MODE,
  };
  next();
});

// Aquí puedes integrar rate limiting y sanitización usando tus módulos globales:
// if (SECURITY_PROFILE === "prod-hardened") {
//   app.use(rateLimiterMiddleware);
// }
// app.use(sanitizeMiddleware);

// --------- RUTEADOR PRINCIPAL ---------

app.use("/api", router);

// --------- RUTA 404 POR DEFECTO ---------

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
