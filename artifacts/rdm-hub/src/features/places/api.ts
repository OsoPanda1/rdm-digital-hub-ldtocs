/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import type { Place, PlaceFilters } from './types';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

const FALLBACK_PLACES: Place[] = [
  { id: 'pm-1', name: 'Mina San Rafael', description: 'Mina historica donde los mineros cornish trabajaron en el siglo XIX. Se conservan los tuneles originales y la maquinaria britanica.', category: 'mina', lat: 20.1421, lng: -98.6712, address: 'Camino a la Mina s/n', hours: 'Mar-Dom 10:00-17:00', rating: 4.7, reviewCount: 128, images: ['/images/mina-acosta.webp'], tags: ['mineria', 'cornish', 'historia', 'tuneles'] },
  { id: 'pm-2', name: 'Panteon Ingles', description: 'Cementerio de la colonia britanica del siglo XIX. Tumbas con inscripciones en ingles y unico en su tipo en America Latina.', category: 'monumento', lat: 20.1455, lng: -98.6678, address: 'Camino al Panteon s/n', rating: 4.8, reviewCount: 95, images: ['/images/panteon.webp'], tags: ['patrimonio', 'ingles', 'cementerio', 'siglo-xix'] },
  { id: 'pm-3', name: 'Plaza Mina', description: 'Plaza principal de Real del Monte con monumento al minero. Punto de encuentro y arranque de las principales rutas turisticas.', category: 'plaza', lat: 20.1438, lng: -98.6688, address: 'Plaza Mina, Centro', rating: 4.5, reviewCount: 203, images: ['/images/plaza-mina.webp'], tags: ['centro', 'monumento', 'turismo', 'encuentro'] },
  { id: 'pm-4', name: 'Callejon del Beso', description: 'Pasaje romantico con la leyenda de dos enamorados de familias rivales que se besaban desde los balcones opuestos.', category: 'calle', lat: 20.1442, lng: -98.6700, address: 'Callejon del Beso, Centro', rating: 4.6, reviewCount: 167, images: ['/images/callejon.webp'], tags: ['leyenda', 'romantico', 'colonial', 'fotografia'] },
  { id: 'pm-5', name: 'Mirador de San Miguel', description: 'Mirador panoramico con vista 360 del valle de Pachuca, las montanas y el pueblo colonial. Ideal para el atardecer.', category: 'mirador', lat: 20.1460, lng: -98.6670, address: 'Cerro de San Miguel', rating: 4.9, reviewCount: 312, images: ['/images/mirador.webp'], tags: ['vista', 'panoramico', 'atardecer', 'naturaleza'] },
  { id: 'pm-6', name: 'Museo Francisco Rule', description: 'Museo de historia minera con maquinaria original del siglo XIX, herramientas cornish y documentos historicos de la colonia britanica.', category: 'museo', lat: 20.1435, lng: -98.6695, address: 'Calle Hidalgo 30', hours: 'Mar-Dom 10:00-18:00', rating: 4.7, reviewCount: 89, images: ['/images/museo.webp'], tags: ['museo', 'historia', 'maquinaria', 'cornish'] },
  { id: 'pm-7', name: 'Iglesia de San Francisco', description: 'Parroquia colonial del siglo XVII con retablos barrocos. Centro de las festividades religiosas incluyendo la Semana Santa con tamborileros.', category: 'iglesia', lat: 20.1440, lng: -98.6690, address: 'Plaza de Armas s/n', rating: 4.6, reviewCount: 145, images: ['/images/iglesia.webp'], tags: ['colonial', 'barroco', 'semana-santa', 'tamborileros'] },
  { id: 'pm-8', name: 'Pastes El Portal', description: 'Pasteria tradicional desde 1985 con la receta original cornish. Los mejores pastes de Real del Monte con ingredientes frescos locales.', category: 'restaurante', lat: 20.1436, lng: -98.6692, address: 'Calle 5 de Mayo 12', hours: 'Lun-Dom 8:00-21:00', rating: 4.9, reviewCount: 256, images: ['/images/pasterias.png'], tags: ['pastes', 'cornish', 'gastronomia', 'tradicion'] },
];

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...init });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json();
  if (json && typeof json === 'object' && 'ok' in json) {
    if (!json.ok) throw new Error(json.error?.message || `API error`);
    return json.data as T;
  }
  return json as T;
}

export async function getPlaces(filters?: PlaceFilters): Promise<Place[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.search) params.set('search', filters.search);
    if (filters?.minRating) params.set('minRating', String(filters.minRating));
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    const qs = params.toString();
    const data = await apiFetch<Place[]>(`/territory/places${qs ? `?${qs}` : ''}`);
    if (data && data.length > 0) return data;
    return filterFallback(filters);
  } catch {
    return filterFallback(filters);
  }
}

export async function getPlaceById(id: string): Promise<Place | null> {
  try {
    const data = await apiFetch<Place>(`/territory/places/${id}`);
    return data ?? null;
  } catch {
    return FALLBACK_PLACES.find((p) => p.id === id) ?? null;
  }
}

export async function getPlacesNearby(lat: number, lng: number, radius: number = 5000): Promise<Place[]> {
  try {
    const data = await apiFetch<Place[]>(`/territory/places?lat=${lat}&lng=${lng}&radius=${radius}`);
    if (data && data.length > 0) return data;
    return FALLBACK_PLACES;
  } catch {
    return FALLBACK_PLACES;
  }
}

export async function searchPlaces(query: string): Promise<Place[]> {
  try {
    const data = await apiFetch<Place[]>(`/territory/places?search=${encodeURIComponent(query)}`);
    if (data && data.length > 0) return data;
    return FALLBACK_PLACES.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.includes(query.toLowerCase()))
    );
  } catch {
    return FALLBACK_PLACES.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}

function filterFallback(filters?: PlaceFilters): Place[] {
  let result = [...FALLBACK_PLACES];
  if (filters?.category) result = result.filter((p) => p.category === filters.category);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (filters?.minRating) result = result.filter((p) => p.rating >= (filters.minRating ?? 0));
  if (filters?.sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
  else if (filters?.sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}
