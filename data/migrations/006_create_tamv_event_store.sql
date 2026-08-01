-- Migration 006: TAMV Event Store soberano (heptafederación)
-- Ledger append-only con hash SHA-256 por evento y versionado por stream.

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.tamv_event_store (
  global_position BIGSERIAL PRIMARY KEY,
  event_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  stream_id text NOT NULL,
  stream_version integer NOT NULL,
  event_type text NOT NULL,
  federation text NOT NULL CHECK (federation IN ('DEKATEOTL','ANUBIS','BOOKPI','PHOENIX','MDD_TAMV','KAOS','CHRONOS')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  recorded_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL CHECK (source IN ('WEB_PORTAL','EDGE_NODE','MOBILE_APP','BACKOFFICE')),
  correlation_id uuid,
  event_hash text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_deleted boolean NOT NULL DEFAULT false,
  UNIQUE (stream_id, stream_version)
);

CREATE INDEX IF NOT EXISTS idx_tamv_event_store_stream
  ON public.tamv_event_store (stream_id, stream_version);
CREATE INDEX IF NOT EXISTS idx_tamv_event_store_occurred_at
  ON public.tamv_event_store (occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_tamv_event_store_federation
  ON public.tamv_event_store (federation, occurred_at DESC);

GRANT SELECT ON public.tamv_event_store TO authenticated;
GRANT ALL ON public.tamv_event_store TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.tamv_event_store_global_position_seq TO service_role;

ALTER TABLE public.tamv_event_store ENABLE ROW LEVEL SECURITY;

-- Solo lectura para sesiones autenticadas; la escritura pasa siempre por el
-- kernel con service role (zero trust: el cliente nunca escribe el ledger).
DROP POLICY IF EXISTS "tamv_event_store_read_authenticated" ON public.tamv_event_store;
CREATE POLICY "tamv_event_store_read_authenticated"
  ON public.tamv_event_store
  FOR SELECT
  TO authenticated
  USING (is_deleted = false);

COMMIT;
