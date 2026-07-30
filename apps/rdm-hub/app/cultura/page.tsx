"use client";

import { useState } from "react";

const sections = [
  { id: "patrimonio", label: "Patrimonio" },
  { id: "galeria", label: "Galería" },
  { id: "musica", label: "Música" },
  { id: "archivo", label: "Archivo Sonoro" },
  { id: "arte", label: "Arte" },
];

export default function CulturaPage() {
  const [activeSection, setActiveSection] = useState("patrimonio");

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
        <h1 className="font-serif text-3xl font-bold">Cultura</h1>
        <p className="text-[#9ca3af]">La riqueza cultural de Real del Monte.</p>

        {activeSection === "patrimonio" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Parroquia de la Asunción",
              "Panteón Inglés",
              "Palacio Municipal",
              "Casa de la Cultura",
              "Museo de Medicina Laboral",
              "Teatro Hidalgo",
            ].map((item) => (
              <div key={item} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418]">
                <p className="font-medium">{item}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === "galeria" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-xl border border-[#2a2d35] bg-[#121418] flex items-center justify-center">
                <p className="text-[#6b7280] text-sm">Imagen {i}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === "musica" && (
          <div className="space-y-4">
            {[
              "Canto a Real del Monte",
              "Corrido Minero",
              "Sones de Hidalgo",
              "Música de Viento",
            ].map((track) => (
              <div key={track} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418] flex items-center justify-between">
                <p className="font-medium">{track}</p>
                <button className="text-[#c8a356] text-sm hover:underline">Reproducir</button>
              </div>
            ))}
          </div>
        )}

        {activeSection === "archivo" && (
          <div className="space-y-4">
            <p className="text-[#9ca3af]">Archivo sonoro con grabaciones históricas y testimonios.</p>
            <div className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418] text-center">
              <p className="text-[#6b7280]">Archivo sonoro — próximamente</p>
            </div>
          </div>
        )}

        {activeSection === "arte" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Artesanía en Cantera", desc: "Tallado en piedra volcánica" },
              { name: "Textiles Tradicionales", desc: "Bordados y tejidos de la región" },
              { name: "Pintura Mural", desc: "Murales que narran la historia minera" },
              { name: "Arte Contemporáneo", desc: "Expresiones artísticas modernas" },
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
