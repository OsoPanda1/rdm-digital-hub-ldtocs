"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TerritorioPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Territorio</h1>
        <p className="text-[#9ca3af] mt-1">Monitoreo del estado territorial</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Lugares registrados", value: "47" },
          { label: "Rutas activas", value: "12" },
          { label: "Eventos este mes", value: "6" },
          { label: "Visitantes digitales", value: "1,284" },
        ].map((s) => (
          <div key={s.label} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418]">
            <p className="text-sm text-[#9ca3af]">{s.label}</p>
            <p className="text-2xl font-bold text-[#c8a356] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
        <h2 className="font-medium mb-4">Cobertura territorial</h2>
        <div className="aspect-video rounded-lg bg-[#1a1d24] flex items-center justify-center">
          <p className="text-[#6b7280]">Mapa de cobertura — placeholder</p>
        </div>
      </div>
    </div>
  );
}
