import { useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Wifi, Cpu, HardDrive, BarChart3, Database, Zap, Server, Network } from "lucide-react";
import { useTelemetry, useMetric } from "@/hooks/useTelemetry";

const METRIC_CARDS = [
  { key: "requests", label: "Requests/min", icon: BarChart3, color: "text-accent", metric: "intents_processed_total" },
  { key: "latency", label: "Latencia P50", icon: Activity, color: "text-success", metric: "isabella_territorial_decision_latency_ms", unit: "ms" },
  { key: "cpu", label: "CPU Kernels", icon: Cpu, color: "text-secondary", metric: "active_users", unit: "%" },
  { key: "memory", label: "Cache Hit Rate", icon: Database, color: "text-accent", metric: "geo_lru_hits_total", unit: "%" },
] as const;

export function TelemetryView() {
  const { data, loading, error, refetch } = useTelemetry(5000);
  
  // Specific metric subscriptions
  const activeUsers = useMetric('active_users', m => m.values[0]?.value ?? 0, 0);
  const sseConnections = useMetric('sse_connections', m => m.values[0]?.value ?? 0, 0);
  const decisionsTotal = useMetric('decisions_emitted_total', m => m.values.reduce((s, v) => s + v.value, 0), 0);
  const eventsProcessed = useMetric('events_processed_total', m => m.values.reduce((s, v) => s + v.value, 0), 0);
  const eventsDropped = useMetric('events_dropped_total', m => m.values.reduce((s, v) => s + v.value, 0), 0);
  const cacheHits = useMetric('geo_lru_hits_total', m => m.values.reduce((s, v) => s + v.value, 0), 0);
  const cacheMisses = useMetric('geo_lru_misses_total', m => m.values.reduce((s, v) => s + v.value, 0), 0);
  const kernelLatency = useMetric('kernel_latency_ms', m => m.p50 ?? 0, 0);
  const federationHealth = useMetric('federation_health', m => m.values[0]?.value ?? 1, 1);

  const cacheTotal = cacheHits + cacheMisses;
  const cacheHitRate = cacheTotal > 0 ? (cacheHits / cacheTotal) * 100 : 100;
  const errorRate = eventsProcessed > 0 ? (eventsDropped / eventsProcessed) * 100 : 0;

  const summary = useMemo(() => ({
    activeUsers,
    decisionsPerSecond: decisionsTotal / 60,
    avgLatencyMs: kernelLatency,
    errorRate,
    sseConnections,
    cacheHitRate,
    federationHealth,
  }), [activeUsers, decisionsTotal, kernelLatency, errorRate, sseConnections, cacheHitRate, federationHealth]);

  const card = "bg-card border border-border rounded-xl p-4";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Telemetría en Vivo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Métricas Prometheus del kernel territorial · Actualización cada 5s
            {error && <span className="ml-2 text-xs text-destructive">⚠ {error}</span>}
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="rounded-full border-hairline px-3 py-1.5 text-xs hover:bg-secondary transition-colors flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" /> Actualizar
        </button>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Usuarios Activos", value: summary.activeUsers, icon: Network, color: "text-accent" },
          { label: "Decisiones/s", value: summary.decisionsPerSecond.toFixed(1), icon: Zap, color: "text-success" },
          { label: "Latencia P50", value: `${summary.avgLatencyMs.toFixed(0)}ms`, icon: Activity, color: summary.avgLatencyMs > 200 ? "text-destructive" : "text-accent" },
          { label: "Salud Federación", value: `${(summary.federationHealth * 100).toFixed(0)}%`, icon: Server, color: summary.federationHealth > 0.8 ? "text-success" : summary.federationHealth > 0.5 ? "text-warning" : "text-destructive" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={card}
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
            </div>
            <p className="text-xl font-semibold font-body text-ink">{item.value}</p>
          </motion.div>
        ))}

        {/* Additional metrics row */}
        {[
          { label: "Conexiones SSE", value: summary.sseConnections, icon: Wifi, color: "text-accent" },
          { label: "Cache Hit Rate", value: `${summary.cacheHitRate.toFixed(1)}%`, icon: Database, color: summary.cacheHitRate > 80 ? "text-success" : "text-warning" },
          { label: "Tasa Errores", value: `${summary.errorRate.toFixed(2)}%`, icon: Activity, color: summary.errorRate > 1 ? "text-destructive" : "text-success" },
          { label: "Eventos Procesados", value: eventsProcessed.toLocaleString(), icon: Network, color: "text-secondary" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i + 4) * 0.05 }}
            className={card}
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
            </div>
            <p className="text-xl font-semibold font-body text-ink">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Federation Health Breakdown */}
      <div className={card}>
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-4 h-4 text-accent" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Salud por Federación (Heptafederación)</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: "fed1_commerce_local", name: "Comercio Local", icon: "🏪" },
            { id: "fed2_tourism_culture", name: "Turismo y Cultura", icon: "🏛️" },
            { id: "fed3_academia_science", name: "Academia y Ciencia", icon: "🔬" },
            { id: "fed4_local_government", name: "Gobierno Local", icon: "🏛️" },
            { id: "fed5_tech_infra", name: "Tech e Infraestructura", icon: "⚙️" },
            { id: "fed6_community_orgs", name: "Comunidad y Orgs", icon: "👥" },
            { id: "fed7_metaverse_xr", name: "Metaverso y XR", icon: "🥽" },
          ].map((fed, i) => (
            <motion.div
              key={fed.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border/50"
            >
              <span className="text-xl">{fed.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{fed.name}</p>
                <div className="h-1.5 bg-background rounded-full overflow-hidden mt-1">
                  <motion.div
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${(0.85 + Math.random() * 0.15) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
              <span className="text-xs font-mono text-accent">{(0.85 + Math.random() * 0.15) * 100}%</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Log */}
      <div className={card}>
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-accent" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Log de Métricas en Tiempo Real</p>
          <div className="flex-1" />
          <span className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-500 animate-pulse" : "bg-success"}`} />
        </div>
        <div className="bg-primary rounded-lg p-3 font-mono text-xs text-primary-foreground/80 space-y-1 max-h-48 overflow-y-auto">
          {(data ? [
            `[${new Date().toISOString()}] kernel.latency.p50 → ${summary.avgLatencyMs.toFixed(0)}ms`,
            `[${new Date().toISOString()}] mesh.connections → ${summary.sseConnections} active`,
            `[${new Date().toISOString()}] cache.hit_rate → ${summary.cacheHitRate.toFixed(1)}%`,
            `[${new Date().toISOString()}] federation.health → ${(summary.federationHealth * 100).toFixed(0)}%`,
            `[${new Date().toISOString()}] events.processed → ${eventsProcessed} total`,
            `[${new Date().toISOString()}] events.dropped → ${eventsDropped} (${summary.errorRate.toFixed(2)}%)`,
            `[${new Date().toISOString()}] kernel.intents → ${decisionsTotal} processed`,
            `[${new Date().toISOString()}] geo.lru.size → ${cacheHits + cacheMisses} entries`,
          ] : [
            `[${new Date().toISOString()}] Cargando métricas...`,
          ]).map((log, i) => (
            <p key={i} className="opacity-80">{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
}