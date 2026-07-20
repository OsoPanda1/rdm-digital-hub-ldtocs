import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const GAMER_API_URL = process.env.NEXT_PUBLIC_GAMER_API_URL || '/api/gamer';

class GamerClient {
  private async getAuthHeader(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  async registerAction(userId: string, action: {
    type: string;
    gameId?: string;
    payload: Record<string, unknown>;
    timestamp: string;
  }): Promise<{ success: boolean; xpAwarded: number; vpAwarded: number; missionsCompleted: string[] }> {
    const token = await this.getAuthHeader();
    const response = await fetch(`${GAMER_API_URL}/actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, ...action }),
    });

    if (!response.ok) {
      throw new Error('Error registrando acción en GAMER');
    }

    return response.json();
  }

  async completeMission(userId: string, missionCode: string): Promise<{ success: boolean; rewards: { xp: number; vp: number; badges: string[] } }> {
    const token = await this.getAuthHeader();
    const response = await fetch(`${GAMER_API_URL}/missions/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, missionCode }),
    });

    if (!response.ok) {
      throw new Error('Error completando misión en GAMER');
    }

    return response.json();
  }

  async getUserProfile(userId: string): Promise<{
    level: number;
    xp: number;
    vp: number;
    tier: string;
    badges: string[];
    dailyStreak: number;
  }> {
    const token = await this.getAuthHeader();
    const response = await fetch(`${GAMER_API_URL}/users/${userId}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo perfil de usuario');
    }

    return response.json();
  }

  async getUserMissions(userId: string): Promise<Array<{
    code: string;
    title: string;
    description: string;
    progress: number;
    target: number;
    completed: boolean;
    rewards: { xp: number; vp: number; badges: string[] };
  }>> {
    const token = await this.getAuthHeader();
    const response = await fetch(`${GAMER_API_URL}/users/${userId}/missions`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo misiones');
    }

    return response.json();
  }

  async checkDailyLimits(userId: string, gameId: string): Promise<{
    canPlayFree: boolean;
    freeRunsUsed: number;
    freeRunsLimit: number;
    paidRunsUsed: number;
    paidRunsAvailable: number;
  }> {
    const token = await this.getAuthHeader();
    const response = await fetch(`${GAMER_API_URL}/users/${userId}/games/${gameId}/daily-limits`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Error verificando límites diarios');
    }

    return response.json();
  }
}

export const gamerClient = new GamerClient();