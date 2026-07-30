"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHealth } from "@/hooks/use-health";

export default function ObservabilidadPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data: health, isLoading } = useHealth();

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Observabilidad</h1>
        <p className="text-[#9ca3af] mt-1">Monitoreo del sistema y telemetría</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-green-800 rounded-xl p-4 bg-green-900/10">
          <p className="text-sm text-green-400">Estado del nodo</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{health?.status ?? "—"}</p>
        </div>
        <div className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418]">
          <p className="text-sm text-[#9ca3af]">Base de datos</p>
          <p className="text-2xl font-bold mt-1">{health?.db?.connected ? "Online" : "—"}</p>
        </div>
        <div className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418]">
          <p className="text-sm text-[#9ca3af]">Región</p>
          <p className="text-2xl font-bold mt-1">{health?.supabase_region ?? "—"}</p>
        </div>
        <div className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418]">
          <p className="text-sm text-[#9ca3af]">API</p>
          <p className="text-2xl font-bold text-green-400 mt-1">Online</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
          <h2 className="font-medium mb-4">Federaciones</h2>
          <div className="space-y-2 text-sm">
            {[
              "F1 — Gobernanza", "F2 — Identidad", "F3 — Datos",
              "F4 — Comercio", "F5 — IA", "F6 — Comunidad", "F7 — Observabilidad",
            ].map((f) => (
              <div key={f} className="flex items-center justify-between">
                <span className="text-[#9ca3af]">{f}</span>
                <span className="text-green-400 text-xs">● Operational</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
          <h2 className="font-medium mb-4">Telemetría</h2>
          {isLoading ? (
            <div className="text-[#6b7280] text-sm">Cargando...</div>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#9ca3af]">Latencia DB</span>
                <span className="text-[#e8e6e0] font-mono">{health?.db?.latency_ms ?? "—"}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9ca3af]">Tablas</span>
                <span className="text-[#e8e6e0] font-mono">{health?.db?.tables?.length ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9ca3af]">Políticas</span>
                <span className="text-[#e8e6e0] font-mono">{health?.policies?.active ?? "—"} activas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9ca3af]">Herramientas</span>
                <span className="text-[#e8e6e0] font-mono">{health?.tools?.active ?? "—"} activas</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
