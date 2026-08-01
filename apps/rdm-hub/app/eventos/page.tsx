"use client";

import { useState, useMemo } from "react";
import { CalendarDays, CalendarClock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { EventCard } from "@/components/cards";
import { useEventos } from "@/hooks/use-eventos";
import { CULTURE_HERO } from "@/lib/images";

export default function EventosPage() {
  const [scope, setScope] = useState<"proximos" | "todos">("proximos");
  const { data: eventos, isLoading } = useEventos();

  const grouped = useMemo(() => {
    if (!eventos) return { upcoming: [], past: [] };
    const now = new Date();
    return {
      upcoming: eventos.filter((e) => new Date(e.date) >= now),
      past: eventos.filter((e) => new Date(e.date) < now),
    };
  }, [eventos]);

  const shown = grouped.upcoming;

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Agenda del pueblo"
        title="Eventos de Real del Monte"
        subtitle="Festivales, ferias, conciertos y tradiciones que dan vida al territorio."
        image={CULTURE_HERO}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <SectionHeader
            eyebrow="Calendario"
            title={scope === "proximos" ? "Próximos eventos" : "Todos los eventos"}
            description={
              scope === "proximos"
                ? `${grouped.upcoming.length} eventos por venir`
                : `${grouped.upcoming.length} próximos · ${grouped.past.length} pasados`
            }
          />
          <div className="flex items-center gap-1 border border-[#2a2d35] rounded-xl p-1 bg-[#121418]">
            <button
              onClick={() => setScope("proximos")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                scope === "proximos" ? "bg-[#c8a356]/15 text-[#c8a356]" : "text-[#9ca3af] hover:text-[#e8e6e0]"
              }`}
            >
              <CalendarClock className="h-4 w-4" /> Próximos
            </button>
            <button
              onClick={() => setScope("todos")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                scope === "todos" ? "bg-[#c8a356]/15 text-[#c8a356]" : "text-[#9ca3af] hover:text-[#e8e6e0]"
              }`}
            >
              <CalendarDays className="h-4 w-4" /> Todos
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[#2a2d35] bg-[#121418] overflow-hidden">
                <div className="h-40 animate-pulse bg-[#1a1d24]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-24 rounded bg-[#1a1d24] animate-pulse" />
                  <div className="h-5 w-3/4 rounded bg-[#1a1d24] animate-pulse" />
                  <div className="h-3 w-full rounded bg-[#1a1d24] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-14 text-center space-y-2">
            <CalendarDays className="h-8 w-8 mx-auto text-[#6b7280]" />
            <p className="font-medium">Sin eventos en esta vista</p>
            <p className="text-sm text-[#9ca3af]">Pronto anunciaremos más fechas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {shown.map((ev) => (
              <EventCard key={ev.id} ev={ev} showStatus />
            ))}
          </div>
        )}

        {scope === "todos" && grouped.past.length > 0 && (
          <div className="space-y-4 pt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#6b7280]">Eventos pasados</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {grouped.past.map((ev) => (
                <EventCard key={ev.id} ev={ev} showStatus />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
