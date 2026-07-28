/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import type { Router } from "express";
import { telemetrySnapshot } from "./telemetry";
import { getPool } from "../lib/db-client";

// Registra rutas de health en el router maestro.
// Se usa en routes/index.ts: registerHealthRoutes(router).
export function registerHealthRoutes(router: Router) {
  router.get("/healthz", async (_req, res) => {
    const telemetry = telemetrySnapshot();

    let dbOk = true;
    const pool = getPool();
    if (pool) {
      try {
        await pool.query("SELECT 1");
      } catch {
        dbOk = false;
      }
    } else {
      dbOk = false;
    }

    const telemetryOk = telemetry.status !== "degraded";
    const ok = dbOk && telemetryOk;

    res.status(ok ? 200 : 503).json({ status: ok ? "ok" : "degraded" });
  });
}
