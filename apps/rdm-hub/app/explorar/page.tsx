"use client";

import { useState } from "react";
import Link from "next/link";

const sections = [
  { id: "mapa", label: "Mapa" },
  { id: "lugares", label: "Lugares" },
  { id: "rutas", label: "Rutas" },
  { id: "gemelo", label: "Gemelo Digital" },
];

export default function ExplorarPage() {
  const [activeSection, setActiveSection] = useState("mapa");

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
              <p className="text-[#6b7280]">Mapa interactivo — placeholder</p>
            </div>
          </div>
        )}

        {activeSection === "lugares" && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold">Lugares</h1>
            <p className="text-[#9ca3af]">Descubre los puntos de interés del Pueblo Mágico.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Museo de Medicina Laboral",
                "Panteón Inglés",
                "Parroquia de Nuestra Señora de la Asunción",
                "Mina de Acosta",
                "Plaza de la Constitución",
                "Museo Paste",
              ].map((place) => (
                <div key={place} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418] hover:border-[#c8a356] transition-colors">
                  <p className="font-medium">{place}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "rutas" && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold">Rutas y Experiencias</h1>
            <p className="text-[#9ca3af]">Recorridos temáticos por el territorio.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Ruta del Paste", desc: "Recorrido gastronómico por las pasteurías tradicionales" },
                { name: "Ruta Minera", desc: "Historia viva de las minas de Real del Monte" },
                { name: "Ruta Cultural", desc: "Museos, galerías y patrimonio arquitectónico" },
                { name: "Ruta Ecoturística", desc: "Senderos y áreas naturales alrededor del pueblo" },
              ].map((ruta) => (
                <div key={ruta.name} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
                  <h3 className="font-medium">{ruta.name}</h3>
                  <p className="text-sm text-[#9ca3af] mt-1">{ruta.desc}</p>
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
              <p className="text-[#6b7280]">Gemelo Digital 3D — placeholder</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
