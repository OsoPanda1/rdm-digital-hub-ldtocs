/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { RDMLayout } from "@/components/rdm/RDMLayout";
import PlaceCard from "@/components/PlaceCard";
import { SEOMeta, PAGE_SEO } from "@/components/SEOMeta";
import { motion } from "framer-motion";

import pasteImg from "@/assets/paste.webp";
import panteonImg from "@/assets/panteon-ingles.webp";
import minaImg from "@/assets/mina-acosta.webp";
import penasImg from "@/assets/penas-cargadas.webp";
import callesImg from "@/assets/calles-colonial.webp";
import heroImg from "@/assets/hero-real-del-monte.webp";
import rdm1 from "@/assets/rdm1.jpeg";
import rdm2 from "@/assets/rdm2.jpeg";
import plazaPrincipalImg from "@/assets/plaza_principal.jpg";
import plazaDosImg from "@/assets/plaza_dos.jpg";
import museoMedicinaImg from "@/assets/museo_medicina.jpg";
import miradorPurisimaImg from "@/assets/mirador_purisima.jpg";
import monumentoMineroImg from "@/assets/monumento_minero.jpg";

const allPlaces = [
  { name: "Museo de Sitio Mina de Acosta", category: "Mina", description: "Museo de historia minera con herramientas antiguas, fotos y visitas guiadas a tÃºneles de 400 m. DirecciÃ³n: Guerrero s/n, San JosÃ© Acosta. Horario: 9:30-17:30.", image: minaImg, rating: 4.8 },
  { name: "PanteÃ³n InglÃ©s", category: "Museo", description: "Cementerio histÃ³rico con 755 tumbas de mineros britÃ¡nicos (90% ocupadas), en un bosque de oyamel a 2,660 msnm, con pequeÃ±o museo. A 2.5 km del centro.", image: panteonImg, rating: 4.7 },
  { name: "PeÃ±as Cargadas", category: "Naturaleza", description: "Formaciones rocosas gigantes en equilibrio imposible. Senderismo entre bosque de niebla con vistas panorÃ¡micas del valle.", image: penasImg, rating: 4.9 },
  { name: "Parroquia de Nuestra SeÃ±ora de la AsunciÃ³n", category: "Iglesia", description: "Iglesia principal en la Plaza JuÃ¡rez, emblemÃ¡tica del centro histÃ³rico con arquitectura colonial. Coordenadas: 20.12928Â° N, 98.72996Â° W.", image: heroImg, rating: 4.7 },
  { name: "Museo de Medicina Laboral", category: "Museo", description: "Antiguo hospital de 1908 que muestra enfermedades y tratamientos de mineros. DirecciÃ³n: Hospital 6, El Hospital. Horario: 9:30-17:30.", image: museoMedicinaImg, rating: 4.5 },
  { name: "Santuario del SeÃ±or de Zelontla", category: "Cultura", description: "Templo con detalles fotogÃ©nicos como la vestimenta del Cristo Minero, punto de peregrinaciÃ³n local.", image: rdm1, rating: 4.4 },
  { name: "Plaza Principal", category: "Cultura", description: "CorazÃ³n del pueblo mÃ¡gico con portales, fuentes y edificios de aire inglÃ©s. Punto de encuentro y vida social.", image: plazaPrincipalImg, rating: 4.5 },
  { name: "Plaza Dos", category: "Cultura", description: "Segunda plaza del centro histÃ³rico, rodeada de arquitectura colonial y punto de reuniÃ³n para eventos culturales y ferias locales.", image: plazaDosImg, rating: 4.3 },
  { name: "Mirador de la PurÃ­sima", category: "Naturaleza", description: "Mirador con vistas panorÃ¡micas espectaculares del valle y el pueblo. Ideal para fotografÃ­as al atardecer cuando la niebla comienza a descender.", image: miradorPurisimaImg, rating: 4.8 },
  { name: "Monumento al Minero", category: "Cultura", description: "Homenaje escultÃ³rico a los mineros que forjaron la historia de Real del Monte. SÃ­mbolo del sacrificio y la identidad minera de la regiÃ³n.", image: monumentoMineroImg, rating: 4.6 },
  { name: "Museo del Paste", category: "Museo", description: "Conoce la historia del paste, su origen inglÃ©s y cÃ³mo se convirtiÃ³ en el platillo emblemÃ¡tico de Real del Monte.", image: pasteImg, rating: 4.6 },
  { name: "CallejÃ³n de los Artistas", category: "Cultura", description: "Exhibe fotos de producciones cinematogrÃ¡ficas, con vistas panorÃ¡micas del pueblo y la sierra.", image: rdm2, rating: 4.3 },
  { name: "Iglesia de la Santa Veracruz", category: "Iglesia", description: "Iglesia histÃ³rica vinculada al patrimonio religioso del pueblo.", image: heroImg, rating: 4.3 },
];

const LugaresPage = () => {
  return (
    <RDMLayout>
      <div className="min-h-screen bg-background">
        <SEOMeta {...PAGE_SEO.lugares} />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">Lugares y Atractivos</h1>
              <p className="text-muted-foreground max-w-lg">Descubre los rincones mÃ¡s emblemÃ¡ticos de Real del Monte, desde minas histÃ³ricas hasta bosques de niebla.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPlaces.map((place, i) => (
                <PlaceCard key={place.name} {...place} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </RDMLayout>
  );
};

export default LugaresPage;
