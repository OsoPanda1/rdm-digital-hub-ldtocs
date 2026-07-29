-- RDM Digital Hub — Complete Supabase Schema
-- Run this in Supabase SQL Editor (Project: vhywgrldlszehqyolcfw)
-- Includes: core tables + frontend tables + RLS + triggers
-- Idempotent-safe — can run multiple times

-- ═══════════════════════════════════════════════════
-- 0. HELPERS
-- ═══════════════════════════════════════════════════
create or replace function public.rdm_current_player_id()
returns uuid language sql stable security definer set search_path = public
as $$ select id from public.players where external_id = auth.uid()::text limit 1 $$;

-- ═══════════════════════════════════════════════════
-- 1. CORE — PLAYERS & AVATARS
-- ═══════════════════════════════════════════════════
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  display_name text not null,
  home_territory_id uuid,
  activity_events_count integer not null default 0,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz
);

create table if not exists public.player_avatars (
  player_id uuid primary key references public.players(id) on delete cascade,
  body_type text not null default 'default',
  hair_style text not null default 'short',
  skin_tone text not null default 'medium',
  base_outfit_id uuid,
  equipped_head_item_id uuid,
  equipped_torso_item_id uuid,
  equipped_legs_item_id uuid,
  equipped_feet_item_id uuid,
  equipped_pet_item_id uuid,
  equipped_special_item_id uuid,
  updated_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════
-- 2. CORE — TERRITORIES & POI
-- ═══════════════════════════════════════════════════
create table if not exists public.territories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  parent_territory_id uuid references public.territories(id),
  lat real, lng real,
  meta_json jsonb not null default '{}'
);

do $$ begin
  alter table public.players add constraint fk_home_territory
    foreign key (home_territory_id) references public.territories(id);
exception when duplicate_object then null;
end $$;

create table if not exists public.poi_state (
  id uuid primary key default gen_random_uuid(),
  territory_id uuid not null references public.territories(id) on delete cascade,
  status text not null default 'OPEN',
  severity text not null default 'INFO',
  current_event_id uuid,
  updated_at timestamptz not null default now(),
  constraint uq_poi_territory unique (territory_id)
);

-- ═══════════════════════════════════════════════════
-- 3. CORE — SEASONS
-- ═══════════════════════════════════════════════════
create table if not exists public.seasons (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  theme_config_json jsonb not null default '{}'
);

create table if not exists public.player_seasons (
  player_id uuid not null references public.players(id) on delete cascade,
  season_id uuid not null references public.seasons(id) on delete cascade,
  progress_score integer not null default 0,
  rewards_claimed_json jsonb not null default '{}',
  primary key (player_id, season_id)
);

create table if not exists public.world_state_snapshots (
  id uuid primary key default gen_random_uuid(),
  captured_at timestamptz not null default now(),
  season_id uuid not null references public.seasons(id),
  territory_id uuid references public.territories(id),
  severity text not null default 'INFO',
  weather text not null default 'SUNNY',
  temperature integer not null default 18,
  events_summary_json jsonb not null default '{}'
);

-- ═══════════════════════════════════════════════════
-- 4. CORE — CURRENCIES & PROGRESSION (ADR-003)
-- ═══════════════════════════════════════════════════
create table if not exists public.player_currencies (
  player_id uuid not null references public.players(id) on delete cascade,
  currency_type text not null,
  amount bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (player_id, currency_type)
);

create table if not exists public.progression_branches (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text not null
);

create table if not exists public.player_progressions (
  player_id uuid not null references public.players(id) on delete cascade,
  branch_id uuid not null references public.progression_branches(id) on delete cascade,
  level integer not null default 0,
  points_allocated integer not null default 0,
  xp_in_branch bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (player_id, branch_id)
);

-- ═══════════════════════════════════════════════════
-- 5. CORE — ITEMS & COLLECTIONS
-- ═══════════════════════════════════════════════════
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  category text not null,
  rarity text not null,
  icon_url text, model_url text,
  territory_id uuid references public.territories(id),
  season_id uuid references public.seasons(id),
  is_avatar_cosmetic boolean not null default false,
  is_collection_item boolean not null default true,
  is_story_trigger boolean not null default false
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null, description text not null,
  category text not null,
  season_id uuid references public.seasons(id)
);

