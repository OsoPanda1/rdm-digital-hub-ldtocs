/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
/**
 * Calendario de Eventos y Festivales de Real del Monte
 * Datos basados en investigaciÃ³n web actualizada
 */

export interface RDMEvent {
  id: string;
  name: string;
  date: string;
  dateRange?: string;
  time: string;
  location: string;
  description: string;
  category: "gastronomia" | "cultural" | "deportivo" | "festividad" | "religioso" | "naturaleza";
  image: string;
  destacado?: boolean;
  precio?: string;
}

export const EVENTOS_RDM: RDMEvent[] = [
  {
    id: "EVT-01", name: "Festival Internacional del Paste", date: "Octubre",
    dateRange: "2Âª semana de octubre", time: "10:00 â€“ 20:00", location: "Plaza Principal y calles del centro",
    description: "El evento gastronÃ³mico mÃ¡s importante de Real del Monte. MÃ¡s de 50 variedades de pastes, concursos culinarios, mÃºsica en vivo y el horneo del paste mÃ¡s grande del mundo. Atrae miles de visitantes cada aÃ±o.",
    category: "gastronomia", image: "rdm-festival-paste", destacado: true, precio: "Entrada libre"
  },
  {
    id: "EVT-02", name: "DÃ­a de Muertos Anglo-Mexicano", date: "1-2 Nov",
    time: "18:00 â€“ 23:00", location: "PanteÃ³n InglÃ©s y Centro HistÃ³rico",
    description: "CelebraciÃ³n Ãºnica que fusiona las tradiciones mexicanas del DÃ­a de Muertos con costumbres anglicanas del PanteÃ³n InglÃ©s. Altares, ofrendas bilingÃ¼es, recorridos nocturnos con velas y narraciones de leyendas mineras.",
    category: "cultural", image: "rdm-dia-muertos", destacado: true, precio: "Entrada libre"
  },
  {
    id: "EVT-03", name: "Feria Patronal de la AsunciÃ³n", date: "15 Agosto",
    dateRange: "10-16 de agosto", time: "Todo el dÃ­a", location: "Parroquia y Plaza Principal",
    description: "La fiesta religiosa mÃ¡s importante del pueblo. Procesiones, juegos pirotÃ©cnicos, feria popular con juegos mecÃ¡nicos, antojitos mexicanos y baile popular.",
    category: "religioso", image: "rdm-plaza-principal", precio: "Entrada libre"
  },
  {
    id: "EVT-04", name: "Tianguis de Pueblos MÃ¡gicos", date: "Marzo",
    time: "09:00 â€“ 19:00", location: "Centro de Real del Monte",
    description: "Real del Monte alberga el Tianguis Nacional de Pueblos MÃ¡gicos con stands de todo MÃ©xico, conferencias sobre turismo sostenible y muestras gastronÃ³micas regionales.",
    category: "cultural", image: "rdm-calles-coloridas", destacado: true, precio: "Entrada libre"
  },
  {
    id: "EVT-05", name: "Carrera de MontaÃ±a Sierra de Pachuca", date: "Noviembre",
    time: "07:00 â€“ 14:00", location: "PeÃ±as Cargadas â€“ Bosque El Hiloche",
    description: "Trail running por senderos de bosque de oyamel y formaciones rocosas. CategorÃ­as de 10K y 21K con desniveles de hasta 800m.",
    category: "deportivo", image: "rdm-penas-cargadas", precio: "$350-$500 MXN"
  },
  {
    id: "EVT-06", name: "Noche de Leyendas Mineras", date: "SÃ¡bados seleccionados",
    time: "20:00 â€“ 23:00", location: "Centro HistÃ³rico",
    description: "Recorrido nocturno teatralizado por los callejones narrando leyendas del pueblo: el minero fantasma, la dama de blanco, el tesoro escondido de los cornish. GuÃ­as caracterizados recrean las historias.",
    category: "cultural", image: "rdm-callejon-romantico", precio: "$150 MXN"
  },
  {
    id: "EVT-07", name: "Feria del Libro en la MontaÃ±a", date: "Diciembre",
    time: "09:00 â€“ 18:00", location: "Casa de Cultura / Centro Cultural",
    description: "Encuentro literario con autores locales y nacionales. Presentaciones de libros, talleres de escritura creativa y cuentacuentos para niÃ±os.",
    category: "cultural", image: "rdm-casa-inglesa", precio: "Entrada libre"
  },
  {
    id: "EVT-08", name: "Festival de la Niebla", date: "Julio-Agosto",
    time: "Variable", location: "Miradores y bosques",
    description: "Temporada especial que celebra el fenÃ³meno natural mÃ¡s icÃ³nico del pueblo. FotografÃ­a, meditaciÃ³n en el bosque, caminatas guiadas al amanecer y talleres de pintura al aire libre.",
    category: "naturaleza", image: "rdm-bosque-niebla", precio: "Variable"
  },
  {
    id: "EVT-09", name: "Torneo de FÃºtbol HistÃ³rico Cornish", date: "Mayo",
    time: "10:00 â€“ 18:00", location: "Campo deportivo municipal",
    description: "ConmemoraciÃ³n del primer partido de fÃºtbol en MÃ©xico (1900). Torneo recreativo con uniformes de Ã©poca, conferencias sobre la historia del deporte y exhibiciÃ³n de memorabilia.",
    category: "deportivo", image: "rdm-plaza-principal", precio: "Entrada libre"
  },
  {
    id: "EVT-10", name: "ExposiciÃ³n de ArtesanÃ­as de Plata", date: "Diciembre",
    dateRange: "Todo diciembre", time: "10:00 â€“ 19:00", location: "Portal del Comercio",
    description: "Los mejores artesanos plateros de la regiÃ³n exhiben y venden piezas Ãºnicas. Talleres donde aprendes tÃ©cnicas bÃ¡sicas de platerÃ­a con maestros artesanos.",
    category: "cultural", image: "rdm-artesanias-plata", precio: "Entrada libre"
  },
  {
    id: "EVT-11", name: "AÃ±o Nuevo en la MontaÃ±a", date: "31 Dic",
    time: "21:00 â€“ 02:00", location: "Plaza Principal",
    description: "CelebraciÃ³n comunitaria de fin de aÃ±o con mÃºsica en vivo, fuegos artificiales, chocolate caliente y countdown colectivo a 2,700 metros de altura.",
    category: "festividad", image: "rdm-mirador-sunset", precio: "Entrada libre"
  },
  {
    id: "EVT-12", name: "Jornada de ObservaciÃ³n de Aves", date: "Abril",
    time: "06:00 â€“ 12:00", location: "Bosque El Hiloche",
    description: "Caminata guiada por biÃ³logos para observar aves endÃ©micas y migratorias en el bosque de niebla. Se proporcionan binoculares y guÃ­as ilustradas.",
    category: "naturaleza", image: "rdm-bosque-niebla", precio: "$200 MXN"
  },
];

