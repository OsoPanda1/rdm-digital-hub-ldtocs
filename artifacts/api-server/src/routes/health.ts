import type { Router } from "express";
import { telemetrySnapshot } from "./telemetry";
import { getPool } from "../lib/db-client";

// Registra rutas de health en el router maestro.
// Se usa en routes/index.ts: registerHealthRoutes(router).
export function registerHealthRoutes(router: Router) {
  router.get("/healthz", async (_req, res) => {
    const telemetry = telemetrySnapshot();
    const requiredEnv = ["NODE_ENV", "DATABASE_URL", "MEXA_API_SECURE_KEY", "YUN_SIGNING_SECRET"];
    const missingEnv = requiredEnv.filter((key) => !process.env[key]);

    // ── Database Connectivity Check (PennyLane pattern) ──
    let dbStatus = "ok";
    let dbLatencyMs = 0;
    const pool = getPool();
    if (pool) {
      const start = Date.now();
      try {
        await pool.query("SELECT 1");
        dbLatencyMs = Date.now() - start;
      } catch (err) {
        dbStatus = "error";
        dbLatencyMs = Date.now() - start;
      }
    } else {
      dbStatus = "not_connected";
    }

    const checks = {
      api: "ok",
      database: dbStatus,
      telemetry: telemetry.status,
      environment: missingEnv.length === 0 ? "ok" : "degraded",
    };

    const status =
      telemetry.status === "degraded" ||
      missingEnv.length > 0 ||
      dbStatus === "error"
        ? "degraded"
        : "ok";

    res.status(status === "ok" ? 200 : 503).json({
      status,
      service: "RDM API Gateway",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        poolSize: pool ? pool.totalCount : 0,
        poolIdle: pool ? pool.idleCount : 0,
        poolWaiting: pool ? pool.waitingCount : 0,
      },
      degradedReasons: [
        ...missingEnv.map((key) => `missing env ${key}`),
        ...(telemetry.status === "degraded" ? ["critical telemetry events in last minute"] : []),
        ...(dbStatus === "error" ? ["database connectivity failed"] : []),
      ],
    });
  });
}
