/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, Pickaxe, Flag, Users, Ship, Church, BookOpen, 
  Mountain, Gem, Crown, Scroll, Anchor, Compass, Flame,
  Building2, Scale, Landmark, Sparkles, MapPin, Ghost, AlertTriangle,
  Eye, Shield, Heart, Calendar
} from "lucide-react";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { SEOMeta, PAGE_SEO } from "@/components/SEOMeta";
import { VideoEmbed } from "@/components/rdm/VideoEmbed";
import { TextReveal, ParallaxImage, StaggerContainer, StaggerItem } from "@/components/VisualEffects";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { VideoGallery } from "@/components/VideoGallery";
import { ImageGallery } from "@/components/ImageGallery";

// Assets
import minaImg from "@/assets/mina-acosta.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import callesImg from "@/assets/calles-colonial.webp";
import heroImg from "@/assets/hero-real-del-monte.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import rdm1 from "@/assets/rdm1.jpeg";
import rdm2 from "@/assets/rdm2.jpeg";
import rdm3 from "@/assets/rdm01.jpg";
import rdm4 from "@/assets/rdm02.jpg";
import rdm5 from "@/assets/rdm03.jpg";

// Extended timeline with more historical depth
const timeline = [
  {
    year: "1534",
    title: "Primeras Exploraciones",
    description: "Exploradores espaÃ±oles inician expediciones a la Sierra de Pachuca, atraÃ­dos por rumores de ricos yacimientos de plata en tierras otomÃ­es.",
    icon: Compass,
    color: "bg-stone",
    details: "Las primeras expediciones fueron lideradas por conquistadores que escucharon relatos de los indÃ­genas sobre montaÃ±as brillantes. Sin embargo, la topografÃ­a montaÃ±osa y la resistencia de los pueblos originales dificultaron el establecimiento inicial."
  },
  {
    year: "1560",
    title: "Descubrimiento de la Veta Madre",
    description: "Juan de ZÃºÃ±iga y Juan de la Cruz descubren la veta madre de plata en la Sierra de Pachuca, dando origen al Real de Minas de Pachuca y el nacimiento oficial de la comunidad minera.",
    icon: Gem,
    color: "bg-terracotta",
    details: "El descubrimiento ocurriÃ³ en lo que hoy se conoce como Mina de San Antonio. La veta se extendÃ­a por kilÃ³metros bajo la montaÃ±a, prometiendo riquezas incalculables. La Corona EspaÃ±ola inmediatamente estableciÃ³ el Real de Minas, un distrito minero con privilegios especiales."
  },
  {
    year: "1580",
    title: "FundaciÃ³n del Real de Minas",
    description: "Se establece oficialmente el Real de Minas con la construcciÃ³n de las primeras haciendas de beneficio y el trazado de las calles principales siguiendo el modelo colonial espaÃ±ol.",
    icon: Building2,
    color: "bg-primary",
    details: "La fundaciÃ³n trajo consigo la construcciÃ³n de la Iglesia de la AsunciÃ³n, las primeras viviendas para mineros y las haciendas de beneficio donde se procesaba el mineral. La poblaciÃ³n comenzÃ³ a crecer rÃ¡pidamente, atrayendo trabajadores de todo el centro de MÃ©xico."
  },
  {
    year: "1766",
    title: "La Llegada de los Cornish",
    description: "Inmigrantes de Cornualles, Inglaterra llegan a Real del Monte trayendo tecnologÃ­a minera revolucionaria, steam engines, y una cultura que transformarÃ­a para siempre al pueblo.",
    icon: Ship,
    color: "bg-gold",
    details: "Bajo el mando de empresarios como John Rule y James Vetch, llegaron mÃ¡s de 150 familias cornish entre 1824 y 1840. Trajeron consigo bombas de vapor, trenes de mina, herramientas especializadas y conocimientos avanzados de ingenierÃ­a. TambiÃ©n construyeron la primera estaciÃ³n de ferrocarril en MÃ©xico."
  },
  {
    year: "1824",
    title: "Independencia EconÃ³mica",
    description: "Pedro Romero de Terreros compra las minas a la Corona EspaÃ±ola, marcando el inicio de la minerÃ­a independiente mexicana y una nueva era de prosperidad.",
    icon: Crown,
    color: "bg-forest",
    details: "Romero de Terreros, descendiente de la nobleza espaÃ±ola pero mexicano de nacimiento, invirtiÃ³ fortunas en modernizar las operaciones mineras. Bajo su administraciÃ³n, las minas alcanzaron niveles de producciÃ³n nunca antes vistos, financiando proyectos de infraestructura en toda la regiÃ³n."
  },
  {
    year: "1850",
    title: "La RevoluciÃ³n del Paste",
    description: "Las pastelerÃ­as cornish-mexicanas se establecen formalmente, fusionando la receta del Cornish Pasty con ingredientes locales como el mole, frijol y chile, creando un Ã­cono gastronÃ³mico Ãºnico.",
    icon: Flame,
    color: "bg-terracotta",
    details: "Las esposas de los mineros ingleses comenzaron a preparar pasties para sus maridos, pero pronto las cocineras mexicanas adaptaron la receta con sabores locales. AsÃ­ naciÃ³ el paste mexicano, una fusiÃ³n culinaria que solo existe en Real del Monte."
  },
  {
    year: "1900",
    title: "El PanteÃ³n InglÃ©s",
    description: "Se consagra el Cementerio de los Anglicanos, hoy conocido como PanteÃ³n InglÃ©s, el cementerio anglicano mÃ¡s alto del mundo a 2,700 metros sobre el nivel del mar.",
    icon: Landmark,
    color: "bg-stone",
    details: "El PanteÃ³n InglÃ©s alberga tumbas que datan desde 1830 hasta 1960. Sus lÃ¡pidas de mÃ¡rmol cuentan historias de amor, tragedia y aventura. Es el Ãºnico cementerio en MÃ©xico donde se practican servicios anglicanos regulares y representa la memoria histÃ³rica de la comunidad cornish."
  },
  {
    year: "1930",
    title: "Era de la NacionalizaciÃ³n",
    description: "Las minas pasan a manos del gobierno mexicano. El auge minero declina, pero la comunidad encuentra nuevas formas de subsistencia preservando su patrimonio cultural.",
    icon: Scale,
    color: "bg-primary",
    details: "La nacionalizaciÃ³n de la minerÃ­a por parte del gobierno federal marcÃ³ el fin de una era. Muchas familias emigraron, pero las que se quedaron comenzaron a preservar conscientemente su patrimonio Ãºnico. Se fundaron los primeros museos y comenzÃ³ el turismo cultural."
  },
  {
    year: "2004",
    title: "Nombramiento Pueblo MÃ¡gico",
    description: "Real del Monte es nombrado Pueblo MÃ¡gico por la SecretarÃ­a de Turismo, reconociendo su importancia histÃ³rica, cultural y arquitectÃ³nica Ãºnica en MÃ©xico.",
    icon: Sparkles,
    color: "bg-gold",
    details: "El nombramiento de Pueblo MÃ¡gico vino acompaÃ±ado de inversiones en infraestructura turÃ­stica, restauraciÃ³n del centro histÃ³rico y programas de preservaciÃ³n cultural. Real del Monte se convirtiÃ³ en destino internacional, atrayendo a visitantes de todo el mundo."
  },
  {
    year: "2024",
    title: "Bicentenario Cornish-Mexicano",
    description: "CelebraciÃ³n de 200 aÃ±os de relaciÃ³n cultural entre Cornualles y Real del Monte, con eventos internacionales, intercambios culturales y el fortalecimiento de los lazos histÃ³ricos.",
    icon: Anchor,
    color: "bg-forest",
    details: "El bicentenario marcÃ³ el retorno de descendientes de las familias cornish originales, la inauguraciÃ³n de nuevos espacios museÃ­sticos, y la consolidaciÃ³n de Real del Monte como un caso Ãºnico de diÃ¡spora cultural en AmÃ©rica Latina."
  }
];

