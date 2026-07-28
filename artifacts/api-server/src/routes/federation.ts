/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Federation Routes â€” YUN Bus + Router status
// GET /api/federation/status, /api/federation/events
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { Router, Request, Response } from "express";
import { requireRdmRole, rateLimitByRoute } from "../lib/security";
import { createYunBus } from "../lib/federation/yun-bus";
import { createYunRouter } from "../lib/federation/yun-router";
import { validate, schemas } from "../middlewares/validate";

export function registerFederationRoutes(router: Router) {
  // ⚠️ IN-MEMORY — bus/router state LOST ON SERVER RESTART
  const bus = createYunBus();
  const yunRouter = createYunRouter(bus);

  router.get("/federation/status", (_req: Request, res: Response) => {
    res.status(200).json({
      ok: true,
      data: {
        bus: bus.stats(),
        router: yunRouter.stats(),
        federations: ["identity-f1", "patrimonio-f2", "turismo-f3", "economia-f4", "twins-f5", "agents-f6", "resiliencia-f7"],
      },
    });
  });

  router.get("/federation/events", (req: Request, res: Response) => {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const events = bus.getHistory(limit);
    res.status(200).json({ ok: true, data: events });
  });

  router.post("/federation/emit",
    requireRdmRole("operator"),
    rateLimitByRoute({ name: "federation-emit", limit: 30 }),
    validate(schemas.federationEmit),
    async (req: Request, res: Response) => {
      const { federationId, type, payload } = req.body ?? {};
      if (!federationId || !type) {
        res.status(400).json({ ok: false, error: "federationId and type required" });
        return;
      }
      const traceId = await bus.emit(federationId, type, payload ?? {});
      res.status(200).json({ ok: true, data: { traceId, federationId, type } });
    }
  );
}
