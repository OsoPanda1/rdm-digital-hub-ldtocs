/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// Base de datos de citas y constelaciones del ecosistema TAMV.
// Constelaciones: Anubis (guardianÃ­a), Horus (visiÃ³n/observabilidad), Dekateotl (memoria/territorio).

export type Constelacion = "anubis" | "horus" | "dekateotl" | "isabella" | "realito";

export interface Cita {
  id: string;
  texto: string;
  autor: string;
  fuente?: string;
  anio: number;
  constelacion: Constelacion;
  etiquetas: string[];
}

export const CONSTELACIONES: Record<Constelacion, { nombre: string; icono: string; color: string; descripcion: string }> = {
  anubis: { nombre: "Anubis", icono: "ðŸœ", color: "rdm-amber", descripcion: "GuardianÃ­a, juicio justo, custodia del umbral digital." },
  horus: { nombre: "Horus", icono: "ð“‚€", color: "rdm-amber", descripcion: "VisiÃ³n panÃ³ptica Ã©tica, observabilidad sin vigilancia." },
  dekateotl: { nombre: "Dekateotl", icono: "ðŸª¶", color: "rdm-amber", descripcion: "Memoria mexica, raÃ­z territorial, voz del pueblo." },
  isabella: { nombre: "Isabella", icono: "ðŸŒ¹", color: "rdm-amber", descripcion: "IA guardiana del ecosistema TAMV." },
  realito: { nombre: "REALITO", icono: "â›ï¸", color: "rdm-amber", descripcion: "Voz operativa de RDM Digital, anfitriÃ³n cultural." },
};

