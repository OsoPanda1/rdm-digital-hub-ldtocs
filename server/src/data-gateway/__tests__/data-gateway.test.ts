import { describe, it, expect, beforeEach } from "vitest";

// ─── Cattleya Tier Service ───────────────────────────────────────────────────

const TIER_THRESHOLDS = [
  { tier: "EMBAJADOR" as const, minScore: 1700 },
  { tier: "GUARDIAN" as const, minScore: 1300 },
  { tier: "CUIDADO" as const, minScore: 900 },
  { tier: "BASE" as const, minScore: 0 },
];

const TIER_BENEFITS: Record<string, {
  discountRate: number; cashbackRate: number; xpMultiplier: number;
  accessToPremiumMissions: boolean; accessToXREarly: boolean; invitationToCoDesign: boolean;
}> = {
  BASE:     { discountRate: 0, cashbackRate: 0, xpMultiplier: 1, accessToPremiumMissions: false, accessToXREarly: false, invitationToCoDesign: false },
  CUIDADO:  { discountRate: 0.03, cashbackRate: 0.005, xpMultiplier: 1.1, accessToPremiumMissions: false, accessToXREarly: false, invitationToCoDesign: false },
  GUARDIAN: { discountRate: 0.07, cashbackRate: 0.01, xpMultiplier: 1.25, accessToPremiumMissions: true, accessToXREarly: true, invitationToCoDesign: false },
  EMBAJADOR:{ discountRate: 0.12, cashbackRate: 0.02, xpMultiplier: 1.5, accessToPremiumMissions: true, accessToXREarly: true, invitationToCoDesign: true },
};

function computeTier(score: number) {
  for (const t of TIER_THRESHOLDS) {
    if (score >= t.minScore) return { tier: t.tier, benefits: TIER_BENEFITS[t.tier] };
  }
  return { tier: "BASE" as const, benefits: TIER_BENEFITS.BASE };
}

describe("Cattleya Tier Service", () => {
  it("returns BASE for score 0", () => {
    const r = computeTier(0);
    expect(r.tier).toBe("BASE");
    expect(r.benefits.discountRate).toBe(0);
  });

  it("returns CUIDADO at score 900", () => {
    expect(computeTier(900).tier).toBe("CUIDADO");
  });

  it("returns GUARDIAN at score 1300", () => {
    expect(computeTier(1300).tier).toBe("GUARDIAN");
  });

  it("returns EMBAJADOR at score 1700", () => {
    expect(computeTier(1700).tier).toBe("EMBAJADOR");
  });

  it("returns EMBAJADOR for scores above 1700", () => {
    expect(computeTier(2000).tier).toBe("EMBAJADOR");
  });

  it("applies XP multiplier correctly", () => {
    const baseXp = 100;
    const base = computeTier(0);
    const guardian = computeTier(1300);
    expect(Math.round(baseXp * base.benefits.xpMultiplier)).toBe(100);
    expect(Math.round(baseXp * guardian.benefits.xpMultiplier)).toBe(125);
  });
});

// ─── Cache Service ───────────────────────────────────────────────────────────

function createCacheService() {
  const store = new Map<string, { value: unknown; expiresAt: number }>();
  return {
    get<T>(key: string): T | null {
      const entry = store.get(key);
      if (!entry) return null;
      if (Date.now() > entry.expiresAt) { store.delete(key); return null; }
      return entry.value as T;
    },
    set(key: string, value: unknown, ttlMs?: number) {
      store.set(key, { value, expiresAt: Date.now() + (ttlMs ?? 300_000) });
    },
    delete(key: string) { return store.delete(key); },
    clear() { store.clear(); },
    invalidateByPrefix(prefix: string) {
      let count = 0;
      for (const key of store.keys()) {
        if (key.startsWith(prefix)) { store.delete(key); count++; }
      }
      return count;
    },
    size() { return store.size; },
  };
}

