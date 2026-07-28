/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import type { Coordenadas } from "@/core/models";

export function withinBBox(a: Coordenadas, b: Coordenadas, meters: number) {
  const deg = meters / 111_320;
  return Math.abs(a.lat - b.lat) <= deg && Math.abs(a.lng - b.lng) <= deg;
}
