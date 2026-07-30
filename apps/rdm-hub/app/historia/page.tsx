"use client";

import { useState } from "react";

const sections = [
  { id: "cronologia", label: "Cronología" },
  { id: "mineria", label: "Minería" },
  { id: "mitos", label: "Mitos y Leyendas" },
  { id: "dichos", label: "Dichos Mineros" },
];

export default function HistoriaPage() {
  const [activeSection, setActiveSection] = useState("cronologia");

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
        {activeSection === "cronologia" && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold">Historia de Real del Monte</h1>
            <p className="text-[#9ca3af]">Línea del tiempo del Pueblo Mágico.</p>
            <div className="space-y-4">
              {[
                { year: "1550", event: "Descubrimiento de vetas de plata en la región" },
                { year: "1727", event: "Fundación del Real del Monte como centro minero" },
                { year: "1824", event: "Llegada de la Compañía Británica para explotación minera" },
                { year: "1900", event: "Auge de la minería y desarrollo urbano" },
                { year: "2004", event: "Declarado Pueblo Mágico por la Secretaría de Turismo" },
              ].map((item) => (
                <div key={item.year} className="flex gap-4 border-l-2 border-[#c8a356] pl-4 py-2">
                  <span className="text-[#c8a356] font-bold text-sm w-16 shrink-0">{item.year}</span>
                  <span className="text-[#d4d0c8]">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "mineria" && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold">Minería</h1>
            <p className="text-[#9ca3af]">El legado minero que forjó la identidad del pueblo.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Mina de Acosta", desc: "Museo de sitio que muestra la explotación minera del siglo XX" },
                { name: "Panteón Inglés", desc: "Cementerio de la comunidad británica que trabajó en las minas" },
                { name: "Socavón de San Francisco", desc: "Antiguo acceso a las vetas de plata" },
                { name: "Casa Grande", desc: "Residencia de los administradores de la Compañía Británica" },
              ].map((item) => (
                <div key={item.name} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-[#9ca3af] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "mitos" && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold">Mitos y Leyendas</h1>
            <p className="text-[#9ca3af]">Historias que han pasado de generación en generación.</p>
            <div className="space-y-4">
              {[
                { title: "El Charro Negro", desc: "Figura fantasmal que aparece en las calles empedradas durante la noche" },
                { title: "La Llorona del Panteón Inglés", desc: "Se dice que su llanto se escucha entre las tumbas de los mineros" },
                { title: "El Duende de la Mina", desc: "Un pequeño ser que protege los túneles y a los mineros" },
                { title: "Las Ánimas del Socavón", desc: "Espíritus de mineros fallecidos que aún recorren los túneles" },
              ].map((item) => (
                <div key={item.title} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-[#9ca3af] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "dichos" && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold">Dichos Mineros</h1>
            <p className="text-[#9ca3af]">El lenguaje de la minería que aún vive en el habla popular.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { dicho: "A darle al pico", significado: "Ponerse a trabajar" },
                { dicho: "Estar en la veta", significado: "Tener suerte o encontrar algo valioso" },
                { dicho: "Salir a la lumbre", significado: "Salir de un apuro" },
                { dicho: "Hacer pepena", significado: "Recoger lo que otros desecharon" },
              ].map((item) => (
                <div key={item.dicho} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
                  <p className="italic text-[#c8a356]">{item.dicho}</p>
                  <p className="text-sm text-[#9ca3af] mt-1">{item.significado}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
