// artifacts/api-server/src/routes/gamification.ts
// Gamification API — serves XP, rank, quests, and leaderboard data.
// When Supabase is wired, replace mock data with DB queries via Drizzle.

import type { Router, Request, Response } from "express";

// ── Rank tiers ────────────────────────────────────────────────────────────────

const RANKS = [
  { name: "Visitante",     minXp: 0,     icon: "🧭", color: "#9CA3AF" },
  { name: "Explorador",    minXp: 100,   icon: "🗺️", color: "#60A5FA" },
  { name: "Minero",        minXp: 500,   icon: "⛏️", color: "#34D399" },
  { name: "Cronista",      minXp: 1500,  icon: "📜", color: "#FBBF24" },
  { name: "Guardián",      minXp: 4000,  icon: "🏰", color: "#F97316" },
  { name: "Leyenda RDM",   minXp: 10000, icon: "👑", color: "#EC4899" },
] as const;

function getRank(xp: number) {
  return [...RANKS].reverse().find((r) => xp >= r.minXp) ?? RANKS[0];
}

function nextRank(xp: number) {
  return RANKS.find((r) => xp < r.minXp) ?? null;
}

// ── Mock data factory (replace with DB when ready) ───────────────────────────

function buildMockProfile(userId?: string) {
  const xp = 320;
  const rank = getRank(xp);
  const next = nextRank(xp);
  return {
    userId: userId ?? "anonymous",
    xp,
    rank: { name: rank.name, icon: rank.icon, color: rank.color },
    nextRank: next
      ? { name: next.name, icon: next.icon, xpRequired: next.minXp, xpRemaining: next.minXp - xp }
      : null,
    streak: 3,
    totalDiscoveries: 7,
    badges: ["first_visit", "mina_explorer", "paste_lover"],
  };
}

const MOCK_LEADERBOARD = [
  { rank: 1, userId: "u1", displayName: "Minero del Alba",   xp: 8420, rankName: "Guardián",  avatar: null },
  { rank: 2, userId: "u2", displayName: "Cronista Trejo",    xp: 5200, rankName: "Guardián",  avatar: null },
  { rank: 3, userId: "u3", displayName: "Realito Fan #1",    xp: 3700, rankName: "Cronista",  avatar: null },
  { rank: 4, userId: "u4", displayName: "Sierra Walker",     xp: 2100, rankName: "Cronista",  avatar: null },
  { rank: 5, userId: "u5", displayName: "PasteHunter",       xp: 1450, rankName: "Minero",    avatar: null },
  { rank: 6, userId: "u6", displayName: "TúristaMagico",     xp: 980,  rankName: "Minero",    avatar: null },
  { rank: 7, userId: "u7", displayName: "Nuevo Explorador",  xp: 310,  rankName: "Explorador",avatar: null },
];

const MOCK_QUESTS = [
  {
    id: "visit_mina",
    title: "Visita la Mina de Acosta",
    description: "Descubre el corazón histórico de Real del Monte.",
    xpReward: 150,
    category: "exploración",
    icon: "⛏️",
    completed: false,
    progress: 0,
    total: 1,
  },
  {
    id: "eat_paste",
    title: "Prueba 3 pastes distintos",
    description: "La gastronomía es patrimonio. Saborea la historia.",
    xpReward: 80,
    category: "gastronomía",
    icon: "🥧",
    completed: false,
    progress: 1,
    total: 3,
  },
  {
    id: "share_photo",
    title: "Comparte una foto del pueblo",
    description: "Sé embajador digital de Real del Monte.",
    xpReward: 50,
    category: "comunidad",
    icon: "📸",
    completed: true,
    progress: 1,
    total: 1,
  },
  {
    id: "listen_tamv",
    title: "Escucha TAMV 92.5 por 30 min",
    description: "Sintoniza la voz del pueblo.",
    xpReward: 60,
    category: "cultura",
    icon: "📻",
    completed: false,
    progress: 0,
    total: 1,
  },
  {
    id: "visit_5_pois",
    title: "Visita 5 puntos de interés",
    description: "Conviértete en un explorador de verdad.",
    xpReward: 200,
    category: "exploración",
    icon: "🗺️",
    completed: false,
    progress: 2,
    total: 5,
  },
];

// ── Route registration ────────────────────────────────────────────────────────

export function registerGamificationRoutes(router: Router) {
  // GET /api/v1/gamification/profile
  // Returns the authenticated user's XP, rank, and badges.
  // Auth header optional in dev — returns mock when absent.
  router.get("/v1/gamification/profile", (req: Request, res: Response) => {
    const userId = (req.headers["x-user-id"] as string | undefined) ?? undefined;
    res.status(200).json({ ok: true, data: buildMockProfile(userId) });
  });

  // GET /api/v1/gamification/leaderboard
  router.get("/v1/gamification/leaderboard", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: MOCK_LEADERBOARD });
  });

  // GET /api/v1/gamification/quests
  router.get("/v1/gamification/quests", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: MOCK_QUESTS });
  });

  // POST /api/v1/gamification/award-xp
  // Body: { userId, amount, reason }
  router.post("/v1/gamification/award-xp", (req: Request, res: Response) => {
    const { userId = "anonymous", amount = 0, reason = "manual" } = req.body ?? {};
    const numAmount = Math.min(Number(amount) || 0, 1000); // cap per-call
    const profile = buildMockProfile(userId);
    const newXp = profile.xp + numAmount;
    const newRank = getRank(newXp);
    res.status(200).json({
      ok: true,
      data: {
        userId,
        xpAwarded: numAmount,
        reason,
        newXp,
        rank: { name: newRank.name, icon: newRank.icon, color: newRank.color },
        rankUp: newRank.name !== profile.rank.name,
      },
    });
  });

  // GET /api/v1/gamification/ranks
  router.get("/v1/gamification/ranks", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: RANKS });
  });
}
