"use client";

import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Landmark,
  Map,
  Sparkles,
  Store,
  Ticket,
  UtensilsCrossed,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { SmartImage } from "@/components/smart-image";
import { PlaceCard, EventCard, BusinessCard, RouteCard, LinkArrow } from "@/components/cards";
import { usePlaces } from "@/hooks/use-places";
import { useEventos } from "@/hooks/use-eventos";
import { useNegocios } from "@/hooks/use-negocios";
import { useRutas } from "@/hooks/use-rutas";
import { MINE_HERO } from "@/lib/images";

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#2a2d35] bg-[#121418] overflow-hidden">
      <div className="h-40 animate-pulse bg-[#1a1d24]" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-24 rounded bg-[#1a1d24] animate-pulse" />
        <div className="h-5 w-3/4 rounded bg-[#1a1d24] animate-pulse" />
        <div className="h-3 w-full rounded bg-[#1a1d24] animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-[#1a1d24] animate-pulse" />
      </div>
    </div>
  );
}

const categories = [
  { label: "Historia", href: "/historia", icon: Landmark, emoji: "⛏️" },
  { label: "Cultura", href: "/cultura", icon: Sparkles, emoji: "🎭" },
  { label: "Gastronomía", href: "/gastronomia", icon: UtensilsCrossed, emoji: "🥧" },
  { label: "Directorio", href: "/directorio", icon: Store, emoji: "🏪" },
  { label: "Eventos", href: "/eventos", icon: Ticket, emoji: "🎉" },
  { label: "Economía", href: "/economia", icon: Map, emoji: "📈" },
  { label: "Comunidad", href: "/comunidad", icon: Sparkles, emoji: "🤝" },
  { label: "Isabella AI", href: "/isabella", icon: Sparkles, emoji: "✨" },
];

