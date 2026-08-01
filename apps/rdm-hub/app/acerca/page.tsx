"use client";

import { useState } from "react";
import { Rocket, Users, Compass, Mail } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { LANDSCAPE_ALT } from "@/lib/images";

const tabs = [
  { id: "plataforma", label: "La Plataforma", icon: Rocket },
  { id: "equipo", label: "Equipo", icon: Users },
  { id: "filosofia", label: "Filosofía", icon: Compass },
  { id: "contacto", label: "Contacto", icon: Mail },
];

export default function AcercaPage() {
  const [activeTab, setActiveTab] = useState("plataforma");

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Nodo Cero"
        title="Acerca de RDM Digital Hub"
        subtitle="Plataforma territorial inteligente de Real del Monte, Hidalgo."
        image={LANDSCAPE_ALT}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {activeTab === "plataforma" && (
          <>
            <SectionHeader
              eyebrow="Qué es"
              title="RDM Digital Hub"
              description="Un ecosistema digital que integra mapa interactivo, historia minera, gastronomía, eventos culturales, directorio de negocios e inteligencia artificial gobernada."
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { n: "14+", l: "Módulos" },
                { n: "7", l: "Federaciones" },
                { n: "1", l: "Nodo Cero" },
                { n: "∞", l: "Memoria Viva" },
              ].map((stat) => (
                <div key={stat.l} className="text-center p-6 border border-[#2a2d35] rounded-2xl bg-[#121418]">
                  <p className="text-3xl font-bold text-[#c8a356]">{stat.n}</p>
                  <p className="text-sm text-[#9ca3af] mt-1">{stat.l}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "equipo" && (
          <>
            <SectionHeader eyebrow="Personas" title="Detrás del Nodo Cero" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: "TAMV", role: "Arquitecto / Fundador", emoji: "🧭" },
                { name: "Isabella", role: "Núcleo Cognitivo", emoji: "✨" },
                { name: "Comunidad RDM", role: "Memoria Colectiva", emoji: "🤝" },
              ].map((person) => (
                <div key={person.name} className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-6 text-center">
                  <span className="text-4xl" aria-hidden>{person.emoji}</span>
                  <p className="font-serif text-lg font-bold mt-3">{person.name}</p>
                  <p className="text-sm text-[#9ca3af] mt-1">{person.role}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "filosofia" && (
          <>
            <SectionHeader eyebrow="Principios" title="Nuestra visión" />
            <div className="space-y-4 text-[#d4d0c8] leading-relaxed">
              <p>
                Real del Monte no es solo un Pueblo Mágico — es un nodo de memoria viva donde la tierra,
                el trabajo y la cultura se entrelazan desde hace siglos.
              </p>
              <p>
                RDM Digital Hub existe para que esa memoria no se pierda, para que cada calle empedrada,
                cada socavón, cada paste y cada leyenda tenga un lugar en el mapa digital del territorio.
              </p>
              <p>
                Creemos en un modelo federado donde la gobernanza es compartida, la economía es circular
                y la inteligencia artificial está al servicio de la comunidad, no al revés.
              </p>
            </div>
          </>
        )}

        {activeTab === "contacto" && (
          <>
            <SectionHeader eyebrow="Conecta" title="Contacto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: "Correo", value: "contacto@realdelmonte.digital" },
                { label: "Web", value: "visitarealdelmonte.online" },
                { label: "Territorio", value: "Real del Monte, Hidalgo" },
                { label: "Comunidad", value: "Comunidad RDM" },
              ].map((c) => (
                <div key={c.label} className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-6">
                  <p className="text-sm text-[#9ca3af]">{c.label}</p>
                  <p className="font-medium mt-1">{c.value}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
