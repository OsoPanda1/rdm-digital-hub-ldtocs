/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
export interface BusinessCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface CommercialBusiness {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  status: "active" | "coming_soon";
}

export const BUSINESS_CAPACITY_TARGET = 250;

export const RDM_BUSINESS_CATEGORIES: BusinessCategory[] = [
  { id: "gastronomia", name: "GastronomÃ­a", description: "Cocina local, cafeterÃ­as y panaderÃ­a artesanal.", icon: "ðŸ½ï¸" },
  { id: "artesanias", name: "ArtesanÃ­as", description: "Textiles, piezas decorativas y arte popular.", icon: "ðŸ§µ" },
  { id: "platerias", name: "PlaterÃ­as", description: "JoyerÃ­a de plata y talleres especializados.", icon: "ðŸ’" },
  { id: "tiendas-miscelaneas", name: "Tiendas & MiscelÃ¡neas", description: "Comercio de conveniencia y variedad diaria.", icon: "ðŸ›ï¸" },
  { id: "servicios-turisticos", name: "Servicios TurÃ­sticos", description: "Recorridos, guÃ­as, racers, cuatrimotos y camioncitos turÃ­sticos.", icon: "ðŸ§­" },
  { id: "bares", name: "Bares", description: "MixologÃ­a, mÃºsica y ambiente nocturno.", icon: "ðŸ¸" },
  { id: "hospedaje", name: "Hospedaje", description: "Hoteles, cabaÃ±as y cuartos disponibles.", icon: "ðŸ›ï¸" },
  { id: "otros", name: "Otros Comercios", description: "Ropa, verdura, aseo del hogar, zapaterÃ­as, papelerÃ­as y salones.", icon: "ðŸª" },
  { id: "emergencias", name: "Emergencias", description: "Cerrajeros, dentales, mÃ©dicos, mecÃ¡nicos y talacheras.", icon: "ðŸš¨" },
  { id: "nuevas-secciones", name: "Nuevas Secciones", description: "Espacio para categorÃ­as futuras no contempladas aÃºn.", icon: "âž•" },
];

export const MAP_INTEGRATION_PHASES = [
  "Fase 1: normalizaciÃ³n de categorÃ­as y campos para 250 negocios.",
  "Fase 2: filtros dinÃ¡micos por categorÃ­a, estado y cobertura territorial.",
  "Fase 3: analÃ­tica de demanda y densidad comercial por cuadrante.",
  "Fase 4: conexiÃ³n con onboarding digital para altas en tiempo real.",
];

export const INITIAL_COMMERCIAL_BUSINESSES: CommercialBusiness[] = [
  { id: "biz-001", name: "Pastes Mina Real", category: "gastronomia", lat: 20.137, lng: -98.670, status: "active" },
  { id: "biz-002", name: "Plata Monte Alto", category: "platerias", lat: 20.139, lng: -98.672, status: "active" },
  { id: "biz-003", name: "Ruta Cuatrimoto Eclipse", category: "servicios-turisticos", lat: 20.141, lng: -98.675, status: "coming_soon" },
  { id: "biz-004", name: "Casa CabaÃ±a del Bosque", category: "hospedaje", lat: 20.136, lng: -98.667, status: "active" },
  { id: "biz-005", name: "Talachera Hidalgo Express", category: "emergencias", lat: 20.134, lng: -98.673, status: "coming_soon" },
  { id: "biz-006", name: "MercerÃ­a La MontaÃ±a", category: "artesanias", lat: 20.132, lng: -98.669, status: "active" },
];
