/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// Mirror data of /api/tenochtitlan so the dashboard renders without a live backend.

export interface SentinelMirror {
  id: string;
  glyph: string;
  name: string;
  mission: string;
  powers: string[];
  status: "online" | "degraded" | "offline" | "alert";
  load: number;
}

export interface RadarMirror {
  id: string;
  codename: string;
  scope: string;
  detections: number;
  anomalies: number;
  coverage: number;
}

export interface NodeMirror {
  index: number;
  code: string;
  name: string;
  cluster: string;
  health: number;
  description: string;
}

export const SENTINELS_MIRROR: SentinelMirror[] = [
  { id: "anubis", glyph: "ð“¢", name: "Anubis Sentinel System", mission: "Gatekeeper de identidad soberana ID-NVIDA. Custodia accesos, sella DIDs y protege la dignidad ciudadana.", powers: ["LOGICAL", "EXECUTIVE", "OBSERVER"], status: "online", load: 64 },
  { id: "horus", glyph: "ð“…ƒ", name: "Horus Sentinel System", mission: "Vigilancia perimetral aÃ©rea: telemetrÃ­a territorial, antifraude geoespacial, comercios verificados.", powers: ["OBSERVER", "EXECUTIVE"], status: "online", load: 58 },
  { id: "dekateotl", glyph: "âœ¶", name: "Dekateotl Ethics Engine", mission: "Tribunal Ã©tico del kernel: audita cada decisiÃ³n IA con SHA-256 y bloquea acciones contra la ConstituciÃ³n TAMV.", powers: ["LOGICAL", "HUMAN"], status: "online", load: 72 },
  { id: "aztek-gods", glyph: "â˜¼", name: "Aztek Gods Cluster", mission: "PanteÃ³n de microservicios soberanos: QuetzalcÃ³atl-net, TlÃ¡loc-stream, Huitzilopochtli-fire.", powers: ["EXECUTIVE", "OBSERVER"], status: "online", load: 67 },
  { id: "ojo-ra", glyph: "ð“‚€", name: "Radar Ojo de Ra", mission: "Radar semÃ¡ntico solar: barre wikis, narrativas y rutas turÃ­sticas detectando incoherencias.", powers: ["OBSERVER", "LOGICAL"], status: "online", load: 51 },
  { id: "ojo-quetzalcoatl", glyph: "ð“†‘", name: "Radar Ojo de QuetzalcÃ³atl", mission: "Radar territorial serpiente: rastrea aforo, flujos y eventos en el polÃ­gono de Real del Monte.", powers: ["OBSERVER", "EXECUTIVE"], status: "degraded", load: 81 },
  { id: "mos-twins", glyph: "âŠ¡âŠ¡", name: "MOS Gemelos en Paralelo", mission: "Pipeline doble hexagonal: cada peticiÃ³n corre en MOS-A y MOS-B; consensor compara hashes antes de servir.", powers: ["EXECUTIVE", "LOGICAL"], status: "online", load: 60 },
  { id: "tenochtitlan", glyph: "ðŸœ‚", name: "System TenochtitlÃ¡n", mission: "Capital lÃ³gica del kernel: orquesta los 48 nodos, BookPI, EOCT y el render MD-X4 sobre el doble pipeline hexagonal.", powers: ["LOGICAL", "EXECUTIVE", "OBSERVER", "HUMAN"], status: "online", load: 70 },
  { id: "laberinto", glyph: "âŒ¬", name: "Laberinto Infinito", mission: "Honeypot adaptativo: redirige trÃ¡fico hostil a salas espejo cuÃ¡ntico y registra firmas para Anubis y Horus.", powers: ["OBSERVER"], status: "online", load: 44 },
];

export const RADARS_MIRROR: RadarMirror[] = [
  { id: "radar-ra", codename: "Ojo de Ra", scope: "semantic", detections: 412, anomalies: 3, coverage: 92 },
  { id: "radar-quetzalcoatl", codename: "Ojo de QuetzalcÃ³atl", scope: "territorial", detections: 287, anomalies: 5, coverage: 88 },
  { id: "radar-mos-a", codename: "MOS Gemelo A", scope: "perimeter", detections: 1184, anomalies: 0, coverage: 96 },
  { id: "radar-mos-b", codename: "MOS Gemelo B", scope: "perimeter", detections: 1182, anomalies: 0, coverage: 96 },
  { id: "radar-dekateotl", codename: "Dekateotl Ethics", scope: "ethical", detections: 64, anomalies: 1, coverage: 99 },
  { id: "radar-laberinto", codename: "Laberinto Infinito", scope: "quantum", detections: 18, anomalies: 0, coverage: 74 },
];

