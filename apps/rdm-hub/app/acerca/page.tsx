"use client";

import { useState } from "react";

const sections = [
  { id: "plataforma", label: "La Plataforma" },
  { id: "equipo", label: "Equipo" },
  { id: "filosofia", label: "Filosofía" },
  { id: "contacto", label: "Contacto" },
];

export default function AcercaPage() {
  const [activeSection, setActiveSection] = useState("plataforma");

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {activeSection === "plataforma" && (
          <>
            <h1 className="font-serif text-4xl font-bold">RDM Digital Hub</h1>
            <p className="text-lg text-[#d4d0c8] leading-relaxed">
              Plataforma territorial inteligente de Real del Monte, Hidalgo. Un ecosistema digital
              que integra mapa interactivo, historia minera, gastronomía, eventos culturales,
              directorio de negocios e inteligencia artificial gobernada.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              {[
                { n: "14+", l: "Módulos" },
                { n: "7", l: "Federaciones" },
                { n: "1", l: "Nodo Cero" },
                { n: "∞", l: "Memoria Viva" },
              ].map((stat) => (
                <div key={stat.l} className="text-center p-6 border border-[#2a2d35] rounded-xl bg-[#121418]">
                  <p className="text-3xl font-bold text-[#c8a356]">{stat.n}</p>
                  <p className="text-sm text-[#9ca3af] mt-1">{stat.l}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeSection === "equipo" && (
          <div className="space-y-6">
            <h1 className="font-serif text-4xl font-bold">Equipo</h1>
            <p className="text-[#9ca3af]">Personas detrás del Nodo Cero.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "TAMV", role: "Arquitecto / Fundador" },
                { name: "Isabella", role: "Núcleo Cognitivo" },
                { name: "Comunidad RDM", role: "Memoria Colectiva" },
              ].map((person) => (
                <div key={person.name} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-[#9ca3af] mt-1">{person.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "filosofia" && (
          <div className="space-y-6">
            <h1 className="font-serif text-4xl font-bold">Filosofía</h1>
            <div className="space-y-4 text-[#d4d0c8] leading-relaxed">
              <p>Real del Monte no es solo un Pueblo Mágico — es un nodo de memoria viva donde la tierra, el trabajo y la cultura se entrelazan desde hace siglos.</p>
              <p>RDM Digital Hub existe para que esa memoria no se pierda, para que cada calle empedrada, cada socavón, cada paste y cada leyenda tenga un lugar en el mapa digital del territorio.</p>
              <p>Creemos en un modelo federado donde la gobernanza es compartida, la economía es circular y la inteligencia artificial está al servicio de la comunidad, no al revés.</p>
            </div>
          </div>
        )}

        {activeSection === "contacto" && (
          <div className="space-y-6">
            <h1 className="font-serif text-4xl font-bold">Contacto</h1>
            <p className="text-[#9ca3af]">Conecta con el equipo.</p>
            <div className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418] space-y-4">
              <div>
                <p className="text-sm text-[#9ca3af]">Correo</p>
                <p className="font-medium">contacto@realdelmonte.digital</p>
              </div>
              <div>
                <p className="text-sm text-[#9ca3af]">Web</p>
                <p className="font-medium">visitarealdelmonte.online</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