export default function Home() {
  const { data: places } = usePlaces();
  const { data: eventos } = useEventos();
  const { data: negocios } = useNegocios();
  const { data: rutas } = useRutas();

  const upcoming = eventos?.filter((e) => new Date(e.date) >= new Date()) ?? [];
  const featuredPlaces = places?.slice(0, 6) ?? [];
  const featuredNegocios = negocios?.slice(0, 6) ?? [];

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[78vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage src={MINE_HERO} alt="" className="h-full w-full" overlay />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/55 to-[#0a0b0e]/20" aria-hidden />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl space-y-6 animate-fade-up">
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.25em] text-[#d4b26a]">
              <span className="h-px w-10 bg-[#c8a356]" aria-hidden />
              Pueblo Mágico · Hidalgo · México
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] drop-shadow-xl">
              Real del Monte
              <span className="block text-[#c8a356] mt-2">Digital Hub</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#d4d0c8]/90 max-w-2xl leading-relaxed">
              La memoria viva de un pueblo minero: mapa interactivo, historia, gastronomía,
              economía circular y una inteligencia artificial al servicio de la comunidad.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/explorar"
                className="inline-flex items-center gap-2 bg-[#c8a356] text-[#0a0b0e] px-7 py-3 rounded-xl font-medium hover:bg-[#d4b26a] transition-colors shadow-[0_8px_30px_-8px_rgba(200,163,86,0.6)]"
              >
                <Compass className="h-5 w-5" />
                Explorar el territorio
              </Link>
              <Link
                href="/eventos"
                className="inline-flex items-center gap-2 border border-[#2a2d35] bg-[#0a0b0e]/50 backdrop-blur text-[#e8e6e0] px-7 py-3 rounded-xl font-medium hover:bg-[#1a1d24] transition-colors"
              >
                <Ticket className="h-5 w-5" />
                Ver eventos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#2a2d35] bg-[#0d0e12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#2a2d35]">
          {[
            { n: places?.length, label: "Lugares de interés", href: "/explorar" },
            { n: rutas?.length, label: "Rutas y experiencias", href: "/explorar" },
            { n: negocios?.length, label: "Negocios locales", href: "/directorio" },
            { n: upcoming.length, label: "Eventos próximos", href: "/eventos" },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="bg-[#0d0e12] px-6 py-6 text-center hover:bg-[#121418] transition-colors"
            >
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#c8a356]">
                {s.n ?? <span className="animate-pulse">·</span>}
              </p>
              <p className="text-xs sm:text-sm text-[#9ca3af] mt-1">{s.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* LUGARES DESTACADOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <SectionHeader
          eyebrow="Descubre"
          title="Lugares que no puedes perderte"
          description="Museos, minas, capillas y paisajes que narran cinco siglos de historia."
          action={<LinkArrow href="/explorar">Ver todos los lugares</LinkArrow>}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredPlaces.length > 0
            ? featuredPlaces.map((p) => <PlaceCard key={p.id} place={p} />)
            : Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </section>

      {/* EVENTOS */}
      <section className="border-y border-[#2a2d35] bg-[#0d0e12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <SectionHeader
            eyebrow="Agenda"
            title="Próximos eventos"
            description="Festivales, tradiciones y actividades que mantienen vivo al pueblo."
            action={<LinkArrow href="/eventos">Calendario completo</LinkArrow>}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {upcoming.length > 0
              ? upcoming.slice(0, 3).map((ev) => <EventCard key={ev.id} ev={ev} />)
              : Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </section>

      {/* NEGOCIOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <SectionHeader
          eyebrow="Directorio"
          title="Negocios y sabores locales"
          description="El ecosistema económico del territorio: pasteurías, cafés, hospedaje y artesanías."
          action={<LinkArrow href="/directorio">Ir al directorio</LinkArrow>}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredNegocios.length > 0
            ? featuredNegocios.map((b) => <BusinessCard key={b.id} biz={b} />)
            : Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </section>

      {/* RUTAS */}
      <section className="border-y border-[#2a2d35] bg-[#0d0e12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <SectionHeader
            eyebrow="Experiencias"
            title="Rutas temáticas"
            description="Recorridos a pie, mineros y gastronómicos para vivir el Pueblo Mágico."
            action={<LinkArrow href="/explorar">Explorar rutas</LinkArrow>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {(rutas ?? [])
              .slice(0, 4)
              .map((r) => <RouteCard key={r.id} ruta={r} />)}
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <SectionHeader eyebrow="Navega" title="Explora el hub" description="Todo el territorio digital en un solo lugar." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group border border-[#2a2d35] rounded-2xl bg-[#121418] p-6 text-center hover:border-[#c8a356]/60 hover:shadow-[0_0_30px_-8px_rgba(200,163,86,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="text-3xl" aria-hidden>
                {c.emoji}
              </span>
              <p className="font-medium mt-3 group-hover:text-[#d4b26a] transition-colors">{c.label}</p>
              <ArrowRight className="h-4 w-4 mx-auto mt-2 text-[#6b7280] group-hover:text-[#c8a356] transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* ISABELLA CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-[#c8a356]/30">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a2414] via-[#0d0e12] to-[#1a1308]" aria-hidden />
          <div className="relative p-10 sm:p-14 flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1 space-y-3">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#d4b26a]">
                <Sparkles className="h-4 w-4" /> Núcleo Cognitivo
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">
                Habla con Isabella
              </h2>
              <p className="text-[#9ca3af] max-w-lg leading-relaxed">
                La inteligencia artificial gobernada del territorio. Pregúntale sobre historia,
                rutas, gastronomía o la comunidad de Real del Monte.
              </p>
              <Link
                href="/isabella"
                className="inline-flex items-center gap-2 bg-[#c8a356] text-[#0a0b0e] px-6 py-3 rounded-xl font-medium hover:bg-[#d4b26a] transition-colors"
              >
                <Sparkles className="h-5 w-5" />
                Iniciar conversación
              </Link>
            </div>
            <div className="shrink-0 text-6xl animate-float" aria-hidden>
              ✨
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
