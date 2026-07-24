// artifacts/api-server/src/routes/radio.ts
// RDM Digital Hub — TAMV 92.5 FM Radio API
// Proxies requests to AzuraCast REST API for now-playing,
// schedule, listener stats, and playlist management.

import { Router, Request, Response } from "express";

// ── Config ──────────────────────────────────────────────────
const AZURACAST_URL = process.env.AZURACAST_URL || "http://localhost:8000";
const AZURACAST_API_KEY = process.env.AZURACAST_API_KEY || "";
const AZURACAST_STATION = process.env.AZURACAST_STATION || "tamv925";
const CACHE_TTL = 10_000; // 10 seconds

// ── Simple in-memory cache ──────────────────────────────────
const cache = new Map<string, { data: unknown; ts: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, ts: Date.now() });
}

// ── AzuraCast fetch helper ──────────────────────────────────
async function azFetch(path: string): Promise<unknown> {
  const cached = getCached(path);
  if (cached) return cached;

  const url = `${AZURACAST_URL}${path}`;
  const headers: Record<string, string> = {};
  if (AZURACAST_API_KEY) {
    headers["X-API-Key"] = AZURACAST_API_KEY;
  }

  const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) {
    throw new Error(`AzuraCast API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  setCache(path, data);
  return data;
}

// ── Route registration ──────────────────────────────────────
export function registerRadioRoutes(router: Router): void {
  // GET /api/radio/now-playing — Current song, listeners, live status
  router.get("/radio/now-playing", async (_req: Request, res: Response) => {
    try {
      const data = await azFetch(`/api/nowplaying/${AZURACAST_STATION}`);
      res.json(data);
    } catch (err) {
      console.error("[Radio] now-playing error:", err);
      res.status(502).json({
        error: "Radio server unreachable",
        message: "AzuraCast no esta disponible. Verifica que el servidor de radio este activo.",
        server: AZURACAST_URL,
      });
    }
  });

  // GET /api/radio/status — Station status (up/down, version, listeners)
  router.get("/radio/status", async (_req: Request, res: Response) => {
    try {
      const data = await azFetch(`/api/station/${AZURACAST_STATION}`);
      res.json(data);
    } catch (err) {
      console.error("[Radio] status error:", err);
      res.status(502).json({ error: "Radio server unreachable" });
    }
  });

  // GET /api/radio/listeners — Current listener list
  router.get("/radio/listeners", async (_req: Request, res: Response) => {
    try {
      const data = await azFetch(`/api/station/${AZURACAST_STATION}/listeners`);
      res.json(data);
    } catch (err) {
      console.error("[Radio] listeners error:", err);
      res.status(502).json({ error: "Radio server unreachable" });
    }
  });

  // GET /api/radio/schedule — Weekly schedule
  router.get("/radio/schedule", async (_req: Request, res: Response) => {
    try {
      const data = await azFetch(`/api/station/${AZURACAST_STATION}/schedule`);
      res.json(data);
    } catch (err) {
      console.error("[Radio] schedule error:", err);
      res.status(502).json({ error: "Radio server unreachable" });
    }
  });

  // GET /api/radio/playlists — Station playlists
  router.get("/radio/playlists", async (_req: Request, res: Response) => {
    try {
      const data = await azFetch(`/api/station/${AZURACAST_STATION}/playlists`);
      res.json(data);
    } catch (err) {
      console.error("[Radio] playlists error:", err);
      res.status(502).json({ error: "Radio server unreachable" });
    }
  });

  // GET /api/radio/requests — Pending listener requests
  router.get("/radio/requests", async (_req: Request, res: Response) => {
    try {
      const data = await azFetch(`/api/station/${AZURACAST_STATION}/requests`);
      res.json(data);
    } catch (err) {
      console.error("[Radio] requests error:", err);
      res.status(502).json({ error: "Radio server unreachable" });
    }
  });

  // GET /api/radio/historical — Playback history
  router.get("/radio/historical", async (req: Request, res: Response) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const data = await azFetch(
        `/api/station/${AZURACAST_STATION}/history?hours=${hours}`
      );
      res.json(data);
    } catch (err) {
      console.error("[Radio] historical error:", err);
      res.status(502).json({ error: "Radio server unreachable" });
    }
  });

  // POST /api/radio/stream-url — Get the stream URL for a given mount
  router.post("/radio/stream-url", (req: Request, res: Response) => {
    const { mount } = req.body;
    const streamMount = mount || "tamv925";
    const streamUrl = `${AZURACAST_URL}/listen/${streamMount}`;
    res.json({ url: streamUrl, mount: streamMount });
  });
}
