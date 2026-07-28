/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// ────────────────────────────────────────────────────────────────────
//  Unified Gamification Engine — DB-backed, single source of truth
//  Replaces the in-memory engine with Supabase/PostgreSQL persistence
//  via Drizzle ORM. All formulas, ranks, and badges are canonical here.
// ────────────────────────────────────────────────────────────────────

import { EventEmitter } from "node:events";
import { getDb, isDbAvailable } from "../db-client";
import {
  players,
  playerCurrencies,
  playerEvents,
  playerProgressions,
  progressionBranches,
} from "../../db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

// ────────────────────────────────────────────────────────────────────
//  CONSTANTS — single source of truth for formulas
// ────────────────────────────────────────────────────────────────────

/** 30-level XP table. XP_LEVEL_TABLE[i] = cumulative XP to reach level i+1. */
export const XP_LEVEL_TABLE: readonly number[] = [
  0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200,
  6500, 8000, 10000, 12500, 15500, 19000, 23000, 27500, 32500, 38000,
  44000, 50500, 57500, 65000, 73000, 81500, 90500, 100000, 110000, 121000,
];

/** 6 rank tiers. Rank name shown to the player. */
export const RANK_THRESHOLDS: readonly {
  rank: string;
  minXp: number;
  icon: string;
}[] = [
  { rank: "Visitante", minXp: 0, icon: "\uD83D\uDD0D" },
  { rank: "Explorador", minXp: 100, icon: "\uD83D\uDDFA\uFE0F" },
  { rank: "Minero", minXp: 500, icon: "\u26CF\uFE0F" },
  { rank: "Cronista", minXp: 1500, icon: "\uD83D\uDCDC" },
  { rank: "Guardi\u00E1n", minXp: 4000, icon: "\uD83C\uDFF0" },
  { rank: "Leyenda RDM", minXp: 10000, icon: "\uD83D\uDC51" },
];

/** Base XP awarded per event type (before multipliers). */
const EVENT_XP: Record<string, number> = {
  page_visit: 10,
  poi_visit: 50,
  combo: 25,
  quest_complete: 100,
  community_action: 30,
  photo_capture: 25,
  radio_listen: 15,
  purchase: 20,
  streak_maintain: 10,
};

/** Maps each event type to its progression track. */
const TRACK_MAP: Record<string, "cultura" | "comunidad" | "juego"> = {
  page_visit: "cultura",
  poi_visit: "cultura",
  photo_capture: "cultura",
  radio_listen: "cultura",
  quest_complete: "comunidad",
  community_action: "comunidad",
  combo: "juego",
  purchase: "juego",
  streak_maintain: "juego",
};

// ────────────────────────────────────────────────────────────────────
//  TYPES
// ────────────────────────────────────────────────────────────────────

export interface GameEvent {
  type: string;
  payload?: Record<string, unknown>;
  territoryId?: string;
  poiId?: string;
  idempotencyKey?: string;
}

export interface EventResult {
  eventId: string;
  xpAwarded: number;
  track: string;
  newTotalXp: number;
  newLevel: number;
  leveledUp: boolean;
  newRank: string;
  rankChanged: boolean;
  streakBonus: number;
}

export interface PlayerState {
  id: string;
  externalId: string;
  displayName: string;
  xp: number;
  level: number;
  rank: string;
  streak: number;
  badges: string[];
  totalActions: number;
  createdAt: string;
  lastSeenAt: string;
}

export interface PlayerProfile extends PlayerState {
  xpByTrack: { cultura: number; comunidad: number; juego: number };
  nextLevelXp: number;
  xpProgress: number;
  progression: { branch: string; level: number; xp: number }[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  xp: number;
  level: number;
  rankName: string;
}

export interface QuestDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  xpReward: number;
  eventType: string;
  target: number;
  poiId?: string;
}

export interface QuestInstance extends QuestDefinition {
  progress: number;
  completed: boolean;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  criteria: string;
}

export interface StreakResult {
  current: number;
  longest: number;
  todayCompleted: boolean;
}

export interface BadgeEvaluation {
  earned: string[];
  newlyEarned: string[];
}

export interface EngineStats {
  totalPlayers: number;
  totalEvents: number;
  totalXpAwarded: number;
}

// ────────────────────────────────────────────────────────────────────
//  QUEST DEFINITIONS (at least 8)
// ────────────────────────────────────────────────────────────────────

