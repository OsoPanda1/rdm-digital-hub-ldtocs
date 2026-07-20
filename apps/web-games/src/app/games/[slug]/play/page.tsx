'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { gamesClient } from '@/lib/clients';
import { X, Fullscreen, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

interface GamePlayPageProps {
  params: Promise<{ slug: string }>;
}

export default function GamePlayPage({ params }: GamePlayPageProps) {
  const [gameConfig, setGameConfig] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    async function loadGame() {
      try {
        const { slug } = await params;
        const config = await gamesClient.getGameConfig(slug);
        setGameConfig(config);
      } catch (err) {
        setError('Error cargando configuración del juego');
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, [params]);

  useEffect(() => {
    if (!gameConfig || !gameConfig.iframeUrl) return;

    const startSession = async () => {
      try {
        const result = await gamesClient.startGameSession(gameConfig.id);
        setSession(result.session);
      } catch (err) {
        console.error('[GamePlay] Error starting session:', err);
        setError('Error iniciando sesión de juego');
      }
    };
    startSession();
  }, [gameConfig]);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (!gameConfig?.id) return;

    if (event.data?.type === 'GAME_COMPLETE') {
      completeSession(event.data.payload);
    } else if (event.data?.type === 'GAME_ERROR') {
      console.error('[GamePlay] Game error:', event.data.payload);
    } else if (event.data?.type === 'GAME_READY') {
      console.log('[GamePlay] Game loaded and ready');
    }
  }, [gameConfig?.id]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  const completeSession = async (payload: any) => {
    if (!session) return;

    try {
      const result = await gamesClient.completeGameSession({
        sessionId: session.id,
        gameId: gameConfig.id,
        score: payload.score,
        xpEarned: payload.xpEarned,
        coinsEarned: payload.coinsEarned,
        durationMs: payload.durationMs,
        metadata: payload.metadata,
        completedAt: new Date().toISOString(),
      });
      console.log('[GamePlay] Session completed:', result);
      alert(`¡Partida completada! XP: ${result.xpEarned}, Monedas: ${result.coinsEarned}`);
    } catch (err) {
      console.error('[GamePlay] Error completing session:', err);
      alert('Error guardando resultado. Tu partida se guardará automáticamente.');
    }
  };

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (!isFullscreen) {
        iframeRef.current.requestFullscreen().catch(console.error);
      } else {
        document.exitFullscreen().catch(console.error);
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        { type: 'SET_MUTED', muted: !isMuted },
        '*'
      );
    }
  };

  const handleExit = () => {
    if (session && !session.endedAt) {
      setShowExitConfirm(true);
    } else {
      window.location.href = `/games/${gameConfig?.slug}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display text-xl text-ink">Cargando {gameConfig?.name || 'juego'}...</p>
          <p className="text-sm text-muted-foreground mt-1">Preparando tu partida...</p>
        </div>
      </div>
    );
  }

  if (error || !gameConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-6">
          <h1 className="font-display text-4xl text-ink mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">{error || 'No se pudo cargar el juego'}</p>
          <a href="/" className="inline-flex items-center gap-2 rounded-full bg-amber-500 text-white px-6 py-3 text-sm hover:bg-amber-600 transition-colors">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  const remainingFree = gameConfig.config?.freeRunsPerDay 
    ? Math.max(0, gameConfig.config.freeRunsPerDay - (session?.dailyUsage?.runsUsed || 0))
    : 2;

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-hairline px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExit}
              className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Salir del juego"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <p className="font-mono text-[9px] tracking-sovereign text-amber-600">
                {gameConfig.type === 'MINA_RESPONSABLE' ? 'Mina Responsable' : 'Ruta del Guardián'}
              </p>
              <h1 className="font-display text-lg text-ink">{gameConfig.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-hairline text-xs font-mono text-muted-foreground">
              <Zap className="w-3 h-3 text-amber-500" />
              {remainingFree > 0 ? `${remainingFree} gratis hoy` : 'Sin partidas gratis'}
            </div>
            
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? <RotateCcw className="w-5 h-5" /> : <Fullscreen className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Game Container */}
      <main className="flex-1 flex flex-col overflow-hidden pt-16">
        <div className="flex-1 relative">
          <iframe
            ref={iframeRef}
            src={gameConfig.iframeUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="fullscreen; accelerometer; gyroscope"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock"
            title={gameConfig.name}
            style={{ background: '#0f172a' }}
          />
          
          {/* Loading overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10 transition-opacity duration-300" style={{ opacity: gameConfig ? 0 : 1, pointerEvents: gameConfig ? 'none' : 'auto' }}>
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="font-display text-xl text-white">Cargando partida...</p>
            </div>
          </div>
        </div>
      </main>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card rounded-2xl border-hairline p-6 max-w-md w-full mx-4 shadow-sovereign">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="font-display text-2xl text-ink mb-2">¿Salir de la partida?</h2>
              <p className="text-muted-foreground mb-6">
                {session && !session.endedAt 
                  ? 'Tu progreso no se guardará si sales ahora. ¿Seguro que quieres salir?'
                  : '¿Seguro que quieres salir?'}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="px-4 py-2 rounded-full border-hairline hover:bg-secondary transition-colors"
                >
                  Continuar jugando
                </button>
                <button
                  onClick={() => { setShowExitConfirm(false); window.location.href = `/games/${gameConfig?.slug}`; }}
                  className="px-4 py-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  Salir y perder progreso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Zap, RotateCcw, Fullscreen, Volume2, VolumeX, X, Target, TrendingUp, Award } from 'lucide-react';