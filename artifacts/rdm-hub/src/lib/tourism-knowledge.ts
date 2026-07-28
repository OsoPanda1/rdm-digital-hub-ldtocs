/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import type { Intent } from "@/lib/types";

export const REAL_DEL_MONTE_FACTS = {
  heritage: [
    "Mineral del Monte fue incorporado al programa Pueblos MÃ¡gicos en 2004 y consolidÃ³ una marca turÃ­stica centrada en patrimonio minero, arquitectura y gastronomÃ­a.",
    "La influencia cornish llegÃ³ en 1824 con compaÃ±Ã­as mineras britÃ¡nicas que introdujeron tÃ©cnicas de extracciÃ³n, tradiciones gastronÃ³micas y prÃ¡cticas deportivas.",
    "La Comarca Minera de Hidalgo fue reconocida como Geoparque Mundial UNESCO en 2017, elevando el valor geolÃ³gico y educativo de la regiÃ³n.",
  ],
  culture: [
    "El PanteÃ³n InglÃ©s conserva lÃ¡pidas orientadas segÃºn tradiciÃ³n britÃ¡nica y una narrativa migrante Ãºnica en MÃ©xico.",
    "El legado del paste evolucionÃ³ de alimento funcional para mineros a icono gastronÃ³mico hidalguense.",
    "El clima de neblina, las cubiertas a dos aguas y los callejones empedrados construyen una estÃ©tica romÃ¡ntica de montaÃ±a.",
  ],
  romance: [
    "Al caer la tarde, las chimeneas y la neblina convierten al centro histÃ³rico en un escenario Ã­ntimo para caminatas de pareja.",
    "Los miradores de la sierra permiten atardeceres panorÃ¡micos ideales para fotografÃ­a y experiencias slow-travel.",
  ],
  sources: [
    "https://es.wikipedia.org/wiki/Mineral_del_Monte",
    "https://www.unesco.org/en/iggp/geoparks/comarca-minera",
    "https://es.wikipedia.org/wiki/Paste_(platillo)",
  ],
} as const;

export const LONG_FORM_NARRATIVES: Record<Intent, string[]> = {
  gastronomia: [
    "AquÃ­ el viaje empieza en el horno: el paste no es solo comida, es memoria obrera. LlegÃ³ con los mineros cornish en el siglo XIX y hoy cada pasterÃ­a protege su receta con orgullo familiar. Caminar por el centro es seguir el aroma de masa dorada, cafÃ© de olla y canela, entre vitrinas donde la tradiciÃ³n convive con versiones contemporÃ¡neas.",
    "En Real del Monte la gastronomÃ­a se cuenta como una historia de resistencia: un platillo pensado para jornadas mineras terminÃ³ convirtiÃ©ndose en identidad regional. Los rellenos clÃ¡sicos de papa, carne y cebolla comparten calle con propuestas dulces y estacionales, siempre con una promesa: sabor honesto, porciÃ³n cÃ¡lida y hospitalidad serrana.",
  ],
  historia: [
    "La historia de Mineral del Monte late bajo tierra. Sus minas conectaron a la regiÃ³n con ciclos econÃ³micos globales y dejaron una huella social profunda: innovaciÃ³n tÃ©cnica, migraciÃ³n britÃ¡nica, organizaciÃ³n obrera y patrimonio industrial. Cada visita guiada permite entender cÃ³mo la montaÃ±a moldeÃ³ oficios, barrios y memoria colectiva.",
    "Recorrer sus museos y socavones es mirar la ingenierÃ­a y la vida cotidiana de los mineros. Las herramientas, los tÃºneles y la arquitectura de hierro narran siglos de trabajo y adaptaciÃ³n. No es una postal estÃ¡tica: es un territorio vivo que transforma su pasado en aprendizaje turÃ­stico y cultural.",
  ],
  aventura: [
    "La sierra ofrece rutas de altitud, bosques hÃºmedos y miradores dramÃ¡ticos donde la niebla abre y cierra escenarios en minutos. Es ideal para senderismo interpretativo, fotografÃ­a de paisaje y travesÃ­as cortas de fin de semana con guÃ­as locales.",
    "La aventura en Real del Monte no depende de la velocidad, sino del ritmo de la montaÃ±a: ascensos moderados, caminos histÃ³ricos y paradas panorÃ¡micas. Entre peÃ±as y bosques, la experiencia combina naturaleza, historia minera y aire frÃ­o de altura.",
  ],
  hospedaje: [
    "Dormir aquÃ­ es continuar la narrativa del pueblo: hoteles boutique y casas coloniales con chimenea, textiles cÃ¡lidos y vistas de neblina. El hospedaje funciona como extensiÃ³n de la experiencia cultural, no como simple logÃ­stica.",
    "Las noches de montaÃ±a invitan al descanso lento: cafÃ© temprano, recorridos caminables y atmÃ³sfera Ã­ntima. Es un destino ideal para escapadas de reconexiÃ³n, tanto en pareja como en formato familiar.",
  ],
  cultura: [
    "Real del Monte mezcla raÃ­z mexicana con herencia britÃ¡nica de forma tangible: arquitectura, cementerio histÃ³rico, gastronomÃ­a y relatos comunitarios. Esa fusiÃ³n produce una identidad irrepetible dentro del corredor turÃ­stico de Hidalgo.",
    "El visitante encuentra cultura en lo cotidiano: fachadas coloridas, talleres artesanales, festividades, callejones y memoria oral. El destino funciona mejor cuando se vive despacio, conversando con cronistas y productores locales.",
  ],
};

