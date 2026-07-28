/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// artifacts/api-server/src/routes/index.ts

import { Router } from "express";
import { registerHealthRoutes } from "./health";
import { registerTerritoryRoutes } from "./territory";
import { registerGamificationRoutes } from "./gamification";
import { registerNarrativeRoutes } from "./narrative";
import { registerIsabellaRoutes } from "./isabella";
import { registerTelemetryRoutes } from "./telemetry";

// â”€â”€ Batch 7: C.R.O.W.N Federation Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ YUN Constitutional Realm â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { registerYunRoutes } from "./yun";
import { registerPodcastRoutes } from "./podcast";

// â”€â”€ Isabella Cognitive Kernel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { registerKernelRoutes } from "./isabella-kernel";

const router = Router();

// --------- RUTAS PÃšBLICAS BASE ---------
registerHealthRoutes(router);

router.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "RDM Heptafederation API Gateway",
    crown: "THE C.R.O.W.N â€” Constitutional Realm of Omniscient Wise Nexus",
    version: "4.0.0",
  });
});

// --------- FEDERACIÃ“N TERRITORIAL ---------
registerTerritoryRoutes(router);

// --------- GAMIFICACIÃ“N ---------
registerGamificationRoutes(router);

// --------- NARRATIVA ---------
registerNarrativeRoutes(router);

// --------- ISABELLA AI ---------
registerIsabellaRoutes(router);

// --------- TELEMETRÃA ---------
registerTelemetryRoutes(router);

// â”€â”€ Batch 7: C.R.O.W.N Federation Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ YUN Constitutional Realm Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
registerYunRoutes(router);              // /api/yun/*

// â”€â”€ Podcast Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
registerPodcastRoutes(router);          // /api/podcast/*

// â”€â”€ Isabella Cognitive Kernel Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
registerKernelRoutes(router);           // /api/kernel/*

export default router;
