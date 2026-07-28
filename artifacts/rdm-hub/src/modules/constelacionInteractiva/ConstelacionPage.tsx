/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Network, Shield, Gamepad2, MapPin, Users,
  Store, Music, Heart, MessageSquare, X, ExternalLink,
  Sparkles, ChevronRight, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ConstellationNode {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  fullDescription: string;
  status: "active" | "development" | "planned";
  completion: number;
  features: string[];
  link: string;
  x: number;
  y: number;
}

const CONSTELLATION_NODES: ConstellationNode[] = [
  {
    id: "core",
    name: "RDM Digital Hub",
    icon: <Globe className="h-5 w-5" />,
    description: "Centro neurálgico del ecosistema",
    fullDescription: "El núcleo central que conecta todos los módulos del ecosistema RDM. Orquesta datos, servicios y experiencias.",
    status: "active",
    completion: 75,
    features: ["Integración de módulos", "Dashboard central", "API Gateway"],
    link: "/",
    x: 50, y: 50,
  },
  {
    id: "isabella",
    name: "Isabella Ω-Core",
    icon: <Bot className="h-5 w-5" />,
    description: "Inteligencia Artificial",
    fullDescription: "Asistente IA avanzada que aprende del contexto territorial, recomendando y automatizando procesos para comercios y visitantes.",
    status: "active",
    completion: 60,
    features: ["Chat contextual", "Recomendaciones inteligentes", "Aprendizaje continuo"],
    link: "/isabella-ai",
    x: 50, y: 15,
  },
  {
    id: "yun",
    name: "YUN Network",
    icon: <Network className="h-5 w-5" />,
    description: "Infraestructura",
    fullDescription: "Capa de infraestructura descentralizada que soporta toda la operación del ecosistema RDM.",
    status: "active",
    completion: 70,
    features: ["Red descentralizada", "CDN territorial", "Edge computing"],
    link: "/yun-network",
    x: 80, y: 25,
  },
  {
    id: "crown",
    name: "C.R.O.W.N",
    icon: <Shield className="h-5 w-5" />,
    description: "Gobernanza",
    fullDescription: "Sistema de gobernanza descentralizada que permite a la comunidad participar en decisiones del ecosistema.",
    status: "active",
    completion: 55,
    features: ["Votación DAO", "Propuestas comunitarias", "Transparencia total"],
    link: "/gobernanza",
    x: 85, y: 50,
  },
  {
    id: "gamification",
    name: "Gamificación",
    icon: <Gamepad2 className="h-5 w-5" />,
    description: "Engagement",
    fullDescription: "Sistema de juego integrado que recompensa la participación activa de usuarios y comercios con Realitos.",
    status: "active",
    completion: 80,
    features: ["Trivia territorial", "Juegos de memoria", "Rankings y logros"],
    link: "/gamificacion",
    x: 80, y: 75,
  },
  {
    id: "territory",
    name: "Territorio",
    icon: <MapPin className="h-5 w-5" />,
    description: "Geografía",
    fullDescription: "Mapa interactivo del territorio de Real del Monte con puntos de interés, rutas y servicios geolocalizados.",
    status: "active",
    completion: 65,
    features: ["Mapa 3D interactivo", "Rutas turísticas", "Geolocalización"],
    link: "/territorial-dashboard",
    x: 50, y: 85,
  },
  {
    id: "community",
    name: "Community",
    icon: <Users className="h-5 w-5" />,
    description: "Personas",
    fullDescription: "Red social comunitaria que conecta residentes, turistas y comerciantes en un espacio de interacción.",
    status: "active",
    completion: 50,
    features: ["Perfiles comunitarios", "Eventos locales", "Grupos de interés"],
    link: "/comunidad",
    x: 20, y: 75,
  },
  {
    id: "commerce",
    name: "Commerce",
    icon: <Store className="h-5 w-5" />,
    description: "Economía",
    fullDescription: "Plataforma B2B y B2C que digitaliza el comercio local, conectando negocios con visitantes.",
    status: "active",
    completion: 70,
    features: ["Directorio de negocios", "Plan B2B", "Pagos digitales"],
    link: "/b2b",
    x: 15, y: 50,
  },
  {
    id: "culture",
    name: "Culture",
    icon: <Heart className="h-5 w-5" />,
    description: "Herencia",
    fullDescription: "Archivo digital de la riqueza cultural de Real del Monte: tradiciones, historia y patrimonio.",
    status: "development",
    completion: 40,
    features: ["Archivo histórico", "Exposiciones virtuales", "Recorridos culturales"],
    link: "/cultura",
    x: 15, y: 25,
  },
  {
    id: "music",
    name: "Music",
    icon: <Music className="h-5 w-5" />,
    description: "Artes",
    fullDescription: "Plataforma musical dedicada a la difusión de artistas locales y la producción musical del territorio.",
    status: "active",
    completion: 55,
    features: ["Streaming de artistas locales", "Eventos en vivo", "Donaciones musicales"],
    link: "/musica",
    x: 20, y: 15,
  },
  {
    id: "realito",
    name: "Realito",
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Asistente",
    fullDescription: "Compañero virtual que guía a los usuarios a través del ecosistema, respondiendo preguntas y sugiriendo acciones.",
    status: "development",
    completion: 35,
    features: ["Chat interactivo", "Recomendaciones", "Soporte 24/7"],
    link: "/realito",
    x: 65, y: 20,
  },
];

