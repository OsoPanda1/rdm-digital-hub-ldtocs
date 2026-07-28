/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
/**
 * useGamification — Unified gamification hook
 * Uses the clean API client. Handles SSE live updates and auto-refresh.
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import {
  getPlayerProfile,
  getLeaderboard,
  getQuests,
  getRewards,
  postGameEvent as apiPostEvent,
  redeemReward as apiRedeemReward,
  verifyPoi as apiVerifyPoi,
  connectToLiveEvents,
} from '@/features/gamification/api';
import type {
  GamificationPlayer,
  GamificationQuest,
  GamificationPlayerQuest,
  GamificationBadge,
  GamificationPlayerBadge,
  GamificationReward,
  GamificationPlayerReward,
  GamificationSeason,
  LeaderboardEntry,
  StreakInfo,
  LiveEvent,
  PostGameEventRequest,
  PostGameEventResponse,
  RedeemRewardRequest,
  RedeemRewardResponse,
  VerifyPoiRequest,
  VerifyPoiResponse,
  GetPlayerProfileResponse,
  XpTrack,
} from '@/features/gamification/types';

export interface UseGamificationReturn {
  profile: GamificationPlayer | null;
  activeQuests: (GamificationPlayerQuest & { quest: GamificationQuest })[];
  badges: (GamificationPlayerBadge & { badge: GamificationBadge })[];
  rewards: GamificationReward[];
  playerRewards: (GamificationPlayerReward & { reward: GamificationReward })[];
  leaderboard: LeaderboardEntry[];
  playerRank: number | null;
  streak: StreakInfo | null;
  season: GamificationSeason | null;
  isLoading: boolean;
  error: string | null;
  postEvent: (request: PostGameEventRequest) => Promise<PostGameEventResponse>;
  redeemReward: (request: RedeemRewardRequest) => Promise<RedeemRewardResponse>;
  verifyPoi: (request: VerifyPoiRequest) => Promise<VerifyPoiResponse>;
  refreshProfile: () => Promise<void>;
  refreshLeaderboard: (track?: XpTrack) => Promise<void>;
}

export function useGamification(): UseGamificationReturn {
  const [profile, setProfile] = useState<GamificationPlayer | null>(null);
  const [activeQuests, setActiveQuests] = useState<(GamificationPlayerQuest & { quest: GamificationQuest })[]>([]);
  const [badges, setBadges] = useState<(GamificationPlayerBadge & { badge: GamificationBadge })[]>([]);
  const [rewards, setRewards] = useState<GamificationReward[]>([]);
  const [playerRewards, setPlayerRewards] = useState<(GamificationPlayerReward & { reward: GamificationReward })[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [season, setSeason] = useState<GamificationSeason | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  const refreshProfile = useCallback(async () => {
    try {
      const data: GetPlayerProfileResponse = await getPlayerProfile();
      setProfile(data.player);
      setActiveQuests(data.active_quests);
      setBadges(data.badges);
      setPlayerRewards(data.rewards);
      setSeason(data.season);
      setStreak(data.streak);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load profile');
    }
  }, []);

  const refreshLeaderboard = useCallback(async (track?: XpTrack) => {
    try {
      const data = await getLeaderboard(track);
      setLeaderboard(data.entries);
      setPlayerRank(data.player_rank);
      if (data.season) setSeason(data.season);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load leaderboard');
    }
  }, []);

  const refreshRewards = useCallback(async () => {
    try {
      const data = await getRewards();
      setRewards(data.rewards);
      setPlayerRewards(data.player_rewards);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load rewards');
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.allSettled([
      refreshProfile(),
      refreshLeaderboard(),
      refreshRewards(),
    ]);
    setIsLoading(false);
  }, [refreshProfile, refreshLeaderboard, refreshRewards]);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    const disconnect = connectToLiveEvents((event: LiveEvent) => {
      switch (event.type) {
        case 'xp_earned':
        case 'level_up':
        case 'badge_earned':
        case 'streak_update':
          refreshProfile();
          break;
        case 'quest_complete':
          refreshProfile();
          refreshLeaderboard();
          break;
        case 'leaderboard_update':
          refreshLeaderboard();
          break;
      }
    });

    return disconnect;
  }, [refreshProfile, refreshLeaderboard]);

  const postEvent = useCallback(async (request: PostGameEventRequest) => {
    const result = await apiPostEvent(request);
    refreshProfile();
    refreshLeaderboard();
    return result;
  }, [refreshProfile, refreshLeaderboard]);

  const redeemReward = useCallback(async (request: RedeemRewardRequest) => {
    const result = await apiRedeemReward(request);
    refreshRewards();
    refreshProfile();
    return result;
  }, [refreshRewards, refreshProfile]);

  const verifyPoi = useCallback(async (request: VerifyPoiRequest) => {
    const result = await apiVerifyPoi(request);
    refreshProfile();
    return result;
  }, [refreshProfile]);

  return {
    profile,
    activeQuests,
    badges,
    rewards,
    playerRewards,
    leaderboard,
    playerRank,
    streak,
    season,
    isLoading,
    error,
    postEvent,
    redeemReward,
    verifyPoi,
    refreshProfile,
    refreshLeaderboard,
  };
}
