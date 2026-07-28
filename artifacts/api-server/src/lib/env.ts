/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Type-Safe Environment Configuration (PennyLane pattern)
// Validates all env vars at startup using Zod-like runtime checks.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { logger } from "./logger";

interface EnvConfig {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  DATABASE_URL: string;
  ALLOWED_ORIGINS: string[];
  MEXA_API_SECURE_KEY: string;
  YUN_SIGNING_SECRET: string;
  SUPABASE_JWT_SECRET: string | null;
  RDM_SECURITY_PROFILE: string;
  RDM_FEDERATION_MODE: string;
  RDM_OBSERVABILITY_MODE: string;
  LOG_LEVEL: string;
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Set it in .env or your deployment environment.`
    );
  }
  return value;
}

let _config: EnvConfig | null = null;

export function loadEnv(): EnvConfig {
  if (_config) return _config;

  const env = optionalEnv("NODE_ENV", "development");
  const isProduction = env === "production";
  const missing: string[] = [];

  const databaseUrl = process.env.DATABASE_URL ?? "";
  const mexaKey = process.env.MEXA_API_SECURE_KEY ?? "";
  const yunSecret = process.env.YUN_SIGNING_SECRET ?? "";

  if (!databaseUrl) missing.push("DATABASE_URL");
  if (!mexaKey) missing.push("MEXA_API_SECURE_KEY");
  if (!yunSecret) missing.push("YUN_SIGNING_SECRET");

  if (isProduction && missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
      `Set them in your deployment environment (Replit Secrets).`
    );
  }

  if (missing.length > 0) {
    logger.warn(
      { missing, nodeEnv: env },
      "Missing environment variables â€” using dev fallbacks. Do NOT use these values in production.",
    );
  }

  _config = {
    NODE_ENV: env as EnvConfig["NODE_ENV"],
    PORT: Number(optionalEnv("PORT", "3001")),
    DATABASE_URL: databaseUrl || "postgresql://localhost:5432/rdm_dev",
    ALLOWED_ORIGINS: optionalEnv("ALLOWED_ORIGINS", "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
    MEXA_API_SECURE_KEY: mexaKey || "dev-placeholder-not-for-production",
    YUN_SIGNING_SECRET: yunSecret || "dev-placeholder-not-for-production",
    SUPABASE_JWT_SECRET: isProduction
      ? requireEnv("SUPABASE_JWT_SECRET")
      : optionalEnv("SUPABASE_JWT_SECRET", ""),
    RDM_SECURITY_PROFILE: optionalEnv("RDM_SECURITY_PROFILE", "dev-relaxed"),
    RDM_FEDERATION_MODE: optionalEnv("RDM_FEDERATION_MODE", "heptafederado-dev"),
    RDM_OBSERVABILITY_MODE: optionalEnv("RDM_OBSERVABILITY_MODE", "verbose"),
    LOG_LEVEL: optionalEnv("LOG_LEVEL", "info"),
  };

  logger.info(
    {
      nodeEnv: _config.NODE_ENV,
      securityProfile: _config.RDM_SECURITY_PROFILE,
      federationMode: _config.RDM_FEDERATION_MODE,
    },
    "Environment configuration loaded.",
  );

  return _config;
}

export function getEnv(): EnvConfig {
  if (!_config) return loadEnv();
  return _config;
}
