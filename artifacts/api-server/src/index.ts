import app from "./app";
import { logger } from "./lib/logger";
import { closeDb } from "./lib/db-client";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info({ port: PORT }, "RDM Heptafederation API Gateway listening");
});

// ── Graceful Shutdown (PennyLane pattern: SIGTERM/SIGINT handling) ──

let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ signal }, "Graceful shutdown initiated...");

  // Stop accepting new connections
  server.close(async () => {
    logger.info("HTTP server closed.");

    try {
      await closeDb();
      logger.info("Database connection pool closed.");
    } catch (err) {
      logger.error({ err }, "Error closing database pool.");
    }

    logger.info("Shutdown complete.");
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10_000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ── Unhandled Errors (PennyLane pattern: never crash silently) ──

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception — shutting down.");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled promise rejection.");
});
