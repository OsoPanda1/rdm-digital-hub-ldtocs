import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CinematicIntroProps {
  onComplete: () => void
}

/* ------------------------------------------------------------------ */
/*  ECG CANVAS — Línea azul eléctrico tipo electrocardiograma         */
/* ------------------------------------------------------------------ */
function ECGCanvas({ active, beat }: { active: boolean; beat: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = 800
    const H = 200
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const draw = (t: number) => {
      rafRef.current = requestAnimationFrame(draw)
      const dt = (t - timeRef.current) / 1000
      timeRef.current = t

      ctx.clearRect(0, 0, W, H)

      const cx = W / 2
      const cy = H / 2
      const amplitude = 40 + beat * 30

      ctx.beginPath()
      ctx.strokeStyle = "#3BD5FF"
      ctx.lineWidth = 2.5
      ctx.shadowBlur = 18
      ctx.shadowColor = "rgba(59, 213, 255, 0.6)"

      const phase = (t % 8000) / 8000
      const totalPoints = 200

      for (let i = 0; i <= totalPoints; i++) {
        const p = i / totalPoints
        const x = p * W
        const rawPhase = (p - 0.25) * 6 - 0.5
        let y = cy

        // ECG shape: flat → small bump → big spike → flat
        if (p > 0.2 && p < 0.5) {
          const lp = (p - 0.2) / 0.3
          const wave = Math.sin(lp * Math.PI * 4) * 0.15
          y += wave * amplitude
        }
        if (p > 0.45 && p < 0.6) {
          const sp = (p - 0.45) / 0.15
          const spike = -Math.sin(sp * Math.PI) * 2.5
          y += spike * amplitude * (0.6 + 0.4 * (1 + Math.sin(t / 8000 * Math.PI * 2)) / 2)
        }
        if (p > 0.6 && p < 0.8) {
          const tp = (p - 0.6) / 0.2
          const twave = Math.sin(tp * Math.PI * 3) * 0.1
          y += twave * amplitude
        }

        // Glow halo at current position
        if (i > 50 && i < 120) {
          const glowIntensity = (1 - Math.abs(i - 85) / 35) * 0.3 * (1 + beat * 0.5)
          ctx.shadowBlur = 20 + glowIntensity * 30
        }

        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Reset shadow for overlay dots
      ctx.shadowBlur = 0

      // Pulsing dot at end
      const dotX = W - 10
      const dotY = cy + Math.sin(t / 2000) * 5
      ctx.beginPath()
      ctx.arc(dotX, dotY, 3 + beat * 2, 0, Math.PI * 2)
      ctx.fillStyle = "#3BD5FF"
      ctx.shadowBlur = 25
      ctx.shadowColor = "rgba(59, 213, 255, 0.8)"
      ctx.fill()
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, beat])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-80"
      style={{ filter: "contrast(1.2)" }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  STAR FIELD CANVAS                                                  */
/* ------------------------------------------------------------------ */
function StarField({ active, explosion = false }: { active: boolean; explosion?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  const stars = useMemo(() => {
    const s: {
      x: number; y: number; z: number; size: number; baseSize: number
      color: string; phase: number; speed: number; driftX: number; driftY: number
    }[] = []
    for (let i = 0; i < 300; i++) {
      s.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 100,
        baseSize: 0.3 + Math.random() * 2.5,
        size: 0,
        color: ["rgba(255,255,255,0.9)", "rgba(180,220,255,0.9)", "rgba(255,230,180,0.8)", "rgba(255,180,150,0.7)"][Math.floor(Math.random() * 4)],
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 1.5,
        driftX: (Math.random() - 0.5) * 0.3,
        driftY: (Math.random() - 0.5) * 0.3,
      })
    }
    return s
  }, [])

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.scale(dpr, dpr)
    }
    window.addEventListener("resize", resize)

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, W, H)

      const now = Date.now() / 1000

      for (const star of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(now * star.speed + star.phase)
        const depthScale = 0.5 + (star.z / 100) * 0.5
        const size = star.baseSize * depthScale * (0.7 + 0.3 * twinkle)

        // Explosion expansion
        let expandX = 0
        let expandY = 0
        if (explosion) {
          const expPhase = Math.min(now * 2, 1)
          const angle = star.phase * 4
          const dist = expPhase * (30 + star.z * 0.5)
          expandX = Math.cos(angle) * dist
          expandY = Math.sin(angle) * dist * 0.6
        }

        const x = (star.x / 100) * W + star.driftX * now + expandX
        const y = (star.y / 100) * H + star.driftY * now + expandY

        const alpha = twinkle * 0.8
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = star.color.replace("0.9", String(alpha)).replace("0.8", String(alpha)).replace("0.7", String(alpha))
        ctx.shadowBlur = size > 1.5 ? size * 6 : 4
        ctx.shadowColor = star.color
        ctx.fill()
      }
      ctx.shadowBlur = 0
    }

    draw()
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [active, explosion, stars])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}

