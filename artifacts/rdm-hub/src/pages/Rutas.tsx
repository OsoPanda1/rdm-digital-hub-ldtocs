/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// @ts-nocheck
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { 
  MapPin, Clock, Footprints, Mountain, Trees, Camera, 
  Utensils, Beer, History, Compass, Star, ChevronRight, Sparkles,
  Info, CheckCircle2, AlertCircle, Route, Map,
  Thermometer, Backpack, Droplets, Sun, Wind
} from "lucide-react";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { SEOMeta, PAGE_SEO } from "@/components/SEOMeta";
import { TextReveal, StaggerContainer, StaggerItem, GlowCard } from "@/components/VisualEffects";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Assets
import heroImg from "@/assets/hero-real-del-monte.webp";
import minaImg from "@/assets/mina-acosta.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import callesImg from "@/assets/calles-colonial.webp";
import rdm1 from "@/assets/rdm1.jpeg";
import rdm2 from "@/assets/rdm2.jpeg";
import rdm3 from "@/assets/rdm01.jpg";
import rdm4 from "@/assets/rdm02.jpg";

// Route types definition
interface RouteStop {
  name: string;
  description: string;
  duration: string;
  highlights?: string[];
  tips?: string;
}

interface TouristRoute {
  id: string;
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  duration: string;
  distance: string;
  difficulty: "FÃ¡cil" | "Moderada" | "DifÃ­cil" | "Desafiante";
  physicalLevel: number; // 1-10
  bestTime: string;
  idealFor: string[];
  whatToBring: string[];
  stops: RouteStop[];
  practicalInfo: {
    startPoint: string;
    endPoint: string;
    restrooms: string[];
    foodStops: string[];
    parking: string;
    guided: boolean;
    price?: string;
  };
  tips: string[];
  warnings?: string[];
}

