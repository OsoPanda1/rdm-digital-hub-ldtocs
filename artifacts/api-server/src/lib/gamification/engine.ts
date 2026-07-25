// ────────────────────────────────────────────────────────────────
// Gamification Engine — XP, rutas de progresión, insignias
// Backend para el sistema Living World de RDM
// ────────────────────────────────────────────────────────────────

export interface PlayerProfile {
  userId: string;
  xp: number;
  level: number;
  rank: string;
  streak: number;
  badges: string[];
  totalActions: number;
  createdAt: string;
  lastActionAt: string;
}

export interface BadgeDefinition {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  criteria: string;
  xpBonus: number;
}

export interface ProgressionBranch {
  branchId: string;
  name: string;
  description: string;
  levels: { level: number; xpRequired: number; reward?: string }[];
}

export interface GamificationEngine {
  getOrCreatePlayer(userId: string): Promise<PlayerProfile>;
  awardXp(userId: string, amount: number, reason: string): Promise<{ newXp: number; leveledUp: boolean; newRank: string }>;
  awardBadge(userId: string, badgeId: string): Promise<boolean>;
  getLeaderboard(limit: number): Promise<PlayerProfile[]>;
  getPlayerStats(userId: string): Promise<{ xp: number; level: number; rank: string; badges: number; streak: number }>;
  stats(): Promise<{ totalPlayers: number; totalXpAwarded: number; totalBadgesAwarded: number }>;
}

const RANK_THRESHOLDS = [
  { rank: "Visitante", minXp: 0 },
  { rank: "Explorador", minXp: 100 },
  { rank: "Minero", minXp: 500 },
  { rank: "Cronista", minXp: 1500 },
  { rank: "Guardián", minXp: 4000 },
  { rank: "Leyenda RDM", minXp: 10000 },
];

function calculateRank(xp: number): string {
  return [...RANK_THRESHOLDS].reverse().find((r) => xp >= r.minXp)?.rank ?? "Visitante";
}

function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 10)) + 1;
}

export function createGamificationEngine(): GamificationEngine {
  const players = new Map<string, PlayerProfile>();
  let totalXpAwarded = 0;
  let totalBadgesAwarded = 0;

  return {
    async getOrCreatePlayer(userId) {
      let player = players.get(userId);
      if (!player) {
        player = {
          userId,
          xp: 0,
          level: 1,
          rank: "Visitante",
          streak: 0,
          badges: [],
          totalActions: 0,
          createdAt: new Date().toISOString(),
          lastActionAt: new Date().toISOString(),
        };
        players.set(userId, player);
      }
      return { ...player };
    },

    async awardXp(userId, amount, reason) {
      const player = await this.getOrCreatePlayer(userId);
      const safeAmount = Math.max(0, Math.min(amount, 500));
      player.xp += safeAmount;
      player.level = calculateLevel(player.xp);
      player.rank = calculateRank(player.xp);
      player.totalActions += 1;
      player.lastActionAt = new Date().toISOString();
      players.set(userId, player);
      totalXpAwarded += safeAmount;
      const oldLevel = calculateLevel(player.xp - safeAmount);
      return { newXp: player.xp, leveledUp: player.level > oldLevel, newRank: player.rank };
    },

    async awardBadge(userId, badgeId) {
      const player = await this.getOrCreatePlayer(userId);
      if (player.badges.includes(badgeId)) return false;
      player.badges.push(badgeId);
      players.set(userId, player);
      totalBadgesAwarded += 1;
      return true;
    },

    async getLeaderboard(limit) {
      return Array.from(players.values())
        .sort((a, b) => b.xp - a.xp)
        .slice(0, limit);
    },

    async getPlayerStats(userId) {
      const player = await this.getOrCreatePlayer(userId);
      return { xp: player.xp, level: player.level, rank: player.rank, badges: player.badges.length, streak: player.streak };
    },

    async stats() {
      return { totalPlayers: players.size, totalXpAwarded, totalBadgesAwarded };
    },
  };
}
