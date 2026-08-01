"use client";

import { useState, useMemo } from "react";
import { Map, MapPinned, Mountain, Boxes } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { TerritoryMap } from "@/components/territory-map";
import { SmartImage } from "@/components/smart-image";
import { PlaceCard, RouteCard } from "@/components/cards";
import { usePlaces } from "@/hooks/use-places";
import { useRutas } from "@/hooks/use-rutas";
import { categoryMeta } from "@/lib/images";
import { STREET_HERO } from "@/lib/images";

const tabs = [
  { id: "mapa", label: "Mapa", icon: Map },
  { id: "lugares", label: "Lugares", icon: MapPinned },
  { id: "rutas", label: "Rutas", icon: Mountain },
  { id: "gemelo", label: "Gemelo Digital", icon: Boxes },
];

export default function ExplorarPage() {
  const [activeTab, setActiveTab] = useState("mapa");
  const [activeCat, setActiveCat] = useState("Todos");
  const { data: places, isLoading } = usePlaces();
  const { data: rutas } = useRutas();

  const cats = useMemo(() => {
    if (!places) return ["Todos"];
    return ["Todos", ...[...new Set(places.map((p) => p.cat))]];
  }, [places]);

  const filteredPlaces = useMemo(() => {
    if (!places) return [];
    return activeCat === "Todos" ? places : places.filter((p) => p.cat === activeCat);
  }, [places, activeCat]);

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Territorio"
        title="Explora Real del Monte"
        subtitle="Mapa interactivo, lugares históricos y rutas temáticas del Pueblo Mágico."
        image={STREET_HERO}
      />

      <div className="sticky top-14 z-40 border-b border-[#2a2d35] bg-[#0a0b0e]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 h-14 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? "bg-[#c8a356]/10 text-[#c8a356]"
                  : "text-[#9ca3af] hover:text-[#e8e6e0]"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === "mapa" && (
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Mapa interactivo"
              title="El territorio en tus manos"
              description="Cada punto es un lugar de interés. Haz clic para ver su historia, dirección y descripción."
            />
            {isLoading ? (
              <div className="h-[420px] sm:h-[520px] rounded-2xl border border-[#2a2d35] bg-[#121418] flex items-center justify-center text-[#6b7280]">
                Cargando lugares…
              </div>
            ) : (
              <TerritoryMap places={places ?? []} />
            )}
          </div>
        )}

        {activeTab === "lugares" && (
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Puntos de interés"
              title="Lugares del Pueblo Mágico"
              description="Filtra por categoría para descubrir museos, minas, templos y naturaleza."
            />
            <div className="flex items-center gap-1.5 flex-wrap">
              {cats.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors border ${
                    activeCat === cat
                      ? "bg-[#c8a356]/15 border-[#c8a356]/60 text-[#c8a356]"
                      : "border-[#2a2d35] text-[#9ca3af] hover:text-[#e8e6e0] hover:border-[#3a3e49]"
                  }`}
                >
                  {cat === "Todos" ? "Todos" : categoryMeta(cat).label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPlaces.map((p) => (
                <PlaceCard key={p.id} place={p} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "rutas" && (
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Rutas y experiencias"
              title="Recorridos temáticos"
              description="A pie, en mina o en el bosque: la mejor forma de conocer el territorio."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(rutas ?? []).map((r) => (
                <RouteCard key={r.id} ruta={r} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "gemelo" && (
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Gemelo Digital"
              title="Réplica del territorio"
              description="La visualización 3D del pueblo y sus datos en tiempo real."
            />
            <div className="relative overflow-hidden rounded-2xl border border-[#2a2d35] bg-gradient-to-br from-[#1a2414] via-[#0d0e12] to-[#0a0b0e] h-[420px] flex items-center justify-center">
              <div className="absolute inset-0 opacity-40" aria-hidden>
                <SmartImage category="naturaleza" alt="" className="h-full w-full" />
              </div>
              <div className="relative text-center space-y-3 px-6">
                <p className="text-5xl" aria-hidden>🌐</p>
                <p className="font-serif text-2xl font-bold">Gemelo Digital 3D</p>
                <p className="text-[#9ca3af] max-w-md mx-auto text-sm">
                  La maqueta interactiva del territorio llega en una próxima fase.
                  Mientras tanto, explora el mapa y las rutas en vivo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
