import { Router } from "express";
import { registerHealthRoutes } from "./health";
import { registerTerritoryRoutes } from "./territory";
// Futuro: añadir más federaciones cuando estén listas:
// import { registerIsabellaRoutes } from "./isabella";
// import { registerGamificationRoutes } from "./gamification";
// import { registerTelemetryRoutes } from "./telemetry";
// import { registerPaymentsRoutes } from "./payments";

const router = Router();

// --------- RUTAS PÚBLICAS BASE ---------

// Health: usado por Replit y monitoreo.
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

// --------- FUTURAS FEDERACIONES ---------
// registerIsabellaRoutes(router);     // /api/isabella/*
// registerGamificationRoutes(router); // /api/gamification/*
// registerTelemetryRoutes(router);    // /api/telemetry/*
// registerPaymentsRoutes(router);     // /api/payments/*

export default router;
