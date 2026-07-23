import type { Router } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

// Registra rutas de health en el router maestro.
// Se usa en routes/index.ts: registerHealthRoutes(router).
export function registerHealthRoutes(router: Router) {
  router.get("/healthz", (_req, res) => {
    // Construimos el objeto conforme al esquema Zod.
    const data = HealthCheckResponse.parse({
      status: "ok",
      service: "RDM API Gateway",
      timestamp: new Date().toISOString(),
    });

    res.status(200).json(data);
  });
}