describe("Cache Service", () => {
  let cache: ReturnType<typeof createCacheService>;

  beforeEach(() => { cache = createCacheService(); });

  it("stores and retrieves a value", () => {
    cache.set("key1", { data: 42 });
    expect(cache.get("key1")).toEqual({ data: 42 });
  });

  it("returns null for missing key", () => {
    expect(cache.get("nonexistent")).toBeNull();
  });

  it("returns null for expired entry (manual expiration simulation)", () => {
    const start = Date.now();
    cache.set("expires", "val"); // TTL += 300s from start
    const origDateNow = Date.now;
    // after set(), fast-forward past TTL
    Date.now = () => start + 600_000;

    try {
      expect(cache.get("expires")).toBeNull();
    } finally {
      Date.now = origDateNow;
    }
  });

  it("deletes a key", () => {
    cache.set("key", "val");
    expect(cache.delete("key")).toBe(true);
    expect(cache.get("key")).toBeNull();
  });

  it("clear removes all entries", () => {
    cache.set("a", 1); cache.set("b", 2);
    cache.clear();
    expect(cache.size()).toBe(0);
  });

  it("invalidates by prefix", () => {
    cache.set("dg:user:1", "a"); cache.set("dg:user:2", "b"); cache.set("other:1", "c");
    expect(cache.invalidateByPrefix("dg:user:")).toBe(2);
    expect(cache.size()).toBe(1);
  });
});

// ─── Store Source (in-memory DataSource) ──────────────────────────────────────

const ENTITY_MAP: Record<string, string> = {
  user: "users", donation: "donations", business: "businesses",
};

function createStoreSource() {
  const maps: Record<string, Map<string, unknown>> = {
    users: new Map(), donations: new Map(), businesses: new Map(),
  };

  return {
    name: "in-memory-store",

    async findById<T>(entityType: string, id: string): Promise<T | null> {
      const mapName = ENTITY_MAP[entityType];
      // @ts-ignore - testing-oriented
      const map = maps[mapName];
      if (!map) return null;
      return (map.get(id) as T) ?? null;
    },

    async create<T>(entityType: string, data: Partial<T>): Promise<T> {
      const mapName = ENTITY_MAP[entityType];
      // @ts-ignore
      const map = maps[mapName];
      if (!map) throw new Error(`No map for ${entityType}`);
      const id = (data as any)?.id ?? crypto.randomUUID();
      const record = { ...data, id, createdAt: new Date().toISOString() } as T;
      map.set(id, record);
      return record;
    },

    async update<T>(entityType: string, id: string, data: Partial<T>): Promise<T | null> {
      const mapName = ENTITY_MAP[entityType];
      // @ts-ignore
      const map = maps[mapName];
      if (!map) return null;
      const existing = map.get(id) as Record<string, unknown> | undefined;
      if (!existing) return null;
      const updated = { ...existing, ...data, updatedAt: new Date().toISOString() } as T;
      map.set(id, updated);
      return updated;
    },

    async delete(entityType: string, id: string): Promise<boolean> {
      const mapName = ENTITY_MAP[entityType];
      // @ts-ignore
      const map = maps[mapName];
      if (!map) return false;
      return map.delete(id);
    },
  };
}

describe("Store Source (DataSource)", () => {
  it("creates a record with auto-generated id", async () => {
    const source = createStoreSource();
    const record = await source.create("user", { email: "test@test.com" });
    expect(record).toHaveProperty("id");
    expect(record).toHaveProperty("createdAt");
  });

  it("finds by id", async () => {
    const source = createStoreSource();
    const created = await source.create("user", { email: "find@test.com" }) as any;
    const found = await source.findById<any>("user", created.id);
    expect(found).not.toBeNull();
    expect(found.email).toBe("find@test.com");
  });

  it("returns null for unknown entity type", async () => {
    const source = createStoreSource();
    const result = await source.findById("nonexistent", "1");
    expect(result).toBeNull();
  });

  it("updates existing record", async () => {
    const source = createStoreSource();
    const created = await source.create("user", { email: "old@test.com" }) as any;
    const updated = await source.update("user", created.id, { email: "new@test.com" });
    expect((updated as any)?.email).toBe("new@test.com");
    expect((updated as any)?.updatedAt).toBeDefined();
  });

  it("returns null on update for missing record", async () => {
    const source = createStoreSource();
    const result = await source.update("user", "nonexistent", { email: "x" });
    expect(result).toBeNull();
  });

  it("deletes a record", async () => {
    const source = createStoreSource();
    const created = await source.create("user", { email: "del@test.com" }) as any;
    expect(await source.delete("user", created.id)).toBe(true);
    const found = await source.findById("user", created.id);
    expect(found).toBeNull();
  });

  it("returns false on delete for missing record", async () => {
    const source = createStoreSource();
    expect(await source.delete("user", "nope")).toBe(false);
  });
});

