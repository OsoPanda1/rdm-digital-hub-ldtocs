/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella VillaseÃ±or AIâ„¢ â€” Knowledge Base (Î©-Core v4.0 Enterprise)
// Ecosistema TAMV + ConstituciÃ³n LITLE + Arquitectura Cognitiva
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { KnowledgeEntry } from "../isabella/types";

const TAMV_KNOWLEDGE: KnowledgeEntry[] = [
  // â”€â”€ Ecosistema TAMV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "kb-tamv-001",
    domain: "ecosystem",
    topic: "TAMV Online",
    keywords: ["tamv", "territorio", "memoria viva", "ecosistema"],
    content: "TAMV Online â€” Territorio AutÃ³nomo de Memoria Viva â€” es un ecosistema digital con arquitectura propia, identidad, gobernanza y servicios integrados. Fundado por Edwin Oswaldo Castillo Trejo en Real del Monte, Hidalgo, MÃ©xico. Isabella VillaseÃ±or es su sistema operativo cognitivo soberano.",
    category: "ecosystem",
    priority: 10,
    source: "TAMV Documentation",
    confidence: 0.98,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "kb-tamv-002",
    domain: "ecosystem",
    topic: "Fundador",
    keywords: ["edwin", "castillo", "trejo", "fundador", "founder"],
    content: "Edwin Oswaldo Castillo Trejo es el fundador de TAMV Online Network. Originario de Real del Monte, Hidalgo, MÃ©xico. Ha desarrollado TAMV Online, TAMV OS, MD-X4/MD-X5, CITEMESH y UTAMV.",
    category: "ecosystem",
    priority: 8,
    source: "TAMV Documentation",
    confidence: 0.95,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "kb-tamv-003",
    domain: "ecosystem",
    topic: "RDM Digital Hub",
    keywords: ["rdm", "real del monte", "digital hub", "nodo cero"],
    content: "RDM Digital Hub es el Nodo Cero de TAMV Online. Busca convertir Real del Monte en un referente de turismo, cultura, economÃ­a local e innovaciÃ³n territorial. Isabella actÃºa como guÃ­a contextual con soporte XR/3D.",
    category: "ecosystem",
    priority: 9,
    source: "TAMV Documentation",
    confidence: 0.97,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "kb-tamv-004",
    domain: "ecosystem",
    topic: "UTAMV Campus Online",
    keywords: ["utamv", "campus", "educaciÃ³n", "education", "master", "ucip"],
    content: "UTAMV Campus Online es la iniciativa educativa del ecosistema TAMV. La UCIP orquesta los engines de Isabella para producir experiencias educativas adaptativas. Programas: Master Community Managers NextGen 2026 (150h).",
    category: "education",
    priority: 8,
    source: "TAMV Documentation",
    confidence: 0.94,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "kb-tamv-005",
    domain: "ecosystem",
    topic: "SCAO Model",
    keywords: ["scao", "stewarded", "constitutional", "autonomous", "organization"],
    content: "SCAO (Stewarded & Constitutional Autonomous Organization) es el modelo de gobernanza autÃ³noma con supervisiÃ³n humana del ecosistema TAMV. Isabella opera bajo este modelo.",
    category: "governance",
    priority: 7,
    source: "TAMV Documentation",
    confidence: 0.93,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "kb-tamv-006",
    domain: "ecosystem",
    topic: "Isabella VillaseÃ±or",
    keywords: ["isabella", "villasenor", "villaseÃ±or"],
    content: "Isabella VillaseÃ±or es el Sistema Operativo Cognitivo Soberano (ZT-DCOS) del ecosistema TAMV. Opera en 5 capas: SOUL, Isa API, Mexa API, ClawHub y Multimodal. Tiene 6 skills internos y triple bloqueo sexual.",
    category: "ai",
    priority: 10,
    source: "TAMV Documentation",
    confidence: 0.99,
    createdAt: "2026-01-01T00:00:00Z",
  },

  // â”€â”€ Real del Monte â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "kb-rdm-001",
    domain: "ecosystem",
    topic: "Historia de la Mina de Acosta",
    keywords: ["mina", "acosta", "historia", "colonial", "plata"],
    content: "La Mina de Acosta fue una de las minas mÃ¡s importantes de Real del Monte, operada durante la colonia espaÃ±ola. Fue un centro neurÃ¡lgico de la minerÃ­a de plata en Nueva EspaÃ±a.",
    category: "historia",
    priority: 9,
    source: "Archivo HistÃ³rico Regional",
    confidence: 0.95,
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "kb-rdm-002",
    domain: "ecosystem",
    topic: "Paste de Real del Monte",
    keywords: ["paste", "gastronomia", "cornish", "britÃ¡nicos"],
    content: "El paste es un platillo tÃ­pico de Real del Monte, herencia de los mineros cornisas britÃ¡nicos del siglo XIX. Se prepara con masa de trigo y rellenos variados.",
    category: "gastronomia",
    priority: 9,
    source: "Archivo HistÃ³rico Regional",
    confidence: 0.92,
    createdAt: "2026-02-10T00:00:00Z",
  },
  {
    id: "kb-rdm-003",
    domain: "ecosystem",
    topic: "TAMV 92.5 FM",
    keywords: ["radio", "tamv 92", "mÃºsica", "stream", "comunitaria"],
    content: "TAMV 92.5 es la estaciÃ³n de radio comunitaria de Real del Monte. Transmite programas de noticias, mÃºsica folclÃ³rica, deportes y cultura local las 24 horas del dÃ­a.",
    category: "cultura",
    priority: 8,
    source: "TAMV Online Network",
    confidence: 0.98,
    createdAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "kb-rdm-004",
    domain: "ecosystem",
    topic: "PanteÃ³n de Real del Monte",
    keywords: ["panteÃ³n", "ingles", "turismo", "cementerio"],
    content: "El panteÃ³n inglÃ©s es un sitio histÃ³rico con tumbas de mineros britÃ¡nicos del siglo XIX. Es uno de los atractivos turÃ­sticos mÃ¡s visitados del pueblo.",
    category: "turismo",
    priority: 8,
    source: "Archivo HistÃ³rico Regional",
    confidence: 0.94,
    createdAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "kb-rdm-005",
    domain: "ecosystem",
    topic: "Arquitectura Colonial Minera",
    keywords: ["arquitectura", "colonial", "adobe", "teja", "patrimonio"],
    content: "Real del Monte conserva arquitectura colonial minera con casas de adobe, techos de teja y patios interiores. El centro histÃ³rico fue declarado patrimonio cultural.",
    category: "patrimonio",
    priority: 7,
    source: "Archivo HistÃ³rico Regional",
    confidence: 0.90,
    createdAt: "2026-04-05T00:00:00Z",
  },

  // â”€â”€ Arquitectura Cognitiva â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "kb-isa-001",
    domain: "cognitive",
    topic: "Isa API",
    keywords: ["isa", "api", "cognitivo", "cognitive", "reasoning", "razonamiento", "graphrag", "prompt guard"],
    content: "Isa API es el nÃºcleo cognitivo de Isabella. Incluye Cognitive Core, Reasoning Engine, GraphRAG y Prompt Guard. Implementa taxonomÃ­a de 8 procesos cognitivos.",
    category: "ai",
    priority: 9,
    source: "Isabella Documentation",
    confidence: 0.97,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "kb-isa-002",
    domain: "cognitive",
    topic: "Triple Bloqueo Sexual",
    keywords: ["triple", "bloqueo", "sexual", "ethics", "Ã©tica", "ontolÃ³gico", "semÃ¡ntico", "conductual"],
    content: "El triple bloqueo sexual tiene 3 capas: OntolÃ³gico (no se define como objeto de deseo), SemÃ¡ntico (filtros en Prompt Guard), Conductual (tono profesional). Reglas: POL-SEX-001/002/003.",
    category: "ethics",
    priority: 10,
    source: "Isabella Documentation",
    confidence: 0.99,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "kb-mexa-001",
    domain: "cryptographic",
    topic: "Mexa API",
    keywords: ["mexa", "api", "cripto", "crypto", "firma", "signature", "federaciÃ³n", "mask"],
    content: "Mexa API es la puerta criptogrÃ¡fica de Isabella. Firma digital de payloads, verificaciÃ³n de procedencia, mÃ¡scara de federaciÃ³n para los 7 nodos TAMV.",
    category: "security",
    priority: 8,
    source: "Isabella Documentation",
    confidence: 0.96,
    createdAt: "2026-01-01T00:00:00Z",
  },

  // â”€â”€ ConstituciÃ³n LITLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "kb-litle-001",
    domain: "constitution",
    topic: "ConstituciÃ³n de LITLE",
    keywords: ["constituciÃ³n", "constitution", "libro", "articulo", "norma", "mcf"],
    content: "La ConstituciÃ³n de LITLE es un modelo constitutivo formal (MCF) definido como C = (A, Î£, R, D, E). Contiene 15 LIBROS con 42 artÃ­culos.",
    category: "governance",
    priority: 10,
    source: "LITLE Documentation",
    confidence: 0.95,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "kb-litle-002",
    domain: "constitution",
    topic: "Siete Federaciones",
    keywords: ["fed", "federaciÃ³n", "federation", "gobernanza", "quorum"],
    content: "Siete federaciones: FED-1 (PreservaciÃ³n), FED-2 (EstÃ¡ndares), FED-3 (TecnologÃ­a), FED-4 (CuraciÃ³n), FED-5 (Integridad), FED-6 (AdopciÃ³n), FED-7 (AuditorÃ­a).",
    category: "governance",
    priority: 9,
    source: "LITLE Documentation",
    confidence: 0.97,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "kb-litle-003",
    domain: "constitution",
    topic: "Evidence DAG",
    keywords: ["dag", "evidencia", "evidence", "merkle", "inmutable", "immutable"],
    content: "Evidence DAG: Merkle-DAG append-only. Cada nodo: timestamp, tipo, hash del contenido, hash del nodo anterior, firma PQC, metadatos. Root hash anclado en Bitcoin.",
    category: "security",
    priority: 8,
    source: "LITLE Documentation",
    confidence: 0.94,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

