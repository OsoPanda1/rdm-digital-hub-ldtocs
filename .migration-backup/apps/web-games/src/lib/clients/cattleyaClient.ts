import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const CATTLEYA_API_URL = process.env.NEXT_PUBLIC_CATTLEYA_API_URL || '/api/cattleya';

class CattleyaClient {
  private async getAuthHeader(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  async purchaseGamePack(
    gameId: string,
    packType: 'PACK_STARTER' | 'PACK_EXPLORER' | 'PACK_MASTER',
    successUrl: string,
    cancelUrl: string
  ): Promise<{ sessionId: string; url: string }> {
    const token = await this.getAuthHeader();
    const response = await fetch(`${CATTLEYA_API_URL}/game-packs/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ gameId, packType, successUrl, cancelUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creando checkout de pack');
    }

    return response.json();
  }

  async confirmGamePackPurchase(
    gameId: string,
    packType: string,
    userId: string,
    sessionId: string
  ): Promise<{ success: boolean; runsGranted: number; daysGranted?: number }> {
    const token = await this.getAuthHeader();
    const response = await fetch(`${CATTLEYA_API_URL}/game-packs/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ gameId, packType, userId, sessionId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error confirmando compra');
    }

    return response.json();
  }

  async purchaseBooster(
    gameId: string,
    boosterType: 'BOOSTER_XP_SMALL' | 'BOOSTER_XP_MEDIUM' | 'BOOSTER_XP_LARGE' | 'BOOSTER_TIME_EXTEND' | 'BOOSTER_HINT',
    successUrl: string,
    cancelUrl: string
  ): Promise<{ sessionId: string; url: string }> {
    const token = await this.getAuthHeader();
    const response = await fetch(`${CATTLEYA_API_URL}/boosters/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ gameId, boosterType, successUrl, cancelUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error creando checkout de booster');
    }

    return response.json();
  }

  async getUserBenefits(userId: string): Promise<{
    tier: 'BASE' | 'CUIDADO' | 'GUARDIAN' | 'EMBAJADOR';
    discountRate: number;
    cashbackRate: number;
    xpMultiplier: number;
    activeBoosters: Array<{
      type: string;
      expiresAt: string;
      remainingUses: number;
    }>;
    gamePacks: Array<{
      gameId: string;
      packType: string;
      purchasedAt: string;
      runsRemaining: number;
      daysRemaining?: number;
    }>;
  }> {
    const token = await this.getAuthHeader();
    const response = await fetch(`${CATTLEYA_API_URL}/users/${userId}/benefits`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo beneficios');
    }

    return response.json();
  }

  async getTransactionHistory(userId: string, limit = 20): Promise<Array<{
    id: string;
    type: 'PACK' | 'BOOSTER' | 'REWARD';
    amount: number;
    currency: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    gameId?: string;
    description: string;
    createdAt: string;
  }>> {
    const token = await this.getAuthHeader();
    const response = await fetch(`${CATTLEYA_API_URL}/users/${userId}/transactions?limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo historial');
    }

    return response.json();
  }
}

export const cattleyaClient = new CattleyaClient();