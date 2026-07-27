import type { NextFunction, Request, Response } from "express";
import { logger } from "./logger";

export type RdmRole = "public" | "user" | "operator" | "admin" | "federation_auditor";

const ROLE_ORDER: RdmRole[] = ["public", "user", "operator", "admin", "federation_auditor"];
const DEFAULT_WINDOW_MS = Number(process.env.RDM_RATE_LIMIT_WINDOW_MS ?? 60_000);
const buckets = new Map<string, { count: number; resetAt: number }>();

function normalizeRole(value: unknown): RdmRole {
  const role = String(value ?? "public").toLowerCase();
  return ROLE_ORDER.includes(role as RdmRole) ? (role as RdmRole) : "public";
}

function roleRank(role: RdmRole) {
  return ROLE_ORDER.indexOf(role);
}

function clientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) return forwarded.split(",")[0]!.trim();
  return req.ip || req.socket.remoteAddress || "unknown";
}

/**
 * Legacy identity attach — kept for backward compatibility.
 * In production, attachJwtIdentity (from middlewares/auth.ts) runs FIRST
 * and sets rdmIdentity from the verified JWT. This function only fills in
 * the IP and ensures rdmIdentity exists for anonymous requests.
 *
 * SECURITY: x-rdm-role and x-user-id headers are NO LONGER trusted.
 * Identity is derived exclusively from the verified JWT payload.
 */
export function attachRdmIdentity(req: Request, _res: Response, next: NextFunction) {
  const existing = (req as any).rdmIdentity;
  if (existing) {
    // JWT middleware already set identity — just ensure ip is present
    existing.ip = clientIp(req);
    next();
    return;
  }
  // No JWT middleware ran (dev mode) — create anonymous identity
  (req as any).rdmIdentity = {
    subject: "anonymous",
    role: "public",
    ip: clientIp(req),
    authMethod: "anonymous",
  };
  next();
}

export function requireRdmRole(required: RdmRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const identity = (req as any).rdmIdentity ?? { role: "public", subject: "anonymous", ip: clientIp(req) };
    const role = normalizeRole(identity.role);
    if (roleRank(role) < roleRank(required)) {
      logger.warn({ path: req.path, subject: identity.subject, role, required }, "RBAC denied request");
      res.status(403).json({ ok: false, error: "forbidden", requiredRole: required });
      return;
    }
    next();
  };
}

export function rateLimitByRoute(options: { name: string; limit: number; windowMs?: number }) {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  return (req: Request, res: Response, next: NextFunction) => {
    const identity = (req as any).rdmIdentity;
    const subject = identity?.subject ?? "anonymous";
    const key = `${options.name}:${subject}:${clientIp(req)}`;
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }
    if (bucket.count >= options.limit) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      logger.warn({ key, retryAfter, limit: options.limit }, "Rate limit exceeded");
      res.status(429).json({ ok: false, error: "rate_limit_exceeded", retryAfterSeconds: retryAfter });
      return;
    }
    bucket.count += 1;
    next();
  };
}

export function auditSecurityEvent(req: Request, action: string, metadata: Record<string, unknown> = {}) {
  const identity = (req as any).rdmIdentity ?? { subject: "anonymous", role: "public", ip: clientIp(req) };
  logger.info({ audit: true, action, identity, metadata }, "RDM security audit event");
}
