/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// RDM FEDERACIONES Â· Las 7 Federaciones Soberanas TAMV
// Portado desde seed canÃ³nico OsoPanda1/rdm-turismodigital Â· 002_rdm_seed.sql
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type FederationId =
  | "educativa"
  | "cultural"
  | "economica"
  | "tecnologica"
  | "salud"
  | "comunicacion"
  | "gubernamental";

export interface Federation {
  id: FederationId;
  name: string;
  motto: string;
  description: string;
  colorHex: string;
  icon: string;
  domain: string;
  modules: string[];
}

export const RDM_FEDERATIONS: Federation[] = [
  {
    id: "educativa",
    name: "FederaciÃ³n Educativa TAMV",
    motto: "El conocimiento como soberanÃ­a",
    description:
      "Universidad Soberana de Real del Monte. CurrÃ­culo descolonizado, pedagogÃ­a minera, formaciÃ³n bilingÃ¼e espaÃ±ol-otomÃ­.",
    colorHex: "#c47d3b",
    icon: "graduation-cap",
    domain: "edu.rdm.tamv",
    modules: ["Universidad Soberana", "CurrÃ­culo Descolonizado", "PedagogÃ­a Minera", "BilingÃ¼e OtomÃ­-EspaÃ±ol"],
  },
  {
    id: "cultural",
    name: "FederaciÃ³n Cultural TAMV",
    motto: "Memoria que no se extrae",
    description:
      "Custodia del patrimonio cornish-mexicano, festivales, archivo oral, lenguas originarias y la memoria del temporal.",
    colorHex: "#8a6d4f",
    icon: "landmark",
    domain: "cul.rdm.tamv",
    modules: ["Archivo Patrimonial", "Festival del Paste", "Lenguas Originarias", "Memoria Temporal"],
  },
  {
    id: "economica",
    name: "FederaciÃ³n EconÃ³mica TAMV",
    motto: "Riqueza local, circulaciÃ³n local",
    description:
      "CrÃ©dito TAMV, comercio federado, comunalidad cooperativa, redistribuciÃ³n soberana, anti-extractivismo.",
    colorHex: "#a87844",
    icon: "coins",
    domain: "eco.rdm.tamv",
    modules: ["CrÃ©dito TAMV", "Comercios Federados", "Cooperativas", "RedistribuciÃ³n"],
  },
  {
    id: "tecnologica",
    name: "FederaciÃ³n TecnolÃ³gica TAMV",
    motto: "CÃ³digo que no coloniza",
    description:
      "Kernel TAMV, Isabella Sentinel, soberanÃ­a algorÃ­tmica, infraestructura propia, edge computing minero.",
    colorHex: "#6b8aa0",
    icon: "cpu",
    domain: "tec.rdm.tamv",
    modules: ["Kernel TAMV", "Isabella Sentinel", "FANN", "Eros AI", "Infra Soberana"],
  },
  {
    id: "salud",
    name: "FederaciÃ³n de Salud TAMV",
    motto: "Cuerpo territorio, territorio cuerpo",
    description:
      "Medicina mestiza cornish-otomÃ­, herbolaria, salud mental comunitaria, telesalud federada.",
    colorHex: "#7d9b7a",
    icon: "heart-pulse",
    domain: "sal.rdm.tamv",
    modules: ["Herbolaria OtomÃ­", "Medicina Mestiza", "Salud Mental", "Telesalud Federada"],
  },
  {
    id: "comunicacion",
    name: "FederaciÃ³n de ComunicaciÃ³n TAMV",
    motto: "La narrativa propia",
    description:
      "Radio del Monte, prensa soberana, contranarrativa, blog Tamvonline Network, broadcast ritual.",
    colorHex: "#9b6b4a",
    icon: "radio",
    domain: "com.rdm.tamv",
    modules: ["Radio del Monte", "Prensa Soberana", "Tamvonline Network", "Broadcast Ritual"],
  },
  {
    id: "gubernamental",
    name: "FederaciÃ³n Gubernamental TAMV",
    motto: "Asamblea, no representaciÃ³n",
    description:
      "Consejo del Nodo Cero, jurisprudencia ritual, asambleas federadas, registro civil soberano.",
    colorHex: "#5e5048",
    icon: "scale",
    domain: "gob.rdm.tamv",
    modules: ["Consejo Nodo Cero", "Jurisprudencia Ritual", "Asambleas", "Registro Civil"],
  },
];