// Heritage sections with extended content
const heritageSections = [
  {
    id: "mining",
    title: "Herencia Minera",
    subtitle: "El corazÃ³n de plata de MÃ©xico",
    description: "Real del Monte fue el distrito minero mÃ¡s importante de la Nueva EspaÃ±a durante tres siglos. Las minas de Acosta, Dificultad, San Cayetano y Dolores produjeron toneladas de plata que financiaron guerras, construyeron naciones y atrajeron a aventureros de todo el mundo.",
    extendedDescription: `Las minas de Real del Monte fueron conocidas como "La Mina del Rey" durante la Ã©poca colonial debido a la calidad excepcional de su mineral. La veta madre se extendÃ­a por mÃ¡s de 5 kilÃ³metros bajo la montaÃ±a, con ramificaciones que llegaban hasta Pachuca.

La minerÃ­a en Real del Monte revolucionÃ³ la industria mexicana. AquÃ­ se introdujeron las primeras bombas de vapor de AmÃ©rica Latina, los primeros ferrocarriles mineros, y las tÃ©cnicas de perforaciÃ³n mÃ¡s avanzadas de la Ã©poca. Los ingenieros formados en Real del Monte llevaron su conocimiento a otros distritos mineros de MÃ©xico y SudamÃ©rica.

La plata de Real del Monte financiÃ³ la Independencia de MÃ©xico, pagÃ³ deudas internacionales, y contribuyÃ³ al desarrollo de infraestructura en todo el paÃ­s. Cada tonelada de mineral extraÃ­da representaba meses de trabajo en condiciones extremas, a mÃ¡s de 400 metros bajo tierra.`,
    image: minaImg,
    stats: [
      { label: "AÃ±os de historia minera", value: "460+" },
      { label: "Minas histÃ³ricas documentadas", value: "35+" },
      { label: "KilÃ³metros de tÃºneles", value: "500+" },
      { label: "Toneladas de plata extraÃ­das", value: "80K+" }
    ],
    highlights: [
      "Mina de Acosta: La mÃ¡s profunda, con 460 metros de profundidad",
      "Sistema de drenaje mÃ¡s avanzado de su Ã©poca en AmÃ©rica",
      "Primera mÃ¡quina de vapor en MÃ©xico, instalada en 1827",
      "Archivo minero con mapas y planos desde 1560"
    ]
  },
  {
    id: "cornish",
    title: "Legado Cornish",
    subtitle: "Una comunidad que transformÃ³ un pueblo",
    description: "La inmigraciÃ³n cornish dejÃ³ una huella indeleble en Real del Monte. Sus tÃ©cnicas mineras, arquitectura victoriana, tradiciones religiosas, deportes y gastronomÃ­a se fusionaron con la cultura mexicana creando una identidad Ãºnica en el mundo.",
    extendedDescription: `Entre 1824 y 1840, mÃ¡s de 3,000 cornish llegaron a Real del Monte, transformando un pueblo minero colonial en una comunidad bicultural Ãºnica. Trajeron consigo no solo tecnologÃ­a, sino toda una forma de vida.

La arquitectura victoriana de sus casas, con techos a dos aguas, jardines ornamentales y chimeneas caracterÃ­sticas, contrastaba con la arquitectura colonial espaÃ±ol. Construyeron su propia iglesia anglicana, club social, escuela, y cementerio.

Los cornish introdujeron el fÃºtbol a MÃ©xico (el primer partido documentado fue en Real del Monte en 1900), la lucha greco-romana, los coros masculinos, y por supuesto, el paste. Sus descendientes, muchos con apellidos como Rule, Phillips, Harvey y TreviÃ±o, aÃºn viven en el pueblo y preservan sus tradiciones.

La relaciÃ³n entre Cornualles y Real del Monte es tan especial que en 2008, el gobierno britÃ¡nico designÃ³ a Real del Monte como parte de la "Cornish Mining World Heritage Site", el Ãºnico lugar fuera de Gran BretaÃ±a con esta distinciÃ³n.`,
    image: panteonImg,
    stats: [
      { label: "Inmigrantes cornish", value: "3,000+" },
      { label: "Familias establecidas", value: "150+" },
      { label: "AÃ±os de influencia", value: "200+" },
      { label: "Descendientes vivos hoy", value: "500+" }
    ],
    highlights: [
      "Ãšnica comunidad cornish en AmÃ©rica Latina",
      "Primer partido de fÃºtbol en MÃ©xico (1900)",
      "Primer ferrocarril en MÃ©xico (1829)",
      "Primer diario bilingÃ¼e espaÃ±ol-inglÃ©s"
    ]
  },
  {
    id: "architecture",
    title: "Arquitectura Colonial",
    subtitle: "Caminar por las calles es viajar en el tiempo",
    description: "Las calles empedradas, casas con techos de teja roja, balcones de madera tallada, jardines florales y fachadas coloridas crean un ambiente que transporta al visitante al siglo XIX. El Centro HistÃ³rico estÃ¡ protegido por el INAH.",
    extendedDescription: `El Centro HistÃ³rico de Real del Monte comprende 12 manzanas de arquitectura colonial y victoriana perfectamente preservada. Las calles empedradas originales del siglo XVI siguen en uso, desgastadas por siglos de pisadas.

Las casas muestran la evoluciÃ³n arquitectÃ³nica del pueblo: las mÃ¡s antiguas, de adobe y techos de teja con patios interiores coloniales; las de la Ã©poca de esplendor minero, con fachadas de cantera y balcones de madera; y las construidas por los ingleses, con influencias victorianas, jardines frontales y ventanas de guillotina.

El trazado del pueblo sigue el modelo de plaza central hispanoamericano, con la Parroquia de la AsunciÃ³n como punto focal. Los callejones estrechos, las escalinatas de piedra, los arcos y los portales comerciales crean un ambiente Ãºnico que ha sido escenario de numerosas producciones cinematogrÃ¡ficas.

El INAH ha catalogado mÃ¡s de 200 edificios como patrimonio histÃ³rico, y la mayorÃ­a han sido restaurados respetando tÃ©cnicas originales y materiales tradicionales.`,
    image: callesImg,
    stats: [
      { label: "Edificios histÃ³ricos catalogados", value: "200+" },
      { label: "Manzanas del centro histÃ³rico", value: "12" },
      { label: "AÃ±o de fundaciÃ³n original", value: "1560" },
      { label: "KilÃ³metros de calles empedradas", value: "8" }
    ],
    highlights: [
      "Plaza Principal: CorazÃ³n social desde 1560",
      "Parroquia de la AsunciÃ³n: Arquitectura barroca del siglo XVIII",
      "Portal del Comercio: Sigue siendo centro comercial",
      "Callejones romÃ¡nticos: Escenario de leyendas"
    ]
  },
  {
    id: "nature",
    title: "GeografÃ­a y Naturaleza",
    subtitle: "Un pueblo entre el bosque y la neblina",
    description: "Ubicado a 2,700 metros sobre el nivel del mar, Real del Monte estÃ¡ envuelto en bosque de oyamel y pino. La neblina que frecuentemente cubre el pueblo ha inspirado poetas, pintores y leyendas durante siglos.",
    extendedDescription: `Real del Monte se asienta en la Sierra de Pachuca, parte del Eje NeovolcÃ¡nico Transversal. A 2,700 metros de altitud, es uno de los pueblos mÃ¡s altos de MÃ©xico, lo que explica su clima fresco y su caracterÃ­stica neblina.

El bosque que rodea al pueblo es principalmente de oyamel (Abies religiosa), pino y encino. Este ecosistema alberga una biodiversidad Ãºnica, incluyendo especies endÃ©micas de orquÃ­deas, hongos y mariposas. Durante el invierno, el bosque se transforma en un paisaje mÃ¡gico cuando la nieve cubre los Ã¡rboles.

La neblina es un elemento definitorio del paisaje realmontense. Se forma cuando las nubes del Golfo de MÃ©xico chocan con la sierra, creando un manto blanco que envuelve al pueblo. Los lugareÃ±os dicen que la neblina trae consigo "los susurros de los mineros del pasado".

Las formaciones rocosas como las PeÃ±as Cargadas son testimonios geolÃ³gicos de millones de aÃ±os de erosiÃ³n. Los manantiales de agua mineral, como el de San Antonio, han sido aprovechados desde la Ã©poca prehispÃ¡nica.`,
    image: penasImg,
    stats: [
      { label: "Altitud sobre el nivel del mar", value: "2,700m" },
      { label: "HectÃ¡reas de bosque protegido", value: "12,000" },
      { label: "Especies de flora documentadas", value: "850+" },
      { label: "DÃ­as con neblina al aÃ±o", value: "180+" }
    ],
    highlights: [
      "Bosque de oyamel: Hogar de la mariposa monarca",
      "Parque EcoturÃ­stico PeÃ±as Cargadas",
      "Manantiales de agua mineral natural",
      "Mirador La Cruz: Vista panorÃ¡mica 360Â°"
    ]
  }
];

