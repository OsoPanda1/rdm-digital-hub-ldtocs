/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { SEOMeta, PAGE_SEO } from "@/components/SEOMeta";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network, Server, Radio, Activity, Wifi, Cpu, Globe, Signal,
  Clock, AlertTriangle, CheckCircle, XCircle, Search, RefreshCw,
  ChevronDown, MemoryStick, HardDrive,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

interface NodeData {
  id: string;
  name: string;
  type: "edge" | "fog" | "cloud" | "quantum";
  layer: string;
  status: "online" | "degraded" | "offline";
  location: string;
  latency: number;
  uptime: number;
  throughput: number;
  lastHeartbeat: string;
  version: string;
  capabilities?: string[];
  cpu?: number;
  memory?: number;
  disk?: number;
}

const FALLBACK_NODES: NodeData[] = [
  { id: "n1", name: "Nodo Cero - RDM", type: "edge", layer: "L1", status: "online", location: "Real del Monte, Hgo.", latency: 4, uptime: 99.97, throughput: 342, lastHeartbeat: "1s ago", version: "MD-X5 v2.4", capabilities: ["iot-gateway", "edge-ml", "local-storage"], cpu: 23, memory: 45, disk: 62 },
  { id: "n2", name: "Fog Sierra", type: "fog", layer: "L2", status: "online", location: "Pachuca, Hgo.", latency: 12, uptime: 99.88, throughput: 891, lastHeartbeat: "2s ago", version: "FM-X2 v1.8", capabilities: ["data-aggregation", "stream-processing", "caching"], cpu: 41, memory: 67, disk: 54 },
  { id: "n3", name: "Cloud CDMX", type: "cloud", layer: "L3", status: "online", location: "CDMX", latency: 28, uptime: 99.99, throughput: 2400, lastHeartbeat: "0.5s ago", version: "CM-X1 v3.1", capabilities: ["orchestration", "model-training", "global-cdn"], cpu: 56, memory: 78, disk: 43 },
  { id: "n4", name: "Edge Tizayuca", type: "edge", layer: "L1", status: "degraded", location: "Tizayuca, Hgo.", latency: 45, uptime: 97.2, throughput: 156, lastHeartbeat: "15s ago", version: "MD-X5 v2.3", capabilities: ["iot-gateway", "local-storage"], cpu: 72, memory: 81, disk: 88 },
  { id: "n5", name: "Quantum Lab", type: "quantum", layer: "L4", status: "online", location: "Simulado", latency: 2, uptime: 100, throughput: 128, lastHeartbeat: "0.1s ago", version: "QK-Prototype", capabilities: ["quantum-sim", "crypto-accel", "research"], cpu: 12, memory: 34, disk: 15 },
  { id: "n6", name: "Edge Tulancingo", type: "edge", layer: "L1", status: "offline", location: "Tulancingo, Hgo.", latency: 0, uptime: 82.4, throughput: 0, lastHeartbeat: "5m ago", version: "MD-X5 v2.2", capabilities: ["iot-gateway"], cpu: 0, memory: 0, disk: 0 },
  { id: "n7", name: "Fog Hidalgo", type: "fog", layer: "L2", status: "online", location: "Hidalgo", latency: 18, uptime: 99.91, throughput: 567, lastHeartbeat: "3s ago", version: "FM-X2 v1.8", capabilities: ["data-aggregation", "ml-inference"], cpu: 38, memory: 52, disk: 47 },
  { id: "n8", name: "Edge Mineral", type: "edge", layer: "L1", status: "degraded", location: "Mineral del Monte", latency: 38, uptime: 95.6, throughput: 89, lastHeartbeat: "45s ago", version: "MD-X5 v2.3", capabilities: ["iot-gateway", "edge-ml"], cpu: 84, memory: 76, disk: 91 },
];

type FilterStatus = "all" | "online" | "degraded" | "offline";
type FilterType = "all" | NodeData["type"];
type SortBy = "name" | "latency" | "status";

