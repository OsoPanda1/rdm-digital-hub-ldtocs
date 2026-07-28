/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
export type NodeZeroRepoStatus = "absorbed" | "orchestrated" | "reference";

export interface NodeZeroRepo {
  id: string;
  name: string;
  url: string;
  family: "RDM" | "TAMV" | "Smart City" | "DocumentaciÃ³n";
  status: NodeZeroRepoStatus;
  focus: string;
  absorbedImprovements: string[];
}

export interface NodeZeroCapability {
  id: string;
  title: string;
  signal: string;
  implementation: string;
  routes: string[];
  maturity: number;
}

export interface NodeZeroProtocolStep {
  id: string;
  title: string;
  description: string;
  evidence: string;
}

export const NODE_ZERO_REPOS: NodeZeroRepo[] = [
  {
    id: "rdm-digital-x",
    name: "RDM-Digital-X",
    url: "https://github.com/OsoPanda1/RDM-Digital-X",
    family: "RDM",
    status: "absorbed",
    focus:
      "Manifiesto RDMÂ·X, pÃ¡ginas operativas, estado TAMV y contrato de fusiÃ³n.",
    absorbedImprovements: [
      "Registro explÃ­cito de repos y capacidades federadas.",
      "Lectura del ecosistema como sistema operativo, no como landing aislada.",
      "Panel de madurez por capacidades con rutas ejecutables.",
    ],
  },
  {
    id: "real-del-monte-digital",
    name: "real-del-monte-digital",
    url: "https://github.com/OsoPanda1/real-del-monte-digital",
    family: "RDM",
    status: "absorbed",
    focus: "Shell turÃ­stico-comercial base y experiencia de Pueblo MÃ¡gico.",
    absorbedImprovements: [
      "PriorizaciÃ³n de visitante, comercio y cultura antes del apÃ©ndice tÃ©cnico.",
      "Rutas pÃºblicas para historia, gastronomÃ­a, comercio, mapa y comunidad.",
      "Capa visual cinematogrÃ¡fica con identidad Real del Monte.",
    ],
  },
  {
    id: "real-del-monte-explorer",
    name: "real-del-monte-explorer-7b2783c6",
    url: "https://github.com/OsoPanda1/real-del-monte-explorer-7b2783c6",
    family: "RDM",
    status: "absorbed",
    focus:
      "ExploraciÃ³n cultural, sitios, relatos y navegaciÃ³n de experiencias.",
    absorbedImprovements: [
      "Estructura de pÃ¡ginas culturales especializadas.",
      "PatrÃ³n de tarjetas por experiencia territorial.",
      "NavegaciÃ³n orientada a descubrir antes que administrar.",
    ],
  },
  {
    id: "rdm-turismo-digital",
    name: "rdm-turismodigital",
    url: "https://github.com/OsoPanda1/rdm-turismodigital",
    family: "RDM",
    status: "orchestrated",
    focus: "CatÃ¡logo turÃ­stico, rutas, eventos y servicios para visitantes.",
    absorbedImprovements: [
      "AgrupaciÃ³n turismo + comercios + rutas como una sola experiencia operacional.",
      "CTA directas hacia rutas, catÃ¡logo, mapa y directorio.",
      "Lenguaje de producto para activar economÃ­a local.",
    ],
  },
  {
    id: "real-del-monte-twin",
    name: "real-del-monte-twin",
    url: "https://github.com/OsoPanda1/real-del-monte-twin",
    family: "Smart City",
    status: "absorbed",
    focus:
      "Gemelo digital, telemetrÃ­a, capas geoespaciales y lectura territorial.",
    absorbedImprovements: [
      "Matriz de gemelo territorial conectada a mapa y dashboard.",
      "Vocabulario de sensores, saturaciÃ³n, flujos y cuidado patrimonial.",
      "Puente entre decisiones de IA y evidencia geogrÃ¡fica.",
    ],
  },
  {
    id: "rdm-smart-city-os",
    name: "rdm-smart-city-os",
    url: "https://github.com/OsoPanda1/rdm-smart-city-os",
    family: "Smart City",
    status: "orchestrated",
    focus:
      "Paquetes de ciudad inteligente, conectividad, seguridad y operaciÃ³n municipal.",
    absorbedImprovements: [
      "Fases de conectividad soberana y telemetrÃ­a urbana.",
      "Indicadores de operaciÃ³n para pasar de visiÃ³n a ejecuciÃ³n.",
      "Lectura modular compatible con administraciÃ³n pÃºblica y comercios.",
    ],
  },
  {
    id: "rdm-digital-nodo-cero",
    name: "rdm-digital-nodo-cero",
    url: "https://github.com/OsoPanda1/rdm-digital-nodo-cero",
    family: "DocumentaciÃ³n",
    status: "absorbed",
    focus:
      "Nodo Cero soberano, tesis, identidad, protocolos y constituciÃ³n funcional.",
    absorbedImprovements: [
      "Nodo Cero como comando verificable y no solo declaraciÃ³n.",
      "Anclaje de identidad, BookPI, Phoenix 20/30/50 y auditorÃ­a BABAS.",
      "Secuencia de activaciÃ³n para ejecutar el nÃºcleo desde este repo.",
    ],
  },
  {
    id: "tamv-core-atlas",
    name: "tamv-core-atlas",
    url: "https://github.com/OsoPanda1/tamv-core-atlas",
    family: "TAMV",
    status: "reference",
    focus: "Atlas tÃ©cnico TAMV y lenguaje de interoperabilidad federada.",
    absorbedImprovements: [
      "Mapa de capacidades TAMV reutilizable por rutas del portal.",
      "Criterios de madurez por dominio.",
      "SeparaciÃ³n entre visiÃ³n, contrato y ejecuciÃ³n.",
    ],
  },
  {
    id: "tamv-orchestrator",
    name: "tamv-orchestrator",
    url: "https://github.com/OsoPanda1/tamv-orchestrator",
    family: "TAMV",
    status: "orchestrated",
    focus: "OrquestaciÃ³n API, mutaciones, auth y contratos de datos.",
    absorbedImprovements: [
      "Lectura de cada mÃ³dulo como contrato ejecutable.",
      "Foco en esquemas, cliente API y control de estado.",
      "PreparaciÃ³n para trazabilidad entre UI y servicios.",
    ],
  },
  {
    id: "tamv-sovereign-hub",
    name: "tamv-sovereign-hub",
    url: "https://github.com/OsoPanda1/tamv-sovereign-hub",
    family: "TAMV",
    status: "reference",
    focus:
      "Hub soberano con economÃ­a, wallet, universidad, gobernanza y dream spaces.",
    absorbedImprovements: [
      "VisiÃ³n de economÃ­a soberana y universidad digital como capas futuras.",
      "Governance, achievements y marketplace como destinos de expansiÃ³n.",
      "Isabella AI como guardianÃ­a transversal.",
    ],
  },
  {
    id: "documentacion-tamv",
    name: "DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI",
    url: "https://github.com/OsoPanda1/DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI",
    family: "DocumentaciÃ³n",
    status: "absorbed",
    focus: "Corpus maestro de visiÃ³n TAMV DM-X4 e Isabella AI.",
    absorbedImprovements: [
      "Narrativa de metaverso sensorial 4D anclado en Real del Monte.",
      "Lenguaje de autorÃ­a, soberanÃ­a tecnolÃ³gica y orgullo territorial.",
      "Marco conceptual para superar la landing turÃ­stica tradicional.",
    ],
  },
];

