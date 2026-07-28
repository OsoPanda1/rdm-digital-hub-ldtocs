/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// ============================================================
// RDM Digital â€” Datos Reales de Real del Monte, Hidalgo, MÃ©xico
// ============================================================

export const places = [
  { id: "panteon-ingles", name: "PanteÃ³n InglÃ©s", category: "culture", lat: 20.1397, lng: -98.6769, description: "Famoso panteÃ³n victoriano con criptas Ãºnicas, testigo de la presencia britÃ¡nica en la minerÃ­a del siglo XIX. Es el Ãºnico cementerio inglÃ©s en LatinoamÃ©rica con tumbas orientadas hacia Inglaterra." },
  { id: "mina-de-acosta", name: "Mina de Acosta", category: "site", lat: 20.1428, lng: -98.6833, description: "Mina histÃ³rica donde puedes descender 400m bajo tierra en un tour subterrÃ¡neo que revive la era dorada de la plata. Operativa desde el siglo XVII." },
  { id: "vista-del-penon", name: "Vista del PeÃ±Ã³n", category: "viewpoint", lat: 20.1511, lng: -98.6694, description: "PanorÃ¡mica espectacular del pueblo desde lo alto, con vistas que alcanzan el Valle del Mezquital en dÃ­as claros." },
  { id: "parroquia-asuncion", name: "Parroquia de la AsunciÃ³n", category: "culture", lat: 20.1412, lng: -98.6738, description: "Iglesia colonial del siglo XVIII con retablos barrocos dorados y una fachada de cantera rosa que domina la plaza principal." },
  { id: "plaza-constitucion", name: "Plaza de la ConstituciÃ³n", category: "site", lat: 20.1389, lng: -98.6750, description: "Centro histÃ³rico y corazÃ³n del pueblo. Rodeada de portales coloniales, es punto de encuentro para festivales y vida diaria." },
  { id: "calles-coloniales", name: "Calles Coloniales", category: "site", lat: 20.1392, lng: -98.6744, description: "Caminata por calles empedradas histÃ³ricas con fachadas del siglo XVIII, cada esquina cuenta una historia de mineros, ingleses y revolucionarios." },
  { id: "mirador-atardecer", name: "Mirador del Atardecer", category: "viewpoint", lat: 20.1489, lng: -98.6711, description: "Mejor lugar para ver el atardecer en todo el Valle del Mezquital. Un espectÃ¡culo de colores sobre la sierra hidalguense." },
  { id: "bosque-pinos", name: "Bosque de Pinos", category: "nature", lat: 20.1556, lng: -98.6856, description: "Ãrea natural para senderismo a 2,700m de altitud. Bosque de oyamel y pino con aire puro de montaÃ±a y senderos marcados." },
  { id: "cristo-rey", name: "Cristo Rey (PeÃ±a del Zumate)", category: "viewpoint", lat: 20.1460, lng: -98.6690, description: "Monumento icÃ³nico en la cima de la peÃ±a, con vistas panorÃ¡micas de 360Â° del pueblo y las montaÃ±as circundantes." },
  { id: "museo-medicina", name: "Museo de Medicina Laboral", category: "culture", lat: 20.1405, lng: -98.6729, description: "Museo que documenta las condiciones de salud de los mineros. Exhibe instrumental mÃ©dico del siglo XIX y fotografÃ­as histÃ³ricas." },
  { id: "mina-dolores", name: "Mina de Dolores", category: "site", lat: 20.1430, lng: -98.6700, description: "Una de las minas mÃ¡s profundas de la regiÃ³n, clave en la historia de la plata novohispana." },
];

