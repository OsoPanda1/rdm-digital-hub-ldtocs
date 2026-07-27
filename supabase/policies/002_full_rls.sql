-- ══════════════════════════════════════════════════════════════════════════════
-- RDM Digital Hub — Complete RLS Policies (26 tables)
-- ══════════════════════════════════════════════════════════════════════════════
--
-- PATTERN: Player-owned data uses the join:
--   EXISTS (SELECT 1 FROM players WHERE players.id = <table>.player_id
--           AND players.external_id = auth.uid()::text)
--
-- PATTERN: Public config data uses USING (true) for SELECT only.
-- PATTERN: Admin-only data checks JWT app_metadata for admin/federation_auditor role.
--
-- Apply AFTER 001_dpa_rls.sql baseline. This file is idempotent-safe.
-- ══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. PLAYERS (identity table)
-- ─────────────────────────────────────────────────────────────────────────────
-- Already has RLS + policies from 001_dpa_rls.sql.
-- Add INSERT policy for self-registration:
create policy if not exists players_self_insert on players for insert
  with check (external_id = auth.uid()::text);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PLAYER AVATARS
-- ─────────────────────────────────────────────────────────────────────────────
-- Already has full CRUD policy from 001_dpa_rls.sql. No changes needed.

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. PLAYER CURRENCIES
-- ─────────────────────────────────────────────────────────────────────────────
-- Baseline has SELECT only. Add INSERT/UPDATE for game engine:
create policy if not exists player_currencies_self_insert on player_currencies for insert
  with check (
    exists (select 1 from players where players.id = player_currencies.player_id
            and players.external_id = auth.uid()::text)
  );

