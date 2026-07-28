/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// In development, gracefully degrade if DATABASE_URL is not set.
// In production, fail fast â€” the server must have a database.
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  console.warn(
    "[DB] DATABASE_URL not set â€” running in dev-degraded mode. DB features disabled.",
  );
}

export const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : null;

export const db = pool ? drizzle(pool, { schema }) : null;

export * from "./schema";
