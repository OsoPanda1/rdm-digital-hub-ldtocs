"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EconomiaDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Economía</h1>
        <p className="text-[#9ca3af] mt-1">Panel económico federado</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Comercios activos", value: "24" },
          { label: "Transacciones (30d)", value: "156" },
          { label: "Membresías activas", value: "18" },
        ].map((s) => (
          <div key={s.label} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418]">
            <p className="text-sm text-[#9ca3af]">{s.label}</p>
            <p className="text-2xl font-bold text-[#c8a356] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
        <h2 className="font-medium mb-4">Comercios por categoría</h2>
        <div className="space-y-3">
          {[
            { cat: "Gastronomía", count: 8 },
            { cat: "Hospedaje", count: 5 },
            { cat: "Artesanías", count: 4 },
            { cat: "Servicios", count: 4 },
            { cat: "Turismo", count: 3 },
          ].map((item) => (
            <div key={item.cat} className="flex items-center justify-between text-sm">
              <span className="text-[#9ca3af]">{item.cat}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 rounded-full bg-[#1a1d24] overflow-hidden">
                  <div className="h-full bg-[#c8a356] rounded-full" style={{ width: `${(item.count / 8) * 100}%` }} />
                </div>
                <span className="text-[#e8e6e0] w-4 text-right">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