create policy if not exists player_currencies_self_update on player_currencies for update
  using (
    exists (select 1 from players where players.id = player_currencies.player_id
            and players.external_id = auth.uid()::text)
  )
  with check (
    exists (select 1 from players where players.id = player_currencies.player_id
            and players.external_id = auth.uid()::text)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. PLAYER PROGRESSIONS
-- ─────────────────────────────────────────────────────────────────────────────
alter table if exists player_progressions enable row level security;

create policy if not exists player_progressions_self on player_progressions for all
  using (
    exists (select 1 from players where players.id = player_progressions.player_id
            and players.external_id = auth.uid()::text)
  )
  with check (
    exists (select 1 from players where players.id = player_progressions.player_id
            and players.external_id = auth.uid()::text)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. PLAYER SEASONS
-- ─────────────────────────────────────────────────────────────────────────────
alter table if exists player_seasons enable row level security;

create policy if not exists player_seasons_self on player_seasons for all
  using (
    exists (select 1 from players where players.id = player_seasons.player_id
            and players.external_id = auth.uid()::text)
  )
  with check (
    exists (select 1 from players where players.id = player_seasons.player_id
            and players.external_id = auth.uid()::text)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. PLAYER ITEMS
-- ─────────────────────────────────────────────────────────────────────────────
alter table if exists player_items enable row level security;

create policy if not exists player_items_self on player_items for all
  using (
    exists (select 1 from players where players.id = player_items.player_id
            and players.external_id = auth.uid()::text)
  )
  with check (
    exists (select 1 from players where players.id = player_items.player_id
            and players.external_id = auth.uid()::text)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. PLAYER COLLECTIONS
-- ─────────────────────────────────────────────────────────────────────────────
alter table if exists player_collections enable row level security;

create policy if not exists player_collections_self on player_collections for all
  using (
    exists (select 1 from players where players.id = player_collections.player_id
            and players.external_id = auth.uid()::text)
  )
  with check (
    exists (select 1 from players where players.id = player_collections.player_id
            and players.external_id = auth.uid()::text)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. PLAYER EVENTS (activity log)
-- ─────────────────────────────────────────────────────────────────────────────
alter table if exists player_events enable row level security;

-- Players can read their own events; inserts come from server-side only
create policy if not exists player_events_self_select on player_events for select
  using (
    exists (select 1 from players where players.id = player_events.player_id
            and players.external_id = auth.uid()::text)
  );

-- Server-side inserts use service_role (bypasses RLS). No user INSERT policy.

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. NARRATIVE MESSAGES
-- ─────────────────────────────────────────────────────────────────────────────
alter table if exists narrative_messages enable row level security;

create policy if not exists narrative_messages_self on narrative_messages for all
  using (
    exists (select 1 from players where players.id = narrative_messages.player_id
            and players.external_id = auth.uid()::text)
  )
  with check (
    exists (select 1 from players where players.id = narrative_messages.player_id
            and players.external_id = auth.uid()::text)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. ISABELLA SESSIONS
-- ─────────────────────────────────────────────────────────────────────────────
alter table if exists isabella_sessions enable row level security;

create policy if not exists isabella_sessions_self on isabella_sessions for all
  using (
    exists (select 1 from players where players.id = isabella_sessions.player_id
            and players.external_id = auth.uid()::text)
  )
  with check (
    exists (select 1 from players where players.id = isabella_sessions.player_id
            and players.external_id = auth.uid()::text)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. ISABELLA DECISIONS
-- ─────────────────────────────────────────────────────────────────────────────
alter table if exists isabella_decisions enable row level security;

create policy if not exists isabella_decisions_self on isabella_decisions for all
  using (
    exists (select 1 from players where players.id = isabella_decisions.player_id
            and players.external_id = auth.uid()::text)
  )
  with check (
    exists (select 1 from players where players.id = isabella_decisions.player_id
            and players.external_id = auth.uid()::text)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. ISABELLA FEEDBACK
-- ─────────────────────────────────────────────────────────────────────────────
alter table if exists isabella_feedback enable row level security;

create policy if not exists isabella_feedback_self on isabella_feedback for all
  using (
    exists (select 1 from players where players.id = isabella_feedback.player_id
            and players.external_id = auth.uid()::text)
  )
  with check (
    exists (select 1 from players where players.id = isabella_feedback.player_id
            and players.external_id = auth.uid()::text)
  );

-- ══════════════════════════════════════════════════════════════════════════════
-- PUBLIC CONFIG TABLES (read-only for everyone, writes via service_role only)
-- ══════════════════════════════════════════════════════════════════════════════

-- 13. SEASONS
alter table if exists seasons enable row level security;
create policy if not exists public_seasons_read on seasons for select using (true);

-- 14. PROGRESSION BRANCHES
alter table if exists progression_branches enable row level security;
create policy if not exists public_progression_branches_read on progression_branches for select using (true);

-- 15. ITEMS
alter table if exists items enable row level security;
create policy if not exists public_items_read on items for select using (true);

-- 16. COLLECTIONS
alter table if exists collections enable row level security;
create policy if not exists public_collections_read on collections for select using (true);

-- 17. COLLECTION ITEMS
alter table if exists collection_items enable row level security;
create policy if not exists public_collection_items_read on collection_items for select using (true);

-- 18. WORLD EVENTS
alter table if exists world_events enable row level security;
create policy if not exists public_world_events_read on world_events for select using (true);

-- 19. COMMUNITY CHALLENGES
alter table if exists community_challenges enable row level security;
create policy if not exists public_community_challenges_read on community_challenges for select using (true);

-- 20. COMMUNITY CHALLENGE EVENTS
alter table if exists community_challenge_events enable row level security;
create policy if not exists public_community_challenge_events_read on community_challenge_events for select using (true);

-- ══════════════════════════════════════════════════════════════════════════════
-- TERRITORY TABLES (already in baseline — public read)
-- ══════════════════════════════════════════════════════════════════════════════

-- 21. TERRITORIES (already has public_territory_read)
-- 22. POI STATE (already has public_poi_state_read)
-- 23. WORLD STATE SNAPSHOTS (already has public_world_snapshot_read)

-- ══════════════════════════════════════════════════════════════════════════════
-- ISABELLA AI INTERNAL TABLES (admin/federation_auditor only for writes)
-- ══════════════════════════════════════════════════════════════════════════════

-- 24. ISABELLA KNOWLEDGE
alter table if exists isabella_knowledge enable row level security;
create policy if not exists isabella_knowledge_public_read on isabella_knowledge for select using (true);
-- Writes: server-side only (service_role bypasses RLS)

-- 25. ISABELLA MEMORY
alter table if exists isabella_memory enable row level security;
create policy if not exists isabella_memory_public_read on isabella_memory for select using (true);
-- Writes: server-side only (service_role bypasses RLS)

-- 26. ISABELLA EVALUATION RESULTS
alter table if exists isabella_evaluation_results enable row level security;
create policy if not exists isabella_evaluation_results_public_read on isabella_evaluation_results for select using (true);
-- Writes: server-side only (service_role bypasses RLS)