export const EVENT_CATEGORIES = [
  { value: "all", label: "Todos", emoji: "ðŸŽª" },
  { value: "gastronomia", label: "GastronomÃ­a", emoji: "ðŸ½ï¸" },
  { value: "cultural", label: "Cultural", emoji: "ðŸŽ­" },
  { value: "deportivo", label: "Deportivo", emoji: "ðŸƒ" },
  { value: "festividad", label: "Festividad", emoji: "ðŸŽ†" },
  { value: "religioso", label: "Religioso", emoji: "â›ª" },
  { value: "naturaleza", label: "Naturaleza", emoji: "ðŸŒ²" },
];

/** Datos curiosos y razones para visitar */
export const DATOS_CURIOSOS = [
  "AquÃ­ se jugÃ³ el primer partido de fÃºtbol en MÃ©xico (1900)",
  "El PanteÃ³n InglÃ©s es el cementerio anglicano mÃ¡s alto del mundo (2,700 msnm)",
  "Los pastes fueron traÃ­dos por mineros de Cornualles, Inglaterra en el siglo XIX",
  "Real del Monte financiÃ³ la Independencia de MÃ©xico con su plata",
  "La primera mÃ¡quina de vapor de AmÃ©rica Latina se instalÃ³ aquÃ­ en 1827",
  "Tiene mÃ¡s de 500 km de tÃºneles subterrÃ¡neos histÃ³ricos",
  "La neblina cubre el pueblo mÃ¡s de 180 dÃ­as al aÃ±o",
  "Es el Ãºnico sitio en AmÃ©rica dentro del Patrimonio Minero Mundial de Cornualles",
  "El paste mÃ¡s grande del mundo se hornea aquÃ­ cada aÃ±o durante el festival",
  "Real del Monte fue nombrado Pueblo MÃ¡gico en 2004",
];

/** SabÃ­as que... secciones para esparcir por la plataforma */
export const SABIAS_QUE = [
  { titulo: "Cuna del FÃºtbol Mexicano", texto: "En 1900, los mineros ingleses jugaron aquÃ­ el primer partido de fÃºtbol documentado en MÃ©xico, introduciendo el deporte que hoy es pasiÃ³n nacional." },
  { titulo: "Plata que Hizo Naciones", texto: "La plata extraÃ­da de estas minas financiÃ³ la Corona EspaÃ±ola, la Independencia de MÃ©xico y el desarrollo de infraestructura en tres continentes." },
  { titulo: "El Paste: FusiÃ³n Binacional", texto: "El Cornish Pasty inglÃ©s se transformÃ³ en el paste mexicano al incorporar ingredientes como mole, frijol, tinga y rajas con queso." },
  { titulo: "Patrimonio Mundial", texto: "Real del Monte es el Ãºnico sitio fuera de Gran BretaÃ±a incluido en el Patrimonio Mundial Minero de Cornualles (UNESCO)." },
  { titulo: "Bosque de Niebla", texto: "El bosque que rodea al pueblo alberga mÃ¡s de 850 especies de flora documentadas, incluyendo orquÃ­deas endÃ©micas Ãºnicas." },
];
