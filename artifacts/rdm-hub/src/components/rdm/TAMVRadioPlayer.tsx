/**
 * TAMVRadioPlayer — TAMV 92.5 Radio Digital live stream player
 * Integrates with Caster FM Cloud stream.
 * Stream URL configurable via VITE_TAMV_STREAM_URL env var.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Radio, Wifi, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";

const TAMV_STREAM_URL = import.meta.env.VITE_TAMV_STREAM_URL || "https://tamv925.caster.fm/stream";

interface TAMVRadioPlayerProps {
  compact?: boolean;
  className?: string;
}

export function TAMVRadioPlayer({ compact = false, className = "" }: TAMVRadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = volume;

    audio.addEventListener("playing", () => { setLoading(false); setError(false); setPlaying(true); });
    audio.addEventListener("waiting", () => setLoading(true));
    audio.addEventListener("pause",   () => setPlaying(false));
    audio.addEventListener("error",   () => { setLoading(false); setError(true); setPlaying(false); });

    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing || loading) {
      audio.pause();
      audio.src = "";
      setPlaying(false);
      setLoading(false);
    } else {
      setLoading(true);
      setError(false);
      audio.src = TAMV_STREAM_URL;
      audio.load();
      audio.play().catch(() => { setLoading(false); setError(true); });
    }
  }, [playing, loading]);

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setMuted((m) => {
      audio.muted = !m;
      return !m;
    });
  }, []);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <motion.button
          onClick={togglePlay}
          whileTap={{ scale: 0.92 }}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 transition-colors"
        >
          {loading ? (
            <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : playing ? (
            <Pause className="w-3.5 h-3.5 text-red-400" />
          ) : (
            <Play className="w-3.5 h-3.5 text-red-400 ml-0.5" />
          )}
        </motion.button>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            TAMV 92.5
          </span>
          {playing ? (
            <span className="text-[9px] text-red-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              EN VIVO
            </span>
          ) : (
            <span className="text-[9px] text-white/40">Radio Digital</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-white/10 bg-[oklch(0.14_0.02_260)] overflow-hidden ${className}`}>
      {/* Station identity */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0">
            <Radio className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="font-bold text-white text-base leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              TAMV 92.5
            </p>
            <p className="text-xs text-white/50" style={{ fontFamily: "var(--font-body)" }}>
              Radio Digital · Real del Monte
            </p>
          </div>
          <div className="ml-auto">
            {error ? (
              <div className="flex items-center gap-1 text-white/30 text-[10px]">
                <WifiOff className="w-3 h-3" /> Sin señal
              </div>
            ) : playing ? (
              <div className="flex items-center gap-1.5 text-red-400 text-[10px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                EN VIVO
              </div>
            ) : (
              <div className="flex items-center gap-1 text-white/20 text-[10px]">
                <Wifi className="w-3 h-3" /> Listo
              </div>
            )}
          </div>
        </div>

        {/* Waveform animation when playing */}
        <AnimatePresence>
          {playing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 32 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-0.5 justify-center overflow-hidden mb-4"
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-red-400"
                  animate={{ height: [4, Math.random() * 20 + 8, 4] }}
                  transition={{ repeat: Infinity, duration: 0.6 + Math.random() * 0.8, delay: i * 0.04, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Now playing info */}
        <div className="text-center mb-4">
          <p className="text-sm text-white/70 font-medium" style={{ fontFamily: "var(--font-body)" }}>
            {playing ? "Transmisión en vivo" : "La voz de Real del Monte"}
          </p>
          <p className="text-[11px] text-white/30" style={{ fontFamily: "var(--font-body)" }}>
            Música · Cultura · Comunidad
          </p>
        </div>

        {/* Play button */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            onClick={togglePlay}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={error}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
            style={{
              background: playing ? "hsl(0 70% 45%)" : "hsl(0 70% 50%)",
              boxShadow: playing ? "0 0 32px hsl(0 70% 50% / 0.4)" : "none",
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : playing ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Volume control */}
      <div className="px-5 py-3 flex items-center gap-3">
        <button onClick={toggleMute} className="text-white/40 hover:text-white/70 transition-colors">
          {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={handleVolume}
          className="flex-1 h-1 rounded-full accent-red-500 cursor-pointer"
          style={{ background: `linear-gradient(to right, hsl(0 70% 50%) ${(muted ? 0 : volume) * 100}%, hsl(0 0% 25%) ${(muted ? 0 : volume) * 100}%)` }}
        />
        {error && (
          <p className="text-[10px] text-red-400/60" style={{ fontFamily: "var(--font-body)" }}>
            Stream no disponible
          </p>
        )}
      </div>

      {/* Footer link */}
      <div className="px-5 pb-4 text-center">
        <Link
          to="/musica"
          className="text-[10px] text-white/25 hover:text-[hsl(var(--rdm-amber)/0.6)] transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Ver toda la programación →
        </Link>
      </div>
    </div>
  );
}
