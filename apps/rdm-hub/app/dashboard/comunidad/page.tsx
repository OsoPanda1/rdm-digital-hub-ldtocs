"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ComunidadDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Comunidad</h1>
        <p className="text-[#9ca3af] mt-1">Gestión de la comunidad</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Usuarios registrados", value: "142" },
          { label: "Contribuciones", value: "89" },
          { label: "Contenido generado", value: "234" },
        ].map((s) => (
          <div key={s.label} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418]">
            <p className="text-sm text-[#9ca3af]">{s.label}</p>
            <p className="text-2xl font-bold text-[#c8a356] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
        <h2 className="font-medium mb-4">Actividad reciente</h2>
        <div className="space-y-3">
          {[
            { user: "Cronista RDM", action: "Actualizó la página de historia minera" },
            { user: "Turismo RDM", action: "Agregó 3 nuevas rutas" },
            { user: "Admin", action: "Verificó 5 comercios nuevos" },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-[#c8a356]">{a.user}</span>
              <span className="text-[#9ca3af]">{a.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
