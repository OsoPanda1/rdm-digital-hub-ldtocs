import { useState, useRef, useEffect } from "react"
import { RDMLayout } from "@/components/rdm/RDMLayout"
import { SEOMeta } from "@/components/SEOMeta"
import { VideoEmbed } from "@/components/rdm/VideoEmbed"
import { motion } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  Radio,
  Clock,
  Calendar,
  Headphones,
  Mic,
  Disc3,
  Heart,
  ExternalLink,
  Users,
  BookOpen,
} from "lucide-react"

import tamvBanner from "@assets/Gemini_Generated_Image_a3vb18a3vb18a3vb_1784832222162.png"

const TAMV_STREAM =
  import.meta.env.VITE_TAMV_STREAM_URL || "https://tamv925.caster.fm/stream"

// ---------------------------------------------------------------------------
//  Static data — Program Schedule
// ---------------------------------------------------------------------------

interface ProgramSlot {
  day: string
  time: string
  name: string
  host: string
  type: "en-vivo" | "pregrabado" | "retransmision"
}

const WEEKLY_SCHEDULE: ProgramSlot[] = [
  { day: "Lunes", time: "07:00–09:00", name: "Buenos Días RDM", host: "Equipo TAMV", type: "en-vivo" },
  { day: "Lunes", time: "12:00–13:00", name: "Cultura Viva", host: "Invitados Rotativos", type: "en-vivo" },
  { day: "Lunes", time: "18:00–19:00", name: "Historias de la Mina", host: "Archivo TAMV", type: "pregrabado" },
  { day: "Martes", time: "07:00–09:00", name: "Buenos Días RDM", host: "Equipo TAMV", type: "en-vivo" },
  { day: "Martes", time: "14:00–15:00", name: "Pueblo en Red", host: "Invitados Rotativos", type: "en-vivo" },
  { day: "Martes", time: "20:00–21:00", name: "Leyendas del Monte", host: "Archivo TAMV", type: "pregrabado" },
  { day: "Miércoles", time: "07:00–09:00", name: "Buenos Días RDM", host: "Equipo TAMV", type: "en-vivo" },
  { day: "Miércoles", time: "12:00–13:00", name: "Patrimonio Sonoro", host: "Invitados Rotativos", type: "en-vivo" },
  { day: "Miércoles", time: "18:00–19:00", name: "Minería y Memoria", host: "Archivo TAMV", type: "pregrabado" },
  { day: "Jueves", time: "07:00–09:00", name: "Buenos Días RDM", host: "Equipo TAMV", type: "en-vivo" },
  { day: "Jueves", time: "14:00–15:00", name: "Comercio Local", host: "Invitados Rotativos", type: "en-vivo" },
  { day: "Jueves", time: "20:00–21:00", name: "Noches de Plata", host: "Archivo TAMV", type: "pregrabado" },
  { day: "Viernes", time: "07:00–09:00", name: "Buenos Días RDM", host: "Equipo TAMV", type: "en-vivo" },
  { day: "Viernes", time: "12:00–13:00", name: "RDM en Concierto", host: "Invitados Rotativos", type: "en-vivo" },
  { day: "Viernes", time: "19:00–21:00", name: "Viernes de Radio", host: "Equipo TAMV", type: "en-vivo" },
  { day: "Sábado", time: "08:00–10:00", name: "Sábado Cultural", host: "Invitados Rotativos", type: "en-vivo" },
  { day: "Sábado", time: "14:00–15:00", name: "Historias que Vuelven", host: "Archivo TAMV", type: "retransmision" },
  { day: "Sábado", time: "19:00–20:00", name: "Lo Mejor de la Semana", host: "Archivo TAMV", type: "retransmision" },
  { day: "Domingo", time: "09:00–11:00", name: "Domingo Tranquilo", host: "Equipo TAMV", type: "en-vivo" },
  { day: "Domingo", time: "15:00–16:00", name: "Archivo Histórico", host: "Archivo TAMV", type: "pregrabado" },
  { day: "Domingo", time: "20:00–21:00", name: "Cierre de Semana", host: "Equipo TAMV", type: "en-vivo" },
]

