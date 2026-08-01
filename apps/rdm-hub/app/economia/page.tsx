"use client";

import { useState, useMemo } from "react";
import { Store, Wallet, Heart, Building2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { useNegocios } from "@/hooks/use-negocios";
import { categoryMeta } from "@/lib/images";
import { ECONOMY_HERO } from "@/lib/images";

const tabs = [
  { id: "negocios", label: "Negocios", icon: Store },
  { id: "comercios", label: "Comercios", icon: Building2 },
  { id: "membresias", label: "Membresías", icon: Wallet },
  { id: "donar", label: "Apoyar", icon: Heart },
];

const plans = [
  { name: "Básico", price: "Gratis", features: ["Directorio", "Mapa", "Eventos"] },
  { name: "Comercio", price: "$199/mes", features: ["Perfil de negocio", "Promociones", "Estadísticas"] },
  { name: "Premium", price: "$499/mes", features: ["Prioridad", "API access", "Soporte prioritario"] },
];

export default function EconomiaPage() {
  const [activeTab, setActiveTab] = useState("negocios");
  const { data: negocios } = useNegocios();

  const cats = useMemo(() => {
    if (!negocios) return [];
    const map = new Map<string, number>();
    negocios.forEach((b) => map.set(b.cat, (map.get(b.cat) || 0) + 1));
    return Array.from(map.entries()).map(([cat, count]) => ({ cat, count }));
  }, [negocios]);

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Ecosistema económico"
        title="Economía de Real del Monte"
        subtitle="Un modelo circular y federado donde el comercio local y la comunidad se fortalecen."
        image={ECONOMY_HERO}
      />

      <div className="sticky top-14 z-40 border-b border-[#2a2d35] bg-[#0a0b0e]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 h-14 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                activeTab === t.id ? "bg-[#c8a356]/10 text-[#c8a356]" : "text-[#9ca3af] hover:text-[#e8e6e0]"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {activeTab === "negocios" && (
          <>
            <SectionHeader
              eyebrow="Portal local"
              title="Negocios registrados"
              description="Cada comercio del territorio tiene un lugar en el directorio digital."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cats.map(({ cat, count }) => {
                const meta = categoryMeta(cat);
                return (
                  <div
                    key={cat}
                    className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-6 hover:border-[#c8a356]/60 transition-all duration-300"
                  >
                    <span className="text-3xl" aria-hidden>{meta.emoji}</span>
                    <p className="font-serif text-lg font-bold mt-3">{meta.label}</p>
                    <p className="text-sm text-[#c8a356] mt-1">{count} negocios registrados</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "comercios" && (
          <>
            <SectionHeader
              eyebrow="Herramientas"
              title="Panel de comercios"
              description="Gestión y visibilidad para los negocios del pueblo."
            />
            <div className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-14 text-center space-y-2">
              <Building2 className="h-8 w-8 mx-auto text-[#c8a356]" />
              <p className="font-serif text-xl font-bold">Panel de comercios</p>
              <p className="text-sm text-[#9ca3af]">Próximamente — administra tu perfil, promociones y estadísticas.</p>
            </div>
          </>
        )}

        {activeTab === "membresias" && (
          <>
            <SectionHeader
              eyebrow="Sustenta el hub"
              title="Membresías"
              description="Planes para que los negocios crezcan dentro del ecosistema."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((plan, i) => (
                <div
                  key={plan.name}
                  className={`relative border rounded-2xl bg-[#121418] p-6 ${
                    i === 1 ? "border-[#c8a356] shadow-[0_0_40px_-10px_rgba(200,163,86,0.4)]" : "border-[#2a2d35]"
                  }`}
                >
                  {i === 1 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c8a356] text-[#0a0b0e] text-xs font-bold px-3 py-1 rounded-full">
                      Recomendado
                    </span>
                  )}
                  <h3 className="font-medium text-lg">{plan.name}</h3>
                  <p className="text-3xl font-bold text-[#c8a356] mt-2">{plan.price}</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="text-sm text-[#9ca3af] flex items-center gap-2">
                        <span className="text-[#c8a356]">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "donar" && (
          <>
            <SectionHeader
              eyebrow="Suma tu grano"
              title="Apoya el desarrollo del hub"
              description="Tu aporte sostiene la plataforma territorial y sus herramientas."
            />
            <div className="max-w-xl mx-auto border border-[#2a2d35] rounded-2xl bg-[#121418] p-10 text-center space-y-3">
              <Heart className="h-8 w-8 mx-auto text-[#c8a356]" />
              <p className="font-serif text-xl font-bold">Donaciones</p>
              <p className="text-sm text-[#9ca3af]">Los métodos de donación estarán disponibles pronto.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
