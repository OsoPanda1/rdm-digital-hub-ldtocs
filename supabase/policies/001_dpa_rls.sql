-- RDM Digital Hub — DPA/RLS hardening baseline
-- Apply after validating table ownership in Supabase. These policies assume
-- authenticated users expose auth.uid() as text in players.external_id.

alter table players enable row level security;
alter table player_avatars enable row level security;
alter table player_currencies enable row level security;
alter table player_progressions enable row level security;
alter table player_seasons enable row level security;
alter table player_items enable row level security;
alter table territories enable row level security;
alter table poi_state enable row level security;
alter table world_state_snapshots enable row level security;

create policy players_self_select on players for select using (external_id = auth.uid()::text);
create policy players_self_update on players for update using (external_id = auth.uid()::text) with check (external_id = auth.uid()::text);

create policy player_avatars_self on player_avatars for all using (
  exists (select 1 from players where players.id = player_avatars.player_id and players.external_id = auth.uid()::text)
) with check (
  exists (select 1 from players where players.id = player_avatars.player_id and players.external_id = auth.uid()::text)
);

create policy player_currencies_self_read on player_currencies for select using (
  exists (select 1 from players where players.id = player_currencies.player_id and players.external_id = auth.uid()::text)
);

create policy public_territory_read on territories for select using (true);
create policy public_poi_state_read on poi_state for select using (true);
create policy public_world_snapshot_read on world_state_snapshots for select using (true);