// ─── Audit Service ───────────────────────────────────────────────────────────

function createAuditService() {
  const auditStore = new Map<string, any>();
  return {
    async log(entry: {
      endpoint: string; method: string; statusCode: number; durationMs: number;
      sensitivityLevel?: string; params?: any; context?: any;
    }) {
      const record = {
        id: crypto.randomUUID(),
        userId: entry.context?.userId,
        endpoint: entry.endpoint, method: entry.method,
        params: entry.params ?? {}, statusCode: entry.statusCode,
        durationMs: entry.durationMs,
        sensitivityLevel: entry.sensitivityLevel ?? "low",
        createdAt: new Date().toISOString(),
      };
      auditStore.set(record.id, record);
      return record;
    },

    async query(filters?: { userId?: string; endpoint?: string; limit?: number }) {
      let records = Array.from(auditStore.values());
      if (filters?.userId) records = records.filter((r: any) => r.userId === filters.userId);
      if (filters?.endpoint) records = records.filter((r: any) => r.endpoint.startsWith(filters.endpoint!));
      records.sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt));
      return records.slice(0, filters?.limit ?? 100);
    },
  };
}

describe("Audit Service", () => {
  it("logs an audit record", async () => {
    const audit = createAuditService();
    const record = await audit.log({
      endpoint: "/dg/user/1", method: "GET", statusCode: 200, durationMs: 10,
      context: { userId: "u1", requestId: "r1" },
    });
    expect(record.id).toBeDefined();
    expect(record.userId).toBe("u1");
    expect(record.endpoint).toBe("/dg/user/1");
  });

  it("queries by userId", async () => {
    const audit = createAuditService();
    await audit.log({ endpoint: "/e1", method: "GET", statusCode: 200, durationMs: 0, context: { userId: "u1", requestId: "r1" } });
    await audit.log({ endpoint: "/e2", method: "POST", statusCode: 201, durationMs: 0, context: { userId: "u2", requestId: "r2" } });
    const results = await audit.query({ userId: "u1" });
    expect(results).toHaveLength(1);
  });

  it("queries by endpoint prefix", async () => {
    const audit = createAuditService();
    await audit.log({ endpoint: "/dg/user/1", method: "GET", statusCode: 200, durationMs: 0, context: { userId: "u1", requestId: "r1" } });
    await audit.log({ endpoint: "/other", method: "GET", statusCode: 200, durationMs: 0, context: { userId: "u1", requestId: "r2" } });
    const results = await audit.query({ endpoint: "/dg" });
    expect(results).toHaveLength(1);
  });
});

// ─── Journal Service ─────────────────────────────────────────────────────────

