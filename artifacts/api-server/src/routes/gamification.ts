// artifacts/api-server/src/routes/gamification.ts
// Gamification API — Legacy XP system + RDM Living World endpoints.
// ADR-001: docs/adr/001-rdm-living-world-gamification.md
// When Supabase is wired, replace mock data with DB queries via Drizzle.

import type { Router, Request, Response } from "express";

// ═══════════════════════════════════════════════════════════════════════════════
//  LEGACY SYSTEM (kept for backward compatibility)
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
//  LIVING WORLD — Mock data (ADR-001)
// ═══════════════════════════════════════════════════════════════════════════════

const PROGRESSION_BRANCHES = [
  { id: "br-exploration", key: "EXPLORATION", name: "Exploración", description: "Descubre territorios, POIs y rutas ocultas." },
  { id: "br-history",     key: "HISTORY",     name: "Historia",    description: "Desbloquea capítulos narrativos del patrimonio." },
  { id: "br-photo",       key: "PHOTO",       name: "Fotografía",  description: "Captura el territorio y comparte su imagen." },
  { id: "br-gastronomy",  key: "GASTRONOMY",  name: "Gastronomía", description: "Saborea la identidad cultural local." },
  { id: "br-radio",       key: "RADIO",       name: "Radio",       description: "Escucha y participa en TAMV 92.5." },
  { id: "br-community",   key: "COMMUNITY",   name: "Comunidad",   description: "Contribuye al bienestar del pueblo." },
];

const CURRENCY_TYPES = [
  { type: "XP",                icon: "✨", description: "Experiencia general" },
  { type: "COIN",              icon: "🪙", description: "Moneda interna" },
  { type: "CRYSTAL",           icon: "💎", description: "Recompensas raras" },
  { type: "PRESTIGE",          icon: "🏆", description: "Logros comunitarios" },
  { type: "HONOR",             icon: "🏅", description: "Acciones éticas" },
  { type: "ENERGY",            icon: "⚡", description: "Energía de sesión" },
  { type: "INFLUENCE",         icon: "🌐", description: "Capacidad de activar eventos" },
  { type: "TERRITORIAL_IMPACT", icon: "🌍", description: "Impacto positivo en el territorio" },
];

const RARITY_TIERS = [
  { key: "COMMON",    color: "#9CA3AF", label: "Común" },
  { key: "UNCOMMON",  color: "#34D399", label: "Poco Común" },
  { key: "RARE",      color: "#60A5FA", label: "Raro" },
  { key: "EPIC",      color: "#A855F7", label: "Épico" },
  { key: "LEGENDARY", color: "#FBBF24", label: "Legendario" },
  { key: "MYTHIC",    color: "#EC4899", label: "Mítico" },
  { key: "UNIQUE",    color: "#FF1744", label: "Único" },
];

function buildLivingWorldPlayer(userId: string) {
  const xp = 1840;
  const rank = getRank(xp);
  return {
    userId,
    displayName: "Edwin Castillo",
    level: 18,
    xp,
    rank: { name: rank.name, icon: rank.icon, color: rank.color },
    streak: 5,
    createdAt: "2025-12-01T00:00:00Z",
    lastSeenAt: new Date().toISOString(),
    homeTerritory: { id: "ter-rdm", name: "Real del Monte", type: "TOWN" },
  };
}

function buildMockAvatar() {
  return {
    bodyType: "minero",
    hairStyle: "corto_oscuro",
    skinTone: "troniguente",
    baseOutfit: { id: "item-outfit-minero", name: "Traje de Minero Colonial", rarity: "UNCOMMON" },
    equipped: {
      head: { id: "item-helmet-minero", name: "Casco de Minero", rarity: "RARE", iconUrl: "/icons/helmet-minero.png" },
      torso: { id: "item-torso-camisa", name: "Camisa de Trabajo", rarity: "COMMON", iconUrl: "/icons/camisa.png" },
      legs: { id: "item-legs-pantalón", name: "Pantalón de Trabajo", rarity: "COMMON", iconUrl: "/icons/pantalon.png" },
      feet: { id: "item-feet-botas", name: "Botas Mineras", rarity: "UNCOMMON", iconUrl: "/icons/botas.png" },
      pet: null,
      special: { id: "item-special-lampara", name: "Lámpara del Pionero", rarity: "EPIC", iconUrl: "/icons/lampara.png" },
    },
    style: "colonial",
  };
}

