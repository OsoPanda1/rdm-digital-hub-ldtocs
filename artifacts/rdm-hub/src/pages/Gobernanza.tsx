/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState } from "react";
import {
  Shield,
  Users,
  FileCheck,
  RefreshCw,
  BookOpen,
  Scale,
  Eye,
  GitBranch,
  Globe,
  Crown,
  Code,
  Building,
  ChevronDown,
  ChevronUp,
  Vote,
  CheckCircle2,
  XCircle,
  Minus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const PRINCIPLES = [
  { id: "CP-001", name: "Constitución Primordial", icon: Scale, desc: "Marco ético y técnico fundamental que rige todo el ecosistema TAMV." },
  { id: "CP-002", name: "Soberanía del Pueblo", icon: Users, desc: "Decisiones colectivas participativas, voz y voto para todos los niveles de membresía." },
  { id: "CP-003", name: "Integridad del Territorio", icon: Shield, desc: "Protección del patrimonio cultural, histórico y digital de Real del Monte." },
  { id: "CP-004", name: "Transparencia Radical", icon: Eye, desc: "Todas las decisiones documentadas públicamente, trazabilidad total en operaciones." },
  { id: "CP-005", name: "Acción Sostenible", icon: RefreshCw, desc: "Operaciones que minimizan impacto ambiental y maximizan beneficio comunitario." },
  { id: "CP-006", name: "Seguridad Primero", icon: Shield, desc: "Protección de datos, identidad y operaciones con estándares Zero-Trust." },
  { id: "CP-007", name: "Interoperabilidad", icon: Globe, desc: "Sistemas abiertos que se conectan con ecosistemas externos sin perder soberanía." },
  { id: "CP-008", name: "Resiliencia", icon: RefreshCw, desc: "Capacidad de recuperación ante fallos, adaptación continua y redundancia inteligente." },
];

const ADRS = [
  {
    id: "ADR-YUN-0001",
    title: "YUN Constitution Framework",
    status: "ACCEPTED" as const,
    date: "2026-03-15",
    desc: "Definición del marco constitucional YUN para gobernanza del ecosistema TAMV.",
    content: "Este ADR establece la estructura de gobernanza basada en principios YUN, definiendo roles, niveles de autoridad y procesos de decisión. La constitución sirve como contrato social digital entre todos los participantes del ecosistema.",
  },
  {
    id: "ADR-YUN-0002",
    title: "PQC Hybrid Cryptography",
    status: "ACCEPTED" as const,
    date: "2026-04-01",
    desc: "Implementación de criptografía híbrida post-cuántica para seguridad futura.",
    content: "Adopción de algoritmos híbridos que combinan criptografía clásica (RSA/ECC) con esquemas post-cuánticos (CRYSTALS-Kyber, CRYSTALS-Dilithium) para protección contra amenazas cuánticas futuras.",
  },
  {
    id: "ADR-YUN-0003",
    title: "Multi-Node Deployment",
    status: "ACCEPTED" as const,
    date: "2026-04-20",
    desc: "Arquitectura de despliegue federado con múltiples nodos geográficos.",
    content: "Cada nodo del ecosistema TAMV opera de forma independiente pero interoperable, con sincronización de datos en tiempo real y tolerancia a fallos distribuida.",
  },
  {
    id: "ADR-YUN-0004",
    title: "Gamification Engine Unification",
    status: "ACCEPTED" as const,
    date: "2026-05-10",
    desc: "Unificación del motor de gamificación para experiencias consistentes.",
    content: "Consolidación de todos los sistemas de puntos, logros y recompensas en un motor unificado que permite gamificación transversal a todos los módulos del ecosistema.",
  },
  {
    id: "ADR-RDM-0001",
    title: "Domain Migration to visitarealdelmonte.online",
    status: "ACCEPTED" as const,
    date: "2026-06-01",
    desc: "Migración del dominio principal a visitarealdelmonte.online.",
    content: "Migración completa del dominio de operación para consolidar la marca turística de Real del Monte bajo un dominio memorable y descriptivo.",
  },
];

const PROPOSALS = [
  {
    id: "PROP-001",
    title: "Aumentar fondo comunitario al 30%",
    desc: "Propuesta para incrementar la participación del fondo comunitario del 25% al 30% de los ingresos totales.",
    votes: { for: 23, against: 5, abstain: 3 },
  },
  {
    id: "PROP-002",
    title: "Nodo Pachuca — Certificación Guardián",
    desc: "Solicitud del nodo Pachuca para alcanzar el nivel de certificación Guardián.",
    votes: { for: 31, against: 1, abstain: 4 },
  },
  {
    id: "PROP-003",
    title: "Integración con Red Turística Hidalgo",
    desc: "Propuesta para federar el ecosistema turístico de Real del Monte con la red estatal de Hidalgo.",
    votes: { for: 18, against: 7, abstain: 6 },
  },
];

const COUNCIL = [
  { name: "Edwin Castillo Trejo", role: "Fundador & Arquitecto Principal", icon: Crown, term: "Permanente" },
  { name: "Isabella Villaseñor", role: "IA Consejera (Ω-Core)", icon: Shield, term: "Permanente" },
  { name: "Realito", role: "Asistente Digital", icon: Users, term: "Permanente" },
];

function AdrStatusBadge({ status }: { status: typeof ADRS[number]["status"] }) {
  const styles = {
    ACCEPTED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    PROPOSED: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    DEPRECATED: "bg-muted text-muted-foreground",
  };
  return <Badge className={`${styles[status]} border-0`} variant="outline">{status}</Badge>;
}

export default function Gobernanza() {
  const [expandedAdr, setExpandedAdr] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, "for" | "against" | "abstain" | null>>({});

  const handleVote = (proposalId: string, vote: "for" | "against" | "abstain") => {
    setVotes((prev) => ({
      ...prev,
      [proposalId]: prev[proposalId] === vote ? null : vote,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-background via-amber-950/5 to-primary/5">
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-amber-500/10">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Gobernanza TAMV</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Marco constitucional y principios del ecosistema Real del Monte — gobernanza abierta, transparencia radical y acción civilizatoria.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <Tabs defaultValue="principios" className="space-y-6">
          <TabsList className="w-full justify-start flex-wrap h-auto gap-1 p-1 bg-muted/40">
            <TabsTrigger value="principios" className="gap-1.5"><Scale className="h-3.5 w-3.5" /> Principios</TabsTrigger>
            <TabsTrigger value="adrs" className="gap-1.5"><FileCheck className="h-3.5 w-3.5" /> ADRs</TabsTrigger>
            <TabsTrigger value="votaciones" className="gap-1.5"><Vote className="h-3.5 w-3.5" /> Votaciones</TabsTrigger>
            <TabsTrigger value="consejo" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Consejo</TabsTrigger>
          </TabsList>

          {/* PRINCIPIOS */}
          <TabsContent value="principios">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRINCIPLES.map((p) => (
                <div key={p.id} className="rounded-xl border border-border/40 bg-card/40 p-5 hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <p.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{p.id}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{p.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ADRs */}
          <TabsContent value="adrs">
            <div className="space-y-3">
              {ADRS.map((adr) => (
                <div key={adr.id} className="rounded-xl border border-border/40 bg-card/40 overflow-hidden">
                  <button
                    onClick={() => setExpandedAdr(expandedAdr === adr.id ? null : adr.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-muted-foreground shrink-0">{adr.id}</span>
                      <span className="text-sm font-medium text-foreground truncate">{adr.title}</span>
                      <AdrStatusBadge status={adr.status} />
                    </div>
                    {expandedAdr === adr.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {expandedAdr === adr.id && (
                    <div className="px-5 pb-5 border-t border-border/30">
                      <p className="text-xs text-muted-foreground mt-1 mb-2">
                        Fecha: {new Date(adr.date).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">{adr.desc}</p>
                      <div className="rounded-lg bg-muted/30 p-4">
                        <p className="text-sm text-foreground leading-relaxed">{adr.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* VOTACIONES */}
          <TabsContent value="votaciones">
            <div className="space-y-4">
              {PROPOSALS.map((p) => (
                <div key={p.id} className="rounded-xl border border-border/40 bg-card/40 p-5">
                  <h3 className="font-semibold text-sm text-foreground mb-1">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{p.desc}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {([
                      { key: "for" as const, label: "A favor", icon: CheckCircle2, color: "emerald" },
                      { key: "against" as const, label: "En contra", icon: XCircle, color: "rose" },
                      { key: "abstain" as const, label: "Abstención", icon: Minus, color: "muted" },
                    ] as const).map(({ key, label, icon: Icon, color }) => {
                      const isSelected = votes[p.id] === key;
                      const count = p.votes[key] + (isSelected ? 1 : 0);
                      return (
                        <button
                          key={key}
                          onClick={() => handleVote(p.id, key)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                            isSelected
                              ? `bg-${color}-500/15 border-${color}-500/30 text-${color}-600 dark:text-${color}-400`
                              : "border-border/40 text-muted-foreground hover:bg-muted/30"
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                          {label}
                          <span className="ml-1 tabular-nums">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* CONSEJO */}
          <TabsContent value="consejo">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {COUNCIL.map((m) => (
                <div key={m.name} className="rounded-xl border border-border/40 bg-card/40 p-6 text-center">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <m.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-0.5">{m.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{m.role}</p>
                  <Badge variant="outline" className="text-[10px] border-border/40">{m.term}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
