/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Digital Twins F5 Routes â€” Escenas, sensores, modelos
// GET/POST /api/twins/*
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { Router, Request, Response, NextFunction } from "express";
import { requireRdmRole, rateLimitByRoute } from "../lib/security";
import { createTwinsF5 } from "../lib/federation/twins-f5";

export function registerTwinsRoutes(router: Router) {
  // ⚠️ IN-MEMORY — twins F5 state LOST ON SERVER RESTART
  const twins = createTwinsF5();

  router.get("/twins/scenes", (_req: Request, res: Response) => {
    const scenes = twins.listScenes();
    res.status(200).json({ ok: true, data: scenes });
  });

  router.get("/twins/scene/:id", (req: Request, res: Response) => {
    const scene = twins.getScene(req.params.id);
    if (!scene) { res.status(404).json({ ok: false, error: "not_found" }); return; }
    res.status(200).json({ ok: true, data: scene });
  });

  router.get("/twins/scene/:id/sensors", (req: Request, res: Response) => {
    const sensors = twins.getSensorReadings(req.params.id);
    res.status(200).json({ ok: true, data: sensors });
  });

  router.post("/twins/scene",
    requireRdmRole("operator"),
    rateLimitByRoute({ name: "twins-create", limit: 10 }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, description, territoryId } = req.body ?? {};
        if (!name) { res.status(400).json({ ok: false, error: "name required" }); return; }
        const scene = await twins.createScene({ name, description: description ?? "", territoryId: territoryId ?? "ter-rdm" });
        res.status(201).json({ ok: true, data: scene });
      } catch (err) { next(err); }
    }
  );

  router.post("/twins/scene/:id/sensor",
    requireRdmRole("operator"),
    rateLimitByRoute({ name: "twins-sensor", limit: 30 }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { sensorType, value, unit } = req.body ?? {};
        if (!sensorType || value == null) {
          res.status(400).json({ ok: false, error: "sensorType and value required" }); return;
        }
        const reading = await twins.addSensorReading(req.params.id, { sensorType, value: Number(value), unit: unit ?? "" });
        res.status(201).json({ ok: true, data: reading });
      } catch (err) { next(err); }
    }
  );

  router.get("/twins/stats", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: twins.stats() });
  });
}
