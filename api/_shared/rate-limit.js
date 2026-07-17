const hits = new Map();

export const RATE_LIMITS = {
  telemetry: { limit: 60, windowMs: 60_000 },
  model: { limit: 30, windowMs: 60_000 },
  default: { limit: 60, windowMs: 60_000 },
};

export function checkRateLimit(key, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  entry.count++;
  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    retryAfter: Math.max(0, entry.resetAt - now),
  };
}
