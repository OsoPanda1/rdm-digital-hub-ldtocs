-- RDM Living World — Initial Schema Migration
-- Generated from artifacts/api-server/src/db/schema.ts
-- ADR-001: Gamification & Living World
-- ADR-003: Economy & Prestige

-- ═══════════════════════════════════════════════════════════════
--  1. PLAYERS & AVATARS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE "players" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "external_id" text NOT NULL UNIQUE,
  "display_name" text NOT NULL,
  "home_territory_id" uuid,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "last_seen_at" timestamp with time zone
);

CREATE TABLE "player_avatars" (
  "player_id" uuid PRIMARY KEY REFERENCES "players"("id") ON DELETE CASCADE,
  "body_type" text NOT NULL DEFAULT 'default',
  "hair_style" text NOT NULL DEFAULT 'short',
  "skin_tone" text NOT NULL DEFAULT 'medium',
  "base_outfit_id" uuid,
  "equipped_head_item_id" uuid,
  "equipped_torso_item_id" uuid,
  "equipped_legs_item_id" uuid,
  "equipped_feet_item_id" uuid,
  "equipped_pet_item_id" uuid,
  "equipped_special_item_id" uuid,
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
--  2. TERRITORIES & POI
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE "territories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "type" text NOT NULL,
  "parent_territory_id" uuid,
  "lat" real,
  "lng" real,
  "meta_json" jsonb NOT NULL DEFAULT '{}'
);

ALTER TABLE "players" ADD FOREIGN KEY ("home_territory_id") REFERENCES "territories"("id");

CREATE TABLE "poi_state" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "territory_id" uuid NOT NULL REFERENCES "territories"("id") ON DELETE CASCADE,
  "status" text NOT NULL DEFAULT 'OPEN',
  "current_event_id" uuid,
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
--  3. SEASONS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE "seasons" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "start_at" timestamp with time zone NOT NULL,
  "end_at" timestamp with time zone NOT NULL,
  "theme_config_json" jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE "player_seasons" (
  "player_id" uuid NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
  "season_id" uuid NOT NULL REFERENCES "seasons"("id") ON DELETE CASCADE,
  "progress_score" integer NOT NULL DEFAULT 0,
  "rewards_claimed_json" jsonb NOT NULL DEFAULT '{}',
  PRIMARY KEY ("player_id", "season_id")
);

CREATE TABLE "world_state_snapshots" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "captured_at" timestamp with time zone NOT NULL DEFAULT now(),
  "season_id" uuid NOT NULL REFERENCES "seasons"("id"),
  "weather" text NOT NULL DEFAULT 'SUNNY',
  "temperature" integer NOT NULL DEFAULT 18,
  "events_summary_json" jsonb NOT NULL DEFAULT '{}'
);

-- ═══════════════════════════════════════════════════════════════
--  4. CURRENCIES & PROGRESSION
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE "player_currencies" (
  "player_id" uuid NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
  "currency_type" text NOT NULL,
  "amount" bigint NOT NULL DEFAULT 0,
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY ("player_id", "currency_type")
);

CREATE TABLE "progression_branches" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text NOT NULL
);

CREATE TABLE "player_progressions" (
  "player_id" uuid NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
  "branch_id" uuid NOT NULL REFERENCES "progression_branches"("id") ON DELETE CASCADE,
  "level" integer NOT NULL DEFAULT 0,
  "points_allocated" integer NOT NULL DEFAULT 0,
  "xp_in_branch" bigint NOT NULL DEFAULT 0,
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY ("player_id", "branch_id")
);

-- ═══════════════════════════════════════════════════════════════
--  5. ITEMS & COLLECTIONS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE "items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "description" text NOT NULL,
  "category" text NOT NULL,
  "rarity" text NOT NULL,
  "icon_url" text,
  "model_url" text,
  "territory_id" uuid REFERENCES "territories"("id"),
  "season_id" uuid REFERENCES "seasons"("id"),
  "is_avatar_cosmetic" boolean NOT NULL DEFAULT false,
  "is_collection_item" boolean NOT NULL DEFAULT true,
  "is_story_trigger" boolean NOT NULL DEFAULT false
);

CREATE TABLE "collections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "category" text NOT NULL,
  "season_id" uuid REFERENCES "seasons"("id")
);

CREATE TABLE "collection_items" (
  "collection_id" uuid NOT NULL REFERENCES "collections"("id") ON DELETE CASCADE,
  "item_id" uuid NOT NULL REFERENCES "items"("id") ON DELETE CASCADE,
  "order_index" integer NOT NULL DEFAULT 0,
  PRIMARY KEY ("collection_id", "item_id")
);

CREATE TABLE "player_items" (
  "player_id" uuid NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
  "item_id" uuid NOT NULL REFERENCES "items"("id") ON DELETE CASCADE,
  "obtained_at" timestamp with time zone NOT NULL DEFAULT now(),
  "source_event_id" uuid,
  PRIMARY KEY ("player_id", "item_id")
);

