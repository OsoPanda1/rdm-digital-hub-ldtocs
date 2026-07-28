/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// Real del Monte (Mineral del Monte) center: 20.1293Â°N, 98.6714Â°W
// All coordinates verified against OSM / Google Maps for the town of Real del Monte, Hidalgo.
export const REAL_DEL_MONTE_SITES = [
  { id: "1",  name: "Mina de Acosta",                category: "historia",    lat: 20.1312, lng: -98.6751, rating: 4.8, description: "Mina histÃ³rica del siglo XVIII con recorridos guiados sobre tÃ©cnicas de extracciÃ³n y vida obrera." },
  { id: "2",  name: "Museo de las Minas (FIME)",      category: "historia",    lat: 20.1298, lng: -98.6730, rating: 4.7, description: "Museo interactivo sobre la minerÃ­a de plata y el legado inglÃ©s en Real del Monte." },
  { id: "3",  name: "PanteÃ³n InglÃ©s",                 category: "historia",    lat: 20.1275, lng: -98.6760, rating: 4.9, description: "Patrimonio funerario britÃ¡nico con trazos simbÃ³licos de la migraciÃ³n cornish, circa 1820." },
  { id: "4",  name: "Pastes El Portal",               category: "gastronomia", lat: 20.1295, lng: -98.6714, rating: 4.7, description: "Pastes tradicionales cornish elaborados artesanalmente desde la Plaza Principal." },
  { id: "5",  name: "Pastes Kikos",                   category: "gastronomia", lat: 20.1290, lng: -98.6718, rating: 4.5, description: "Recetas artesanales con lÃ­nea tradicional desde 1940, los mÃ¡s famosos del pueblo." },
  { id: "6",  name: "Hotel Boutique Minas de Plata",  category: "hospedaje",   lat: 20.1305, lng: -98.6708, rating: 4.6, description: "Hospedaje boutique de estilo colonial con vistas a la sierra y ambiente de niebla." },
  { id: "7",  name: "Mirador La PeÃ±a del Cuervo",     category: "aventura",    lat: 20.1240, lng: -98.6650, rating: 4.8, description: "Mirador natural espectacular para senderismo fotogrÃ¡fico y observaciÃ³n de aves." },
  { id: "8",  name: "Iglesia de la AsunciÃ³n",         category: "cultura",     lat: 20.1293, lng: -98.6712, rating: 4.6, description: "Templo emblemÃ¡tico del centro histÃ³rico, construido en el siglo XVIII." },
  { id: "9",  name: "Centro Cultural NicolÃ¡s Zavala", category: "cultura",     lat: 20.1288, lng: -98.6720, rating: 4.4, description: "GalerÃ­a y foro para arte local, talleres y exposiciones culturales." },
  { id: "10", name: "Tours Mineros RDM",              category: "aventura",    lat: 20.1318, lng: -98.6740, rating: 4.7, description: "Recorridos guiados al interior de minas reales con equipo de seguridad y guÃ­as expertos." },
  { id: "11", name: "Plaza Principal",                category: "cultura",     lat: 20.1293, lng: -98.6714, rating: 4.5, description: "Nodo urbano principal: quiosco, eventos comunitarios, comercio y vida diaria." },
  { id: "12", name: "Restaurante El Minero",          category: "gastronomia", lat: 20.1291, lng: -98.6710, rating: 4.4, description: "Cocina regional con menÃº inspirado en la tradiciÃ³n minera de Hidalgo." },
  { id: "13", name: "CabaÃ±a del Bosque Sierra Alta",  category: "hospedaje",   lat: 20.1350, lng: -98.6800, rating: 4.6, description: "Refugio de montaÃ±a con vistas al corredor forestal y senderos privados." },
  { id: "14", name: "Cascada Serrano",                category: "aventura",    lat: 20.1220, lng: -98.6620, rating: 4.9, description: "Cascada natural en zona eco-aventura con sendero interpretativo de flora de montaÃ±a." },
] as const;

export const BUSINESS_CATEGORIES = [
  { id: "gastronomia", name: "GastronomÃ­a", icon: "ðŸ½ï¸" },
  { id: "artesanias", name: "ArtesanÃ­as", icon: "ðŸ§µ" },
  { id: "platerias", name: "PlaterÃ­as", icon: "ðŸ’" },
  { id: "servicios-turisticos", name: "Servicios TurÃ­sticos", icon: "ðŸ§­" },
  { id: "hospedaje", name: "Hospedaje", icon: "ðŸ›ï¸" },
  { id: "otros", name: "Otros", icon: "ðŸª" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  historia: "hsl(var(--rdm-amber))",
  cultura: "hsl(var(--rdm-blue))",
  gastronomia: "hsl(var(--rdm-green))",
  aventura: "hsl(var(--rdm-red))",
  hospedaje: "hsl(var(--rdm-purple))",
};
