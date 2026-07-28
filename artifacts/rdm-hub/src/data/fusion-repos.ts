/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import {
  Activity,
  Bot,
  Boxes,
  Database,
  Globe2,
  type LucideIcon,
  Map,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export type FusionStatus = "integrado" | "orquestado" | "pendiente-remoto";

export interface FusionCapability {
  id: string;
  label: string;
  description: string;
  route?: string;
  icon: LucideIcon;
}

export interface FusionRepository {
  id: string;
  name: string;
  url: string;
  status: FusionStatus;
  role: string;
  summary: string;
  stack: string[];
  capabilities: FusionCapability[];
  contracts: string[];
}

export const fusionRepositories: FusionRepository[] = [
  {
    id: "rdm-digital-nodo-cero",
    name: "RDM Digital Nodo Cero",
    url: "https://github.com/OsoPanda1/rdm-digital-nodo-cero.git",
    status: "integrado",
    role: "Shell soberano y contratos MD-X5",
    summary:
      "Orquesta identidad, turismo inteligente, geointeligencia, protocolos auditables, economÃ­a creativa e IA contextual para Real del Monte.",
    stack: ["Next.js", "Supabase", "Prisma", "Stripe", "SSE", "IA"],
    capabilities: [
      {
        id: "identity",
        label: "ID-NVIDA / Identidad",
        description: "Base de sesiÃ³n ciudadana-comercial para unificar perfiles, membresÃ­as y acceso a servicios.",
        route: "/comercios/registro",
        icon: ShieldCheck,
      },
      {
        id: "protocols",
        label: "Protocol Engine",
        description: "Contratos de ejecuciÃ³n para decisiones trazables BABAS, EOCT, MSR y BookPI.",
        route: "/tamv/api",
        icon: Activity,
      },
    ],
    contracts: ["/api/auth/register", "/api/protocols/execute", "/api/github/repos"],
  },
  {
    id: "rdm-turismodigital",
    name: "RDM Turismo Digital",
    url: "https://github.com/OsoPanda1/rdm-turismodigital.git",
    status: "orquestado",
    role: "Experiencias turÃ­sticas y catÃ¡logo territorial",
    summary:
      "Absorbe rutas, sitios, eventos, comercios y narrativas de visitantes dentro de una experiencia navegable de Real del Monte.",
    stack: ["React", "Vite", "Tailwind", "Mapas", "CatÃ¡logo"],
    capabilities: [
      {
        id: "routes",
        label: "Rutas experienciales",
        description: "Conecta historia, gastronomÃ­a, ecoturismo y cultura con llamadas a acciÃ³n operativas.",
        route: "/rutas",
        icon: Map,
      },
      {
        id: "commerce",
        label: "Comercios vivos",
        description: "Activa directorio, registro y checkout para negocios locales dentro del portal.",
        route: "/catalogo",
        icon: Globe2,
      },
    ],
    contracts: ["places", "businesses", "events", "tourismContent"],
  },
  {
    id: "real-del-monte-twin",
    name: "Real del Monte Twin",
    url: "https://github.com/OsoPanda1/real-del-monte-twin.git",
    status: "integrado",
    role: "Gemelo digital geoespacial",
    summary:
      "Representa lugares, sensores, telemetrÃ­a y capas visuales del territorio para operar un mapa vivo y auditable.",
    stack: ["TypeScript", "Supabase", "PLpgSQL", "Playwright", "Telemetry"],
    capabilities: [
      {
        id: "telemetry",
        label: "TelemetrÃ­a territorial",
        description: "Modelo para ingestiÃ³n, lectura y transmisiÃ³n viva de seÃ±ales territoriales.",
        route: "/tamv/status",
        icon: Radar,
      },
      {
        id: "digital-twin",
        label: "Mapa vivo",
        description: "Hace visible la relaciÃ³n entre puntos patrimoniales, comercios, rutas y saturaciÃ³n zonal.",
        route: "/#mapa",
        icon: Network,
      },
    ],
    contracts: ["/api/places/register", "/api/places/:id", "/api/telemetry/ingest", "/api/telemetry/live"],
  },
  {
    id: "citemesh-roots",
    name: "CiteMesh Roots",
    url: "https://github.com/OsoPanda1/citemesh-roots.git",
    status: "integrado",
    role: "RaÃ­z autopoiÃ©tica y malla federada",
    summary:
      "Aporta principios de identidad soberana, infraestructura federada, IA auditada y economÃ­a Ã©tica antifrÃ¡gil al nÃºcleo TAMV.",
    stack: ["React", "TypeScript", "Vite", "Prisma", "Supabase", "Observabilidad"],
    capabilities: [
      {
        id: "autopoiesis",
        label: "Autopoiesis continua",
        description: "Capa de mejora, sincronizaciÃ³n CRDT y resiliencia civilizatoria entre nodos autÃ³nomos.",
        route: "/tamv/thesis",
        icon: Boxes,
      },
      {
        id: "isabella",
        label: "Isabella AI auditada",
        description: "Asistente territorial con memoria, guardianÃ­a y explicabilidad para servicios ciudadanos.",
        route: "/tamv",
        icon: Bot,
      },
    ],
    contracts: ["OPA", "EOCT-Ledger", "CRDT Sync", "Isabella AI", "Grafana/Prometheus"],
  },
];

export const fusionPillars = [
  {
    id: "sovereign-shell",
    title: "Shell ciudadano-comercial",
    description: "Un solo portal de entrada para visitantes, comercios, comunidad, donativos y exploraciÃ³n cultural.",
    icon: Sparkles,
    routes: ["/", "/catalogo", "/comercios/registro", "/donar"],
  },
  {
    id: "territorial-twin",
    title: "Gemelo territorial operativo",
    description: "Mapa vivo con sitios, rutas, comercios y telemetrÃ­a preparada para decisiones de saturaciÃ³n y cuidado patrimonial.",
    icon: Radar,
    routes: ["/#mapa", "/rutas", "/tamv/status"],
  },
  {
    id: "federated-memory",
    title: "Memoria federada auditable",
    description: "Protocolos, tesis, BookPI, MSR y contratos de integraciÃ³n para dejar rastro verificable de cada mÃ³dulo.",
    icon: Database,
    routes: ["/tamv", "/tamv/api", "/tamv/thesis", "/tenochtitlan"],
  },
];

export const fusionIntegrationFlow = [
  "Normalizar rutas y datos turÃ­sticos en el shell Vite actual.",
  "Exponer capacidades federadas como contratos navegables, no como repos aislados.",
  "Conectar mapa, catÃ¡logo, telemetrÃ­a y guardianÃ­a TAMV desde una pÃ¡gina de mando comÃºn.",
  "Documentar trazabilidad remota y estado de absorciÃ³n para futuras sincronizaciones GitHub.",
];

export const getFusionReadiness = () => {
  const integrated = fusionRepositories.filter((repo) => repo.status === "integrado").length;
  const orchestrated = fusionRepositories.filter((repo) => repo.status === "orquestado").length;
  return Math.round(((integrated + orchestrated * 0.75) / fusionRepositories.length) * 100);
};