CREATE TABLE "player_collections" (
  "player_id" uuid NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
  "collection_id" uuid NOT NULL REFERENCES "collections"("id") ON DELETE CASCADE,
  "progress_percentage" integer NOT NULL DEFAULT 0,
  "completed_at" timestamp with time zone,
  PRIMARY KEY ("player_id", "collection_id")
);

-- ═══════════════════════════════════════════════════════════════
--  6. EVENTS (core of Living World)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE "player_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "player_id" uuid NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
  "type" text NOT NULL,
  "territory_id" uuid REFERENCES "territories"("id"),
  "poi_id" uuid REFERENCES "poi_state"("id"),
  "season_id" uuid REFERENCES "seasons"("id"),
  "payload_json" jsonb NOT NULL DEFAULT '{}',
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE "world_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "type" text NOT NULL,
  "territory_id" uuid REFERENCES "territories"("id"),
  "season_id" uuid NOT NULL REFERENCES "seasons"("id"),
  "payload_json" jsonb NOT NULL DEFAULT '{}',
  "starts_at" timestamp with time zone NOT NULL,
  "ends_at" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE "community_challenges" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "goal_type" text NOT NULL,
  "goal_target" bigint NOT NULL,
  "current_progress" bigint NOT NULL DEFAULT 0,
  "season_id" uuid NOT NULL REFERENCES "seasons"("id"),
  "starts_at" timestamp with time zone NOT NULL,
  "ends_at" timestamp with time zone NOT NULL
);

CREATE TABLE "community_challenge_events" (
  "challenge_id" uuid NOT NULL REFERENCES "community_challenges"("id") ON DELETE CASCADE,
  "world_event_id" uuid NOT NULL REFERENCES "world_events"("id") ON DELETE CASCADE,
  "increment_value" bigint NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY ("challenge_id", "world_event_id")
);

-- ═══════════════════════════════════════════════════════════════
--  7. NARRATIVE
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE "narrative_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "player_id" uuid NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
  "character_key" text NOT NULL,
  "type" text NOT NULL,
  "content_json" jsonb NOT NULL,
  "related_event_id" uuid,
  "season_id" uuid REFERENCES "seasons"("id"),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "read_at" timestamp with time zone
);

-- ═══════════════════════════════════════════════════════════════
--  8. ISABELLA AI
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE "isabella_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "player_id" uuid NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
  "status" text NOT NULL DEFAULT 'active',
  "message_count" integer NOT NULL DEFAULT 0,
  "started_at" timestamp with time zone NOT NULL DEFAULT now(),
  "last_message_at" timestamp with time zone,
  "closed_at" timestamp with time zone
);

CREATE TABLE "isabella_decisions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "player_id" uuid NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
  "session_id" uuid REFERENCES "isabella_sessions"("id") ON DELETE SET NULL,
  "type" text NOT NULL,
  "confidence" integer NOT NULL DEFAULT 85,
  "territory_id" uuid REFERENCES "territories"("id"),
  "payload_json" jsonb NOT NULL DEFAULT '{}',
  "mode" text NOT NULL DEFAULT 'NORMAL',
  "guardian_verdict_json" jsonb,
  "evaluation_json" jsonb,
  "bias_detected" boolean NOT NULL DEFAULT false,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE "isabella_feedback" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "player_id" uuid NOT NULL REFERENCES "players"("id") ON DELETE CASCADE,
  "decision_id" uuid NOT NULL REFERENCES "isabella_decisions"("id") ON DELETE CASCADE,
  "rating" integer NOT NULL,
  "comment" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE "isabella_knowledge" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "domain" text NOT NULL DEFAULT 'ecosystem',
  "topic" text NOT NULL,
  "content" text NOT NULL,
  "keywords" jsonb NOT NULL DEFAULT '[]',
  "category" text NOT NULL DEFAULT 'general',
  "priority" integer NOT NULL DEFAULT 5,
  "source" text NOT NULL DEFAULT 'manual',
  "confidence" integer NOT NULL DEFAULT 80,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
--  9. ISABELLA MEMORY ENGINE
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE "isabella_memory" (
  "id" text PRIMARY KEY,
  "type" text NOT NULL,
  "content" text NOT NULL,
  "tags" jsonb NOT NULL DEFAULT '[]',
  "source" text NOT NULL DEFAULT 'system',
  "ttl" integer NOT NULL DEFAULT 0,
  "confidence" integer NOT NULL DEFAULT 80,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
--  10. ISABELLA EVALUATION RESULTS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE "isabella_evaluation_results" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "metric" text NOT NULL,
  "score" integer NOT NULL,
  "threshold" integer NOT NULL,
  "passed" boolean NOT NULL,
  "details" text NOT NULL DEFAULT '',
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