export const CONST_QUESTS: readonly QuestDefinition[] = [
  {
    id: "visit_mina",
    title: "Visita la Mina de Acosta",
    description: "Descubre el coraz\u00F3n hist\u00F3rico de Real del Monte.",
    category: "exploraci\u00F3n",
    icon: "\u26CF\uFE0F",
    xpReward: 150,
    eventType: "poi_visit",
    target: 1,
  },
  {
    id: "eat_paste",
    title: "Prueba 3 pastes distintos",
    description: "La gastronom\u00EDa es patrimonio. Saborea la historia.",
    category: "gastronom\u00EDa",
    icon: "\uD83E\uDD5F",
    xpReward: 80,
    eventType: "combo",
    target: 3,
  },
  {
    id: "share_photo",
    title: "Comparte una foto del pueblo",
    description: "S\u00E9 embajador digital de Real del Monte.",
    category: "comunidad",
    icon: "\uD83D\uDCF8",
    xpReward: 50,
    eventType: "photo_capture",
    target: 1,
  },
  {
    id: "listen_tamv",
    title: "Escucha TAMV 92.5",
    description: "Sintoniza la voz del pueblo.",
    category: "cultura",
    icon: "\uD83C\uDFB5",
    xpReward: 60,
    eventType: "radio_listen",
    target: 1,
  },
  {
    id: "visit_5_pois",
    title: "Visita 5 puntos de inter\u00E9s",
    description: "Convi\u00E9rtete en un explorador de verdad.",
    category: "exploraci\u00F3n",
    icon: "\uD83D\uDDFA\uFE0F",
    xpReward: 200,
    eventType: "poi_visit",
    target: 5,
  },
  {
    id: "community_hero",
    title: "3 acciones comunitarias",
    description: "Contribuye al bienestar de Real del Monte.",
    category: "comunidad",
    icon: "\uD83E\uDD1D",
    xpReward: 120,
    eventType: "community_action",
    target: 3,
  },
  {
    id: "daily_streak_3",
    title: "Racha de 3 d\u00EDas",
    description: "Mant\u00E9n la actividad por 3 d\u00EDas consecutivos.",
    category: "dedicaci\u00F3n",
    icon: "\uD83D\uDD25",
    xpReward: 100,
    eventType: "streak_maintain",
    target: 3,
  },
  {
    id: "panteon_ingles",
    title: "Visita el Pante\u00F3n Ingl\u00E9s",
    description: "Honra la memoria de los mineros ingleses.",
    category: "historia",
    icon: "\uD83C\uDFDB\uFE0F",
    xpReward: 180,
    eventType: "poi_visit",
    target: 1,
    poiId: "panteon_ingles",
  },
  {
    id: "radio_7days",
    title: "Escucha TAMV 7 d\u00EDas seguidos",
    description: "La radio del pueblo siempre contigo.",
    category: "cultura",
    icon: "\uD83D\uDCFB",
    xpReward: 250,
    eventType: "radio_listen",
    target: 7,
  },
  {
    id: "culturalista_quest",
    title: "10 misiones culturales",
    description: "Demuestra tu amor por la cultura local.",
    category: "cultura",
    icon: "\uD83C\uDF93",
    xpReward: 300,
    eventType: "quest_complete",
    target: 10,
  },
];

// ────────────────────────────────────────────────────────────────────
//  BADGE DEFINITIONS (10 badges)
// ────────────────────────────────────────────────────────────────────

