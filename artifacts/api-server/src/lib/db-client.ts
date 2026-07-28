// ────────────────────────────────────────────────────────────────
// Isabella DB Client — Supabase/PostgreSQL via Drizzle ORM
// Conexión central para persistencia de estado Isabella
// ────────────────────────────────────────────────────────────────

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../../db/schema";

const { Pool } = pg;

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _pool: pg.Pool | null = null;

export function getDb() {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "DATABASE_URL must be set for Supabase persistence in production."
      );
    }
    throw new Error(
      "DATABASE_URL not set. DB features unavailable in dev mode."
    );
  }

  _pool = new Pool({ connectionString: url, max: 20 });
  _db = drizzle(_pool, { schema });
  return _db;
}

export function getPool(): pg.Pool | null {
  return _pool;
}

export async function closeDb(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _db = null;
  }
}

export function isDbAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}
