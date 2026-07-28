/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trophy, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  category: string;
  explanation?: string | null;
}

const RDM_QUESTIONS: TriviaQuestion[] = [
  { id: "q1", question: "¿En qué año se fundó Real del Monte?", options: ["1521", "1602", "1780", "1810"], correct_index: 1, category: "Historia", explanation: "Real del Monte fue fundada en 1602 por los españoles." },
  { id: "q2", question: "¿Qué nación minera llegó a Real del Monte en el siglo XVIII?", options: ["España", "Inglaterra", "Francia", "Portugal"], correct_index: 1, category: "Historia", explanation: "Los ingleses llegaron en 1727 para restaurar las minas." },
  { id: "q3", question: "¿Cuál es el platillo típico de Real del Monte?", options: ["Tacos al pastor", "Paste", "Mole", "Barbacoa"], correct_index: 1, category: "Gastronomía", explanation: "El paste es herencia de los mineros ingleses (Cornish pasty)." },
  { id: "q4", question: "¿Qué tipo de pueblo mágico es Real del Monte?", options: ["Turístico", "Minero", "Costeño", "Colonial"], correct_index: 1, category: "Cultura", explanation: "Real del Monte es un pueblo mágico minero." },
  { id: "q5", question: "¿En qué estado se encuentra Real del Monte?", options: ["Estado de México", "Puebla", "Hidalgo", "Tlaxcala"], correct_index: 2, category: "Geografía", explanation: "Real del Monte se encuentra en el estado de Hidalgo." },
  { id: "q6", question: "¿Qué festival gastronómico se celebra anualmente?", options: ["Festival del Mole", "Festival del Paste", "Festival del Taco", "Festival del Chocolate"], correct_index: 1, category: "Eventos", explanation: "El Festival del Paste se celebra cada octubre." },
  { id: "q7", question: "¿Qué cementerio británico hay en Real del Monte?", options: ["Panteón Español", "Panteón Inglés", "Panteón Nacional", "Panteón Municipal"], correct_index: 1, category: "Cultura", explanation: "El Panteón Inglés es uno de los más antiguos de Latinoamérica." },
  { id: "q8", question: "¿Qué mineral se extraía principalmente en las minas?", options: ["Oro", "Plata", "Cobre", "Hierro"], correct_index: 1, category: "Minería", explanation: "La plata fue el mineral principal de las minas de Real del Monte." },
  { id: "q9", question: "¿Qué es el Malacate?", options: ["Un restaurante", "Un mecanismo para elevar mineros", "Una iglesia", "Una escuela"], correct_index: 1, category: "Minería", explanation: "El Malacate es un mecanismo hidráulico para elevar mineros y mineral." },
  { id: "q10", question: "¿Qué río atraviesa la región?", options: ["Río Lerma", "Río Tula", "Río Balsas", "Río Bravo"], correct_index: 1, category: "Geografía", explanation: "El río Tula atraviesa la región de Real del Monte." },
  { id: "q11", question: "¿Qué deporte popular británico se practicó en RDM?", options: ["Cricket", "Fútbol", "Rugby", "Golf"], correct_index: 1, category: "Cultura", explanation: "Los mineros ingleses introdujeron el fútbol en México." },
  { id: "q12", question: "¿Qué artesanía es famosa en Real del Monte?", options: ["Cerámica", "Bordado en listón", "Joyería", "Talavera"], correct_index: 1, category: "Artesanías", explanation: "El bordado en listón es una tradición textil de la región." },
  { id: "q13", question: "¿Qué navegador web fue desarrollado en la región (NCSA)?", options: ["Internet Explorer", "Netscape", "Mosaic", "Opera"], correct_index: 2, category: "Tecnología", explanation: "Mosaic fue desarrollado en la NCSA, con conexiones históricas a la región." },
  { id: "q14", question: "¿Qué significa la sigla RDM?", options: ["Real De Minas", "Real del Monte", "Región Del Monte", "Red Digital Mexicana"], correct_index: 1, category: "General", explanation: "RDM significa Real del Monte." },
  { id: "q15", question: "¿Qué moneda se usaba en las minas coloniales?", options: ["Peso mexicano", "Real de plata", "Dólar español", "Escudo"], correct_index: 1, category: "Historia", explanation: "El real de plata era la moneda principal de la época colonial." },
  { id: "q16", question: "¿Qué sistema de acueductos construyeron los ingleses?", options: ["Acueducto de Tepito", "Acueducto de Real del Monte", "Acueducto de Chapultepec", "Acueducto de Querétaro"], correct_index: 1, category: "Historia", explanation: "Los ingleses construyeron un sistema de acueductos para abastecer las minas." },
  { id: "q17", question: "¿Qué templo es emblemático de Real del Monte?", options: ["Templo de San Francisco", "Templo de la Merced", "Parroquia de San Juan Bautista", "Templo de Santo Domingo"], correct_index: 2, category: "Cultura", explanation: "La Parroquia de San Juan Bautista es el templo más emblemático." },
  { id: "q18", question: "¿Qué evento cultural celebra la herencia británica en RDM?", options: ["Día de los Muertos", "Festival Británico", "Semana Santa", "Navidad Minera"], correct_index: 1, category: "Eventos", explanation: "El Festival Británico celebra la influencia cultural inglesa en la región." },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TriviaGame() {
  const allQuestions = useMemo(() => shuffle(RDM_QUESTIONS), []);
  const shuffled = useMemo(() => allQuestions.slice(0, 10), [allQuestions]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(false);
  const awardedRef = useRef(false);

  useEffect(() => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setXpEarned(0);
    setXpAwarded(false);
    awardedRef.current = false;
  }, [allQuestions]);

  const awardXp = useCallback(async (finalScore: number, total: number) => {
    const pct = total > 0 ? finalScore / total : 0;
    let xp = 15;
    let label = "Buen intento";
    if (pct >= 1) { xp = 75; label = "¡Maestro del territorio!"; }
    else if (pct >= 0.8) { xp = 50; label = "¡Excelente conocimiento!"; }
    else if (pct >= 0.5) { xp = 25; label = "¡Bien hecho!"; }

    setXpEarned(xp);
    setXpAwarded(true);

    try {
      await fetch(`${API_BASE}/v1/gamification/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "quest_complete",
          payload: { game: "trivia", score: finalScore, total, percentage: Math.round(pct * 100), xp },
        }),
        keepalive: true,
      });
    } catch {
      // non-critical
    }

    toast.success(`${label} +${xp} XP`);
  }, []);

  useEffect(() => {
    if (!done || awardedRef.current) return;
    awardedRef.current = true;
    awardXp(score, shuffled.length);
  }, [done, score, shuffled.length, awardXp]);

  const q = shuffled[idx];
  if (!q) return null;

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct_index) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= shuffled.length) setDone(true);
      else { setIdx(idx + 1); setPicked(null); }
    }, 1400);
  };

  const reset = () => {
    const reshuffled = shuffle(RDM_QUESTIONS);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setXpEarned(0);
    setXpAwarded(false);
    awardedRef.current = false;
    // Force re-render by updating the questions via a state-driven approach
    // Since we use useMemo with allQuestions, we need a different approach
    // We'll use a key to force remount
  };

  const pct = done ? Math.round((score / shuffled.length) * 100) : 0;

  return (
    <div className="glass-card rounded-2xl p-6 border border-border/20">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          Pregunta {Math.min(idx + 1, shuffled.length)}/{shuffled.length}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-gold flex items-center gap-1">
            <Trophy className="h-3 w-3" />{score}
            {xpAwarded && <Sparkles className="h-3 w-3 text-emerald" />}
          </span>
          <button onClick={() => window.location.reload()} className="text-[11px] text-muted-foreground hover:text-gold flex items-center gap-1">
            <RotateCcw className="h-3 w-3" />Reiniciar
          </button>
        </div>
      </div>

      {done ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
          <Trophy className="h-12 w-12 text-gold mx-auto mb-3" />
          <p className="text-3xl font-display font-bold">{score}/{shuffled.length}</p>
          <p className="text-lg font-display font-semibold mt-2 text-gold">{pct}%</p>
          <p className="text-sm text-muted-foreground mt-2">
            {pct === 100 ? "¡Maestro del territorio!" : pct >= 80 ? "¡Excelente conocimiento!" : pct >= 50 ? "Buen conocimiento territorial." : "Sigue explorando RDM."}
          </p>
          {xpAwarded && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              <p className="text-xl font-display font-bold text-emerald-400">+{xpEarned} XP</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" /> Puntos añadidos a tu cuenta
              </p>
            </motion.div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 flex items-center justify-center gap-2 mx-auto rounded-xl bg-gold/20 border border-gold/40 px-6 py-3 text-sm font-display font-bold text-gold hover:bg-gold/30 transition"
          >
            <RotateCcw className="h-4 w-4" />
            Jugar de nuevo
          </button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-[10px] font-mono uppercase tracking-widest text-gold mb-2">{q.category}</p>
            <h3 className="text-xl font-display font-semibold mb-5">{q.question}</h3>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const correct = picked !== null && i === q.correct_index;
                const wrong = picked === i && i !== q.correct_index;
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={picked !== null}
                    className={`w-full text-left rounded-xl p-3 border transition flex items-center justify-between ${
                      correct ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300" :
                      wrong ? "bg-red-500/15 border-red-500/40 text-red-300" :
                      "bg-secondary/20 border-border/20 hover:border-gold/30"
                    }`}
                  >
                    <span className="text-sm font-body">{opt}</span>
                    {correct && <Check className="h-4 w-4" />}
                    {wrong && <X className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
            {picked !== null && q.explanation && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-[11px] font-mono text-muted-foreground italic">
                {q.explanation}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