// â”€â”€ Query Functions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function buildKnowledgeContext(query: string, maxEntries = 10): string {
  const normalized = query.toLowerCase();
  const scored = TAMV_KNOWLEDGE.map((entry) => ({
    entry,
    score: entry.priority + entry.keywords.filter((kw) => normalized.includes(kw.toLowerCase())).length * 3,
  }));

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, maxEntries).filter((s) => s.score > 0);

  if (top.length === 0) return "";

  return (
    "## Contexto del Ecosistema TAMV / LITLE / Isabella\n\n" +
    top.map((s, i) => `[${i + 1}] ${s.entry.content}`).join("\n\n")
  );
}

export function getAllKnowledge(): KnowledgeEntry[] {
  return TAMV_KNOWLEDGE;
}

export function knowledgeByDomain(domain: string): KnowledgeEntry[] {
  return TAMV_KNOWLEDGE.filter((e) => e.domain === domain);
}

export function searchKnowledge(query: string, limit = 10): KnowledgeEntry[] {
  const normalized = query.toLowerCase();
  return TAMV_KNOWLEDGE
    .filter((e) =>
      e.topic.toLowerCase().includes(normalized) ||
      e.content.toLowerCase().includes(normalized) ||
      e.keywords.some((kw) => kw.includes(normalized))
    )
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}
