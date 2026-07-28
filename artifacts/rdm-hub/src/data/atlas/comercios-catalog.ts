/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// src/data/comercios.ts
// Directorio fundacional de comercios y oficios â€” capa V (economÃ­a local) del LTOS.
// Fusiona el seed `businesses.json` del repo `rdm-digital-os` con la cartografÃ­a
// real del Pueblo MÃ¡gico. Cada entrada estÃ¡ pensada para alimentar mapa,
// recomendador Isabella y futuros pagos vÃ­a Cattleya Pay.

export type ComercioCategoria =
  | "paste"
  | "cafe"
  | "restaurante"
  | "hospedaje"
  | "artesania"
  | "guia"
  | "experiencia"
  | "mercado";

export type ComercioMembresia = "comunidad" | "raiz" | "guardian";

export interface Comercio {
  id: string;
  nombre: string;
  categoria: ComercioCategoria;
  membresia: ComercioMembresia;
  tagline: string;
  descripcion: string;
  direccion: string;
  horario: string;
  rangoPrecio: "$" | "$$" | "$$$";
  tags: string[];
  lat: number;
  lng: number;
  // Sello narrativo: pequeÃ±a frase que el comerciante quiere que se recuerde
  sello?: string;
}

export const comercios: Comercio[] = [
  {
    id: "com-pasteria-real",
    nombre: "PasterÃ­a La Plaza",
    categoria: "paste",
    membresia: "raiz",
    tagline: "Hornos a leÃ±a desde 1952",
    descripcion:
      "Tres generaciones de la misma familia horneando pastes con la receta original cornish, ajustada al chile y al mole.",
    direccion: "Calle Hidalgo s/n, frente a la Plaza Principal",
    horario: "Lâ€“D Â· 07:00â€“21:00",
    rangoPrecio: "$",
    tags: ["paste-tradicional", "carne-papa", "mole-verde", "para-llevar"],
    lat: 20.1431,
    lng: -98.6691,
    sello: "El primer paste del dÃ­a siempre se regala al primer cliente.",
  },
  {
    id: "com-cafe-neblina",
    nombre: "CafÃ© Neblina",
    categoria: "cafe",
    membresia: "raiz",
    tagline: "Donde la sierra se asoma a la taza",
    descripcion:
      "Terraza con vista al cerro y cafÃ© de la regiÃ³n hidalguense. Punto de encuentro de viajeros, escritores y mineros jubilados.",
    direccion: "CallejÃ³n de los Mineros 12",
    horario: "Lâ€“D Â· 08:00â€“22:00",
    rangoPrecio: "$$",
    tags: ["vista", "wifi", "lectura", "niebla"],
    lat: 20.1422,
    lng: -98.6707,
    sello: "Si llueve, el cafÃ© americano es cortesÃ­a de la casa.",
  },
  {
    id: "com-mesa-cornish",
    nombre: "La Mesa Cornish",
    categoria: "restaurante",
    membresia: "guardian",
    tagline: "Hidalgo y Cornualles, en un mismo plato",
    descripcion:
      "Cocina contemporÃ¡nea que dialoga con la tradiciÃ³n minera: cordero al hoyo, sopa de hongos del Hiloche, postres con piloncillo.",
    direccion: "Plaza JuÃ¡rez 4, planta alta",
    horario: "Miâ€“D Â· 13:00â€“22:00",
    rangoPrecio: "$$$",
    tags: ["maridaje", "cocina-de-autor", "reservaciones"],
    lat: 20.143,
    lng: -98.6689,
  },
  {
    id: "com-posada-mineral",
    nombre: "Posada Mineral",
    categoria: "hospedaje",
    membresia: "raiz",
    tagline: "Antigua casa de capataces, hoy doce habitaciones",
    descripcion:
      "Casona del siglo XIX restaurada con maderas locales. Cada habitaciÃ³n lleva el nombre de una mina.",
    direccion: "Calle ConstituciÃ³n 27",
    horario: "RecepciÃ³n 24 h",
    rangoPrecio: "$$",
    tags: ["historico", "familiar", "chimenea", "desayuno-incluido"],
    lat: 20.1438,
    lng: -98.6704,
    sello: "El cuarto Mina Dolores tiene vista al panteÃ³n inglÃ©s al amanecer.",
  },
  {
    id: "com-taller-cobre",
    nombre: "Taller del Cobre",
    categoria: "artesania",
    membresia: "comunidad",
    tagline: "Cobre martillado a mano",
    descripcion:
      "Piezas utilitarias y decorativas trabajadas con tÃ©cnicas heredadas de la herrerÃ­a minera. Visitas al taller con cita.",
    direccion: "Calle Mariano JimÃ©nez 9",
    horario: "Lâ€“S Â· 10:00â€“18:00",
    rangoPrecio: "$$",
    tags: ["taller-abierto", "regalo", "souvenir-no-turistico"],
    lat: 20.1426,
    lng: -98.6698,
  },
  {
    id: "com-ruta-guia-victor",
    nombre: "VÃ­ctor Mendoza Â· GuÃ­a de minas",
    categoria: "guia",
    membresia: "guardian",
    tagline: "Ex-minero, narrador, certificado",
    descripcion:
      "Recorridos privados por Acosta, Dolores y el panteÃ³n inglÃ©s. Cuenta la historia desde dentro, no desde el folleto.",
    direccion: "Punto de encuentro: Plaza JuÃ¡rez",
    horario: "Reservas con 24 h",
    rangoPrecio: "$$",
    tags: ["historia-oral", "minas", "ingles-basico"],
    lat: 20.143,
    lng: -98.669,
  },
  {
    id: "com-mercado-domingo",
    nombre: "Mercado del Domingo",
    categoria: "mercado",
    membresia: "comunidad",
    tagline: "Hongos, hierbas y obsequios del bosque",
    descripcion:
      "Mercado semanal donde productoras del Hiloche bajan con cosecha de temporada. Indispensable en otoÃ±o.",
    direccion: "Atrio del templo principal",
    horario: "D Â· 08:00â€“14:00",
    rangoPrecio: "$",
    tags: ["temporada", "hongos", "trueque"],
    lat: 20.1432,
    lng: -98.6692,
  },
  {
    id: "com-experiencia-cementerio",
    nombre: "Noche del PanteÃ³n InglÃ©s",
    categoria: "experiencia",
    membresia: "guardian",
    tagline: "Recorrido nocturno con velas y narradores",
    descripcion:
      "Cada Ãºltimo viernes del mes. Cupo limitado a 25 personas. Narrativa basada en archivos parroquiales reales.",
    direccion: "PanteÃ³n InglÃ©s Â· Camino al Hiloche",
    horario: "Ãšltimo viernes Â· 19:00",
    rangoPrecio: "$$",
    tags: ["nocturno", "memoria", "cornualles"],
    lat: 20.1453,
    lng: -98.6712,
  },
];

export const comercioCategoriaLabel: Record<ComercioCategoria, string> = {
  paste: "Pastes",
  cafe: "CafÃ©s",
  restaurante: "Restaurantes",
  hospedaje: "Hospedaje",
  artesania: "ArtesanÃ­a",
  guia: "GuÃ­as",
  experiencia: "Experiencias",
  mercado: "Mercados",
};

export const membresiaLabel: Record<ComercioMembresia, string> = {
  comunidad: "Comunidad",
  raiz: "RaÃ­z",
  guardian: "GuardiÃ¡n",
};
