// artifacts/api-server/src/db/schema.ts
// RDM Living World — Drizzle ORM schema for Supabase/Postgres
// ADR-001: docs/adr/001-rdm-living-world-gamification.md
// ADR-003: docs/adr/003-economia-prestigio-territorial.md

import {
  pgTable,
  uuid,
  text,
  integer,
  bigint,
  timestamp,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ═══════════════════════════════════════════════════════════════════════════════
//  1. PLAYERS & AVATARS
// ═══════════════════════════════════════════════════════════════════════════════

export const players = pgTable("players", {
  id: uuid("id").defaultRandom().primaryKey(),
  externalId: text("external_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  homeTerritoryId: uuid("home_territory_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
});

export const playerAvatars = pgTable("player_avatars", {
  playerId: uuid("player_id")
    .primaryKey()
    .references(() => players.id, { onDelete: "cascade" }),
  bodyType: text("body_type").notNull().default("default"),
  hairStyle: text("hair_style").notNull().default("short"),
  skinTone: text("skin_tone").notNull().default("medium"),
  baseOutfitId: uuid("base_outfit_id"),
  equippedHeadItemId: uuid("equipped_head_item_id"),
  equippedTorsoItemId: uuid("equipped_torso_item_id"),
  equippedLegsItemId: uuid("equipped_legs_item_id"),
  equippedFeetItemId: uuid("equipped_feet_item_id"),
  equippedPetItemId: uuid("equipped_pet_item_id"),
  equippedSpecialItemId: uuid("equipped_special_item_id"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
//  2. TERRITORIES & POI
// ═══════════════════════════════════════════════════════════════════════════════

export const territories = pgTable("territories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // TOWN, DISTRICT, POI
  parentTerritoryId: uuid("parent_territory_id"),
  lat: bigint("lat", { mode: "number" }),
  lng: bigint("lng", { mode: "number" }),
  metaJson: jsonb("meta_json").notNull().default("{}"),
});

export const poiState = pgTable("poi_state", {
  id: uuid("id").defaultRandom().primaryKey(),
  territoryId: uuid("territory_id")
    .notNull()
    .references(() => territories.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("OPEN"), // OPEN, CLOSED, EVENT, MAINTENANCE
  currentEventId: uuid("current_event_id"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ═══════════════════════════════════════════════════════════════════════════════
//  3. SEASONS
// ═══════════════════════════════════════════════════════════════════════════════

export const seasons = pgTable("seasons", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  themeConfigJson: jsonb("theme_config_json").notNull().default("{}"),
});

export const playerSeasons = pgTable(
  "player_seasons",
  {
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id, { onDelete: "cascade" }),
    progressScore: integer("progress_score").notNull().default(0),
    rewardsClaimedJson: jsonb("rewards_claimed_json")
      .notNull()
      .default("{}"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.playerId, table.seasonId] }),
  }),
);

export const worldStateSnapshots = pgTable("world_state_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  capturedAt: timestamp("captured_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  seasonId: uuid("season_id")
    .notNull()
    .references(() => seasons.id),
  weather: text("weather").notNull().default("SUNNY"),
  temperature: integer("temperature").notNull().default(18),
  eventsSummaryJson: jsonb("events_summary_json").notNull().default("{}"),
});

// ═══════════════════════════════════════════════════════════════════════════════
//  4. CURRENCIES & PROGRESSION (ADR-003)
// ═══════════════════════════════════════════════════════════════════════════════

export const playerCurrencies = pgTable(
  "player_currencies",
  {
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    currencyType: text("currency_type").notNull(),
    amount: bigint("amount", { mode: "number" }).notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.playerId, table.currencyType] }),
  }),
);

export const progressionBranches = pgTable("progression_branches", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const playerProgressions = pgTable(
  "player_progressions",
  {
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => progressionBranches.id, { onDelete: "cascade" }),
    level: integer("level").notNull().default(0),
    pointsAllocated: integer("points_allocated").notNull().default(0),
    xpInBranch: bigint("xp_in_branch", { mode: "number" })
      .notNull()
      .default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.playerId, table.branchId] }),
  }),
);

// ═══════════════════════════════════════════════════════════════════════════════
//  5. ITEMS & COLLECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const items = pgTable("items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  rarity: text("rarity").notNull(),
  iconUrl: text("icon_url"),
  modelUrl: text("model_url"),
  territoryId: uuid("territory_id").references(() => territories.id),
  seasonId: uuid("season_id").references(() => seasons.id),
  isAvatarCosmetic: integer("is_avatar_cosmetic").notNull().default(0),
  isCollectionItem: integer("is_collection_item").notNull().default(1),
  isStoryTrigger: integer("is_story_trigger").notNull().default(0),
});

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  seasonId: uuid("season_id").references(() => seasons.id),
});