const CONNECTIONS: [string, string][] = [
  ["core", "isabella"], ["core", "yun"], ["core", "crown"],
  ["core", "gamification"], ["core", "territory"], ["core", "community"],
  ["core", "commerce"], ["core", "culture"], ["core", "music"], ["core", "realito"],
  ["isabella", "realito"], ["commerce", "gamification"], ["territory", "community"],
  ["culture", "music"], ["yun", "crown"],
];

function getStatusColor(status: string) {
  switch (status) {
    case "active": return "bg-emerald-500";
    case "development": return "bg-amber-500";
    default: return "bg-muted-foreground";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "active": return "Activo";
    case "development": return "En Desarrollo";
    default: return "Planificado";
  }
}

export default function ConstelacionPage() {
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };
    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMouse);
    return () => el?.removeEventListener("mousemove", handleMouse);
  }, []);

  const nodePositions = useMemo(() => {
    return CONSTELLATION_NODES.map((n) => ({
      ...n,
      px: `${n.x}%`,
      py: `${n.y}%`,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero */}
      <div className="relative z-10 pt-20 sm:pt-28 pb-8 px-4 text-center">
        <Badge variant="outline" className="mb-3 text-[10px] font-mono uppercase tracking-[0.25em] border-white/20 text-white/60">
          Ecosistema Visual
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-bold">
          Constelación{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Interactiva
          </span>
        </h1>
        <p className="text-sm sm:text-base text-white/50 mt-2 max-w-xl mx-auto">
          Explora el ecosistema RDM como una constelación. Cada nodo es un módulo conectado.
        </p>
      </div>

      {/* Star Map */}
      {!isMobile && (
        <div
          ref={containerRef}
          className="relative w-full h-[600px] overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000010 70%)",
          }}
        >
          {/* Animated stars background */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
                style={{
                  left: `${(i * 37 + 13) % 100}%`,
                  top: `${(i * 53 + 7) % 100}%`,
                  opacity: 0.2 + (i % 5) * 0.15,
                  animationDelay: `${(i * 0.3) % 3}s`,
                  animationDuration: `${2 + (i % 4)}s`,
                }}
              />
            ))}
          </div>

          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full" style={{
            transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
          }}>
            {CONNECTIONS.map(([fromId, toId], idx) => {
              const from = nodePositions.find((n) => n.id === fromId);
              const to = nodePositions.find((n) => n.id === toId);
              if (!from || !to) return null;
              const isHighlighted =
                hoveredNode === fromId || hoveredNode === toId ||
                selectedNode?.id === fromId || selectedNode?.id === toId;
              return (
                <line
                  key={idx}
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke={isHighlighted ? "#60a5fa" : "#1e3a5f"}
                  strokeWidth={isHighlighted ? 1.5 : 0.5}
                  strokeDasharray={isHighlighted ? "none" : "4 4"}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {nodePositions.map((node) => {
            const isCore = node.id === "core";
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode === node.id;
            return (
              <motion.div
                key={node.id}
                className="absolute z-10 cursor-pointer"
                style={{
                  left: node.px,
                  top: node.py,
                  transform: `translate(-50%, -50%) translate(${mousePos.x * (isCore ? 0.1 : 0.5)}px, ${mousePos.y * (isCore ? 0.1 : 0.5)}px)`,
                }}
                whileHover={{ scale: 1.15 }}
                onClick={() => setSelectedNode(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className={`
                  flex flex-col items-center gap-1.5 transition-all duration-300
                `}>
                  <div className={`
                    flex items-center justify-center rounded-full border transition-all duration-300
                    ${isCore
                      ? "w-16 h-16 border-blue-400/60 bg-blue-500/20 shadow-lg shadow-blue-500/30"
                      : isHovered || isSelected
                        ? "w-12 h-12 border-blue-400/40 bg-blue-500/15"
                        : "w-10 h-10 border-white/20 bg-white/5"
                    }
                  `}>
                    <div className={isCore ? "text-blue-300 scale-125" : "text-white/70"}>
                      {node.icon}
                    </div>
                  </div>
                  <span className={`
                    text-[10px] font-medium text-center max-w-[80px] leading-tight
                    ${isCore ? "text-blue-300 font-bold" : "text-white/50"}
                    ${isHovered || isSelected ? "text-white/90" : ""}
                  `}>
                    {node.name}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(node.status)} ${node.status === "active" ? "animate-pulse" : ""}`} />
                </div>

                {/* Tooltip on hover */}
                {isHovered && !isSelected && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 whitespace-nowrap">
                    <p className="text-xs text-white/80">{node.description}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Mobile: Card List */}
      {isMobile && (
        <div className="px-4 space-y-3 pb-6">
          {CONSTELLATION_NODES.map((node) => (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="w-full text-left"
            >
              <Card className="p-4 bg-white/5 border-white/10 hover:border-white/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                    {node.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-white truncate">{node.name}</p>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(node.status)}`} />
                    </div>
                    <p className="text-xs text-white/40">{node.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/30 shrink-0" />
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedNode(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-gray-950 border-l border-white/10 z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      {selectedNode.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{selectedNode.name}</h2>
                      <p className="text-xs text-white/40">{selectedNode.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(selectedNode.status)} text-white border-0 text-[10px]`}>
                    {getStatusLabel(selectedNode.status)}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${selectedNode.completion}%` }}
                      />
                    </div>
                    {selectedNode.completion}%
                  </div>
                </div>

                <p className="text-sm text-white/60 leading-relaxed">
                  {selectedNode.fullDescription}
                </p>

                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">
                    Características Clave
                  </h3>
                  <div className="space-y-2">
                    {selectedNode.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-blue-400" />
                        <span className="text-sm text-white/70">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    navigate(selectedNode.link);
                    setSelectedNode(null);
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ir a {selectedNode.name}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Ecosystem Stats */}
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              10+
            </p>
            <p className="text-xs text-white/40 mt-1">Módulos</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              50+
            </p>
            <p className="text-xs text-white/40 mt-1">API Endpoints</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              831+
            </p>
            <p className="text-xs text-white/40 mt-1">Archivos de Código</p>
          </div>
        </div>
      </div>
    </div>
  );
}
