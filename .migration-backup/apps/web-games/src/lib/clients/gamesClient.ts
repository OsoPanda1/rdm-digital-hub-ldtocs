import { supabase } from './authClient';

const KERNEL_API = process.env.NEXT_PUBLIC_KERNEL_API || '/api/gamer';

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

export const gamesClient = {
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

  async getGameStats(gameId: string): Promise<{
    game: {
      id: string;
      type: string;
      slug: string;
      name: string;
      description: string;
      thumbnailUrl: string | null;
      iframeUrl: string;
      isActive: boolean;
    };
    userProfile: {
      totalRuns: number;
      totalXp: number;
      totalCoins: number;
      bestScore: number;
      averageScore: number;
      lastPlayedAt: string | null;
    } | null;
    todayUsage: {
      runsUsed: number;
      runsLimit: number;
    } | null;
    recentSessions: Array<{
      id: string;
      score: number;
      xpEarned: number;
      coinsEarned: number;
      durationMs: number;
      startedAt: string;
      endedAt: string | null;
    }>;
    leaderboard: Array<{
      userId: string;
      displayName: string;
      avatarUrl: string | null;
      score: number;
      totalXp: number;
      tier: string;
      rank: number;
    }>;
    availableBoosters: Array<{
      id: string;
      type: string;
      name: string;
      description: string;
      price: number;
      currency: string;
      effect: unknown;
    }>;
  }> {
    return fetchWithAuth(`${KERNEL_API}/games/${gameId}/stats`);
  },

  async startGameSession(gameId: string): Promise<{
    session: {
      id: string;
      gameId: string;
      userId: string;
      status: string;
      score: number;
      xpEarned: number;
      coinsEarned: number;
      durationMs: number;
      metadata: Record<string, unknown>;
      startedAt: string;
      endedAt: string | null;
      createdAt: string;
      updatedAt: string;
    };
    dailyUsage: {
      id: string;
      gameId: string;
      userId: string;
      date: string;
      runsUsed: number;
      runsLimit: number;
    };
    canPlayFree: boolean;
    remainingFreeRuns: number;
  }> {
    return fetchWithAuth(`${KERNEL_API}/games/${gameId}/session/start`, { method: 'POST' });
  },

  async completeGameSession(payload: {
    sessionId: string;
    gameId: string;
    score: number;
    xpEarned: number;
    coinsEarned: number;
    durationMs: number;
    metadata: Record<string, unknown>;
    completedAt: string;
  }): Promise<{
    session: {
      id: string;
      gameId: string;
      userId: string;
      status: string;
      score: number;
      xpEarned: number;
      coinsEarned: number;
      durationMs: number;
      metadata: Record<string, unknown>;
      startedAt: string;
      endedAt: string | null;
      createdAt: string;
      updatedAt: string;
    };
    xpEarned: number;
    coinsEarned: number;
    leveledUp: boolean;
    newTier: string | null;
    dailyUsage: {
      id: string;
      gameId: string;
      userId: string;
      date: string;
      runsUsed: number;
      runsLimit: number;
    };
    rewards: {
      xp: number;
      coins: number;
      badges: string[];
    };
  }> {
    return fetchWithAuth(`${KERNEL_API}/games/session/complete`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getLeaderboard(gameId: string, limit = 10): Promise<Array<{
    userId: string;
    displayName: string;
    avatarUrl: string | null;
    score: number;
    totalXp: number;
    tier: string;
    rank: number;
  }>> {
    return fetchWithAuth(`${KERNEL_API}/games/${gameId}/leaderboard?${new URLSearchParams({ limit: String(limit) })}`);
  },

  async getAvailableBoosters(gameId: string): Promise<{
    boosters: Array<{
      id: string;
      type: string;
      name: string;
      description: string;
      price: number;
      currency: string;
      effect: unknown;
    }>;
  }> {
    return fetchWithAuth(`${KERNEL_API}/games/${gameId}/boosters`);
  },

  async canPlayFree(gameId: string): Promise<{
    canPlayFree: boolean;
    remainingFreeRuns: number;
    dailyUsage: {
      runsUsed: number;
      runsLimit: number;
    } | null;
  }> {
    return fetchWithAuth(`${KERNEL_API}/games/${gameId}/can-play-free`);
  },

  async purchasePack(gameId: string, packType: string, successUrl: string, cancelUrl: string): Promise<{
    sessionId: string;
    url: string;
  }> {
    return fetchWithAuth(`${KERNEL_API}/packs/purchase`, {
      method: 'POST',
      body: JSON.stringify({ gameId, packType, successUrl, cancelUrl }),
    });
  },

  async purchaseBooster(gameId: string, boosterType: string, successUrl: string, cancelUrl: string): Promise<{
    sessionId: string;
    url: string;
  }> {
    return fetchWithAuth(`${KERNEL_API}/boosters/purchase`, {
      method: 'POST',
      body: JSON.stringify({ gameId, boosterType, successUrl, cancelUrl }),
    });
  },
};