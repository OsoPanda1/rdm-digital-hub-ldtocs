"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type HealthStatus = {
  status: string;
  uptime: number;
  region: string;
};

export default function ObservabilidadPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth");
  }, [user, isLoading, router]);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => {});
  }, []);

  if (isLoading || !user) return null;

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
          <p className="text-sm text-[#9ca3af]">Uptime</p>
          <p className="text-2xl font-bold mt-1">{health ? `${Math.round(health.uptime)}s` : "—"}</p>
        </div>
        <div className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418]">
          <p className="text-sm text-[#9ca3af]">Región</p>
          <p className="text-2xl font-bold mt-1">{health?.region ?? "—"}</p>
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
          <div className="space-y-4 text-sm">
            {[
              { metric: "Latencia API", value: "45ms" },
              { metric: "Peticiones/min", value: "23" },
              { metric: "Errores (24h)", value: "0" },
              { metric: "Memoria", value: "128 MB" },
            ].map((m) => (
              <div key={m.metric} className="flex items-center justify-between">
                <span className="text-[#9ca3af]">{m.metric}</span>
                <span className="text-[#e8e6e0] font-mono">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
