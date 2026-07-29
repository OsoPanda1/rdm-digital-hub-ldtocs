/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// artifacts/api-server/src/routes/narrative.ts
// RDM Living World â€” Narrative API routes (Realito & Isabella)
// ADR-001: docs/adr/001-rdm-living-world-gamification.md
// Endpoints: /api/v1/narrative/*

import type { Router, Request, Response } from "express";
import { validate, schemas } from "../middlewares/validate";
import { requireRdmRole, rateLimitByRoute } from "../lib/security";
import {
  generateNarrative,
  generateFeed,
  suggestActions,
  type PlayerContext,
} from "../services/narrator";
import { getDb, isDbAvailable } from "../lib/db-client";
import { players, playerEvents, playerCurrencies } from "../db/schema";
import { eq, desc, sql } from "drizzle-orm";

async function buildPlayerContext(playerId: string): Promise<PlayerContext> {
  if (!isDbAvailable()) {
    return {
      playerId,
      displayName: "Edwin Castillo",
      level: 18,
      territoriesVisited: 12,
      collectionsCompleted: 2,
      currentSeasonId: "season-mining-colonial",
      lastEvent: "DISCOVER_POI",
      streak: 5,
      energy: 80,
    };
  }

  try {
    const db = getDb();
    const [player] = await db.select().from(players).where(eq(players.externalId, playerId)).limit(1);

    if (!player) {
      return {
        playerId,
        displayName: playerId,
        level: 1,
        territoriesVisited: 0,
        collectionsCompleted: 0,
        currentSeasonId: "season-mining-colonial",
        lastEvent: "UNKNOWN",
        streak: 0,
        energy: 100,
      };
    }

    const [xpRow] = await db.select({ amount: playerCurrencies.amount })
      .from(playerCurrencies)
      .where(eq(playerCurrencies.playerId, player.id))
      .where(eq(playerCurrencies.currencyType, "XP"))
      .limit(1);

    const xp = Number(xpRow?.amount ?? 0);
    const level = Math.floor(xp / 100) + 1;

    const [lastEvent] = await db.select({ type: playerEvents.type })
      .from(playerEvents)
      .where(eq(playerEvents.playerId, player.id))
      .orderBy(desc(playerEvents.createdAt))
      .limit(1);

    const eventCount = await db.select({ count: sql<number>`count(*)`.as("count") })
      .from(playerEvents)
      .where(eq(playerEvents.playerId, player.id));

    return {
      playerId: player.externalId,
      displayName: player.displayName,
      level,
      territoriesVisited: Math.min(Number(eventCount[0]?.count ?? 0), 50),
      collectionsCompleted: 0,
      currentSeasonId: "season-mining-colonial",
      lastEvent: lastEvent?.type ?? "UNKNOWN",
      streak: 0,
      energy: 80,
    };
  } catch {
    return {
      playerId,
      displayName: playerId,
      level: 1,
      territoriesVisited: 0,
      collectionsCompleted: 0,
      currentSeasonId: "season-mining-colonial",
      lastEvent: "UNKNOWN",
      streak: 0,
      energy: 100,
    };
  }
}