function buildMockCurrencies() {
  return CURRENCY_TYPES.map((c) => ({
    type: c.type,
    icon: c.icon,
    description: c.description,
    amount:
      c.type === "XP" ? 1840 :
      c.type === "COIN" ? 450 :
      c.type === "CRYSTAL" ? 12 :
      c.type === "PRESTIGE" ? 3 :
      c.type === "HONOR" ? 28 :
      c.type === "ENERGY" ? 80 :
      c.type === "INFLUENCE" ? 15 :
      42,
  }));
}

function buildMockProgression() {
  return PROGRESSION_BRANCHES.map((b) => ({
    ...b,
    level:
      b.key === "EXPLORATION" ? 14 :
      b.key === "HISTORY" ? 11 :
      b.key === "PHOTO" ? 8 :
      b.key === "GASTRONOMY" ? 6 :
      b.key === "RADIO" ? 9 :
      7,
    xpInBranch:
      b.key === "EXPLORATION" ? 720 :
      b.key === "HISTORY" ? 480 :
      b.key === "PHOTO" ? 310 :
      b.key === "GASTRONOMY" ? 190 :
      b.key === "RADIO" ? 380 :
      240,
  }));
}

const MOCK_COLLECTIONS = [
  {
    id: "col-mining-heritage",
    key: "MINING_HERITAGE",
    name: "Herencia Minera",
    description: "Los tesoros subterráneos de Real del Monte.",
    category: "MINING",
    totalItems: 12,
    obtainedItems: 7,
    progressPercentage: 58.3,
    completedAt: null,
    items: [
      { id: "item-pico-colonial", name: "Pico Colonial", rarity: "COMMON", obtained: true },
      { id: "item-lampara-aceite", name: "Lámpara de Aceite", rarity: "UNCOMMON", obtained: true },
      { id: "item-canal-mercurio", name: "Canal de Mercurio", rarity: "RARE", obtained: true },
      { id: "item-libro-mineria", name: "Libro de Minas de 1780", rarity: "EPIC", obtained: false },
      { id: "item-espada-virrey", name: "Espada del Virrey", rarity: "LEGENDARY", obtained: false },
    ],
  },
  {
    id: "col-gastronomy-pastes",
    key: "GASTRONOMY_PASTES",
    name: "Sazón del Pueblo",
    description: "Todos los pastes y sabores de Real del Monte.",
    category: "GASTRONOMY",
    totalItems: 8,
    obtainedItems: 3,
    progressPercentage: 37.5,
    completedAt: null,
    items: [
      { id: "item-paste-papa", name: "Paste de Papa", rarity: "COMMON", obtained: true },
      { id: "item-paste-mole", name: "Paste de Mole", rarity: "UNCOMMON", obtained: true },
      { id: "item-paste-camaron", name: "Paste de Camarón", rarity: "RARE", obtained: false },
    ],
  },
  {
    id: "col-legendary-folklore",
    key: "LEGENDARY_FOLKLORE",
    name: "Leyendas del Monte",
    description: "Los relatos fantásticos que habitan la sierra.",
    category: "LEGENDS",
    totalItems: 10,
    obtainedItems: 4,
    progressPercentage: 40,
    completedAt: null,
    items: [
      { id: "item-relato-duende", name: "Relato del Duende", rarity: "RARE", obtained: true },
      { id: "item-relato-nahual", name: "El Nahual del Cerro", rarity: "EPIC", obtained: false },
      { id: "item-relato-llorona", name: "La Llorona de la Mina", rarity: "LEGENDARY", obtained: false },
    ],
  },
];

const MOCK_CURRENT_SEASON = {
  id: "season-mining-colonial",
  key: "MINING_COLONIAL",
  name: "Minería Colonial",
  description: "Vive la época dorada de la minería en Real del Monte. Descubre los secretos subterráneos y la vida de los mineros coloniales.",
  startsAt: "2026-07-01T00:00:00Z",
  endsAt: "2026-09-30T23:59:59Z",
  themeConfig: {
    hudColor: "#D4A843",
    mapOverlay: "mines殖民",
    ambientSound: "mine-echoes",
    decorations: ["lanterns", "minecarts", "ore-glow"],
  },
  playerProgress: {
    score: 2400,
    rank: 3,
    totalParticipants: 1247,
    rewardsClaimed: ["skin-helmet-gold", "emote-pickaxe-swing"],
    rewardsAvailable: 8,
  },
};

