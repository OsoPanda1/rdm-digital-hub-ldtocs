/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDashboardMetrics } from "@/modules/dashboard/hooks/useDashboardMetrics";
import { KpiTile } from "@/modules/dashboard/components/KpiTile";
import { motion } from "framer-motion";
import { Activity, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface SystemHealth {
  apiStatus: "healthy" | "degraded" | "down";
  dbStatus: "healthy" | "degraded" | "down";
  totalUsers: number;
  activeBusinesses: number;
  gamificationEngagement: number;
}

function useSystemHealth() {
  return useQuery<SystemHealth>({
    queryKey: ["system-health"],
    queryFn: async () => {
      const result: SystemHealth = {
        apiStatus: "healthy",
        dbStatus: "healthy",
        totalUsers: 0,
        activeBusinesses: 0,
        gamificationEngagement: 0,
      };

      try {
        const res = await fetch(`${API_BASE}/v1/health`, { signal: AbortSignal.timeout(5000) });
        if (res.ok) result.apiStatus = "healthy";
        else result.apiStatus = "degraded";
      } catch {
        result.apiStatus = "down";
      }

      try {
        const { count } = await supabase.from("businesses").select("*", { count: "exact", head: true });
        result.activeBusinesses = count ?? 0;
      } catch {
        result.dbStatus = "degraded";
      }

      try {
        const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
        result.totalUsers = count ?? 0;
      } catch {
        // non-critical
      }

      try {
        const res = await fetch(`${API_BASE}/v1/gamification/stats`, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          const json = await res.json();
          result.gamificationEngagement = json.totalEvents ?? json.activeUsers ?? 0;
        }
      } catch {
        // non-critical
      }

      return result;
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function DashboardKpis() {
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useDashboardMetrics();
  const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useSystemHealth();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] }),
      queryClient.invalidateQueries({ queryKey: ["system-health"] }),
    ]);
    setRefreshing(false);
  }, [queryClient]);

  if (metricsLoading && healthLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <KpiTile key={i} label="" value="" loading />
        ))}
      </div>
    );
  }

  if (metricsError && !metrics) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm font-mono text-destructive">
            Error cargando métricas: {(metricsError as Error)?.message ?? "snapshot vacío"}
          </div>
          <button onClick={handleRefresh} className="p-2 rounded-xl hover:bg-secondary/20 transition" title="Reintentar">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  const kpis = metrics?.kpis;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-4 w-4 text-gold animate-pulse" />
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
            Snapshot · {metrics?.generated_at ? new Date(metrics.generated_at).toLocaleTimeString("es-MX") : "—"}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-mono text-muted-foreground hover:text-gold hover:bg-secondary/20 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile label="Usuarios totales" value={health?.totalUsers ?? "—"} icon="👥" accent="electric" loading={healthLoading} />
        <KpiTile label="Comercios activos" value={health?.activeBusinesses ?? kpis?.businesses_verified ?? "—"} icon="🏪" accent="teal" loading={healthLoading && !kpis} />
        <KpiTile label="Engagement gamificación" value={health?.gamificationEngagement ?? "—"} icon="🎮" accent="copper" loading={healthLoading} />
        <KpiTile label="API Health" value={health?.apiStatus === "healthy" ? "✓ OK" : health?.apiStatus ?? "—"} icon="🔗" accent={health?.apiStatus === "healthy" ? "teal" : "copper"} loading={healthLoading} />
        <KpiTile label="Lugares activos" value={kpis?.places_active ?? "—"} icon="📍" accent="gold" loading={metricsLoading} />
        <KpiTile label="Eventos próximos" value={kpis?.events_upcoming ?? "—"} icon="🎭" accent="copper" loading={metricsLoading} />
        <KpiTile label="Reservas (24h)" value={kpis?.bookings_24h ?? "—"} icon="🎫" accent="electric" loading={metricsLoading} />
        <KpiTile label="Ingresos 24h" value={kpis?.revenue_24h !== undefined ? `$${kpis.revenue_24h.toLocaleString("es-MX")}` : "—"} icon="💰" accent="gold" loading={metricsLoading} />
      </div>

      {metrics?.breakdown?.event_types && Object.keys(metrics.breakdown.event_types).length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/20 bg-card/30 backdrop-blur-sm p-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Eventos UX por tipo (24h)
          </p>
          <div className="space-y-2">
            {Object.entries(metrics.breakdown.event_types)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([type, count]) => (
                <div key={type} className="flex items-center gap-3 text-xs font-mono">
                  <span className="w-32 truncate text-muted-foreground">{type}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary/20 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-copper"
                      style={{ width: `${Math.min(100, (count / Math.max(...Object.values(metrics.breakdown.event_types))) * 100)}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-gold">{count}</span>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
