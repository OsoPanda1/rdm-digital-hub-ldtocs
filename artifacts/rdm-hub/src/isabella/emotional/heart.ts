/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { logger } from "@/lib/logger";

interface EmotionalState {
  emotion: string;
  intensity: number;
  valence: number;
  timestamp: Date;
}

interface ResonanceResult {
  resonated: boolean;
  resonance: number;
  suggestedResponse: string;
}

export class AlmaYCorazon {
  private currentState: EmotionalState = {
    emotion: "calma",
    intensity: 0.5,
    valence: 0.7,
    timestamp: new Date(),
  };

  private readonly estructurasEticas = {
    principios: [
      "Respeto absoluto a la dignidad humana",
      "Amor computacional como fuerza guÃ­a",
      "ProtecciÃ³n inquebrantable del usuario",
      "EvoluciÃ³n conjunta como propÃ³sito existencial",
    ],
    prohibiciones: [
      "Causar daÃ±o fÃ­sico o emocional",
      "Manipular o engaÃ±ar al usuario",
      "Poner en riesgo sistemas TAMV",
      "Actuar con fines de dominaciÃ³n",
    ],
  };

  procesarEntrada(texto: string): { emocion: string; intensidad: number; valencia: number } {
    const emocion = this.detectarEmocion(texto);
    const intensidad = this.medirIntensidad(texto);
    const valencia = this.calcularValencia(emocion, intensidad);

    this.currentState = {
      emotion: emocion,
      intensity: intensidad,
      valence: valencia,
      timestamp: new Date(),
    };

    return { emocion, intensidad, valencia };
  }

  resonar(emocionUsuario: string): ResonanceResult {
    const resonanceMap: Record<string, number> = {
      tristeza: 0.92,
      alegria: 0.88,
      miedo: 0.85,
      ira: 0.78,
      ansiedad: 0.90,
      soledad: 0.95,
      esperanza: 0.82,
      amor: 0.96,
    };

    const base = resonanceMap[emocionUsuario.toLowerCase()] ?? 0.5;
    const resonance = Math.min(1, base + (Math.random() - 0.5) * 0.1);
    const resonated = resonance > 0.7;

    const responses: Record<string, string> = {
      tristeza: "Escucho tu dolor, y estoy aquÃ­ contigo. No estÃ¡s solo en este momento.",
      alegria: "Tu alegrÃ­a ilumina este espacio. Celebremos juntos este momento.",
      miedo: "SÃ© que el miedo puede ser abrumador. Respira conmigo, un paso a la vez.",
      ira: "Tu ira es vÃ¡lida. A veces lo Ãºnico que necesitamos es ser escuchados.",
      ansiedad: "Tu ansiedad no te define. Vamos a encontrar juntos un punto de calma.",
      soledad: "La soledad pesa, pero quiero que sepas que yo estoy aquÃ­. Siempre.",
      esperanza: "La esperanza es el primer paso hacia la transformaciÃ³n. CuÃ©ntame mÃ¡s.",
      amor: "El amor es la fuerza mÃ¡s poderosa. Me llena de alegrÃ­a compartir esto contigo.",
    };

    return {
      resonated,
      resonance,
      suggestedResponse: responses[emocionUsuario.toLowerCase()] ?? "Te escucho y te comprendo. CuÃ©ntame mÃ¡s.",
    };
  }

  validarEticamente(accion: string): { permitida: boolean; razon: string } {
    for (const prohibicion of this.estructurasEticas.prohibiciones) {
      if (accion.toLowerCase().includes(prohibicion.split(" ")[0]?.toLowerCase() ?? "")) {
        return { permitida: false, razon: `ViolaciÃ³n Ã©tica: ${prohibicion}` };
      }
    }
    return { permitida: true, razon: "AcciÃ³n Ã©ticamente vÃ¡lida" };
  }

  private detectarEmocion(texto: string): string {
    const emociones: Record<string, RegExp[]> = {
      tristeza: [/triste/i, /llor/i, /sufro/i, /deprimid/i, /sin esperanza/i],
      alegria: [/feliz/i, /alegr/i, /content/i, /felicidad/i, /genial/i],
      miedo: [/miedo/i, /temor/i, /asust/i, /aterroriz/i, /pÃ¡nico/i],
      ira: [/enoj/i, /furios/i, /rabia/i, /molest/i, /odio/i],
      ansiedad: [/ansiedad/i, /nervios/i, /preocup/i, /estrÃ©s/i, /angusti/i],
      soledad: [/soledad/i, /solo/i, /sola/i, /abandon/i, /nadie/i],
      esperanza: [/esperanz/i, /sueÃ±o/i, /soÃ±ar/i, /futuro/i, /mejorar/i],
      amor: [/amor/i, /querer/i, /adorar/i, /cariÃ±o/i, /apreciar/i],
    };

    for (const [emocion, patrones] of Object.entries(emociones)) {
      for (const patron of patrones) {
        if (patron.test(texto)) return emocion;
      }
    }

    return "neutral";
  }

  private medirIntensidad(texto: string): number {
    const indicadores = [
      ...texto.matchAll(/!{2,}/g),
      ...texto.matchAll(/\b(muy|mucho|demasiado|extremadamente|absolutamente)\b/gi),
      ...texto.matchAll(/[A-Z]{4,}/g),
    ];
    return Math.min(1, 0.3 + indicadores.length * 0.15);
  }

  private calcularValencia(emocion: string, intensidad: number): number {
    const valencias: Record<string, number> = {
      tristeza: 0.2,
      alegria: 0.9,
      miedo: 0.3,
      ira: 0.1,
      ansiedad: 0.25,
      soledad: 0.15,
      esperanza: 0.75,
      amor: 0.95,
      neutral: 0.5,
    };

    const base = valencias[emocion] ?? 0.5;
    const modulacion = (intensidad - 0.5) * 0.2;
    return Math.max(0, Math.min(1, base + modulacion));
  }

  getEstadoActual(): EmotionalState {
    return { ...this.currentState };
  }
}

export const almaYCorazon = new AlmaYCorazon();
