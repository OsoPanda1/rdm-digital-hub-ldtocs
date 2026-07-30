"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="animate-pulse text-[#9ca3af]">Cargando...</div>;
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Panel de control</h1>
        <p className="text-[#9ca3af] mt-1">
          Bienvenido, {user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Territorio", value: "Real del Monte", subtitle: "Pueblo Mágico" },
          { title: "Estado", value: "Nodo Cero", subtitle: "Online" },
          { title: "Isabella", value: "Cognitivo", subtitle: "Gobernado" },
        ].map((card) => (
          <div
            key={card.title}
            className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]"
          >
            <p className="text-sm text-[#9ca3af]">{card.title}</p>
            <p className="text-xl font-semibold mt-2">{card.value}</p>
            <p className="text-sm text-[#6b7280] mt-1">{card.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