export const businesses = [
  { id: "mina-coffee", name: "Mina Coffee House", category: "Restaurante", description: "CafÃ© artesanal y reposterÃ­a en ambiente colonial. Specialty coffee de altura.", phone: "+52 771 123 4567", address: "Calle Principal #25", lat: 20.1391, lng: -98.6752, isPremium: true },
  { id: "hotel-real", name: "Hotel Real del Monte", category: "Hotel", description: "Hotel boutique con vista panorÃ¡mica. Hospedaje tradicional con amenidades modernas.", phone: "+52 771 234 5678", address: "Carretera Federal #10", lat: 20.1456, lng: -98.6800, isPremium: true },
  { id: "artesanias-rdm", name: "ArtesanÃ­as RDM", category: "Tienda", description: "ArtesanÃ­as locales autÃ©nticas: tapetes, cerÃ¡mica y productos tÃ­picos de la regiÃ³n.", phone: "+52 771 345 6789", address: "Plaza Central #8", lat: 20.1385, lng: -98.6755, isPremium: false },
  { id: "casa-tacos", name: "La Casa de los Tacos", category: "Restaurante", description: "Autoservicio de tacos tradicionales. Carnitas, barbacoa y lengua.", phone: "+52 771 456 7890", address: "Calle JuÃ¡rez #15", lat: 20.1388, lng: -98.6748, isPremium: false },
  { id: "pasteleria-pueblo", name: "PastelerÃ­a del Pueblo", category: "ReposterÃ­a", description: "Dulces tradicionales y pasteles caseros. Especialidad en panes de muerto.", phone: "+52 771 567 8901", address: "Calle Hidalgo #22", lat: 20.1395, lng: -98.6760, isPremium: false },
  { id: "eco-aventuras", name: "Eco Aventuras RDM", category: "Actividad", description: "Tours de ecoturismo, rappelling y senderismo guiado por expertos locales.", phone: "+52 771 678 9012", address: "Camino al Bosque s/n", lat: 20.1500, lng: -98.6820, isPremium: true },
  { id: "bar-portal", name: "Bar El Portal", category: "Bar", description: "Bar tradicional con mÃºsica en vivo los fines de semana.", phone: "+52 771 789 0123", address: "Calle Miguel Hidalgo #5", lat: 20.1382, lng: -98.6753, isPremium: false },
  { id: "galeria-arte", name: "GalerÃ­a de Arte Local", category: "Cultura", description: "ExhibiciÃ³n y venta de arte local y pintura tradicional.", phone: "+52 771 890 1234", address: "Plaza de la ConstituciÃ³n #12", lat: 20.1390, lng: -98.6746, isPremium: false },
  { id: "los-portales", name: "Restaurante Los Portales", category: "Restaurante", description: "Comida tÃ­pica hidalguense en ambiente colonial. Mole, barbacoa, pastes.", phone: "+52 771 901 2345", address: "Portal de San Pedro #3", lat: 20.1384, lng: -98.6758, isPremium: true },
  { id: "tours-historicos", name: "Tours HistÃ³ricos RDM", category: "Actividad", description: "Guiados a pie por la historia del Pueblo MÃ¡gico con actores.", phone: "+52 771 012 3456", address: "Plaza Principal s/n", lat: 20.1392, lng: -98.6754, isPremium: false },
];

export const events = [
  { id: "festival-cultural", title: "Festival Cultural Real del Monte", description: "Evento anual con mÃºsica, danza y arte local. CelebraciÃ³n de la herencia cultural del pueblo que reÃºne artistas de todo Hidalgo.", location: "Plaza de la ConstituciÃ³n", startDate: "2026-04-15", endDate: "2026-04-17", isFeatured: true },
  { id: "noche-rutas", title: "Noche de Rutas", description: "Caminata nocturna por las calles histÃ³ricas con guÃ­as disfrazados de Ã©poca. Historias de fantasmas y leyendas mineras.", location: "Centro HistÃ³rico", startDate: "2026-04-20", endDate: "2026-04-20", isFeatured: false },
  { id: "feria-paste", title: "Feria del Paste", description: "Gran celebraciÃ³n del platillo tÃ­pico con competencias de pastes, degustaciones, mÃºsica y actividades para toda la familia.", location: "Parque Central", startDate: "2026-05-01", endDate: "2026-05-03", isFeatured: true },
  { id: "mercado-artesanal", title: "Mercado Artesanal de Semana Santa", description: "Expo-venta de artesanÃ­as tradicionales de toda la regiÃ³n.", location: "Plaza de la ConstituciÃ³n", startDate: "2026-04-10", endDate: "2026-04-18", isFeatured: false },
  { id: "concierto-mina", title: "Concierto en la Mina", description: "Evento musical Ãºnico dentro de la Mina de Acosta. AcÃºstica natural subterrÃ¡nea.", location: "Mina de Acosta", startDate: "2026-05-15", endDate: "2026-05-15", isFeatured: true },
  { id: "taller-cocina", title: "Taller de Cocina Tradicional", description: "Aprende a preparar platillos tÃ­picos con chefs locales. Pastes, mole y mÃ¡s.", location: "Centro Cultural", startDate: "2026-05-20", endDate: "2026-05-20", isFeatured: false },
  { id: "noche-museos", title: "Noche de Museos", description: "Apertura especial de museos con entrada gratuita y recorridos guiados.", location: "Varias ubicaciones", startDate: "2026-05-25", endDate: "2026-05-25", isFeatured: false },
  { id: "carrera-atletica", title: "Carrera AtlÃ©tica RDM", description: "Carrera de montaÃ±a por los senderos locales a 2,700m de altitud.", location: "Bosque de Pinos", startDate: "2026-06-05", endDate: "2026-06-05", isFeatured: false },
  { id: "festival-nieve", title: "Festival de la Nieve", description: "Competencia de creaciÃ³n de nieve artesanal y degustaciones de sabores Ãºnicos.", location: "Parque Central", startDate: "2026-06-20", endDate: "2026-06-20", isFeatured: true },
  { id: "dia-muertos", title: "DÃ­a de Muertos en el PanteÃ³n InglÃ©s", description: "CelebraciÃ³n especial con ofrendas, velas y mÃºsica en el Ãºnico panteÃ³n inglÃ©s de LatinoamÃ©rica.", location: "PanteÃ³n InglÃ©s", startDate: "2026-11-01", endDate: "2026-11-02", isFeatured: true },
];

