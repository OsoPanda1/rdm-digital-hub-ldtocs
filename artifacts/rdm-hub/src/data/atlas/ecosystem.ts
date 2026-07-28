/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// src/data/ecosystem.ts
// DocumentaciÃ³n operacional del ecosistema TAMV / RDM Digital.
// Sintetiza el modelo Heptafederado MD-X4 (7 federaciones + 8 capas L0â€“L7),
// fusionado a partir de la documentaciÃ³n canÃ³nica (Wiki + TAMV OS v2026).

export interface Federation {
  id: string;
  nombre: string;
  dominio: string;
  proposito: string;
  modulos: string[];
}

export const federations: Federation[] = [
  {
    id: "fed-tecnologica",
    nombre: "TecnolÃ³gica",
    dominio: "Kernel, IA, sistemas, Nexus",
    proposito: "Sostener el nÃºcleo operativo, las pasarelas de datos y la observabilidad.",
    modulos: ["MD-X4 Kernel", "DM-X7 Gateway", "Isabella Core", "OTel / ECG"],
  },
  {
    id: "fed-cultural",
    nombre: "Cultural",
    dominio: "DocumentaciÃ³n, manuscritos, tomos, gÃ©nesis, wiki",
    proposito: "Custodiar la memoria viva del territorio y su narrativa pÃºblica.",
    modulos: ["BookPI", "Archivo HistÃ³rico", "Wiki Nodo Cero", "Tomos LTOS"],
  },
  {
    id: "fed-gubernamental",
    nombre: "Gubernamental",
    dominio: "Protocolos, canon, legal, federaciÃ³n",
    proposito: "Gobernanza HITL: protocolos EOCT, auditorÃ­a y reglas inter-nodo.",
    modulos: ["EOCT", "Canon Legal", "Guardian Console", "FederaciÃ³n Viva"],
  },
  {
    id: "fed-economica",
    nombre: "EconÃ³mica",
    dominio: "Mercado, comercio, wallets, pagos, fondos Phoenix",
    proposito: "Dinamizar el comercio local respetando soberanÃ­a financiera.",
    modulos: ["Cattleya Pay", "MSR", "Stripe MXN", "Reparto 20/30/50"],
  },
  {
    id: "fed-educativa",
    nombre: "Educativa",
    dominio: "Academia, cursos, UTAMV, pedagogÃ­a",
    proposito: "Formar guardianes, mediadores y narradores del territorio.",
    modulos: ["UTAMV", "Academia LTOS", "Talleres locales"],
  },
  {
    id: "fed-salud",
    nombre: "Salud",
    dominio: "ClÃ­nica, telemedicina, servicios sanitarios",
    proposito: "Capa de servicios cÃ­vicos esenciales en el nodo territorial.",
    modulos: ["ClÃ­nica RDM", "Telemedicina TAMV"],
  },
  {
    id: "fed-comunicacion",
    nombre: "ComunicaciÃ³n",
    dominio: "Radio, prensa, medios y relato pÃºblico",
    proposito: "Mantener un canal soberano de informaciÃ³n local y federada.",
    modulos: ["Radio Nodo Cero", "Prensa Federada", "Realito Voz"],
  },
];

export interface Layer {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export const layers: Layer[] = [
  { id: "l0", codigo: "L0", nombre: "Infraestructura fÃ­sica / Territorio", descripcion: "Nodos locales, conectividad, hardware soberano." },
  { id: "l1", codigo: "L1", nombre: "Memoria / Registro", descripcion: "MSR, ledger SQL, Cattleya Pay, BookPI." },
  { id: "l2", codigo: "L2", nombre: "Protocolos controlados", descripcion: "EOCT, motor de protocolos, decisiones auditables." },
  { id: "l3", codigo: "L3", nombre: "GuardianÃ­a / Observabilidad", descripcion: "Consolas de guardianes, paneles ECG, monitoreo." },
  { id: "l4", codigo: "L4", nombre: "XR / Visual / Gemelos", descripcion: "Mapas 3D, Real del Monte Twin, Atlas territorial." },
  { id: "l5", codigo: "L5", nombre: "Servicios de dominio", descripcion: "ID-NVIDA, turismo, economÃ­a, comercio." },
  { id: "l6", codigo: "L6", nombre: "UX / Shell", descripcion: "Portales para turistas, paneles para comercio." },
  { id: "l7", codigo: "L7", nombre: "Civilizacional / MetacivilizaciÃ³n", descripcion: "Legado, narrativa, ecosistema de 100+ repos federados." },
];

export interface EcosystemNode {
  id: string;
  nombre: string;
  rol: string;
  descripcion: string;
}

export const ecosystemNodes: EcosystemNode[] = [
  { id: "rdm-os", nombre: "RDM Digital OS", rol: "NÃºcleo operativo", descripcion: "Smart City OS del Nodo Cero." },
  { id: "rdm-nexus", nombre: "RDM Digital Nexus (RDMÂ·X)", rol: "Narrativa", descripcion: "Hub de turismo digital y narrativa civilizatoria." },
  { id: "rdm-2026", nombre: "RDM Digital 2026", rol: "Portal unificado", descripcion: "RDM + Wiki TAMV en una sola superficie pÃºblica." },
  { id: "rdm-turismo", nombre: "RDM Turismo Digital", rol: "Front cÃ­vico", descripcion: "Front turÃ­stico con Edge Functions soberanas." },
  { id: "rdm-atlas", nombre: "Real del Monte Atlas", rol: "CartografÃ­a", descripcion: "Mapa vivo y cartografÃ­a colectiva." },
  { id: "rdm-twin", nombre: "Real del Monte Twin", rol: "Gemelo digital", descripcion: "Gemelo digital 4D del territorio." },
];

export interface Principio {
  numero: number;
  titulo: string;
  cuerpo: string;
}

export const principiosLTOS: Principio[] = [
  { numero: 1, titulo: "Territorio como interfaz", cuerpo: "La unidad de diseÃ±o es el territorio, sus rutas, capas y relaciones." },
  { numero: 2, titulo: "Relaciones sobre contenido", cuerpo: "Prima la red de vÃ­nculos (minaâ€“eventoâ€“persona) sobre pÃ¡ginas sueltas." },
  { numero: 3, titulo: "Evidencia antes de narrativa", cuerpo: "Cada afirmaciÃ³n se ancla a registros verificables (DOI, ORCID, MSR, BookPI)." },
  { numero: 4, titulo: "Inteligencia contextual", cuerpo: "El sistema interpreta tiempo, lugar e historia, no sÃ³lo preguntas." },
  { numero: 5, titulo: "FederaciÃ³n", cuerpo: "El modelo estÃ¡ diseÃ±ado para que otros territorios se sumen bajo el mismo protocolo." },
];
