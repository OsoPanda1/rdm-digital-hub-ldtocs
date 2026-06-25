import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import introAudioSrc from "@/assets/tumirada.mp3"

interface CinematicIntroProps {
  onComplete: () => void
}

/**
 * AudioEqualizer — Barras espectrales de alta definición ligadas al AnalyserNode
 */
const AudioEqualizer = ({ analyser }: { analyser: AnalyserNode | null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!analyser || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Optimización de nitidez para pantallas Retina/High-DPI
    const dpr = window.devicePixelRatio || 1
    canvas.width = 530 * dpr
    canvas.height = 80 * dpr
    ctx.scale(dpr, dpr)

    const BAR_COUNT = 64
    const dataArr = new Uint8Array(analyser.frequencyBinCount)

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArr)

      const w = 530
      const h = 80
      ctx.clearRect(0, 0, w, h)

      const barW = (w / BAR_COUNT) * 0.65
      const gap = (w / BAR_COUNT) * 0.35

      for (let i = 0; i < BAR_COUNT; i++) {
        const binIndex = Math.floor((i / BAR_COUNT) * (analyser.frequencyBinCount * 0.65))
        const rawVal = dataArr[binIndex] / 255
        const barH = Math.max(3, rawVal * h * 0.95)

        const x = i * (barW + gap)
        const y = h - barH

        const grad = ctx.createLinearGradient(x, h, x, y)
        // Paleta de Oro Realmontense a Zafiro Imperial
        grad.addColorStop(0, `hsla(43, 85%, 60%, ${0.2 + rawVal * 1.2})`)
        grad.addColorStop(0.5, `hsla(212, 90%, 65%, ${0.4 + rawVal * 0.6})`)
        grad.addColorStop(1, `hsla(275, 75%, 70%, ${0.3 + rawVal * 1.5})`)

        ctx.fillStyle = grad
        ctx.shadowBlur = rawVal > 0.5 ? 16 : 2
        ctx.shadowColor = `hsla(212, 100%, 60%, ${rawVal * 0.8})`

        // Esquinas redondeadas superiores de las barras espectrales
        const radius = Math.min(barW / 2, 4)
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + barW - radius, y)
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius)
        ctx.lineTo(x + barW, h)
        ctx.lineTo(x, h)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.closePath()
        ctx.fill()

        // Reflejo inferior elegante (Efecto cristal de cuarzo)
        ctx.save()
        ctx.globalAlpha = 0.22
        ctx.scale(1, -0.3)
        ctx.translate(0, -h * 2 - 4)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + barW - radius, y)
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius)
        ctx.lineTo(x + barW, h)
        ctx.lineTo(x, h)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
    }

    draw()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [analyser])

  return (
    <canvas
      ref={canvasRef}
      className="h-[65px] w-[300px] md:h-[80px] md:w-[530px]"
    />
  )
}

/**
 * AudioWaveform — Osciloscopio temporal estilizado
 */
const AudioWaveform = ({ analyser }: { analyser: AnalyserNode | null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!analyser || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = 520 * dpr
    canvas.height = 55 * dpr
    ctx.scale(dpr, dpr)

    const dataArr = new Uint8Array(analyser.fftSize)

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      analyser.getByteTimeDomainData(dataArr)

      const w = 520
      const h = 55
      ctx.clearRect(0, 0, w, h)

      ctx.lineWidth = 2.5
      ctx.strokeStyle = "hsla(212, 100%, 75%, 0.85)"
      ctx.shadowBlur = 12
      ctx.shadowColor = "hsla(212, 100%, 65%, 0.7)"

      ctx.beginPath()
      const sliceWidth = w / dataArr.length
      let x = 0

      for (let i = 0; i < dataArr.length; i++) {
        const v = dataArr[i] / 128.0
        const y = (v * h) / 2
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
        x += sliceWidth
      }

      ctx.lineTo(w, h / 2)
      ctx.stroke()

      // Línea de horizonte espectral base tenue
      ctx.lineWidth = 0.75
      ctx.strokeStyle = "hsla(43, 90%, 50%, 0.15)"
      ctx.shadowBlur = 0
      ctx.beginPath()
      ctx.moveTo(0, h / 2)
      ctx.lineTo(w, h / 2)
      ctx.stroke()
    }

    draw()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [analyser])

  return (
    <canvas
      ref={canvasRef}
      className="h-[30px] w-[300px] opacity-60 md:h-[48px] md:w-[520px]"
    />
  )
}