export const routes = [
  { id: "ruta-patrimonio", name: "Ruta del Patrimonio", description: "Caminata por los sitios histÃ³ricos mÃ¡s importantes del pueblo, desde la plaza hasta el panteÃ³n inglÃ©s.", difficulty: "FÃ¡cil", duration: "1.5 hrs", distance: "2.5 km", icon: "ðŸ›ï¸", color: "from-secondary to-yellow-300", points: ["Plaza de la ConstituciÃ³n", "Parroquia de la AsunciÃ³n", "PanteÃ³n InglÃ©s", "Calles Coloniales"] },
  { id: "ruta-gastronomica", name: "Ruta GastronÃ³mica", description: "Recorrido por los mejores restaurantes, cafÃ©s y pasterÃ­as. Prueba el paste original y la barbacoa hidalguense.", difficulty: "FÃ¡cil", duration: "1 hr", distance: "1.8 km", icon: "ðŸ½ï¸", color: "from-heritage-warm to-orange-300", points: ["Mina Coffee House", "PastelerÃ­a del Pueblo", "La Casa de los Tacos", "Los Portales"] },
  { id: "ruta-miradores", name: "Ruta de los Miradores", description: "Caminata hasta los mejores puntos panorÃ¡micos del pueblo y la sierra.", difficulty: "Moderada", duration: "2 hrs", distance: "4.0 km", icon: "ðŸ”ï¸", color: "from-primary to-cyan-300", points: ["Parque Central", "Vista del PeÃ±Ã³n", "Mirador del Atardecer"] },
  { id: "ruta-aventura", name: "Ruta de Aventura", description: "Senderismo por el bosque con obstÃ¡culos naturales y cascadas ocultas.", difficulty: "DifÃ­cil", duration: "3 hrs", distance: "8.5 km", icon: "â›°ï¸", color: "from-emerald-400 to-green-300", points: ["Bosque de Pinos", "Cascada Oculta", "Mirador del PeÃ±Ã³n"] },
  { id: "ruta-nocturna", name: "Ruta Nocturna MÃ¡gica", description: "Caminata nocturna iluminada con historias de fantasmas y leyendas mineras.", difficulty: "FÃ¡cil", duration: "1.5 hrs", distance: "2.2 km", icon: "ðŸŒ™", color: "from-purple-400 to-indigo-400", points: ["Plaza de la ConstituciÃ³n", "Calles Coloniales", "PanteÃ³n InglÃ©s", "Parroquia"] },
  { id: "ruta-romantica", name: "Ruta RomÃ¡ntica", description: "Paseo bajo la neblina por los rincones mÃ¡s encantadores del pueblo. Ideal para parejas.", difficulty: "FÃ¡cil", duration: "1 hr", distance: "1.5 km", icon: "ðŸ’•", color: "from-pink-400 to-rose-300", points: ["Plaza Principal", "Calles Empedradas", "Mirador del Atardecer"] },
  { id: "ruta-cervecera", name: "Ruta Cervecera", description: "Visita a los bares y establecimientos con cerveza artesanal local de montaÃ±a.", difficulty: "FÃ¡cil", duration: "2 hrs", distance: "1.2 km", icon: "ðŸº", color: "from-amber-400 to-yellow-300", points: ["Bar El Portal", "Centro HistÃ³rico", "Plaza Principal"] },
  { id: "ruta-platera", name: "Ruta Platera", description: "Recorrido por los talleres de plata y joyerÃ­a artesanal de la regiÃ³n.", difficulty: "FÃ¡cil", duration: "1.5 hrs", distance: "2.0 km", icon: "ðŸ’Ž", color: "from-silver-chrome to-gray-300", points: ["Talleres de Plata", "ArtesanÃ­as RDM", "Mercado Artesanal"] },
  { id: "ruta-ecoturismo", name: "Ruta EcoturÃ­stica", description: "Contacto con la naturaleza: bosques de oyamel, fauna local y aire puro a 2,700m.", difficulty: "Moderada", duration: "2.5 hrs", distance: "5.0 km", icon: "ðŸŒ²", color: "from-emerald-500 to-teal-300", points: ["Bosque de Pinos", "Manantiales", "Miradores naturales"] },
];