export const NODE_ZERO_CAPABILITIES: NodeZeroCapability[] = [
  {
    id: "shell",
    title: "Shell turÃ­stico-comercial soberano",
    signal:
      "Visitante, comercio, cultura y donativo entran por una sola superficie pÃºblica.",
    implementation:
      "Home, rutas, catÃ¡logo, directorio, mapa, eventos y REALITO ya se exponen como producto unificado.",
    routes: ["/", "/rutas", "/catalogo", "/directorio", "/mapa"],
    maturity: 92,
  },
  {
    id: "twin",
    title: "Gemelo territorial operable",
    signal:
      "Sitios, rutas, comercios y riesgo territorial pueden leerse como capas del mismo mapa vivo.",
    implementation:
      "POIs georreferenciados, dashboard, contexto soberano y HUD de seÃ±ales mineras quedan enlazados al Nodo Cero.",
    routes: ["/mapa", "/admin/telemetry", "/sovereign"],
    maturity: 84,
  },
  {
    id: "isabella",
    title: "Isabella / REALITO contextual",
    signal:
      "La IA responde desde memoria cultural, retenciÃ³n turÃ­stica y cuidado del territorio.",
    implementation:
      "Asistente flotante, motor Isabella, corpus RDM y decisiones auditables operan como una capa transversal.",
    routes: ["/tamv", "/tamv/api", "/corpus", "/admin/isabella"],
    maturity: 88,
  },
  {
    id: "commerce",
    title: "EconomÃ­a Phoenix 20/30/50",
    signal:
      "El directorio, tiers comerciales y donativos se conectan a una narrativa econÃ³mica verificable.",
    implementation:
      "Onboarding comercial, tiers, catÃ¡logo y donaciones quedan preparados para contratos Stripe/Supabase.",
    routes: ["/negocios", "/catalogo", "/donar", "/admin/economy"],
    maturity: 79,
  },
  {
    id: "memory",
    title: "Memoria federada auditable",
    signal:
      "Cada mÃ³dulo conserva fuente, contrato, ruta y madurez para evitar dispersiÃ³n entre repos.",
    implementation:
      "Este registro Nodo Cero consolida RDM, TAMV, Smart City y documentaciÃ³n en una bitÃ¡cora navegable.",
    routes: ["/fusion", "/federacion", "/enciclopedia", "/corpus"],
    maturity: 95,
  },
  {
    id: "execution",
    title: "EjecuciÃ³n Nodo Cero",
    signal:
      "La visiÃ³n se convierte en secuencia: absorber, normalizar, exponer, medir y escalar.",
    implementation:
      "El home ahora muestra el panel de ejecuciÃ³n y Fusion dejÃ³ de ser una lista pasiva de repos.",
    routes: ["/fusion", "/admin", "/dashboard"],
    maturity: 90,
  },
];