/**
 * Generación procedimental de constelaciones fijas y dinámicas
 */
type Star = {
  id: number
  size: number
  baseX: number
  baseY: number
  color: string
  driftX: number
  driftY: number
  duration: number
  delay: number
  layer: 0 | 1 | 2
}

const STAR_COLORS = [
  "hsla(212, 100%, 85%, 0.95)", // Zafiro brillante
  "hsla(43, 100%, 75%, 0.95)",  // Oro puro
  "hsla(275, 80%, 80%, 0.85)",  // Amatista cósmica
  "hsla(0, 0%, 100%, 0.9)",     // Blanco estelar
]

const createStarField = (count: number): Star[] => {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    const layer = (i % 3) as 0 | 1 | 2
    const sizeBase = layer === 0 ? 0.6 : layer === 1 ? 1.4 : 2.5

    stars.push({
      id: i,
      size: sizeBase + Math.random() * (layer === 2 ? 2.6 : 1.2),
      baseX: Math.random() * 100,
      baseY: Math.random() * 100,
      color: STAR_COLORS[i % STAR_COLORS.length],
      driftX: (Math.random() - 0.5) * (layer === 2 ? 70 : 35),
      driftY: -50 - Math.random() * (layer === 2 ? 140 : 70),
      duration: 7 + Math.random() * 7,
      delay: Math.random() * 5,
      layer,
    })
  }
  return stars
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState(0)
  const [started, setStarted] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(true)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [stars] = useState<Star[]>(() => createStarField(220))

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const fadeIntervalRef = useRef<number | null>(null)
  const fadeInIntervalRef = useRef<number | null>(null)
  const cleanupCalledRef = useRef(false)

  const stopAudio = useCallback(() => {
    if (fadeIntervalRef.current !== null) {
      clearInterval(fadeIntervalRef.current)
      fadeIntervalRef.current = null
    }
    if (fadeInIntervalRef.current !== null) {
      clearInterval(fadeInIntervalRef.current)
      fadeInIntervalRef.current = null
    }
    if (audioRef.current) {
      try {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      } catch {}
      audioRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    sourceRef.current = null
    setAnalyser(null)
  }, [])

  const handleSkip = useCallback(() => {
    if (cleanupCalledRef.current) return
    cleanupCalledRef.current = true
    setOverlayVisible(false)
    stopAudio()
    onComplete()
  }, [onComplete, stopAudio])

  useEffect(() => {
    if (!started) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [started, handleSkip])

  const startIntro = async () => {
    if (started) return
    setStarted(true)

    try {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new Ctor()
      if (ctx.state === "suspended") {
        await ctx.resume()
      }
      audioCtxRef.current = ctx

      const audio = new Audio(introAudioSrc)
      audio.crossOrigin = "anonymous"
      audio.preload = "auto"
      audioRef.current = audio

      const source = ctx.createMediaElementSource(audio)
      sourceRef.current = source

      const anal = ctx.createAnalyser()
      anal.fftSize = 512
      anal.smoothingTimeConstant = 0.82
      setAnalyser(anal)

      // Ecualización Acústica Premium Cinematográfica
      const bass = ctx.createBiquadFilter()
      bass.type = "lowshelf"
      bass.frequency.value = 220
      bass.gain.value = 7 // Realce del latido profundo de la montaña

      const high = ctx.createBiquadFilter()
      high.type = "highshelf"
      high.frequency.value = 7000
      high.gain.value = 3 // Brillo y cristalización armónica

      const compressor = ctx.createDynamicsCompressor()
      compressor.threshold.value = -24
      compressor.knee.value = 20
      compressor.ratio.value = 4.0
      compressor.attack.value = 0.01
      compressor.release.value = 0.22

      // Entorno de reverberación espacial (Delay estéreo cruzado)
      const delay = ctx.createDelay(1.0)
      delay.delayTime.value = 0.35
      const feedback = ctx.createGain()
      feedback.gain.value = 0.38
      const wet = ctx.createGain()
      wet.gain.value = 0.25
      const dry = ctx.createGain()
      dry.gain.value = 1.0

      source.connect(bass)
      bass.connect(high)
      high.connect(dry)
      dry.connect(compressor)

      source.connect(delay)
      delay.connect(feedback)
      feedback.connect(delay)
      delay.connect(wet)
      wet.connect(compressor)

      compressor.connect(anal)
      anal.connect(ctx.destination)

      audio.volume = 0
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        await playPromise
      }

      // Fundido de entrada acústico ultra-suave
      fadeInIntervalRef.current = window.setInterval(() => {
        if (!audioRef.current) return
        const nextVol = Math.min(audioRef.current.volume + 0.3, 0.9)
        audioRef.current.volume = nextVol
        if (nextVol >= 0.9 && fadeInIntervalRef.current) {
          clearInterval(fadeInIntervalRef.current)
        }
      }, 100)

      // Fundido de salida al cierre definitivo de la experiencia sonora
      setTimeout(() => {
        if (!audioRef.current) return
        fadeIntervalRef.current = window.setInterval(() => {
          if (!audioRef.current) return
          const nextVol = Math.max(audioRef.current.volume - 0.04, 0)
          audioRef.current.volume = nextVol
          if (nextVol <= 0 && fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current)
            stopAudio()
          }
        }, 100)
      }, 73000)

      audio.addEventListener("ended", () => {
        setOverlayVisible(false)
        onComplete()
      })
    } catch (e) {
      console.error("Audio cinematic init failed:", e)
    }
  }

  // Cronograma Maestro de Transición de Épocas y Sentimientos
  useEffect(() => {
    if (!started) return

    const timers = [
      setTimeout(() => setPhase(1), 1200),   // Alianza e Identidad Inicial
      setTimeout(() => setPhase(2), 10500),  // Sacrificio y Dedicación Perpetua
      setTimeout(() => setPhase(3), 21500), // La Promesa del Silencio Absoluto
      setTimeout(() => setPhase(4), 34500), // El Retorno Glorioso y Entrega
      setTimeout(() => setPhase(5), 43500), // Mística Territorial de Real del Monte
      setTimeout(() => setPhase(6), 54500), // Historia Tallada en Plata Viva
      setTimeout(() => setPhase(7), 65000), // El Legado Inquebrantable de las 7 Federaciones
      setTimeout(() => setPhase(8), 73500), // El Horizonte Digital Absoluto
      setTimeout(() => {
        setOverlayVisible(false)
        onComplete()
      }, 98000),
    ]

    return () => timers.forEach(clearTimeout)
  }, [started, onComplete])

  useEffect(() => {
    return () => {
      if (cleanupCalledRef.current) return
      cleanupCalledRef.current = true
      stopAudio()
    }
  }, [stopAudio])

  // Biblioteca Narrativa Universal: El Manifiesto de Orgullo
  const scene = (() => {
    switch (phase) {
      case 0:
      case 1:
        return {
          tag: "TAMV ONLINE NETWORK — ALIANZA GLOBAL",
          title: "Orgullosamente Realmontenses",
          body: "Una arquitectura digital inquebrantable, forjada en la cumbre de la montaña por manos que desafían el frío, custodian la niebla y hacen latir el corazón mineral de la historia.",
        }
      case 2:
        return {
          tag: "HOMENAJE ETERNO",
          title: "Inspirado en Reina Trejo Serrano",
          body: "Porque detrás de cada obra monumental construida para la eternidad, existió una mujer extraordinaria que sostuvo los cimientos del universo en absoluto silencio.",
        }
      case 3:
        return {
          tag: "EL SACRIFICIO DE UNA MADRE",
          title: "A ti que resguardaste noches infinitas",
          body: "A la guardiana de mis primeros pasos, quien desde las sombras del cansancio protegió mi porvenir sin un solo reproche, entregando su propia vida para esculpir mis alas y mis horizontes.",
        }
      case 4:
        return {
          tag: "EL TRIUNFO DE LA SANGRE",
          title: "Hoy tu oveja negra redefine el destino",
          body: "Sonríe con el alma y levanta la mirada hacia el cielo, madre: lo hemos logrado. Toda esta inmensidad tecnológica e histórica es tu fruto. Te amo con devoción eterna.",
        }
      case 5:
        return {
          tag: "GEOGRAFÍA SAGRADA",
          title: "Un Santuario Elevado Junto al Cielo",
          body: "Entre hilos de neblina perpetua, ráfagas de viento y el tañido de campanas coloniales, un pueblo mágico despierta al mundo para narrar su señorío indomable.",
        }
      case 6:
        return {
          tag: "MEMORIA, PLATA Y RESILIENCIA",
          title: "Una Tierra Donde la Piedra Cobra Vida",
          body: "Aquí cada veta mineral guarda un lamento heroico, cada callejón empedrado custodia una leyenda de honor, y cada mirada realmontense porta un destello de inmortalidad.",
        }
      case 7:
        return {
          tag: "EL IMPERIO DE LAS 7 FEDERACIONES",
          title: "Esto no es un Proyecto; Es un Legado Perpetuo",
          body: "La convergencia perfecta de nuestras 7 federaciones unidas bajo un solo estandarte digital. Diseñado para trascender los siglos y guiar con orgullo a las generaciones del mañana.",
        }
      case 8:
      default:
        return {
          tag: "EL UMBRAL DE LA NUEVA ERA",
          title: "Real del Monte Digital",
          body: "Bienvenidos a la cumbre de la sofisticación tecnológica. Una experiencia creada con el alma pura, la memoria intacta y el orgullo inquebrantable de nuestra raza.",
        }
    }
  })()

  const heroImages = [
    "/images/rdm-hero.png",
    "/images/realito-pasterias.png",
    "/images/realito-platerias.png",
    "/images/realito-sanitarios.png",
  ]

  const heroIndex =
    phase <= 2 ? 0 : phase === 3 ? 1 : phase === 4 ? 2 : phase === 5 ? 3 : 0

  return (
    <AnimatePresence>
      {overlayVisible && (
        <motion.div
          exit={{ opacity: 0, filter: "blur(30px)" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(circle at center, hsl(222, 50%, 6%) 0%, hsl(224, 60%, 3%) 50%, hsl(225, 80%, 1%) 100%)",
            cursor: !started ? "pointer" : "default",
          }}
          onClick={!started ? startIntro : undefined}
        >
          {/* BOTÓN OMITIR INTRO (Elegancia minimalista reservada para pantallas activas) */}
          {started && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              whileHover={{ opacity: 0.9, scale: 1.05 }}
              onClick={(e) => {
                e.stopPropagation()
                handleSkip()
              }}
              className="absolute right-6 top-6 z-[60] font-mono text-[10px] tracking-[0.4em] text-white uppercase border border-white/20 px-4 py-2 rounded-full backdrop-blur-md transition-all"
            >
              Omitir Experiencia [ESC]
            </motion.button>
          )}

          {/* Interfaz de entrada: Pantalla Sagrada de Inicio */}
          {!started && (
            <motion.div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-8"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full blur-3xl opacity-60"
                  style={{ background: "radial-gradient(circle, hsl(43, 100%, 60%) 0%, transparent 70%)" }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <img
                  src="/images/rdm-hero.png"
                  alt="RDM Digital Maestría"
                  className="relative h-44 w-44 rounded-full object-cover md:h-60 md:w-60"
                  style={{
                    filter: "drop-shadow(0 0 50px hsla(43,90%,55%,0.45)) saturate(1.15) contrast(1.1)",
                    border: "2px solid hsla(43, 80%, 60%, 0.4)"
                  }}
                />
              </div>
              <div className="text-center space-y-2">
                <p className="text-[11px] tracking-[0.45em] uppercase text-amber-200/80 font-mono">
                  TAMV Online Network Presenta
                </p>
                <p className="text-xs tracking-[0.3em] uppercase text-sky-200/60">
                  Toca la pantalla para iniciar la experiencia sonora territorial
                </p>
              </div>
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-full border-2"
                style={{ borderColor: "hsla(43, 80%, 60%, 0.5)" }}
                animate={{
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    "0 0 0px hsla(43,80%,60%,0)",
                    "0 0 40px hsla(43,90%,60%,0.4)",
                    "0 0px hsla(43,80%,60%,0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  className="ml-1.5 h-0 w-0 border-b-[8px] border-t-[8px] border-l-[15px] border-b-transparent border-t-transparent"
                  style={{ borderLeftColor: "hsl(43, 90%, 65%)" }}
                />
              </motion.div>
            </motion.div>
          )}

          {started && (
            <>
              {/* Paisajes de Fondo Cinematográficos Dinámicos */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  className="absolute inset-0 z-0"
                  initial={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
                  animate={{ opacity: 0.55, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                >
                  <img
                    src={heroImages[heroIndex]}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{
                      filter: "saturate(0.7) contrast(1.2) brightness(0.4)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(224,70%,3%)] via-[hsla(224,40%,2%,0.75)] to-[hsl(225,50%,3%)]" />
                </motion.div>
              </AnimatePresence>

              {/* Velo de Oscuridad Absoluta para Fases Íntimas */}
              <motion.div
                className="absolute inset-0 z-[1]"
                animate={{
                  backgroundColor:
                    phase === 2 || phase === 3 || phase === 4
                      ? "rgba(0, 0, 0, 0.75)"
                      : "rgba(0, 0, 0, 0.35)",
                }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />

              {/* Bóveda Celeste Estelar y Simulación Fluidodinámica de Neblinas */}
              <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
                {stars.map((star) => (
                  <motion.div
                    key={star.id}
                    className="absolute rounded-full"
                    style={{
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      background: star.color,
                      left: `${star.baseX}%`,
                      top: `${star.baseY}%`,
                      boxShadow:
                        star.layer === 2
                          ? "0 0 15px hsla(43,100%,75%,0.9)"
                          : "0 0 8px hsla(212,100%,80%,0.6)",
                    }}
                    initial={{ opacity: 0, scale: 0, y: 0 }}
                    animate={{
                      opacity: [0, star.layer === 2 ? 1 : 0.7, 0.3, 0.9, 0],
                      scale: [0.5, 1.6, 1, 1.8, 0.5],
                      y: [0, star.driftY, star.driftY * 1.05, 0],
                      x: [0, star.driftX, star.driftX * 0.9, 0],
                    }}
                    transition={{
                      duration: star.duration,
                      repeat: Infinity,
                      delay: star.delay,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Nebulosas y Volumetría de Humo Emocional */}
                <motion.div
                  className="absolute inset-[-30%] blur-[120px]"
                  animate={{
                    opacity: [0.25, 0.5, 0.25],
                    rotate: [0, 45, 0],
                  }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 25% 25%, hsla(212,100%,60%,0.25) 0, transparent 50%), radial-gradient(circle at 75% 75%, hsla(43,95%,55%,0.2) 0, transparent 55%), radial-gradient(circle at 50% 50%, hsla(275,80%,65%,0.18) 0, transparent 65%)",
                    mixBlendMode: "screen",
                  }}
                />
              </div>

              {/* Anillos Astrales Concéntricos (Geometría Sagrada de la Red) */}
              <motion.div
                className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[0, 1, 2, 3].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute rounded-full"
                    style={{
                      width: `${460 + ring * 190}px`,
                      height: `${460 + ring * 190}px`,
                      border: `1px solid ${
                        ring === 1
                          ? "hsla(43,85%,60%,0.22)"
                          : "hsla(212,100%,70%,0.15)"
                      }`,
                    }}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{
                      opacity: [0, 0.35, 0.1],
                      scale: [0.4, 1, 1.08],
                      rotate: ring % 2 === 0 ? [0, 360] : [90, -270],
                    }}
                    transition={{
                      duration: 5 + ring * 1.2,
                      ease: "linear",
                      repeat: Infinity,
                      delay: ring * 0.3,
                    }}
                  />
                ))}
              </motion.div>

              {/* El Núcleo de Oro y Cristal RDM */}
              <motion.div
                initial={{ opacity: 0, scale: 0.3, filter: "blur(30px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-[4] mb-8 flex items-center justify-center"
              >
                <motion.div
                  className="absolute h-72 w-72 rounded-full blur-3xl md:h-[360px] md:w-[360px]"
                  style={{
                    background: "radial-gradient(circle, hsla(43,90%,55%,0.35) 0%, hsla(212,80%,50%,0.2) 50%, transparent 75%)",
                  }}
                  animate={{
                    opacity: [0.4, 0.75, 0.4],
                    scale: [1, 1.06, 1],
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <div
                  className="relative flex h-44 w-44 flex-col items-center justify-center rounded-full md:h-56 md:w-56"
                  style={{
                    background: "linear-gradient(135deg, hsla(224,40%,12%,0.98), hsla(225,60%,6%,0.99))",
                    border: "2px solid hsla(43,85%,60%,0.6)",
                    boxShadow: "0 0 80px hsla(212,100%,55%,0.35), inset 0 0 35px hsla(43,100%,60%,0.15)",
                  }}
                >
                  <div className="text-center px-4 space-y-0.5">
                    <p className="font-mono text-[9px] tracking-[0.4em] text-sky-300/80 uppercase md:text-[10px]">
                      RDM DIGITAL
                    </p>
                    <h2
                      className="font-serif text-2xl font-black tracking-wide md:text-3xl"
                      style={{
                        background: "linear-gradient(135deg, hsl(43, 90%, 80%), hsl(43, 70%, 50%))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      REAL DEL
                    </h2>
                    <h2
                      className="font-serif text-2xl font-black tracking-wide md:text-3xl"
                      style={{
                        background: "linear-gradient(135deg, hsl(0, 0%, 100%), hsl(212, 80%, 75%))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      MONTE
                    </h2>
                  </div>
                </div>
              </motion.div>

              {/* Bloque Central de Textos Épicos */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 40, filter: "blur(15px)", scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                  exit={{ opacity: 0, y: -30, filter: "blur(12px)", scale: 1.03 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-[5] mb-6 flex max-w-4xl flex-col items-center px-6 text-center"
                >
                  <p
                    className="mb-4 text-[10px] tracking-[0.6em] font-mono uppercase md:text-xs"
                    style={{
                      color: phase === 2 || phase === 3 || phase === 4 ? "hsl(43, 90%, 75%)" : "hsl(212, 80%, 75%)",
                    }}
                  >
                    {scene.tag}
                  </p>

                  <h1
                    className="font-serif text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
                    style={{
                      background: "linear-gradient(135deg, hsl(0, 0%, 100%) 0%, hsl(43, 85%, 75%) 40%, hsl(212, 80%, 80%) 80%, hsl(0, 0%, 90%) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {scene.title}
                  </h1>

                  <motion.div
                    className="mx-auto my-5 h-[2px]"
                    style={{
                      background: "linear-gradient(90deg, transparent, hsl(43,90%,60%), hsl(212,100%,65%), transparent)",
                    }}
                    initial={{ width: 0 }}
                    animate={{
                      width: phase <= 2 ? "14rem" : phase <= 4 ? "22rem" : "16rem"
                    }}
                    transition={{ duration: 1.3, ease: "easeOut" }}
                  />

                  <p className="mx-auto max-w-2xl text-sm leading-relaxed tracking-wide text-slate-300/90 font-light md:text-lg">
                    {scene.body}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Ecualizadores Acústicos en Sintonía */}
              <motion.div
                initial={{ opacity: 0, scaleY: 0.4 }}
                animate={phase >= 1 ? { opacity: 1, scaleY: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                className="relative z-[5] mb-8 flex flex-col items-center gap-1.5"
              >
                <AudioEqualizer analyser={analyser} />
                <AudioWaveform analyser={analyser} />
                <p className="mt-1 font-mono text-[9px] tracking-[0.45em] text-slate-500 uppercase">
                  TAMV SYSTEM · ARMONIZACIÓN GEOLOCALIZADA
                </p>
              </motion.div>

              {/* Carrusel del Patrimonio Realmontense Inferior Completo */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 2 }}
                className="absolute bottom-12 z-[5] flex w-full justify-center gap-6 px-4"
              >
                {[
                  { src: "/images/realito-pasterias.png", label: "Gastronomía" },
                  { src: "/images/realito-platerias.png", label: "Artesanías" },
                  { src: "/images/realito-sanitarios.png", label: "Servicios" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={phase >= 5 ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 1.2, delay: i * 0.2 }}
                    className="group relative"
                  >
                    <div
                      className="h-20 w-20 overflow-hidden rounded-2xl md:h-24 md:w-24 transition-all duration-500 group-hover:scale-105"
                      style={{
                        border: "1px solid hsla(43,85%,60%,0.3)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px hsla(212,100%,50%,0.15)",
                      }}
                    >
                      <img
                        src={item.src}
                        alt={item.label}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-slate-400 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