// Routes data
const touristRoutes: TouristRoute[] = [
  {
    id: "historica",
    name: "Ruta HistÃ³rica",
    tagline: "Caminando por 460 aÃ±os de historia",
    description: "Recorrido por los lugares mÃ¡s emblemÃ¡ticos que cuentan la historia de Real del Monte, desde su fundaciÃ³n minera hasta la actualidad.",
    fullDescription: "La Ruta HistÃ³rica es un viaje en el tiempo que te lleva a travÃ©s de mÃ¡s de cuatro siglos de historia. Comenzando en la Plaza Principal, donde todo iniciÃ³ en 1560, caminarÃ¡s por las mismas calles que recorrieron mineros, empresarios ingleses y revolucionarios. Cada edificio, cada callejÃ³n y cada plaza tiene una historia que contar. Esta ruta incluye visitas al corazÃ³n minero del pueblo, al cementerio anglicano Ãºnico en MÃ©xico, y a los edificios que albergan la memoria de una Ã©poca dorada. Es una experiencia imperdible para quienes desean comprender la profunda significaciÃ³n histÃ³rica de este Pueblo MÃ¡gico.",
    icon: History,
    color: "text-terracotta",
    bgGradient: "from-terracotta/20 to-terracotta/5",
    duration: "3-4 horas",
    distance: "4.5 km",
    difficulty: "FÃ¡cil",
    physicalLevel: 3,
    bestTime: "Todo el aÃ±o, preferentemente en la maÃ±ana",
    idealFor: ["Familias", "Adultos mayores", "Estudiantes de historia", "Turistas culturales"],
    whatToBring: ["Calzado cÃ³modo", "Protector solar", "Agua", "CÃ¡mara fotogrÃ¡fica", "Dinero en efectivo para entradas"],
    stops: [
      {
        name: "Plaza Principal",
        description: "CorazÃ³n histÃ³rico del pueblo desde 1560. AquÃ­ se encuentra el Kiosco de la Independencia y la Parroquia de la AsunciÃ³n, construida en el siglo XVIII.",
        duration: "30 min",
        highlights: ["Arquitectura colonial", "Kiosco histÃ³rico", "Jardines centenarios"]
      },
      {
        name: "Museo de Medicina Laboral",
        description: "Antiguo hospital de mineros convertido en museo. Exhibe herramientas mÃ©dicas del siglo XIX y relata las condiciones de salud de los trabajadores mineros.",
        duration: "45 min",
        highlights: ["Instrumentos mÃ©dicos antiguos", "Historia de la medicina minera", "Arquitectura hospitalaria colonial"]
      },
      {
        name: "Casa de la Cultura",
        description: "Edificio del siglo XIX que alberga exposiciones de arte, talleres culturales y eventos. Su arquitectura victoriana es notable.",
        duration: "30 min",
        highlights: ["Arquitectura victoriana", "Exposiciones temporales", "Talleres artesanales"]
      },
      {
        name: "Mina de Acosta",
        description: "La mina mÃ¡s profunda y famosa del distrito. Desciende 460 metros bajo tierra en un recorrido que muestra las duras condiciones del trabajo minero.",
        duration: "90 min",
        highlights: ["TÃºneles histÃ³ricos", "Museo minero", "Experiencia subterrÃ¡nea"],
        tips: "Llevar chaqueta, la temperatura baja de 15Â°C"
      },
      {
        name: "PanteÃ³n InglÃ©s",
        description: "Cementerio anglicano mÃ¡s alto del mundo a 2,700 msnm. Sus tumbas del siglo XIX cuentan historias de amor, tragedia y esperanza.",
        duration: "45 min",
        highlights: ["Arquitectura funeraria victoriana", "Tumbas histÃ³ricas", "Vistas panorÃ¡micas"]
      }
    ],
    practicalInfo: {
      startPoint: "Plaza Principal (frente al Kiosco)",
      endPoint: "PanteÃ³n InglÃ©s",
      restrooms: ["Plaza Principal", "Mina de Acosta", "Casa de la Cultura"],
      foodStops: ["Vendedores en Plaza", "Ãrea de la Mina"],
      parking: "Estacionamiento pÃºblico en Plaza Principal",
      guided: true,
      price: "$150-200 MXN por persona (con guÃ­a)"
    },
    tips: [
      "Contrata un guÃ­a certificado en la Oficina de Turismo para obtener informaciÃ³n detallada",
      "La Mina de Acosta cierra a las 17:00 hrs, planifica tu visita temprano",
      "El PanteÃ³n InglÃ©s es especialmente fotogÃ©nico durante la golden hour",
      "Usa calzado antideslizante, algunas calles empedradas pueden resbalar"
    ],
    warnings: [
      "La Mina de Acosta no es accesible para personas con movilidad reducida",
      "No recomendada para personas con claustrofobia"
    ]
  },
  {
    id: "senderismo",
    name: "Ruta de Senderismo",
    tagline: "Entre bosques de niebla y paisajes montaÃ±osos",
    description: "Explora los senderos naturales que rodean Real del Monte, descubriendo formaciones rocosas Ãºnicas y bosques de oyamel.",
    fullDescription: "La Ruta de Senderismo conecta al visitante con la naturaleza exuberante de la Sierra de Pachuca. A travÃ©s de senderos bien marcados que atraviesan bosques de oyamel, pino y encino, descubrirÃ¡s paisajes que parecen sacados de un cuento. El punto culminante son las PeÃ±as Cargadas, formaciones rocosas gigantescas en aparente equilibrio imposible que han sido testigos silenciosos de millones de aÃ±os. Esta ruta ofrece vistas panorÃ¡micas del valle, encuentros con la fauna local y la posibilidad de respirar el aire puro de la montaÃ±a. Es una experiencia que renovarÃ¡ tu conexiÃ³n con la naturaleza.",
    icon: Mountain,
    color: "text-forest",
    bgGradient: "from-forest/20 to-forest/5",
    duration: "4-5 horas",
    distance: "8 km",
    difficulty: "Moderada",
    physicalLevel: 6,
    bestTime: "Marzo a noviembre (evitar lluvias intensas)",
    idealFor: ["Senderistas", "FotÃ³grafos de naturaleza", "Amantes del ecoturismo", "Grupos de amigos"],
    whatToBring: ["Botas de trekking", "Ropa en capas", "Mochila ligera", "2L de agua", "Snacks energÃ©ticos", "Protector solar", "Repelente", "CÃ¡mara", "Bastones (opcional)"],
    stops: [
      {
        name: "Mirador La Cruz",
        description: "Punto de inicio con vistas panorÃ¡micas de 360Â° del pueblo y la sierra. Ideal para fotografÃ­as de amanecer.",
        duration: "20 min",
        highlights: ["Vista panorÃ¡mica", "SeÃ±alÃ©tica interpretativa", "Bancas de descanso"]
      },
      {
        name: "Bosque de Oyamel",
        description: "Sendero a travÃ©s del bosque de Abies religiosa. Durante el invierno, este bosque puede albergar mariposas monarca.",
        duration: "90 min",
        highlights: ["Bosque primario", "Aire puro", "Silencio natural"],
        tips: "MantÃ©n silencio para observar fauna"
      },
      {
        name: "PeÃ±as Cargadas",
        description: "Formaciones rocosas gigantes en equilibrio aparentemente imposible. La vista desde la base es impresionante.",
        duration: "60 min",
        highlights: ["Formaciones geolÃ³gicas Ãºnicas", "Escalada bÃ¡sica", "Vistas espectaculares"]
      },
      {
        name: "Manantial de San Antonio",
        description: "Fuente de agua mineral natural que ha sido utilizada desde tiempos prehispÃ¡nicos. El agua es potable y refrescante.",
        duration: "30 min",
        highlights: ["Agua natural", "Ãrea de descanso", "Historia prehispÃ¡nica"]
      },
      {
        name: "Valle del Silencio",
        description: "Pradera rodeada de montaÃ±as donde el silencio es absoluto. Perfecto para meditaciÃ³n y conexiÃ³n con la naturaleza.",
        duration: "40 min",
        highlights: ["Pradera natural", "ObservaciÃ³n de aves", "Paz absoluta"]
      }
    ],
    practicalInfo: {
      startPoint: "Mirador La Cruz (acceso por carretera a Pachuca)",
      endPoint: "Valle del Silencio (regreso por sendero circular)",
      restrooms: ["Inicio en Mirador (baÃ±os portÃ¡tiles)"],
      foodStops: ["No hay, llevar provisiones"],
      parking: "Estacionamiento en Mirador La Cruz",
      guided: true,
      price: "$200-300 MXN por persona (con guÃ­a especializado)"
    },
    tips: [
      "Salir temprano (7:00-8:00 am) para evitar neblina densa",
      "Informa tu ruta a alguien antes de salir",
      "No te desvÃ­es de los senderos marcados",
      "Lleva suficiente agua, no hay fuentes en el camino",
      "El clima cambia rÃ¡pido, lleva impermeable"
    ],
    warnings: [
      "No hacer en caso de tormenta elÃ©ctrica",
      "Cuidado con resbalones en rocas mojadas",
      "Presencia ocasional de serpientes (no venenosas en general)",
      "La altitud (2,700m) puede afectar a personas no aclimatadas"
    ]
  },
  {
    id: "ecoturistica",
    name: "Ruta EcoturÃ­stica",
    tagline: "ConservaciÃ³n y educaciÃ³n ambiental",
    description: "Enfocada en la conservaciÃ³n ambiental, esta ruta incluye visitas a proyectos ecolÃ³gicos, reforestaciÃ³n y educaciÃ³n sobre la biodiversidad local.",
    fullDescription: "La Ruta EcoturÃ­stica es una experiencia educativa y transformadora que te conecta con los esfuerzos de conservaciÃ³n de la Sierra de Pachuca. A travÃ©s de visitas a viveros comunitarios, proyectos de reforestaciÃ³n y Ã¡reas protegidas, comprenderÃ¡s la importancia de preservar estos ecosistemas Ãºnicos. AprenderÃ¡s sobre las especies endÃ©micas, la importancia del bosque de oyamel para la captaciÃ³n de agua, y los esfuerzos locales por mantener el equilibrio ecolÃ³gico. Esta ruta incluye actividades prÃ¡cticas como plantaciÃ³n de Ã¡rboles y talleres de identificaciÃ³n de flora y fauna. Es ideal para familias, estudiantes y cualquier persona interesada en el turismo responsable.",
    icon: Trees,
    color: "text-emerald-600",
    bgGradient: "from-emerald-500/20 to-emerald-500/5",
    duration: "5-6 horas",
    distance: "6 km",
    difficulty: "FÃ¡cil",
    physicalLevel: 4,
    bestTime: "Temporada de lluvias (junio-septiembre) para reforestaciÃ³n",
    idealFor: ["Familias con niÃ±os", "Estudiantes", "Grupos escolares", "Turistas responsables"],
    whatToBring: ["Calzado cÃ³modo", "Ropa que se pueda ensuciar", "Guantes de jardinerÃ­a", "Agua reutilizable", "Protector solar biodegradable", "Cuaderno de campo"],
    stops: [
      {
        name: "Vivero Comunitario",
        description: "Vivero donde se producen plantas nativas para reforestaciÃ³n. Aprende sobre especies endÃ©micas y sus usos.",
        duration: "60 min",
        highlights: ["Plantas nativas", "Taller de identificaciÃ³n", "Actividad de siembra"]
      },
      {
        name: "Zona de ReforestaciÃ³n",
        description: "Ãrea donde se realizan actividades de plantaciÃ³n de Ã¡rboles. Los visitantes pueden plantar su propio Ã¡rbol.",
        duration: "90 min",
        highlights: ["PlantaciÃ³n de Ã¡rboles", "Compromiso ambiental", "Certificado de participaciÃ³n"],
        tips: "Se proporcionan herramientas y plantas"
      },
      {
        name: "Sendero de InterpretaciÃ³n Ambiental",
        description: "Sendero con seÃ±alÃ©tica sobre la flora, fauna y geologÃ­a locales. Incluye estaciones de observaciÃ³n.",
        duration: "75 min",
        highlights: ["SeÃ±alÃ©tica educativa", "ObservaciÃ³n de aves", "IdentificaciÃ³n de plantas"]
      },
      {
        name: "Centro de EducaciÃ³n Ambiental",
        description: "Espacio con exhibiciones interactivas sobre la biodiversidad de la sierra y los retos de conservaciÃ³n.",
        duration: "45 min",
        highlights: ["Exhibiciones interactivas", "Documentales", "Biblioteca ambiental"]
      },
      {
        name: "Mirador de Aves",
        description: "Punto de observaciÃ³n de aves con guÃ­as especializados. Se han registrado mÃ¡s de 80 especies.",
        duration: "60 min",
        highlights: ["ObservaciÃ³n de aves", "PrismÃ¡ticos disponibles", "GuÃ­a de aves local"]
      }
    ],
    practicalInfo: {
      startPoint: "Centro de EducaciÃ³n Ambiental (carretera a Huasca)",
      endPoint: "Mismo punto de inicio (ruta circular)",
      restrooms: ["Centro de EducaciÃ³n Ambiental", "Vivero Comunitario"],
      foodStops: ["Ãrea de picnic (llevar comida)"],
      parking: "Estacionamiento en Centro de EducaciÃ³n Ambiental",
      guided: true,
      price: "$250-350 MXN por persona (incluye material y Ã¡rbol)"
    },
    tips: [
      "Reserva con anticipaciÃ³n, los grupos son pequeÃ±os",
      "Puedes regresar a visitar tu Ã¡rbol plantado",
      "Lleva binoculares si tienes",
      "Viste colores neutros para observaciÃ³n de fauna"
    ]
  },
  {
    id: "aventura",
    name: "Ruta de Aventura",
    tagline: "Adrenalina en la montaÃ±a",
    description: "Para los amantes de la emociÃ³n: tirolesa, rappel, escalada en roca y mÃ¡s actividades extremas en el entorno natural.",
    fullDescription: "La Ruta de Aventura estÃ¡ diseÃ±ada para quienes buscan emociones fuertes y experiencias que ponen a prueba sus lÃ­mites. En el impresionante escenario de las PeÃ±as Cargadas y sus alrededores, podrÃ¡s practicar escalada en roca natural, descender por acantilados con rappel, volar sobre el bosque en tirolesa, y explorar caÃ±ones. Todas las actividades son supervisadas por instructores certificados y cuentan con equipo de seguridad profesional. No se requiere experiencia previa para la mayorÃ­a de las actividades, solo actitud aventurera y ganas de superaciÃ³n. Es una manera Ãºnica de experimentar la geografÃ­a de Real del Monte desde perspectivas que pocos llegan a ver.",
    icon: Compass,
    color: "text-orange-600",
    bgGradient: "from-orange-500/20 to-orange-500/5",
    duration: "6-8 horas",
    distance: "5 km (varÃ­a por actividades)",
    difficulty: "Desafiante",
    physicalLevel: 8,
    bestTime: "Marzo a junio (clima estable)",
    idealFor: ["Aventureros", "Grupos de amigos", "Team building", "Deportistas"],
    whatToBring: ["Ropa deportiva ajustada", "Tenis con buen grip", "Guantes (opcional)", "2L de agua", "Snacks", "CÃ¡mara de acciÃ³n", "Repelente"],
    stops: [
      {
        name: "Base de Operaciones",
        description: "Punto de reuniÃ³n donde se da la inducciÃ³n de seguridad y se entrega el equipo necesario.",
        duration: "45 min",
        highlights: ["InducciÃ³n de seguridad", "Entrega de equipo", "Calentamiento"]
      },
      {
        name: "Tirolesa del Ãguila",
        description: "Vuelo de 400 metros sobre el bosque a 80 metros de altura. SensaciÃ³n Ãºnica de libertad.",
        duration: "60 min",
        highlights: ["400m de vuelo", "80m de altura", "Vistas panorÃ¡micas"],
        tips: "No llevar objetos sueltos en bolsillos"
      },
      {
        name: "ParedÃ³n de Escalada",
        description: "Rutas de escalada en roca natural de diferentes grados de dificultad (5.5 a 5.10).",
        duration: "120 min",
        highlights: ["Escalada en roca natural", "Diferentes niveles", "Instructores certificados"]
      },
      {
        name: "Rappel en PeÃ±as Cargadas",
        description: "Descenso controlado de 30 metros por la pared de las PeÃ±as Cargadas. Experiencia vertiginosa.",
        duration: "90 min",
        highlights: ["Descenso de 30m", "TÃ©cnica de rappel", "Adrenalina pura"]
      },
      {
        name: "CaÃ±onismo BÃ¡sico",
        description: "Recorrido por un caÃ±Ã³n secuencial con saltos controlados a pozas de agua (en temporada).",
        duration: "90 min",
        highlights: ["Saltos a pozas", "Nado", "Trekking acuÃ¡tico"]
      }
    ],
    practicalInfo: {
      startPoint: "Base de Operaciones Aventura (PeÃ±as Cargadas)",
      endPoint: "Mismo punto de inicio",
      restrooms: ["Base de Operaciones"],
      foodStops: ["Ãrea de comida en Base de Operaciones"],
      parking: "Estacionamiento en Base de Operaciones",
      guided: true,
      price: "$800-1,200 MXN por persona (todo incluido)"
    },
    tips: [
      "Reserva con al menos una semana de anticipaciÃ³n",
      "No consumir alcohol antes de las actividades",
      "Informa sobre condiciones mÃ©dicas relevantes",
      "Sigue SIEMPRE las instrucciones de los guÃ­as",
      "Puedes contratar paquete fotogrÃ¡fico"
    ],
    warnings: [
      "No apto para personas con problemas cardÃ­acos",
      "No apto para mujeres embarazadas",
      "No apto para personas con miedo intenso a las alturas",
      "Requiere firma de liberaciÃ³n de responsabilidad",
      "Actividades sujetas a condiciones climÃ¡ticas"
    ]
  },
  {
    id: "gastronomica",
    name: "Ruta GastronÃ³mica",
    tagline: "Un viaje de sabores tradicionales",
    description: "Recorrido por las tradiciones culinarias de Real del Monte, degustando pastes, dulces tÃ­picos y platillos de la cocina minera.",
    fullDescription: "La Ruta GastronÃ³mica es un festÃ­n para los sentidos que te lleva a travÃ©s de los sabores que definieron a Real del Monte. Desde el icÃ³nico paste hasta los guisos mineros que sustentaron generaciones de trabajadores, cada parada es una lecciÃ³n de historia y cultura. Visitaremos pastelerÃ­as tradicionales donde se guardan secretos familiares transmitidos por generaciones, probaremos dulces que datan de la Ã©poca colonial, y degustaremos bebidas que han refrescado a mineros desde el siglo XIX. Esta ruta no es solo para comer: es para comprender cÃ³mo la gastronomÃ­a refleja la fusiÃ³n cultural Ãºnica de este Pueblo MÃ¡gico. Los grupos son reducidos para garantizar una experiencia Ã­ntima y personalizada.",
    icon: Utensils,
    color: "text-gold",
    bgGradient: "from-gold/20 to-gold/5",
    duration: "4-5 horas",
    distance: "3 km (caminata muy ligera)",
    difficulty: "FÃ¡cil",
    physicalLevel: 2,
    bestTime: "Todo el aÃ±o, especialmente octubre (Festival del Paste)",
    idealFor: ["Foodies", "Familias", "Grupos de amigos", "Turistas culturales"],
    whatToBring: ["Ropa cÃ³moda", "Hambre", "Botella de agua", "Dinero en efectivo", "CÃ¡mara"],
    stops: [
      {
        name: "Desayuno Tradicional",
        description: "Iniciamos con un desayuno de campeones: huevos al gusto, frijoles, cafÃ© de altura y pan reciÃ©n hecho en una autÃ©ntica cocina local.",
        duration: "45 min",
        highlights: ["CafÃ© de la regiÃ³n", "Pan artesanal", "Huevos rancheros"]
      },
      {
        name: "Taller de Paste",
        description: "Aprende a hacer tu propio paste con una familia pastelesa tradicional. Te llevas lo que prepares.",
        duration: "90 min",
        highlights: ["Receta tradicional", "Masa desde cero", "Llevas tu paste"],
        tips: "Reservar con anticipaciÃ³n, cupo limitado"
      },
      {
        name: "Recorrido de PastelerÃ­as",
        description: "Visita a 3 pastelerÃ­as icÃ³nicas para degustar diferentes variedades: tradicional, de mole y dulce.",
        duration: "60 min",
        highlights: ["DegustaciÃ³n guiada", "Historias familiares", "TÃ©cnica de elaboraciÃ³n"]
      },
      {
        name: "Museo del Paste",
        description: "Visita al Ãºnico museo dedicado al paste en MÃ©xico. Historia, utensilios antiguos y cultura pastelesa.",
        duration: "45 min",
        highlights: ["Historia del paste", "Utensilios antiguos", "GalerÃ­a fotogrÃ¡fica"]
      },
      {
        name: "Comida Minera",
        description: "Almuerzo completo con guiso de res minero, truchas o barbacoa estilo Hidalgo, acompaÃ±ado de aguas frescas.",
        duration: "75 min",
        highlights: ["Guiso tradicional", "Recetas antiguas", "Ambiente histÃ³rico"]
      },
      {
        name: "Dulces y Postres",
        description: "Finalizamos con una degustaciÃ³n de dulces tÃ­picos: obleas de gajeta, jamoncillo, cocada y ate.",
        duration: "30 min",
        highlights: ["Dulces coloniales", "Recetas tradicionales", "Para llevar"]
      }
    ],
    practicalInfo: {
      startPoint: "Plaza Principal (frente a la Parroquia)",
      endPoint: "Portal del Comercio",
      restrooms: ["En cada parada gastronÃ³mica"],
      foodStops: ["Todas las paradas incluyen degustaciÃ³n"],
      parking: "Estacionamiento en Plaza Principal",
      guided: true,
      price: "$600-800 MXN por persona (todas las degustaciones incluidas)"
    },
    tips: [
      "Ven con hambre, son muchas degustaciones",
      "Avisa sobre alergias alimentarias al reservar",
      "Puedes comprar productos para llevar en cada parada",
      "Lleva bolsa tÃ©rmica si planeas comprar pastes",
      "La ruta puede adaptarse para vegetarianos"
    ]
  },
  {
    id: "cervecera",
    name: "Ruta Cervecera",
    tagline: "TradiciÃ³n cervecera cornish-mexicana",
    description: "Descubre la tradiciÃ³n cervecera traÃ­da por los ingleses, visita cervecerÃ­as artesanales y degusta cervezas inspiradas en la historia local.",
    fullDescription: "La Ruta Cervecera revela una faceta poco conocida de la historia de Real del Monte: la tradiciÃ³n cervecera traÃ­da por los mineros cornish. Los ingleses no solo trajeron tÃ©cnicas mineras, tambiÃ©n establecieron las primeras cervecerÃ­as de la regiÃ³n para abastecer a la comunidad expatriada. Hoy, esta tradiciÃ³n revive a travÃ©s de cervecerÃ­as artesanales que honran esa herencia con recetas innovadoras inspiradas en ingredientes locales. En esta ruta visitarÃ¡s cervecerÃ­as artesanales, aprenderÃ¡s sobre el proceso de elaboraciÃ³n, degustarÃ¡s estilos que van desde ales inglesas tradicionales hasta cervezas con toques de frutas locales y especias. Incluye maridajes especializados y la historia de cÃ³mo la cerveza se convirtiÃ³ en parte de la cultura local.",
    icon: Beer,
    color: "text-amber-600",
    bgGradient: "from-amber-500/20 to-amber-500/5",
    duration: "4 horas",
    distance: "2 km",
    difficulty: "FÃ¡cil",
    physicalLevel: 2,
    bestTime: "Todo el aÃ±o, fines de semana ideales",
    idealFor: ["Amantes de la cerveza artesanal", "Adultos", "Grupos de amigos", "Parejas"],
    whatToBring: ["IdentificaciÃ³n oficial", "Ropa cÃ³moda", "Dinero para compras", "Transporte designado o taxi"],
    stops: [
      {
        name: "CervecerÃ­a La Mina",
        description: "CervecerÃ­a artesanal con temÃ¡tica minera. AquÃ­ se elabora la 'Stout del Minero', inspirada en las porters inglesas tradicionales.",
        duration: "60 min",
        highlights: ["Tour de elaboraciÃ³n", "DegustaciÃ³n de 3 cervezas", "Historia cervecera local"]
      },
      {
        name: "CervecerÃ­a del Bosque",
        description: "Ubicada en un entorno natural, especializada en cervezas con ingredientes locales como pino, manzanilla y miel.",
        duration: "60 min",
        highlights: ["Cervezas botÃ¡nicas", "Ingredientes locales", "Terraza con vistas"]
      },
      {
        name: "CervecerÃ­a Cornish Pride",
        description: "Fiel a las raÃ­ces inglesas, elabora bitters, pale ales y stouts tradicionales con recetas autÃ©nticas.",
        duration: "60 min",
        highlights: ["Recetas autÃ©nticas inglesas", "Historia de la cerveza en Real del Monte", "Maridaje con paste"]
      },
      {
        name: "CervecerÃ­a 2700",
        description: "Nombrada por la altitud del pueblo. Especializada en IPAs y cervezas de alta graduaciÃ³n con carÃ¡cter montaÃ±Ã©s.",
        duration: "60 min",
        highlights: ["IPAs artesanales", "Cervezas de temporada", "Venta de growlers"]
      }
    ],
    practicalInfo: {
      startPoint: "CervecerÃ­a La Mina (centro del pueblo)",
      endPoint: "CervecerÃ­a 2700",
      restrooms: ["En cada cervecerÃ­a"],
      foodStops: ["Maridajes incluidos en cada parada"],
      parking: "Varios puntos de estacionamiento en el centro",
      guided: true,
      price: "$500-700 MXN por persona (degustaciones incluidas)"
    },
    tips: [
      "Solo para mayores de 18 aÃ±os con identificaciÃ³n",
      "HidrÃ¡tate entre cervezas",
      "No manejes despuÃ©s del tour, usa transporte alternativo",
      "Pregunta por ediciones limitadas",
      "Puedes comprar cerveza para llevar"
    ],
    warnings: [
      "Consumo responsable obligatorio",
      "No apto para menores de edad",
      "No apto para mujeres embarazadas",
      "No consumir alcohol si tomarÃ¡s el volante"
    ]
  }
];

