/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  phone?: string;
  website?: string;
  price_range: string;
  images: string[];
  rating: number;
  federation: string;
}

export const BUSINESSES: Business[] = [
  { id: "1", name: "Pastes Kiko's", description: "Los mejores pastes tradicionales de Real del Monte desde 1940, con receta original de los mineros ingleses.", category: "GASTRONOMIA", address: "Calle Principal 45", phone: "771-123-4567", price_range: "ECONOMICO", images: ["/images/gastronomia-paste.jpg"], rating: 4.8, federation: "GastronÃ³mica" },
  { id: "2", name: "Hotel Real del Monte", description: "Hotel boutique en el corazÃ³n del Pueblo MÃ¡gico con vistas al valle.", category: "HOSPEDAJE", address: "Av. Hidalgo 23", phone: "771-234-5678", website: "https://hotelrdm.mx", price_range: "MODERADO", images: ["/images/hotel-colonial.jpg"], rating: 4.5, federation: "Hospedaje" },
  { id: "3", name: "Taller de Plata VillaseÃ±or", description: "ArtesanÃ­a en plata fina con diseÃ±os inspirados en la herencia minera.", category: "PLATERIA", address: "Calle de la Plata 12", phone: "771-345-6789", price_range: "CARO", images: ["/images/artesanias-plata.jpg"], rating: 4.9, federation: "PlaterÃ­a y ArtesanÃ­a" },
  { id: "4", name: "CafÃ© El SocavÃ³n", description: "CafÃ© de especialidad en una antigua mina restaurada con ambiente acogedor.", category: "GASTRONOMIA", address: "CallejÃ³n Minero 8", phone: "771-456-7890", price_range: "MODERADO", images: ["/images/mine-entrance.jpg"], rating: 4.7, federation: "GastronÃ³mica" },
  { id: "5", name: "Posada del Minero", description: "Hospedaje rÃºstico-elegante con chimenea y desayuno tradicional incluido.", category: "HOSPEDAJE", address: "Calle Real 67", phone: "771-567-8901", price_range: "MODERADO", images: ["/images/hospedaje-cabana.jpg"], rating: 4.3, federation: "Hospedaje" },
  { id: "6", name: "Bar La Cornish", description: "Pub estilo inglÃ©s con cervezas artesanales y mÃºsica en vivo los fines de semana.", category: "BAR", address: "Plaza Principal 3", price_range: "MODERADO", images: ["/images/plaza-noche.jpg"], rating: 4.4, federation: "Comercio y Servicios" },
  { id: "7", name: "GuÃ­as Mineros RDM", description: "Recorridos guiados por las minas histÃ³ricas con expertos locales.", category: "TURISMO", address: "Mina de Acosta s/n", phone: "771-678-9012", price_range: "ECONOMICO", images: ["/images/mine-tunnel.jpg"], rating: 4.9, federation: "GuÃ­as y Experiencias" },
  { id: "8", name: "ArtesanÃ­as El PanteÃ³n", description: "Souvenirs y artesanÃ­as Ãºnicas inspiradas en el PanteÃ³n InglÃ©s.", category: "ARTESANIA", address: "Junto al PanteÃ³n InglÃ©s", price_range: "ECONOMICO", images: ["/images/panteon-ingles.jpg"], rating: 4.2, federation: "PlaterÃ­a y ArtesanÃ­a" },
  { id: "9", name: "Restaurante La Mina", description: "Cocina hidalguense contemporÃ¡nea con ingredientes locales de temporada.", category: "GASTRONOMIA", address: "Calle Morelos 15", phone: "771-789-0123", price_range: "CARO", images: ["/images/gastronomia-pastes.jpg"], rating: 4.6, federation: "GastronÃ³mica" },
  { id: "10", name: "Tienda Pueblo MÃ¡gico", description: "Todo lo que necesitas del Pueblo MÃ¡gico en un solo lugar.", category: "COMERCIO", address: "Av. Principal 89", price_range: "ECONOMICO", images: ["/images/calles-coloridas.jpg"], rating: 4.1, federation: "Comercio y Servicios" },
];

export const CATEGORY_ICONS: Record<string, string> = {
  GASTRONOMIA: "ðŸ½ï¸", HOSPEDAJE: "ðŸ¨", ARTESANIA: "ðŸŽ¨", PLATERIA: "ðŸ’",
  BAR: "ðŸº", COMERCIO: "ðŸª", SERVICIOS: "ðŸ”§", TURISMO: "ðŸ—ºï¸", OTROS: "ðŸ“¦",
};

export const PRICE_LABELS: Record<string, string> = {
  ECONOMICO: "$", MODERADO: "$$", CARO: "$$$", LUJO: "$$$$",
};

export const FEDERATIONS = [
  { id: "hospedaje", name: "Hospedaje", icon: "ðŸ¨", count: 2 },
  { id: "gastronomica", name: "GastronÃ³mica", icon: "ðŸ½ï¸", count: 3 },
  { id: "plateria", name: "PlaterÃ­a y ArtesanÃ­a", icon: "ðŸ’", count: 2 },
  { id: "comercio", name: "Comercio y Servicios", icon: "ðŸª", count: 2 },
  { id: "guias", name: "GuÃ­as y Experiencias", icon: "ðŸ—ºï¸", count: 1 },
  { id: "cultura", name: "Cultura y Memoria", icon: "ðŸ›ï¸", count: 0 },
  { id: "realito", name: "REALITO AI", icon: "ðŸ¤–", count: 0 },
];