create table if not exists public.collection_items (
  collection_id uuid not null references public.collections(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  order_index integer not null default 0,
  primary key (collection_id, item_id)
);

create table if not exists public.player_items (
  player_id uuid not null references public.players(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  obtained_at timestamptz not null default now(),
  source_event_id uuid,
  primary key (player_id, item_id)
);

create table if not exists public.player_collections (
  player_id uuid not null references public.players(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  progress_percentage integer not null default 0,
  completed_at timestamptz,
  primary key (player_id, collection_id)
);

-- ═══════════════════════════════════════════════════
-- 6. CORE — EVENTS
-- ═══════════════════════════════════════════════════
create table if not exists public.player_events (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  type text not null,
  territory_id uuid references public.territories(id),
  poi_id uuid references public.poi_state(id),
  season_id uuid references public.seasons(id),
  payload_json jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.world_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  territory_id uuid references public.territories(id),
  season_id uuid not null references public.seasons(id),
  actor_id text,
  payload_json jsonb not null default '{}',
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.community_challenges (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null, description text not null,
  goal_type text not null,
  goal_target bigint not null,
  current_progress bigint not null default 0,
  threshold bigint not null default 0,
  threshold_reached_at timestamptz,
  season_id uuid not null references public.seasons(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null
);

create table if not exists public.community_challenge_events (
  challenge_id uuid not null references public.community_challenges(id) on delete cascade,
  world_event_id uuid not null references public.world_events(id) on delete cascade,
  increment_value bigint not null,
  created_at timestamptz not null default now(),
  primary key (challenge_id, world_event_id)
);

-- ═══════════════════════════════════════════════════
-- 7. CORE — NARRATIVE & ISABELLA AI
-- ═══════════════════════════════════════════════════
create table if not exists public.narrative_messages (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  character_key text not null,
  type text not null,
  content_json jsonb not null,
  related_event_id uuid,
  season_id uuid references public.seasons(id),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table if not exists public.isabella_sessions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  status text not null default 'active',
  message_count integer not null default 0,
  started_at timestamptz not null default now(),
  last_message_at timestamptz,
  closed_at timestamptz
);

create table if not exists public.isabella_decisions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  session_id uuid references public.isabella_sessions(id) on delete set null,
  type text not null,
  confidence integer not null default 85,
  territory_id uuid references public.territories(id),
  payload_json jsonb not null default '{}',
  mode text not null default 'NORMAL',
  guardian_verdict_json jsonb,
  evaluation_json jsonb,
  bias_detected boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.isabella_feedback (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  decision_id uuid not null references public.isabella_decisions(id) on delete cascade,
  rating integer not null,
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.isabella_knowledge (
  id uuid primary key default gen_random_uuid(),
  domain text not null default 'ecosystem',
  topic text not null,
  content text not null,
  keywords jsonb not null default '[]',
  category text not null default 'general',
  priority integer not null default 5,
  source text not null default 'manual',
  confidence integer not null default 80,
  created_at timestamptz not null default now()
);

create table if not exists public.isabella_memory (
  id text primary key,
  type text not null,
  content text not null,
  tags jsonb not null default '[]',
  source text not null default 'system',
  ttl integer not null default 0,
  confidence integer not null default 80,
  created_at timestamptz not null default now()
);

create table if not exists public.isabella_evaluation_results (
  id uuid primary key default gen_random_uuid(),
  metric text not null,
  score integer not null,
  threshold integer not null,
  passed boolean not null,
  details text not null default '',
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════
-- 8. FRONTEND — USER ROLES & AUDIT
-- ═══════════════════════════════════════════════════
create table if not exists public.user_roles (
  user_id text not null,
  role text not null check (role in ('admin', 'operador', 'lector')),
  primary key (user_id, role)
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id text not null,
  actor_email text,
  action text not null,
  resource text not null,
  detail jsonb,
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════
-- 9. FRONTEND — BUSINESSES & COMMERCE
-- ═══════════════════════════════════════════════════
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,
  direccion text, telefono text, horario text,
  image_url text,
  rating real default 0,
  lat real, lng real,
  verified boolean not null default false,
  owner_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.business_reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.merchant_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon text, sort_order integer not null default 0
);

create table if not exists public.merchant_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  business_name text not null,
  email text, phone text, category text,
  plan text not null default 'mensual',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.merchant_payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid references public.merchant_registrations(id) on delete cascade,
  amount numeric(10,2) not null,
  currency text not null default 'MXN',
  provider text not null default 'stripe',
  provider_payment_id text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════
-- 10. FRONTEND — PASTE ROUTE POIs
-- ═══════════════════════════════════════════════════
create table if not exists public.paste_pois (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  type text not null,
  svg_x integer not null,
  svg_y integer not null,
  order_index integer not null default 0,
  icon text,
  lat real, lng real,
  active boolean not null default true
);

create table if not exists public.paste_ratings (
  id uuid primary key default gen_random_uuid(),
  poi_id uuid not null references public.paste_pois(id) on delete cascade,
  user_id uuid not null,
  score integer not null check (score >= 1 and score <= 5),
  created_at timestamptz not null default now(),
  unique (poi_id, user_id)
);

-- ═══════════════════════════════════════════════════
-- 11. FRONTEND — DICHOS, WIKI, TRANSPORT
-- ═══════════════════════════════════════════════════
create table if not exists public.dichos (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  author text, context text,
  category text not null default 'general',
  active boolean not null default true
);

create table if not exists public.wiki_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  category text not null,
  image_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transport_providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  description text,
  phone text, schedule text, image_url text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.shuttle_routes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  origin text not null,
  destination text not null,
  departure_time text not null,
  return_time text not null,
  price numeric(10,2) not null,
  duration text not null,
  shuttle_company_id uuid references public.transport_providers(id),
  available boolean not null default true,
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════
-- 12. FRONTEND — TOURS, GAMES, FORUMS
-- ═══════════════════════════════════════════════════
create table if not exists public.tour_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text, type text not null,
  duration text not null,
  price numeric(10,2) not null,
  image_url text,
  includes jsonb not null default '[]',
  available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.tour_guides (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text, phone text,
  languages jsonb not null default '[]',
  image_url text,
  verified boolean not null default false
);

create table if not exists public.tour_bookings (
  id uuid primary key default gen_random_uuid(),
  package_id uuid references public.tour_packages(id),
  user_id text not null,
  guide_id uuid references public.tour_guides(id),
  booking_date date not null,
  guests integer not null default 1,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text not null,
  icon_url text,
  category text not null
);

create table if not exists public.user_badges (
  user_id text not null,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  points integer not null,
  reason text not null,
  reference_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.rewards_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  points_cost integer not null,
  image_url text, stock integer,
  active boolean not null default true
);

create table if not exists public.game_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  tier text not null default 'free',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  content text not null,
  category text not null,
  tags jsonb not null default '[]',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.forum_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  user_id text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════
-- 13. FRONTEND — MUSIC
-- ═══════════════════════════════════════════════════
create table if not exists public.music_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  artist text not null,
  cover_url text, audio_url text,
  duration_seconds integer not null default 0,
  moods jsonb not null default '[]',
  territories jsonb not null default '[]',
  donation_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.music_plays (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.music_tracks(id) on delete cascade,
  user_id uuid,
  played_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════
-- 14. FRONTEND — ONTOLOGY, LAYERS, TELEMETRY
-- ═══════════════════════════════════════════════════
create table if not exists public.isabella_ontology (
  node_id uuid primary key default gen_random_uuid(),
  parent_node_id uuid references public.isabella_ontology(node_id),
  federation_id integer not null,
  theme_id integer not null,
  node_name text not null,
  chromatic_hex text not null,
  abstraction_level integer not null check (abstraction_level between 1 and 10),
  semantic_rules jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.dt_layers (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  color text not null,
  icon text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.territorial_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  type text not null,
  status text not null default 'pending',
  lat real, lng real,
  territorio text, poi_id text,
  payload jsonb,
  verification_method text,
  verification_score real,
  reputation_weight real default 1.0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pipeline_results (
  trace_id text primary key,
  input_type text,
  emotional_state text,
  emotional_valence real,
  consciousness_layers jsonb,
  federation_actions integer,
  territorial_actions integer,
  guardian_action text,
  duration_ms bigint,
  timestamp timestamptz not null default now()
);

create table if not exists public.telemetry_pulses (
  id uuid primary key default gen_random_uuid(),
  federation text not null,
  pulse_type text not null,
  value real not null,
  created_at timestamptz not null default now()
);

create table if not exists public.dashboard_metrics (
  id uuid primary key default gen_random_uuid(),
  integrity_score integer default 100,
  memory_load integer default 0,
  ethical_risk integer default 0,
  updated_at timestamptz default now()
);

-- insert default dashboard metrics row
insert into public.dashboard_metrics (id, integrity_score, memory_load, ethical_risk)
values (gen_random_uuid(), 100, 0, 0)
on conflict do nothing;

-- ═══════════════════════════════════════════════════
-- 15. RLS — ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════
-- Player-owned tables (player_id = current user)
do $$ declare t text;
begin
  foreach t in array array[
    'player_avatars','player_seasons','player_currencies','player_progressions',
    'player_items','player_collections','player_events','narrative_messages',
    'isabella_sessions','isabella_decisions','isabella_feedback',
    'isabella_memory','isabella_evaluation_results'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t || '_owner_all', t);
    execute format(
      'create policy %I on public.%I for all using (player_id = public.rdm_current_player_id()) with check (player_id = public.rdm_current_player_id())',
      t || '_owner_all', t
    );
  end loop;
end $$;

-- Public-read tables (authenticated users)
do $$ declare t text;
begin
  foreach t in array array[
    'territories','poi_state','seasons','world_state_snapshots',
    'progression_branches','items','collections','collection_items',
    'world_events','community_challenges','community_challenge_events',
    'isabella_knowledge','paste_pois','paste_ratings','dichos',
    'wiki_articles','dt_layers','isabella_ontology','music_tracks',
    'businesses','badges','rewards_catalog','tour_packages','tour_guides',
    'transport_providers','shuttle_routes','merchant_categories',
    'territorial_contributions','pipeline_results','telemetry_pulses',
    'forum_posts','forum_comments','dashboard_metrics'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t || '_public_read', t);
    execute format(
      'create policy %I on public.%I for select to authenticated using (true)',
      t || '_public_read', t
    );
  end loop;
end $$;

-- Player identity
alter table public.players enable row level security;
drop policy if exists players_owner_select on public.players;
create policy players_owner_select on public.players
  for select using (external_id = auth.uid()::text);
drop policy if exists players_owner_update on public.players;
create policy players_owner_update on public.players
  for update using (external_id = auth.uid()::text)
  with check (external_id = auth.uid()::text);
drop policy if exists players_self_insert on public.players;
create policy players_self_insert on public.players
  for insert with check (external_id = auth.uid()::text);

-- User roles (authenticated users can read their own)
alter table public.user_roles enable row level security;
drop policy if exists user_roles_self on public.user_roles;
create policy user_roles_self on public.user_roles
  for select using (user_id = auth.uid()::text);

-- Audit log (server-side writes, admin reads)
alter table public.audit_log enable row level security;
drop policy if exists audit_log_admin on public.audit_log;
create policy audit_log_admin on public.audit_log
  for select using (
    exists (select 1 from public.user_roles
      where user_id = auth.uid()::text and role = 'admin')
  );

-- ═══════════════════════════════════════════════════
-- 16. TRIGGERS — LIVING WORLD (C.R.O.W.N.)
-- ═══════════════════════════════════════════════════

-- 16a. World state snapshot on world event
create or replace function public.isabella_update_world_state_snapshot()
returns trigger language plpgsql as $$
declare
  current_season uuid;
  severity_level text;
begin
  select id into current_season from public.seasons
  where now() between start_at and end_at limit 1;
  if current_season is null then return new; end if;
  severity_level := case new.type
    when 'CRITICAL_INCIDENT' then 'CRITICAL'
    when 'MAJOR_EVENT' then 'MAJOR'
    when 'MINOR_EVENT' then 'MINOR'
    else 'INFO'
  end;
  insert into public.world_state_snapshots (season_id, territory_id, severity, weather, temperature, events_summary_json)
  values (current_season, new.territory_id, severity_level, 'DYNAMIC', 18,
    jsonb_build_object('last_event_id', new.id, 'event_type', new.type,
      'territory_id', new.territory_id, 'severity', severity_level,
      'actor_id', new.actor_id, 'payload', new.payload_json, 'updated_at', now()));
  return new;
end;
$$;

drop trigger if exists isabella_world_events_snapshot_trigger on public.world_events;
create trigger isabella_world_events_snapshot_trigger
  after insert or update on public.world_events
  for each row execute function public.isabella_update_world_state_snapshot();

-- 16b. Challenge progress
create or replace function public.isabella_update_challenge_progress()
returns trigger language plpgsql as $$
declare
  new_progress bigint;
  challenge_threshold bigint;
begin
  update public.community_challenges
  set current_progress = current_progress + new.increment_value
  where id = new.challenge_id
  returning current_progress, threshold into new_progress, challenge_threshold;
  if new_progress >= challenge_threshold then
    update public.community_challenges set threshold_reached_at = now()
    where id = new.challenge_id;
  end if;
  return new;
end;
$$;

drop trigger if exists isabella_challenge_events_trigger on public.community_challenge_events;
create trigger isabella_challenge_events_trigger
  after insert on public.community_challenge_events
  for each row execute function public.isabella_update_challenge_progress();

-- 16c. Player last seen
create or replace function public.isabella_update_player_last_seen()
returns trigger language plpgsql as $$
begin
  update public.players
  set last_seen_at = now(), activity_events_count = coalesce(activity_events_count, 0) + 1
  where id = new.player_id;
  return new;
end;
$$;

drop trigger if exists isabella_player_events_last_seen_trigger on public.player_events;
create trigger isabella_player_events_last_seen_trigger
  after insert on public.player_events
  for each row execute function public.isabella_update_player_last_seen();

-- 16d. POI state on event
create or replace function public.isabella_update_poi_state_on_event()
returns trigger language plpgsql as $$
declare
  poi_severity text;
begin
  poi_severity := case new.type
    when 'CRITICAL_INCIDENT' then 'CRITICAL'
    when 'MAJOR_EVENT' then 'MAJOR'
    when 'MINOR_EVENT' then 'MINOR'
    else 'INFO'
  end;
  if new.territory_id is not null then
    insert into public.poi_state (territory_id, status, current_event_id, severity, updated_at)
    values (new.territory_id, 'EVENT', new.id, poi_severity, now())
    on conflict (territory_id) do update
    set status = 'EVENT', current_event_id = new.id, severity = poi_severity, updated_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists isabella_world_events_poi_trigger on public.world_events;
create trigger isabella_world_events_poi_trigger
  after insert on public.world_events
  for each row execute function public.isabella_update_poi_state_on_event();

-- 16e. Reset POI on event end
create or replace function public.isabella_reset_poi_on_event_end()
returns trigger language plpgsql as $$
begin
  if new.ends_at is not null and new.ends_at <= now() then
    update public.poi_state
    set status = 'OPEN', current_event_id = null, severity = 'INFO', updated_at = now()
    where current_event_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists isabella_world_events_poi_reset_trigger on public.world_events;
create trigger isabella_world_events_poi_reset_trigger
  after update on public.world_events
  for each row execute function public.isabella_reset_poi_on_event_end();

-- 16f. Dashboard metrics
create or replace function public.isabella_update_dashboard_metrics()
returns trigger language plpgsql as $$
begin
  update public.dashboard_metrics set
    integrity_score = (
      select case when count(*) = 0 then 100
        else 100 - (100 * count(*) filter (where type = 'CRITICAL_INCIDENT') / count(*))
      end from public.world_events
    ),
    memory_load = (select count(*) from public.world_state_snapshots
      where season_id = new.season_id),
    ethical_risk = (
      select 100 * count(*) filter (where severity in ('CRITICAL','MAJOR'))
        / greatest(count(*), 1) from public.world_state_snapshots
    ),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists isabella_world_state_metrics_trigger on public.world_state_snapshots;
create trigger isabella_world_state_metrics_trigger
  after insert on public.world_state_snapshots
  for each row execute function public.isabella_update_dashboard_metrics();
