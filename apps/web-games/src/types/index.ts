// Core types for web-games module

export type GameType = 'MINA_RESPONSABLE' | 'RUTA_GUARDIAN';
export type GameSessionStatus = 'ACTIVE' | 'COMPLETED' | 'ABANDONED' | 'FAILED';
export type PurchaseType = 'PACK_STARTER' | 'PACK_EXPLORER' | 'PACK_MASTER' | 'BOOSTER_XP_SMALL' | 'BOOSTER_XP_MEDIUM' | 'BOOSTER_XP_LARGE' | 'BOOSTER_TIME_EXTEND' | 'BOOSTER_HINT';
export type PurchaseStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Game {
  id: string;
  type: GameType;
  slug: string;
  name: string;
  description: string;
  thumbnailUrl: string | null;
  iframeUrl: string;
  isActive: boolean;
  config: GameConfig;
  createdAt: string;
  updatedAt: string;
}

export interface GameConfig {
  freeRunsPerDay: number;
  baseXpPerRun: number;
  baseCoinsPerRun: number;
  maxScore: number;
  timeLimitMs: number;
  difficultyLevels: DifficultyLevel[];
  boosters: BoosterConfig[];
}

export interface DifficultyLevel {
  id: string;
  name: string;
  multiplier: number;
  unlockRequirement?: string;
}

export interface BoosterConfig {
  id: string;
  type: PurchaseType;
  name: string;
  description: string;
  price: number;
  currency: string;
  effect: BoosterEffect;
}

export interface BoosterEffect {
  xpMultiplier?: number;
  timeExtensionMs?: number;
  hintCount?: number;
  coinMultiplier?: number;
}

export interface GameSession {
  id: string;
  gameId: string;
  userId: string;
  status: GameSessionStatus;
  score: number;
  xpEarned: number;
  coinsEarned: number;
  durationMs: number;
  metadata: Record<string, unknown>;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GameDailyUsage {
  id: string;
  gameId: string;
  userId: string;
  date: string;
  runsUsed: number;
  runsLimit: number;
}

export interface GamePackPurchase {
  id: string;
  gameId: string;
  userId: string;
  type: PurchaseType;
  status: PurchaseStatus;
  amount: number;
  currency: string;
  stripeSessionId: string | null;
  stripePaymentId: string | null;
  metadata: Record<string, unknown>;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserGameProfile {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  tier: string;
  totalXp: number;
  totalCoins: number;
  games: {
    [gameType: string]: {
      totalRuns: number;
      totalXp: number;
      totalCoins: number;
      bestScore: number;
      averageScore: number;
      lastPlayedAt: string | null;
    };
  };
}

export interface GameStatsResponse {
  game: Game;
  userProfile: UserGameProfile | null;
  todayUsage: GameDailyUsage | null;
  recentSessions: GameSession[];
  leaderboard: LeaderboardEntry[];
  availableBoosters: BoosterConfig[];
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  score: number;
  totalXp: number;
  tier: string;
  rank: number;
}

export interface GameReportPayload {
  gameId: string;
  sessionId: string;
  score: number;
  xpEarned: number;
  coinsEarned: number;
  durationMs: number;
  metadata: Record<string, unknown>;
  completedAt: string;
}

export interface GameStartResponse {
  session: GameSession;
  dailyUsage: GameDailyUsage;
  canPlayFree: boolean;
  remainingFreeRuns: number;
}

export interface GameCompleteResponse {
  session: GameSession;
  xpEarned: number;
  coinsEarned: number;
  leveledUp: boolean;
  newTier: string | null;
  dailyUsage: GameDailyUsage;
  rewards: {
    xp: number;
    coins: number;
    badges: string[];
  };
}

export interface PurchasePackRequest {
  gameId: string;
  packType: PurchaseType;
  successUrl: string;
  cancelUrl: string;
}

export interface PurchasePackResponse {
  sessionId: string;
  url: string;
}

export interface BoosterPurchaseRequest {
  gameId: string;
  boosterType: PurchaseType;
  successUrl: string;
  cancelUrl: string;
}

export interface FederatedStatsPayload {
  gameId: string;
  date: string;
  totalRuns: number;
  totalXp: number;
  avgScore: number;
  topScore: number;
  uniquePlayers: number;
  byTier: Record<string, { runs: number; xp: number }>;
  byFederation: Record<string, { runs: number; xp: number }>;
}