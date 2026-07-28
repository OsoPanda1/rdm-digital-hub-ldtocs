/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
/**
 * Gamification LTOS Engine — Pure Calculation Functions
 * Real del Monte Digital Hub
 *
 * Client-side helpers for level/XP/badge/quest evaluation.
 * All server-authoritative logic lives in the backend.
 */

import type {
  GamificationPlayer,
  GamificationBadge,
  XpTrack,
  QuestCriteria,
  GamificationEvent,
} from './types';

// ============================================================================
// XP LEVEL TABLE (must match backend)
// ============================================================================

const XP_LEVEL_TABLE: number[] = [
  0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200,
  6500, 8000, 10000, 12500, 15500, 19000, 23000, 27500, 32500, 38000,
  44000, 50500, 57500, 65000, 73000, 81500, 90500, 100000, 110000, 121000,
];

/**
 * Calculates the level for a given XP amount.
 */
export function calculateLevel(totalXp: number): number {
  for (let i = XP_LEVEL_TABLE.length - 1; i >= 0; i--) {
    if (totalXp >= XP_LEVEL_TABLE[i]) return i + 1;
  }
  return 1;
}

/**
 * Returns XP needed for the next level.
 */
export function xpForNextLevel(currentLevel: number): number {
  if (currentLevel >= XP_LEVEL_TABLE.length) return Infinity;
  return XP_LEVEL_TABLE[currentLevel];
}

/**
 * Returns XP progress within current level (0-1).
 */
export function levelProgress(totalXp: number): number {
  const level = calculateLevel(totalXp);
  const currentLevelXp = XP_LEVEL_TABLE[level - 1] ?? 0;
  const nextLevelXp = XP_LEVEL_TABLE[level] ?? currentLevelXp + 1000;
  return (totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp);
}

// ============================================================================
// RANK THRESHOLDS (must match backend)
// ============================================================================

const RANK_THRESHOLDS: { rank: string; label: string; minXp: number }[] = [
  { rank: 'visitante', label: 'Visitante', minXp: 0 },
  { rank: 'explorador', label: 'Explorador', minXp: 100 },
  { rank: 'minero', label: 'Minero', minXp: 500 },
  { rank: 'cronista', label: 'Cronista', minXp: 1500 },
  { rank: 'guardian', label: 'Guardian', minXp: 4000 },
  { rank: 'leyenda_rdm', label: 'Leyenda RDM', minXp: 10000 },
];

/**
 * Returns the current rank label based on total XP.
 */
export function getRankForXp(totalXp: number): string {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= RANK_THRESHOLDS[i].minXp) return RANK_THRESHOLDS[i].label;
  }
  return RANK_THRESHOLDS[0].label;
}

/**
 * Returns the rank config for the given total XP.
 */
export function getRankConfig(totalXp: number): { rank: string; label: string; minXp: number } {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= RANK_THRESHOLDS[i].minXp) return RANK_THRESHOLDS[i];
  }
  return RANK_THRESHOLDS[0];
}

// ============================================================================
// XP CALCULATION (client-side estimates for UI feedback)
// ============================================================================

interface XpCalculation {
  xp: number;
  track: XpTrack;
  multiplier: number;
}

/**
 * Estimates XP for a game event based on type and payload.
 * The authoritative XP calculation happens on the server.
 */
export function calculateEventXp(
  eventType: string,
  payload: Record<string, unknown>,
  seasonMultiplier: number = 1,
): XpCalculation {
  const baseXp = getBaseXp(eventType, payload);
  const multiplier = seasonMultiplier;

  return {
    xp: Math.round(baseXp * multiplier),
    track: inferTrack(eventType, payload),
    multiplier,
  };
}

function getBaseXp(eventType: string, payload: Record<string, unknown>): number {
  switch (eventType) {
    case 'combo': {
      const combo = (payload.combo_size as number) ?? 0;
      const pieceTypes = (payload.piece_types as string[]) ?? [];
      const culturalBonus = pieceTypes.some(t =>
        ['capillas', 'calles', 'personajes', 'minas', 'pastes'].includes(t),
      ) ? 1.5 : 1;
      return Math.round(combo * 5 * culturalBonus);
    }
    case 'score': {
      const score = (payload.score as number) ?? 0;
      return Math.round(score / 1000);
    }
    case 'quest_complete':
      return (payload.xp_reward as number) ?? 100;
    case 'page_visit':
      return 10;
    case 'community_action':
      return (payload.xp_reward as number) ?? 50;
    case 'level_up':
      return 25;
    case 'badge_earned':
      return (payload.xp_bonus as number) ?? 50;
    case 'poi_visit':
      return (payload.xp_reward as number) ?? 50;
    case 'photo_capture':
      return (payload.xp_reward as number) ?? 20;
    case 'radio_listen':
      return (payload.xp_reward as number) ?? 15;
    case 'purchase':
      return (payload.xp_reward as number) ?? 75;
    case 'streak_maintain':
      return (payload.xp_reward as number) ?? 30;
    default:
      return 5;
  }
}