export function registerNarrativeRoutes(router: Router) {
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  POST /api/v1/narrative/feed
  //  Body: { playerId, limit? }
  //  Returns contextual feed of narrative messages for a player.
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  router.post("/v1/narrative/feed", requireRdmRole("user"), rateLimitByRoute({ name: "narrative-feed", limit: 30 }), validate(schemas.narrativeFeed), async (req: Request, res: Response, next) => {
    try {
      const { playerId = "anonymous", limit = 5 } = req.body ?? {};

      if (!playerId || typeof playerId !== "string") {
        res.status(400).json({ ok: false, error: "playerId is required" });
        return;
      }

      const context = await buildPlayerContext(playerId);
      const messages = generateFeed({ context, limit: Math.min(limit, 20) });

      res.status(200).json({
      ok: true,
      data: {
        playerId,
        messages,
        characterProfiles: {
          realito: {
            name: "Realito",
            role: "Guía territorial y narrador del pueblo",
            personality: "Curioso, alegre, sabio de la sierra",
          },
          isabella: {
            name: "Isabella",
            role: "Experta en patrimonio y turismo sostenible",
            personality: "Profesional, empática, orientada a datos",
          },
        },
      },
    });
    } catch (err) { next(err); }
  });

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  POST /api/v1/narrative/trigger
  //  Body: { playerId, actionType, poiName?, eventName?, itemId? }
  //  Returns a single narrative message triggered by a player action.
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  router.post("/v1/narrative/trigger", requireRdmRole("user"), rateLimitByRoute({ name: "narrative-trigger", limit: 60 }), validate(schemas.narrativeTrigger), async (req: Request, res: Response, next) => {
    try {
      const {
        playerId = "anonymous",
        actionType = "UNKNOWN",
        poiName,
        eventName,
        itemId,
      } = req.body ?? {};

      if (!playerId || typeof playerId !== "string") {
        res.status(400).json({ ok: false, error: "playerId is required" });
        return;
      }

      if (!actionType || typeof actionType !== "string") {
        res.status(400).json({ ok: false, error: "actionType is required" });
        return;
      }

      const validActions = [
        "DISCOVER_POI",
        "CAPTURE_PHOTO",
        "LISTEN_RADIO",
        "ATTEND_EVENT",
        "COMPLETE_QUEST",
        "SHARE_STORY",
        "COLLECT_ITEM",
        "CHALLENGE_COMPLETE",
        "SEASON_START",
        "LOW_ENERGY",
      ];

      if (!validActions.includes(actionType)) {
        res.status(400).json({
          ok: false,
          error: `Invalid actionType. Valid types: ${validActions.join(", ")}`,
        });
        return;
      }

      const context = await buildPlayerContext(playerId);
      const message = generateNarrative({
        actionType,
        context,
        poiName,
        eventName,
        itemId,
      });

      res.status(200).json({
        ok: true,
        data: message,
      });
    } catch (err) { next(err); }
  });

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  POST /api/v1/narrative/suggest
  //  Body: { playerId }
  //  Returns suggested next actions for a player.
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  router.post("/v1/narrative/suggest", requireRdmRole("user"), rateLimitByRoute({ name: "narrative-suggest", limit: 20 }), validate(schemas.narrativeSuggest), async (req: Request, res: Response, next) => {
    try {
      const { playerId = "anonymous" } = req.body ?? {};

      if (!playerId || typeof playerId !== "string") {
        res.status(400).json({ ok: false, error: "playerId is required" });
        return;
      }

      const context = await buildPlayerContext(playerId);
      const suggestions = suggestActions({ context });

      res.status(200).json({
        ok: true,
        data: {
          playerId,
          suggestions,
        },
      });
    } catch (err) { next(err); }
  });

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //  GET /api/v1/narrative/characters
  //  Returns available character profiles.
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  router.get("/v1/narrative/characters", requireRdmRole("user"), (_req: Request, res: Response) => {
    res.status(200).json({
      ok: true,
      data: [
        {
          key: "realito",
          name: "Realito",
          role: "Guía territorial y narrador del pueblo",
          personality: "Curioso, alegre, sabio de la sierra",
          catchphrases: [
            "¡Bienvenido a mi pueblo!",
            "Las montañas tienen mucho que contarte.",
            "Cada piedra aquí tiene historia.",
            "Real del Monte es más que un lugar, es un sentimiento.",
          ],
        },
        {
          key: "isabella",
          name: "Isabella",
          role: "Experta en patrimonio y turismo sostenible",
          personality: "Profesional, empática, orientada a datos pero cálida",
          catchphrases: [
            "Tu exploración fortalece la memoria colectiva.",
            "Cada interacción es un dato para preservar el patrimonio.",
            "El turismo sostenible comienza contigo.",
            "La tecnología al servicio de la cultura.",
          ],
        },
      ],
    });
  });
}
