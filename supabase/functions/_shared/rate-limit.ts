// Simple rate limiter using Supabase table `rate_limits`
// Requires a migration:
//   CREATE TABLE IF NOT EXISTS rate_limits (
//     key TEXT PRIMARY KEY,
//     window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
//     count INT NOT NULL DEFAULT 1
//   );

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

export interface RateLimitConfig {
  max: number;       // Max requests per window
  windowSec: number; // Window in seconds
}

const DEFAULTS: RateLimitConfig = { max: 30, windowSec: 60 };

/**
 * Check rate limit for a key.
 * Returns { allowed: true } or { allowed: false, retryAfter: number }.
 * Creates the table row if it doesn't exist.
 */
export async function checkRateLimit(
  serviceKey: string,
  supabaseUrl: string,
  key: string,
  config: RateLimitConfig = DEFAULTS,
): Promise<{ allowed: true } | { allowed: false; retryAfter: number }> {
  const admin = createClient(supabaseUrl, serviceKey);
  const now = new Date().toISOString();

  // Upsert pattern: try insert, on conflict update if within window
  const { data: row } = await admin
    .from("rate_limits")
    .select("key, window_start, count")
    .eq("key", key)
    .maybeSingle();

  if (!row) {
    // First request — create row
    await admin.from("rate_limits").insert({
      key,
      window_start: now,
      count: 1,
    });
    return { allowed: true };
  }

  const windowStart = new Date(row.window_start).getTime();
  const elapsed = Date.now() - windowStart;

  if (elapsed > config.windowSec * 1000) {
    // Window expired — reset
    await admin
      .from("rate_limits")
      .update({ window_start: now, count: 1 })
      .eq("key", key);
    return { allowed: true };
  }

  if (row.count >= config.max) {
    const retryAfter = Math.ceil((config.windowSec * 1000 - elapsed) / 1000);
    return { allowed: false, retryAfter };
  }

  await admin
    .from("rate_limits")
    .update({ count: row.count + 1 })
    .eq("key", key);

  return { allowed: true };
}

/**
 * CORS headers for production edge functions
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function jsonResponse(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