export const NODE_ZERO_PROTOCOL: NodeZeroProtocolStep[] = [
  {
    id: "investigate",
    title: "Investigar",
    description:
      "Recorrer repositorios RDM/TAMV de OsoPanda1, clasificar familias y detectar capacidades no visibles en este shell.",
    evidence:
      "GitHub API + clones locales de RDM-Digital-X, rdm-digital-nodo-cero, real-del-monte-* y tamv-*.",
  },
  {
    id: "absorb",
    title: "Absorber",
    description:
      "Traer al repo actual la matriz de fusiÃ³n, el lenguaje operativo y la lectura de capacidades por madurez.",
    evidence:
      "NODE_ZERO_REPOS y NODE_ZERO_CAPABILITIES quedan como contrato fuente del panel.",
  },
  {
    id: "unify",
    title: "Unificar",
    description:
      "Conectar turismo, comercio, gemelo digital, Isabella, soberanÃ­a y documentaciÃ³n en rutas existentes.",
    evidence:
      "Cada capacidad lista rutas reales del portal para operar la visiÃ³n desde una sola interfaz.",
  },
  {
    id: "execute",
    title: "Ejecutar Nodo Cero",
    description:
      "Publicar consola visual con estado, avances, comandos de navegaciÃ³n y prÃ³ximos contratos tÃ©cnicos.",
    evidence:
      "NodoCeroCommandCenter se renderiza en home y se reutiliza en Fusion.",
  },
];

export const getNodeZeroCompletion = () => {
  const absorbed = NODE_ZERO_REPOS.filter(
    (repo) => repo.status === "absorbed",
  ).length;
  const weighted = NODE_ZERO_CAPABILITIES.reduce(
    (sum, cap) => sum + cap.maturity,
    0,
  );
  return {
    repos: NODE_ZERO_REPOS.length,
    absorbed,
    orchestrated: NODE_ZERO_REPOS.filter(
      (repo) => repo.status === "orchestrated",
    ).length,
    reference: NODE_ZERO_REPOS.filter((repo) => repo.status === "reference")
      .length,
    maturity: Math.round(weighted / NODE_ZERO_CAPABILITIES.length),
  };
};
