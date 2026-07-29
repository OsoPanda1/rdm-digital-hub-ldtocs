/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// artifacts/api-server/src/routes/gamification.ts
// Gamification API — Unified engine + SSE + GPS verification + Rewards.
// ADR-001: docs/adr/001-rdm-living-world-gamification.md

import { createHmac, timingSafeEqual } from "node:crypto";
import type { Router, Request, Response } from "express";
import { auditSecurityEvent, rateLimitByRoute, requireRdmRole } from "../lib/security";
import {
  createUnifiedGamificationEngine,
  RANK_THRESHOLDS,
  XP_LEVEL_TABLE,
  gamificationBus,
} from "../lib/gamification/engine";
import { apiSuccess, apiError } from "../lib/api-response";
import { validate, schemas } from "../middlewares/validate";

// ─────────────────────────────────────────────────────────────────────
//  Module-level engine singleton
// ─────────────────────────────────────────────────────────────────────
const engine = createUnifiedGamificationEngine();

const GAMIFICATION_SIGNING_SECRET = process.env.RDM_GAMIFICATION_SIGNING_SECRET ?? process.env.YUN_SIGNING_SECRET ?? "";

function canonicalizeRewardPayload(userId: string, eventType: string, payload: unknown, timestamp: unknown, nonce: unknown): string {
  return JSON.stringify({ userId, eventType, payload: payload ?? {}, timestamp: String(timestamp ?? ""), nonce: String(nonce ?? "") });
}

function verifyGamificationSignature(req: Request, userId: string, eventType: string, payload: unknown): { ok: true } | { ok: false; error: string } {
  if (!GAMIFICATION_SIGNING_SECRET) return { ok: false, error: "missing_server_signing_secret" };
  const signature = String(req.headers["x-rdm-signature"] ?? "");
  const timestamp = req.headers["x-rdm-timestamp"];
  const nonce = req.headers["x-rdm-nonce"];
  if (!signature || !timestamp || !nonce) return { ok: false, error: "missing_signature_headers" };
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > 5 * 60_000) return { ok: false, error: "stale_signature" };
  const expected = createHmac("sha256", GAMIFICATION_SIGNING_SECRET)
    .update(canonicalizeRewardPayload(userId, eventType, payload, timestamp, nonce))
    .digest("hex");
  const received = signature.startsWith("sha256=") ? signature.slice(7) : signature;
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(received, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, error: "invalid_signature" };
  return { ok: true };
}


// ─────────────────────────────────────────────────────────────────────
//  MOCK DATA — kept for Living World endpoints not yet backed by DB
// ─────────────────────────────────────────────────────────────────────

const MOCK_AVATAR = {
  bodyType: "minero",
  hairStyle: "corto_oscuro",
  skinTone: "troniguente",
  baseOutfit: { id: "item-outfit-minero", name: "Traje de Minero Colonial", rarity: "UNCOMMON" },
  equipped: {
    head: { id: "item-helmet-minero", name: "Casco de Minero", rarity: "RARE", iconUrl: "/icons/helmet-minero.png" },
    torso: { id: "item-torso-camisa", name: "Camisa de Trabajo", rarity: "COMMON", iconUrl: "/icons/camisa.png" },
    legs: { id: "item-legs-pantalon", name: "Pantalon de Trabajo", rarity: "COMMON", iconUrl: "/icons/pantalon.png" },
    feet: { id: "item-feet-botas", name: "Botas Mineras", rarity: "UNCOMMON", iconUrl: "/icons/botas.png" },
    pet: null,
    special: { id: "item-special-lampara", name: "Lampara del Pionero", rarity: "EPIC", iconUrl: "/icons/lampara.png" },
  },
  style: "colonial",
};

