// src/components/rdm/RadioPlayer.tsx
// RDM Digital Hub — TAMV 92.5 FM Radio Player
// Integrates with AzuraCast REST API for real-time now-playing data.
// Replaces Caster.fm dependency with self-hosted AzuraCast.

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, SkipForward, ExternalLink } from "lucide-react";

interface NowPlayingData {
  song: {
    title: string;
    artist: string;
    album: string;
    art: string;
    duration: number;
  };
  playlist: string;
  is_request: boolean;
  elapsed: number;
  remaining: number;
  listeners: {
    total: number;
    unique: number;
    current: number;
  };
  live: {
    is_live: boolean;
    streamer_name: string;
  };
  station: {
    name: string;
    description: string;
    genre: string;
    url: string;
    mounts: Array<{ name: string; url: string }>;
  };
}

interface RadioPlayerProps {
  /** AzuraCast server URL (e.g., "https://radio.tamv.com.mx") */
  serverUrl?: string;
  /** Station shortcode (e.g., "tamv925") */
  stationShortcode?: string;
  /** Show compact mode (mini player) */
  compact?: boolean;
  /** Custom className */
  className?: string;
}

const DEFAULT_SERVER = import.meta.env.VITE_RADIO_SERVER_URL || "http://localhost:8000";
const DEFAULT_STATION = import.meta.env.VITE_RADIO_STATION || "tamv925";
const POLL_INTERVAL = 15000; // 15 seconds

export function RadioPlayer({
  serverUrl = DEFAULT_SERVER,
  stationShortcode = DEFAULT_STATION,
  compact = false,
  className = "",
}: RadioPlayerProps) {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch now-playing data
  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch(`${serverUrl}/api/nowplaying/${stationShortcode}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNowPlaying(data);
      setError(null);
    } catch (err) {
      console.error("[RadioPlayer] Failed to fetch now-playing:", err);
      setError("No se pudo conectar a la radio");
    } finally {
      setLoading(false);
    }
  }, [serverUrl, stationShortcode]);

  // Initial fetch + polling
  useEffect(() => {
    fetchNowPlaying();
    intervalRef.current = setInterval(fetchNowPlaying, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchNowPlaying]);

  // Audio element management
  const getAudioSrc = useCallback(() => {
    const mount = nowPlaying?.station?.mounts?.[0]?.name || stationShortcode;
    return `${serverUrl}/listen/${mount}`;
  }, [serverUrl, stationShortcode, nowPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.src = getAudioSrc();
      audio.volume = volume;
      audio.play().catch(() => {
        setError("Error al reproducir la radio");
      });
      setIsPlaying(true);
    }
  }, [isPlaying, getAudioSrc, volume]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    const audio = audioRef.current;
    if (audio) audio.volume = newVolume;
    setVolume(newVolume);
    if (newVolume === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  }, [isMuted]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (loading && !nowPlaying) {
    return (
      <div className={`animate-pulse bg-muted rounded-xl p-4 ${className}`}>
        <div className="h-4 bg-muted-foreground/20 rounded w-1/3 mb-2" />
        <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-3 bg-gradient-to-r from-[hsl(220,30%,8%)] to-[hsl(220,30%,15%)] rounded-lg p-3 ${className}`}>
        <audio ref={audioRef} preload="none" />

        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[hsl(45,80%,55%)] flex items-center justify-center text-black hover:bg-[hsl(45,80%,60%)] transition-colors flex-shrink-0"
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="text-white text-sm font-medium truncate">
            {nowPlaying?.song?.title || "TAMV 92.5 FM"}
          </div>
          <div className="text-white/60 text-xs truncate">
            {nowPlaying?.song?.artist || "Radio en vivo"}
          </div>
        </div>

        {nowPlaying?.listeners && (
          <span className="text-white/40 text-xs flex-shrink-0">
            {nowPlaying.listeners.current} oyentes
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-[hsl(220,30%,8%)] to-[hsl(220,30%,15%)] rounded-2xl overflow-hidden ${className}`}>
      <audio ref={audioRef} preload="none" />

      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <Radio size={18} className="text-[hsl(45,80%,55%)]" />
          <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
            TAMV 92.5 FM — En Vivo
          </span>
          {nowPlaying?.live?.is_live && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full animate-pulse">
              EN VIVO
            </span>
          )}
        </div>

        {/* Album Art + Song Info */}
        <div className="flex items-center gap-4">
          {nowPlaying?.song?.art && (
            <img
              src={nowPlaying.song.art}
              alt={nowPlaying.song.album || "Album art"}
              className="w-16 h-16 rounded-lg object-cover shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/tamv-radio-placeholder.png";
              }}
            />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-lg leading-tight truncate">
              {nowPlaying?.song?.title || "Sin conexion"}
            </h3>
            <p className="text-white/60 text-sm truncate mt-0.5">
              {nowPlaying?.song?.artist || "TAMV 92.5 FM"}
            </p>
            {nowPlaying?.song?.album && (
              <p className="text-white/40 text-xs truncate mt-0.5">
                {nowPlaying.song.album}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {nowPlaying?.elapsed != null && nowPlaying?.song?.duration != null && nowPlaying.song.duration > 0 && (
        <div className="px-6">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(45,80%,55%)] rounded-full transition-all duration-1000"
              style={{ width: `${(nowPlaying.elapsed / nowPlaying.song.duration) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/30 mt-1">
            <span>{formatTime(nowPlaying.elapsed)}</span>
            <span>{formatTime(nowPlaying.song.duration)}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="px-6 py-4 flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[hsl(45,80%,55%)] flex items-center justify-center text-black hover:bg-[hsl(45,80%,60%)] transition-all hover:scale-105"
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>

        <button
          onClick={toggleMute}
          className="text-white/60 hover:text-white transition-colors"
          aria-label={isMuted ? "Activar sonido" : "Silenciar"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[hsl(45,80%,55%)]"
          aria-label="Volumen"
        />

        {nowPlaying?.listeners && (
          <span className="text-white/40 text-xs">
            {nowPlaying.listeners.current} oyentes
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-4 flex items-center justify-between">
        <span className="text-white/30 text-xs">
          {nowPlaying?.station?.name || "TAMV 92.5 FM"}
        </span>
        <a
          href={serverUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/30 hover:text-white/60 text-xs flex items-center gap-1 transition-colors"
        >
          AzuraCast <ExternalLink size={10} />
        </a>
      </div>

      {error && (
        <div className="px-6 pb-4">
          <div className="bg-red-900/30 border border-red-800/50 rounded-lg px-3 py-2 text-red-400 text-xs">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default RadioPlayer;
