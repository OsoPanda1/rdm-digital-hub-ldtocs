"use client";

import { useState } from "react";

const sections = [
  { id: "pastes", label: "Pastes" },
  { id: "ruta", label: "Ruta del Paste" },
  { id: "restaurantes", label: "Restaurantes" },
  { id: "platillos", label: "Platillos" },
];

export default function GastronomiaPage() {
  const [activeSection, setActiveSection] = useState("pastes");

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="font-serif text-3xl font-bold">Gastronomía</h1>
        <p className="text-[#9ca3af]">Los sabores de Real del Monte.</p>

        {activeSection === "pastes" && (
          <div className="space-y-6">
            <p>El paste es el platillo emblemático, herencia de la minería británica. Una masa rellena de diversos ingredientes.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Paste de Carne", desc: "Relleno de res, papa y especias" },
                { name: "Paste de Pollo", desc: "Pollo deshebrado con verduras" },
                { name: "Paste de Queso", desc: "Queso gratinado con epazote" },
                { name: "Paste de Piña", desc: "Relleno dulce de piña" },
                { name: "Paste de Frijol", desc: "Frijol refrito con queso" },
                { name: "Paste de Tinga", desc: "Tinga de pollo estilo tradicional" },
              ].map((item) => (
                <div key={item.name} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418]">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-[#9ca3af] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "ruta" && (
          <div className="space-y-4">
            <p className="text-[#9ca3af]">Recorrido por las pasteurías tradicionales de Real del Monte.</p>
            {[
              "Pasteuría La Mina",
              "Pasteuría El Real",
              "Pasteuría Británica",
              "Pasteuría San Francisco",
              "Pasteuría La Blanca",
            ].map((item) => (
              <div key={item} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418] flex items-center justify-between">
                <p className="font-medium">{item}</p>
                <span className="text-[#c8a356] text-sm">→</span>
              </div>
            ))}
          </div>
        )}

        {activeSection === "restaurantes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Restaurante El Edén", tipo: "Tradicional" },
              { name: "Casa de los Abuelos", tipo: "Familiar" },
              { name: "La Terraza", tipo: "Mirador" },
              { name: "El Museo del Paste", tipo: "Especializado" },
            ].map((item) => (
              <div key={item.name} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-[#9ca3af] mt-1">{item.tipo}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === "platillos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Pastes", desc: "El ícono gastronómico minero" },
              { name: "Barbacoa", desc: "Estilo hidalguense en penca de maguey" },
              { name: "Mixiotes", desc: "Carne adobada envuelta en hoja de maguey" },
              { name: "Pulque", desc: "Bebida fermentada tradicional" },
            ].map((item) => (
              <div key={item.name} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-[#9ca3af] mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
