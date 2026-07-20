import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { EVENTS } from "@/data/content";
import { Calendar, MapPin, Tag, Clock, ChevronRight, Users, Zap, BookOpen, Music, Award, Globe, Sparkles, Share2, X, List, CalendarDays, UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/eventos")({
  head: () => ({
    meta: [
      { title: "Eventos · Calendario civilizatorio · RDM" },
      { name: "description", content: "Agenda federada: asambleas, hackatones, festivales y vigilias en Real del Monte." },
      { property: "og:title", content: "Eventos · RDM Digital" },
      { property: "og:description", content: "Calendario civilizatorio del Sistema Operativo Territorial LTOS." },
    ],
  }),
  component: EventosPage,
});

const TAG_CONFIG: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  Gobernanza: { color: "oklch(0.55 0.13 220)", icon: BookOpen, label: "Gobernanza" },
  Tecnología: { color: "oklch(0.6 0.14 80)", icon: Zap, label: "Tecnología" },
  Gastronomía: { color: "oklch(0.62 0.18 30)", icon: UtensilsCrossed, label: "Gastronomía" },
  Cultura: { color: "oklch(0.5 0.16 330)", icon: Music, label: "Cultura" },
  Comunidad: { color: "oklch(0.58 0.15 130)", icon: Users, label: "Comunidad" },
};

const UPCOMING_EVENTS = EVENTS.map(e => ({
  ...e,
  dateObj: new Date(e.date),
  isUpcoming: new Date(e.date) >= new Date(),
})).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