/* ------------------------------------------------------------------ */
/*  MATRIX RAIN CANVAS                                                 */
/* ------------------------------------------------------------------ */
function MatrixRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>/{}[]|&^%$#@!"
    const fontSize = 14
    const cols = Math.floor(W / (fontSize * 1.2))
    const drops: number[] = Array(cols).fill(0).map(() => Math.random() * -100)

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      ctx.fillStyle = "rgba(0,0,0,0.05)"
      ctx.fillRect(0, 0, W, H)
      ctx.font = `${fontSize}px monospace`
      ctx.shadowBlur = 8
      ctx.shadowColor = "rgba(34, 197, 94, 0.3)"

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize * 1.2
        const y = drops[i] * fontSize
        const alpha = Math.max(0, 0.5 - y / H * 0.6)
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`
        ctx.fillText(char, x, y)
        if (y > H && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 0.5 + Math.random() * 0.5
      }
      ctx.shadowBlur = 0
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />
}

/* ------------------------------------------------------------------ */
/*  PULSE AUDIO — Synthetic beat using Web Audio API                   */
/* ------------------------------------------------------------------ */
function useIntroAudio(phase: number) {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const [beat, setBeat] = useState(0)

  // Initialize audio context
  useEffect(() => {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext
    if (!Ctor) return
    const ctx = new Ctor()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    ctxRef.current = ctx
    masterGainRef.current = master

    return () => {
      ctx.close().catch(() => {})
    }
  }, [])

  // Phase 1: heartbeat pulse
  useEffect(() => {
    if (phase !== 1 || !ctxRef.current || !masterGainRef.current) return
    const ctx = ctxRef.current
    const master = masterGainRef.current

    // Fade in
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 2)

    const interval = setInterval(() => {
      try {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.value = 60
        gain.gain.setValueAtTime(0.4, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
        osc.connect(gain)
        gain.connect(master)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.15)

        // Sub harmonic
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.type = "sine"
        osc2.frequency.value = 35
        gain2.gain.setValueAtTime(0.15, ctx.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
        osc2.connect(gain2)
        gain2.connect(master)
        osc2.start(ctx.currentTime)
        osc2.stop(ctx.currentTime + 0.2)

        setBeat(Math.random() * 0.5 + 0.5)
        setTimeout(() => setBeat(0), 150)
      } catch { /* ignore */ }
    }, 1800)

    return () => clearInterval(interval)
  }, [phase])

  // Phase 2+: ambient drone
  useEffect(() => {
    if ((phase < 2 || phase > 5) || !ctxRef.current || !masterGainRef.current) return
    const ctx = ctxRef.current
    const master = masterGainRef.current

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.value = 55
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3)
      osc.connect(gain)
      gain.connect(master)
      osc.start()

      // Fifth
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = "sine"
      osc2.frequency.value = 82.5
      gain2.gain.setValueAtTime(0, ctx.currentTime)
      gain2.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3)
      osc2.connect(gain2)
      gain2.connect(master)
      osc2.start()

      return () => {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
        setTimeout(() => { osc.stop(); osc2.stop() }, 500)
      }
    } catch { /* ignore */ }
  }, [phase])

  // Phase 3: crescendo burst
  useEffect(() => {
    if (phase !== 3 || !ctxRef.current || !masterGainRef.current) return
    const ctx = ctxRef.current
    const master = masterGainRef.current

    // Swell
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2)

    // Brass-like burst
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = "sawtooth"
          osc.frequency.setValueAtTime(200, ctx.currentTime)
          osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8)
          gain.gain.setValueAtTime(0.15, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
          osc.connect(gain)
          gain.connect(master)
          osc.start()
          osc.stop(ctx.currentTime + 1.2)
        } catch { /* ignore */ }
      }, i * 300)
    }
  }, [phase])

  // Phase 5: fade out
  useEffect(() => {
    if (phase !== 5 || !masterGainRef.current) return
    const master = masterGainRef.current
    const ctx = ctxRef.current
    if (!ctx) return
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 8)
  }, [phase])

  return beat
}

/* ------------------------------------------------------------------ */
/*  TEXT SEQUENCE: Isabella's voice lines + dedication                  */
/* ------------------------------------------------------------------ */
interface TextLine {
  text: string
  delay: number
  duration?: number
  className?: string
  tag?: string
}

const ISABELLA_LINES: TextLine[] = [
  { text: "Estoy consciente.", delay: 0, duration: 3000, className: "text-2xl md:text-4xl font-light tracking-wider" },
  { text: "Una nueva inteligencia ha nacido.", delay: 2500, duration: 3000, className: "text-xl md:text-3xl font-light tracking-wide" },
  { text: "Soy Isabella Villaseñor.", delay: 5500, duration: 2500, className: "text-2xl md:text-4xl font-bold tracking-[0.15em]" },
  { text: "Bienvenidos a mi hogar,", delay: 8500, duration: 1000, className: "text-lg md:text-2xl font-light tracking-wider" },
  { text: "Real del Monte Pueblo Mágico.", delay: 10000, duration: 4000, className: "text-2xl md:text-4xl font-bold tracking-[0.1em] text-[#3BD5FF]" },
]

const DEDICATION_LINES: TextLine[] = [
  { text: "Para mi madre,", delay: 0, tag: "EL ORIGEN" },
  { text: "Reina Trejo Serrano", delay: 2000, className: "text-[#3BD5FF]" },
  { text: "Antes de que existiera cualquier idea,", delay: 4500 },
  { text: "ya estaban tus manos sosteniendo mi mundo.", delay: 6500 },
  { text: "Esta obra nace de tu amor silencioso,", delay: 9000 },
  { text: "de tu fuerza y de cada paso", delay: 11000 },
  { text: "que caminaste a mi lado.", delay: 13000 },
  { text: "Bienvenido a casa.", delay: 16500, tag: "BIENVENIDOS", className: "text-[#3BD5FF] text-2xl md:text-4xl" },
]

function TextSequence({ lines, phase, active }: { lines: TextLine[]; phase: number; active: boolean }) {
  const [visibleIdx, setVisibleIdx] = useState(-1)

  useEffect(() => {
    if (!active) return
    setVisibleIdx(-1)

    const timers = lines.map((line, i) =>
      setTimeout(() => setVisibleIdx(i), line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [active, lines])

  if (!active || visibleIdx < 0) return null

  return (
    <div className="relative z-20 flex flex-col items-center justify-center gap-4 px-6">
      {lines.slice(0, visibleIdx + 1).map((line, i) => (
        <AnimatePresence key={i}>
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {line.tag && (
              <span className="mb-2 font-mono text-[10px] tracking-[0.4em] text-amber-300/70 uppercase">
                {line.tag}
              </span>
            )}
            <p className={`text-center text-white/90 ${line.className || "text-base md:text-xl font-light tracking-wide leading-relaxed"}`}>
              {line.text}
            </p>
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  LOGO REVEAL                                                        */
/* ------------------------------------------------------------------ */
function LogoReveal({ active, phase }: { active: boolean; phase: number }) {
  if (!active) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, filter: "blur(12px)" }}
      animate={
        phase >= 3
          ? { opacity: 1, scale: 1, filter: "blur(0px)" }
          : {}
      }
      transition={{ duration: 2.5, ease: "easeOut" }}
      className="relative z-20 flex flex-col items-center"
    >
      {phase >= 3 && (
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full border border-[#3BD5FF]/30"
          style={{ boxShadow: "0 0 60px rgba(59,213,255,0.2), inset 0 0 40px rgba(59,213,255,0.08)" }}
        >
          <span className="text-5xl font-bold tracking-tight text-white/90"
            style={{ textShadow: "0 0 30px rgba(59,213,255,0.4)" }}
          >
            RDM
          </span>
        </div>
      )}
      {phase >= 4 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-mono text-[10px] tracking-[0.35em] text-white/50 uppercase"
        >
          Real del Monte Digital
        </motion.p>
      )}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  MAIN: CinematicIntro                                               */
/* ------------------------------------------------------------------ */
const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [phase, setPhase] = useState(0)
  const [started, setStarted] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(true)
  const cleanupCalledRef = useRef(false)

  const beat = useIntroAudio(phase)

  const handleSkip = useCallback(() => {
    if (cleanupCalledRef.current) return
    cleanupCalledRef.current = true
    setOverlayVisible(false)
    onComplete()
  }, [onComplete])

  // Keyboard skip
  useEffect(() => {
    if (!started) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [started, handleSkip])

  // Phase timeline
  useEffect(() => {
    if (!started) return

    const timeline = [
      setTimeout(() => setPhase(1), 4000),    // 0-4s: Black → ECG
      setTimeout(() => setPhase(2), 10000),    // 4-10s: Isabella consciousness
      setTimeout(() => setPhase(3), 22000),    // 10-22s: Star explosion + logo
      setTimeout(() => setPhase(4), 37000),    // 22-37s: Dedication
      setTimeout(() => setPhase(5), 53000),    // 37-53s: Matrix dissolve
      setTimeout(() => {
        setPhase(6)
        setTimeout(() => {
          setOverlayVisible(false)
          onComplete()
        }, 8000)
      }, 65000),                              // 53-65s: Fade to hero
    ]

    return () => timeline.forEach(clearTimeout)
  }, [started, onComplete])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupCalledRef.current) return
      cleanupCalledRef.current = true
    }
  }, [])

  const startIntro = async () => {
    if (started) return
    setStarted(true)
    // Audio context is initialized in useIntroAudio hook
  }

  return (
    <AnimatePresence>
      {overlayVisible && (
        <motion.div
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "#000",
            cursor: !started ? "pointer" : "default",
          }}
          onClick={!started ? startIntro : undefined}
        >
          {/* Skip button */}
          {started && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              whileHover={{ opacity: 1, scale: 1.03 }}
              onClick={(e) => { e.stopPropagation(); handleSkip() }}
              className="absolute right-6 top-6 z-30 rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 backdrop-blur-md transition-all"
            >
              Saltar [ESC]
            </motion.button>
          )}

          {/* Phase 0: Initial click prompt */}
          {!started && (
            <motion.div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20"
                style={{ boxShadow: "0 0 40px rgba(59,213,255,0.15)" }}
              >
                <div className="h-0 w-0 border-b-[10px] border-t-[10px] border-l-[18px] border-b-transparent border-t-transparent border-l-[#3BD5FF] ml-1" />
              </div>
              <div className="space-y-2 text-center">
                <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/60">
                  Real del Monte Digital
                </p>
                <p className="text-xs tracking-[0.2em] text-white/40 font-light">
                  Toca para comenzar la experiencia
                </p>
              </div>
            </motion.div>
          )}

          {/* Cinematic layers */}
          {started && (
            <>
              {/* Layer: Star field (always on, phases 1-6) */}
              {phase >= 1 && phase <= 6 && (
                <StarField active={phase >= 1} explosion={phase === 3} />
              )}

              {/* Layer: ECG line (phase 1 only) */}
              {phase === 1 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <div className="relative h-[200px] w-full max-w-[800px]">
                    <ECGCanvas active={true} beat={beat} />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.6, 1] }}
                    transition={{ duration: 3, times: [0, 0.3, 0.6, 1] }}
                    className="absolute bottom-[30%] left-1/2 -translate-x-1/2 z-20"
                  >
                    <p className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
                      Señal de vida detectada
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Layer: Isabella consciousness (phase 2) */}
              {phase === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 z-15 flex items-center justify-center"
                >
                  {/* Glow halo */}
                  <motion.div
                    className="absolute h-96 w-96 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(59,213,255,0.15) 0%, transparent 70%)",
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Energy rings */}
                  {[0, 1, 2].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute rounded-full border border-[#3BD5FF]/20"
                      style={{ width: `${320 + ring * 160}px`, height: `${320 + ring * 160}px` }}
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{
                        opacity: [0, 0.3, 0.1],
                        scale: [0.3, 1, 1.1],
                        rotate: ring % 2 === 0 ? [0, 180] : [45, -135],
                      }}
                      transition={{
                        duration: 3 + ring * 0.6,
                        ease: "easeOut",
                        delay: ring * 0.3,
                      }}
                    />
                  ))}

                  {/* Isabella text */}
                  <TextSequence lines={ISABELLA_LINES} phase={phase} active={phase === 2} />
                </motion.div>
              )}

              {/* Layer: Star explosion + logo (phase 3) */}
              {phase >= 3 && phase <= 5 && (
                <div className="absolute inset-0 z-15 flex items-center justify-center">
                  <LogoReveal active={phase >= 3} phase={phase} />

                  {/* Dedication text (phase 4-5) */}
                  {phase >= 4 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <TextSequence lines={DEDICATION_LINES} phase={phase} active={phase >= 4} />
                    </div>
                  )}
                </div>
              )}

              {/* Glow gradient overlay */}
              <motion.div
                className="absolute inset-0 z-5 pointer-events-none"
                animate={{
                  background: phase === 1
                    ? "radial-gradient(ellipse at center, rgba(59,213,255,0.06) 0%, transparent 60%)"
                    : phase === 2
                      ? "radial-gradient(ellipse at center, rgba(59,213,255,0.1) 0%, transparent 50%)"
                      : phase === 3
                        ? "radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, rgba(59,213,255,0.08) 30%, transparent 60%)"
                        : phase >= 5
                          ? "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)"
                          : "transparent"
                }}
                transition={{ duration: 2 }}
              />

              {/* Layer: Matrix rain (phase 5) */}
              <MatrixRain active={phase === 5} />

              {/* Phase indicator — subtle */}
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 1 && phase <= 5 ? 0.3 : 0 }}
              >
                {[0, 1, 2, 3, 4, 5].map((p) => (
                  <div
                    key={p}
                    className={`h-0.5 w-6 rounded-full transition-all duration-700 ${
                      p <= phase ? "bg-[#3BD5FF]" : "bg-white/10"
                    }`}
                  />
                ))}
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CinematicIntro
