-- RDM RLS hardening for Supabase deploy.
-- Authenticated users only see rows bound to their player record; public catalog rows remain readable.
create or replace function public.rdm_current_player_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.players where external_id = auth.uid()::text limit 1
$$;

alter table public.players enable row level security;
drop policy if exists players_owner_select on public.players;
create policy players_owner_select on public.players for select using (external_id = auth.uid()::text);
drop policy if exists players_owner_update on public.players;
create policy players_owner_update on public.players for update using (external_id = auth.uid()::text) with check (external_id = auth.uid()::text);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['player_avatars','player_seasons','player_currencies','player_progressions','player_items','player_collections','player_events','narrative_messages','isabella_sessions','isabella_decisions','isabella_feedback','isabella_memory','isabella_evaluation_results'] LOOP
    EXECUTE format('alter table public.%I enable row level security', t);
    EXECUTE format('drop policy if exists %I on public.%I', t || '_owner_all', t);
    EXECUTE format('create policy %I on public.%I for all using (player_id = public.rdm_current_player_id()) with check (player_id = public.rdm_current_player_id())', t || '_owner_all', t);
  END LOOP;
  FOREACH t IN ARRAY ARRAY['territories','poi_state','seasons','world_state_snapshots','progression_branches','items','collections','collection_items','world_events','community_challenges','community_challenge_events','isabella_knowledge'] LOOP
    EXECUTE format('alter table public.%I enable row level security', t);
    EXECUTE format('drop policy if exists %I on public.%I', t || '_authenticated_read', t);
    EXECUTE format('create policy %I on public.%I for select to authenticated using (true)', t || '_authenticated_read', t);
  END LOOP;
END $$;
