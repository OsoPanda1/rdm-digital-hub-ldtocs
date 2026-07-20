import { supabase } from '@/integrations/supabase/client';
import type { GameSession, GameDailyUsage, GamePackPurchase, GameReportPayload, GameStartResponse, GameCompleteResponse, PurchasePackResponse, GameStatsResponse, LeaderboardEntry } from '@/types';

const KERNEL_API = process.env.NEXT_PUBLIC_KERNEL_API || '/api/gamer';
const STRIPE_API = process.env.NEXT_PUBLIC_STRIPE_API || '/api/payments';

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || ''}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const gamerClient = {
  async reportSession(payload: GameReportPayload): Promise<GameCompleteResponse> {
    return fetchWithAuth<GameCompleteResponse>(`${KERNEL_API}/sessions/report`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getUserProfile(): Promise<{ totalXp: number; totalCoins: number; tier: string; games: Record<string, { totalRuns: number; totalXp: number; totalCoins: number; bestScore: number }> }> {
    return fetchWithAuth(`${KERNEL_API}/profile`);
  },

  async registerAction(userId: string, action: { type: string; gameId: string; metadata?: Record<string, unknown> }): Promise<{ success: boolean; xpGained: number; missionProgress?: unknown }> {
    return fetchWithAuth(`${KERNEL_API}/actions/register`, {
      method: 'POST',
      body: JSON.stringify({ userId, action }),
    });
  },

  async completeMission(userId: string, missionId: string): Promise<{ success: boolean; rewards: { xp: number; coins: number; badges: string[] } }> {
    return fetchWithAuth(`${KERNEL_API}/missions/complete`, {
      method: 'POST',
      body: JSON.stringify({ userId, missionId }),
    });
  },
};

export const cattleyaClient = {
  async getTierBenefits(tier: string): Promise<{ discountRate: number; cashbackRate: number; xpMultiplier: number; maxFreeRuns: number }> {
    return fetchWithAuth(`${STRIPE_API}/cattleya/benefits?${new URLSearchParams({ tier })}`);
  },

  async purchaseGamePack(gameId: string, packType: string, successUrl: string, cancelUrl: string): Promise<PurchasePackResponse> {
    return fetchWithAuth(`${STRIPE_API}/packs/purchase`, {
      method: 'POST',
      body: JSON.stringify({ gameId, packType, successUrl, cancelUrl }),
    });
  },

  async purchaseBooster(gameId: string, boosterType: string, successUrl: string, cancelUrl: string): Promise<PurchasePackResponse> {
    return fetchWithAuth(`${STRIPE_API}/boosters/purchase`, {
      method: 'POST',
      body: JSON.stringify({ gameId, boosterType, successUrl, cancelUrl }),
    });
  },

  async getPurchaseHistory(userId: string): Promise<GamePackPurchase[]> {
    return fetchWithAuth(`${STRIPE_API}/history?userId=${userId}`);
  },

  async handleStripeWebhook(payload: string, signature: string): Promise<{ received: boolean }> {
    return fetchWithAuth(`${STRIPE_API}/webhook`, {
      method: 'POST',
      headers: { 'stripe-signature': signature },
      body: payload,
    });
  },
};

export const authClient = {
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async signInWithOAuth(provider: 'google' | 'github' | 'discord') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  onAuthStateChange(callback: (session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => callback(session));
  },
};

export const federationsClient = {
  async getFederationStats(gameId: string, date: string): Promise<{
    totalRuns: number;
    totalXp: number;
    avgScore: number;
    byFederation: Record<string, { runs: number; xp: number }>;
  }> {
    return fetchWithAuth(`${KERNEL_API}/federations/stats?${new URLSearchParams({ gameId, date })}`);
  },

  async reportFederatedStats(payload: {
    gameId: string;
    date: string;
    totalRuns: number;
    totalXp: number;
    avgScore: number;
    topScore: number;
    uniquePlayers: number;
    byTier: Record<string, { runs: number; xp: number }>;
    byFederation: Record<string, { runs: number; xp: number }>;
  }): Promise<{ success: boolean }> {
    return fetchWithAuth(`${KERNEL_API}/federations/stats/report`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getUserFederation(userId: string): Promise<{ federationId: string; federationName: string; role: string } | null> {
    return fetchWithAuth(`${KERNEL_API}/federations/user/${userId}`);
  },
};

export const gamesClient = {
  async getGameStats(gameId: string): Promise<GameStatsResponse> {
    return fetchWithAuth(`${KERNEL_API}/games/${gameId}/stats`);
  },

  async startGameSession(gameId: string): Promise<GameStartResponse> {
    return fetchWithAuth(`${KERNEL_API}/games/${gameId}/session/start`, { method: 'POST' });
  },

  async completeGameSession(payload: GameReportPayload): Promise<GameCompleteResponse> {
    return fetchWithAuth(`${KERNEL_API}/games/session/complete`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getLeaderboard(gameId: string, limit = 10): Promise<LeaderboardEntry[]> {
    return fetchWithAuth(`${KERNEL_API}/games/${gameId}/leaderboard?${new URLSearchParams({ limit: String(limit) })}`);
  },

  async getAvailableBoosters(gameId: string): Promise<{ boosters: { id: string; type: string; name: string; description: string; price: number; currency: string; effect: unknown }[] }> {
    return fetchWithAuth(`${KERNEL_API}/games/${gameId}/boosters`);
  },

  async canPlayFree(gameId: string): Promise<{ canPlayFree: boolean; remainingFreeRuns: number; dailyUsage: { runsUsed: number; runsLimit: number } | null }> {
    return fetchWithAuth(`${KERNEL_API}/games/${gameId}/can-play-free`);
  },
};

export const gameDataClient = {
  async getGameConfig(gameId: string): Promise<{
    id: string;
    type: string;
    slug: string;
    name: string;
    description: string;
    thumbnailUrl: string | null;
    iframeUrl: string;
    isActive: boolean;
    config: {
      freeRunsPerDay: number;
      baseXpPerRun: number;
      baseCoinsPerRun: number;
      maxScore: number;
      timeLimitMs: number;
      difficultyLevels: unknown[];
      boosters: unknown[];
    };
  }> {
    return fetchWithAuth(`${KERNEL_API}/games/${gameId}/config`);
  },
};