export const dichos = [
  { dicho: "Al que madruga, la mina lo ayuda", significado: "Los mineros que llegaban primero al turno tenÃ­an mejor posiciÃ³n para encontrar vetas ricas.", origen: "Siglo XVIII, minas de Real del Monte" },
  { dicho: "MÃ¡s oscuro que socavÃ³n de media noche", significado: "Se refiere a una situaciÃ³n muy difÃ­cil o confusa, como trabajar en las profundidades sin luz.", origen: "ExpresiÃ³n de los barreteros" },
  { dicho: "No todo lo que brilla en la mina es plata", significado: "Las apariencias engaÃ±an. La pirita (oro de los tontos) confundÃ­a a los inexpertos.", origen: "SabidurÃ­a minera colonial" },
  { dicho: "EstÃ¡ mÃ¡s duro que tepetate", significado: "Algo extremadamente difÃ­cil. El tepetate es la roca estÃ©ril que los mineros debÃ­an atravesar.", origen: "Lenguaje de los gambusinos" },
  { dicho: "Se le metiÃ³ el tiro", significado: "Cuando alguien se obsesiona con algo. El 'tiro' es el conducto principal de la mina.", origen: "Real del Monte, siglo XIX" },
  { dicho: "Bajar al plan", significado: "Ir al fondo del asunto. El 'plan' era el nivel mÃ¡s bajo de la mina donde se concentraba el trabajo.", origen: "TerminologÃ­a minera" },
  { dicho: "Trabajar como barretero", significado: "Trabajar extremadamente duro. Los barreteros rompÃ­an la roca con barra de acero a pulso.", origen: "Gremio de barreteros de Pachuca y Real del Monte" },
  { dicho: "Tiene veta rica", significado: "Alguien con mucho talento o potencial. Las vetas ricas eran los filones de plata mÃ¡s valiosos.", origen: "ExpresiÃ³n minera novohispana" },
  { dicho: "Le cayÃ³ el malacate", significado: "Tuvo mala suerte. El malacate era la mÃ¡quina que subÃ­a y bajaba a los mineros; si fallaba era catastrÃ³fico.", origen: "Minas de Real del Monte" },
  { dicho: "MÃ¡s frÃ­o que la mina en diciembre", significado: "Algo extremadamente frÃ­o. Las minas a 400m de profundidad mantienen temperaturas gÃ©lidas.", origen: "Diciembre en Real del Monte a 2,700m" },
];

export const relatos = [
  { title: "La Dama de la Mina", excerpt: "Cuentan los viejos barreteros que en los tÃºneles mÃ¡s profundos de la Mina de Acosta, cuando el silencio es total y las lÃ¡mparas parpadean, aparece una mujer vestida de blanco que guÃ­a a los mineros perdidos hacia la salida...", category: "Leyenda" },
  { title: "El Fantasma del PanteÃ³n InglÃ©s", excerpt: "En las noches de niebla espesa, los vecinos del camino al panteÃ³n dicen ver la figura translÃºcida de un ingeniero inglÃ©s del siglo XIX, caminando entre las tumbas victorianas buscando su camino de regreso a Cornwall...", category: "Fantasma" },
  { title: "La Huelga de 1766", excerpt: "El 15 de agosto de 1766, los mineros de Real del Monte protagonizaron la primera huelga laboral de AmÃ©rica. Hartos de los abusos del conde de Regla, mÃ¡s de 2,000 trabajadores abandonaron las minas...", category: "Historia" },
  { title: "Los Pastes que Cruzaron el OcÃ©ano", excerpt: "En 1824, la CompaÃ±Ã­a de Aventureros de las Minas de Real del Monte trajo mineros de Cornwall, Inglaterra. Con ellos vinieron sus esposas y una receta: los Cornish pasties, que se transformaron en los famosos pastes...", category: "TradiciÃ³n" },
  { title: "El NiÃ±o de la Veta Azul", excerpt: "Se dice que un niÃ±o aparece seÃ±alando la direcciÃ³n de una veta de plata perdida, tan pura que brillaba con un tono azulado bajo la luz de las antorchas. Quien lo sigue, nunca regresa igual...", category: "Leyenda" },
  { title: "La ProcesiÃ³n de los Mineros Muertos", excerpt: "Cada DÃ­a de Muertos, a la medianoche, una procesiÃ³n de sombras con cascos y lÃ¡mparas de carburo recorre las calles empedradas desde la bocamina hasta la iglesia, recordando a los caÃ­dos en derrumbes...", category: "TradiciÃ³n" },
];