// Historical figures
const historicalFigures = [
  {
    name: "Ricardo Bell",
    role: "El Payaso que Hizo ReÃ­r a la Dictadura",
    period: "1881-1911",
    description: "Richard Bell Guest, el clown inglÃ©s que revolucionÃ³ el entretenimiento en MÃ©xico Porfiriano. Su personaje 'El HuÃ¡caro' hizo reÃ­r incluso al General Porfirio DÃ­az.",
    contribution: "FundÃ³ el Gran Circo Bell y democratizÃ³ la risa en una Ã©poca de represiÃ³n. Su leyenda persiste en la tumba 55 del PanteÃ³n InglÃ©s."
  },
  {
    name: "Pedro Romero de Terreros",
    role: "Empresario Minero",
    period: "1824-1860",
    description: "Conde de Regla y visionario empresario que modernizÃ³ la minerÃ­a realmontense. InvirtiÃ³ millones de pesos en tecnologÃ­a de punta y mejorÃ³ las condiciones de los mineros.",
    contribution: 'Introdujo el sistema de "patentado" para distribuir ganancias entre los trabajadores'
  },
  {
    name: "John Rule",
    role: "Ingeniero Jefe",
    period: "1824-1835",
    description: "Ingeniero de Cornualles contratado para modernizar las operaciones mineras. DiseÃ±Ã³ el sistema de drenaje mÃ¡s avanzado de AmÃ©rica.",
    contribution: "ConstruyÃ³ la primera mÃ¡quina de vapor en MÃ©xico y el primer ferrocarril"
  },
  {
    name: "NicolÃ¡s ZÃºÃ±iga y Miranda",
    role: "PolÃ­tico y Escritor",
    period: "1863-1925",
    description: "Nacido en Real del Monte, se convirtiÃ³ en figura polÃ­tica nacional. EscribiÃ³ extensamente sobre la historia minera de su pueblo natal.",
    contribution: "PreservÃ³ documentos histÃ³ricos y testimonios de la Ã©poca minera dorada"
  },
  {
    name: "William Boyer",
    role: "CapellÃ¡n Anglicano",
    period: "1850-1880",
    description: "Sacerdote anglicano que sirviÃ³ a la comunidad cornish durante 30 aÃ±os. FundÃ³ la escuela bilingÃ¼e y el coro de la iglesia.",
    contribution: "DejÃ³ registros detallados de la vida cotidiana de la comunidad inglesa"
  }
];

