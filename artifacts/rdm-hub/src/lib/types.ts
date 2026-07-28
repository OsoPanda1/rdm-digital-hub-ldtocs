/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
export type Intent = "gastronomia" | "aventura" | "historia" | "hospedaje" | "cultura";

export interface Place {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  rating: number;
  description: string;
}

export interface KernelInput {
  userId: string;
  query: string;
  geo?: { lat: number; lng: number };
  timestamp: number;
}
