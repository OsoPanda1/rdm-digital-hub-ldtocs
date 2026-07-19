import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, SkipBack, SkipForward } from "lucide-react";

interface HeritageAudioPlayerProps {
  audioUrl: string;
  narrationText: string;
  siteName: string;
  imageUrl?: string;
  language?: string;
  onPlay?: () => void;
  onPause?: () => void;
}

/**
 * HeritageSpeechPlayer - Audio player for heritage site narrations
 * Displays pre-generated audio with site imagery and narration text
 */
export function HeritageSpeechPlayer({
  audioUrl,
  narrationText,
  siteName,
  imageUrl,
  language = "es",
  onPlay,
  onPause,
}: HeritageAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (error) {
      console.error("[HeritageSpeechPlayer] Playback error:", error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-4">
        <h2 className="text-2xl font-bold">{siteName}</h2>
        <p className="text-amber-100 text-sm mt-1">Heritage Site Narration</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Image */}
        {imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden max-h-64 bg-slate-200">
            <img
              src={imageUrl}
              alt={siteName}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Narration Text */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-700 leading-relaxed text-sm md:text-base line-clamp-4">
            {narrationText}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {language === "es" ? "Idioma: Español" : "Language"}
          </p>
        </div>

        {/* Audio Player Controls */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            crossOrigin="anonymous"
          />

          {/* Play/Pause Button Row */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="p-3 rounded-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <div className="w-6 h-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            {/* Time Display */}
            <div className="text-sm font-mono text-slate-600">
              <span>{formatTime(currentTime)}</span>
              <span className="text-slate-400 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => handleProgressChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              aria-label="Audio progress"
            />
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-slate-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              aria-label="Volume"
            />
            <span className="text-xs text-slate-600 w-8">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-xs text-slate-500 flex gap-4">
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-amber-600 rounded-full"></span>
            {isPlaying ? "Playing" : "Ready"}
          </div>
          <div>
            Duration: {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeritageSpeechPlayer;
