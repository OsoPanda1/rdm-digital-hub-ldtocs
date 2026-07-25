// artifacts/api-server/src/routes/index.ts

import { Router } from "express";
import { registerHealthRoutes } from "./health";
import { registerTerritoryRoutes } from "./territory";
import { registerGamificationRoutes } from "./gamification";
import { registerNarrativeRoutes } from "./narrative";
import { registerIsabellaRoutes } from "./isabella";
import { registerRadioRoutes } from "./radio";
import { registerTelemetryRoutes } from "./telemetry";

// ── Batch 7: C.R.O.W.N Federation Routes ───────────────────────
import { registerFederationRoutes } from "./federation";
import { registerIdentityRoutes } from "./identity";
import { registerWikiRoutes } from "./wiki";
import { registerMapsRoutes } from "./maps";
import { registerEconomiaRoutes } from "./economia";
import { registerTwinsRoutes } from "./digital-twins";
import { registerAgentsRoutes } from "./agents";
import { registerIamSecurityRoutes } from "./iam-security";
import { registerIsabellaMemoryRoutes } from "./isabella-memory";
import { registerSearchRoutes } from "./search";
import { registerAdminRoutes } from "./admin";
import { registerWikiEditorRoutes } from "./wiki-editor";

const router = Router();

// --------- RUTAS PÚBLICAS BASE ---------
registerHealthRoutes(router);

router.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "RDM Heptafederation API Gateway",
    crown: "THE C.R.O.W.N — Constitutional Realm of Omniscient Wise Nexus",
    version: "4.0.0",
  });
});

// --------- FEDERACIÓN TERRITORIAL ---------
registerTerritoryRoutes(router);

// --------- GAMIFICACIÓN ---------
registerGamificationRoutes(router);

// --------- NARRATIVA ---------
registerNarrativeRoutes(router);

// --------- ISABELLA AI ---------
registerIsabellaRoutes(router);

// --------- TAMV 92.5 FM RADIO ---------
registerRadioRoutes(router);

// --------- TELEMETRÍA ---------
registerTelemetryRoutes(router);

// ── Batch 7: C.R.O.W.N Federation Routes ───────────────────────
registerFederationRoutes(router);       // /api/federation/*
registerIdentityRoutes(router);         // /api/identity/*
registerWikiRoutes(router);             // /api/wiki/*
registerMapsRoutes(router);             // /api/maps/*
registerEconomiaRoutes(router);         // /api/economia/*
registerTwinsRoutes(router);            // /api/digital-twins/*
registerAgentsRoutes(router);           // /api/agents/*
registerIamSecurityRoutes(router);      // /api/iam/*
registerIsabellaMemoryRoutes(router);   // /api/isabella/memory/*
registerSearchRoutes(router);           // /api/search/*
registerAdminRoutes(router);            // /api/admin/*
registerWikiEditorRoutes(router);       // /api/wiki-editor/*

export default router;
