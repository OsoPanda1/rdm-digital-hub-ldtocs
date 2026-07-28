// ────────────────────────────────────────────────────────────────
// Supabase JWT Authentication Middleware
// Verifies Bearer tokens using HS256 (Node.js crypto, no deps).
// In dev-relaxed mode, falls back to header-based identity.
// In production, rejects unauthenticated requests on protected routes.
// ────────────────────────────────────────────────────────────────

import type { NextFunction, Request, Response } from "express";
import { createHmac, timingSafeEqual } from "crypto";
import { logger } from "../lib/logger";

export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  aud: string;
  exp: number;
  iat: number;
  iss: string;
}

export interface AuthenticatedIdentity {
  subject: string;
  email: string;
  role: string;
  jwt: JwtPayload;
  authMethod: "jwt" | "header" | "anonymous";
}

// ── Base64URL decode (Supabase JWTs use base64url encoding) ──

function base64UrlDecode(str: string): Buffer {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, "base64");
}

// ── JWT Verification (HS256 only — Supabase default) ──

export function verifySupabaseJwt(
  token: string,
  secret: string,
): { valid: true; payload: JwtPayload } | { valid: false; error: string } {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, error: "Invalid JWT structure" };
  }

  const [headerB64, payloadB64, signatureB64] = parts as [string, string, string];

  // Verify header algorithm
  try {
    const header = JSON.parse(base64UrlDecode(headerB64).toString("utf8"));
    if (header.alg !== "HS256") {
      return { valid: false, error: `Unsupported algorithm: ${header.alg}` };
    }
  } catch {
    return { valid: false, error: "Invalid JWT header" };
  }

  // Verify signature using timing-safe comparison
  const signingInput = `${headerB64}.${payloadB64}`;
  const expectedSig = createHmac("sha256", secret).update(signingInput).digest("base64url");
  const actualSig = signatureB64;

  if (!actualSig) {
    return { valid: false, error: "Missing JWT signature" };
  }

  const expectedBuf = Buffer.from(expectedSig);
  const actualBuf = Buffer.from(actualSig);

  if (expectedBuf.length !== actualBuf.length || !timingSafeEqual(expectedBuf, actualBuf)) {
    return { valid: false, error: "Invalid JWT signature" };
  }

  // Decode payload
  try {
    const payload: JwtPayload = JSON.parse(base64UrlDecode(payloadB64).toString("utf8"));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "JWT expired" };
    }

    // Check issuer (Supabase uses its project URL as issuer)
    if (payload.iss && !payload.iss.startsWith("https://")) {
      // Soft check — log warning but don't reject (Supabase issuer format varies)
      logger.warn({ iss: payload.iss }, "JWT issuer unexpected format");
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: "Invalid JWT payload" };
  }
}

// ── Extract role from Supabase JWT claims ──

function extractRole(payload: JwtPayload): string {
  // Supabase stores roles in app_metadata.roles or app_metadata.role
  const appMeta = payload.app_metadata ?? {};
  const roles = appMeta["roles"] ?? appMeta["role"];
  if (Array.isArray(roles) && roles.length > 0) return String(roles[0]);
  if (typeof roles === "string") return roles;

  // Fallback: check user_metadata
  const userMeta = payload.user_metadata ?? {};
  const userRole = userMeta["role"];
  if (typeof userRole === "string") return userRole;

  return "user"; // Default authenticated role
}

// ── Middleware: Attach JWT-derived identity ──

export function attachJwtIdentity(jwtSecret: string | null) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (token && jwtSecret) {
      const result = verifySupabaseJwt(token, jwtSecret);
      if (result.valid) {
        const role = extractRole(result.payload);
        (req as any).rdmIdentity = {
          subject: result.payload.sub,
          email: result.payload.email ?? "",
          role,
          jwt: result.payload,
          authMethod: "jwt",
        } satisfies AuthenticatedIdentity;
        next();
        return;
      }
      // JWT present but invalid — REJECT. Never silently degrade to anonymous
      // when a secret is configured, as that masks auth failures in production.
      logger.warn({ error: result.error }, "JWT verification failed — rejecting request");
      res.status(401).json({
        ok: false,
        error: "unauthorized",
        message: "Invalid or expired token",
      });
      return;
    }

    if (token && !jwtSecret) {
      // Token provided but no secret configured (dev mode) — log and allow through
      logger.warn("Token provided but SUPABASE_JWT_SECRET not set — ignoring token (dev mode)");
    }

    // No token, or no secret configured (dev mode) — anonymous
    (req as any).rdmIdentity = {
      subject: "anonymous",
      email: "",
      role: "public",
      jwt: null,
      authMethod: jwtSecret ? "anonymous" : "anonymous",
    } satisfies AuthenticatedIdentity;
    next();
  };
}

// ── Middleware: Require valid JWT (401 if missing/invalid) ──

export function requireJwtAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    const identity = (req as any).rdmIdentity as AuthenticatedIdentity | undefined;
    if (!identity || identity.authMethod === "anonymous") {
      res.status(401).json({
        ok: false,
        error: "unauthorized",
        message: "Valid Bearer token required",
      });
      return;
    }
    next();
  };
}
