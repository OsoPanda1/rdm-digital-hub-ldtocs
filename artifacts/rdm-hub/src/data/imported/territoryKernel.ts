/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
export type POICategory = "historico" | "mineria" | "geologico" | "plaza" | "mercado" | "templo" | "escuela"
export type FederationLayer = "subsuelo" | "memoria-comestible" | "memoria-silenciosa" | "superficie" | "economia-local" | "metadatos" | "simulacion"

export interface LatLng { lat: number; lng: number }

export interface TerritoryPOI {
  id: string
  name: string
  category: POICategory
  municipality: string
  lat: number
  lng: number
  altitudeM: number
  description: string
  significance: string
}

export const RDM_TERRITORY_POIS: TerritoryPOI[] = [
  { id: "rdm-centro", name: "Real del Monte Â· Centro HistÃ³rico", category: "historico", municipality: "Real del Monte", lat: 20.1432, lng: -98.6694, altitudeM: 2700, description: "Cabecera del Nodo Cero. Templo principal del territorio TAMV.", significance: "Coordenada de fundaciÃ³n de la RepÃºblica Digital." },
  { id: "mina-acosta", name: "Mina de Acosta", category: "mineria", municipality: "Real del Monte", lat: 20.1378, lng: -98.6628, altitudeM: 2680, description: "Museo vivo de la minerÃ­a cornish-mexicana.", significance: "Patrimonio industrial activo desde 1727." },
  { id: "panteon-ingles", name: "PanteÃ³n InglÃ©s", category: "historico", municipality: "Real del Monte", lat: 20.1453, lng: -98.6712, altitudeM: 2720, description: "Cementerio cornish con 755 tumbas.", significance: "Memoria silenciosa de la migraciÃ³n cornish." },
  { id: "plaza-principal", name: "Plaza JuÃ¡rez", category: "plaza", municipality: "Real del Monte", lat: 20.1430, lng: -98.6690, altitudeM: 2700, description: "Punto de encuentro y mercado tradicional.", significance: "CorazÃ³n cÃ­vico del Nodo Cero." },
  { id: "bosque-hiloche", name: "Bosque del Hiloche", category: "geologico", municipality: "Real del Monte", lat: 20.1520, lng: -98.6800, altitudeM: 2900, description: "Bosque de niebla a 2,900 msnm.", significance: "PulmÃ³n ecolÃ³gico territorial." },
]

export interface Mine { id: string; name: string; founded: string; status: "patrimonio" | "visitable" | "memoria"; description: string }
export const mines: Mine[] = [
  { id: "mine-acosta", name: "Mina de Acosta", founded: "1727", status: "visitable", description: "Malacates en funcionamiento, tÃºneles con olor a carburo." },
  { id: "mine-dolores", name: "Mina de Dolores", founded: "1778", status: "memoria", description: "Vetas de plata cornish, hoy memoria del subsuelo." },
  { id: "mine-rosario", name: "Mina del Rosario", founded: "1739", status: "patrimonio", description: "Patrimonio industrial sellado." },
]

export interface Paste { id: string; name: string; filling: string; origin: "tradicional" | "mestizo" | "contemporÃ¡neo"; note: string }
export const pastes: Paste[] = [
  { id: "paste-carne-papa", name: "Paste de carne con papa", filling: "Res, papa, poro, especias", origin: "tradicional", note: "El cornish original adaptado al maÃ­z y chile." },
  { id: "paste-mole", name: "Paste de mole", filling: "Pollo en mole rojo", origin: "mestizo", note: "FusiÃ³n cornish-mexicana." },
  { id: "paste-piÃ±a", name: "Paste de piÃ±a", filling: "PiÃ±a caramelizada", origin: "contemporÃ¡neo", note: "Dulce, popular en el mercado de la plaza." },
]

export interface Legend { id: string; title: string; summary: string }
export const legends: Legend[] = [
  { id: "legend-llorona-mina", title: "La Llorona de la Mina", summary: "Voz femenina que se escucha en los socavones de Acosta al caer la noche." },
  { id: "legend-cornish-fantasma", title: "El minero cornish fantasma", summary: "ApariciÃ³n de un capataz inglÃ©s que recorre el PanteÃ³n InglÃ©s." },
  { id: "legend-niebla-hiloche", title: "La niebla del Hiloche", summary: "Bruma que oculta caminos y devuelve a los viajeros al punto de partida." },
]

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(h))
}

export function nearestPOIs(origin: LatLng, limit = 5) {
  return RDM_TERRITORY_POIS.map((p) => ({ ...p, distanceKm: haversineKm(origin, { lat: p.lat, lng: p.lng }) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit)
}