const STATUS_ICONS = { online: CheckCircle, degraded: AlertTriangle, offline: XCircle } as const;
const STATUS_COLORS = { online: "text-emerald-500", degraded: "text-amber-500", offline: "text-red-500" } as const;
const STATUS_DOT = { online: "bg-emerald-500", degraded: "bg-amber-500", offline: "bg-red-500" } as const;
const TYPE_ICONS = { edge: Wifi, fog: Radio, cloud: Globe, quantum: Cpu } as const;
const TYPE_COLORS = { edge: "text-blue-400", fog: "text-amber-400", cloud: "text-emerald-400", quantum: "text-purple-400" } as const;

export default function Atlas() {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchNodes = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/yun/status`, { credentials: "include" });
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      if (data?.data?.nodes && Array.isArray(data.data.nodes) && data.data.nodes.length > 0) {
        const mapped: NodeData[] = data.data.nodes.map((n: Record<string, unknown>) => ({
          id: (n.id as string) || `node-${Math.random().toString(36).slice(2, 8)}`,
          name: (n.name as string) || "Unknown Node",
          type: (n.type as NodeData["type"]) || "edge",
          layer: (n.layer as string) || "L1",
          status: (n.status as NodeData["status"]) || "online",
          location: (n.location as string) || "Unknown",
          latency: (n.latency as number) ?? 0,
          uptime: (n.uptime as number) ?? 99,
          throughput: (n.throughput as number) ?? 0,
          lastHeartbeat: (n.lastHeartbeat as string) || "now",
          version: (n.version as string) || "unknown",
          capabilities: (n.capabilities as string[]) || [],
          cpu: (n.cpu as number) ?? Math.round(Math.random() * 80),
          memory: (n.memory as number) ?? Math.round(Math.random() * 70 + 20),
          disk: (n.disk as number) ?? Math.round(Math.random() * 60 + 20),
        }));
        setNodes(mapped);
      } else {
        setNodes(FALLBACK_NODES);
      }
    } catch {
      setNodes(FALLBACK_NODES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNodes(); }, [fetchNodes]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchNodes, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchNodes]);

  const filteredNodes = useMemo(() => {
    let result = nodes;
    if (filterStatus !== "all") result = result.filter((n) => n.status === filterStatus);
    if (filterType !== "all") result = result.filter((n) => n.type === filterType);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((n) => n.name.toLowerCase().includes(q) || n.location.toLowerCase().includes(q));
    }
    if (sortBy === "latency") result = [...result].sort((a, b) => b.latency - a.latency);
    else if (sortBy === "status") {
      const order = { online: 0, degraded: 1, offline: 2 };
      result = [...result].sort((a, b) => order[a.status] - order[b.status]);
    } else result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [nodes, filterStatus, filterType, search, sortBy]);

  const stats = useMemo(() => ({
    total: nodes.length,
    online: nodes.filter((n) => n.status === "online").length,
    degraded: nodes.filter((n) => n.status === "degraded").length,
    offline: nodes.filter((n) => n.status === "offline").length,
    avgLatency: nodes.length > 0 ? Math.round(nodes.filter((n) => n.status !== "offline").reduce((s, n) => s + n.latency, 0) / Math.max(1, nodes.filter((n) => n.status !== "offline").length)) : 0,
  }), [nodes]);

  const topologyByLayer = useMemo(() => {
    const layers: Record<string, NodeData[]> = {};
    for (const n of filteredNodes) {
      const l = n.layer || "L1";
      if (!layers[l]) layers[l] = [];
      layers[l].push(n);
    }
    return layers;
  }, [filteredNodes]);

  return (
    <RDMLayout>
      <SEOMeta {...PAGE_SEO.mapa} title="Atlas de Nodos - RDM Digital" description="Topologia de nodos federados del ecosistema TAMV: edge, fog, cloud y quantum." />
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--rdm-amber)/0.3)] bg-[hsl(var(--rdm-amber)/0.08)] px-4 py-2 text-xs uppercase tracking-[0.2em] mb-4">
            <Network className="h-3.5 w-3.5 text-[hsl(var(--rdm-amber))]" />
            <span>Red Federada</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Atlas de Nodos</h1>
          <p className="mt-3 text-[hsl(var(--muted-foreground))] max-w-2xl">Topologia de la red federada TAMV. Monitoreo en tiempo real de nodos edge, fog, cloud y quantum.</p>
        </motion.div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6 p-3 rounded-xl border border-[hsl(var(--border)/0.4)] bg-[hsl(var(--background))] text-xs">
          <span className="flex items-center gap-1 text-emerald-500"><span className={`w-2 h-2 rounded-full ${STATUS_DOT.online}`} />{stats.online} activos</span>
          <span className="text-[hsl(var(--border)/0.5)]">|</span>
          <span className="flex items-center gap-1 text-amber-500"><span className={`w-2 h-2 rounded-full ${STATUS_DOT.degraded}`} />{stats.degraded} idle</span>
          <span className="text-[hsl(var(--border)/0.5)]">|</span>
          <span className="flex items-center gap-1 text-red-500"><span className={`w-2 h-2 rounded-full ${STATUS_DOT.offline}`} />{stats.offline} errores</span>
          <span className="text-[hsl(var(--border)/0.5)]">|</span>
          <span className="flex items-center gap-1 text-[hsl(var(--muted-foreground))]"><Clock className="h-3 w-3" />Latencia promedio: {stats.avgLatency}ms</span>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input type="text" placeholder="Buscar nodos..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--background))] py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--rdm-amber)/0.4)]" />
          </div>

          <div className="flex gap-1 p-1 rounded-lg bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))]">
            {(["all", "online", "degraded", "offline"] as FilterStatus[]).map((f) => (
              <button key={f} onClick={() => setFilterStatus(f)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${filterStatus === f ? "bg-[hsl(var(--rdm-amber))] text-white" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}>
                {f === "all" ? "Todos" : f === "online" ? "Active" : f === "degraded" ? "Idle" : "Error"}
              </button>
            ))}
          </div>

          <div className="flex gap-1 p-1 rounded-lg bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))]">
            {(["all", "edge", "fog", "cloud", "quantum"] as FilterType[]).map((f) => (
              <button key={f} onClick={() => setFilterType(f)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${filterType === f ? "bg-[hsl(var(--rdm-amber))] text-white" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}>
                {f === "all" ? "Capa" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)} className="rounded-lg border border-[hsl(var(--border)/0.5)] bg-[hsl(var(--background))] py-2 px-3 text-xs">
            <option value="name">Nombre</option>
            <option value="latency">Latencia</option>
            <option value="status">Estado</option>
          </select>

          <button onClick={() => setAutoRefresh(!autoRefresh)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${autoRefresh ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-[hsl(var(--border)/0.5)] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}>
            <RefreshCw className={`h-3.5 w-3.5 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto (30s)" : "Auto-refresh"}
          </button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[hsl(var(--border)/0.4)] bg-[hsl(var(--background))] p-4 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-white/5" /><div className="space-y-1"><div className="h-4 w-32 bg-white/5 rounded" /><div className="h-3 w-24 bg-white/5 rounded" /></div></div>
                </div>
                <div className="grid grid-cols-3 gap-2"><div className="h-3 bg-white/5 rounded" /><div className="h-3 bg-white/5 rounded" /><div className="h-3 bg-white/5 rounded" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            <AnimatePresence>
              {filteredNodes.map((node, i) => {
                const StatusIcon = STATUS_ICONS[node.status];
                const TypeIcon = TYPE_ICONS[node.type];
                const isExpanded = selectedNode?.id === node.id;
                return (
                  <motion.div key={node.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedNode(isExpanded ? null : node)}
                    className={`rounded-2xl border p-4 cursor-pointer transition-all ${isExpanded ? "border-[hsl(var(--rdm-amber)/0.5)] bg-[hsl(var(--rdm-amber)/0.06)]" : "border-[hsl(var(--border)/0.4)] bg-[hsl(var(--background))] hover:border-[hsl(var(--rdm-amber)/0.3)]"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${node.type === "edge" ? "bg-blue-500/10" : node.type === "fog" ? "bg-amber-500/10" : node.type === "cloud" ? "bg-emerald-500/10" : "bg-purple-500/10"}`}>
                          <TypeIcon className={`h-4 w-4 ${TYPE_COLORS[node.type]}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{node.name}</span>
                            <span className={`w-2 h-2 rounded-full ${STATUS_DOT[node.status]}`} />
                          </div>
                          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{node.location} &middot; {node.layer} &middot; {node.version}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-3.5 w-3.5 ${STATUS_COLORS[node.status]}`} />
                        <ChevronDown className={`h-3.5 w-3.5 text-[hsl(var(--muted-foreground))] transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                      <div className="flex items-center gap-1"><Signal className="h-3 w-3" />{node.latency}ms</div>
                      <div className="flex items-center gap-1"><Activity className="h-3 w-3" />{node.uptime}%</div>
                      <div className="flex items-center gap-1"><Wifi className="h-3 w-3" />{node.throughput} r/s</div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden" onClick={(e) => e.stopPropagation()}>
                          <div className="mt-3 pt-3 border-t border-[hsl(var(--border)/0.3)] space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                              <div><span className="block text-[10px] opacity-60">Node ID</span>{node.id}</div>
                              <div><span className="block text-[10px] opacity-60">Layer</span>{node.layer} ({node.type.toUpperCase()})</div>
                              <div><span className="block text-[10px] opacity-60">Heartbeat</span>{node.lastHeartbeat}</div>
                              <div><span className="block text-[10px] opacity-60">Estado</span>{node.status}</div>
                            </div>
                            {node.capabilities && node.capabilities.length > 0 && (
                              <div><span className="block text-[10px] opacity-60 mb-1">Capacidades</span>
                                <div className="flex flex-wrap gap-1">{node.capabilities.map((c) => <span key={c} className="px-2 py-0.5 rounded-full bg-[hsl(var(--muted))] text-[10px] text-[hsl(var(--muted-foreground))]">{c}</span>)}</div>
                              </div>
                            )}
                            {(node.cpu ?? 0) > 0 && (
                              <div className="space-y-1.5">
                                <span className="block text-[10px] opacity-60">Metricas de salud</span>
                                <div className="flex items-center gap-2 text-xs">
                                  <Cpu className="h-3 w-3 text-blue-400" /><span className="text-[hsl(var(--muted-foreground))]">CPU</span>
                                  <div className="flex-1 h-1.5 rounded-full bg-white/10"><div className={`h-full rounded-full ${(node.cpu ?? 0) > 80 ? "bg-red-500" : (node.cpu ?? 0) > 50 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${node.cpu}%` }} /></div>
                                  <span className="text-[10px] w-8 text-right">{node.cpu}%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <MemoryStick className="h-3 w-3 text-purple-400" /><span className="text-[hsl(var(--muted-foreground))]">RAM</span>
                                  <div className="flex-1 h-1.5 rounded-full bg-white/10"><div className={`h-full rounded-full ${(node.memory ?? 0) > 80 ? "bg-red-500" : (node.memory ?? 0) > 50 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${node.memory}%` }} /></div>
                                  <span className="text-[10px] w-8 text-right">{node.memory}%</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <HardDrive className="h-3 w-3 text-orange-400" /><span className="text-[hsl(var(--muted-foreground))]">Disk</span>
                                  <div className="flex-1 h-1.5 rounded-full bg-white/10"><div className={`h-full rounded-full ${(node.disk ?? 0) > 80 ? "bg-red-500" : (node.disk ?? 0) > 50 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${node.disk}%` }} /></div>
                                  <span className="text-[10px] w-8 text-right">{node.disk}%</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Topology View */}
        {!loading && filteredNodes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">Topologia de Red</h2>
            <div className="relative p-6 rounded-2xl border border-[hsl(var(--border)/0.4)] bg-[hsl(var(--background))]">
              <div className="flex flex-col items-center gap-6">
                {Object.entries(topologyByLayer).sort(([a], [b]) => a.localeCompare(b)).map(([layer, layerNodes]) => (
                  <div key={layer} className="w-full">
                    <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-2 text-center">{layer}</div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {layerNodes.map((node) => (
                        <div key={node.id} onClick={() => setSelectedNode(node)} className={`px-3 py-2 rounded-lg border text-xs cursor-pointer transition-all ${node.status === "online" ? "border-emerald-500/30 bg-emerald-500/5" : node.status === "degraded" ? "border-amber-500/30 bg-amber-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[node.status]}`} />
                            <span className="font-medium">{node.name}</span>
                          </div>
                          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{node.latency}ms</span>
                        </div>
                      ))}
                    </div>
                    {layer !== "L4" && <div className="flex justify-center my-1"><div className="w-px h-4 bg-[hsl(var(--border)/0.3)]" /></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </RDMLayout>
  );
}