const MOCK_COLLECTIONS = [
  {
    id: "col-mining-heritage",
    key: "MINING_HERITAGE",
    name: "Herencia Minera",
    description: "Los tesoros subterraneos de Real del Monte.",
    category: "MINING",
    totalItems: 12,
    obtainedItems: 7,
    progressPercentage: 58.3,
    completedAt: null,
    items: [
      { id: "item-pico-colonial", name: "Pico Colonial", rarity: "COMMON", obtained: true },
      { id: "item-lampara-aceite", name: "Lampara de Aceite", rarity: "UNCOMMON", obtained: true },
      { id: "item-canal-mercurio", name: "Canal de Mercurio", rarity: "RARE", obtained: true },
      { id: "item-libro-mineria", name: "Libro de Minas de 1780", rarity: "EPIC", obtained: false },
      { id: "item-espada-virrey", name: "Espada del Virrey", rarity: "LEGENDARY", obtained: false },
    ],
  },
  {
    id: "col-gastronomy-pastes",
    key: "GASTRONOMY_PASTES",
    name: "Sazon del Pueblo",
    description: "Todos los pastes y sabores de Real del Monte.",
    category: "GASTRONOMY",
    totalItems: 8,
    obtainedItems: 3,
    progressPercentage: 37.5,
    completedAt: null,
    items: [
      { id: "item-paste-papa", name: "Paste de Papa", rarity: "COMMON", obtained: true },
      { id: "item-paste-mole", name: "Paste de Mole", rarity: "UNCOMMON", obtained: true },
      { id: "item-paste-camaron", name: "Paste de Camaron", rarity: "RARE", obtained: false },
    ],
  },
  {
    id: "col-legendary-folklore",
    key: "LEGENDARY_FOLKLORE",
    name: "Leyendas del Monte",
    description: "Los relatos fantasticos que habitan la sierra.",
    category: "LEGENDS",
    totalItems: 10,
    obtainedItems: 4,
    progressPercentage: 40,
    completedAt: null,
    items: [
      { id: "item-relato-duende", name: "Relato del Duende", rarity: "RARE", obtained: true },
      { id: "item-relato-nahual", name: "El Nahual del Cerro", rarity: "EPIC", obtained: false },
      { id: "item-relato-llorona", name: "La Llorona de la Mina", rarity: "LEGENDARY", obtained: false },
    ],
  },
];

const MOCK_CURRENT_SEASON = {
  id: "season-mining-colonial",
  key: "MINING_COLONIAL",
  name: "Mineria Colonial",
  description: "Vive la epoca dorada de la mineria en Real del Monte.",
  startsAt: "2026-07-01T00:00:00Z",
  endsAt: "2026-09-30T23:59:59Z",
  themeConfig: {
    hudColor: "#D4A843",
    mapOverlay: "mines-culture",
    ambientSound: "mine-echoes",
    decorations: ["lanterns", "minecarts", "ore-glow"],
  },
  playerProgress: {
    score: 2400,
    rank: 3,
    totalParticipants: 1247,
    rewardsClaimed: ["skin-helmet-gold", "emote-pickaxe-swing"],
    rewardsAvailable: 8,
  },
};

const MOCK_WORLD_STATE = {
  season: MOCK_CURRENT_SEASON,
  weather: { condition: "SUNNY", temperature: 18, humidity: 45 },
  activeEvents: [
    {
      id: "evt-mine-open",
      type: "TERRITORY_EVENT",
      title: "La Mina de Acosta abre sus puertas",
      territoryId: "ter-mina-acosta",
      startsAt: "2026-07-23T10:00:00Z",
      endsAt: "2026-07-23T18:00:00Z",
      description: "Tour especial guiado por los tuneles coloniales. XP doble por visitas.",
    },
    {
      id: "evt-challenge-paste",
      type: "COMMUNITY_CHALLENGE",
      title: "Reto: 500 pastes consumidos esta semana",
      territoryId: null,
      startsAt: "2026-07-21T00:00:00Z",
      endsAt: "2026-07-27T23:59:59Z",
      description: "El pueblo come pastes. iQue puedas ayudar a llegar a 500!",
      progress: 347,
      goal: 500,
    },
  ],
  territoryActivity: { activePlayers: 23, photosToday: 89, visitsToday: 156, listensToday: 67 },
};

const MOCK_MAP_LAYER = {
  season: MOCK_CURRENT_SEASON.key,
  themeConfig: MOCK_CURRENT_SEASON.themeConfig,
  pois: [
    { id: "poi-mina-acosta", name: "Mina de Acosta", status: "EVENT", currentEventId: "evt-mine-open", lat: 20.1869, lng: -98.6653 },
    { id: "poi-plaza", name: "Plaza Principal", status: "OPEN", currentEventId: null, lat: 20.1834, lng: -98.6641 },
    { id: "poi-cementerio", name: "Panteon", status: "OPEN", currentEventId: null, lat: 20.1852, lng: -98.6620 },
    { id: "poi-templo", name: "Templo San Francisco", status: "OPEN", currentEventId: null, lat: 20.1838, lng: -98.6645 },
  ],
};

