// ────────────────────────────────────────────────────────────────
// Type-Safe Environment Configuration (PennyLane pattern)
// Validates all env vars at startup using Zod-like runtime checks.
// ────────────────────────────────────────────────────────────────

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

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

let _config: EnvConfig | null = null;

export function loadEnv(): EnvConfig {
  if (_config) return _config;

  const env = optionalEnv("NODE_ENV", "development");

  _config = {
    NODE_ENV: env as EnvConfig["NODE_ENV"],
    PORT: Number(optionalEnv("PORT", "3001")),
    DATABASE_URL: requireEnv("DATABASE_URL"),
    ALLOWED_ORIGINS: optionalEnv("ALLOWED_ORIGINS", "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
    MEXA_API_SECURE_KEY: requireEnv("MEXA_API_SECURE_KEY"),
    YUN_SIGNING_SECRET: requireEnv("YUN_SIGNING_SECRET"),
    SUPABASE_JWT_SECRET: env === "production"
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
