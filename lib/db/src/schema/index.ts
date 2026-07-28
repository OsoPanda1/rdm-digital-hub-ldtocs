/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// Re-export the canonical Drizzle schema from api-server.
// drizzle.config.ts and drizzle-kit push both read from this path.
export * from "../../../artifacts/api-server/src/db/schema";
