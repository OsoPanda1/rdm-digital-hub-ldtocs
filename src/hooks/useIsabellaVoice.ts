import { useCallback, useRef, useState } from "react";
import { isabellaIdentidad } from "@/isabella/core/identity";

type VoiceState = "idle" | "speaking" | "loading" | "error" | "unsupported";

export function useIsabellaVoice() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const introAudioRef = useRef<HTMLAudioElement | null>(null);

  const getVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    return (
      voices.find((v) => v.lang.startsWith("es") && v.name.toLowerCase().includes("mexican"))
      || voices.find((v) => v.lang.startsWith("es"))
      || null
    );
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setVoiceState("unsupported");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = "es-MX";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    utteranceRef.current = utterance;
    setVoiceState("speaking");
    utterance.onend = () => setVoiceState("idle");
    utterance.onerror = () => setVoiceState("error");
    window.speechSynthesis.speak(utterance);
  }, [getVoice]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current.currentTime = 0;
    }
    setVoiceState("idle");
  }, []);

  const playIntro = useCallback(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio("/audio/isabella-intro.mp3");
    introAudioRef.current = audio;
    audio.volume = 0.5;
    setVoiceState("loading");
    audio.addEventListener("canplaythrough", () => {
      audio.play().then(() => setVoiceState("speaking")).catch(() => setVoiceState("error"));
    }, { once: true });
    audio.addEventListener("ended", () => setVoiceState("idle"), { once: true });
    audio.addEventListener("error", () => setVoiceState("error"), { once: true });
    if (audio.readyState >= 3) {
      audio.play().catch(() => setVoiceState("error"));
    }
  }, []);

  return {
    voiceState,
    speak,
    stop,
    playIntro,
    isSpeaking: voiceState === "speaking",
  };
}
