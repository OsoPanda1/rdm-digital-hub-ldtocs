/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * Componente de documentaciÃ³n que muestra el blueprint de TAMV Online Network
 */
const Blueprint: React.FC = () => {
  const blueprintModules = [
    {
      id: 1,
      title: "Nexo Estelar: Interfaz Principal",
      description: "Punto de acceso centralizado para todas las funcionalidades de TAMV Online Network.",
      elements: [
        "Panel de navegaciÃ³n principal",
        "SecciÃ³n de noticias y actualizaciones personalizadas",
        "Acceso rÃ¡pido a Dream Spaces recientes y recomendados",
        "VisiÃ³n general del perfil y saldo de CrÃ©ditos TAMV",
        "Herramientas de bÃºsqueda y descubrimiento de contenido y usuarios"
      ]
    },
    {
      id: 2,
      title: "ConstelaciÃ³n Interactiva: Sistema de NavegaciÃ³n",
      description: "Proporciona un sistema de navegaciÃ³n visualmente atractivo y fÃ¡cil de usar para explorar la plataforma.",
      elements: [
        "MenÃº principal con iconos representativos de cada secciÃ³n",
        "SubmenÃºs contextuales que se despliegan segÃºn la secciÃ³n seleccionada",
        "Funcionalidad de bÃºsqueda integrada en el menÃº",
        "Opciones de personalizaciÃ³n del menÃº segÃºn las preferencias del usuario"
      ]
    },
    {
      id: 3,
      title: "OrÃ¡culo TecnolÃ³gico: Panel de Control",
      description: "Ofrece una interfaz para la gestiÃ³n del perfil, la creaciÃ³n de contenido, la configuraciÃ³n de la privacidad y el acceso a herramientas avanzadas.",
      elements: [
        "GestiÃ³n de perfil: ediciÃ³n de biografÃ­a, avatar, preferencias",
        "ConfiguraciÃ³n de privacidad y seguridad",
        "Herramientas de creaciÃ³n y gestiÃ³n de Dream Spaces",
        "Interfaz para la creaciÃ³n y publicaciÃ³n de contenido mixto",
        "Acceso a estadÃ­sticas y analÃ­ticas del propio contenido"
      ]
    },
    {
      id: 4,
      title: "ADN Digital: Base de Datos Central",
      description: "Almacenar y gestionar toda la informaciÃ³n de la plataforma de forma eficiente y segura.",
      elements: [
        "Estructura de datos optimizada para consultas rÃ¡pidas y eficientes",
        "Mecanismos de indexaciÃ³n y bÃºsqueda avanzados",
        "ImplementaciÃ³n de polÃ­ticas de seguridad y privacidad"
      ]
    },
    {
      id: 5,
      title: "Ãrbol de la Vida Digital: Estructura de MÃ³dulos",
      description: "Organizar las diferentes funcionalidades de la plataforma en mÃ³dulos lÃ³gicos e interconectados.",
      elements: [
        "AutenticaciÃ³n y gestiÃ³n de usuarios",
        "GestiÃ³n de perfiles y conexiones",
        "MÃ³dulo de Dream Spaces",
        "MÃ³dulo de Chat 3D",
        "MÃ³dulo de Conciertos Sensoriales",
        "MÃ³dulo de Publicaciones Mixtas",
        "MÃ³dulo de la Tienda Virtual y CrÃ©ditos TAMV",
        "MÃ³dulo de la GalerÃ­a de Arte TAMV",
        "MÃ³dulo de AURA AI (Gemini Cloud)",
        "MÃ³dulo de Anubis Sentinel System (Google Cloud)"
      ]
    },
    {
      id: 6,
      title: "Interfaz Sensorial: Experiencia Multimedia",
      description: "Definir los lineamientos para la presentaciÃ³n de contenido multimedia, incluyendo la integraciÃ³n de elementos sensoriales.",
      elements: [
        "Formatos de archivo soportados",
        "Resoluciones y calidad recomendadas",
        "Directrices para la integraciÃ³n de elementos sensoriales",
        "OptimizaciÃ³n del rendimiento multimedia"
      ]
    },
    {
      id: 7,
      title: "Estilo y Materiales: Elementos de DiseÃ±o Digital",
      description: "Definir la identidad visual de la plataforma a travÃ©s de la paleta de colores, la tipografÃ­a, los iconos y otros elementos de diseÃ±o.",
      elements: [
        "Paleta de colores primaria y secundaria",
        "TipografÃ­a principal y secundaria",
        "Biblioteca de iconos y elementos grÃ¡ficos",
        "Directrices para el uso de la marca"
      ]
    },
    {
      id: 8,
      title: "Transiciones y Animaciones",
      description: "DiseÃ±ar las transiciones entre pantallas y las animaciones dentro de la interfaz para crear una experiencia fluida y atractiva.",
      elements: [
        "Tipos de animaciones y transiciones a utilizar",
        "DuraciÃ³n y velocidad de las animaciones",
        "Directrices para el uso consistente de animaciones"
      ]
    },
    {
      id: 9,
      title: "Mascotas GalÃ¡cticas Fashionistas",
      description: "Definir el diseÃ±o conceptual y las especificaciones tÃ©cnicas de las mascotas digitales.",
      elements: [
        "DiseÃ±os conceptuales y modelos 3D",
        "Especificaciones tÃ©cnicas para su implementaciÃ³n",
        "Mecanismos de personalizaciÃ³n e interacciÃ³n"
      ]
    },
    {
      id: 10,
      title: "GalerÃ­a de Arte TAMV",
      description: "Definir la disposiciÃ³n y la funcionalidad de la galerÃ­a virtual para la exhibiciÃ³n y venta de arte.",
      elements: [
        "DiseÃ±o de la interfaz de la galerÃ­a virtual",
        "Opciones para la visualizaciÃ³n de obras de arte",
        "Funcionalidades de compra y venta",
        "Herramientas para artistas"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gradient bg-gradient-crystal animate-text-shimmer">
          Blueprint de TAMV Online Network
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          VisiÃ³n general de la estructura y el diseÃ±o de los principales mÃ³dulos 
          que componen TAMV Online Network, detallando su propÃ³sito y funcionalidades clave.
        </p>
        <div className="flex justify-center mt-4">
          <Separator className="bg-gradient-crystal h-0.5 opacity-70 w-24 rounded-full" />
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {blueprintModules.map(module => (
          <motion.div key={module.id} variants={itemVariants}>
            <Card className="bg-black/30 border-blue-500/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-gradient bg-gradient-crystal">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {module.elements.map((element, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-400 mr-2">â€¢</span>
                      <span className="text-sm text-muted-foreground">{element}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Blueprint;