export const BADGE_DEFINITIONS: readonly BadgeDefinition[] = [
  { id: "apprentice_miner", name: "Aprendiz Minero", description: "Completa 1+ misiones de cultura", icon: "\u26CF\uFE0F", rarity: "common", criteria: "1+ quest completions in cultura" },
  { id: "street_explorer", name: "Explorador Callejero", description: "Visita 5+ puntos de inter\u00E9s", icon: "\uD83D\uDDFA\uFE0F", rarity: "common", criteria: "5+ POI visits" },
  { id: "paste_master", name: "Maestro del Paste", description: "Realiza 20+ combos de paste", icon: "\uD83E\uDD5F", rarity: "uncommon", criteria: "20+ paste combos" },
  { id: "community_heart", name: "Coraz\u00F3n Comunitario", description: "Realiza 3+ acciones comunitarias", icon: "\u2764\uFE0F", rarity: "uncommon", criteria: "3+ community actions" },
  { id: "legendary_miner", name: "Minero Legendario", description: "Alcanza nivel 10+ en cultura", icon: "\uD83D\uDC51", rarity: "rare", criteria: "Cultura level 10+" },
  { id: "territory_architect", name: "Arquitecto Territorial", description: "Alcanza nivel 30 en todas las ramas", icon: "\uD83C\uDFD7\uFE0F", rarity: "epic", criteria: "Level 30 in all tracks" },
  { id: "combo_master", name: "Maestro de Combos", description: "Alcanza un combo m\u00E1ximo de 15+", icon: "\uD83D\uDD25", rarity: "rare", criteria: "Max combo 15+" },
  { id: "culturalista", name: "Culturalista", description: "Completa 10+ misiones culturales", icon: "\uD83C\uDF93", rarity: "rare", criteria: "10+ cultural quests" },
  { id: "living_legend", name: "Leyenda Viva", description: "Completa todas las misiones de temporada", icon: "\uD83C\uDF1F", rarity: "legendary", criteria: "All season quests" },
  { id: "guardian_panteon", name: "Guardi\u00E1n del Pante\u00F3n", description: "Completa la misi\u00F3n del Pante\u00F3n Ingl\u00E9s", icon: "\uD83C\uDFDB\uFE0F", rarity: "epic", criteria: "panteon_ingles quest completed" },
];

// ────────────────────────────────────────────────────────────────────
//  SSE BUS — routes subscribe for live updates
// ────────────────────────────────────────────────────────────────────

export const gamificationBus = new EventEmitter();
gamificationBus.setMaxListeners(100);

// ────────────────────────────────────────────────────────────────────
//  HELPERS — pure functions, no side effects
// ────────────────────────────────────────────────────────────────────

function calculateLevel(xp: number): number {
  for (let i = XP_LEVEL_TABLE.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVEL_TABLE[i]) return i + 1;
  }
  return 1;
}

function calculateRank(xp: number): string {
  return [...RANK_THRESHOLDS].reverse().find((r) => xp >= r.minXp)?.rank ?? "Visitante";
}

function xpToNextLevel(currentLevel: number): number {
  if (currentLevel >= XP_LEVEL_TABLE.length) return Infinity;
  return XP_LEVEL_TABLE[currentLevel];
}

