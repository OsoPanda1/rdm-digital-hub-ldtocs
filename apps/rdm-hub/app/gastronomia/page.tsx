"use client";

import { useState } from "react";
import { Croissant, Map as MapIcon, UtensilsCrossed, Soup } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { BusinessCard } from "@/components/cards";
import { useNegocios } from "@/hooks/use-negocios";
import { FOOD_HERO } from "@/lib/images";

const tabs = [
  { id: "pastes", label: "Pastes", icon: Croissant },
  { id: "ruta", label: "Ruta del Paste", icon: MapIcon },
  { id: "restaurantes", label: "Restaurantes", icon: UtensilsCrossed },
  { id: "platillos", label: "Platillos", icon: Soup },
];

const pastes = [
  { name: "Paste de Carne", desc: "Relleno de res, papa y especias" },
  { name: "Paste de Pollo", desc: "Pollo deshebrado con verduras" },
  { name: "Paste de Queso", desc: "Queso gratinado con epazote" },
  { name: "Paste de Piña", desc: "Relleno dulce de piña" },
  { name: "Paste de Frijol", desc: "Frijol refrito con queso" },
  { name: "Paste de Tinga", desc: "Tinga de pollo estilo tradicional" },
];

const pasteurias = [
  "Pasteuría La Mina",
  "Pasteuría El Real",
  "Pasteuría Británica",
  "Pasteuría San Francisco",
  "Pasteuría La Blanca",
];

const platillos = [
  { name: "Pastes", desc: "El ícono gastronómico minero" },
  { name: "Barbacoa", desc: "Estilo hidalguense en penca de maguey" },
  { name: "Mixiotes", desc: "Carne adobada envuelta en hoja de maguey" },
  { name: "Pulque", desc: "Bebida fermentada tradicional" },
];

export default function GastronomiaPage() {
  const [activeTab, setActiveTab] = useState("pastes");
  const { data: negocios } = useNegocios();
  const restaurantes = negocios?.filter((b) => b.cat === "gastronomia") ?? [];

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Sabores del pueblo"
        title="Gastronomía de Real del Monte"
        subtitle="Del paste de herencia británica a las nieves artesanales: una cocina con memoria."
        image={FOOD_HERO}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {activeTab === "pastes" && (
          <>
            <SectionHeader
              eyebrow="El emblema"
              title="El paste, herencia de Cornualles"
              description="Una masa rellena que los mineros llevaban al socavón y hoy es el platillo insignia."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pastes.map((item, i) => (
                <article
                  key={item.name}
                  className="group border border-[#2a2d35] rounded-2xl overflow-hidden bg-[#121418] hover:border-[#c8a356]/60 transition-all duration-300"
                >
                  <div className="h-40 bg-gradient-to-br from-[#7c3a1d] via-[#b85c3c] to-[#2a1207] flex items-center justify-center">
                    <Croissant className="h-10 w-10 text-[#f5e8d0]" />
                  </div>
                  <div className="p-5 space-y-1">
                    <h3 className="font-serif text-lg font-bold group-hover:text-[#d4b26a] transition-colors">{item.name}</h3>
                    <p className="text-sm text-[#9ca3af]">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {activeTab === "ruta" && (
          <>
            <SectionHeader
              eyebrow="Recorrido"
              title="Ruta del Paste"
              description="Las pasteurías tradicionales del centro histórico."
            />
            <div className="space-y-3">
              {pasteurias.map((p, i) => (
                <div
                  key={p}
                  className="flex items-center gap-4 border border-[#2a2d35] rounded-2xl bg-[#121418] p-4 hover:border-[#c8a356]/60 transition-colors"
                >
                  <span className="h-9 w-9 shrink-0 rounded-xl bg-[#c8a356]/15 text-[#c8a356] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="font-medium flex-1">{p}</p>
                  <span className="text-[#c8a356]">→</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "restaurantes" && (
          <>
            <SectionHeader
              eyebrow="Dónde comer"
              title="Restaurantes y sabores locales"
              description="Los negocios gastronómicos del directorio."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {restaurantes.map((biz) => (
                <BusinessCard key={biz.id} biz={biz} />
              ))}
            </div>
          </>
        )}

        {activeTab === "platillos" && (
          <>
            <SectionHeader
              eyebrow="Cocina hidalguense"
              title="Platillos de la región"
              description="Los sabores que acompañan la mesa minera."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {platillos.map((item) => (
                <div key={item.name} className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-6">
                  <h3 className="font-serif text-lg font-bold">{item.name}</h3>
                  <p className="text-sm text-[#9ca3af] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