const MOCK_COMMUNITY_CHALLENGES = [
  {
    id: "cc-500-pastes",
    key: "500_PASTES_WEEK",
    name: "500 Pastes esta Semana",
    description: "La comunidad consume pastes como patrimonio vivo.",
    goalType: "VISITS",
    goalTarget: 500,
    currentProgress: 347,
    seasonId: "season-mining-colonial",
    startsAt: "2026-07-21T00:00:00Z",
    endsAt: "2026-07-27T23:59:59Z",
    rewardDescription: "Todos los participantes desbloquean el badge 'Paste Lover' y +50 COIN",
  },
  {
    id: "cc-100-photos-mina",
    key: "100_PHOTOS_MINA",
    name: "100 Fotos de la Mina",
    description: "Captura la belleza subterranea de la Mina de Acosta.",
    goalType: "PHOTOS",
    goalTarget: 100,
    currentProgress: 62,
    seasonId: "season-mining-colonial",
    startsAt: "2026-07-23T00:00:00Z",
    endsAt: "2026-07-30T23:59:59Z",
    rewardDescription: "Los 20 primeros obtienen la 'Lampara Dorada' (LEGENDARY)",
  },
  {
    id: "cc-listen-30min",
    key: "LISTEN_30MIN_TAMV",
    name: "30 Minutos con TAMV 92.5",
    description: "Escucha la radio del pueblo y gana recompensas.",
    goalType: "LISTENS",
    goalTarget: 200,
    currentProgress: 89,
    seasonId: "season-mining-colonial",
    startsAt: "2026-07-23T00:00:00Z",
    endsAt: "2026-07-27T23:59:59Z",
    rewardDescription: "Desbloquea 'Cronista del Aire' + 30 XP + 1 CRYSTAL",
  },
];

const MOCK_REWARDS_CATALOG = [
  { id: "rw-skin-helmet-gold", name: "Casco Dorado", description: "Casco de minero con detalles en oro.", type: "COSMETIC", xpCost: 500, rarity: "EPIC", iconUrl: "/icons/helmet-gold.png" },
  { id: "rw-emote-pickaxe", name: "Golpe de Pico", description: "Emote de minero golpeando roca.", type: "EMOTE", xpCost: 200, rarity: "UNCOMMON", iconUrl: "/icons/emote-pickaxe.png" },
  { id: "rw-title-cronista", name: "Titulo: Cronista del Aire", description: "Titulo exclusivo para radioescuchas.", type: "TITLE", xpCost: 300, rarity: "RARE", iconUrl: "/icons/title-cronista.png" },
  { id: "rw-badge-paste-lover", name: "Badge: Paste Lover", description: "Insignia para los amantes del paste.", type: "BADGE", xpCost: 150, rarity: "COMMON", iconUrl: "/icons/badge-paste.png" },
  { id: "rw-special-lampara", name: "Lampara del Pionero", description: "Lampara historica de la epoca colonial.", type: "SPECIAL", xpCost: 2000, rarity: "LEGENDARY", iconUrl: "/icons/lampara.png" },
];

// ─────────────────────────────────────────────────────────────────────
//  GPS helpers
// ─────────────────────────────────────────────────────────────────────

const MOCK_POI_COORDS: Record<string, { lat: number; lng: number; name: string }> = {
  "poi-mina-acosta": { lat: 20.1869, lng: -98.6653, name: "Mina de Acosta" },
  "poi-plaza": { lat: 20.1834, lng: -98.6641, name: "Plaza Principal" },
  "poi-cementerio": { lat: 20.1852, lng: -98.6620, name: "Panteon" },
  "poi-templo": { lat: 20.1838, lng: -98.6645, name: "Templo San Francisco" },
};

function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// ─────────────────────────────────────────────────────────────────────
//  ROUTE REGISTRATION
// ─────────────────────────────────────────────────────────────────────

