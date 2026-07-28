/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// Shared XR / DreamSpaces contracts

export interface XrScene {
  id: string;
  name: string;
  description?: string;
  worldUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface XrSession {
  id: string;
  ownerId: string;
  sceneId: string;
  startedAt: string;
  endedAt?: string;
  status: "active" | "completed" | "failed";
  metadata?: Record<string, unknown>;
}