const RouteCard = ({ route, isSelected, onClick }: { route: TouristRoute; isSelected: boolean; onClick: () => void }) => {
  const Icon = route.icon;
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 ${
        isSelected 
          ? `bg-gradient-to-br ${route.bgGradient} border-2 border-${route.color.split('-')[1]}` 
          : 'bg-background border border-border hover:border-muted-foreground/30'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${route.color.replace('text-', 'bg-')}/10 flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${route.color}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-lg font-bold text-foreground">{route.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{route.tagline}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {route.duration}
            </span>
            <span className="flex items-center gap-1">
              <Footprints className="w-3 h-3" />
              {route.distance}
            </span>
            <Badge variant={route.difficulty === "FÃ¡cil" ? "secondary" : route.difficulty === "Moderada" ? "default" : "destructive"} className="text-xs">
              {route.difficulty}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RouteDetail = ({ route }: { route: TouristRoute }) => {
  const Icon = route.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className={`rounded-2xl p-8 bg-gradient-to-br ${route.bgGradient}`}>
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl ${route.color.replace('text-', 'bg-')}/20 flex items-center justify-center`}>
            <Icon className={`w-8 h-8 ${route.color}`} />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground">{route.name}</h2>
            <p className={`${route.color} font-medium`}>{route.tagline}</p>
          </div>
        </div>
        
        <p className="text-muted-foreground leading-relaxed mb-6">{route.fullDescription}</p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background/50 rounded-xl p-4 text-center">
            <Clock className={`w-5 h-5 ${route.color} mx-auto mb-2`} />
            <div className="text-sm font-medium text-foreground">{route.duration}</div>
            <div className="text-xs text-muted-foreground">DuraciÃ³n</div>
          </div>
          <div className="bg-background/50 rounded-xl p-4 text-center">
            <Route className={`w-5 h-5 ${route.color} mx-auto mb-2`} />
            <div className="text-sm font-medium text-foreground">{route.distance}</div>
            <div className="text-xs text-muted-foreground">Distancia</div>
          </div>
          <div className="bg-background/50 rounded-xl p-4 text-center">
            <AlertCircle className={`w-5 h-5 ${route.color} mx-auto mb-2`} />
            <div className="text-sm font-medium text-foreground">{route.difficulty}</div>
            <div className="text-xs text-muted-foreground">Dificultad</div>
          </div>
          <div className="bg-background/50 rounded-xl p-4 text-center">
            <Sun className={`w-5 h-5 ${route.color} mx-auto mb-2`} />
            <div className="text-sm font-medium text-foreground">{route.bestTime.split(',')[0]}</div>
            <div className="text-xs text-muted-foreground">Mejor Ã©poca</div>
          </div>
        </div>
      </div>

      {/* Physical Level */}
      <div className="bg-muted/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Nivel fÃ­sico requerido</span>
          <span className={`text-sm font-bold ${route.color}`}>{route.physicalLevel}/10</span>
        </div>
        <Progress value={route.physicalLevel * 10} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Relajado</span>
          <span>Intenso</span>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="stops" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stops">Paradas</TabsTrigger>
          <TabsTrigger value="info">Info PrÃ¡ctica</TabsTrigger>
          <TabsTrigger value="ideal">Ideal Para</TabsTrigger>
          <TabsTrigger value="tips">Consejos</TabsTrigger>
        </TabsList>

        {/* Stops Tab */}
        <TabsContent value="stops" className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-foreground mb-4">Itinerario de Paradas</h3>
          {route.stops.map((stop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 p-4 rounded-xl bg-muted/30"
            >
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${route.color.replace('text-', 'bg-')}/20 flex items-center justify-center text-sm font-bold ${route.color}`}>
                  {index + 1}
                </div>
                {index < route.stops.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border my-2" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-foreground">{stop.name}</h4>
                  <span className="text-xs text-muted-foreground">({stop.duration})</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{stop.description}</p>
                {stop.highlights && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {stop.highlights.map((highlight, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                )}
                {stop.tips && (
                  <p className="text-xs text-amber-600">
                    <Info className="w-3 h-3 inline mr-1" />
                    {stop.tips}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </TabsContent>

        {/* Practical Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/30">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                UbicaciÃ³n
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Inicio:</strong> {route.practicalInfo.startPoint}</p>
                <p><strong>Fin:</strong> {route.practicalInfo.endPoint}</p>
                <p><strong>Estacionamiento:</strong> {route.practicalInfo.parking}</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-muted/30">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Backpack className="w-4 h-4" />
                Servicios
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Servicios sanitarios:</strong> {route.practicalInfo.restrooms.join(", ")}</p>
                <p><strong>Comida/Bebida:</strong> {route.practicalInfo.foodStops.join(", ")}</p>
                <p><strong>GuÃ­a:</strong> {route.practicalInfo.guided ? "Requerido/Incluido" : "Opcional"}</p>
              </div>
            </div>
          </div>

          {route.practicalInfo.price && (
            <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="text-gold">$</span>
                Costo Aproximado
              </h4>
              <p className="text-sm text-muted-foreground">{route.practicalInfo.price}</p>
            </div>
          )}
        </TabsContent>

        {/* Ideal For Tab */}
        <TabsContent value="ideal" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Ideal para:</h4>
              <ul className="space-y-2">
                {route.idealFor.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">QuÃ© llevar:</h4>
              <ul className="space-y-2">
                {route.whatToBring.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Backpack className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* Tips Tab */}
        <TabsContent value="tips" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                Consejos Ãºtiles
              </h4>
              <ul className="space-y-2">
                {route.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {route.warnings && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Advertencias importantes
                </h4>
                <ul className="space-y-2">
                  {route.warnings.map((warning, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                      <span className="text-red-400">â€¢</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* CTA */}
      <div className="flex flex-wrap gap-4">
        <Button className={`${route.color.replace('text-', 'bg-')} text-white rounded-full px-8`}>
          Reservar esta Ruta
        </Button>
        <Button variant="outline" className="rounded-full px-8">
          <Map className="w-4 h-4 mr-2" />
          Descargar Mapa
        </Button>
      </div>
    </motion.div>
  );
};

const RutasPage = () => {
  const [selectedRoute, setSelectedRoute] = useState<TouristRoute>(touristRoutes[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <RDMLayout>
      <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
        <SEOMeta {...PAGE_SEO.rutas} />
        
        {/* Hero Section */}
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <motion.div 
            className="absolute inset-0 -z-10"
            style={{ y: backgroundY }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
              style={{ backgroundImage: `url(${heroImg})` }}
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-3xl"
              >
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6 backdrop-blur-sm"
                >
                  <Route className="w-4 h-4" />
                  Descubre Real del Monte
                </motion.span>
                
                <TextReveal>
                  <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-[1.1]">
                    Rutas{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-gold to-terracotta">
                      TurÃ­sticas
                    </span>
                  </h1>
                </TextReveal>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
                >
                  Seis experiencias Ãºnicas diseÃ±adas para que descubras Real del Monte desde 
                  diferentes perspectivas: historia, naturaleza, gastronomÃ­a y aventura.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Routes Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Route Selector */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Selecciona tu Ruta</h2>
                <div className="space-y-3">
                  {touristRoutes.map((route) => (
                    <RouteCard
                      key={route.id}
                      route={route}
                      isSelected={selectedRoute.id === route.id}
                      onClick={() => setSelectedRoute(route)}
                    />
                  ))}
                </div>
              </div>

              {/* Route Detail */}
              <div className="lg:col-span-2">
                <RouteDetail route={selectedRoute} />
              </div>
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                Resumen de Rutas
              </h2>
              <p className="text-muted-foreground">
                Compara las rutas y elige la que mejor se adapte a tus intereses
              </p>
            </motion.div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Ruta</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground">DuraciÃ³n</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground">Distancia</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground">Dificultad</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground">Ideal Para</th>
                  </tr>
                </thead>
                <tbody>
                  {touristRoutes.map((route, index) => (
                    <tr key={route.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <route.icon className={`w-5 h-5 ${route.color}`} />
                          <div>
                            <div className="font-medium text-foreground">{route.name}</div>
                            <div className="text-xs text-muted-foreground">{route.tagline}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4 text-muted-foreground">{route.duration}</td>
                      <td className="text-center py-4 px-4 text-muted-foreground">{route.distance}</td>
                      <td className="text-center py-4 px-4">
                        <Badge variant={route.difficulty === "FÃ¡cil" ? "secondary" : route.difficulty === "Moderada" ? "default" : "destructive"}>
                          {route.difficulty}
                        </Badge>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="flex flex-wrap justify-center gap-1">
                          {route.idealFor.slice(0, 2).map((item, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full">
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-gold/10" />
          <div className="container mx-auto px-4 md:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Â¿Listo para Explorar?
              </h2>
              <p className="text-muted-foreground mb-8">
                Todas nuestras rutas incluyen guÃ­as certificados, seguro de viajero y 
                la garantÃ­a de una experiencia autÃ©ntica en Real del Monte.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
                  <Route className="w-4 h-4 mr-2" />
                  Reservar una Ruta
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 border-2">
                  <Map className="w-4 h-4 mr-2" />
                  Descargar GuÃ­a Completa
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </RDMLayout>
  );
};

export default RutasPage;