export interface GlobalTourismFeature {
  id: string;
  name: string;
  implemented: boolean;
  description: string;
}

export const GLOBAL_TOURISM_FEATURES: GlobalTourismFeature[] = [
  { id: "f1", name: "BÃºsqueda semÃ¡ntica", implemented: true, description: "Consulta por intenciÃ³n y contexto en lenguaje natural." },
  { id: "f2", name: "Mapa interactivo", implemented: true, description: "ExploraciÃ³n visual de zonas, POIs y capas temÃ¡ticas." },
  { id: "f3", name: "Storytelling multimedia", implemented: true, description: "Narrativas visuales por secciones culturales." },
  { id: "f4", name: "NavegaciÃ³n one-page", implemented: true, description: "Transiciones suaves entre verticales turÃ­sticas." },
  { id: "f5", name: "RecomendaciÃ³n hÃ­brida IA", implemented: true, description: "Ranking por afinidad, distancia, horario y tendencia." },
  { id: "f6", name: "SegmentaciÃ³n por intenciÃ³n", implemented: true, description: "Rutas para gastronomÃ­a, historia, cultura, aventura y hospedaje." },
  { id: "f7", name: "DiseÃ±o mobile-first", implemented: true, description: "UI adaptable para viajeros en movimiento." },
  { id: "f8", name: "Panel operativo", implemented: true, description: "VisualizaciÃ³n de telemetrÃ­a y estado del sistema." },
  { id: "f9", name: "SSE en tiempo real", implemented: true, description: "Flujos de decisiÃ³n con heartbeat y reconexiÃ³n." },
  { id: "f10", name: "Componentes accesibles", implemented: true, description: "Base UI con primitives enfocadas en accesibilidad." },
  { id: "f11", name: "Itinerarios colaborativos", implemented: false, description: "Guardado y ediciÃ³n compartida de rutas entre viajeros." },
  { id: "f12", name: "Price tracking", implemented: false, description: "Alertas de variaciÃ³n de tarifas de hospedaje y tours." },
  { id: "f13", name: "Comparador inteligente", implemented: false, description: "Comparativa de costos, tiempos y valor cultural." },
  { id: "f14", name: "Reserva integrada", implemented: false, description: "Checkout unificado para actividades y hospedaje." },
  { id: "f15", name: "ReseÃ±as verificadas", implemented: false, description: "ValoraciÃ³n con trazabilidad y anti-fraude." },
  { id: "f16", name: "Rutas offline", implemented: false, description: "Modo sin conexiÃ³n para mapa e itinerarios." },
  { id: "f17", name: "Audio-guÃ­as inmersivas", implemented: false, description: "NarraciÃ³n geolocalizada y activaciÃ³n por proximidad." },
  { id: "f18", name: "Traductor contextual", implemented: false, description: "Asistente multi-idioma en puntos clave del recorrido." },
  { id: "f19", name: "AR patrimonial", implemented: false, description: "ReconstrucciÃ³n histÃ³rica de espacios mineros y urbanos." },
  { id: "f20", name: "Asistente de accesibilidad", implemented: false, description: "Filtros por movilidad reducida y necesidades sensoriales." },
  { id: "f21", name: "Clima hiperlocal", implemented: false, description: "PronÃ³stico de microzonas para planear actividades." },
  { id: "f22", name: "DetecciÃ³n de saturaciÃ³n", implemented: false, description: "Alertas de aforo para redistribuir visitantes." },
  { id: "f23", name: "GamificaciÃ³n territorial", implemented: false, description: "Misiones culturales con recompensas locales." },
  { id: "f24", name: "Wallet turÃ­stico", implemented: false, description: "Pases, cupones y beneficios por fidelidad." },
  { id: "f25", name: "RecomendaciÃ³n romÃ¡ntica", implemented: true, description: "Sugerencias para atardeceres, cenas y caminatas Ã­ntimas." },
  { id: "f26", name: "MÃ©tricas de sostenibilidad", implemented: false, description: "Huella de visita y consumo responsable." },
  { id: "f27", name: "DetecciÃ³n de sesgo", implemented: false, description: "Monitoreo de fairness en ranking y exposiciÃ³n de negocios." },
  { id: "f28", name: "OrquestaciÃ³n edge", implemented: false, description: "Respuestas de baja latencia en nodos distribuidos." },
  { id: "f29", name: "Motor de eventos", implemented: true, description: "Registro de interacciÃ³n cÃ­vico-turÃ­stica para inteligencia operativa." },
  { id: "f30", name: "Checklist producciÃ³n", implemented: true, description: "Ruta de cierre de mÃ³dulos con validaciÃ³n pre-deploy." },
];