export const communityPosts = [
  { author: "MarÃ­a GarcÃ­a", location: "Mina de Acosta", content: "Â¡QuÃ© experiencia tan increÃ­ble! El tour por la mina fue impresionante. Los guÃ­as son muy profesionales y explican toda la historia.", rating: 5 },
  { author: "Carlos LÃ³pez", location: "PanteÃ³n InglÃ©s", content: "Visitando este lugar Ãºnico en MÃ©xico. La arquitectura victoriana es fascinante y el ambiente es muy tranquilo.", rating: 5 },
  { author: "Ana RodrÃ­guez", location: "Vista del PeÃ±Ã³n", content: "La mejor vista del pueblo. Vine al atardecer y fue mÃ¡gico ver cÃ³mo se ilumina Real del Monte.", rating: 5 },
  { author: "Pedro SÃ¡nchez", location: "Mina Coffee House", content: "El mejor cafÃ© de la regiÃ³n. ProbÃ© el espresso y estaba perfecto. El ambiente colonial es encantador.", rating: 4 },
  { author: "Laura JimÃ©nez", location: "Ruta del Patrimonio", content: "Completamos la ruta hoy. Fue muy divertida y aprendimos mucho sobre la historia del pueblo.", rating: 5 },
  { author: "Roberto MÃ©ndez", location: "La Casa de los Tacos", content: "Los tacos de carnitas son los mejores que he probado. Y el precio es muy accesible.", rating: 4 },
  { author: "SofÃ­a Vega", location: "Hotel Real del Monte", content: "Nos hospedamos por una noche y fue perfecta. La vista desde la habitaciÃ³n es increÃ­ble.", rating: 5 },
  { author: "Diego HernÃ¡ndez", location: "Eco Aventuras RDM", content: "Hicimos rappelling y fue adrenalina pura. Los guÃ­as son profesionales y cuidan mucho la seguridad.", rating: 5 },
];

export const timelineHistory = [
  { year: "1528", title: "Descubrimiento de Vetas", description: "Los espaÃ±oles descubren las primeras vetas de plata en la sierra de Pachuca y Real del Monte, iniciando tres siglos de explotaciÃ³n minera." },
  { year: "1739", title: "Era del Conde de Regla", description: "Pedro Romero de Terreros adquiere las minas y las convierte en las mÃ¡s productivas de Nueva EspaÃ±a, acumulando una fortuna legendaria." },
  { year: "1766", title: "Primera Huelga de AmÃ©rica", description: "Los mineros de Real del Monte protagonizan la primera huelga laboral del continente americano, exigiendo mejores condiciones de trabajo." },
  { year: "1824", title: "Llegada de los Ingleses", description: "La CompaÃ±Ã­a de Aventureros trae mineros de Cornwall, Inglaterra. Con ellos llegan los pastes, el fÃºtbol y el panteÃ³n inglÃ©s." },
  { year: "1862", title: "Batalla de Puebla", description: "Mineros de Real del Monte participan en la defensa contra la invasiÃ³n francesa, llevando su valentÃ­a de las minas al campo de batalla." },
  { year: "1906", title: "Huelga Minera", description: "Nueva huelga que anticipa los movimientos revolucionarios. Los mineros exigen la jornada de 8 horas y mejores salarios." },
  { year: "2004", title: "Pueblo MÃ¡gico", description: "Real del Monte es declarado Pueblo MÃ¡gico por la SecretarÃ­a de Turismo, reconociendo su riqueza histÃ³rica y cultural." },
  { year: "2026", title: "RDM Digital", description: "Nace la primera plataforma de gemelo digital turÃ­stico de MÃ©xico, posicionando a Real del Monte como pionero en innovaciÃ³n tecnolÃ³gica." },
];
