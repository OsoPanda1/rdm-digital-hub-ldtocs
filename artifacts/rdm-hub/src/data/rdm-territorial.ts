/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
/**
 * CORPUS MAXIMUS RDM DIGITAL â€” Datos Territoriales Completos
 * Fuente: Expediente IDT RDM-INFRA-TOTAL-001
 */

export interface Estacionamiento {
  id: string;
  nombre: string;
  ubicacion: string;
  lat: number;
  lng: number;
  capacidad: string;
  tipo: "masiva" | "alta" | "media" | "baja";
}

export interface SitioPatrimonial {
  id: string;
  nombre: string;
  categoria: "museo" | "monumento" | "espacio-identidad" | "hito-visual" | "naturaleza";
  descripcion: string;
  lat: number;
  lng: number;
  horario?: string;
  icono: string;
  destacado?: boolean;
}

export interface RutaTematica {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  dificultad: "FÃ¡cil" | "Moderada" | "Avanzada";
  paradas: string[];
  color: string;
}

// â”€â”€â”€â”€â”€ I. ESTACIONAMIENTOS (NODO CERO DE MOVILIDAD) â”€â”€â”€â”€â”€

export const ESTACIONAMIENTOS: Estacionamiento[] = [
  { id: "EST-01", nombre: "Explanada de Dolores", ubicacion: "Calle Dolores, Barrio de Dolores", lat: 20.13585, lng: -98.67049, capacidad: "Masiva â€” Nodo sur de museos", tipo: "masiva" },
  { id: "EST-02", nombre: "Don Fredy", ubicacion: "La Trinidad 147, La Quebradilla", lat: 20.13846, lng: -98.67047, capacidad: "Alta â€” Acceso rÃ¡pido al centro", tipo: "alta" },
  { id: "EST-03", nombre: "Estacionamiento Mayor", ubicacion: "Av. JuÃ¡rez (Entrada Principal)", lat: 20.13780, lng: -98.67550, capacidad: "Masiva â€” Principal receptÃ¡culo", tipo: "masiva" },
  { id: "EST-04", nombre: "Santa Teresa", ubicacion: "Zona de Museos Sur (Mina Acosta)", lat: 20.13450, lng: -98.67010, capacidad: "Media â€” Privado", tipo: "media" },
  { id: "EST-05", nombre: "Los Portales", ubicacion: "Calle Guerrero, Plaza Principal", lat: 20.14010, lng: -98.67150, capacidad: "Media â€” Privado comercial", tipo: "media" },
  { id: "EST-06", nombre: "Hotel ParaÃ­so Real", ubicacion: "Av. Hidalgo (Centro HistÃ³rico)", lat: 20.14080, lng: -98.67250, capacidad: "Baja â€” Exclusivo pernocta", tipo: "baja" },
  { id: "EST-07", nombre: "Parque Sensorial", ubicacion: "Carretera a Pachuca (Ãrea Bosque)", lat: 20.14200, lng: -98.68500, capacidad: "Media â€” Ecoturismo", tipo: "media" },
];

// â”€â”€â”€â”€â”€ II. MUSEOS Y SOCAVONES â”€â”€â”€â”€â”€

export const MUSEOS_SITIO: SitioPatrimonial[] = [
  { id: "MUS-01", nombre: "Mina de Acosta", categoria: "museo", descripcion: "Recorrido subterrÃ¡neo de 400m. Conserva maquinaria de vapor y elÃ©ctrica.", lat: 20.13520, lng: -98.66980, horario: "10:00â€“18:00 (Mar-Dom)", icono: "â›ï¸", destacado: true },
  { id: "MUS-02", nombre: "Mina La Dificultad", categoria: "museo", descripcion: "Hito de la transiciÃ³n tecnolÃ³gica minera.", lat: 20.14595, lng: -98.67194, horario: "10:00â€“18:00 (MiÃ©-Dom)", icono: "ðŸ—ï¸" },
  { id: "MUS-03", nombre: "Museo de Medicina Laboral", categoria: "museo", descripcion: "Ãšnico en su tipo: narra la historia del hospital minero.", lat: 20.13650, lng: -98.67120, horario: "10:00â€“18:00 (Mar-Dom)", icono: "ðŸ¥", destacado: true },
  { id: "MUS-04", nombre: "Casa Grande (Archivo HistÃ³rico)", categoria: "museo", descripcion: "Memoria documental de la empresa minera.", lat: 20.14070, lng: -98.67280, icono: "ðŸ“œ" },
  { id: "MUS-05", nombre: "Museo del Paste", categoria: "museo", descripcion: "Legado de Cornualles; taller interactivo de cocciÃ³n.", lat: 20.13950, lng: -98.67050, icono: "ðŸ¥Ÿ", destacado: true },
];

