-- supabase/triggers/isabella_world_state.sql
-- Isabella · C.R.O.W.N. Living World — Triggers para estado ontológico dinámico
-- ADR-001 · ADR-003 · ADR-007 (Memoria, Riesgo, Integridad)
-- Ejecutar en Supabase SQL Editor o via `psql`

-- ═══════════════════════════════════════════════════════════════════════════════
--  1. Snapshots de estado ontológico (season + territorio + gravedad)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION isabella_update_world_state_snapshot()
RETURNS TRIGGER AS $$
DECLARE
  current_season UUID;
  severity_level TEXT;
BEGIN
  SELECT id INTO current_season
  FROM seasons
  WHERE now() BETWEEN start_at AND end_at
  LIMIT 1;

  IF current_season IS NULL THEN
    -- Sin temporada activa: no generamos snapshot, pero dejamos traza en logs.
    RETURN NEW;
  END IF;

  -- Gravedad básica según tipo de evento (puedes ajustar el mapa de tipos).
  CASE NEW.type
    WHEN 'CRITICAL_INCIDENT' THEN severity_level := 'CRITICAL';
    WHEN 'MAJOR_EVENT'      THEN severity_level := 'MAJOR';
    WHEN 'MINOR_EVENT'      THEN severity_level := 'MINOR';
    ELSE severity_level := 'INFO';
  END CASE;

  INSERT INTO world_state_snapshots (
    season_id,
    territory_id,
    severity,
    weather,
    temperature,
    events_summary_json
  )
  VALUES (
    current_season,
    NEW.territory_id,
    severity_level,
    'DYNAMIC',
    18,
    jsonb_build_object(
      'last_event_id', NEW.id,
      'event_type', NEW.type,
      'territory_id', NEW.territory_id,
      'severity', severity_level,
      'actor_id', NEW.actor_id,
      'payload', NEW.payload_json,
      'updated_at', now()
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS isabella_world_events_snapshot_trigger ON world_events;
CREATE TRIGGER isabella_world_events_snapshot_trigger
  AFTER INSERT OR UPDATE ON world_events
  FOR EACH ROW
  EXECUTE FUNCTION isabella_update_world_state_snapshot();


-- ═══════════════════════════════════════════════════════════════════════════════
--  2. Progreso de desafíos comunitarios con banderas de umbral
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION isabella_update_challenge_progress()
RETURNS TRIGGER AS $$
DECLARE
  new_progress INTEGER;
  challenge_threshold INTEGER;
BEGIN
  UPDATE community_challenges
  SET current_progress = current_progress + NEW.increment_value
  WHERE id = NEW.challenge_id
  RETURNING current_progress, threshold INTO new_progress, challenge_threshold;

  -- Opcional: marcar flag de “umbral alcanzado” para el dashboard.
  IF new_progress >= challenge_threshold THEN
    UPDATE community_challenges
    SET threshold_reached_at = now()
    WHERE id = NEW.challenge_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS isabella_challenge_events_trigger ON community_challenge_events;
CREATE TRIGGER isabella_challenge_events_trigger
  AFTER INSERT ON community_challenge_events
  FOR EACH ROW
  EXECUTE FUNCTION isabella_update_challenge_progress();


-- ═══════════════════════════════════════════════════════════════════════════════
--  3. Última aparición de jugador + contador de actividad
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION isabella_update_player_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE players
  SET last_seen_at = now(),
      activity_events_count = COALESCE(activity_events_count, 0) + 1
  WHERE id = NEW.player_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS isabella_player_events_last_seen_trigger ON player_events;
CREATE TRIGGER isabella_player_events_last_seen_trigger
  AFTER INSERT ON player_events
  FOR EACH ROW
  EXECUTE FUNCTION isabella_update_player_last_seen();


-- ═══════════════════════════════════════════════════════════════════════════════
--  4. Estado de POI con criticidad ontológica
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION isabella_update_poi_state_on_event()
RETURNS TRIGGER AS $$
DECLARE
  poi_severity TEXT;
BEGIN
  -- Derivar criticidad del evento para el POI.
  CASE NEW.type
    WHEN 'CRITICAL_INCIDENT' THEN poi_severity := 'CRITICAL';
    WHEN 'MAJOR_EVENT'      THEN poi_severity := 'MAJOR';
    WHEN 'MINOR_EVENT'      THEN poi_severity := 'MINOR';
    ELSE poi_severity := 'INFO';
  END CASE;

  IF NEW.territory_id IS NOT NULL THEN
    INSERT INTO poi_state (territory_id, status, current_event_id, severity, updated_at)
    VALUES (NEW.territory_id, 'EVENT', NEW.id, poi_severity, now())
    ON CONFLICT (territory_id) DO UPDATE
    SET status = 'EVENT',
        current_event_id = NEW.id,
        severity = poi_severity,
        updated_at = now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS isabella_world_events_poi_trigger ON world_events;
CREATE TRIGGER isabella_world_events_poi_trigger
  AFTER INSERT ON world_events
  FOR EACH ROW
  EXECUTE FUNCTION isabella_update_poi_state_on_event();


-- ═══════════════════════════════════════════════════════════════════════════════
--  5. Reset de POI a estado OPEN con memoria de incidente
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION isabella_reset_poi_on_event_end()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ends_at IS NOT NULL AND NEW.ends_at <= now() THEN
    UPDATE poi_state
    SET status = 'OPEN',
        current_event_id = NULL,
        severity = 'INFO',
        updated_at = now()
    WHERE current_event_id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS isabella_world_events_poi_reset_trigger ON world_events;
CREATE TRIGGER isabella_world_events_poi_reset_trigger
  AFTER UPDATE ON world_events
  FOR EACH ROW
  EXECUTE FUNCTION isabella_reset_poi_on_event_end();


-- ═══════════════════════════════════════════════════════════════════════════════
--  6. Métricas agregadas para el tablero C.R.O.W.N.
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION isabella_update_dashboard_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Integridad constitucional: proporción de eventos no críticos.
  UPDATE dashboard_metrics
  SET integrity_score = (
        SELECT CASE
          WHEN COUNT(*) = 0 THEN 100
          ELSE 100 - (100 * COUNT(*) FILTER (WHERE type = 'CRITICAL_INCIDENT') / COUNT(*))
        END
        FROM world_events
      ),
      -- Carga de memoria: número de snapshots en la temporada actual.
      memory_load = (
        SELECT COUNT(*)
        FROM world_state_snapshots
        WHERE season_id = NEW.season_id
      ),
      -- Riesgo ético: aproximación básica basada en severidad CRITICAL/MAJOR.
      ethical_risk = (
        SELECT 100 * COUNT(*) FILTER (WHERE severity IN ('CRITICAL','MAJOR')) 
               / GREATEST(COUNT(*), 1)
        FROM world_state_snapshots
      ),
      updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS isabella_world_state_metrics_trigger ON world_state_snapshots;
CREATE TRIGGER isabella_world_state_metrics_trigger
  AFTER INSERT ON world_state_snapshots
  FOR EACH ROW
  EXECUTE FUNCTION isabella_update_dashboard_metrics();
