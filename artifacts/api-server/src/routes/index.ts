// artifacts/api-server/src/routes/index.ts

import { Router } from "express";
import { registerHealthRoutes } from "./health";
import { registerTerritoryRoutes } from "./territory";
import { registerGamificationRoutes } from "./gamification";
import { registerNarrativeRoutes } from "./narrative";
import { registerIsabellaRoutes } from "./isabella";

const router = Router();

// --------- RUTAS PÚBLICAS BASE ---------

// Health: usado por Replit (startup/periodic) y observabilidad.
registerHealthRoutes(router);

// Status mínimo del gateway en /api/
router.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "RDM Heptafederation API Gateway",
  });
});

// --------- FEDERACIÓN TERRITORIAL ---------

registerTerritoryRoutes(router);

// --------- GAMIFICACIÓN ---------
registerGamificationRoutes(router); // /api/v1/gamification/* + /api/v1/living-world/*

// --------- NARRATIVA (Realito & Isabella) ---------
registerNarrativeRoutes(router);    // /api/v1/narrative/*

// --------- ISABELLA AI ---------
registerIsabellaRoutes(router);     // /api/isabella/* + /api/tts-isabella

// --------- FUTURAS FEDERACIONES ---------
// registerTelemetryRoutes(router);    // /api/telemetry/*
// registerPaymentsRoutes(router);     // /api/payments/*

export default router;