export const NODES_MIRROR: NodeMirror[] = [
  { index: 1, code: "N01-ISABELLA", name: "Isabella DMX4 Kernel", cluster: "core", health: 94, description: "Orquestador multi-agente con shutdown preventivo." },
  { index: 2, code: "N02-TAMVAI", name: "TAMVAI Multi-Agente", cluster: "core", health: 91, description: "FederaciÃ³n de agentes (turismo, cultura, comercio)." },
  { index: 3, code: "N03-CHRONUS", name: "ChronusEngine", cluster: "core", health: 89, description: "SincronizaciÃ³n temporal de trÃ¡fico, clima y aforo." },
  { index: 4, code: "N04-DECISION", name: "Decision Engine", cluster: "core", health: 96, description: "Registro auditable SHA-256 de decisiones IA." },
  { index: 5, code: "N05-PROTOCOL", name: "Protocol Engine", cluster: "core", health: 88, description: "Hoyo Negro Â· FÃ©nix Â· Futuros." },
  { index: 6, code: "N06-GENETIC", name: "Genetic Optimizer", cluster: "core", health: 90, description: "Rutas antifrÃ¡giles multi-objetivo." },
  { index: 7, code: "N07-IDNVIDA", name: "ID-NVIDA Sovereign Identity", cluster: "identity", health: 97, description: "DIDs, dignity, reputaciÃ³n inmutable." },
  { index: 8, code: "N08-EOCT", name: "EOCT Registro Civil", cluster: "identity", health: 92, description: "Estado Â· Origen Â· Conducta Â· Trayectoria." },
  { index: 9, code: "N09-DIGNITY", name: "Dignity Decay Job", cluster: "identity", health: 99, description: "Job 24h reduciendo dignity 1pt." },
  { index: 10, code: "N10-CITEMESH", name: "CITEMESH Governance", cluster: "governance", health: 87, description: "Powers/Roles + powerGuard middleware." },
  { index: 11, code: "N11-DAO", name: "DAO Phoenix", cluster: "governance", health: 84, description: "Propuestas y votaciÃ³n distribuida." },
  { index: 12, code: "N12-CONSTITUTION", name: "ConstituciÃ³n TAMV", cluster: "governance", health: 100, description: "Reglas inviolables del kernel." },
  { index: 13, code: "N13-ANUBIS", name: "Anubis Sentinel", cluster: "perimeter", health: 95, description: "Identity gatekeeper + JWT + revocation list." },
  { index: 14, code: "N14-HORUS", name: "Horus Sentinel", cluster: "perimeter", health: 93, description: "Vigilancia geoespacial + antifraude." },
  { index: 15, code: "N15-DEKATEOTL", name: "Dekateotl Ethics", cluster: "perimeter", health: 98, description: "Tribunal Ã©tico en lÃ­nea." },
  { index: 16, code: "N16-AZTEK", name: "Aztek Gods Cluster", cluster: "perimeter", health: 90, description: "QuetzalcÃ³atl/TlÃ¡loc/Huitzilopochtli." },
  { index: 17, code: "N17-OJO-RA", name: "Radar Ojo de Ra", cluster: "perimeter", health: 92, description: "Radar semÃ¡ntico solar." },
  { index: 18, code: "N18-OJO-QUETZ", name: "Radar Ojo de QuetzalcÃ³atl", cluster: "perimeter", health: 78, description: "Radar territorial." },
  { index: 19, code: "N19-MOS-A", name: "MOS Gemelo A", cluster: "perimeter", health: 96, description: "Pipeline hexagonal A." },
  { index: 20, code: "N20-MOS-B", name: "MOS Gemelo B", cluster: "perimeter", health: 96, description: "Pipeline hexagonal B." },
  { index: 21, code: "N21-CONSENSOR", name: "Consensor MOS", cluster: "perimeter", health: 99, description: "Comparador SHA-256 de respuestas paralelas." },
  { index: 22, code: "N22-LABERINTO", name: "Laberinto Infinito", cluster: "perimeter", health: 81, description: "Honeypot adaptativo." },
  { index: 23, code: "N23-FENIX-REX", name: "FÃ©nix Rex Protocol", cluster: "perimeter", health: 94, description: "Auto-recuperaciÃ³n tras incidente." },
  { index: 24, code: "N24-BABAS", name: "BABAS Audit Chain", cluster: "perimeter", health: 92, description: "Cadena de auditorÃ­a blockchain interna." },
  { index: 25, code: "N25-BOOKPI", name: "BookPI Evidence Registry", cluster: "memory", health: 99, description: "Registro inmutable hash-encadenado." },
  { index: 26, code: "N26-DIGYTAMV", name: "DIGYTAMV Conceptual Memory", cluster: "memory", health: 88, description: "Memoria conceptual vectorial." },
  { index: 27, code: "N27-MSR", name: "MSR Sovereign Registry", cluster: "memory", health: 93, description: "Eventos del metaverso firmados." },
  { index: 28, code: "N28-PGVECTOR", name: "PGVector Memory Bank", cluster: "memory", health: 86, description: "Embeddings episÃ³dicos." },
  { index: 29, code: "N29-LEDGER", name: "Phoenix Ledger", cluster: "economy", health: 91, description: "Libro mayor del token TAMV." },
  { index: 30, code: "N30-PHOENIX", name: "Phoenix 20Â·30Â·50", cluster: "economy", health: 95, description: "DistribuciÃ³n soberana 20/30/50." },
  { index: 31, code: "N31-TCEP", name: "TCEP Engine", cluster: "economy", health: 90, description: "Economy engine 75/25 fondo de impacto." },
  { index: 32, code: "N32-MERCHANT", name: "Merchant Catalog", cluster: "economy", health: 89, description: "Comercios verificados." },
  { index: 33, code: "N33-DONATIONS", name: "Donations Service", cluster: "economy", health: 93, description: "Pasarela de donativos territoriales." },
  { index: 34, code: "N34-MEMBERSHIP", name: "Membership Tiers", cluster: "economy", health: 92, description: "free Â· creator Â· guardian Â· institutional." },
  { index: 35, code: "N35-MDX4", name: "MD-X4 Render Engine", cluster: "render", health: 90, description: "Render volumÃ©trico 4D." },
  { index: 36, code: "N36-XR-GATEWAY", name: "XR Gateway", cluster: "render", health: 88, description: "WebXR / Meta / Apple Vision." },
  { index: 37, code: "N37-DREAMSPACE", name: "DreamSpaces", cluster: "metaverse", health: 85, description: "Salas inmersivas colaborativas." },
  { index: 38, code: "N38-SPATIAL", name: "Spatial Pod", cluster: "metaverse", health: 84, description: "Render espacial con polytopes." },
  { index: 39, code: "N39-TWIN", name: "Digital Twin Service", cluster: "render", health: 91, description: "DTDL v3 sitios y comercios." },
  { index: 40, code: "N40-TELEMETRY", name: "Twin Telemetry", cluster: "render", health: 88, description: "TelemetrÃ­a IoT del polÃ­gono." },
  { index: 41, code: "N41-CITEMESH-WIKI", name: "Citemesh Wiki", cluster: "memory", health: 86, description: "Wiki semÃ¡ntica territorial." },
  { index: 42, code: "N42-REALITO", name: "Realito Orb", cluster: "core", health: 94, description: "Asistente conversacional turÃ­stico." },
  { index: 43, code: "N43-STREAMS", name: "Streams Service", cluster: "metaverse", health: 87, description: "Salas live + videocall soberanas." },
  { index: 44, code: "N44-SOCIAL", name: "Social Mesh", cluster: "metaverse", health: 88, description: "Posts, likes, comentarios federados." },
  { index: 45, code: "N45-TAP", name: "TAP Protocol", cluster: "core", health: 92, description: "WebSocket TAP MessagePack." },
  { index: 46, code: "N46-GEMINI", name: "Geolocation IA", cluster: "core", health: 91, description: "GeolocalizaciÃ³n + recomendaciones." },
  { index: 47, code: "N47-WEATHER", name: "Weather Bridge", cluster: "core", health: 95, description: "Tema visual reactivo al clima." },
  { index: 48, code: "N48-RDMX-STATUS", name: "RDMX Status Beacon", cluster: "core", health: 99, description: "TelemetrÃ­a /api/rdmx/status." },
];

export const CLUSTER_LABEL: Record<string, string> = {
  core: "NÃºcleo",
  identity: "Identidad",
  perimeter: "PerÃ­metro",
  memory: "Memoria",
  economy: "EconomÃ­a",
  render: "Render",
  metaverse: "Metaverso",
  governance: "Gobernanza",
};
