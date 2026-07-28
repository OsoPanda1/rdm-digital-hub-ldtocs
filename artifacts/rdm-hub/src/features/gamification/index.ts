/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
export type {
  GamificationPlayer,
  GamificationQuest,
  GamificationEvent,
  GamificationBadge,
  GamificationPlayerQuest,
  GamificationPlayerBadge,
  GamificationPlayerReward,
  GamificationSeason,
  GamificationReward,
  GamificationTerritorialEvent,
  LeaderboardEntry,
  PostGameEventRequest,
  PostGameEventResponse,
  GetPlayerProfileResponse,
  GetLeaderboardResponse,
  GetRewardsResponse,
  GetQuestsResponse,
  RedeemRewardRequest,
  RedeemRewardResponse,
  VerifyPoiRequest,
  VerifyPoiResponse,
  LiveEvent,
  StreakInfo,
  XpTrack,
  QuestType,
  QuestDifficulty,
  BadgeRarity,
  GameEventType,
} from './types';

export {
  calculateLevel,
  xpForNextLevel,
  levelProgress,
  calculateEventXp,
  evaluateQuestCriteria,
  evaluateBadgeCriteria,
  getRankForXp,
  getRankConfig,
} from './engine';

export {
  postGameEvent,
  getPlayerProfile,
  getLeaderboard,
  getQuests,
  getRewards,
  redeemReward,
  verifyPoi,
  connectToLiveEvents,
} from './api';