// Video content
const historicalVideos = [
  {
    title: "Documental: 200 AÃ±os de Historia Cornish-Mexicana",
    thumbnail: minaImg,
    duration: "45:30",
    description: "Recorrido completo por la historia de la comunidad cornish en Real del Monte"
  },
  {
    title: "La Mina de Acosta: Descendiendo al Pasado",
    thumbnail: minaImg,
    duration: "18:45",
    description: "Recorrido en video por los tÃºneles histÃ³ricos de la mina mÃ¡s profunda"
  },
  {
    title: "Arquitectura y Leyendas del Centro HistÃ³rico",
    thumbnail: callesImg,
    duration: "25:20",
    description: "Caminata virtual por las calles empedradas y sus historias"
  },
  {
    title: "El PanteÃ³n InglÃ©s: Memoria de una Comunidad",
    thumbnail: panteonImg,
    duration: "32:15",
    description: "Documental sobre el cementerio anglicano mÃ¡s alto del mundo"
  }
];

// Image gallery
const historicalImages = [
  { src: minaImg, alt: "Mina de Acosta", caption: "Entrada histÃ³rica de la Mina de Acosta" },
  { src: panteonImg, alt: "PanteÃ³n InglÃ©s", caption: "Tumbas victorianas entre la neblina" },
  { src: callesImg, alt: "Calles Coloniales", caption: "Callejones empedrados del siglo XVI" },
  { src: heroImg, alt: "Vista PanorÃ¡mica", caption: "Real del Monte desde el mirador" },
  { src: penasImg, alt: "PeÃ±as Cargadas", caption: "Formaciones rocosas milenarias" },
];

const HistoriaPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <RDMLayout>
      <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
        <SEOMeta {...PAGE_SEO.historia} />

        {/* Video: Historia Minera */}
        <div className="px-6 md:px-16 pt-8">
          <VideoEmbed
            youtubeId="dQw4w9WgXcQ"
            title="500 AÃ±os de Historia Minera"
            variant="hero"
            caption="Del descubrimiento de la Veta Madre a la identidad actual"
          />
        </div>
        
        {/* Hero Section with Parallax */}
        <div className="relative h-[85vh] min-h-[600px] overflow-hidden">
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta/20 text-terracotta text-sm font-medium mb-6 backdrop-blur-sm"
                >
                  <Clock className="w-4 h-4" />
                  Desde 1560 â€¢ 460+ aÃ±os de historia
                </motion.span>
                
                <TextReveal>
                  <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-[1.1]">
                    Historia de{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta via-gold to-terracotta">
                      Real del Monte
                    </span>
                  </h1>
                </TextReveal>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
                >
                  MÃ¡s de cuatro siglos de historia minera, donde la plata forjÃ³ no solo metales preciosos, 
                  sino una cultura Ãºnica que fusiona lo mexicano con lo cornish. Un testimonio viviente 
                  del encuentro entre dos mundos.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="flex flex-wrap gap-4 mt-8"
                >
                  <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 text-white rounded-full px-8">
                    <Scroll className="w-4 h-4 mr-2" />
                    Explorar LÃ­nea del Tiempo
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full px-8 border-2">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Archivo HistÃ³rico
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Descubre</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
            </motion.div>
          </motion.div>
        </div>

        {/* Introduction Stats */}
        <section className="py-16 bg-gradient-to-b from-muted/20 to-muted/5">
          <div className="container mx-auto px-4 md:px-8">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "1560", label: "AÃ±o de fundaciÃ³n" },
                { value: "200+", label: "AÃ±os de herencia cornish" },
                { value: "35+", label: "Minas histÃ³ricas" },
                { value: "200+", label: "Edificios patrimonio" },
              ].map((stat, index) => (
                <StaggerItem key={index}>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-serif font-bold text-teal mb-2 drop-shadow-[0_0_15px_hsl(var(--teal)/0.3)]">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Interactive Timeline */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-terracotta text-sm font-medium uppercase tracking-wider">CronologÃ­a</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                LÃ­nea del Tiempo HistÃ³rica
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Los momentos que definieron la historia de este Pueblo MÃ¡gico, desde sus orÃ­genes 
                mineros hasta su reconocimiento internacional.
              </p>
            </motion.div>

            <div className="relative max-w-5xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-terracotta via-gold to-forest md:-translate-x-1/2" />
              
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className={`relative flex items-start gap-8 mb-16 last:mb-0 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div 
                        className={`rounded-2xl p-6 ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"} max-w-lg hover:shadow-elevated transition-shadow duration-300 ${index % 2 === 0 ? "hover:scale-[1.02]" : "hover:scale-[1.02]"}`}
                      >
                        <span 
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-foreground text-sm font-bold mb-3 border border-border shadow-gold"
                        >
                          {item.year}
                        </span>
                        <h3 
                          className="font-serif text-xl font-bold text-foreground mb-2 hover:text-teal transition-colors"
                        >
                          {item.title}
                        </h3>
                        <p 
                          className="text-sm text-muted-foreground leading-relaxed mb-3 font-medium"
                        >
                          {item.description}
                        </p>
                        <p 
                          className="text-xs text-muted-foreground/70 leading-relaxed border-t border-border pt-3"
                        >
                          {item.details}
                        </p>
                      </div>
                    </div>

                    {/* Icon */}
                    <div 
                      className="relative z-10 w-10 h-10 rounded-full bg-card border-4 border-gold shadow-lg flex items-center justify-center shrink-0 hover:rotate-12 transition-transform duration-300"
                    >
                      <div 
                        className={`w-4 h-4 rounded-full ${item.color} hover:scale-110 transition-transform duration-300`}
                      />
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Heritage Tabs Section */}
          <section 
            className="py-24 bg-gradient-to-b from-muted/30 to-muted/10"
          >
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-gold text-sm font-medium uppercase tracking-wider">Patrimonio</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Pilares de Nuestra Historia
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Cuatro dimensiones que definen la identidad Ãºnica de Real del Monte
              </p>
            </motion.div>

            <Tabs defaultValue="mining" className="w-full">
              <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 mb-12">
                <TabsTrigger value="mining" className="data-[state=active]:bg-terracotta data-[state=active]:text-white">
                  <Pickaxe className="w-4 h-4 mr-2" />
                  MinerÃ­a
                </TabsTrigger>
                <TabsTrigger value="cornish" className="data-[state=active]:bg-gold data-[state=active]:text-white">
                  <Ship className="w-4 h-4 mr-2" />
                  Cornish
                </TabsTrigger>
                <TabsTrigger value="architecture" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Building2 className="w-4 h-4 mr-2" />
                  Arquitectura
                </TabsTrigger>
                <TabsTrigger value="nature" className="data-[state=active]:bg-forest data-[state=active]:text-white">
                  <Mountain className="w-4 h-4 mr-2" />
                  Naturaleza
                </TabsTrigger>
              </TabsList>

              {heritageSections.map((section) => (
                <TabsContent key={section.id} value={section.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid lg:grid-cols-2 gap-12 items-start"
                  >
                    <div className="order-2 lg:order-1">
                      <span className="text-terracotta text-sm font-medium uppercase tracking-wider">
                        {section.subtitle}
                      </span>
                      <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                        {section.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {section.description}
                      </p>
                      <div className="prose prose-sm text-muted-foreground/80 whitespace-pre-line mb-8">
                        {section.extendedDescription}
                      </div>

                      {/* Highlights */}
                      <div className="space-y-3 mb-8">
                        {section.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-terracotta mt-2 shrink-0" />
                            <span className="text-sm text-muted-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        {section.stats.map((stat, i) => (
                          <div key={i} className="p-4 rounded-xl bg-background border border-border">
                            <div className="text-2xl font-serif font-bold text-terracotta">{stat.value}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="order-1 lg:order-2">
                      <ParallaxImage src={section.image} alt={section.title} />
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Historical Figures */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-terracotta text-sm font-medium uppercase tracking-wider">Personajes</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Quienes Forjaron el Pueblo
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Figuras histÃ³ricas que dejaron su huella indeleble en la historia de Real del Monte
              </p>
            </motion.div>

            <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {historicalFigures.map((figure, index) => (
                <StaggerItem key={index}>
                  <motion.div 
                    className="glass rounded-2xl p-6 hover:shadow-elevated transition-all duration-300"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-terracotta to-gold flex items-center justify-center shrink-0">
                        <span className="text-white font-serif text-lg font-bold">
                          {figure.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-bold text-foreground">{figure.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-terracotta mb-2">
                          <span>{figure.role}</span>
                          <span className="text-muted-foreground">â€¢</span>
                          <span className="text-muted-foreground">{figure.period}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{figure.description}</p>
                        <div className="p-3 rounded-lg bg-muted border border-border">
                          <span className="text-xs text-muted-foreground">
                            <strong className="text-foreground">Legado:</strong> {figure.contribution}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Ricardo Bell Legend Section */}
        <section className="py-24 bg-gradient-to-b from-background via-slate-950/20 to-background">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-purple-500 text-sm font-medium uppercase tracking-wider flex items-center justify-center gap-2">
                <Ghost className="w-4 h-4" />
                Leyenda Urbana
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                El Cisma de la Carcajada
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                La anatomÃ­a del mito de Ricardo Bell y la tumba apÃ³stata del PanteÃ³n InglÃ©s
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {/* Chapter I */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-500 font-serif font-bold">I</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    El Engendro de Deptford y el Exilio de la Pantomima
                  </h3>
                </div>
                <div className="glass rounded-2xl p-6 ml-13">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    <strong className="text-foreground">Inglaterra, 1858.</strong> El humo industrial de Deptford asfixiaba los pulmones del proletariado victoriano. En este vientre de hollÃ­n naciÃ³ Richard Bell Guest, hijo de James Bell, un clown itinerante escocÃ©s, y Emilia Guest, de sangre irlandesa.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    DebutÃ³ a los dos aÃ±os en Lyon, Francia. A lomos del Circo Chiarini en 1861, recorriÃ³ una Europa fragmentada. La Inglaterra de la RevoluciÃ³n Industrial era una maquinaria devoradora de almas. Para la Ã©lite britÃ¡nica, el payaso no era un artista; era un bufÃ³n despreciable.
                  </p>
                  <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <p className="text-sm text-purple-400 font-medium">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      1881: Bell cruza el AtlÃ¡ntico y arriba al MÃ©xico Porfiriano
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Chapter II */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-500 font-serif font-bold">II</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    El "HuÃ¡caro" que Hizo ReÃ­r al Dictador
                  </h3>
                </div>
                <div className="glass rounded-2xl p-6 ml-13">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Bell no fue un payaso convencional. DescartÃ³ la estridencia del clown rojo para abrazar al Pierrot melancÃ³lico. Se maquillÃ³ de blanco espectral, vistiÃ³ el traje holgado y naciÃ³ el <em>"huÃ¡caro"</em>. Su comedia no era de pastelazos, sino de crÃ­tica social finï¿½ï¿½sima.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Con el Circo OrrÃ­n, Bell se convirtiÃ³ en una deidad popular. <strong>Juan de Dios Peza</strong>, en <em>El Monitor Republicano</em>, sentenciÃ³: <em>"Es mÃ¡s popular que el pulque"</em>. Llenaba plazas enteras. Incluso el <strong>General Porfirio DÃ­az</strong>, un hombre de semblante pÃ©treo, acudÃ­a a su palco solo para doblegarse ante la risa.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                      <Crown className="w-3 h-3 mr-1" /> Favorito del Dictador
                    </Badge>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                      <Heart className="w-3 h-3 mr-1" /> Ãcono Popular
                    </Badge>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                      <Building2 className="w-3 h-3 mr-1" /> Gran Circo Bell (1907)
                    </Badge>
                  </div>
                </div>
              </motion.div>

              {/* Chapter III - The Legend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <span className="text-amber-500 font-serif font-bold">III</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    El Espejismo Cornish y el Pacto de la Neblina
                  </h3>
                </div>
                <div className="glass rounded-2xl p-6 ml-13 border-amber-500/30">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Las giras del Circo OrrÃ­n lo llevarÃ¡n a tocar la <strong>Comarca Minera</strong>: Pachuca y, finalmente, Real del Monte. El choque fue brutal. Bell no encontrÃ³ nopales y desierto, sino un <em>"Little Cornwall"</em> incrustado en la sierra.
                  </p>
                  <blockquote className="border-l-4 border-amber-500 pl-4 my-6 italic text-foreground/80">
                    "Bell, embriagado por este sincretismo y acogido por la calidez ruda de los mineros, subiÃ³ al PanteÃ³n InglÃ©s. AllÃ­, mirando las lÃ¡pidas devotas al este, escupiÃ³ su rebeldÃ­a. ComprÃ³ un espacio por adelantado y jurÃ³: <em>'Cuando la muerte me alcance, entiÃ©rrenme dÃ¡ndole la espalda al paÃ­s que me escupiÃ³'</em>."
                  </blockquote>
                </div>
              </motion.div>

              {/* Chapter IV - The Truth */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    La CirugÃ­a a la Verdad
                  </h3>
                </div>
                <div className="glass rounded-2xl p-6 ml-13 bg-red-950/10 border-red-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-medium">La respuesta histÃ³rica es: NO</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Con el estallido de la RevoluciÃ³n Maderista en 1911, Bell huyÃ³ con su familia hacia Nueva York. Una tormenta de nieve empeorÃ³ su condiciÃ³n de salud. El domingo <strong>12 de marzo de 1911</strong>, a los 53 aÃ±os, Ricardo Bell exhalÃ³ su Ãºltimo aliento. Fue sepultado en Nueva York. Su propia hija, Sylvia Bell, lo confirmÃ³ en su libro biogrÃ¡fico de 1984.
                  </p>
                  <div className="p-4 rounded-lg mb-4 bg-muted border border-border"
                  >
                    <h4 className="font-bold text-foreground mb-2">El Enigma Resuelto:</h4>
                    <p className="text-sm text-muted-foreground">
                      La <strong>tumba 55</strong> pertenece en realidad a un minero britÃ¡nico llamado <strong>Richard Bell</strong>, originario de Middleton, Teesdale, Inglaterra. Este minero falleciÃ³ el <strong>25 de octubre de 1875</strong>, a los 63 aÃ±os. Â¿Por quÃ© estÃ¡ volteada? No fue un acto de rebeldÃ­a. La historia forense sugiere que un deslizamiento de tierra o un error de los sepultureros locales alterÃ³ la orientaciÃ³n de la cantera.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Chapter V - The Myth */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    La TransmutaciÃ³n SociolÃ³gica
                  </h3>
                </div>
                <div className="glass rounded-2xl p-6 ml-13">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Si la historia es clara, <strong>Â¿por quÃ© sobrevive la leyenda?</strong> Porque el pueblo de Real del Monte necesitaba que fuera verdad.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    La psicologÃ­a colectiva hizo el resto. Fusionaron al minero anÃ³nimo con el Ã­dolo popular. Inventaron el desprecio a Inglaterra para justificar el error topogrÃ¡fico de la tumba.
                  </p>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 my-6">
                    <p className="text-foreground font-serif italic text-center">
                      "Nueva York guarda el polvo. Real del Monte resguarda el espÃ­ritu."
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Hay quienes juran que en las madrugadas heladas se escuchan las carcajadas de Bell rebotando entre los oyameles. Es la memoria viva.
                  </p>
                </div>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white rounded-full px-8"
                  onClick={() => navigate('/mapa')}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Visitar el PanteÃ³n InglÃ©s
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Multimedia Gallery */}
        <section className="py-24"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--muted) / 0.25), transparent 60%)',
          }}
        >
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-gold text-sm font-medium uppercase tracking-wider">Multimedia</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Archivo Visual HistÃ³rico
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ImÃ¡genes y videos que capturan la esencia histÃ³rica de Real del Monte
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">GalerÃ­a de ImÃ¡genes</h3>
                <ImageGallery />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Documentales y Videos</h3>
                <VideoGallery />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-terracotta/10 via-background to-gold/10" />
          <div className="container mx-auto px-4 md:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                SÃ© Parte de la Historia
              </h2>
              <p className="text-muted-foreground mb-8">
                Visita Real del Monte y camina por las mismas calles donde mineros, inmigrantes y 
                soÃ±adores forjaron una de las historias mÃ¡s fascinantes de MÃ©xico.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 text-white rounded-full px-8">
                  <MapPin className="w-4 h-4 mr-2" />
                  Planificar Visita
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 border-2">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Descargar GuÃ­a HistÃ³rica
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </RDMLayout>
  );
};

export default HistoriaPage;
