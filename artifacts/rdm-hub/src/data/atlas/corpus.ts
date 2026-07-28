/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CORPUS MAXIMUS Â· Real del Monte Â· Ingesta Nivel 0 (PÃºblico/TurÃ­stico)
// Fuente de verdad para ISABELLA AI v4.0 / Realito AI
// Estructurado para render visual + inyecciÃ³n en system prompt del chat.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type CorpusSectionId =
  | "historia"
  | "cultura"
  | "gastronomia"
  | "museos"
  | "ecoturismo"
  | "eventos";

export interface CorpusEntry {
  id: string;
  title: string;
  era?: string;
  body: string;
  highlights?: string[];
  coords?: { lat: number; lng: number };
}

export interface CorpusSection {
  id: CorpusSectionId;
  label: string;
  glyph: string;
  accent: "gold" | "electric" | "terracotta" | "forest" | "copper";
  tagline: string;
  entries: CorpusEntry[];
}

export const RDM_CORPUS: CorpusSection[] = [
  {
    id: "historia",
    label: "Historia Minera Profunda",
    glyph: "ðŸ›ï¸",
    accent: "gold",
    tagline: "El legado de la tierra Â· biografÃ­a del subsuelo mexicano",
    entries: [
      {
        id: "prehispanica-virreinal",
        title: "Ã‰poca PrehispÃ¡nica y Era Virreinal",
        era: "Pre-1552 â†’ 1766",
        body: "Antes de la llegada de los europeos, la regiÃ³n era conocida como Magotsi (del otomÃ­ 'Paso Alto' o 'Puerto Alto'). Tras la caÃ­da de TenochtitlÃ¡n, en 1552 se descubrieron las primeras vetas de plata. La extracciÃ³n temprana se realizaba mediante el sistema de 'ratoneras', tÃºneles estrechos e irregulares. Pedro Romero de Terreros, el Conde de Regla, consolidÃ³ un imperio minero que financiÃ³ gran parte de las expediciones de la corona espaÃ±ola, marcando a Real del Monte como el epicentro mundial de la plata. En 1766, estas minas fueron el escenario de la Primera Huelga de AmÃ©rica, un movimiento obrero fundacional donde los mineros exigieron derechos laborales justos y el respeto al 'partido' (la porciÃ³n de mineral que los trabajadores podÃ­an llevarse).",
        highlights: ["Magotsi (otomÃ­)", "1552 Â· primeras vetas", "Conde de Regla", "1766 Â· Primera Huelga de AmÃ©rica"],
      },
      {
        id: "incursion-britanica",
        title: "La IncursiÃ³n BritÃ¡nica",
        era: "1824 â€“ 1848",
        body: "Tras la guerra de Independencia, las minas quedaron inundadas y abandonadas. En 1824, la CompaÃ±Ã­a de Caballeros Aventureros de las Minas de Pachuca y Real del Monte zarpÃ³ de Falmouth, Cornualles (Reino Unido), trayendo consigo tecnologÃ­a revolucionaria: inmensas mÃ¡quinas de vapor diseÃ±adas por Richard Trevithick y Arthur Woolf. Este hito no solo cambiÃ³ la minerÃ­a (permitiendo desaguar los niveles profundos), sino que alterÃ³ para siempre el ADN arquitectÃ³nico, cultural y social del pueblo. Durante 24 aÃ±os, los cÃ³rnicos operaron la regiÃ³n hasta que la crisis financiera los obligÃ³ a vender la compaÃ±Ã­a en 1848 a empresarios mexicanos por la Ã­nfima cantidad de 30,000 pesos.",
        highlights: ["Falmouth, Cornualles", "Trevithick & Woolf", "24 aÃ±os de operaciÃ³n", "Venta: 30,000 pesos"],
      },
      {
        id: "sociedad-aviadora",
        title: "Sociedad Aviadora y TransiciÃ³n ElÃ©ctrica",
        era: "1848 â€“ Siglo XX",
        body: "En 1848 se formÃ³ la Sociedad Aviadora de Minas de Pachuca y Real del Monte. Al descubrirse la bonanza de la veta del Rosario (1852), la minerÃ­a mexicana resurgiÃ³ con un capital fortalecido. A finales del siglo XIX y principios del XX, las minas como La Dificultad marcaron la transiciÃ³n de la era del vapor a la era de la electricidad, erigiendo majestuosas casas de mÃ¡quinas que aÃºn dominan el horizonte del pueblo con sus inconfundibles chimeneas de ladrillo rojo y techos de lÃ¡mina a dos aguas.",
        highlights: ["Veta del Rosario 1852", "Mina La Dificultad", "Vapor â†’ Electricidad"],
      },
    ],
  },
  {
    id: "cultura",
    label: "Cultura, Arte y Sociedad SincrÃ©tica",
    glyph: "ðŸŽ¨",
    accent: "electric",
    tagline: "Crisol Mesoamericano Â· Colonial Â· Industrial BritÃ¡nico",
    entries: [
      {
        id: "arquitectura-sincretica",
        title: "Arquitectura SincrÃ©tica",
        body: "El paisaje urbano de Real del Monte difiere de cualquier otro Pueblo MÃ¡gico en MÃ©xico. Sus calles empinadas y empedradas estÃ¡n flanqueadas por casonas que combinan la mamposterÃ­a espaÃ±ola con los techos inclinados de lÃ¡mina (diseÃ±ados para soportar las intensas nevadas y lluvias de la montaÃ±a) y chimeneas victorianas. Los portales del centro histÃ³rico y los callejones intrincados como el 'CallejÃ³n de los Artistas' son un testamento de esta fusiÃ³n.",
        highlights: ["MamposterÃ­a espaÃ±ola", "Techos a dos aguas", "Chimeneas victorianas", "CallejÃ³n de los Artistas"],
      },
      {
        id: "cuna-futbol",
        title: "La Cuna del FÃºtbol en MÃ©xico",
        era: "Finales s. XIX",
        body: "Mineral del Monte es la autÃ©ntica cuna del balompiÃ© nacional. A finales del siglo XIX, los mineros cÃ³rnicos, al terminar sus extenuantes jornadas, organizaban partidos en los patios de las minas (especÃ­ficamente en la Mina de Dolores). Este pasatiempo britÃ¡nico se arraigÃ³ profundamente en la comunidad local, fundando el primer club de fÃºtbol de MÃ©xico y dejando un legado de pasiÃ³n por el deporte que perdura hasta el presente.",
        highlights: ["Mina de Dolores", "Primer club de MÃ©xico", "Herencia cÃ³rnica"],
      },
      {
        id: "orfebreria-plata",
        title: "OrfebrerÃ­a y Arte en Plata",
        body: "El arte local estÃ¡ intrÃ­nsecamente ligado al metal que le dio vida al pueblo. Los talleres de platerÃ­a en Real del Monte no producen simples souvenirs; forjan piezas de arte que compiten a nivel internacional. Las tÃ©cnicas de repujado, filigrana y fundiciÃ³n a la cera perdida se han transmitido de generaciÃ³n en generaciÃ³n.",
        highlights: ["Repujado", "Filigrana", "Cera perdida"],
      },
    ],
  },
  {
    id: "gastronomia",
    label: "GastronomÃ­a EndÃ©mica",
    glyph: "ðŸ½ï¸",
    accent: "terracotta",
    tagline: "Sabores de la mina Â· Patrimonio cultural inmaterial",
    entries: [
      {
        id: "paste",
        title: "El Paste (Cornish Pasty)",
        body: "Emblema absoluto de la regiÃ³n. Introducido por los mineros de Cornualles, el paste original consistÃ­a en masa recia rellena de papa, nabo, cebolla y carne cruda. Su diseÃ±o de ingenierÃ­a culinaria incluÃ­a una trenza lateral (el repulgue): los mineros sujetaban el paste por esta trenza con manos sucias de arsÃ©nico y polvo de mina, comÃ­an el cuerpo y desechaban la trenza para evitar envenenamiento. EvoluciÃ³n mexicana: el paladar local incorporÃ³ chile, poro y perejil. Hoy el paste tradicional convive con empanadas de mole, frijol con chorizo, tinga, arroz con leche y mermelada de zarzamora.",
        highlights: ["Trenza/repulgue defensivo", "Papa-nabo-cebolla-carne", "Mole Â· Tinga Â· Zarzamora"],
      },
      {
        id: "bebidas",
        title: "Bebidas Ancestrales y TerruÃ±o",
        body: "Pulque y Curados: la bebida de los dioses. ExtraÃ­do del corazÃ³n del maguey (aguamiel) y fermentado en los tinacales, fue la bebida energÃ©tica de los mineros. En Real del Monte se consumen curados (pulque mezclado) de frutas de temporada, avena, nuez y piÃ±Ã³n. El Cahuiche: pequeÃ±a baya silvestre de los bosques de OmitlÃ¡n y Real del Monte. Su sabor Ã¡cido y profundo se utiliza para licores artesanales, mermeladas y rellenos de panaderÃ­a fina.",
        highlights: ["Aguamiel Â· Tinacales", "Curados: avena, nuez, piÃ±Ã³n", "Cahuiche silvestre"],
      },
      {
        id: "panaderia",
        title: "PanaderÃ­a Fina y Platillos Tradicionales",
        body: "Cocoles de anÃ­s y pan de pulque: horneados en hornos de leÃ±a tradicionales, el cocol es un pan con forma de rombo, aromÃ¡tico por el anÃ­s y el piloncillo, que suele acompaÃ±arse con nata fresca de la regiÃ³n o mermelada. Enchiladas mineras y tacos mineros: comida de esfuerzo. Las enchiladas mineras se sirven en plato hondo, caldosas, picosas y sustanciosas. Los tacos mineros (de guisado en tortilla grande) eran el sustento rÃ¡pido para las largas jornadas bajo tierra.",
        highlights: ["Cocol de anÃ­s y piloncillo", "Pan de pulque", "Enchiladas mineras", "Tacos mineros"],
      },
    ],
  },
  {
    id: "museos",
    label: "Sitios de InterÃ©s y MuseografÃ­a",
    glyph: "ðŸ—ºï¸",
    accent: "copper",
    tagline: "Coordenadas monitoreadas por el motor CHRONOS",
    entries: [
      {
        id: "mina-acosta",
        title: "Museo de Sitio Mina de Acosta",
        era: "Siglo XVII â€“ 1985",
        body: "Visita con descenso real a un socavÃ³n de 400 metros de profundidad. Los turistas experimentan temperatura constante de 14Â°C, humedad y oscuridad de las vetas. El complejo alberga maquinaria de vapor original, vestigios de arquitectura britÃ¡nica y cuartos de raya histÃ³ricos.",
        highlights: ["400 m de profundidad", "14Â°C constante", "Maquinaria de vapor original"],
        coords: { lat: 20.13720, lng: -98.66950 },

      },
      {
        id: "mina-dificultad",
        title: "Mina La Dificultad",
        body: "Monumento a la era de transiciÃ³n tecnolÃ³gica. Cuenta con la casa de mÃ¡quinas mÃ¡s impresionante del paÃ­s. Exhibe malacates de vapor que fueron modificados para operar con electricidad traÃ­da desde la presa de Necaxa. Su museo documenta la historia completa del distrito minero, desde sus orÃ­genes hasta la liquidaciÃ³n de la CompaÃ±Ã­a Real del Monte y Pachuca en el siglo XX.",
        highlights: ["Casa de mÃ¡quinas insignia", "Malacates Vaporâ†’Electricidad", "EnergÃ­a desde Necaxa"],
        coords: { lat: 20.14380, lng: -98.66200 },
      },
      {
        id: "panteon-ingles",
        title: "PanteÃ³n InglÃ©s Â· Santuario del Silencio",
        era: "1851",
        body: "Establecido en una colina envuelta por la niebla y rodeada de pinos y oyameles. Donado por el director de la mina John Rule para sepultar exclusivamente a ingleses de religiÃ³n protestante, a quienes se les negaba el entierro en cementerios catÃ³licos. Contiene 634 tumbas, todas (excepto una) alineadas hacia el este, mirando en direcciÃ³n a Gran BretaÃ±a. Alberga la tumba del payaso de fama mundial Richard Bell, cuya tumba da la espalda a Inglaterra por voluntad propia, en protesta a su tierra natal que no lo reconociÃ³ como sÃ­ lo hizo MÃ©xico. TambiÃ©n se encuentran tumbas de hÃ©roes anÃ³nimos de la Primera Guerra Mundial y vÃ­ctimas de epidemias histÃ³ricas.",
        highlights: ["634 tumbas hacia el este", "Donado por John Rule", "Richard Bell (payaso)", "HÃ©roes 1GM"],
        coords: { lat: 20.14670, lng: -98.67970 },
      },
      {
        id: "medicina-laboral",
        title: "Museo de Medicina Laboral",
        era: "1907 â†’",
        body: "Antiguo Hospital Minero. Uno de los pocos recintos en el mundo dedicados a la medicina ocupacional. Fundado para atender los constantes accidentes y enfermedades de los trabajadores del subsuelo. Exhibe instrumental mÃ©dico victoriano y de principios de siglo XX, boticas originales, quirÃ³fanos de Ã©poca y documentos escalofriantes sobre el tratamiento de la silicosis, la enfermedad del polvo en los pulmones que sentenciaba a muerte a los mineros.",
        highlights: ["Instrumental victoriano", "Boticas y quirÃ³fanos originales", "Archivo de silicosis"],
        coords: { lat: 20.14210, lng: -98.67260 },
      },
      {
        id: "zelontla",
        title: "Parroquia de la AsunciÃ³n Â· SeÃ±or de Zelontla",
        body: "Joya colonial que domina la plaza principal. El SeÃ±or de Zelontla, el Cristo Minero, es el protector espiritual del subsuelo. La figura es Ãºnica: sostiene un cordero, lleva una lÃ¡mpara de carburo, un casco de minero y un guaje. Representa el sincretismo absoluto de la fe y la labor de la mina.",
        highlights: ["Cordero + lÃ¡mpara de carburo", "Casco de minero + guaje", "Sincretismo fe-mina"],
        coords: { lat: 20.14290, lng: -98.67390 },
      },
    ],
  },
  {
    id: "ecoturismo",
    label: "Ecoturismo y SoberanÃ­a Natural",
    glyph: "ðŸŒ²",
    accent: "forest",
    tagline: "PulmÃ³n del ecosistema Â· Barrera natural",
    entries: [
      {
        id: "hiloche",
        title: "Bosque El Hiloche",
        body: "Reserva estatal protegida caracterizada por su densa poblaciÃ³n de oyameles, encinos y pinos. Es el origen de la famosa neblina que desciende sobre el pueblo. Perfecto para senderismo de bajo impacto, observaciÃ³n de flora y fauna endÃ©mica (pÃ¡jaro carpintero y roedores de alta montaÃ±a) y fotografÃ­a de paisaje.",
        highlights: ["Oyameles, encinos, pinos", "Origen de la neblina", "Fauna endÃ©mica"],
        coords: { lat: 20.16800, lng: -98.71500 },
      },
      {
        id: "penas-cargadas",
        title: "Parque Nacional El Chico Â· PeÃ±as Cargadas",
        body: "Aunque ligeramente en los lÃ­mites del municipio, las formaciones basÃ¡lticas de PeÃ±as Cargadas son un atractivo fundamental. Estas colosales rocas que parecen sostenerse por arte de magia en medio del bosque ofrecen rutas de alpinismo, escalada en roca, tirolesas y Ã¡reas para campamentos de inmersiÃ³n total en la naturaleza.",
        highlights: ["Formaciones basÃ¡lticas", "Alpinismo Â· Escalada", "Tirolesas Â· Campamentos"],
        coords: { lat: 20.20800, lng: -98.71200 },
      },
    ],
  },
  {
    id: "eventos",
    label: "Eventos, Festivales y CronologÃ­a",
    glyph: "ðŸŽ‰",
    accent: "gold",
    tagline: "Picos de saturaciÃ³n monitoreados por RDM Digital",
    entries: [
      {
        id: "festival-paste",
        title: "Festival Internacional del Paste",
        era: "Octubre",
        body: "El evento gastronÃ³mico mÃ¡s importante de la regiÃ³n. Celebra la herencia britÃ¡nico-mexicana y fortalece los lazos de hermanamiento diplomÃ¡tico con Redruth, Cornualles. Las calles se llenan de panaderos ingleses y mexicanos. Se elaboran miles de pastes en tiempo real, incluyendo la creaciÃ³n del 'Paste MÃ¡s Grande del Mundo'. Incluye conciertos (desde rock hasta tributos a Queen), conferencias histÃ³ricas y visitantes internacionales (incluso visitas de la realeza britÃ¡nica).",
        highlights: ["Hermanamiento con Redruth", "Paste MÃ¡s Grande del Mundo", "Visitas de la realeza"],
      },
      {
        id: "festival-plata",
        title: "Festival de la Plata",
        era: "Julio",
        body: "Honra y reactiva la labor de los artesanos plateros locales y reconoce al minero. La avenida principal se transforma en corredor de exhibiciÃ³n de alta joyerÃ­a, desde diseÃ±os clÃ¡sicos coloniales hasta propuestas vanguardistas. Callejoneadas, mariachis y degustaciones gastronÃ³micas.",
        highlights: ["Alta joyerÃ­a de autor", "Callejoneadas", "Reconocimiento al minero"],
      },
      {
        id: "zelontla-fiesta",
        title: "Festividad del SeÃ±or de Zelontla",
        era: "Enero",
        body: "La fiesta patronal mÃ¡s emotiva. Los mineros (activos y retirados) cargan la figura del Cristo en una solemne y espectacular procesiÃ³n nocturna. Las calles se iluminan exclusivamente con lÃ¡mparas de minero, velas y pirotecnia, creando una atmÃ³sfera mÃ­stica inigualable. La celebraciÃ³n incluye danzas tradicionales, mÃºsica de banda y feria popular.",
        highlights: ["ProcesiÃ³n nocturna minera", "LÃ¡mparas de minero + velas", "Danzas + feria"],
      },
    ],
  },
];

/**
 * VersiÃ³n plana en texto del corpus, lista para inyectar en el system prompt
 * de Realito AI / ISABELLA v4.0. Mantener bajo ~12k caracteres.
 */
export const RDM_CORPUS_PLAIN: string = RDM_CORPUS.map((section) => {
  const header = `\n## ${section.label.toUpperCase()}\n${section.tagline}\n`;
  const body = section.entries
    .map((e) => `### ${e.title}${e.era ? ` (${e.era})` : ""}\n${e.body}`)
    .join("\n\n");
  return header + body;
}).join("\n");
