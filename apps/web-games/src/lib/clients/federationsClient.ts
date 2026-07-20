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

export const federationsClient = {
  async getUserFederation(userId: string): Promise<{
    federationId: string;
    federationName: string;
    role: string;
    joinedAt: string;
  } | null> {
    return fetchWithAuth(`${KERNEL_API}/federations/user/${userId}`);
  },

  async getFederationMembers(federationId: string): Promise<Array<{
    userId: string;
    displayName: string;
    role: string;
    joinedAt: string;
  }>> {
    return fetchWithAuth(`${KERNEL_API}/federations/${federationId}/members`);
  },

  async getFederationStats(federationId: string): Promise<{
    totalMembers: number;
    totalXp: number;
    totalCoins: number;
    gamesPlayed: number;
    missionsCompleted: number;
  }> {
    return fetchWithAuth(`${KERNEL_API}/federations/${federationId}/stats`);
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

  async getFederationLeaderboard(federationId: string, limit = 10): Promise<Array<{
    userId: string;
    displayName: string;
    avatarUrl: string | null;
    tier: string;
    totalXp: number;
    rank: number;
  }>> {
    return fetchWithAuth(`${KERNEL_API}/federations/${federationId}/leaderboard?${new URLSearchParams({ limit: String(limit) })}`);
  },

  async joinFederation(userId: string, federationId: string): Promise<{ success: boolean; role: string }> {
    return fetchWithAuth(`${KERNEL_API}/federations/join`, {
      method: 'POST',
      body: JSON.stringify({ userId, federationId }),
    });
  },

  async leaveFederation(userId: string, federationId: string): Promise<{ success: boolean }> {
    return fetchWithAuth(`${KERNEL_API}/federations/leave`, {
      method: 'POST',
      body: JSON.stringify({ userId, federationId }),
    });
  },
};