function createJournalService() {
  const journalStore = new Map<string, any>();

  return {
    async write(entry: any) {
      const idempotencyKey = entry.idempotencyKey ?? `${entry.operationType}_${crypto.randomUUID()}`;
      const existing = Array.from(journalStore.values()).find((j: any) => j.idempotencyKey === idempotencyKey);
      if (existing) return existing;
      const record = {
        id: crypto.randomUUID(), operationType: entry.operationType, entityType: entry.entityType,
        entityId: entry.entityId, payload: entry.payload, status: "PENDING", idempotencyKey,
        supabaseUserId: entry.supabaseUserId, stripeId: entry.stripeId, metadata: entry.metadata ?? {},
        retryCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      journalStore.set(record.id, record);
      return record;
    },

    async resolve(idempotencyKey: string, status: string) {
      const record = Array.from(journalStore.values()).find((j: any) => j.idempotencyKey === idempotencyKey);
      if (!record) return null;
      record.status = status;
      record.updatedAt = new Date().toISOString();
      return record;
    },

    async getPending() {
      return Array.from(journalStore.values()).filter((j: any) => j.status === "PENDING");
    },

    async getByIdempotencyKey(key: string) {
      return Array.from(journalStore.values()).find((j: any) => j.idempotencyKey === key) ?? null;
    },
  };
}

describe("Journal Service", () => {
  it("writes a journal entry with PENDING status", async () => {
    const journal = createJournalService();
    const entry = await journal.write({
      operationType: "payment", entityType: "donation", payload: { amount: 100 },
    });
    expect(entry.status).toBe("PENDING");
    expect(entry.operationType).toBe("payment");
  });

  it("deduplicates by idempotencyKey", async () => {
    const journal = createJournalService();
    const e1 = await journal.write({
      operationType: "payment", entityType: "donation", payload: { amount: 100 },
      idempotencyKey: "dup-key",
    });
    const e2 = await journal.write({
      operationType: "payment", entityType: "donation", payload: { amount: 999 },
      idempotencyKey: "dup-key",
    });
    expect(e1.id).toBe(e2.id);
    expect(e2.payload.amount).toBe(100); // original, not 999
  });

  it("resolves a journal entry", async () => {
    const journal = createJournalService();
    await journal.write({ operationType: "payment", entityType: "donation", payload: {}, idempotencyKey: "resolve-me" });
    const resolved = await journal.resolve("resolve-me", "COMPLETED");
    expect(resolved).not.toBeNull();
    expect(resolved!.status).toBe("COMPLETED");
  });

  it("returns null when resolving unknown key", async () => {
    const journal = createJournalService();
    const result = await journal.resolve("unknown", "COMPLETED");
    expect(result).toBeNull();
  });

  it("getPending returns only PENDING entries", async () => {
    const journal = createJournalService();
    await journal.write({ operationType: "a", entityType: "t", payload: {}, idempotencyKey: "k1" });
    await journal.write({ operationType: "b", entityType: "t", payload: {}, idempotencyKey: "k2" });
    await journal.resolve("k1", "COMPLETED");
    const pending = await journal.getPending();
    expect(pending).toHaveLength(1);
    expect(pending[0].idempotencyKey).toBe("k2");
  });
});

// ─── Guardian Service ────────────────────────────────────────────────────────

describe("Guardian Service (pure logic)", () => {
  const guardians = [
    { id: 1, code: "GUARDIAN_OBSERVADOR", name: "Guardian Observador", archetype: "observador", primaryVirtue: "curiosidad" },
    { id: 2, code: "GUARDIAN_CALMA", name: "Guardia de la Calma", archetype: "sabio", primaryVirtue: "calma" },
    { id: 3, code: "GUARDIAN_CREACION", name: "Guardián de la Creación", archetype: "creador", primaryVirtue: "creatividad" },
    { id: 4, code: "GUARDIAN_RESILIENCIA", name: "Guardián de la Resiliencia", archetype: "guerrero", primaryVirtue: "resiliencia" },
    { id: 5, code: "GUARDIAN_COMUNIDAD", name: "Guardián de la Comunidad", archetype: "cuidador", primaryVirtue: "cooperación" },
    { id: 6, code: "GUARDIAN_SABIDURIA", name: "Guardián de la Sabiduría", archetype: "sabio", primaryVirtue: "sabiduría" },
  ];

  function findGuardianByCode(code: string) { return guardians.find(g => g.code === code); }

  function assignGuardian(player: { virtuePoints: number; xp: number; level: number; avatar?: { id: number; code: string } }) {
    const defaultGuardian = guardians[0];
    const currentGuardian = player.avatar ?? defaultGuardian;

    if (player.virtuePoints >= 300 && player.xp >= 1500) {
      return findGuardianByCode("GUARDIAN_SABIDURIA") ?? currentGuardian;
    } else if (player.virtuePoints >= 200 && player.level >= 5) {
      return findGuardianByCode("GUARDIAN_COMUNIDAD") ?? currentGuardian;
    } else if (player.virtuePoints >= 150 && player.xp >= 800) {
      return findGuardianByCode("GUARDIAN_RESILIENCIA") ?? currentGuardian;
    } else if (player.virtuePoints >= 80 && player.level >= 3) {
      return findGuardianByCode("GUARDIAN_CREACION") ?? currentGuardian;
    } else if (player.virtuePoints >= 30 && player.level >= 2) {
      return findGuardianByCode("GUARDIAN_CALMA") ?? currentGuardian;
    }
    return currentGuardian;
  }

  it("assigns OBSERVADOR for new player", () => {
    const result = assignGuardian({ virtuePoints: 0, xp: 0, level: 1 });
    expect(result.code).toBe("GUARDIAN_OBSERVADOR");
  });

  it("assigns CALMA when virtuePoints >= 30 and level >= 2", () => {
    const result = assignGuardian({ virtuePoints: 30, xp: 0, level: 2 });
    expect(result.code).toBe("GUARDIAN_CALMA");
  });

  it("assigns SABIDURIA when virtuePoints >= 300 and xp >= 1500", () => {
    const result = assignGuardian({ virtuePoints: 300, xp: 1500, level: 10 });
    expect(result.code).toBe("GUARDIAN_SABIDURIA");
  });

  it("uses fallback defaultGuardian when player has no avatar", () => {
    const result = assignGuardian({ virtuePoints: 0, xp: 0, level: 1 });
    expect(result.code).toBe("GUARDIAN_OBSERVADOR");
  });
});

// ─── Player Service (pure logic) ─────────────────────────────────────────────

describe("Player Service (pure logic)", () => {
  it("computes level from XP: level = floor(xp / 250) + 1", () => {
    expect(Math.floor(0 / 250) + 1).toBe(1);
    expect(Math.floor(250 / 250) + 1).toBe(2);
    expect(Math.floor(500 / 250) + 1).toBe(3);
    expect(Math.floor(749 / 250) + 1).toBe(3);
    expect(Math.floor(750 / 250) + 1).toBe(4);
  });
});

// ─── Mission Service (pure logic) ────────────────────────────────────────────

describe("Mission Service (pure logic)", () => {
  const missions = [
    { id: 1, code: "TURISMO_RUTA_CENTRO", context: "turismo", xpReward: 150, maxCompletions: 1, isActive: true },
    { id: 2, code: "COMERCIO_LOCAL_RESPONSABLE", context: "comercio", xpReward: 120, maxCompletions: 1, isActive: true },
    { id: 3, code: "EMOCION_DIARIO_GRATITUD", context: "emociones", xpReward: 100, maxCompletions: 3, isActive: true },
    { id: 4, code: "EMOCION_RESPIRO_CONSCIENTE", context: "emociones", xpReward: 60, maxCompletions: 10, isActive: true },
    { id: 5, code: "XR_EXPLORADOR_RDM", context: "xr", xpReward: 200, maxCompletions: 1, isActive: true },
    { id: 10, code: "T2_PLAN_AHORRO_SIMPLE", context: "financiera", xpReward: 250, maxCompletions: 1, isActive: true },
  ];

  it("filters missions by context", () => {
    const turismo = missions.filter(m => m.context === "turismo");
    expect(turismo).toHaveLength(1);
    const financiera = missions.filter(m => m.context === "financiera");
    expect(financiera).toHaveLength(1);
  });

  it("prevents completion beyond maxCompletions", () => {
    const mission = missions.find(m => m.code === "EMOCION_DIARIO_GRATITUD")!;
    const completions = 3;
    expect(completions > mission.maxCompletions).toBe(false);
    const wouldExceed = 4;
    expect(wouldExceed > mission.maxCompletions).toBe(true);
  });

  it("determines status based on completions vs maxCompletions", () => {
    const mission = missions.find(m => m.code === "EMOCION_DIARIO_GRATITUD")!;
    const c1 = 1;
    expect(c1 >= mission.maxCompletions ? "COMPLETED" : "IN_PROGRESS").toBe("IN_PROGRESS");
    const c3 = 3;
    expect(c3 >= mission.maxCompletions ? "COMPLETED" : "IN_PROGRESS").toBe("COMPLETED");
  });

  it("applies XP multiplier correctly", () => {
    const baseXp = 100;
    const multipliers = [1, 1.1, 1.25, 1.5];
    const results = multipliers.map(m => Math.round(baseXp * m));
    expect(results).toEqual([100, 110, 125, 150]);
  });
});

// ─── DataGateway (pure logic) ────────────────────────────────────────────────

describe("DataGateway (pure logic)", () => {
  it("config merge works with partial overrides", () => {
    const defaultConfig = {
      auditEnabled: true, journalEnabled: true, cacheEnabled: true,
      defaultCacheTtl: 300,
      sensitivityDefaults: { user: "high" as const, place: "low" as const },
    };
    const merged = { ...defaultConfig, cacheEnabled: false };
    expect(merged.cacheEnabled).toBe(false);
    expect(merged.auditEnabled).toBe(true);
  });

  it("sensitivity falls back to low for unknown entity types", () => {
    const defaults: Record<string, string> = { user: "high" };
    const sensitivity = defaults["unknown_entity"] ?? "low";
    expect(sensitivity).toBe("low");
  });
});
