/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */

export interface Place {
  id: string;
  name: string;
  description: string;
  category: 'mina' | 'monumento' | 'restaurante' | 'mirador' | 'iglesia' | 'museo' | 'plaza' | 'calle';
  lat: number;
  lng: number;
  address?: string;
  hours?: string;
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
}

export interface PlaceFilters {
  category?: string;
  search?: string;
  minRating?: number;
  sortBy?: 'name' | 'rating' | 'distance';
}
