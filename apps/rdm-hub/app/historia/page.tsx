"use client";

import { useState } from "react";
import { Ghost, Pickaxe, Quote, History } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { SmartImage } from "@/components/smart-image";
import { historiaEntries } from "@/lib/data";
import { MINE_HERO } from "@/lib/images";

const tabs = [
  { id: "cronologia", label: "Cronología", icon: History },
  { id: "mineria", label: "Minería", icon: Pickaxe },
  { id: "mitos", label: "Mitos y Leyendas", icon: Ghost },
  { id: "dichos", label: "Dichos Mineros", icon: Quote },
];

const mineria = [
  { name: "Mina de Acosta", desc: "Museo de sitio que muestra la explotación minera del siglo XX. Puedes descender por su socavón original." },
  { name: "Panteón Inglés", desc: "Cementerio de la comunidad británica de Cornualles, construido en 1862. Todas sus tumbas apuntan al Mar del Norte." },
  { name: "Socavón de San Francisco", desc: "Antiguo acceso a las vetas de plata que dio origen al real de minas." },
  { name: "Casa Grande", desc: "Residencia de los administradores de la Compañía Británica en la cima del pueblo." },
];

const leyendas = [
  { title: "El Charro Negro", desc: "Figura fantasmal que aparece en las calles empedradas durante la noche." },
  { title: "La Llorona del Panteón Inglés", desc: "Se dice que su llanto se escucha entre las tumbas de los mineros." },
  { title: "El Duende de la Mina", desc: "Un pequeño ser que protege los túneles y a los mineros." },
  { title: "Las Ánimas del Socavón", desc: "Espíritus de mineros fallecidos que aún recorren los túneles." },
];

const dichos = [
  { dicho: "A darle al pico", significado: "Ponerse a trabajar" },
  { dicho: "Estar en la veta", significado: "Tener suerte o encontrar algo valioso" },
  { dicho: "Salir a la lumbre", significado: "Salir de un apuro" },
  { dicho: "Hacer pepena", significado: "Recoger lo que otros desecharon" },
];

export default function HistoriaPage() {
  const [activeTab, setActiveTab] = useState("cronologia");

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Memoria del territorio"
        title="Historia de Real del Monte"
        subtitle="Del real de minas a Pueblo Mágico: cinco siglos de plata, trabajo y memoria colectiva."
        image={MINE_HERO}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === "cronologia" && (
          <div className="space-y-8">
            <SectionHeader
              eyebrow="Línea del tiempo"
              title="Cronología del pueblo minero"
              description="Los hitos que definieron la identidad de Real del Monte."
            />
            <div className="relative">
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-[#2a2d35]" aria-hidden />
              <div className="space-y-10">
                {historiaEntries.map((item, i) => (
                  <div
                    key={item.year}
                    className={`relative flex flex-col sm:flex-row gap-4 sm:gap-0 ${
                      i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div className="hidden sm:flex sm:w-1/2" />
                    <div
                      className={`flex items-start gap-4 sm:w-1/2 ${
                        i % 2 === 0 ? "sm:pr-10" : "sm:pl-10 sm:flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`absolute left-4 sm:left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-[#c8a356] ring-4 ring-[#0a0b0e] ${
                          i % 2 === 0 ? "" : ""
                        }`}
                        style={{ top: 8 }}
                        aria-hidden
                      />
                      <div className="ml-8 sm:ml-0 w-full border border-[#2a2d35] rounded-2xl bg-[#121418] p-5 hover:border-[#c8a356]/50 transition-colors">
                        <span className="inline-block bg-[#c8a356]/15 text-[#d4b26a] text-sm font-bold px-3 py-1 rounded-lg">
                          {item.year}
                        </span>
                        <p className="mt-2 text-[#d4d0c8]">{item.event}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "mineria" && (
          <div className="space-y-8">
            <SectionHeader
              eyebrow="El legado británico"
              title="Minería"
              description="El oro y la plata que forjaron al pueblo, con la herencia de Cornualles."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mineria.map((item, i) => (
                <article
                  key={item.name}
                  className="group border border-[#2a2d35] rounded-2xl overflow-hidden bg-[#121418] hover:border-[#c8a356]/60 transition-all duration-300"
                >
                  <SmartImage category="mineria" alt={item.name} className="h-44" overlay />
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif text-lg font-bold group-hover:text-[#d4b26a] transition-colors">{item.name}</h3>
                    <p className="text-sm text-[#9ca3af]">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === "mitos" && (
          <div className="space-y-8">
            <SectionHeader
              eyebrow="Tradición oral"
              title="Mitos y leyendas"
              description="Historias que han pasado de generación en generación."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {leyendas.map((item) => (
                <article
                  key={item.title}
                  className="group border border-[#2a2d35] rounded-2xl bg-[#121418] p-6 hover:border-[#c8a356]/60 transition-all duration-300"
                >
                  <Ghost className="h-6 w-6 text-[#c8a356] mb-3" />
                  <h3 className="font-serif text-lg font-bold group-hover:text-[#d4b26a] transition-colors">{item.title}</h3>
                  <p className="text-sm text-[#9ca3af] mt-1">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === "dichos" && (
          <div className="space-y-8">
            <SectionHeader
              eyebrow="Lenguaje minero"
              title="Dichos que siguen vivos"
              description="El habla popular heredado de la minería sigue presente en la calle."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {dichos.map((item) => (
                <div key={item.dicho} className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-6">
                  <p className="italic font-serif text-lg text-[#d4b26a]">«{item.dicho}»</p>
                  <p className="text-sm text-[#9ca3af] mt-2">{item.significado}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