function getStreakBonus(streak: number): number {
  return Math.min(streak * 0.1, 0.5);
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ────────────────────────────────────────────────────────────────────
//  ENGINE INTERFACE
// ────────────────────────────────────────────────────────────────────

export interface UnifiedGamificationEngine {
  getOrCreatePlayer(userId: string, displayName?: string): Promise<PlayerState>;
  processEvent(userId: string, event: GameEvent): Promise<EventResult>;
  getProfile(userId: string): Promise<PlayerProfile>;
  getLeaderboard(track?: string, limit?: number): Promise<LeaderboardEntry[]>;
  getQuests(userId: string): Promise<QuestInstance[]>;
  checkStreak(userId: string): Promise<StreakResult>;
  evaluateBadges(userId: string): Promise<BadgeEvaluation>;
  getStats(): Promise<EngineStats>;
}

// ────────────────────────────────────────────────────────────────────
//  ENGINE FACTORY
// ────────────────────────────────────────────────────────────────────

function requireDb() {
  if (!isDbAvailable()) {
    throw new Error("Gamification engine requires DATABASE_URL to be set.");
  }
  return getDb();
}

export function createUnifiedGamificationEngine(): UnifiedGamificationEngine {
  // ── Internal helpers ────────────────────────────────────────

  async function ensurePlayer(userId: string, displayName?: string) {
    const db = requireDb();
    let [player] = await db
      .select()
      .from(players)
      .where(eq(players.externalId, userId))
      .limit(1);
    if (!player) {
      [player] = await db
        .insert(players)
        .values({
          externalId: userId,
          displayName: displayName ?? `Minero ${userId.slice(0, 8)}`,
        })
        .returning();
    }
    return player;
  }

  async function getPlayerXp(db: ReturnType<typeof getDb>, playerId: string): Promise<number> {
    const [row] = await db
      .select({ amount: playerCurrencies.amount })
      .from(playerCurrencies)
      .where(
        and(
          eq(playerCurrencies.playerId, playerId),
          eq(playerCurrencies.currencyType, "XP")
        )
      )
      .limit(1);
    return Number(row?.amount ?? 0);
  }

  async function computeStreakFromDb(
    db: ReturnType<typeof getDb>,
    playerId: string
  ): Promise<StreakResult> {
    const rows = await db
      .select({ createdAt: playerEvents.createdAt })
      .from(playerEvents)
      .where(eq(playerEvents.playerId, playerId))
      .orderBy(desc(playerEvents.createdAt))
      .limit(200);

    const days = new Set<string>();
    for (const r of rows) {
      days.add(formatDate(new Date(r.createdAt)));
    }

    const today = new Date();
    const todayStr = formatDate(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);
    const todayCompleted = days.has(todayStr);

    if (!days.has(todayStr) && !days.has(yesterdayStr)) {
      return { current: 0, longest: 0, todayCompleted };
    }

    let streak = 0;
    const cursor = days.has(todayStr) ? new Date(today) : new Date(yesterday);
    while (days.has(formatDate(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    return { current: streak, longest: streak, todayCompleted };
  }

  async function countEventsByType(
    db: ReturnType<typeof getDb>,
    playerId: string,
    type: string
  ): Promise<number> {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(playerEvents)
      .where(
        and(eq(playerEvents.playerId, playerId), eq(playerEvents.type, type))
      );
    return Number(row?.count ?? 0);
  }

  async function countAllEvents(
    db: ReturnType<typeof getDb>,
    playerId: string
  ): Promise<number> {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(playerEvents)
      .where(eq(playerEvents.playerId, playerId));
    return Number(row?.count ?? 0);
  }

  async function countPoiEvents(
    db: ReturnType<typeof getDb>,
    playerId: string,
    type: string,
    targetPoiId: string
  ): Promise<number> {
    const rows = await db
      .select({ payloadJson: playerEvents.payloadJson })
      .from(playerEvents)
      .where(
        and(
          eq(playerEvents.playerId, playerId),
          eq(playerEvents.type, type)
        )
      );
    return rows.filter(
      (r) => (r.payloadJson as Record<string, unknown>)?.poiId === targetPoiId
    ).length;
  }

  async function getTrackXp(
    db: ReturnType<typeof getDb>,
    playerId: string
  ): Promise<{ cultura: number; comunidad: number; juego: number }> {
    const rows = await db
      .select({
        type: playerCurrencies.currencyType,
        amount: playerCurrencies.amount,
      })
      .from(playerCurrencies)
      .where(eq(playerCurrencies.playerId, playerId));

    const find = (key: string) =>
      Number(rows.find((r) => r.type === key)?.amount ?? 0);
    return {
      cultura: find("XP_CULTURA"),
      comunidad: find("XP_COMUNIDAD"),
      juego: find("XP_JUEGO"),
    };
  }

  async function getProgression(
    db: ReturnType<typeof getDb>,
    playerId: string
  ): Promise<{ branch: string; level: number; xp: number }[]> {
    const rows = await db
      .select({
        key: progressionBranches.key,
        name: progressionBranches.name,
        level: playerProgressions.level,
        xpInBranch: playerProgressions.xpInBranch,
      })
      .from(playerProgressions)
      .innerJoin(
        progressionBranches,
        eq(playerProgressions.branchId, progressionBranches.id)
      )
      .where(eq(playerProgressions.playerId, playerId));

    if (rows.length === 0) {
      return [
        { branch: "EXPLORATION", level: 0, xp: 0 },
        { branch: "HISTORY", level: 0, xp: 0 },
        { branch: "PHOTO", level: 0, xp: 0 },
        { branch: "GASTRONOMY", level: 0, xp: 0 },
        { branch: "RADIO", level: 0, xp: 0 },
        { branch: "COMMUNITY", level: 0, xp: 0 },
      ];
    }

    return rows.map((r) => ({
      branch: r.key,
      level: r.level,
      xp: Number(r.xpInBranch),
    }));
  }

  async function evaluateBadgesInternal(
    db: ReturnType<typeof getDb>,
    playerId: string
  ): Promise<BadgeEvaluation> {
    const [
      questCompleteCount,
      poiVisitCount,
      comboRows,
      communityActionCount,
      trackXp,
      panteonVisits,
      streak,
    ] = await Promise.all([
      countEventsByType(db, playerId, "quest_complete"),
      countEventsByType(db, playerId, "poi_visit"),
      db
        .select({ payloadJson: playerEvents.payloadJson })
        .from(playerEvents)
        .where(
          and(
            eq(playerEvents.playerId, playerId),
            eq(playerEvents.type, "combo")
          )
        ),
      countEventsByType(db, playerId, "community_action"),
      getTrackXp(db, playerId),
      countPoiEvents(db, playerId, "poi_visit", "panteon_ingles"),
      computeStreakFromDb(db, playerId),
    ]);

    const earned: string[] = [];

    // 1. apprentice_miner: 1+ quest completions in cultura
    if (questCompleteCount >= 1) earned.push("apprentice_miner");

    // 2. street_explorer: 5+ POI visits
    if (poiVisitCount >= 5) earned.push("street_explorer");

    // 3. paste_master: 20+ paste combos
    const pasteCombos = comboRows.filter((r) => {
      const p = (r.payloadJson ?? {}) as Record<string, unknown>;
      return p.item === "paste" || p.type === "paste";
    }).length;
    if (pasteCombos >= 20) earned.push("paste_master");

    // 4. community_heart: 3+ community actions
    if (communityActionCount >= 3) earned.push("community_heart");

    // 5. legendary_miner: cultura level 10+
    if (calculateLevel(trackXp.cultura) >= 10) earned.push("legendary_miner");

    // 6. territory_architect: level 30 in all tracks
    if (
      [trackXp.cultura, trackXp.comunidad, trackXp.juego].every(
        (x) => calculateLevel(x) >= 30
      )
    ) {
      earned.push("territory_architect");
    }

    // 7. combo_master: max combo 15+
    const maxCombo = comboRows.reduce(
      (mx, r) =>
        Math.max(mx, Number((r.payloadJson as Record<string, unknown>)?.comboLevel ?? 0)),
      0
    );
    if (maxCombo >= 15) earned.push("combo_master");

    // 8. culturalista: 10+ cultural quests
    if (questCompleteCount >= 10) earned.push("culturalista");

    // 10. guardian_panteon: panteon_ingles quest completed
    if (panteonVisits >= 1) earned.push("guardian_panteon");

    // 9. living_legend: all season quests completed
    const questProgress = await Promise.all(
      CONST_QUESTS.map(async (def) => {
        if (def.eventType === "streak_maintain") return streak.current;
        if (def.poiId) return countPoiEvents(db, playerId, def.eventType, def.poiId);
        return countEventsByType(db, playerId, def.eventType);
      })
    );
    if (CONST_QUESTS.every((def, i) => questProgress[i] >= def.target)) {
      earned.push("living_legend");
    }

    return { earned, newlyEarned: earned };
  }

  // ── Public engine methods ───────────────────────────────────

  return {
    // ─── getOrCreatePlayer ─────────────────────────────────────
    async getOrCreatePlayer(userId, displayName) {
      const db = requireDb();
      const player = await ensurePlayer(userId, displayName);

      const [xp, streak, totalActions, badgeEval] = await Promise.all([
        getPlayerXp(db, player.id),
        computeStreakFromDb(db, player.id),
        countAllEvents(db, player.id),
        evaluateBadgesInternal(db, player.id),
      ]);

      return {
        id: player.id,
        externalId: player.externalId,
        displayName: player.displayName,
        xp,
        level: calculateLevel(xp),
        rank: calculateRank(xp),
        streak: streak.current,
        badges: badgeEval.earned,
        totalActions,
        createdAt: player.createdAt?.toISOString() ?? new Date().toISOString(),
        lastSeenAt: player.lastSeenAt?.toISOString() ?? new Date().toISOString(),
      };
    },

    // ─── processEvent ──────────────────────────────────────────
    async processEvent(userId, event) {
      const db = requireDb();
      const player = await ensurePlayer(userId);

      // Idempotency guard
      if (event.idempotencyKey) {
        const [existing] = await db
          .select({ id: playerEvents.id })
          .from(playerEvents)
          .where(
            and(
              eq(playerEvents.playerId, player.id),
              sql`${playerEvents.payloadJson}->>'idempotencyKey' = ${event.idempotencyKey}`
            )
          )
          .limit(1);
        if (existing) {
          const xp = await getPlayerXp(db, player.id);
          return {
            eventId: existing.id,
            xpAwarded: 0,
            track: TRACK_MAP[event.type] ?? "cultura",
            newTotalXp: xp,
            newLevel: calculateLevel(xp),
            leveledUp: false,
            newRank: calculateRank(xp),
            rankChanged: false,
            streakBonus: 0,
          };
        }
      }

      // Streak bonus
      const streak = await computeStreakFromDb(db, player.id);
      const bonus = getStreakBonus(streak.current);

      // Track & XP calculation
      const track = TRACK_MAP[event.type] ?? "cultura";
      const baseXp = EVENT_XP[event.type] ?? 10;
      const multiplier =
        event.type === "poi_visit" && event.payload?.cultural ? 1.5 : 1.0;
      const xpAwarded = Math.round(baseXp * multiplier * (1 + bonus));

      const oldXp = await getPlayerXp(db, player.id);

      // Atomic: event insert + currency upsert + player update
      await db.transaction(async (tx) => {
        await tx.insert(playerEvents).values({
          playerId: player.id,
          type: event.type,
          territoryId: event.territoryId ?? undefined,
          poiId: event.poiId ?? undefined,
          payloadJson: {
            ...event.payload,
            idempotencyKey: event.idempotencyKey,
          },
        });

        // Total XP (ON CONFLICT → atomic increment)
        await tx
          .insert(playerCurrencies)
          .values({
            playerId: player.id,
            currencyType: "XP",
            amount: xpAwarded,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [playerCurrencies.playerId, playerCurrencies.currencyType],
            set: {
              amount: sql`${playerCurrencies.amount} + ${xpAwarded}`,
              updatedAt: new Date(),
            },
          });

        // Track-specific XP
        const trackCurrency = `XP_${track.toUpperCase()}`;
        await tx
          .insert(playerCurrencies)
          .values({
            playerId: player.id,
            currencyType: trackCurrency,
            amount: xpAwarded,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [playerCurrencies.playerId, playerCurrencies.currencyType],
            set: {
              amount: sql`${playerCurrencies.amount} + ${xpAwarded}`,
              updatedAt: new Date(),
            },
          });

        // Touch lastSeenAt
        await tx
          .update(players)
          .set({ lastSeenAt: new Date() })
          .where(eq(players.id, player.id));
      });

      // Compute derived state
      const newTotalXp = oldXp + xpAwarded;
      const newLevel = calculateLevel(newTotalXp);
      const oldLevel = calculateLevel(oldXp);
      const leveledUp = newLevel > oldLevel;
      const newRank = calculateRank(newTotalXp);
      const oldRank = calculateRank(oldXp);
      const rankChanged = newRank !== oldRank;

      const result: EventResult = {
        eventId: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        xpAwarded,
        track,
        newTotalXp,
        newLevel,
        leveledUp,
        newRank,
        rankChanged,
        streakBonus: bonus,
      };

      // SSE emissions
      gamificationBus.emit("player:event", { userId, ...event, ...result });
      if (leveledUp)
        gamificationBus.emit("player:levelup", {
          userId,
          newLevel,
          oldLevel,
        });
      if (rankChanged)
        gamificationBus.emit("player:rankup", { userId, newRank, oldRank });

      // Badge evaluation (after event is persisted)
      const badgeEval = await evaluateBadgesInternal(db, player.id);
      if (badgeEval.newlyEarned.length > 0) {
        gamificationBus.emit("player:badge", {
          userId,
          badges: badgeEval.newlyEarned,
        });
      }

      return result;
    },

    // ─── getProfile ────────────────────────────────────────────
    async getProfile(userId) {
      const db = requireDb();
      const player = await ensurePlayer(userId);

      const [xp, trackXp, streak, totalActions, badgeEval, progression] =
        await Promise.all([
          getPlayerXp(db, player.id),
          getTrackXp(db, player.id),
          computeStreakFromDb(db, player.id),
          countAllEvents(db, player.id),
          evaluateBadgesInternal(db, player.id),
          getProgression(db, player.id),
        ]);

      const level = calculateLevel(xp);
      const currentThreshold = XP_LEVEL_TABLE[level - 1] ?? 0;
      const nextThreshold = xpToNextLevel(level);
      const span = nextThreshold - currentThreshold;

      return {
        id: player.id,
        externalId: player.externalId,
        displayName: player.displayName,
        xp,
        level,
        rank: calculateRank(xp),
        streak: streak.current,
        badges: badgeEval.earned,
        totalActions,
        createdAt: player.createdAt?.toISOString() ?? new Date().toISOString(),
        lastSeenAt: player.lastSeenAt?.toISOString() ?? new Date().toISOString(),
        xpByTrack: trackXp,
        nextLevelXp: nextThreshold === Infinity ? xp : nextThreshold,
        xpProgress:
          span > 0 && nextThreshold !== Infinity
            ? Math.round(((xp - currentThreshold) / span) * 100)
            : 100,
        progression,
      };
    },

    // ─── getLeaderboard ────────────────────────────────────────
    async getLeaderboard(track, limit = 50) {
      const db = requireDb();
      const maxLimit = Math.min(Math.max(limit, 1), 100);

      if (track) {
        const currencyType = `XP_${track.toUpperCase()}`;
        const rows = await db
          .select({
            userId: players.externalId,
            displayName: players.displayName,
            xp: sql<number>`COALESCE(SUM(${playerCurrencies.amount}), 0)`,
          })
          .from(players)
          .innerJoin(playerCurrencies, eq(players.id, playerCurrencies.playerId))
          .where(eq(playerCurrencies.currencyType, currencyType))
          .groupBy(
            players.id,
            players.externalId,
            players.displayName
          )
          .orderBy(
            desc(sql`COALESCE(SUM(${playerCurrencies.amount}), 0)`)
          )
          .limit(maxLimit);

        return rows.map((r, i) => {
          const xp = Number(r.xp);
          return {
            rank: i + 1,
            userId: r.userId,
            displayName: r.displayName,
            xp,
            level: calculateLevel(xp),
            rankName: calculateRank(xp),
          };
        });
      }

      // Global leaderboard (total XP)
      const rows = await db
        .select({
          userId: players.externalId,
          displayName: players.displayName,
          xp: sql<number>`COALESCE(SUM(${playerCurrencies.amount}), 0)`,
        })
        .from(players)
        .innerJoin(playerCurrencies, eq(players.id, playerCurrencies.playerId))
        .where(eq(playerCurrencies.currencyType, "XP"))
        .groupBy(
          players.id,
          players.externalId,
          players.displayName
        )
        .orderBy(desc(sql`COALESCE(SUM(${playerCurrencies.amount}), 0)`))
        .limit(maxLimit);

      return rows.map((r, i) => {
        const xp = Number(r.xp);
        return {
          rank: i + 1,
          userId: r.userId,
          displayName: r.displayName,
          xp,
          level: calculateLevel(xp),
          rankName: calculateRank(xp),
        };
      });
    },

    // ─── getQuests ─────────────────────────────────────────────
    async getQuests(userId) {
      const db = requireDb();
      const player = await ensurePlayer(userId);
      const streak = await computeStreakFromDb(db, player.id);

      const quests = await Promise.all(
        CONST_QUESTS.map(async (def) => {
          let progress = 0;

          if (def.eventType === "streak_maintain") {
            progress = streak.current;
          } else if (def.poiId) {
            progress = await countPoiEvents(
              db,
              player.id,
              def.eventType,
              def.poiId
            );
          } else {
            progress = await countEventsByType(
              db,
              player.id,
              def.eventType
            );
          }

          return {
            ...def,
            progress: Math.min(progress, def.target),
            completed: progress >= def.target,
          };
        })
      );

      return quests;
    },

    // ─── checkStreak ───────────────────────────────────────────
    async checkStreak(userId) {
      const db = requireDb();
      const player = await ensurePlayer(userId);
      return computeStreakFromDb(db, player.id);
    },

    // ─── evaluateBadges ────────────────────────────────────────
    async evaluateBadges(userId) {
      const db = requireDb();
      const player = await ensurePlayer(userId);
      return evaluateBadgesInternal(db, player.id);
    },

    // ─── getStats ──────────────────────────────────────────────
    async getStats() {
      const db = requireDb();

      const [playerCount, eventCount, xpSum] = await Promise.all([
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(players),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(playerEvents),
        db
          .select({
            total: sql<number>`COALESCE(SUM(${playerCurrencies.amount}), 0)`,
          })
          .from(playerCurrencies)
          .where(eq(playerCurrencies.currencyType, "XP")),
      ]);

      return {
        totalPlayers: Number(playerCount[0]?.count ?? 0),
        totalEvents: Number(eventCount[0]?.count ?? 0),
        totalXpAwarded: Number(xpSum[0]?.total ?? 0),
      };
    },
  };
}
