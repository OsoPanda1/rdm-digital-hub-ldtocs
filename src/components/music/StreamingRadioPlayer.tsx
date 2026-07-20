'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, Radio, Mic } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useMusicPlayer } from '@/modules/music/hooks/useMusicPlayer';

interface StreamingRadioPlayerProps {
  className?: string;
}

export function StreamingRadioPlayer({ className = '' }: StreamingRadioPlayerProps) {
  const { isAdmin } = useUserRole();
  const { tracks, currentTrack, isPlaying, play, togglePlay, nextTrack, previousTrack } = useMusicPlayer();
  const [volume, setVolume] = useState(0.8);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle admin streaming
  const startLiveStream = async () => {
    if (!isAdmin) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsStreaming(true);
      setIsLiveMode(true);
      
      // Send stream to backend for broadcasting
      const response = await fetch('/api/radio/stream/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: 'admin' }),
      });
      
      const data = await response.json();
      if (data.streamUrl) {
        setStreamUrl(data.streamUrl);
      }
    } catch (error) {
      console.error('[v0] Error starting stream:', error);
    }
  };

  const stopLiveStream = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setIsLiveMode(false);
    
    await fetch('/api/radio/stream/stop', {
      method: 'POST',
      credentials: 'include',
    });
  };

  return (
    <div className={`w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-amber-500/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-2 bg-amber-500/20 rounded-full"
          >
            <Radio className="w-5 h-5 text-amber-400" />
          </motion.div>
          <div>
            <h2 className="font-display text-lg text-white uppercase tracking-wider">
              TAMV Radio
            </h2>
            <p className="text-xs text-amber-400/70">Real del Monte</p>
          </div>
        </div>
        
        {/* Live indicator */}
        {isLiveMode && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full border border-red-500/50"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-xs font-semibold text-red-400 uppercase">EN VIVO</span>
          </motion.div>
        )}
      </div>

      {/* Now Playing */}
      <div className="mb-6 p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
          {isLiveMode ? 'Transmisión en vivo' : 'Reproduciendo ahora'}
        </p>
        <h3 className="font-display text-white text-lg truncate">
          {isLiveMode ? 'Streaming en directo' : currentTrack?.title || 'Sin reproducción'}
        </h3>
        <p className="text-sm text-amber-400/80 truncate">
          {isLiveMode ? 'Admin Streaming' : currentTrack?.artist || 'Archivo Sonoro'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {/* Previous */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={previousTrack}
          disabled={isLiveMode}
          className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 transition-colors"
        >
          <SkipBack className="w-5 h-5 text-white" />
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlay}
          disabled={isLiveMode}
          className="p-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 disabled:opacity-50 transition-all shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-0.5" />
          )}
        </motion.button>

        {/* Next */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextTrack}
          disabled={isLiveMode}
          className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 transition-colors"
        >
          <SkipForward className="w-5 h-5 text-white" />
        </motion.button>

        {/* Volume */}
        <div className="flex items-center gap-2 ml-4">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => {
              const val = Number(e.target.value) / 100;
              setVolume(val);
              if (audioRef.current) audioRef.current.volume = val;
            }}
            className="w-20 h-1 bg-slate-700 rounded-full accent-amber-400"
          />
        </div>
      </div>

      {/* Admin Streaming Controls */}
      {isAdmin && (
        <div className="border-t border-slate-700 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={isStreaming ? stopLiveStream : startLiveStream}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              isStreaming
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50'
            }`}
          >
            <Mic className="w-4 h-4" />
            {isStreaming ? 'Detener transmisión' : 'Iniciar streaming en vivo'}
          </motion.button>
          
          {isStreaming && streamUrl && (
            <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
              <p className="text-xs text-slate-400 mb-1">URL del stream:</p>
              <input
                type="text"
                readOnly
                value={streamUrl}
                className="w-full bg-slate-600/50 text-slate-200 text-xs p-2 rounded border border-slate-600 font-mono"
              />
            </div>
          )}
        </div>
      )}

      {/* Playlist info */}
      <div className="mt-4 text-xs text-slate-400 text-center">
        {isLiveMode ? (
          <p>Transmisión en directo desde Real del Monte</p>
        ) : (
          <p>{tracks?.length || 0} canciones en el archivo sonoro</p>
        )}
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} crossOrigin="anonymous" />
    </div>
  );
}
