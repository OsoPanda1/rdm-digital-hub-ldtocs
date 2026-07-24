// artifacts/api-server/src/routes/narrative.ts
// RDM Living World — Narrative API routes (Realito & Isabella)
// ADR-001: docs/adr/001-rdm-living-world-gamification.md
// Endpoints: /api/v1/narrative/*

import type { Router, Request, Response } from "express";
import {
  generateNarrative,
  generateFeed,
  suggestActions,
  type PlayerContext,
} from "../services/narrator";

function buildMockContext(playerId: string): PlayerContext {
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

export function registerNarrativeRoutes(router: Router) {
  // ───────────────────────────────────────────────────────────────────────────
  //  POST /api/v1/narrative/feed
  //  Body: { playerId, limit? }
  //  Returns contextual feed of narrative messages for a player.
  // ───────────────────────────────────────────────────────────────────────────
  router.post("/v1/narrative/feed", (req: Request, res: Response) => {
    const { playerId = "anonymous", limit = 5 } = req.body ?? {};

    if (!playerId || typeof playerId !== "string") {
      res.status(400).json({ ok: false, error: "playerId is required" });
      return;
    }

    const context = buildMockContext(playerId);
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
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  POST /api/v1/narrative/trigger
  //  Body: { playerId, actionType, poiName?, eventName?, itemId? }
  //  Returns a single narrative message triggered by a player action.
  // ───────────────────────────────────────────────────────────────────────────
  router.post("/v1/narrative/trigger", (req: Request, res: Response) => {
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

    const context = buildMockContext(playerId);
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
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  POST /api/v1/narrative/suggest
  //  Body: { playerId }
  //  Returns suggested next actions for a player.
  // ───────────────────────────────────────────────────────────────────────────
  router.post("/v1/narrative/suggest", (req: Request, res: Response) => {
    const { playerId = "anonymous" } = req.body ?? {};

    if (!playerId || typeof playerId !== "string") {
      res.status(400).json({ ok: false, error: "playerId is required" });
      return;
    }

    const context = buildMockContext(playerId);
    const suggestions = suggestActions({ context });

    res.status(200).json({
      ok: true,
      data: {
        playerId,
        suggestions,
      },
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  GET /api/v1/narrative/characters
  //  Returns available character profiles.
  // ───────────────────────────────────────────────────────────────────────────
  router.get("/v1/narrative/characters", (_req: Request, res: Response) => {
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
