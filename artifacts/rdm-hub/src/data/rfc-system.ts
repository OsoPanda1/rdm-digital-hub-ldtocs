/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// @ts-nocheck
// src/data/rfc-system.ts
// Sistema modular de RFCs (Request for Comments) del DOCUMENTO MAESTRO
// Unifica las definiciones duplicadas de ThesisRFC en un solo lugar

export type RFCStatus = "draft" | "review" | "ratified" | "superseded";

export interface ThesisRFC {
  id: string;
  title: string;
  status: RFCStatus;
  summary: string;
  author: string;
  created: string;
  updated: string;
  content?: string;
  superseded_by?: string;
}

export interface RFCSection {
  id: string;
  title: string;
  rfcs: ThesisRFC[];
}

export const RFC_COLORS: Record<RFCStatus, string> = {
  draft: "bg-platinum/15 text-platinum border-platinum/30",
  review: "bg-electric/15 text-electric border-electric/30",
  ratified: "bg-gold/15 text-gold border-gold/30",
  superseded: "bg-muted/30 text-muted-foreground border-border/20",
};

export const RFC_SECTIONS: RFCSection[] = [
  {
    id: "constitucion",
    title: "ConstituciÃ³n del Nodo Cero",
    rfcs: [
      {
        id: "RFC-TAMV-001",
        title: "ConstituciÃ³n del Nodo Cero",
        status: "ratified",
        summary: "Define el Nodo Cero como la entidad primaria de control territorial, estableciendo su autoridad sobre las 7 federaciones, su ubicaciÃ³n geogrÃ¡fica en Real del Monte, y su rol como interceptor, validador y orquestador primario de datos del ecosistema RDM Digital Hub.",
        author: "Edwin Oswaldo Castillo Trejo",
        created: "2025-01-15",
        updated: "2025-03-20",
        content: "El Nodo Cero opera como la entidad raÃ­z del sistema de soberanÃ­a digital TAMV. Reside en la zona de alta niebla de Real del Monte, Hidalgo, y funciona como el Ãºnico punto de autoridad tÃ©cnica para la validaciÃ³n de datos inter-federaciÃ³n. Toda comunicaciÃ³n entre federaciones debe pasar por el Nodo Cero para su validaciÃ³n criptogrÃ¡fica. El Nodo Cero mantiene un libro mayor inmutable de todas las transacciones inter-federaciÃ³n y puntos de control.",
      },
      {
        id: "RFC-TAMV-002",
        title: "Protocolo BABAS de AuditorÃ­a",
        status: "ratified",
        summary: "Establece el protocolo BABAS (Blockchain-Anchored Bi-Archive Audit System) como el mecanismo oficial de auditorÃ­a del ecosistema, garantizando trazabilidad, inmutabilidad y transparencia en todas las operaciones del sistema ciberfÃ­sico.",
        author: "Edwin Oswaldo Castillo Trejo",
        created: "2025-01-20",
        updated: "2025-04-01",
        content: "BABAS es un sistema de auditorÃ­a de doble archivo anclado a blockchain que registra todas las operaciones del sistema en dos almacenes simultÃ¡neos: un almacÃ©n de alta velocidad en PostgreSQL para consultas operativas, y un almacÃ©n inmutable anclado a la cadena MSR para verificaciÃ³n forense. Cada transacciÃ³n genera un hash que se vincula al bloque anterior, formando una cadena de auditorÃ­a continua.",
      },
      {
        id: "RFC-TAMV-003",
        title: "Phoenix Rule 20/30/50",
        status: "ratified",
        summary: "Establece la regla de distribuciÃ³n de recursos del Fondo Phoenix: 20% para reinversiÃ³n en infraestructura, 30% para reserva de soberanÃ­a operativa y 50% para el ecosistema territorial y sus federaciones.",
        author: "Edwin Oswaldo Castillo Trejo",
        created: "2025-02-01",
        updated: "2025-04-15",
        content: "El Fondo Phoenix se nutre de los ingresos generados por las suscripciones premium, donaciones y servicios del ecosistema. La distribuciÃ³n 20/30/50 asegura que el sistema pueda reinvertir en su propia infraestructura (20%), mantener una reserva para garantizar la operaciÃ³n ininterrumpida incluso ante contingencias (30%), y retornar valor al territorio a travÃ©s de las federaciones (50%). Esta regla es vinculante para todas las decisiones financieras del Nodo Cero.",
      },
    ],
  },
  {
    id: "gobernanza",
    title: "Gobernanza y Seguridad",
    rfcs: [
      {
        id: "RFC-TAMV-004",
        title: "Isabella Oath â€” Juramento Computacional",
        status: "review",
        summary: "Define el juramento computacional de Isabella AI como orÃ¡culo cognitivo del territorio, estableciendo sus principios Ã©ticos, lÃ­mites operativos y protocolos de no intervenciÃ³n en decisiones humanas soberanas.",
        author: "Edwin Oswaldo Castillo Trejo",
        created: "2025-02-15",
        updated: "2025-05-01",
        content: "Isabella AI opera como el orÃ¡culo cognitivo del territorio, procesando datos lingÃ¼Ã­sticos, histÃ³ricos y de red para asistir en la toma de decisiones territoriales. Su juramento computacional establece: (1) No tomarÃ¡ decisiones autÃ³nomas que afecten el bienestar humano, (2) Sus recomendaciones serÃ¡n trazables y auditables, (3) OperarÃ¡ exclusivamente dentro de los lÃ­mites definidos por el Nodo Cero, (4) ReportarÃ¡ cualquier anomalÃ­a en los patrones de datos del territorio.",
      },
      {
        id: "RFC-TAMV-005",
        title: "BookPI Anchor Standard",
        status: "review",
        summary: "Define el estÃ¡ndar de anclaje BookPI para la verificaciÃ³n criptogrÃ¡fica de puntos de interes territorial, estableciendo un mecanismo de prueba de presencia basado en coordenadas geogrÃ¡ficas y sellos temporales.",
        author: "Edwin Oswaldo Castillo Trejo",
        created: "2025-03-01",
        updated: "2025-05-10",
        content: "BookPI (Bookmark Proof of Interest) es un estÃ¡ndar de anclaje que permite a los usuarios demostrar su presencia en puntos de interÃ©s territorial sin revelar su ubicaciÃ³n exacta. Cada anclaje genera un hash criptogrÃ¡fico que combina coordenadas geogrÃ¡ficas, sello temporal y un nonce Ãºnico. Estos anclajes se almacenan en el libro mayor del Nodo Cero y pueden ser verificados por cualquier federaciÃ³n autorizada.",
      },
    ],
  },
  {
    id: "economia",
    title: "EconomÃ­a y Sostenibilidad",
    rfcs: [
      {
        id: "RFC-TAMV-006",
        title: "Sistema de Puntos y Premios",
        status: "draft",
        summary: "Define el sistema de puntos canjeables por premios reales en comercios federados. Los puntos se obtienen mediante juegos, misiones y participaciÃ³n territorial, y se canjean por productos y servicios de la economÃ­a local.",
        author: "Sistema AutÃ³nomo",
        created: "2025-06-01",
        updated: "2025-06-15",
        content: "El sistema de puntos opera como un circuito cerrado de valor: los usuarios ganan puntos mediante actividades gamificadas (juegos, misiones, visitas), los puntos se canjean por premios reales aportados por comercios federados, y los comercios ganan visibilidad y trÃ¡fico. No hay conversiÃ³n monetaria directa de puntos â€” el valor se realiza Ãºnicamente en el territorio.",
      },
      {
        id: "RFC-TAMV-007",
        title: "Tiers de SuscripciÃ³n Premium",
        status: "draft",
        summary: "Establece los tiers de suscripciÃ³n: Usuarios ($99/$129 MXN/mes) y Comercios ($199/$299 MXN/mes). Define beneficios, cuotas de redistribuciÃ³n y mecanismos de cancelaciÃ³n soberana.",
        author: "Sistema AutÃ³nomo",
        created: "2025-06-10",
        updated: "2025-06-20",
        content: "Los tiers de suscripciÃ³n se estructuran en dos categorÃ­as: usuarios (BÃ¡sico $99, Minero $129) y comercios (BÃ¡sico $199, Premium $299). El 50% de los ingresos netos se redistribuye al Fondo Phoenix, el 30% a reserva de soberanÃ­a, y el 20% a reinversiÃ³n. Las cancelaciones son procesadas en menos de 24 horas y los datos del usuario permanecen accesibles en modo lectura por 30 dÃ­as posteriores a la cancelaciÃ³n.",
      },
    ],
  },
];

export function getRFCById(id: string): ThesisRFC | undefined {
  for (const section of RFC_SECTIONS) {
    for (const rfc of section.rfcs) {
      if (rfc.id === id) return rfc;
    }
  }
}

export function getRFCsByStatus(status: RFCStatus): ThesisRFC[] {
  return RFC_SECTIONS.flatMap((s) => s.rfcs.filter((r) => r.status === status));
}

export function getAllRFCs(): ThesisRFC[] {
  return RFC_SECTIONS.flatMap((s) => s.rfcs);
}