export function registerGamificationRoutes(router: Router) {

  // ─────────────────────────────────────────────────────────────────
  //  LEGACY ENDPOINTS (backward compatible, wired to engine)
  // ─────────────────────────────────────────────────────────────────

  router.get("/v1/gamification/profile", requireRdmRole("user"), async (req: Request, res: Response, next) => {
    try {
      const identity = (req as any).rdmIdentity;
      const userId = identity?.subject !== "anonymous" ? identity.subject : undefined;
      const profile = await engine.getProfile(userId ?? "anonymous");
      res.status(200).json(apiSuccess(profile));
    } catch (err) { next(err); }
  });

  router.get("/v1/gamification/leaderboard", requireRdmRole("user"), async (req: Request, res: Response, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
      const leaderboard = await engine.getLeaderboard();
      const arr = Array.isArray(leaderboard) ? leaderboard : (leaderboard && typeof leaderboard === "object" && Array.isArray((leaderboard as any).data) ? (leaderboard as any).data : []);
      const total = arr.length;
      const offset = (page - 1) * limit;
      const paginated = arr.slice(offset, offset + limit);
      res.status(200).json(apiSuccess(paginated, { pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }));
    } catch (err) { next(err); }
  });

  router.get("/v1/gamification/quests", requireRdmRole("user"), async (req: Request, res: Response, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
      const quests = await engine.getQuests();
      const arr = Array.isArray(quests) ? quests : (quests && typeof quests === "object" && Array.isArray((quests as any).data) ? (quests as any).data : []);
      const total = arr.length;
      const offset = (page - 1) * limit;
      const paginated = arr.slice(offset, offset + limit);
      res.status(200).json(apiSuccess(paginated, { pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }));
    } catch (err) { next(err); }
  });

  router.post(
    "/v1/gamification/award-xp",
    requireRdmRole("user"),
    rateLimitByRoute({ name: "gamification-award-xp", limit: 20 }),
    async (req: Request, res: Response, next) => {
      try {
        const identity = (req as any).rdmIdentity;
        const userId = identity?.subject ?? "anonymous";
        const { amount = 0, reason = "manual", idempotencyKey = null } = req.body ?? {};
        const numAmount = Math.max(0, Math.min(Number(amount) || 0, 250));
        const signatureCheck = verifyGamificationSignature(req, userId, "AWARD_XP", { amount: numAmount, reason, idempotencyKey });
        if (!signatureCheck.ok) {
          auditSecurityEvent(req, "gamification.award_xp.rejected", { userId, reason: signatureCheck.error });
          res.status(401).json(apiError("INVALID_REWARD_SIGNATURE", signatureCheck.error));
          return;
        }
        auditSecurityEvent(req, "gamification.award_xp", { userId, amount: numAmount, reason });

        const result = await engine.processEvent(userId, {
          type: "AWARD_XP",
          payload: { amount: numAmount, reason, idempotencyKey },
          idempotencyKey: idempotencyKey ?? undefined,
        });
        res.status(200).json(apiSuccess(result));
      } catch (err) { next(err); }
    },
  );

  router.get("/v1/gamification/ranks", (_req: Request, res: Response) => {
    res.status(200).json(apiSuccess(RANK_THRESHOLDS));
  });

  // ─────────────────────────────────────────────────────────────────
  //  NEW: Event processing endpoint
  // ─────────────────────────────────────────────────────────────────

  router.post(
    "/v1/gamification/events",
    requireRdmRole("user"),
    rateLimitByRoute({ name: "gamification-events", limit: 30 }),
    async (req: Request, res: Response, next) => {
      try {
        const identity = (req as any).rdmIdentity;
        const userId = identity?.subject ?? "anonymous";
        const { eventType, payload = {} } = req.body ?? {};
        if (!eventType) {
          res.status(400).json(apiError("MISSING_EVENT_TYPE", "eventType is required"));
          return;
        }

        const signatureCheck = verifyGamificationSignature(req, userId, eventType, payload);
        if (!signatureCheck.ok) {
          auditSecurityEvent(req, "gamification.event.rejected", { userId, eventType, reason: signatureCheck.error });
          res.status(401).json(apiError("INVALID_REWARD_SIGNATURE", signatureCheck.error));
          return;
        }
        auditSecurityEvent(req, "gamification.event", { userId, eventType });

        const eventResult = await engine.processEvent(userId, { type: eventType, payload });
        res.status(200).json(apiSuccess(eventResult));
      } catch (err) { next(err); }
    },
  );

  // ─────────────────────────────────────────────────────────────────
  //  NEW: SSE live stream
  // ─────────────────────────────────────────────────────────────────

  router.get("/v1/gamification/live", requireRdmRole("user"), (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    res.write(`data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`);

    const onWorldState = (state: unknown) => {
      res.write(`event: world_state\ndata: ${JSON.stringify(state)}\n\n`);
    };
    const onLeaderboard = (lb: unknown) => {
      res.write(`event: leaderboard\ndata: ${JSON.stringify(lb)}\n\n`);
    };
    const onBroadcast = (evt: unknown) => {
      res.write(`event: broadcast\ndata: ${JSON.stringify(evt)}\n\n`);
    };

    gamificationBus.on("world_state", onWorldState);
    gamificationBus.on("leaderboard", onLeaderboard);
    gamificationBus.on("broadcast", onBroadcast);

    const heartbeat = setInterval(() => {
      res.write(`:heartbeat ${Date.now()}\n\n`);
    }, 30_000);

    req.on("close", () => {
      clearInterval(heartbeat);
      gamificationBus.off("world_state", onWorldState);
      gamificationBus.off("leaderboard", onLeaderboard);
      gamificationBus.off("broadcast", onBroadcast);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  //  NEW: GPS quest verification
  // ─────────────────────────────────────────────────────────────────

  router.post(
    "/v1/gamification/verify-poi",
    requireRdmRole("user"),
    rateLimitByRoute({ name: "gamification-verify-poi", limit: 15 }),
    async (req: Request, res: Response, next) => {
      try {
        const identity = (req as any).rdmIdentity;
        const userId = identity?.subject ?? "anonymous";
        const { poiId, lat, lng, accuracy } = req.body ?? {};
        if (!poiId || lat == null || lng == null) {
          res.status(400).json(apiError("MISSING_FIELDS", "poiId, lat, lng are required"));
          return;
        }

        const poi = MOCK_POI_COORDS[poiId];
        if (!poi) {
          res.status(404).json(apiError("NOT_FOUND", "POI not found"));
          return;
        }

        const distance = haversineMeters(
          { lat: Number(lat), lng: Number(lng) },
          { lat: poi.lat, lng: poi.lng },
        );
        const effectiveRadius = 100 + (accuracy ? Number(accuracy) : 0);
        const verified = distance <= effectiveRadius;

        auditSecurityEvent(req, "gamification.verify_poi", {
          userId, poiId, distance: Math.round(distance), verified,
        });

        let xpAwarded = 0;
        if (verified) {
          const result = await engine.processEvent(userId, {
            type: "poi_visit",
            poiId,
            payload: { poiId, distance: Math.round(distance), lat, lng },
          });
          xpAwarded = result.xpAwarded ?? 0;
        }

        res.status(200).json(apiSuccess({
          verified,
          poiName: poi.name,
          distanceMeters: Math.round(distance),
          xpAwarded,
        }));
      } catch (err) { next(err); }
    },
  );

  // ─────────────────────────────────────────────────────────────────
  //  NEW: Reward redemption
  // ─────────────────────────────────────────────────────────────────

  router.get("/v1/gamification/rewards", requireRdmRole("user"), (_req: Request, res: Response) => {
    res.status(200).json(apiSuccess(MOCK_REWARDS_CATALOG));
  });

  router.post(
    "/v1/gamification/redeem",
    requireRdmRole("user"),
    rateLimitByRoute({ name: "gamification-redeem", limit: 10 }),
    async (req: Request, res: Response, next) => {
      try {
        const identity = (req as any).rdmIdentity;
        const userId = identity?.subject ?? "anonymous";
        const { rewardId } = req.body ?? {};
        if (!rewardId) {
          res.status(400).json(apiError("MISSING_REWARD_ID", "rewardId is required"));
          return;
        }

        const reward = MOCK_REWARDS_CATALOG.find((r) => r.id === rewardId);
        if (!reward) {
          res.status(404).json(apiError("REWARD_NOT_FOUND", "Reward not found"));
          return;
        }

        const profile = await engine.getProfile(userId);
        const currentXp = profile.xp ?? 0;
        if (currentXp < reward.xpCost) {
          res.status(400).json(apiError("INSUFFICIENT_XP", `Need ${reward.xpCost} XP, have ${currentXp}`));
          return;
        }

        auditSecurityEvent(req, "gamification.redeem", { userId, rewardId, xpCost: reward.xpCost });

        await engine.processEvent(userId, {
          type: "REWARD_REDEEMED",
          payload: { rewardId, xpCost: reward.xpCost },
        });

        const updatedProfile = await engine.getProfile(userId);
        res.status(200).json(apiSuccess({
          reward: { id: reward.id, name: reward.name, type: reward.type, rarity: reward.rarity },
          newBalance: updatedProfile.xp ?? 0,
        }));
      } catch (err) { next(err); }
    },
  );

  // ─────────────────────────────────────────────────────────────────
  //  LIVING WORLD ENDPOINTS (ADR-001)
  // ─────────────────────────────────────────────────────────────────

  router.get("/v1/living-world/player/:id", requireRdmRole("user"), async (req: Request, res: Response, next) => {
    try {
      const userId = String(req.params.id);
      const profile = await engine.getProfile(userId);
      res.status(200).json(apiSuccess({
        ...profile,
        avatar: MOCK_AVATAR,
        collections: MOCK_COLLECTIONS,
      }));
    } catch (err) { next(err); }
  });

  router.get("/v1/living-world/player/:id/avatar", requireRdmRole("user"), (_req: Request, res: Response) => {
    res.status(200).json(apiSuccess(MOCK_AVATAR));
  });

  router.get("/v1/living-world/player/:id/collections", requireRdmRole("user"), (_req: Request, res: Response) => {
    res.status(200).json(apiSuccess(MOCK_COLLECTIONS));
  });

  router.get("/v1/living-world/player/:id/seasons/current", requireRdmRole("user"), (_req: Request, res: Response) => {
    res.status(200).json(apiSuccess(MOCK_CURRENT_SEASON));
  });

  router.get("/v1/living-world/world/state", requireRdmRole("user"), (_req: Request, res: Response) => {
    res.status(200).json(apiSuccess(MOCK_WORLD_STATE));
  });

  router.get("/v1/living-world/world/map-layer", requireRdmRole("user"), (_req: Request, res: Response) => {
    res.status(200).json(apiSuccess(MOCK_MAP_LAYER));
  });

  router.get("/v1/living-world/events/community-challenges", requireRdmRole("user"), (_req: Request, res: Response) => {
    res.status(200).json(apiSuccess(MOCK_COMMUNITY_CHALLENGES));
  });

  router.post(
    "/v1/living-world/player/action",
    requireRdmRole("user"),
    rateLimitByRoute({ name: "living-world-action", limit: 30 }),
    async (req: Request, res: Response, next) => {
      try {
        const { type = "UNKNOWN", territoryId = null, poiId = null, payload = {} } = req.body ?? {};
        const identity = (req as any).rdmIdentity;
        const userId = identity?.subject ?? "anonymous";

        const signatureCheck = verifyGamificationSignature(req, userId, type, { territoryId, poiId, ...payload });
        if (!signatureCheck.ok) {
          auditSecurityEvent(req, "living_world.player_action.rejected", { userId, type, reason: signatureCheck.error });
          res.status(401).json(apiError("INVALID_REWARD_SIGNATURE", signatureCheck.error));
          return;
        }
        auditSecurityEvent(req, "living_world.player_action", { userId, type, territoryId, poiId });

        const result = await engine.processEvent(userId, {
          type,
          territoryId: territoryId ?? undefined,
          poiId: poiId ?? undefined,
          payload: { territoryId, poiId, ...payload },
        });

        res.status(200).json(apiSuccess({
          eventId: `evt-${Date.now()}`,
          type,
          territoryId,
          poiId,
          xpAwarded: result.xpAwarded ?? 0,
          leveledUp: result.leveledUp ?? false,
          newRank: result.newRank ?? null,
          badgesEarned: [],
        }));
      } catch (err) { next(err); }
    },
  );
}
