"use client";

import { useState } from "react";
import { Rss, BookOpen, Layers, Trophy } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { CULTURE_HERO } from "@/lib/images";

const tabs = [
  { id: "feed", label: "Feed", icon: Rss },
  { id: "wiki", label: "Wiki", icon: BookOpen },
  { id: "enciclopedia", label: "Enciclopedia", icon: Layers },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
];

const posts = [
  { user: "Cronista RDM", text: "Hoy se cumplen 100 años de la última gran extracción en la Mina de Acosta.", time: "Hace 2 h" },
  { user: "Turismo RDM", text: "Nueva ruta gastronómica del paste disponible en el mapa.", time: "Hace 5 h" },
  { user: "Comunidad", text: "Invitación a la feria anual del Pueblo Mágico. ¡No falten!", time: "Hace 1 d" },
];

const wiki = [
  "Historia Minera",
  "Geografía",
  "Arquitectura",
  "Personajes Ilustres",
  "Festividades",
  "Flora y Fauna",
];

const topUsers = [
  { name: "Cronista RDM", pts: 980, emoji: "👑" },
  { name: "Guía del Monte", pts: 870, emoji: "🥈" },
  { name: "Cantina y Leyenda", pts: 740, emoji: "🥉" },
  { name: "Pasteuría Local", pts: 610, emoji: "⭐" },
  { name: "Minería Viva", pts: 500, emoji: "⭐" },
];

export default function ComunidadPage() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Memoria colectiva"
        title="Comunidad de Real del Monte"
        subtitle="El corazón digital del pueblo: crónicas, conocimiento y voces de la comunidad."
        image={CULTURE_HERO}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {activeTab === "feed" && (
          <>
            <SectionHeader eyebrow="En vivo" title="Crónicas del territorio" />
            <div className="space-y-4">
              {posts.map((post, i) => (
                <div key={i} className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-5 hover:border-[#c8a356]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#c8a356]">{post.user}</p>
                    <span className="text-xs text-[#6b7280]">{post.time}</span>
                  </div>
                  <p className="mt-2 text-[#d4d0c8]">{post.text}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "wiki" && (
          <>
            <SectionHeader eyebrow="Saber colectivo" title="Wiki territorial" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wiki.map((topic) => (
                <div
                  key={topic}
                  className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-5 hover:border-[#c8a356] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <p className="font-medium">{topic}</p>
                  <span className="text-[#c8a356]">→</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "enciclopedia" && (
          <>
            <SectionHeader
              eyebrow="Colaborativa"
              title="Enciclopedia del territorio"
              description="Construyendo el conocimiento colectivo de Real del Monte."
            />
            <div className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-14 text-center space-y-2">
              <Layers className="h-8 w-8 mx-auto text-[#c8a356]" />
              <p className="font-serif text-xl font-bold">Enciclopedia</p>
              <p className="text-sm text-[#9ca3af]">En construcción — pronto sumaremos artículos colaborativos.</p>
            </div>
          </>
        )}

        {activeTab === "leaderboard" && (
          <>
            <SectionHeader eyebrow="Reconocimiento" title="Contribuyentes destacados" />
            <div className="space-y-3">
              {topUsers.map((u, i) => (
                <div
                  key={u.name}
                  className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-4 flex items-center justify-between hover:border-[#c8a356]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#c8a356] font-bold w-8">{i + 1}</span>
                    <span className="text-xl" aria-hidden>{u.emoji}</span>
                    <span className="font-medium">{u.name}</span>
                  </div>
                  <span className="text-sm text-[#9ca3af]">{u.pts} pts</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