function buildMockWorldState() {
  return {
    season: MOCK_CURRENT_SEASON,
    weather: { condition: "SUNNY", temperature: 18, humidity: 45 },
    activeEvents: [
      {
        id: "evt-mine-open",
        type: "TERRITORY_EVENT",
        title: "La Mina de Acosta abre sus puertas",
        territoryId: "ter-mina-acosta",
        startsAt: "2026-07-23T10:00:00Z",
        endsAt: "2026-07-23T18:00:00Z",
        description: "Tour especial guiado por los túneles coloniales. XP doble por visitas.",
      },
      {
        id: "evt-challenge-paste",
        type: "COMMUNITY_CHALLENGE",
        title: "Reto: 500 pastes consumidos esta semana",
        territoryId: null,
        startsAt: "2026-07-21T00:00:00Z",
        endsAt: "2026-07-27T23:59:59Z",
        description: "El pueblo come pastes. ¿Puedes ayudar a llegar a 500?",
        progress: 347,
        goal: 500,
      },
    ],
    territoryActivity: {
      activePlayers: 23,
      photosToday: 89,
      visitsToday: 156,
      listensToday: 67,
    },
  };
}

const MOCK_COMMUNITY_CHALLENGES = [
  {
    id: "cc-500-pastes",
    key: "500_PASTES_WEEK",
    name: "500 Pastes esta Semana",
    description: "La comunidad consume pastes como patrimonio vivo. ¡Contribuye!",
    goalType: "VISITS",
    goalTarget: 500,
    currentProgress: 347,
    seasonId: "season-mining-colonial",
    startsAt: "2026-07-21T00:00:00Z",
    endsAt: "2026-07-27T23:59:59Z",
    rewardDescription: "Todos los participantes desbloquean el badge 'Paste Lover' y +50 COIN",
  },
  {
    id: "cc-100-photos-mina",
    key: "100_PHOTOS_MINA",
    name: "100 Fotos de la Mina",
    description: "Captura la belleza subterránea de la Mina de Acosta.",
    goalType: "PHOTOS",
    goalTarget: 100,
    currentProgress: 62,
    seasonId: "season-mining-colonial",
    startsAt: "2026-07-23T00:00:00Z",
    endsAt: "2026-07-30T23:59:59Z",
    rewardDescription: "Los 20 primeros obtienen la 'Lámpara Dorada' (LEGENDARY)",
  },
  {
    id: "cc-listen-30min",
    key: "LISTEN_30MIN_TAMV",
    name: "30 Minutos con TAMV 92.5",
    description: "Escucha la radio del pueblo y gana recompensas.",
    goalType: "LISTENS",
    goalTarget: 200,
    currentProgress: 89,
    seasonId: "season-mining-colonial",
    startsAt: "2026-07-23T00:00:00Z",
    endsAt: "2026-07-27T23:59:59Z",
    rewardDescription: "Desbloquea 'Cronista del Aire' + 30 XP + 1 CRYSTAL",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  ROUTE REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════════

export function registerGamificationRoutes(router: Router) {
  // ───────────────────────────────────────────────────────────────────────────
  //  LEGACY ENDPOINTS (backward compatible)
  // ───────────────────────────────────────────────────────────────────────────

  router.get("/v1/gamification/profile", (req: Request, res: Response) => {
    const userId = (req.headers["x-user-id"] as string | undefined) ?? undefined;
    res.status(200).json({ ok: true, data: buildMockProfile(userId) });
  });

  router.get("/v1/gamification/leaderboard", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: MOCK_LEADERBOARD });
  });

  router.get("/v1/gamification/quests", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: MOCK_QUESTS });
  });

  router.post("/v1/gamification/award-xp", (req: Request, res: Response) => {
    const { userId = "anonymous", amount = 0, reason = "manual" } = req.body ?? {};
    const numAmount = Math.min(Number(amount) || 0, 1000);
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

  router.get("/v1/gamification/ranks", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: RANKS });
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  LIVING WORLD ENDPOINTS (ADR-001)
  // ───────────────────────────────────────────────────────────────────────────

  // GET /api/v1/living-world/player/:id
  // Full player profile: avatar, currencies, progression, collections
  router.get("/v1/living-world/player/:id", (req: Request, res: Response) => {
    const userId = req.params.id;
    res.status(200).json({
      ok: true,
      data: {
        ...buildLivingWorldPlayer(userId),
        avatar: buildMockAvatar(),
        currencies: buildMockCurrencies(),
        progression: buildMockProgression(),
        collections: MOCK_COLLECTIONS,
      },
    });
  });

  // GET /api/v1/living-world/player/:id/avatar
  router.get("/v1/living-world/player/:id/avatar", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: buildMockAvatar() });
  });

  // GET /api/v1/living-world/player/:id/collections
  router.get("/v1/living-world/player/:id/collections", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: MOCK_COLLECTIONS });
  });

  // GET /api/v1/living-world/player/:id/seasons/current
  router.get("/v1/living-world/player/:id/seasons/current", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: MOCK_CURRENT_SEASON });
  });

  // GET /api/v1/living-world/world/state
  // World state: season, weather, active events, territory activity
  router.get("/v1/living-world/world/state", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: buildMockWorldState() });
  });

  // GET /api/v1/living-world/world/map-layer
  // POI states, decorations, event markers for the map
  router.get("/v1/living-world/world/map-layer", (_req: Request, res: Response) => {
    res.status(200).json({
      ok: true,
      data: {
        season: MOCK_CURRENT_SEASON.key,
        themeConfig: MOCK_CURRENT_SEASON.themeConfig,
        pois: [
          { id: "poi-mina-acosta", name: "Mina de Acosta", status: "EVENT", currentEventId: "evt-mine-open", lat: 20.1869, lng: -98.6653 },
          { id: "poi-plaza",       name: "Plaza Principal",  status: "OPEN",  currentEventId: null, lat: 20.1834, lng: -98.6641 },
          { id: "poi-cementerio",  name: "Panteón",         status: "OPEN",  currentEventId: null, lat: 20.1852, lng: -98.6620 },
          { id: "poi-templo",      name: "Templo San Francisco", status: "OPEN", currentEventId: null, lat: 20.1838, lng: -98.6645 },
        ],
      },
    });
  });

  // GET /api/v1/living-world/events/community-challenges
  router.get("/v1/living-world/events/community-challenges", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: MOCK_COMMUNITY_CHALLENGES });
  });

  // POST /api/v1/living-world/player/action
  // Body: { type, territoryId?, poiId?, payload? }
  // Registers a player event and returns updated currencies + possible unlocks
  router.post("/v1/living-world/player/action", (req: Request, res: Response) => {
    const { type = "UNKNOWN", territoryId = null, poiId = null, payload = {} } = req.body ?? {};

    const xpRewards: Record<string, number> = {
      DISCOVER_POI: 50,
      CAPTURE_PHOTO: 25,
      LISTEN_RADIO: 15,
      ATTEND_EVENT: 75,
      COMPLETE_QUEST: 100,
      SHARE_STORY: 30,
      COLLECT_ITEM: 40,
    };

    const xpAwarded = xpRewards[type] ?? 10;

    res.status(200).json({
      ok: true,
      data: {
        eventId: `evt-${Date.now()}`,
        type,
        territoryId,
        poiId,
        xpAwarded,
        currenciesAwarded: [
          { type: "XP", amount: xpAwarded },
          { type: "COIN", amount: Math.floor(xpAwarded / 5) },
        ],
        possibleUnlock: Math.random() > 0.7 ? {
          itemId: `item-random-${Date.now()}`,
          name: "Fragmento de Historia",
          rarity: "COMMON",
          collectionId: "col-mining-heritage",
        } : null,
        narrativeTrigger: type === "DISCOVER_POI" ? {
          type: "DISCOVERY",
          message: "Has descubierto un nuevo punto de interés. Realito tiene algo que contarte...",
        } : null,
      },
    });
  });
}
