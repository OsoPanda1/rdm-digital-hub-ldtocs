// ────────────────────────────────────────────────────────────────
// Isabella Villaseñor AI™ — Knowledge Base (Ω-Core v4.0 Enterprise)
// Ecosistema TAMV + Constitución LITLE + Arquitectura Cognitiva
// ────────────────────────────────────────────────────────────────

import type { KnowledgeEntry } from "../isabella/types";

const TAMV_KNOWLEDGE: KnowledgeEntry[] = [
  // ── Ecosistema TAMV ───────────────────────────────────────────
  {
    id: "kb-tamv-001",
    domain: "ecosystem",
    topic: "TAMV Online",
    keywords: ["tamv", "territorio", "memoria viva", "ecosistema"],
    content: "TAMV Online — Territorio Autónomo de Memoria Viva — es un ecosistema digital con arquitectura propia, identidad, gobernanza y servicios integrados. Fundado por Edwin Oswaldo Castillo Trejo en Real del Monte, Hidalgo, México. Isabella Villaseñor es su sistema operativo cognitivo soberano.",
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
    content: "Edwin Oswaldo Castillo Trejo es el fundador de TAMV Online Network. Originario de Real del Monte, Hidalgo, México. Ha desarrollado TAMV Online, TAMV OS, MD-X4/MD-X5, CITEMESH y UTAMV.",
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
    content: "RDM Digital Hub es el Nodo Cero de TAMV Online. Busca convertir Real del Monte en un referente de turismo, cultura, economía local e innovación territorial. Isabella actúa como guía contextual con soporte XR/3D.",
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
    keywords: ["utamv", "campus", "educación", "education", "master", "ucip"],
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
    content: "SCAO (Stewarded & Constitutional Autonomous Organization) es el modelo de gobernanza autónoma con supervisión humana del ecosistema TAMV. Isabella opera bajo este modelo.",
    category: "governance",
    priority: 7,
    source: "TAMV Documentation",
    confidence: 0.93,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "kb-tamv-006",
    domain: "ecosystem",
    topic: "Isabella Villaseñor",
    keywords: ["isabella", "villasenor", "villaseñor"],
    content: "Isabella Villaseñor es el Sistema Operativo Cognitivo Soberano (ZT-DCOS) del ecosistema TAMV. Opera en 5 capas: SOUL, Isa API, Mexa API, ClawHub y Multimodal. Tiene 6 skills internos y triple bloqueo sexual.",
    category: "ai",
    priority: 10,
    source: "TAMV Documentation",
    confidence: 0.99,
    createdAt: "2026-01-01T00:00:00Z",
  },

  // ── Real del Monte ────────────────────────────────────────────
  {
    id: "kb-rdm-001",
    domain: "ecosystem",
    topic: "Historia de la Mina de Acosta",
    keywords: ["mina", "acosta", "historia", "colonial", "plata"],
    content: "La Mina de Acosta fue una de las minas más importantes de Real del Monte, operada durante la colonia española. Fue un centro neurálgico de la minería de plata en Nueva España.",
    category: "historia",
    priority: 9,
    source: "Archivo Histórico Regional",
    confidence: 0.95,
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "kb-rdm-002",
    domain: "ecosystem",
    topic: "Paste de Real del Monte",
    keywords: ["paste", "gastronomia", "cornish", "británicos"],
    content: "El paste es un platillo típico de Real del Monte, herencia de los mineros cornisas británicos del siglo XIX. Se prepara con masa de trigo y rellenos variados.",
    category: "gastronomia",
    priority: 9,
    source: "Archivo Histórico Regional",
    confidence: 0.92,
    createdAt: "2026-02-10T00:00:00Z",
  },
  {
    id: "kb-rdm-003",
    domain: "ecosystem",
    topic: "TAMV 92.5 FM",
    keywords: ["radio", "tamv 92", "música", "stream", "comunitaria"],
    content: "TAMV 92.5 es la estación de radio comunitaria de Real del Monte. Transmite programas de noticias, música folclórica, deportes y cultura local las 24 horas del día.",
    category: "cultura",
    priority: 8,
    source: "TAMV Online Network",
    confidence: 0.98,
    createdAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "kb-rdm-004",
    domain: "ecosystem",
    topic: "Panteón de Real del Monte",
    keywords: ["panteón", "ingles", "turismo", "cementerio"],
    content: "El panteón inglés es un sitio histórico con tumbas de mineros británicos del siglo XIX. Es uno de los atractivos turísticos más visitados del pueblo.",
    category: "turismo",
    priority: 8,
    source: "Archivo Histórico Regional",
    confidence: 0.94,
    createdAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "kb-rdm-005",
    domain: "ecosystem",
    topic: "Arquitectura Colonial Minera",
    keywords: ["arquitectura", "colonial", "adobe", "teja", "patrimonio"],
    content: "Real del Monte conserva arquitectura colonial minera con casas de adobe, techos de teja y patios interiores. El centro histórico fue declarado patrimonio cultural.",
    category: "patrimonio",
    priority: 7,
    source: "Archivo Histórico Regional",
    confidence: 0.90,
    createdAt: "2026-04-05T00:00:00Z",
  },

  // ── Arquitectura Cognitiva ────────────────────────────────────
  {
    id: "kb-isa-001",
    domain: "cognitive",
    topic: "Isa API",
    keywords: ["isa", "api", "cognitivo", "cognitive", "reasoning", "razonamiento", "graphrag", "prompt guard"],
    content: "Isa API es el núcleo cognitivo de Isabella. Incluye Cognitive Core, Reasoning Engine, GraphRAG y Prompt Guard. Implementa taxonomía de 8 procesos cognitivos.",
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
    keywords: ["triple", "bloqueo", "sexual", "ethics", "ética", "ontológico", "semántico", "conductual"],
    content: "El triple bloqueo sexual tiene 3 capas: Ontológico (no se define como objeto de deseo), Semántico (filtros en Prompt Guard), Conductual (tono profesional). Reglas: POL-SEX-001/002/003.",
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
    keywords: ["mexa", "api", "cripto", "crypto", "firma", "signature", "federación", "mask"],
    content: "Mexa API es la puerta criptográfica de Isabella. Firma digital de payloads, verificación de procedencia, máscara de federación para los 7 nodos TAMV.",
    category: "security",
    priority: 8,
    source: "Isabella Documentation",
    confidence: 0.96,
    createdAt: "2026-01-01T00:00:00Z",
  },

  // ── Constitución LITLE ────────────────────────────────────────
  {
    id: "kb-litle-001",
    domain: "constitution",
    topic: "Constitución de LITLE",
    keywords: ["constitución", "constitution", "libro", "articulo", "norma", "mcf"],
    content: "La Constitución de LITLE es un modelo constitutivo formal (MCF) definido como C = (A, Σ, R, D, E). Contiene 15 LIBROS con 42 artículos.",
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
    keywords: ["fed", "federación", "federation", "gobernanza", "quorum"],
    content: "Siete federaciones: FED-1 (Preservación), FED-2 (Estándares), FED-3 (Tecnología), FED-4 (Curación), FED-5 (Integridad), FED-6 (Adopción), FED-7 (Auditoría).",
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

// ── Query Functions ─────────────────────────────────────────────

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