// â”€â”€â”€â”€â”€ III. ESPACIOS DE IDENTIDAD Y MEMORIA â”€â”€â”€â”€â”€

export const ESPACIOS_IDENTIDAD: SitioPatrimonial[] = [
  { id: "IDE-01", nombre: "PanteÃ³n InglÃ©s (1851)", categoria: "espacio-identidad", descripcion: "Tumbas orientadas a Europa; sÃ­mbolo del mestizaje cultural.", lat: 20.13827, lng: -98.66704, icono: "ðŸª¦", destacado: true },
  { id: "IDE-02", nombre: "GalerÃ­a Badillo", categoria: "espacio-identidad", descripcion: "Calle Iturbide 6. Repositorio fotogrÃ¡fico privado de la evoluciÃ³n de Real del Monte.", lat: 20.13985, lng: -98.67204, icono: "ðŸ“¸" },
  { id: "IDE-03", nombre: "Monumento a la 1ra Huelga en AmÃ©rica", categoria: "monumento", descripcion: "Mural y monumento en la entrada principal; hito del derecho laboral mundial.", lat: 20.13824, lng: -98.67336, icono: "âœŠ", destacado: true },
];

// â”€â”€â”€â”€â”€ IV. HITOS VISUALES Y DEPORTIVOS â”€â”€â”€â”€â”€

export const HITOS_VISUALES: SitioPatrimonial[] = [
  { id: "VIS-01", nombre: "Letras Monumentales (Plaza)", categoria: "hito-visual", descripcion: "Frente a la Parroquia del Rosario.", lat: 20.14033, lng: -98.67199, icono: "ðŸ“" },
  { id: "VIS-02", nombre: "Letras Monumentales (Dificultad)", categoria: "hito-visual", descripcion: "A 20m de la mina.", lat: 20.14595, lng: -98.67194, icono: "ðŸ“" },
  { id: "VIS-03", nombre: "CallejÃ³n de las Leyendas del FÃºtbol", categoria: "hito-visual", descripcion: "Homenaje a la cuna del fÃºtbol mexicano.", lat: 20.14045, lng: -98.67260, icono: "âš½" },
  { id: "VIS-04", nombre: "CallejÃ³n de los Artistas", categoria: "hito-visual", descripcion: "Pasaje con murales dedicados a la cinematografÃ­a nacional filmada en el territorio.", lat: 20.14040, lng: -98.67240, icono: "ðŸŽ¬" },
];

// â”€â”€â”€â”€â”€ V. PATRIMONIO NATURAL â”€â”€â”€â”€â”€

export const PATRIMONIO_NATURAL: SitioPatrimonial[] = [
  { id: "NAT-01", nombre: "Bosque El Hiloche", categoria: "naturaleza", descripcion: "Reserva estatal. Senderismo, ciclismo y miradores.", lat: 20.14250, lng: -98.68000, icono: "ðŸŒ²", destacado: true },
  { id: "NAT-02", nombre: "Lienzo Charro Municipal", categoria: "naturaleza", descripcion: "En el corazÃ³n del Hiloche; cultura del caballo bajo microclima de montaÃ±a.", lat: 20.14260, lng: -98.68010, icono: "ðŸŽ" },
  { id: "NAT-03", nombre: "PeÃ±as Cargadas", categoria: "naturaleza", descripcion: "Formaciones basÃ¡lticas para rappel, escalada y fotografÃ­a.", lat: 20.12450, lng: -98.64600, icono: "ðŸª¨", destacado: true },
  { id: "NAT-04", nombre: "Ruta del Pulque (Tezoantla)", categoria: "naturaleza", descripcion: "Tinacales tradicionales y producciÃ³n ancestral de aguamiel.", lat: 20.12576, lng: -98.64768, icono: "ðŸ¶" },
];

