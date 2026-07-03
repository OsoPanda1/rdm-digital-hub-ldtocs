-- Migration: stripe_events — idempotency table for Stripe webhooks
-- Prevents duplicate processing of the same Stripe event
-- Only service_role reads/writes (no user-facing access)

CREATE TABLE IF NOT EXISTS public.stripe_events (
  event_id text PRIMARY KEY,
  type text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.stripe_events TO service_role;

ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
-- No policies for authenticated/anon = 0 access from Data API. Correct.

CREATE INDEX IF NOT EXISTS idx_stripe_events_processed_at
  ON public.stripe_events (processed_at DESC);