export const CITAS: Cita[] = [
  { id: "c1", texto: "En LATAM no innovamos por permiso â€” innovamos por necesidad.", autor: "Anubis VillaseÃ±or", fuente: "Manifiesto TAMV 2025", anio: 2025, constelacion: "anubis", etiquetas: ["soberanÃ­a", "latam", "manifiesto"] },
  { id: "c2", texto: "Desde un pueblito en MÃ©xico, una mente humana teje la primera infraestructura digital pensada para la dignidad.", autor: "Anubis VillaseÃ±or", fuente: "Proclama Nodo Cero", anio: 2026, constelacion: "anubis", etiquetas: ["dignidad", "rdm", "infraestructura"] },
  { id: "c3", texto: "La tecnologÃ­a existe para proteger, cuidar y conectar â€” no para manipular.", autor: "Manifiesto TAMV", anio: 2025, constelacion: "isabella", etiquetas: ["humanismo", "Ã©tica"] },
  { id: "c4", texto: "Cada nodo preserva la voz, los dichos y la historia de su pueblo dentro de la red federada.", autor: "CÃ³dice Maestro DM-X4", anio: 2025, constelacion: "dekateotl", etiquetas: ["memoria", "territorio", "federaciÃ³n"] },
  { id: "c5", texto: "Observabilidad sÃ­, vigilancia nunca. La diferencia es la dignidad humana.", autor: "Doctrina MD-X4", anio: 2025, constelacion: "horus", etiquetas: ["observabilidad", "Ã©tica", "kernel"] },
  { id: "c6", texto: "Identidad propia, datos propios, infraestructura propia.", autor: "Pilar I â€” SoberanÃ­a Digital", anio: 2025, constelacion: "anubis", etiquetas: ["soberanÃ­a", "id-nvida"] },
  { id: "c7", texto: "21,600 horas de una sola mente humana son una infraestructura.", autor: "TelemetrÃ­a Nodo Cero", anio: 2026, constelacion: "horus", etiquetas: ["telemetrÃ­a", "rdm"] },
  { id: "c8", texto: "Real del Monte no es un decorado: es el primer territorio del Sistema Operativo Civilizatorio.", autor: "REALITO AI", anio: 2026, constelacion: "realito", etiquetas: ["rdm", "territorio"] },
  { id: "c9", texto: "Los dichos del pueblo son el cÃ³digo fuente de su memoria.", autor: "Dekateotl Â· CÃ³dice", anio: 2025, constelacion: "dekateotl", etiquetas: ["dichos", "memoria", "cultura"] },
  { id: "c10", texto: "Defensa antes que vigilancia. AcompaÃ±ar antes que extraer.", autor: "Isabella VillaseÃ±or AI", anio: 2026, constelacion: "isabella", etiquetas: ["Ã©tica", "defensa"] },
  { id: "c11", texto: "El kernel cuÃ¡ntico-emocional no es metÃ¡fora: es ingenierÃ­a de cuidado.", autor: "Edwin Castillo Trejo", fuente: "MD-X4 Whitepaper", anio: 2025, constelacion: "horus", etiquetas: ["kernel", "md-x4"] },
  { id: "c12", texto: "Una IA que no sabe de dÃ³nde viene su gente, no deberÃ­a hablar por ella.", autor: "Anubis VillaseÃ±or", anio: 2026, constelacion: "anubis", etiquetas: ["ia", "territorio", "Ã©tica"] },
  { id: "c13", texto: "Korima: economÃ­a del don, no de la extracciÃ³n.", autor: "Doctrina EconÃ³mica TAMV", anio: 2025, constelacion: "dekateotl", etiquetas: ["korima", "economÃ­a"] },
  { id: "c14", texto: "CITEMESH es la malla donde el saber se cita a sÃ­ mismo sin pedir permiso.", autor: "CÃ³dice CITEMESH", anio: 2026, constelacion: "horus", etiquetas: ["citemesh", "ciencia"] },
  { id: "c15", texto: "PastÃ© caliente, mina viva, mente despierta.", autor: "REALITO AI", anio: 2026, constelacion: "realito", etiquetas: ["rdm", "cultura", "pastes"] },
  { id: "c16", texto: "El Pueblo MÃ¡gico tambiÃ©n es un Pueblo Digital.", autor: "RDM Digital Â· Nodo Cero", anio: 2026, constelacion: "realito", etiquetas: ["rdm", "pueblo-mÃ¡gico"] },
  { id: "c17", texto: "Resistir 5 anios sin recursos es la primera capa del kernel.", autor: "Anubis VillaseÃ±or", anio: 2025, constelacion: "anubis", etiquetas: ["resistencia", "manifiesto"] },
  { id: "c18", texto: "La periferia diseÃ±a sistemas operativos cuando el centro deja de escuchar.", autor: "Manifiesto Nueva Era", anio: 2025, constelacion: "anubis", etiquetas: ["periferia", "soberanÃ­a"] },
  { id: "c19", texto: "Un guardiÃ¡n digital no controla: acompaÃ±a.", autor: "Isabella AI", anio: 2026, constelacion: "isabella", etiquetas: ["guardianÃ­a", "Ã©tica"] },
  { id: "c20", texto: "AntifrÃ¡gil significa que el caos te hace mÃ¡s fuerte, no mÃ¡s frÃ¡gil.", autor: "Pilar V â€” MD-X4", anio: 2025, constelacion: "horus", etiquetas: ["antifragilidad", "kernel"] },
  { id: "c21", texto: "A Reina Trejo Serrano â€” gracias por nunca rendirte.", autor: "Edwin Castillo Trejo", fuente: "Dedicatoria oficial", anio: 2026, constelacion: "dekateotl", etiquetas: ["dedicatoria", "memoria"] },
  { id: "c22", texto: "Ciencia abierta o no es ciencia: es propiedad privada disfrazada.", autor: "Pilar VI â€” Apertura", anio: 2025, constelacion: "horus", etiquetas: ["ciencia-abierta", "doi"] },
  { id: "c23", texto: "Cada repositorio pÃºblico es una declaraciÃ³n polÃ­tica.", autor: "OsoPanda1", fuente: "GitHub Manifest", anio: 2024, constelacion: "anubis", etiquetas: ["github", "open-source"] },
  { id: "c24", texto: "Tenochtitlan no terminÃ³: se digitalizÃ³.", autor: "NÃºcleo SimbÃ³lico Mexica", anio: 2026, constelacion: "dekateotl", etiquetas: ["mexica", "simbolismo"] },
];

export const TODAS_ETIQUETAS = Array.from(new Set(CITAS.flatMap((c) => c.etiquetas))).sort();
