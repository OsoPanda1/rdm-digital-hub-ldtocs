/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// src/components/rdm/banners-data.ts
// RDM Digital Hub â€” 80 Banners distributed across all pages and sections
// Centralized banner registry for route-aware ad placement

export interface BannerDefinition {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  category: "commerce" | "tourism" | "culture" | "technology" | "gastronomy" | "events" | "membership" | "radio" | "music";
  routes: string[];
  featured?: boolean;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  COMMERCE BANNERS (16)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const COMMERCE: BannerDefinition[] = [
  { id: 1, title: "Restaurante El Minero", subtitle: "Comida tradicional minera desde 1952", icon: "ðŸ½ï¸", gradient: "from-amber-900 to-amber-950", category: "commerce", routes: ["/", "/gastronomia", "/directorio", "/sabores"], featured: true },
  { id: 2, title: "Café La Estación", subtitle: "Café de especialidad de la sierra hidalguense", icon: "â˜•", gradient: "from-amber-800 to-yellow-900", category: "commerce", routes: ["/", "/gastronomia", "/directorio", "/comercios"] },
  { id: 3, title: "Pastelería Real del Monte", subtitle: "Los paste más antiguos del pueblo mágico", icon: "ðŸ¥§", gradient: "from-orange-800 to-red-900", category: "commerce", routes: ["/", "/gastronomia", "/directorio", "/catalogo", "/sabores"] },
  { id: 4, title: "Hotel Mina Real", subtitle: "Hospitalidad colonial con vista a la sierra", icon: "ðŸ¨", gradient: "from-stone-800 to-stone-950", category: "commerce", routes: ["/", "/directorio", "/comercios", "/mapa", "/membresias"] },
  { id: 5, title: "Artesanías del Monte", subtitle: "Joyería y artesanías en plata y obsidiana", icon: "ðŸ’Ž", gradient: "from-violet-800 to-purple-950", category: "commerce", routes: ["/", "/directorio", "/comercios", "/catalogo", "/arte"] },
  { id: 6, title: "Mueblería Minera", subtitle: "Muebles rústicos de madera regional", icon: "ðŸª‘", gradient: "from-amber-900 to-stone-900", category: "commerce", routes: ["/directorio", "/comercios", "/negocios", "/economia"] },
  { id: 7, title: "Abarrotes Don Pepe", subtitle: "Productos básicos y locales al mejor precio", icon: "ðŸª", gradient: "from-green-800 to-emerald-950", category: "commerce", routes: ["/directorio", "/comercios", "/negocios"] },
  { id: 8, title: "Farmacia Sierra Verde", subtitle: "Salud y bienestar para la comunidad", icon: "ðŸ’Š", gradient: "from-teal-800 to-cyan-950", category: "commerce", routes: ["/directorio", "/comercios", "/faq"] },
  { id: 9, title: "Papelería Estudiantil", subtitle: "Ãštiles y material escolar para todos", icon: "ðŸ“š", gradient: "from-blue-800 to-indigo-950", category: "commerce", routes: ["/directorio", "/comercios"] },
  { id: 10, title: "Taller Don Carlos", subtitle: "Mecánica automotriz y servicio confiable", icon: "ðŸ”§", gradient: "from-gray-800 to-slate-950", category: "commerce", routes: ["/directorio", "/comercios", "/transporte-local"] },
  { id: 11, title: "Salón de Belleza Luna", subtitle: "Estilo y cuidado personal en el centro del pueblo", icon: "ðŸ’‡", gradient: "from-pink-800 to-rose-950", category: "commerce", routes: ["/directorio", "/comercios", "/negocios"] },
  { id: 12, title: "Veterinaria Pet Care", subtitle: "Cuidado integral para tus mascotas", icon: "ðŸ¾", gradient: "from-amber-700 to-orange-900", category: "commerce", routes: ["/directorio", "/comercios"] },
  { id: 13, title: "Super Abarrotes RDM", subtitle: "Todo lo que necesitas bajo un mismo techo", icon: "ðŸ›’", gradient: "from-emerald-800 to-green-950", category: "commerce", routes: ["/directorio", "/comercios", "/catalogo", "/negocios"] },
  { id: 14, title: "Floristería Primavera", subtitle: "Arreglos florales para toda ocasión", icon: "ðŸŒ¸", gradient: "from-pink-700 to-fuchsia-900", category: "commerce", routes: ["/directorio", "/comercios", "/catalogo"] },
  { id: 15, title: "Ferretería El Martillo", subtitle: "Herramientas y materiales de construcción", icon: "ðŸ”¨", gradient: "from-stone-700 to-zinc-900", category: "commerce", routes: ["/directorio", "/comercios"] },
  { id: 16, title: "Minimarket La Esquina", subtitle: "Practicidad y variedad a pasos de tu casa", icon: "ðŸª", gradient: "from-sky-800 to-blue-950", category: "commerce", routes: ["/directorio", "/comercios", "/negocios"] },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  TOURISM BANNERS (12)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const TOURISM: BannerDefinition[] = [
  { id: 17, title: "Hotel Boutique Minas de Plata", subtitle: "Experiencia alojamiento premium en la sierra", icon: "ðŸ”ï¸", gradient: "from-emerald-800 to-teal-950", category: "tourism", routes: ["/", "/mapa", "/explorar", "/membresias", "/premium"], featured: true },
  { id: 18, title: "Hostal Sierra Verde", subtitle: "Alojamiento económico para mochileros", icon: "ðŸ•ï¸", gradient: "from-green-700 to-emerald-900", category: "tourism", routes: ["/mapa", "/explorar", "/ecoturismo"] },
  { id: 19, title: "Glamping Real del Monte", subtitle: "Acampar de lujo entre la bruma y las montañas", icon: "â›º", gradient: "from-teal-700 to-cyan-900", category: "tourism", routes: ["/mapa", "/explorar", "/ecoturismo", "/rutas"] },
  { id: 20, title: "Tours Mineros RDM", subtitle: "Recorridos guiados por las minas históricas", icon: "â›ï¸", gradient: "from-yellow-800 to-amber-950", category: "tourism", routes: ["/", "/mapa", "/explorar", "/rutas", "/experiencias", "/ecoturismo", "/mina"], featured: true },
  { id: 21, title: "Experiencia Subterránea", subtitle: "Descubre los túneles coloniales de la Mina de Acosta", icon: "ðŸ”¦", gradient: "from-stone-800 to-black", category: "tourism", routes: ["/mapa", "/explorar", "/rutas", "/experiencias", "/mina", "/capitulos/minas"] },
  { id: 22, title: "Rafting Río Atlantes", subtitle: "Aventura acuática en la sierra de Hidalgo", icon: "ðŸš£", gradient: "from-blue-700 to-blue-950", category: "tourism", routes: ["/mapa", "/explorar", "/ecoturismo", "/rutas", "/experiencias"] },
  { id: 23, title: "BiciTour por la Sierra", subtitle: "Recorre caminos coloniales en bicicleta", icon: "ðŸš´", gradient: "from-lime-700 to-green-900", category: "tourism", routes: ["/mapa", "/explorar", "/rutas", "/ecoturismo"] },
  { id: 24, title: "Camping La Cascada", subtitle: "Acampado junto a cascadas de agua cristalina", icon: "ðŸŒŠ", gradient: "from-cyan-700 to-blue-900", category: "tourism", routes: ["/mapa", "/explorar", "/ecoturismo"] },
  { id: 25, title: "Aventura en Tirolesa", subtitle: "Vuela sobre el bosque de niebla", icon: "ðŸª‚", gradient: "from-indigo-700 to-violet-900", category: "tourism", routes: ["/mapa", "/explorar", "/ecoturismo", "/rutas"] },
  { id: 26, title: "Turismo Ecológico Sierra", subtitle: "Rutas de avistamiento de aves y flora endémica", icon: "ðŸ¦…", gradient: "from-green-800 to-lime-950", category: "tourism", routes: ["/mapa", "/explorar", "/ecoturismo", "/rutas"] },
  { id: 27, title: "Kayak en la Presa", subtitle: "Deporte acuático con vista panorámica de la sierra", icon: "ðŸ›¶", gradient: "from-sky-700 to-cyan-950", category: "tourism", routes: ["/mapa", "/explorar", "/ecoturismo"] },
  { id: 28, title: "Senderismo Montaña Alta", subtitle: "Trails por los picos más altos de la región", icon: "ðŸ¥¾", gradient: "from-stone-700 to-emerald-950", category: "tourism", routes: ["/mapa", "/explorar", "/ecoturismo", "/rutas", "/experiencias"] },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CULTURE BANNERS (10)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const CULTURE: BannerDefinition[] = [
  { id: 29, title: "Museo de las Minas", subtitle: "Historia viva de la minería en Real del Monte", icon: "ðŸ›ï¸", gradient: "from-indigo-800 to-purple-950", category: "culture", routes: ["/", "/cultura", "/patrimonio", "/historia", "/atlas", "/capitulos/minas", "/mina"], featured: true },
  { id: 30, title: "Galería de Arte RDM", subtitle: "Exposiciones de artistas locales y regionales", icon: "ðŸŽ¨", gradient: "from-violet-800 to-purple-950", category: "culture", routes: ["/cultura", "/patrimonio", "/arte", "/comunidad"] },
  { id: 31, title: "Centro Cultural Comunitario", subtitle: "Talleres, exposiciones y eventos para todos", icon: "ðŸŽ­", gradient: "from-purple-800 to-indigo-950", category: "culture", routes: ["/cultura", "/patrimonio", "/comunidad", "/eventos", "/donar"] },
  { id: 32, title: "Biblioteca Comunitaria", subtitle: "Acervo histórico y conocimiento para el pueblo", icon: "ðŸ“–", gradient: "from-blue-800 to-indigo-950", category: "culture", routes: ["/cultura", "/patrimonio", "/comunidad", "/relatos"] },
  { id: 33, title: "Casa de la Cultura", subtitle: "Preservación de tradiciones y expresiones artísticas", icon: "ðŸ ", gradient: "from-amber-800 to-orange-950", category: "culture", routes: ["/cultura", "/patrimonio", "/comunidad", "/historia", "/dichos", "/relatos"] },
  { id: 34, title: "Archivo Histórico Regional", subtitle: "Documentos y fotografías que narran nuestra historia", icon: "ðŸ“œ", gradient: "from-stone-800 to-amber-950", category: "culture", routes: ["/cultura", "/patrimonio", "/historia", "/dichos", "/relatos", "/atlas", "/capitulos"] },
  { id: 35, title: "Taller de Cerámica Tradicional", subtitle: "Artesanías en barro con técnicas ancestrales", icon: "ðŸº", gradient: "from-orange-800 to-red-950", category: "culture", routes: ["/cultura", "/patrimonio", "/arte", "/catalogo"] },
  { id: 36, title: "Escuela de Música Regional", subtitle: "Formación musical con raíces mineras y cornisas", icon: "ðŸŽµ", gradient: "from-rose-800 to-pink-950", category: "culture", routes: ["/cultura", "/patrimonio", "/arte", "/musica"] },
  { id: 37, title: "Grupo de Danza Folclórica", subtitle: "Expresiones corporales que cuentan nuestra historia", icon: "ðŸ’ƒ", gradient: "from-red-800 to-rose-950", category: "culture", routes: ["/cultura", "/patrimonio", "/comunidad", "/eventos"] },
  { id: 38, title: "Teatro Comunitario", subtitle: "Obras que reflejan la vida minera del pueblo", icon: "ðŸŽª", gradient: "from-fuchsia-800 to-purple-950", category: "culture", routes: ["/cultura", "/patrimonio", "/comunidad", "/historia", "/dichos", "/relatos"] },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  TECHNOLOGY BANNERS (10)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const TECHNOLOGY: BannerDefinition[] = [
  { id: 39, title: "RDM Digital Hub Premium", subtitle: "Acceso completo a todas las funcionalidades del ecosistema", icon: "ðŸš€", gradient: "from-blue-700 to-indigo-950", category: "technology", routes: ["/", "/isabella-ai", "/membresias", "/premium", "/faq", "/quienes-somos"], featured: true },
  { id: 40, title: "Conectividad Soberana", subtitle: "Internet comunitario sin intermediarios corporativos", icon: "ðŸ“¡", gradient: "from-cyan-700 to-blue-950", category: "technology", routes: ["/", "/isabella-ai", "/faq", "/quienes-somos", "/gobernanza"] },
  { id: 41, title: "WiFi Comunitario RDM", subtitle: "Red de acceso abierto para todo el pueblo", icon: "ðŸ“¶", gradient: "from-sky-700 to-cyan-950", category: "technology", routes: ["/faq", "/quienes-somos", "/comunidad", "/mapa"] },
  { id: 42, title: "Servicio de Nube Local", subtitle: "Almacenamiento seguro de datos territoriales soberanos", icon: "â˜ï¸", gradient: "from-indigo-700 to-blue-950", category: "technology", routes: ["/isabella-ai", "/arquitectura", "/sistemas-avanzados"] },
  { id: 43, title: "Soporte Técnico Local", subtitle: "Ayuda profesional para dispositivos y redes", icon: "ðŸ’»", gradient: "from-slate-700 to-zinc-950", category: "technology", routes: ["/faq", "/introduccion", "/documentacion", "/manuales"] },
  { id: 44, title: "Imprenta Digital RDM", subtitle: "Impresión de documentos, fotografías y materiales culturales", icon: "ðŸ–¨ï¸", gradient: "from-gray-700 to-stone-950", category: "technology", routes: ["/faq", "/comercios", "/directorio", "/documentacion"] },
  { id: 45, title: "Servicios Fotográficos", subtitle: "Fotografía profesional de eventos y paisajes", icon: "ðŸ“¸", gradient: "from-zinc-700 to-neutral-950", category: "technology", routes: ["/faq", "/eventos", "/comercios", "/directorio"] },
  { id: 46, title: "Realidad Virtual del Patrimonio", subtitle: "Recorre la historia en inmersión total", icon: "ðŸ¥½", gradient: "from-violet-700 to-purple-950", category: "technology", routes: ["/isabella-ai", "/atlas", "/capitulos", "/xr-tecnologia", "/metaverse"] },
  { id: 47, title: "App Turismo RDM", subtitle: "Tu guía digital para explorar el pueblo mágico", icon: "ðŸ“±", gradient: "from-emerald-700 to-green-950", category: "technology", routes: ["/isabella-ai", "/mapa", "/explorar", "/quienes-somos"] },
  { id: 48, title: "Sensores Territoriales", subtitle: "Monitoreo ambiental en tiempo real para el pueblo", icon: "ðŸ“Š", gradient: "from-teal-700 to-emerald-950", category: "technology", routes: ["/isabella-ai", "/telemetry", "/arquitectura", "/territorial-dashboard"] },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  GASTRONOMY BANNERS (8)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const GASTRONOMY: BannerDefinition[] = [
  { id: 49, title: "Paste Tradicional RDM", subtitle: "El auténtico paste minero de la tradición cornisa", icon: "ðŸ¥§", gradient: "from-orange-800 to-red-950", category: "gastronomy", routes: ["/", "/gastronomia", "/sabores", "/catalogo", "/ruta-del-paste", "/capitulos/pastes"], featured: true },
  { id: 50, title: "Cocina Minera Artesanal", subtitle: "Platillos ancestrales preparados con amor del pueblo", icon: "ðŸ«•", gradient: "from-amber-800 to-orange-950", category: "gastronomy", routes: ["/gastronomia", "/sabores", "/directorio", "/comercios"] },
  { id: 51, title: "Chocolate de la Sierra", subtitle: "Cacao orgánico procesado con técnicas tradicionales", icon: "ðŸ«", gradient: "from-amber-900 to-stone-950", category: "gastronomy", routes: ["/gastronomia", "/sabores", "/catalogo", "/comercios"] },
  { id: 52, title: "Mezcal Artesanal Hidalgo", subtitle: "Destilado de agave con denominación de origen", icon: "ðŸ¥ƒ", gradient: "from-stone-800 to-amber-950", category: "gastronomy", routes: ["/gastronomia", "/sabores", "/directorio", "/comercios", "/eventos"] },
  { id: 53, title: "Tamales de la Abuelita", subtitle: "Recetas secretas transmitidas por generaciones", icon: "ðŸ«”", gradient: "from-yellow-800 to-amber-950", category: "gastronomy", routes: ["/gastronomia", "/sabores", "/comercios", "/eventos"] },
  { id: 54, title: "Horno de Pan Artesanal", subtitle: "Pan recién horneado cada mañana con masa madre", icon: "ðŸž", gradient: "from-orange-700 to-amber-900", category: "gastronomy", routes: ["/gastronomia", "/sabores", "/directorio", "/comercios"] },
  { id: 55, title: "Carnitas Don Memo", subtitle: "Carnitas estiloMichoacán con sazón de la sierra", icon: "ðŸ–", gradient: "from-red-800 to-orange-950", category: "gastronomy", routes: ["/gastronomia", "/sabores", "/directorio", "/comercios"] },
  { id: 56, title: "Aguas Frescas La Tía", subtitle: "Bebidas naturales de frutas de la región", icon: "ðŸ¹", gradient: "from-pink-700 to-rose-900", category: "gastronomy", routes: ["/gastronomia", "/sabores", "/directorio", "/eventos"] },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  EVENTS BANNERS (8)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const EVENTS: BannerDefinition[] = [
  { id: 57, title: "Festival de la Mina", subtitle: "Celebra la historia minera con música, comida y tours", icon: "ðŸŽ‰", gradient: "from-amber-600 to-yellow-800", category: "events", routes: ["/", "/eventos", "/comunidad", "/donar"], featured: true },
  { id: 58, title: "Feria del Paste Anual", subtitle: "El evento gastronómico más importante del año", icon: "ðŸ¥§", gradient: "from-orange-600 to-red-800", category: "events", routes: ["/eventos", "/gastronomia", "/comunidad", "/sabores"] },
  { id: 59, title: "Noche de Muertos RDM", subtitle: "Ofrendas, comparsas y tradición viva en el panteón", icon: "ðŸ’€", gradient: "from-purple-700 to-black", category: "events", routes: ["/eventos", "/cultura", "/patrimonio", "/comunidad", "/capitulos/cementerio"] },
  { id: 60, title: "Festival Musical Sierra", subtitle: "Conciertos al aire libre con artistas regionales", icon: "ðŸŽ¸", gradient: "from-pink-600 to-violet-800", category: "events", routes: ["/eventos", "/musica", "/comunidad"] },
  { id: 61, title: "Feria Artesanal de Plata", subtitle: "Joyería, obsidiana y artesanías en plaza mayor", icon: "âœ¨", gradient: "from-indigo-600 to-purple-800", category: "events", routes: ["/eventos", "/cultura", "/patrimonio", "/catalogo", "/arte"] },
  { id: 62, title: "Cumbre Minera Internacional", subtitle: "Congreso de minería sostenible y patrimonio industrial", icon: "â›ï¸", gradient: "from-stone-600 to-amber-800", category: "events", routes: ["/eventos", "/historia", "/arquitectura"] },
  { id: 63, title: "Festival Gastronómico Minero", subtitle: "Competencia de paste, mezcal y cocineros locales", icon: "ðŸ†", gradient: "from-red-600 to-orange-800", category: "events", routes: ["/eventos", "/gastronomia", "/comunidad", "/sabores"] },
  { id: 64, title: "Concierto al Aire Libre", subtitle: "Música en la plaza principal bajo las estrellas", icon: "ðŸŽ¶", gradient: "from-violet-600 to-indigo-800", category: "events", routes: ["/eventos", "/musica", "/comunidad"] },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  MEMBERSHIP BANNERS (6)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const MEMBERSHIP: BannerDefinition[] = [
  { id: 65, title: "Plan Minero Gold", subtitle: "Acceso ilimitado a todas las experiencias premium", icon: "ðŸ‘‘", gradient: "from-yellow-600 to-amber-800", category: "membership", routes: ["/", "/membresias", "/premium", "/gamificacion", "/game-hub"], featured: true },
  { id: 66, title: "Club de Exploradores", subtitle: "Ãšnete a la comunidad de aventureros del pueblo", icon: "ðŸ—ºï¸", gradient: "from-emerald-600 to-teal-800", category: "membership", routes: ["/membresias", "/premium", "/gamificacion", "/game-hub", "/games", "/juegos", "/ecoturismo"] },
  { id: 67, title: "Membresía Familiar", subtitle: "Experiencias compartidas para toda la familia", icon: "ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦", gradient: "from-sky-600 to-blue-800", category: "membership", routes: ["/membresias", "/premium"] },
  { id: 68, title: "Plan Turista VIP", subtitle: "Itinerarios personalizados y guía exclusivo", icon: "ðŸŒŸ", gradient: "from-violet-600 to-purple-800", category: "membership", routes: ["/membresias", "/premium", "/mapa", "/explorar"] },
  { id: 69, title: "Club de Frecuentes RDM", subtitle: "Acumula puntos por cada visita y actividad", icon: "ðŸŽ¯", gradient: "from-rose-600 to-pink-800", category: "membership", routes: ["/membresias", "/gamificacion", "/game-hub", "/games", "/juegos", "/perfil"] },
  { id: 70, title: "Puntos RDM Premium", subtitle: "Canjea tus puntos por experiencias exclusivas", icon: "ðŸ’Ž", gradient: "from-cyan-600 to-blue-800", category: "membership", routes: ["/membresias", "/premium", "/gamificacion", "/game-hub", "/perfil"] },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  RADIO BANNERS (5)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const RADIO: BannerDefinition[] = [
  { id: 71, title: "Mañana Minera â€” Programa Matutino", subtitle: "Noticias, salud y buenos días desde el pueblo", icon: "ðŸŒ…", gradient: "from-amber-600 to-orange-800", category: "radio", routes: ["/", "/archivo-sonoro", "/comunidad", "/eventos"], featured: true },
  { id: 72, title: "Hora del Folklore", subtitle: "Música tradicional y relatos del pasado minero", icon: "ðŸŽ¶", gradient: "from-rose-600 to-red-800", category: "radio", routes: ["/archivo-sonoro", "/musica", "/cultura", "/patrimonio"] },
  { id: 73, title: "Deportes RDM en Vivo", subtitle: "Cobertura completa del fútbol y deporte local", icon: "âš½", gradient: "from-green-600 to-emerald-800", category: "radio", routes: ["/archivo-sonoro", "/comunidad"] },
  { id: 74, title: "Noticiero Comunitario", subtitle: "Las noticias que importan para el pueblo", icon: "ðŸ“°", gradient: "from-blue-600 to-indigo-800", category: "radio", routes: ["/archivo-sonoro", "/comunidad", "/eventos"] },
  { id: 75, title: "Música al Aire â€” Programa Nocturno", subtitle: "Las mejores canciones bajo las estrellas de la sierra", icon: "ðŸŒ™", gradient: "from-indigo-600 to-purple-800", category: "radio", routes: ["/archivo-sonoro", "/musica"] },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  MUSIC BANNERS (5)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const MUSIC: BannerDefinition[] = [
  { id: 76, title: "Ãlbum Sierra Sonora", subtitle: "Las mejores grabaciones de la música regional", icon: "ðŸ’¿", gradient: "from-violet-600 to-purple-900", category: "music", routes: ["/", "/musica", "/archivo-sonoro", "/cultura"], featured: true },
  { id: 77, title: "Playlist Mineros del Alma", subtitle: "Selección curada de canciones que cuentan historias", icon: "ðŸŽ§", gradient: "from-pink-600 to-rose-900", category: "music", routes: ["/musica", "/archivo-sonoro"] },
  { id: 78, title: "Festival de Guitarra Española", subtitle: "Conciertos íntimos en la plaza del pueblo", icon: "ðŸŽ¸", gradient: "from-amber-600 to-orange-900", category: "music", routes: ["/musica", "/eventos", "/comunidad", "/archivo-sonoro"] },
  { id: 79, title: "Coro Comunitario RDM", subtitle: "Voces unidas que narran la historia del pueblo", icon: "ðŸŽ¤", gradient: "from-rose-600 to-red-900", category: "music", routes: ["/musica", "/comunidad", "/archivo-sonoro", "/eventos"] },
  { id: 80, title: "Radio en Vivo â€” TAMV 92.5", subtitle: "Sintoniza la voz del pueblo en cualquier momento", icon: "ðŸ“»", gradient: "from-teal-600 to-cyan-900", category: "music", routes: ["/", "/musica", "/archivo-sonoro", "/comunidad"], featured: true },
];

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CONSOLIDATED BANNER REGISTRY
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const ALL_BANNERS: BannerDefinition[] = [
  ...COMMERCE,
  ...TOURISM,
  ...CULTURE,
  ...TECHNOLOGY,
  ...GASTRONOMY,
  ...EVENTS,
  ...MEMBERSHIP,
  ...RADIO,
  ...MUSIC,
];

// Route alias mapping â€” normalizes route variants to canonical paths
const ROUTE_ALIASES: Record<string, string> = {
  "/sabores": "/gastronomia",
  "/patrimonio": "/cultura",
  "/experiencias": "/rutas",
  "/planificador": "/rutas",
  "/explorar": "/mapa",
  "/economia": "/negocios",
  "/ranking": "/leaderboard",
  "/repos": "/ecosistema-ltos",
  "/corpus": "/atlas-maximus",
  "/admin-panel": "/admin",
  "/isabella": "/isabella-ai",
  "/contacto": "/quienes-somos",
  "/gemelo": "/mapa",
  "/dichos-mineros": "/dichos",
  "/realito": "/dashboard",
};

/**
 * Get banners for a given route path.
 * Handles route aliases (e.g. /sabores â†’ /gastronomia).
 * Returns up to `maxBanners` banners, prioritizing featured banners.
 */
export function getBannersForRoute(pathname: string, maxBanners = 4): BannerDefinition[] {
  const normalizedPath = ROUTE_ALIASES[pathname] ?? pathname;

  const matching = ALL_BANNERS.filter((b) => {
    const normalizedRoutes = b.routes.map((r) => ROUTE_ALIASES[r] ?? r);
    return normalizedRoutes.includes(normalizedPath);
  });

  // Deduplicate by id (in case a banner matches multiple aliases)
  const seen = new Set<number>();
  const unique = matching.filter((b) => {
    if (seen.has(b.id)) return false;
    seen.add(b.id);
    return true;
  });

  // Sort: featured first, then by id
  unique.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.id - b.id;
  });

  return unique.slice(0, maxBanners);
}

/**
 * Get all banners for a category.
 */
export function getBannersByCategory(category: BannerDefinition["category"]): BannerDefinition[] {
  return ALL_BANNERS.filter((b) => b.category === category);
}

/**
 * Get total banner count for verification.
 */
export function getBannerStats(): { total: number; byCategory: Record<string, number> } {
  const byCategory: Record<string, number> = {};
  for (const b of ALL_BANNERS) {
    byCategory[b.category] = (byCategory[b.category] ?? 0) + 1;
  }
  return { total: ALL_BANNERS.length, byCategory };
}