function inferTrack(eventType: string, payload: Record<string, unknown>): XpTrack {
  if (payload.xp_track && ['cultura', 'comunidad', 'juego'].includes(payload.xp_track as string)) {
    return payload.xp_track as XpTrack;
  }

  if (eventType === 'community_action') return 'comunidad';
  if (eventType === 'page_visit') return 'cultura';

  const pieceTypes = (payload.piece_types as string[]) ?? [];
  if (pieceTypes.some(t => ['capillas', 'calles', 'personajes', 'minas'].includes(t))) {
    return 'cultura';
  }

  return 'juego';
}

// ============================================================================
// QUEST EVALUATION
// ============================================================================

/**
 * Evaluates whether quest criteria is met by an event.
 */
export function evaluateQuestCriteria(
  criteria: QuestCriteria,
  event: GamificationEvent,
  player: GamificationPlayer,
  questHistory: { event_type: string; payload_json: Record<string, unknown> }[],
): { met: boolean; progress: { current: number; target: number } } {
  switch (criteria.type) {
    case 'combo': {
      const minCombo = (criteria.min_combo as number) ?? 10;
      const pieceTypes = (criteria.piece_types as string[]) ?? [];
      const comboSize = (event.payload_json.combo_size as number) ?? 0;
      const eventPieces = (event.payload_json.piece_types as string[]) ?? [];
      const hasMatchingPieces = pieceTypes.length === 0 || pieceTypes.some(p => eventPieces.includes(p));
      const current = hasMatchingPieces ? comboSize : 0;
      return { met: current >= minCombo, progress: { current, target: minCombo } };
    }
    case 'score': {
      const minScore = (criteria.min_score as number) ?? 50000;
      const score = (event.payload_json.score as number) ?? 0;
      return { met: score >= minScore, progress: { current: score, target: minScore } };
    }
    case 'quest_complete': {
      const minQuests = (criteria['min quests'] as number) ?? 1;
      const completed = player.quests_completed;
      return { met: completed >= minQuests, progress: { current: completed, target: minQuests } };
    }
    case 'visit_pages': {
      const requiredPages = (criteria.pages as string[]) ?? [];
      const minVisits = (criteria.min_visits as number) ?? 1;
      const visitedPages = new Set(
        questHistory
          .filter(h => h.event_type === 'page_visit')
          .map(h => h.payload_json.page as string),
      );
      const matched = requiredPages.filter(p => visitedPages.has(p));
      return {
        met: matched.length >= minVisits,
        progress: { current: matched.length, target: requiredPages.length },
      };
    }
    case 'chain': {
      const steps = (criteria.steps as { game?: string; hub?: string; min: number }[]) ?? [];
      const completedSteps = steps.filter(step => {
        if (step.game) {
          return questHistory.some(h => h.event_type === step.game);
        }
        if (step.hub) {
          return questHistory.some(h => h.event_type === step.hub);
        }
        return false;
      });
      return {
        met: completedSteps.length >= steps.length,
        progress: { current: completedSteps.length, target: steps.length },
      };
    }
    case 'all_season_quests': {
      return { met: false, progress: { current: 0, target: 1 } };
    }
    case 'community_action': {
      const action = (criteria.action as string) ?? '';
      const minCount = (criteria.min_count as number) ?? 1;
      const actionCount = questHistory.filter(
        h => h.event_type === 'community_action' && h.payload_json.action === action,
      ).length;
      return {
        met: actionCount >= minCount,
        progress: { current: actionCount, target: minCount },
      };
    }
    default:
      return { met: false, progress: { current: 0, target: 1 } };
  }
}

// ============================================================================
// BADGE EVALUATION
// ============================================================================

/**
 * Checks if a player qualifies for a badge based on their stats.
 */
export function evaluateBadgeCriteria(
  badge: GamificationBadge,
  player: GamificationPlayer,
  playerBadges: string[],
): boolean {
  if (playerBadges.includes(badge.code)) return false;

  const criteria = badge.criteria_json;

  if (criteria.quests_completed_min) {
    if (player.quests_completed < (criteria.quests_completed_min as number)) return false;
  }
  if (criteria.track && criteria.level_min) {
    const trackXp = criteria.track === 'cultura' ? player.xp_cultura
      : criteria.track === 'comunidad' ? player.xp_comunidad
      : player.xp_juego;
    if (trackXp < (criteria.level_min as number) * 1000) return false;
  }
  if (criteria.level_cultura_min) {
    if (player.xp_cultura < (criteria.level_cultura_min as number) * 1000) return false;
  }
  if (criteria.combos_pastes_min) {
    if (player.combos_total < (criteria.combos_pastes_min as number)) return false;
  }
  if (criteria.max_combo_min) {
    if (player.combos_total < (criteria.max_combo_min as number)) return false;
  }
  if (criteria.community_actions_min) {
    if (player.quests_completed < (criteria.community_actions_min as number)) return false;
  }
  if (criteria.all_tracks_max) {
    if (player.level < 30) return false;
  }
  if (criteria.cultural_quests_min) {
    if (player.xp_cultura < (criteria.cultural_quests_min as number) * 500) return false;
  }

  return true;
}