export const collectionItems = pgTable(
  "collection_items",
  {
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    orderIndex: integer("order_index").notNull().default(0),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.itemId] }),
  }),
);

export const playerItems = pgTable(
  "player_items",
  {
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    obtainedAt: timestamp("obtained_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    sourceEventId: uuid("source_event_id"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.playerId, table.itemId] }),
  }),
);

export const playerCollections = pgTable(
  "player_collections",
  {
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    progressPercentage: integer("progress_percentage")
      .notNull()
      .default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.playerId, table.collectionId] }),
  }),
);

// ═══════════════════════════════════════════════════════════════════════════════
//  6. EVENTS (core of Living World)
// ═══════════════════════════════════════════════════════════════════════════════

export const playerEvents = pgTable("player_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  playerId: uuid("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  territoryId: uuid("territory_id").references(() => territories.id),
  poiId: uuid("poi_id").references(() => poiState.id),
  seasonId: uuid("season_id").references(() => seasons.id),
  payloadJson: jsonb("payload_json").notNull().default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const worldEvents = pgTable("world_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type").notNull(),
  territoryId: uuid("territory_id").references(() => territories.id),
  seasonId: uuid("season_id")
    .notNull()
    .references(() => seasons.id),
  payloadJson: jsonb("payload_json").notNull().default("{}"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const communityChallenges = pgTable("community_challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  goalType: text("goal_type").notNull(),
  goalTarget: bigint("goal_target", { mode: "number" }).notNull(),
  currentProgress: bigint("current_progress", { mode: "number" })
    .notNull()
    .default(0),
  seasonId: uuid("season_id")
    .notNull()
    .references(() => seasons.id),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
});

export const communityChallengeEvents = pgTable(
  "community_challenge_events",
  {
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => communityChallenges.id, { onDelete: "cascade" }),
    worldEventId: uuid("world_event_id")
      .notNull()
      .references(() => worldEvents.id, { onDelete: "cascade" }),
    incrementValue: bigint("increment_value", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.challengeId, table.worldEventId] }),
  }),
);

// ═══════════════════════════════════════════════════════════════════════════════
//  7. NARRATIVE (Realito / Isabella)
// ═══════════════════════════════════════════════════════════════════════════════

export const narrativeMessages = pgTable("narrative_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  playerId: uuid("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  characterKey: text("character_key").notNull(),
  type: text("type").notNull(),
  contentJson: jsonb("content_json").notNull(),
  relatedEventId: uuid("related_event_id"),
  seasonId: uuid("season_id").references(() => seasons.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
});

// ═══════════════════════════════════════════════════════════════════════════════
//  RELATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const playersRelations = relations(players, ({ one, many }) => ({
  avatar: one(playerAvatars, {
    fields: [players.id],
    references: [playerAvatars.playerId],
  }),
  currencies: many(playerCurrencies),
  progressions: many(playerProgressions),
  items: many(playerItems),
  collections: many(playerCollections),
  seasons: many(playerSeasons),
  events: many(playerEvents),
  narrativeMessages: many(narrativeMessages),
}));

export const territoriesRelations = relations(territories, ({ one, many }) => ({
  parent: one(territories, {
    fields: [territories.parentTerritoryId],
    references: [territories.id],
    relationName: "territoryHierarchy",
  }),
  children: many(territories, { relationName: "territoryHierarchy" }),
  poiStates: many(poiState),
}));

export const seasonsRelations = relations(seasons, ({ many }) => ({
  playerSeasons: many(playerSeasons),
  worldEvents: many(worldEvents),
  items: many(items),
  collections: many(collections),
  worldStateSnapshots: many(worldStateSnapshots),
}));

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  season: one(seasons, {
    fields: [collections.seasonId],
    references: [seasons.id],
  }),
  collectionItems: many(collectionItems),
}));

export const itemsRelations = relations(items, ({ many }) => ({
  collectionItems: many(collectionItems),
  playerItems: many(playerItems),
}));

export const narrativeMessagesRelations = relations(
  narrativeMessages,
  ({ one }) => ({
    player: one(players, {
      fields: [narrativeMessages.playerId],
      references: [players.id],
    }),
    season: one(seasons, {
      fields: [narrativeMessages.seasonId],
      references: [seasons.id],
    }),
  }),
);
