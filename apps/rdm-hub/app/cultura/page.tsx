"use client";

import { useState } from "react";
import { Landmark, Image as ImageIcon, Music, Archive, Palette } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { SmartImage } from "@/components/smart-image";
import { CULTURE_HERO } from "@/lib/images";

const tabs = [
  { id: "patrimonio", label: "Patrimonio", icon: Landmark },
  { id: "galeria", label: "Galería", icon: ImageIcon },
  { id: "musica", label: "Música", icon: Music },
  { id: "archivo", label: "Archivo Sonoro", icon: Archive },
  { id: "arte", label: "Arte", icon: Palette },
];

const patrimonio = [
  "Parroquia de la Asunción",
  "Panteón Inglés",
  "Palacio Municipal",
  "Casa de la Cultura",
  "Museo de Medicina Laboral",
  "Teatro Hidalgo",
];

const musica = [
  { title: "Huella en Silencio", artist: "Música original", file: "/audio/huella-en-silencio.mp3" },
  { title: "Legado", artist: "Música original", file: "/audio/legado.mp3" },
  { title: "El Señalado", artist: "Música original", file: "/audio/el-senalado.mp3" },
  { title: "Puro Dolor", artist: "Música original", file: "/audio/puro-dolor.mp3" },
  { title: "Nueva Frecuencia", artist: "Música original", file: "/audio/nueva-frecuencia.mp3" },
  { title: "Patio de Tierra", artist: "Música original", file: "/audio/patio-de-tierra.mp3" },
  { title: "Polvo", artist: "Música original", file: "/audio/polvo.mp3" },
  { title: "Shooting Star", artist: "Música original", file: "/audio/shooting-star.mp3" },
  { title: "Stay Whit Me", artist: "Música original", file: "/audio/stay-whitme.mp3" },
  { title: "Tu Mirada", artist: "Música original", file: "/audio/tu-mirada.mp3" },
  { title: "Cada Noche", artist: "Música original", file: "/audio/cada-noche.mp3" },
  { title: "A Mi Madre", artist: "Música original", file: "/audio/a-mi-madre.mp3" },
  { title: "Sed de Ti", artist: "Música original", file: "/audio/sed-de-ti.mp3" },
  { title: "Reina Trejo", artist: "Música original", file: "/audio/reina-trejo.mp3" },
  { title: "Casa Bolio", artist: "Música original", file: "/audio/casa-bolio.mp3" },
  { title: "Cantina y Callejón (Mashup)", artist: "Mashup", file: "/audio/cantina-callejon-mashup.mp3" },
  { title: "San Antonio (Mashup)", artist: "Mashup", file: "/audio/san-antonio-mashup.mp3" },
  { title: "Adicted to You", artist: "Música original", file: "/audio/adicted-to-you.mp3" },
  { title: "Glitchy Cinematic", artist: "Pista ambiental", file: "/audio/glitchy-cinematic.mp3" },
  { title: "Mind Explorer", artist: "Pista ambiental", file: "/audio/mind-explorer.mp3" },
  { title: "Melodía Ambiental", artist: "Pista ambiental", file: "/audio/melodia-1543946.mp3" },
];

const arte = [
  { name: "Artesanía en Cantera", desc: "Tallado en piedra volcánica" },
  { name: "Textiles Tradicionales", desc: "Bordados y tejidos de la región" },
  { name: "Pintura Mural", desc: "Murales que narran la historia minera" },
  { name: "Arte Contemporáneo", desc: "Expresiones artísticas modernas" },
];

export default function CulturaPage() {
  const [activeTab, setActiveTab] = useState("patrimonio");

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Riqueza cultural"
        title="Cultura de Real del Monte"
        subtitle="Patrimonio, música, archivos sonoros y arte que viven en cada esquina."
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {activeTab === "patrimonio" && (
          <>
            <SectionHeader
              eyebrow="Edificios y sitios"
              title="Patrimonio construido"
              description="El legado arquitectónico que hace de Real del Monte un Pueblo Mágico."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {patrimonio.map((item, i) => (
                <article
                  key={item}
                  className="group border border-[#2a2d35] rounded-2xl overflow-hidden bg-[#121418] hover:border-[#c8a356]/60 transition-all duration-300"
                >
                  <SmartImage category={i % 2 === 0 ? "arquitectura" : "historico"} alt={item} className="h-44" overlay />
                  <div className="p-5">
                    <p className="font-serif text-lg font-bold group-hover:text-[#d4b26a] transition-colors">{item}</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {activeTab === "galeria" && (
          <>
            <SectionHeader
              eyebrow="Galería visual"
              title="Estampas del pueblo"
              description="Atardeceres, callejones, minas y montañas del territorio."
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["naturaleza", "arquitectura", "mineria", "plaza", "historico", "cultura"].map((cat, i) => (
                <SmartImage
                  key={i}
                  category={cat}
                  alt={`Estampa ${i + 1}`}
                  className="aspect-square rounded-2xl"
                />
              ))}
            </div>
          </>
        )}

        {activeTab === "musica" && (
          <>
            <SectionHeader
              eyebrow="Sonidos del territorio"
              title="Música de Real del Monte"
              description="Cantos, corridos y sonidos propios que cuentan la historia minera."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {musica.map((track) => (
                <div
                  key={track.file}
                  className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-5 hover:border-[#c8a356]/60 transition-colors space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#c8a356]/30 to-transparent flex items-center justify-center shrink-0">
                      <Music className="h-5 w-5 text-[#c8a356]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-xs text-[#9ca3af]">{track.artist}</p>
                    </div>
                  </div>
                  <audio
                    controls
                    preload="none"
                    src={track.file}
                    className="w-full h-10"
                  >
                    Tu navegador no soporta audio.
                  </audio>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "archivo" && (
          <>
            <SectionHeader
              eyebrow="Memoria oral"
              title="Archivo sonoro"
              description="Grabaciones históricas y testimonios de la comunidad."
            />
            <div className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-14 text-center space-y-2">
              <Archive className="h-8 w-8 mx-auto text-[#c8a356]" />
              <p className="font-serif text-xl font-bold">Archivo sonoro</p>
              <p className="text-sm text-[#9ca3af]">En construcción — pronto compartiremos las voces del territorio.</p>
            </div>
          </>
        )}

        {activeTab === "arte" && (
          <>
            <SectionHeader
              eyebrow="Expresión creativa"
              title="Arte local"
              description="La creatividad de artistas y artesanos del municipio."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {arte.map((item) => (
                <article
                  key={item.name}
                  className="group border border-[#2a2d35] rounded-2xl overflow-hidden bg-[#121418] hover:border-[#c8a356]/60 transition-all duration-300"
                >
                  <SmartImage category="artesanias" alt={item.name} className="h-44" overlay />
                  <div className="p-5 space-y-1">
                    <h3 className="font-serif text-lg font-bold group-hover:text-[#d4b26a] transition-colors">{item.name}</h3>
                    <p className="text-sm text-[#9ca3af]">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