// ---------------------------------------------------------------------------
//  Static data — Program Catalog
// ---------------------------------------------------------------------------

interface Program {
  id: string
  name: string
  description: string
  host: string
  schedule: string
  type: "en-vivo" | "pregrabado" | "retransmision"
  episodeCount: number
}

const PROGRAMS: Program[] = [
  {
    id: "buenos-dias-rdm",
    name: "Buenos Días RDM",
    description:
      "El programa matutino de la estación. Noticias locales, eventos del día, y conversación con vecinos del pueblo.",
    host: "Equipo TAMV",
    schedule: "Lunes a Viernes, 07:00–09:00",
    type: "en-vivo",
    episodeCount: 120,
  },
  {
    id: "cultura-viva",
    name: "Cultura Viva",
    description:
      "Espacio dedicado a la expresión cultural de Real del Monte: música, arte, tradiciones y festividades.",
    host: "Invitados Rotativos",
    schedule: "Lunes, 12:00–13:00",
    type: "en-vivo",
    episodeCount: 48,
  },
  {
    id: "historias-de-la-mina",
    name: "Historias de la Mina",
    description:
      "Relatos sonoros sobre la historia minera de Real del Monte. Memorias, leyendas y testimonios de las familias mineras.",
    host: "Archivo TAMV",
    schedule: "Lunes, 18:00–19:00",
    type: "pregrabado",
    episodeCount: 36,
  },
  {
    id: "pueblo-en-red",
    name: "Pueblo en Red",
    description:
      "Conversaciones con emprendedores, comerciantes y figuras clave del Pueblo Mágico.",
    host: "Invitados Rotativos",
    schedule: "Martes, 14:00–15:00",
    type: "en-vivo",
    episodeCount: 42,
  },
  {
    id: "leyendas-del-monte",
    name: "Leyendas del Monte",
    description:
      "Recompilación de leyendas, mitos y relatos fantásticos de Real del Monte y sus alrededores.",
    host: "Archivo TAMV",
    schedule: "Martes, 20:00–21:00",
    type: "pregrabado",
    episodeCount: 28,
  },
  {
    id: "patrimonio-sonoro",
    name: "Patrimonio Sonoro",
    description:
      "Documental sonoro sobre el patrimonio cultural inmaterial de la comunidad. Entrevistas, grabaciones de campo y análisis.",
    host: "Invitados Rotativos",
    schedule: "Miércoles, 12:00–13:00",
    type: "en-vivo",
    episodeCount: 32,
  },
  {
    id: "viernes-de-radio",
    name: "Viernes de Radio",
    description:
      "El programa estrella de la semana. Música en vivo, entrevistas, y cierre cultural del viernes.",
    host: "Equipo TAMV",
    schedule: "Viernes, 19:00–21:00",
    type: "en-vivo",
    episodeCount: 50,
  },
  {
    id: "domingo-tranquilo",
    name: "Domingo Tranquilo",
    description:
      "Música relajante, lectura de crónicas, y espacio para el descanso dominical.",
    host: "Equipo TAMV",
    schedule: "Domingo, 09:00–11:00",
    type: "en-vivo",
    episodeCount: 44,
  },
]

// ---------------------------------------------------------------------------
//  Static data — Recent Episodes
// ---------------------------------------------------------------------------

interface Episode {
  id: string
  title: string
  program: string
  date: string
  duration: string
  description: string
}

