// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, Settings, Sparkles, Loader2, X } from "lucide-react";
import { useIsabellaVoice } from "@/hooks/useIsabellaVoice";
import { useIsabella } from "@/hooks/useIsabella";
import { useYunEventBus } from "@/hooks/useYunEventBus";

export type IsabellaVoiceMode = "local" | "cloud";
export type VoicePersona = "neutral" | "warm" | "authoritative" | "playful" | "mystical";

export interface IsabellaVoiceContext {
  federation?: "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7";
  useCase?: "turismo" | "comercio" | "gobernanza" | "comunidad" | "general";
  language?: string;
  persona?: VoicePersona;
}

export function IsabellaVoiceEngine() {
  const [mode, setMode] = useState<IsabellaVoiceMode>("cloud");
  const [isListening, setIsListening] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<VoicePersona>("warm");
  const [showSettings, setShowSettings] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { isabella, sendMessage, isLoading: isabellaLoading } = useIsabella();
  
  const {
    mode: voiceMode,
    isSpeaking,
    queue,
    error,
    speak,
    cancelAll,
    switchMode,
  } = useIsabellaVoice({
    preferredMode: mode,
    consentAudio: true,
  });

  const { emit } = useYunEventBus();

  // Sync mode
  useEffect(() => {
    if (voiceMode !== mode) setMode(voiceMode);
  }, [voiceMode, mode]);

  // Handle Isabella response - speak it
  useEffect(() => {
    if (isabella.messages.length > 0) {
      const lastMessage = isabella.messages[isabella.messages.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.content && !isProcessing) {
        setIsProcessing(true);
        speak(lastMessage.content, {
          federation: "F6",
          useCase: "comunidad",
          language: "es-MX",
        }).finally(() => setIsProcessing(false));
      }
    }
  }, [isabella.messages, speak, isProcessing]);

  const handleVoiceCommand = useCallback(async (command: string) => {
    setTranscript(command);
    setIsListening(false);
    setIsProcessing(true);

    try {
      // Emit to YUN event bus
      await emit({
        type: 'VOICE_COMMAND_RECEIVED',
        source: 'isabella-voice',
        payload: { command, persona: currentPersona },
        traceId: crypto.randomUUID(),
      });

      // Send to Isabella
      await sendMessage(command);
    } catch (err) {
      console.error('[Voice] Error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [sendMessage, emit, currentPersona]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Reconocimiento de voz no soportado en este navegador');
      return;
    }

    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new Recognition();
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript.trim()) {
        handleVoiceCommand(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('[Voice] Recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  }, [handleVoiceCommand]);

  const handleTextInput = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get('message') as string;
    if (text?.trim()) {
      handleVoiceCommand(text.trim());
      (e.target as HTMLFormElement).reset();
    }
  }, [handleVoiceCommand]);

  const toggleMute = useCallback(() => {
    if (isSpeaking || queue.length > 0) {
      cancelAll();
    }
  }, [isSpeaking, queue.length, cancelAll]);

  return (
    <div className="relative">
      {/* Main Voice Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isListening ? 'bg-accent/20 ring-2 ring-accent' :
                isSpeaking ? 'bg-primary/20 ring-2 ring-primary' :
                isProcessing ? 'bg-secondary/20 ring-2 ring-secondary' :
                'bg-muted/50'
              }`}
              animate={{
                scale: isListening ? [1, 1.05, 1] : isSpeaking ? [1, 1.03, 1] : 1,
                boxShadow: isListening ? '0 0 20px hsl(var(--accent)/0.5)' : 
                           isSpeaking ? '0 0 20px hsl(var(--primary)/0.5)' : 'none',
              }}
              transition={{ duration: isListening ? 1 : isSpeaking ? 1.5 : 0.3, repeat: Infinity }}
            >
              {isListening ? (
                <Mic className="w-6 h-6 text-accent" />
              ) : isSpeaking ? (
                <Volume2 className="w-6 h-6 text-primary" />
              ) : isProcessing ? (
                <Loader2 className="w-6 h-6 text-secondary animate-spin" />
              ) : (
                <Mic className="w-6 h-6 text-muted-foreground" />
              )}
            </motion.div>
            <div>
              <p className="font-display text-lg text-ink">
                {isListening ? "Escuchando..." : isSpeaking ? "Isabella habla..." : isProcessing ? "Procesando..." : "Isabella lista"}
              </p>
              <p className="font-mono text-[10px] tracking-sovereign text-muted-foreground">
                {mode === "cloud" ? "☁ Cloud TTS" : "🎤 Local TTS"} · {currentPersona}
                {error && <span className="ml-2 text-destructive">⚠ {error}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl border-hairline hover:bg-secondary transition-colors"
              aria-label="Configuración de voz"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMute}
              disabled={!isSpeaking && queue.length === 0}
              className="p-2 rounded-xl border-hairline hover:bg-secondary transition-colors disabled:opacity-50"
              aria-label={isSpeaking ? "Silenciar" : "Cola vacía"}
            >
              {isSpeaking || queue.length > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Voice Input */}
        <form onSubmit={handleTextInput} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              name="message"
              placeholder={isListening ? "Escuchando..." : "Escribe o usa el micrófono..."}
              className="w-full rounded-full border-hairline bg-card pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              disabled={isListening || isProcessing}
            />
            <button
              type="button"
              onClick={startListening}
              disabled={isListening || isProcessing}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors disabled:opacity-50"
              aria-label="Activar micrófono"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="rounded-full bg-foreground text-background px-5 py-3 text-sm hover:bg-accent transition-colors disabled:opacity-50"
          >
            Enviar
          </button>
        </form>

        {/* Transcript Display */}
        {transcript && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground italic bg-background/50 rounded-lg p-3 font-mono"
          >
            " {transcript} "
          </motion.p>
        )}

        {/* Queue Status */}
        {queue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="rounded-lg border-hairline bg-card p-3 text-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono tracking-sovereign text-accent">Cola de voz ({queue.length})</span>
              <button onClick={cancelAll} className="text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {queue.slice(0, 5).map((clip, i) => (
                <div key={clip.id} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                  <span className="truncate flex-1">{clip.text.slice(0, 60)}...</span>
                  <span className="font-mono">{clip.mode}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="relative w-full max-w-md bg-card rounded-2xl border-hairline shadow-sovereign overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-hairline">
                <h3 className="font-display text-lg">Configuración de Voz</h3>
                <button onClick={() => setShowSettings(false)} className="p-1 rounded-lg hover:bg-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-6">
                {/* Mode Selector */}
                <div>
                  <label className="block font-mono text-[10px] tracking-sovereign text-accent mb-2">Modo TTS</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["cloud", "local"].map((m) => (
                      <button
                        key={m}
                        onClick={() => switchMode(m as IsabellaVoiceMode)}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          mode === m
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-hairline hover:border-accent/50"
                        }`}
                      >
                        {m === "cloud" ? "☁ Cloud" : "🎤 Local"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Persona Selector */}
                <div>
                  <label className="block font-mono text-[10px] tracking-sovereign text-accent mb-2">Personalidad</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["neutral", "warm", "authoritative", "playful", "mystical"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPersona(p as VoicePersona)}
                        className={`p-3 rounded-xl border-2 text-xs font-medium text-center transition-all ${
                          currentPersona === p
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-hairline hover:border-accent/50"
                        }`}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block font-mono text-[10px] tracking-sovereign text-accent mb-2">Idioma</label>
                  <select
                    value="es-MX"
                    className="w-full rounded-xl border-hairline bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="es-MX">Español (México)</option>
                    <option value="es-ES">Español (España)</option>
                    <option value="en-US">English (US)</option>
                  </select>
                </div>

                {/* Federation Context */}
                <div>
                  <label className="block font-mono text-[10px] tracking-sovereign text-accent mb-2">Contexto Federado</label>
                  <select
                    value="F6"
                    className="w-full rounded-xl border-hairline bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  >
                    <option value="F1">F1 - Comercio Local</option>
                    <option value="F2">F2 - Turismo y Cultura</option>
                    <option value="F3">F3 - Academia y Ciencia</option>
                    <option value="F4">F4 - Gobierno Local</option>
                    <option value="F5">F5 - Tech e Infraestructura</option>
                    <option value="F6">F6 - Comunidad y Orgs</option>
                    <option value="F7">F7 - Metaverso y XR</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full rounded-full bg-foreground text-background px-5 py-2.5 text-sm hover:bg-accent transition-colors mt-4"
                >
                  Guardar y cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Floating Orb - Minimal state indicator */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        animate={{
          scale: isListening ? 1.1 : isSpeaking ? 1.05 : 1,
          boxShadow: isListening 
            ? '0 0 30px hsl(var(--accent)/0.6)' 
            : isSpeaking 
            ? '0 0 30px hsl(var(--primary)/0.6)' 
            : '0 4px 20px rgba(0,0,0,0.3)',
        }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={startListening}
          disabled={isListening || isProcessing}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-70"
          aria-label={isListening ? "Escuchando..." : "Activar voz"}
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-6 h-6 text-background"
            >
              <Mic className="w-6 h-6" />
            </motion.div>
          ) : isSpeaking ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-6 h-6 text-background"
            >
              <Volume2 className="w-6 h-6" />
            </motion.div>
          ) : (
            <Mic className="w-6 h-6 text-background" />
          )}
        </button>
      </motion.div>
    </div>
  );
}

export default IsabellaVoiceEngine;