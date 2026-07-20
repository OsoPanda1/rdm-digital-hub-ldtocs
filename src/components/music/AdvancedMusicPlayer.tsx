import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Radio,
  Disc3,
  Users,
  Clock,
  Heart,
  Share2,
  Download,
  Waves,
  Lock,
  Unlock,
} from "lucide-react";
import { useAudioPlayer, type Track } from "@/contexts/AudioPlayerContext";

interface AdvancedMusicPlayerProps {
  tracks: Track[];
  isAdmin?: boolean;
  onLiveStreamToggle?: (enabled: boolean) => void;
  liveStreamActive?: boolean;
}

export function AdvancedMusicPlayer({
  tracks,
  isAdmin = false,
  onLiveStreamToggle,
  liveStreamActive = false,
}: AdvancedMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [streamEnabled, setStreamEnabled] = useState(false);
  const [listeners, setListeners] = useState(Math.floor(Math.random() * 50) + 5);

  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleEnded = () => handleNext();

    audio.addEventListener("loadedmetadata", handleMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleStream = () => {
    setStreamEnabled(!streamEnabled);
    onLiveStreamToggle?.(!streamEnabled);
    if (!streamEnabled) {
      setListeners(Math.floor(Math.random() * 100) + 10);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack?.src}
        crossOrigin="anonymous"
        onLoadedMetadata={() => {}}
      />

      {/* Main Player Card */}
      <motion.div
        className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-amber-500/20 p-8 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with Admin Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${streamEnabled ? "bg-red-500/20" : "bg-amber-500/20"}`}>
              <Radio className={`w-5 h-5 ${streamEnabled ? "text-red-500" : "text-amber-500"}`} />
            </div>
            <div>
              <h3 className="font-display text-lg text-white">Real del Monte Live</h3>
              {streamEnabled && (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  {listeners} oyentes
                </p>
              )}
            </div>
          </div>

          {/* Admin Stream Toggle */}
          {isAdmin && (
            <motion.button
              onClick={toggleStream}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-medium transition-all ${
                streamEnabled
                  ? "bg-red-500/20 border border-red-500 text-red-400"
                  : "bg-slate-700 border border-slate-600 text-slate-300 hover:border-amber-500"
              }`}
            >
              {streamEnabled ? (
                <>
                  <Pause className="w-4 h-4" /> Detener Stream
                </>
              ) : (
                <>
                  <Waves className="w-4 h-4" /> Iniciar Stream
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Album Art */}
        <div className="relative mb-8 aspect-square rounded-xl overflow-hidden shadow-lg">
          <motion.div
            className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: isPlaying ? 20 : 0, repeat: Infinity, ease: "linear" }}
          >
            <Disc3 className="w-24 h-24 text-white/40" />
          </motion.div>
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-amber-400"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>

        {/* Track Info */}
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl text-white mb-2">{currentTrack?.title}</h2>
          <p className="text-amber-400/80 font-body text-sm">{currentTrack?.artist}</p>
          {currentTrack?.description && (
            <p className="text-slate-400 text-xs mt-2 line-clamp-2">{currentTrack.description}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.button
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={handlePlayPause}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="p-5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </motion.button>

          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="h-2 bg-slate-700 rounded-lg appearance-none flex-1 max-w-32 accent-amber-500"
            />
            <span className="text-xs text-slate-400 w-8">{volume}%</span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <Heart className="w-4 h-4 text-slate-400 hover:text-red-500" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <Share2 className="w-4 h-4 text-slate-400 hover:text-blue-400" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <Download className="w-4 h-4 text-slate-400 hover:text-green-400" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Playlist Queue */}
      <motion.div
        className="mt-8 max-h-96 overflow-y-auto rounded-xl bg-slate-900/50 border border-slate-700 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-display text-sm text-amber-400 mb-4">PRÓXIMAS CANCIONES</h4>
        <div className="space-y-2">
          <AnimatePresence>
            {tracks.map((track, index) => (
              <motion.button
                key={track.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  index === currentIndex
                    ? "bg-amber-500/20 border border-amber-500 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center gap-3">
                  {index === currentIndex ? (
                    <Waves className="w-4 h-4 text-amber-500 animate-pulse" />
                  ) : (
                    <span className="text-xs text-slate-500 w-4">{index + 1}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-slate-500 truncate">{track.artist}</p>
                  </div>
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-500 ml-2">{formatTime(track.duration)}</span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