const RECENT_EPISODES: Episode[] = [
  {
    id: "ep-001",
    title: "El Legado de las Minas de Real del Monte",
    program: "Historias de la Mina",
    date: "2026-07-14",
    duration: "52 min",
    description:
      "Un recorrido sonoro por las entrañas de las minas históricas, con testimonios de familias mineras y ambientaciones sonoras del territorio.",
  },
  {
    id: "ep-002",
    title: "La Semana Santa más Antigua de América",
    program: "Cultura Viva",
    date: "2026-07-07",
    duration: "45 min",
    description:
      "Análisis de las tradiciones de Semana Santa en Real del Monte, considerada una de las más antiguas de América.",
  },
  {
    id: "ep-003",
    title: "Emprendedores del Pueblo Mágico",
    program: "Pueblo en Red",
    date: "2026-06-30",
    duration: "38 min",
    description:
      "Conversación con tres emprendedores locales sobre innovación, tradición y el futuro de Real del Monte.",
  },
  {
    id: "ep-004",
    title: "El Duende de la Mina",
    program: "Leyendas del Monte",
    date: "2026-06-23",
    duration: "28 min",
    description:
      "La famosa leyenda del duende que habita en las minas abandonadas, narrada con efectos de sonido espacial.",
  },
  {
    id: "ep-005",
    title: "Pastes: Historia de un Sabor",
    program: "Patrimonio Sonoro",
    date: "2026-06-16",
    duration: "41 min",
    description:
      "El origen de los pastes en Real del Monte y su relación con la comunidad inglesa que los trajo durante la época minera.",
  },
]

const DONATION_OPTIONS = [
  { amount: 50, label: "$50 MXN" },
  { amount: 100, label: "$100 MXN" },
  { amount: 200, label: "$200 MXN" },
  { amount: 500, label: "$500 MXN" },
  { amount: 1000, label: "$1,000 MXN" },
]

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

