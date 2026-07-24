import type { Router } from "express";
import { telemetrySnapshot } from "./telemetry";

// Registra rutas de health en el router maestro.
// Se usa en routes/index.ts: registerHealthRoutes(router).
export function registerHealthRoutes(router: Router) {
  router.get("/healthz", (_req, res) => {
    const telemetry = telemetrySnapshot();
    const requiredEnv = ["NODE_ENV"];
    const missingEnv = requiredEnv.filter((key) => !process.env[key]);
    const status = telemetry.status === "degraded" || missingEnv.length > 0 ? "degraded" : "ok";

    res.status(status === "ok" ? 200 : 207).json({
      status,
      service: "RDM API Gateway",
      timestamp: new Date().toISOString(),
      checks: {
        api: "ok",
        telemetry: telemetry.status,
        environment: missingEnv.length === 0 ? "ok" : "degraded",
      },
      degradedReasons: [
        ...missingEnv.map((key) => `missing env ${key}`),
        ...(telemetry.status === "degraded" ? ["critical telemetry events in last minute"] : []),
      ],
    });
  });
}