// â”€â”€â”€â”€â”€ RUTAS TEMÃTICAS â”€â”€â”€â”€â”€

export const RUTAS_TEMATICAS: RutaTematica[] = [
  {
    id: "RT-01",
    nombre: "Ruta de los Pastes AutÃ©nticos",
    descripcion: "Recorre las pastelerÃ­as originales de tradiciÃ³n cornish. Degusta pastes artesanales en cada parada.",
    duracion: "2â€“3 horas",
    dificultad: "FÃ¡cil",
    paradas: ["Museo del Paste", "Pastes El Portal", "Pastes Kikos", "Plaza Principal"],
    color: "hsl(24 72% 50%)",
  },
  {
    id: "RT-02",
    nombre: "Camino de la Mina y la Niebla",
    descripcion: "Del centro histÃ³rico a la profundidad de la Mina de Acosta, pasando por el Monumento a la Huelga.",
    duracion: "3â€“4 horas",
    dificultad: "Moderada",
    paradas: ["Monumento a la 1ra Huelga", "Mina de Acosta", "Museo de Medicina Laboral", "PanteÃ³n InglÃ©s"],
    color: "hsl(212 36% 45%)",
  },
  {
    id: "RT-03",
    nombre: "Circuito de Miradores",
    descripcion: "Los mejores puntos panorÃ¡micos de la sierra con vistas al valle y la neblina.",
    duracion: "4â€“5 horas",
    dificultad: "Moderada",
    paradas: ["PeÃ±as Cargadas", "Bosque El Hiloche", "Mirador La Cruz"],
    color: "hsl(154 66% 36%)",
  },
  {
    id: "RT-04",
    nombre: "Noches MÃ¡gicas en RDM",
    descripcion: "Recorrido nocturno por callejones con leyendas, iluminaciÃ³n y gastronomÃ­a de noche.",
    duracion: "2 horas",
    dificultad: "FÃ¡cil",
    paradas: ["CallejÃ³n de las Leyendas", "CallejÃ³n de los Artistas", "Plaza Principal", "Letras Monumentales"],
    color: "hsl(270 40% 50%)",
  },
  {
    id: "RT-05",
    nombre: "Ruta del Pulque y Naturaleza",
    descripcion: "Naturaleza ancestral: tinacales, bosque de oyamel y formaciones geolÃ³gicas.",
    duracion: "5â€“6 horas",
    dificultad: "Avanzada",
    paradas: ["Ruta del Pulque (Tezoantla)", "PeÃ±as Cargadas", "Bosque El Hiloche"],
    color: "hsl(145 35% 28%)",
  },
];

// â”€â”€â”€â”€â”€ ALL SITES UNIFIED (for map) â”€â”€â”€â”€â”€

export const ALL_TERRITORIAL_SITES = [
  ...MUSEOS_SITIO,
  ...ESPACIOS_IDENTIDAD,
  ...HITOS_VISUALES,
  ...PATRIMONIO_NATURAL,
];

// â”€â”€â”€â”€â”€ FICHA TÃ‰CNICA â”€â”€â”€â”€â”€

export const FICHA_TECNICA = {
  capitalIntelectual: "21,000+ Horas de Desarrollo",
  valorComercial: "$150,000â€“$300,000 USD (MVP Avanzado)",
  seguridad: "Protocolo TENOCHTITLAN (Heptafederado)",
  ia: "Isabella Guardian (Policy Engine Embebido)",
  altitud: "2,700 msnm",
  temperatura: "14Â°C promedio",
  poblacion: "~13,000 habitantes",
  fundacion: "1560",
  nombreOficial: "Mineral del Monte (Real del Monte)",
  estado: "Hidalgo, MÃ©xico",
  designacion: "Pueblo MÃ¡gico (2004)",
};
