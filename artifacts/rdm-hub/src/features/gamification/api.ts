/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
/**
 * Gamification LTOS Engine — API Client
 * Real del Monte Digital Hub
 *
 * Clean API client for the gamification backend.
 * No mock fallback — all data comes from the server.
 */

import type {
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
  XpTrack,
} from './types';

const API_BASE = (import.meta.env.VITE_API_URL || '/api') + '/v1';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Gamification API ${res.status}: ${body || res.statusText}`);
  }
  const json = await res.json();
  if (json && typeof json === 'object' && 'ok' in json) {
    if (!json.ok) throw new Error(json.error?.message || `Gamification API error`);
    return json.data as T;
  }
  return json as T;
}

// ============================================================================
// EVENTS
// ============================================================================

export async function postGameEvent(
  request: PostGameEventRequest,
): Promise<PostGameEventResponse> {
  return apiFetch<PostGameEventResponse>('/gamification/events', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// ============================================================================
// PROFILE
// ============================================================================

export async function getPlayerProfile(): Promise<GetPlayerProfileResponse> {
  return apiFetch<GetPlayerProfileResponse>('/gamification/profile');
}

// ============================================================================
// LEADERBOARD
// ============================================================================

export async function getLeaderboard(
  track?: XpTrack,
): Promise<GetLeaderboardResponse> {
  const params = track ? `?track=${track}` : '';
  return apiFetch<GetLeaderboardResponse>(`/gamification/leaderboard${params}`);
}

// ============================================================================
// QUESTS
// ============================================================================

export async function getQuests(): Promise<GetQuestsResponse> {
  return apiFetch<GetQuestsResponse>('/gamification/quests');
}

// ============================================================================
// REWARDS
// ============================================================================

export async function getRewards(): Promise<GetRewardsResponse> {
  return apiFetch<GetRewardsResponse>('/gamification/rewards');
}

export async function redeemReward(
  request: RedeemRewardRequest,
): Promise<RedeemRewardResponse> {
  return apiFetch<RedeemRewardResponse>('/gamification/redeem', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// ============================================================================
// POI VERIFICATION
// ============================================================================

export async function verifyPoi(
  request: VerifyPoiRequest,
): Promise<VerifyPoiResponse> {
  return apiFetch<VerifyPoiResponse>('/gamification/verify-poi', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// ============================================================================
// SSE LIVE EVENTS
// ============================================================================

export function connectToLiveEvents(
  onEvent: (event: LiveEvent) => void,
  onError?: (error: Event) => void,
): () => void {
  const es = new EventSource(`${API_BASE}/gamification/live`, {
    withCredentials: true,
  });

  es.onmessage = (msg) => {
    try {
      const event = JSON.parse(msg.data) as LiveEvent;
      onEvent(event);
    } catch {
      // ignore malformed events
    }
  };

  es.onerror = (err) => {
    onError?.(err);
  };

  return () => {
    es.close();
  };
}
