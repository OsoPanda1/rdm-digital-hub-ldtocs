"use client";

import { useMemo, useState } from "react";
import { Compass, Mail, Rocket, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { LANDSCAPE_ALT } from "@/lib/images";

type TabId = "plataforma" | "equipo" | "filosofia" | "contacto";

type Tab = {
  id: TabId;
  label: string;
  icon: typeof Rocket;
};

const TABS: Tab[] = [
  { id: "plataforma", label: "La Plataforma", icon: Rocket },
  { id: "equipo", label: "Equipo", icon: Users },
  { id: "filosofia", label: "Filosofía", icon: Compass },
  { id: "contacto", label: "Contacto", icon: Mail },
];

const STATS = [
  { value: "14+", label: "Módulos" },
  { value: "7", label: "Federaciones" },
  { value: "1", label: "Nodo Cero" },
  { value: "∞", label: "Memoria Viva" },
] as const;

const TEAM = [
  { name: "TAMV", role: "Arquitecto / Fundador", emoji: "🧭" },
  { name: "Isabella", role: "Núcleo Cognitivo", emoji: "✨" },
  { name: "Comunidad RDM", role: "Memoria Colectiva", emoji: "🤝" },
] as const;

const CONTACT = [
  { label: "Correo", value: "contacto@realdelmonte.digital" },
  { label: "Web", value: "visitarealdelmonte.online" },
  { label: "Territorio", value: "Real del Monte, Hidalgo" },
  { label: "Comunidad", value: "Comunidad RDM" },
] as const;

function TabButton({
  tab,
  active,
  onClick,
}: {
  tab: Tab;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "group relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-[#c8a356]/30 focus:ring-offset-2 focus:ring-offset-[#0a0b0e]",
        active
          ? "bg-[#c8a356] text-[#0a0b0e] shadow-[0_10px_30px_rgba(200,163,86,0.18)]"
          : "text-[#a7adb8] hover:bg-white/5 hover:text-[#f2efe8]",
      ].join(" ")}
    >
      <Icon className={["h-4 w-4 transition-transform duration-300", active ? "scale-110" : "group-hover:scale-110"].join(" ")} />
      <span>{tab.label}</span>
    </button>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-b from-white/[0.06] to-white/[0.03]",
        "shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(200,163,86,0.12),transparent_55%)]",
        className,
      ].join(" ")}
    >
      <div className="relative">{children}</div>
    </div>
  );
}

export default function AcercaPage() {
  const [activeTab, setActiveTab] = useState<TabId>("plataforma");

  const content = useMemo(() => {
    switch (activeTab) {
      case "plataforma":
        return (
          <div className="space-y-8">
            <SectionHeader
              eyebrow="Qué es"
              title="RDM Digital Hub"
              description="Un ecosistema digital que integra mapa interactivo, historia minera, gastronomía, eventos culturales, directorio de negocios e inteligencia artificial gobernada."
            />

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {STATS.map((stat) => (
                <GlassCard key={stat.label} className="p-6 text-center">
                  <p className="text-4xl font-semibold tracking-tight text-[#d7b56d]">{stat.value}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#a7adb8]">
                    {stat.label}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        );

      case "equipo":
        return (
          <div className="space-y-8">
            <SectionHeader eyebrow="Personas" title="Detrás del Nodo Cero" />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {TEAM.map((person) => (
                <GlassCard key={person.name} className="p-7 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl shadow-inner">
                    <span aria-hidden="true">{person.emoji}</span>
                  </div>
                  <p className="mt-5 text-lg font-semibold tracking-tight text-[#f2efe8]">
                    {person.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#a7adb8]">{person.role}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        );

      case "filosofia":
        return (
          <div className="space-y-8">
            <SectionHeader eyebrow="Principios" title="Nuestra visión" />

            <GlassCard className="p-8 md:p-10">
              <div className="space-y-5 text-[15px] leading-8 text-[#d6d1c8]">
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
            </GlassCard>
          </div>
        );

      case "contacto":
        return (
          <div className="space-y-8">
            <SectionHeader eyebrow="Conecta" title="Contacto" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {CONTACT.map((item) => (
                <GlassCard key={item.label} className="p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#a7adb8]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-base font-medium text-[#f2efe8]">
                    {item.value}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        );
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#07080b] text-[#f2efe8]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(200,163,86,0.10),transparent_32%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_18%)]" />

      <PageHero
        eyebrow="Nodo Cero"
        title="Acerca de RDM Digital Hub"
        subtitle="Plataforma territorial inteligente de Real del Monte, Hidalgo."
        image={LANDSCAPE_ALT}
      />

      <nav className="sticky top-14 z-40 border-b border-white/8 bg-[#07080b]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex rounded-full border border-white/8 bg-white/[0.03] p-1 shadow-[0_10px_40px_rgba(0,0,0,0.22)]">
            {TABS.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6 lg:p-8">
          {content}
        </div>
      </main>
    </div>
  );
}
