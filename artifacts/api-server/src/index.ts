import app from "./app";
import { logger } from "./lib/logger";

// --------- LECTURA DE ENTORNO ---------

const rawPort = process.env["PORT"];

if (!rawPort) {
  // Este error indica que la configuración de Replit / artifact no está respetando PORT.
  // Es preferible fallar rápido y con mensaje claro.
  throw new Error(
    'PORT environment variable is required but was not provided. ' +
      "Ensure that the artifact.toml and Replit Secrets define PORT correctly.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Modos de federación y seguridad definidos en artifact.toml.
const NODE_ENV = process.env["NODE_ENV"] || "development";
const FEDERATION_MODE = process.env["RDM_FEDERATION_MODE"] || "heptafederado-dev";
const SECURITY_PROFILE =
  process.env["RDM_SECURITY_PROFILE"] || "dev-relaxed";
const OBSERVABILITY_MODE =
  process.env["RDM_OBSERVABILITY_MODE"] || "verbose";

// Log de arranque con contexto heptafederado.
logger.info(
  {
    port,
    NODE_ENV,
    FEDERATION_MODE,
    SECURITY_PROFILE,
    OBSERVABILITY_MODE,
  },
  "Booting RDM Heptafederation API Gateway",
);

// --------- ARRANQUE DEL SERVIDOR ---------

const server = app.listen(port, (err?: Error) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    // En producción, podrías implementar un shutdown más elegante; por ahora, fail-fast.
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});

// Manejo explícito de errores de startup en el socket (binding, permisos, etc.).
server.on("error", (err: unknown) => {
  logger.error({ err }, "Server error after listen");
  process.exit(1);
});

// Opcional: manejar señales para shutdown limpio en producción.
process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, closing server gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("Received SIGINT, closing server gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});
