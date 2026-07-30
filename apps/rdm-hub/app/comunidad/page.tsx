"use client";

import { useState } from "react";

const sections = [
  { id: "feed", label: "Feed" },
  { id: "wiki", label: "Wiki" },
  { id: "enciclopedia", label: "Enciclopedia" },
  { id: "leaderboard", label: "Leaderboard" },
];

export default function ComunidadPage() {
  const [activeSection, setActiveSection] = useState("feed");

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
        <h1 className="font-serif text-3xl font-bold">Comunidad</h1>
        <p className="text-[#9ca3af]">El corazón digital de Real del Monte.</p>

        {activeSection === "feed" && (
          <div className="space-y-4">
            {[
              { user: "Cronista RDM", text: "Hoy se cumplen 100 años de la última gran extracción en la Mina de Acosta." },
              { user: "Turismo RDM", text: "Nueva ruta gastronómica del paste disponible." },
              { user: "Comunidad", text: "Invitación a la feria anual del Pueblo Mágico." },
            ].map((post, i) => (
              <div key={i} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418]">
                <p className="text-sm text-[#c8a356]">{post.user}</p>
                <p className="mt-2">{post.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === "wiki" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Historia Minera",
              "Geografía",
              "Arquitectura",
              "Personajes Ilustres",
              "Festividades",
              "Flora y Fauna",
            ].map((topic) => (
              <div key={topic} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418] hover:border-[#c8a356] transition-colors cursor-pointer">
                <p className="font-medium">{topic}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === "enciclopedia" && (
          <div>
            <p className="text-[#9ca3af] mb-4">Enciclopedia colaborativa del territorio.</p>
            <div className="border border-[#2a2d35] rounded-xl p-8 bg-[#121418] text-center">
              <p className="text-[#6b7280]">Enciclopedia — construyendo conocimiento colectivo</p>
            </div>
          </div>
        )}

        {activeSection === "leaderboard" && (
          <div className="space-y-4">
            <p className="text-[#9ca3af]">Contribuyentes destacados de la comunidad.</p>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[#c8a356] font-bold">#{i}</span>
                  <span>Usuario_{i}</span>
                </div>
                <span className="text-sm text-[#9ca3af]">{1000 - i * 100} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