function getSlotTypeBadge(type: ProgramSlot["type"]) {
  switch (type) {
    case "en-vivo":
      return { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", label: "En Vivo" }
    case "pregrabado":
      return { bg: "bg-[#00D4FF]/15", text: "text-[#00D4FF]", border: "border-[#00D4FF]/30", label: "Pregrabado" }
    case "retransmision":
      return { bg: "bg-[#A7F300]/15", text: "text-[#A7F300]", border: "border-[#A7F300]/30", label: "Retransmisión" }
  }
}

// ---------------------------------------------------------------------------
//  Page
// ---------------------------------------------------------------------------

export default function ArchivoSonoro() {
  const [isRadioPlaying, setIsRadioPlaying] = useState(false)
  const [radioVolume, setRadioVolume] = useState(0.8)
  const [customAmount, setCustomAmount] = useState("")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = radioVolume
    }
  }, [radioVolume])

  const toggleRadioPlay = () => {
    if (!audioRef.current) return
    if (isRadioPlaying) {
      audioRef.current.pause()
      setIsRadioPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsRadioPlaying(true))
        .catch((err) => console.error("Stream play failed:", err))
    }
  }

  const handleDonate = async (amount: number) => {
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount,
          currency: "mxn",
          message: "Donación para TAMV 92.5 Radio",
        }),
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.checkoutUrl) window.location.href = data.checkoutUrl
    } catch {
      /* silent */
    }
  }

  const handleCustomDonation = () => {
    const value = Number(customAmount)
    if (!Number.isFinite(value) || value < 25) {
      alert("El monto mínimo es 25 MXN.")
      return
    }
    void handleDonate(value)
  }

  const today = new Date().toLocaleDateString("es-MX", { weekday: "long" })
  const uniqueDays = [...new Set(WEEKLY_SCHEDULE.map((s) => s.day))]

  return (
    <RDMLayout>
      <SEOMeta
        title="TAMV 92.5 Radio Digital — Real del Monte"
        description="TAMV 92.5 La voz de Real del Monte. Radio digital en vivo, programación, episodios y hemeroteca sonora del Pueblo Mágico."
      />

      {/* Video: TAMV 92.5 */}
      <div className="px-6 md:px-16 pt-4">
        <VideoEmbed
          youtubeId="dQw4w9WgXcQ"
          title="TAMV 92.5 FM — La Voz de Real del Monte"
          variant="mid"
          caption="Nuestra radio comunitaria en vivo, 24/7"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Hero + Live Radio Player                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative pt-24 pb-16 px-6 md:px-16 overflow-hidden bg-[hsl(220_30%_8%)] text-white border-b border-white/10">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={tamvBanner}
            alt="TAMV 92.5 Banner"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220_30%_8%)] via-[hsl(220_30%_8%/0.8)] to-transparent" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl border border-[hsl(var(--rdm-amber)/0.3)] shrink-0 relative">
              <img
                src={tamvBanner}
                alt="TAMV 92.5"
                className="w-full h-full object-cover"
              />
              {isRadioPlaying && (
                <div className="absolute inset-0 bg-[hsl(var(--rdm-amber)/0.2)] mix-blend-overlay animate-pulse" />
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-sm">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isRadioPlaying
                      ? "bg-red-500 animate-pulse"
                      : "bg-gray-500"
                  }`}
                />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/80">
                  {isRadioPlaying ? "En Vivo Ahora" : "Transmisión 24/7"}
                </span>
              </div>
              <h1
                className="text-4xl md:text-6xl font-bold mb-2 text-white drop-shadow-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                TAMV 92.5
              </h1>
              <p
                className="text-lg md:text-xl text-[hsl(var(--rdm-amber))] font-medium mb-8"
                style={{ fontFamily: "var(--font-body)" }}
              >
                La voz de Real del Monte
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                <button
                  onClick={toggleRadioPlay}
                  className="flex items-center gap-3 bg-[hsl(var(--rdm-amber))] text-white px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_30px_-5px_hsla(43,80%,55%,0.5)]"
                >
                  {isRadioPlaying ? (
                    <>
                      <Pause className="w-5 h-5" /> Pausar Radio
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" /> Escuchar en Vivo
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3 w-40">
                  <Volume2 className="w-4 h-4 text-white/60" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={radioVolume}
                    onChange={(e) => setRadioVolume(parseFloat(e.target.value))}
                    className="w-full accent-[hsl(var(--rdm-amber))] h-1.5 bg-white/20 rounded-full appearance-none outline-none"
                  />
                </div>
              </div>

              <audio ref={audioRef} src={TAMV_STREAM} preload="none" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Parrilla de Programación                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 px-6 md:px-16 bg-[#050814]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/30 bg-[#00D4FF]/10 px-4 py-1.5 text-[9px] uppercase tracking-[0.25em] text-[#00D4FF] mb-4">
              <Calendar className="h-3 w-3" />
              <span>Parrilla de Programación</span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Programación Semanal
            </h2>
            <p className="mt-2 text-sm text-[#9CA3AF] max-w-xl">
              Sintoniza TAMV 92.5 en cualquier momento. Transmisiones en vivo,
              programas pregrabados y retransmisiones del archivo.
            </p>
          </motion.div>

          <div className="space-y-4">
            {uniqueDays.map((day) => {
              const slots = WEEKLY_SCHEDULE.filter((s) => s.day === day)
              const isToday = day.toLowerCase() === today.toLowerCase()
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`rounded-xl border p-4 ${
                    isToday
                      ? "border-[#A7F300]/30 bg-[#A7F300]/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h3
                      className={`text-sm font-bold ${
                        isToday ? "text-[#A7F300]" : "text-white"
                      }`}
                    >
                      {day}
                    </h3>
                    {isToday && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#A7F300]/20 text-[#A7F300] font-bold uppercase tracking-wider">
                        Hoy
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {slots.map((slot) => {
                      const badge = getSlotTypeBadge(slot.type)
                      return (
                        <div
                          key={slot.time + slot.name}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5"
                        >
                          <div className="shrink-0 w-16 text-center">
                            <p className="text-[11px] font-mono text-[#9CA3AF]">
                              {slot.time}
                            </p>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {slot.name}
                            </p>
                            <p className="text-[10px] text-[#9CA3AF]">
                              {slot.host}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Catálogo de Programas                                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 px-6 md:px-16 bg-[#0a0f1e]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF1744]/30 bg-[#FF1744]/10 px-4 py-1.5 text-[9px] uppercase tracking-[0.25em] text-[#FF1744] mb-4">
              <Mic className="h-3 w-3" />
              <span>Catálogo de Programas</span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Nuestros Programas
            </h2>
            <p className="mt-2 text-sm text-[#9CA3AF] max-w-xl">
              Cada programa es una ventana a la cultura, historia y vida de Real
              del Monte.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2">
            {PROGRAMS.map((program, idx) => {
              const badge = getSlotTypeBadge(program.type)
              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[hsl(var(--rdm-amber))/15] flex items-center justify-center">
                        <Radio className="w-4 h-4 text-[hsl(var(--rdm-amber))]" />
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        {program.name}
                      </h3>
                    </div>
                    <span
                      className={`text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] leading-relaxed mb-3">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#9CA3AF]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {program.host}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {program.schedule}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-[#9CA3AF]">
                    <Headphones className="w-3 h-3" />
                    {program.episodeCount} episodios
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Hemeroteca Sonora — Episodios Recientes                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 px-6 md:px-16 bg-[#050814]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#A7F300]/30 bg-[#A7F300]/10 px-4 py-1.5 text-[9px] uppercase tracking-[0.25em] text-[#A7F300] mb-4">
              <BookOpen className="h-3 w-3" />
              <span>Hemeroteca Sonora</span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Episodios Recientes
            </h2>
            <p className="mt-2 text-sm text-[#9CA3AF] max-w-xl">
              Escucha los episodios más recientes de TAMV 92.5. Archivo sonoro
              vivo del Pueblo Mágico.
            </p>
          </motion.div>

          <div className="space-y-3">
            {RECENT_EPISODES.map((episode, idx) => (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-[#00D4FF]/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#00D4FF]/15 flex items-center justify-center shrink-0">
                      <Disc3 className="w-5 h-5 text-[#00D4FF]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {episode.title}
                      </h3>
                      <p className="text-[10px] text-[#9CA3AF]">
                        {episode.program}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-[#9CA3AF]">
                      {new Date(episode.date).toLocaleDateString("es-MX", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-[10px] text-[#9CA3AF]">
                      {episode.duration}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed mt-2">
                  {episode.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  Donaciones TAMV 92.5                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 px-6 md:px-16 bg-[#0a0f1e]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-[hsl(var(--rdm-amber))]" />
              <h3 className="text-lg font-bold text-white">
                Apoya TAMV 92.5
              </h3>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6">
              Mantener una radio comunitaria viva requiere infraestructura,
              energía y dedicación. Tu donación nos ayuda a seguir transmitiendo
              la voz de Real del Monte para todo el mundo.
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              {DONATION_OPTIONS.map((opt) => (
                <button
                  key={opt.amount}
                  onClick={() => void handleDonate(opt.amount)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-white/10 text-white border border-white/10 hover:bg-[hsl(var(--rdm-amber))] hover:border-[hsl(var(--rdm-amber))] transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#9CA3AF] shrink-0">
                Otra cantidad:
              </span>
              <div className="relative flex-1 max-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm font-semibold">
                  $
                </span>
                <input
                  type="number"
                  min={25}
                  placeholder="0"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-7 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[hsl(var(--rdm-amber))] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <button
                onClick={handleCustomDonation}
                className="px-5 py-2.5 rounded-xl bg-[hsl(var(--rdm-amber))] text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Donar
              </button>
            </div>
            <p className="mt-3 text-[9px] text-[#6B7280]">
              <ExternalLink className="w-3 h-3 inline mr-1" />
              Pago procesado vía Stripe. No almacenamos datos bancarios.
            </p>
          </motion.div>
        </div>
      </section>
    </RDMLayout>
  )
}
