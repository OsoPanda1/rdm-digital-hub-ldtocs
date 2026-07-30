"use client";

import { useState } from "react";
import { usePlaces } from "@/hooks/use-places";
import { routes } from "@/lib/data";

const sections = [
  { id: "mapa", label: "Mapa" },
  { id: "lugares", label: "Lugares" },
  { id: "rutas", label: "Rutas" },
  { id: "gemelo", label: "Gemelo Digital" },
];

export default function ExplorarPage() {
  const [activeSection, setActiveSection] = useState("mapa");
  const { data: places, isLoading } = usePlaces();

  return (
    <div className="min-h-screen">
      <div className="border-b border-[#2a2d35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-14 overflow-x-auto">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                  activeSection === s.id
                    ? "bg-[#c8a356]/10 text-[#c8a356]"
                    : "text-[#9ca3af] hover:text-[#e8e6e0]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === "mapa" && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold">Mapa del Territorio</h1>
            <p className="text-[#9ca3af]">Explora Real del Monte a través de capas interactivas: histórico, turístico, cultural y económico.</p>
            <div className="aspect-video rounded-xl border border-[#2a2d35] bg-[#121418] flex items-center justify-center">
              <p className="text-[#6b7280]">Mapa interactivo — próximamente</p>
            </div>
          </div>
        )}

        {activeSection === "lugares" && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold">Lugares</h1>
            <p className="text-[#9ca3af]">Descubre los puntos de interés del Pueblo Mágico.</p>
            {isLoading ? (
              <div className="text-[#6b7280]">Cargando lugares...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {places?.map((p) => (
                  <div key={p.id} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418] hover:border-[#c8a356] transition-colors">
                    <span className="text-xs text-[#c8a356] font-medium">{p.cat}</span>
                    <p className="font-medium mt-1">{p.name}</p>
                    <p className="text-sm text-[#9ca3af] mt-1 line-clamp-2">{p.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "rutas" && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold">Rutas y Experiencias</h1>
            <p className="text-[#9ca3af]">Recorridos temáticos por el territorio.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map((ruta) => (
                <div key={ruta.name} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
                  <span className="text-xs text-[#c8a356] font-medium">{ruta.category}</span>
                  <h3 className="font-medium mt-1">{ruta.name}</h3>
                  <p className="text-sm text-[#9ca3af] mt-1">{ruta.description}</p>
                  <p className="text-xs text-[#6b7280] mt-2">{ruta.duration} · {ruta.distance} km</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "gemelo" && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold">Gemelo Digital</h1>
            <p className="text-[#9ca3af]">Réplica digital del territorio con datos en tiempo real.</p>
            <div className="aspect-video rounded-xl border border-[#2a2d35] bg-[#121418] flex items-center justify-center">
              <p className="text-[#6b7280]">Gemelo Digital 3D — próximamente</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
