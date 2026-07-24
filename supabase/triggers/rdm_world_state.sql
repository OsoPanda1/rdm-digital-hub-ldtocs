-- supabase/triggers/rdm_world_state.sql
-- RDM Living World — Triggers for dynamic world state
-- ADR-001 + ADR-003
-- Run in Supabase SQL Editor or via `psql`

-- ═══════════════════════════════════════════════════════════════════════════════
--  1. Auto-generate world_state_snapshots on world_events changes
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION rdm_update_world_state_snapshot()
RETURNS TRIGGER AS $$
DECLARE
  current_season UUID;
BEGIN
  SELECT id INTO current_season
  FROM seasons
  WHERE now() BETWEEN start_at AND end_at
  LIMIT 1;

  IF current_season IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO world_state_snapshots (
    season_id,
    weather,
    temperature,
    events_summary_json
  )
  VALUES (
    current_season,
    'DYNAMIC',
    18,
    jsonb_build_object(
      'last_event_id', NEW.id,
      'event_type', NEW.type,
      'territory_id', NEW.territory_id,
      'updated_at', now()
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rdm_world_events_snapshot_trigger ON world_events;
CREATE TRIGGER rdm_world_events_snapshot_trigger
  AFTER INSERT OR UPDATE ON world_events
  FOR EACH ROW
  EXECUTE FUNCTION rdm_update_world_state_snapshot();


-- ═══════════════════════════════════════════════════════════════════════════════
--  2. Auto-increment community_challenges on community_challenge_events
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION rdm_update_challenge_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_challenges
  SET current_progress = current_progress + NEW.increment_value
  WHERE id = NEW.challenge_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rdm_challenge_events_trigger ON community_challenge_events;
CREATE TRIGGER rdm_challenge_events_trigger
  AFTER INSERT ON community_challenge_events
  FOR EACH ROW
  EXECUTE FUNCTION rdm_update_challenge_progress();


-- ═══════════════════════════════════════════════════════════════════════════════
--  3. Auto-update player last_seen_at on player_events
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION rdm_update_player_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE players
  SET last_seen_at = now()
  WHERE id = NEW.player_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rdm_player_events_last_seen_trigger ON player_events;
CREATE TRIGGER rdm_player_events_last_seen_trigger
  AFTER INSERT ON player_events
  FOR EACH ROW
  EXECUTE FUNCTION rdm_update_player_last_seen();


-- ═══════════════════════════════════════════════════════════════════════════════
--  4. Auto-update POI state when a world_event targets a territory
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION rdm_update_poi_state_on_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.territory_id IS NOT NULL THEN
    INSERT INTO poi_state (territory_id, status, current_event_id, updated_at)
    VALUES (NEW.territory_id, 'EVENT', NEW.id, now())
    ON CONFLICT (territory_id) DO UPDATE
    SET status = 'EVENT',
        current_event_id = NEW.id,
        updated_at = now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rdm_world_events_poi_trigger ON world_events;
CREATE TRIGGER rdm_world_events_poi_trigger
  AFTER INSERT ON world_events
  FOR EACH ROW
  EXECUTE FUNCTION rdm_update_poi_state_on_event();


-- ═══════════════════════════════════════════════════════════════════════════════
--  5. Auto-reset POI status to OPEN when event ends
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION rdm_reset_poi_on_event_end()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ends_at IS NOT NULL AND NEW.ends_at <= now() THEN
    UPDATE poi_state
    SET status = 'OPEN',
        current_event_id = NULL,
        updated_at = now()
    WHERE current_event_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rdm_world_events_poi_reset_trigger ON world_events;
CREATE TRIGGER rdm_world_events_poi_reset_trigger
  AFTER UPDATE ON world_events
  FOR EACH ROW
  EXECUTE FUNCTION rdm_reset_poi_on_event_end();