function EventosPage() {
  const [filter, setFilter] = useState<string>("all");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedEvent, setSelectedEvent] = useState<typeof UPCOMING_EVENTS[0] | null>(null);

  const filteredEvents = UPCOMING_EVENTS.filter(e => {
    if (filter === "all") return true;
    if (filter === "upcoming") return e.isUpcoming;
    if (filter === "past") return !e.isUpcoming;
    return e.tag === filter;
  });

  const tags = ["all", "upcoming", "past", ...new Set(EVENTS.map(e => e.tag))];

  return (
    <>
      <PageHero
        eyebrow="VIII · Agenda"
        title="Calendario"
        highlight="civilizatorio."
        description="Convergencias entre gobernanza, cultura, tecnología y comunidad bajo el kernel LTOS."
      />
      <section className="container mx-auto px-6 pb-24">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => {
              const config = tag === "all" ? { color: "oklch(0.66 0.16 45)", label: "Todos" } :
                            tag === "upcoming" ? { color: "oklch(0.6 0.13 130)", label: "Próximos" } :
                            tag === "past" ? { color: "oklch(0.55 0.1 260)", label: "Pasados" } :
                            TAG_CONFIG[tag] || { color: "oklch(0.5 0.05 260)", label: tag };
              return (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all ${
                    filter === tag
                      ? "text-background shadow-card"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  style={{
                    backgroundColor: filter === tag ? config.color : "transparent",
                    borderColor: filter === tag ? "transparent" : "transparent",
                  }}
                >
                  {tag !== "all" && tag !== "upcoming" && tag !== "past" && (
                    <config.icon className="w-3 h-3" style={{ color: filter === tag ? "currentColor" : config.color }} />
                  )}
                  {config.label}
                </button>
              );
            })}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 rounded-xl border-hairline bg-card p-1">
            {["list", "calendar"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`p-2 rounded-lg text-sm transition-all ${
                  view === v
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {v === "list" ? <List className="w-4 h-4" /> : <CalendarDays className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Events List/Calendar */}
        {view === "list" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {filteredEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 rounded-2xl border-hairline bg-card"
              >
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No hay eventos para este filtro</p>
              </motion.div>
            ) : (
              filteredEvents.map((e, i) => {
                const config = TAG_CONFIG[e.tag] || { color: "oklch(0.5 0.05 260)", icon: Tag, label: e.tag };
                const Icon = config.icon;
                const isPast = !e.isUpcoming;
                
                return (
                  <motion.li
                    key={e.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative rounded-xl border-hairline bg-card overflow-hidden hover:shadow-sovereign transition-all"
                    style={{ opacity: isPast ? 0.6 : 1 }}
                  >
                    {/* Left accent bar */}
                    <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: config.color }} />
                    
                    <div className="grid md:grid-cols-[100px_1fr_auto] items-center gap-6 p-5">
                      {/* Date */}
                      <div className="text-center md:text-left relative">
                        <div className={`font-display text-3xl md:text-4xl font-bold leading-none ${isPast ? "text-muted-foreground" : "text-ink"}`}>
                          {e.dateObj.getDate()}
                        </div>
                        <div className="font-mono text-[10px] tracking-sovereign text-muted-foreground uppercase mt-1">
                          {e.dateObj.toLocaleString("es-MX", { month: "long", year: "numeric" })}
                        </div>
                        {isPast && (
                          <span className="absolute -top-2 right-0 md:static md:ml-2 inline-block font-mono text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            FINALIZADO
                          </span>
                        )}
                      </div>

                      {/* Event Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display text-xl md:text-2xl text-ink group-hover:text-accent transition-colors">{e.title}</h3>
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[9px] tracking-widest uppercase"
                            style={{ backgroundColor: `${config.color}22`, color: config.color }}
                          >
                            <Icon className="w-2.5 h-2.5" /> {config.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {e.place}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Confirmado
                          </span>
                          {e.tag === "Tecnología" && (
                            <span className="inline-flex items-center gap-1">
                              <Zap className="w-3 h-3" /> Hackatón
                            </span>
                          )}
                          {e.tag === "Gastronomía" && (
                            <span className="inline-flex items-center gap-1">
                              <UtensilsCrossed className="w-3 h-3" /> Festival
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="md:justify-self-end flex flex-col items-end gap-2">
                        {!isPast && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 rounded-full bg-accent/10 text-accent border border-accent/30 px-4 py-2 text-sm font-medium hover:bg-accent hover:text-background transition-all"
                          >
                            <Calendar className="w-4 h-4" /> Agendar
                          </motion.button>
                        )}
                        <motion.button
                          onClick={() => setSelectedEvent(e)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center gap-2 rounded-full border-hairline px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        >
                          <BookOpen className="w-4 h-4" /> Detalles
                        </motion.button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </motion.div>
          ) : (
            // Calendar View (simplified)
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border-hairline bg-card p-6"
            >
              <p className="text-center text-muted-foreground py-8">
                Vista de calendario próximamente disponible
              </p>
            </motion.div>
          )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card rounded-3xl border-hairline shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: TAG_CONFIG[selectedEvent.tag]?.color }} />
              
              <div className="p-6 md:p-8">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl hover:bg-secondary text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-center p-4 rounded-2xl" style={{ backgroundColor: `${TAG_CONFIG[selectedEvent.tag]?.color}15` }}>
                      <div className="font-display text-4xl font-bold" style={{ color: TAG_CONFIG[selectedEvent.tag]?.color }}>
                        {selectedEvent.dateObj.getDate()}
                      </div>
                      <div className="font-mono text-[10px] tracking-sovereign uppercase text-muted-foreground">
                        {selectedEvent.dateObj.toLocaleString("es-MX", { month: "short" })}
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-mono text-[9px] tracking-widest uppercase" style={{ backgroundColor: `${TAG_CONFIG[selectedEvent.tag]?.color}22`, color: TAG_CONFIG[selectedEvent.tag]?.color }}>
                        <TAG_CONFIG[selectedEvent.tag]?.icon className="w-2.5 h-2.5" /> {TAG_CONFIG[selectedEvent.tag]?.label}
                      </div>
                    </div>
                  </div>

                  <h2 className="font-display text-2xl md:text-3xl text-ink mb-3">{selectedEvent.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedEvent.place}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" /> {selectedEvent.dateObj.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> Confirmado</span>
                  </div>

                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>Este evento forma parte del calendario civilizatorio del Sistema Operativo Territorial LTOS, convergiendo gobernanza, cultura, tecnología y comunidad en Real del Monte.</p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-hairline flex flex-wrap gap-3">
                    <button className="inline-flex items-center gap-2 rounded-full bg-accent/10 text-accent border border-accent/30 px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-background transition-all">
                      <Calendar className="w-4 h-4" /> Agendar
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-full border-hairline px-5 py-2.5 text-sm hover:bg-secondary transition-colors">
                      <Share2 className="w-4 h-4" /> Compartir
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </section>
    </>
  );
}
