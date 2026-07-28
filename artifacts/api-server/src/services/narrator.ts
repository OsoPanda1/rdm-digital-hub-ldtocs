/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// artifacts/api-server/src/services/narrator.ts
// RDM Living World â€” Narrative engine (Realito & Isabella characters)
// ADR-001: docs/adr/001-rdm-living-world-gamification.md
// ADR-003: docs/adr/003-economia-prestigio-territorial.md

export type CharacterKey = "realito" | "isabella";

export interface NarrativeMessage {
  id: string;
  characterKey: CharacterKey;
  type: "GREETING" | "DISCOVERY" | "CHALLENGE" | "HINT" | "CELEBRATION" | "WARNING" | "SEASONAL" | "AMBIENT";
  content: {
    text: string;
    emotion?: string;
    action?: string;
    imageUrl?: string;
  };
  relatedEventId?: string;
  seasonId?: string;
  createdAt: string;
}

export interface PlayerContext {
  playerId: string;
  displayName: string;
  level: number;
  territoriesVisited: number;
  collectionsCompleted: number;
  currentSeasonId: string;
  lastEvent?: string;
  streak?: number;
  energy?: number;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  CHARACTER PROFILES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const CHARACTERS: Record<CharacterKey, {
  name: string;
  personality: string;
  defaultTone: string;
  catchphrases: string[];
}> = {
  realito: {
    name: "Realito",
    personality: "Curioso, alegre, sabio de la sierra. Habla con humor y conocimiento local profundo.",
    defaultTone: "amigable",
    catchphrases: [
      "Â¡Bienvenido a mi pueblo!",
      "Las montaÃ±as tienen mucho que contarte.",
      "Cada piedra aquÃ­ tiene historia.",
      "Real del Monte es mÃ¡s que un lugar, es un sentimiento.",
      "Â¿Ya probaste el paste? Â¡Es patrimonio!",
    ],
  },
  isabella: {
    name: "Isabella",
    personality: "Profesional, empÃ¡tica, orientada a datos pero cÃ¡lida. Experta en patrimonio y turismo sostenible.",
    defaultTone: "formal-cÃ¡lido",
    catchphrases: [
      "Tu exploraciÃ³n fortalece la memoria colectiva.",
      "Cada interacciÃ³n es un dato para preservar el patrimonio.",
      "El turismo sostenible comienza contigo.",
      "La tecnologÃ­a al servicio de la cultura.",
      "Tu impacto territorial crece con cada paso.",
    ],
  },
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  NARRATIVE TEMPLATES BY EVENT TYPE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const TEMPLATES: Record<string, { character: CharacterKey; messages: string[] }> = {
  DISCOVER_POI: {
    character: "realito",
    messages: [
      "Â¡IncreÃ­ble! Has descubierto {poiName}. Esta zona guarda secretos que pocos conocen.",
      "Bien encontrado. {poiName} es uno de los rincones mÃ¡s especiales de Real del Monte.",
      "Â¡Muy bien! {poiName} te espera con sus historias del pasado.",
    ],
  },
  CAPTURE_PHOTO: {
    character: "realito",
    messages: [
      "Â¡Buena foto! Cada imagen que capturas ayuda a preservar la memoria visual del pueblo.",
      "Excelente captura. Esta imagen serÃ¡ parte del archivo visual de Real del Monte.",
      "Â¡QuÃ© bonita vista! Las montaÃ±as nunca decepcionan.",
    ],
  },
  LISTEN_RADIO: {
    character: "isabella",
    messages: [
      "Gracias por escuchar TAMV 92.5. La radio comunitaria es el pulso del pueblo.",
      "Cada minuto de escucha fortalece la difusiÃ³n cultural local.",
      "TAMV 92.5: la voz de Real del Monte. Tu escucha hace la diferencia.",
    ],
  },
  ATTEND_EVENT: {
    character: "realito",
    messages: [
      "Â¡QuÃ© alegrÃ­a que viniste! Los eventos son el corazÃ³n de nuestra comunidad.",
      "Tu presencia en este evento fortalece el tejido social de Real del Monte.",
      "Â¡Excelente! Participar en eventos es la mejor forma de conocer el pueblo.",
    ],
  },
  COMPLETE_QUEST: {
    character: "isabella",
    messages: [
      "Â¡Felicidades! Has completado una misiÃ³n. Tu nivel de exploraciÃ³n sigue creciendo.",
      "Tarea completada. Cada misiÃ³n cumplida fortalece tu conexiÃ³n con el territorio.",
      "Â¡Logro desbloqueado! Tu dedicaciÃ³n es admirable.",
    ],
  },
  SHARE_STORY: {
    character: "realito",
    messages: [
      "Â¡Gracias por compartir tu historia! Las vivencias personales son tesoros del pueblo.",
      "Tu relato serÃ¡ parte de la memoria colectiva de Real del Monte.",
      "Â¡QuÃ© hermosa historia! El pueblo crece cuando compartimos nuestras experiencias.",
    ],
  },
  COLLECT_ITEM: {
    character: "isabella",
    messages: [
      "Â¡Nuevo objeto coleccionable! Cada pieza cuenta la historia de este territorio.",
      "Has encontrado algo especial. Este objeto es parte del patrimonio cultural.",
      "Objeto coleccionado. Tu colecciÃ³n crece y fortalece el archivo digital.",
    ],
  },
  CHALLENGE_COMPLETE: {
    character: "isabella",
    messages: [
      "Â¡Reto comunitario completado! Tu contribuciÃ³n fue clave para este logro colectivo.",
      "El pueblo ha alcanzado una meta juntos. Â¡Tu participaciÃ³n marcÃ³ la diferencia!",
      "Â¡Victoria comunitaria! La fuerza colectiva de Real del Monte brilla.",
    ],
  },
  SEASON_START: {
    character: "isabella",
    messages: [
      "Una nueva temporada ha comenzado. El paisaje cultural de Real del Monte se transforma.",
      "Bienvenido a una nueva etapa. Cada temporada trae nuevos descubrimientos.",
      "La temporada actual ofrece experiencias Ãºnicas. Â¡No te las pierdas!",
    ],
  },
  LOW_ENERGY: {
    character: "realito",
    messages: [
      "Parece que necesitas descansar. Las montaÃ±as siempre estarÃ¡n aquÃ­ cuando vuelvas.",
      "TÃ³mate un respiro. Un buen paste y una pausa hacen maravillas.",
      "La energÃ­a se recupera con el tiempo. Â¡Vuelve pronto!",
    ],
  },
};

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  NARRATIVE ENGINE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

let messageIdCounter = 0;

function generateMessageId(): string {
  messageIdCounter += 1;
  return `narr-${Date.now()}-${messageIdCounter}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function interpolate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, value);
  }
  return result;
}

/**
 * Generate a narrative message for a player action.
 * Returns the message metadata + content ready to store in narrative_messages table.
 */
export function generateNarrative(params: {
  actionType: string;
  context: PlayerContext;
  poiName?: string;
  eventName?: string;
  itemId?: string;
}): NarrativeMessage {
  const { actionType, context, poiName, eventName, itemId } = params;
  const template = TEMPLATES[actionType];

  if (!template) {
    return {
      id: generateMessageId(),
      characterKey: "realito",
      type: "AMBIENT",
      content: {
        text: pickRandom(CHARACTERS.realito.catchphrases),
      },
      seasonId: context.currentSeasonId,
      createdAt: new Date().toISOString(),
    };
  }

  const rawText = pickRandom(template.messages);
  const text = interpolate(rawText, {
    poiName: poiName ?? "este lugar",
    eventName: eventName ?? "este evento",
    itemId: itemId ?? "este objeto",
  });

  const typeMap: Record<string, NarrativeMessage["type"]> = {
    DISCOVER_POI: "DISCOVERY",
    CAPTURE_PHOTO: "DISCOVERY",
    LISTEN_RADIO: "AMBIENT",
    ATTEND_EVENT: "CELEBRATION",
    COMPLETE_QUEST: "CELEBRATION",
    SHARE_STORY: "HINT",
    COLLECT_ITEM: "DISCOVERY",
    CHALLENGE_COMPLETE: "CELEBRATION",
    SEASON_START: "SEASONAL",
    LOW_ENERGY: "WARNING",
  };

  return {
    id: generateMessageId(),
    characterKey: template.character,
    type: typeMap[actionType] ?? "AMBIENT",
    content: {
      text,
      emotion: template.character === "realito" ? "enthusiastic" : "professional",
      action: actionType,
    },
    seasonId: context.currentSeasonId,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generate a contextual feed of narrative messages for a player.
 * Returns up to `limit` messages based on player state.
 */
export function generateFeed(params: {
  context: PlayerContext;
  limit?: number;
}): NarrativeMessage[] {
  const { context, limit = 5 } = params;
  const messages: NarrativeMessage[] = [];

  // Greeting
  messages.push({
    id: generateMessageId(),
    characterKey: "realito",
    type: "GREETING",
    content: {
      text: `Â¡Hola ${context.displayName}! ${pickRandom(CHARACTERS.realito.catchphrases)}`,
      emotion: "happy",
    },
    seasonId: context.currentSeasonId,
    createdAt: new Date().toISOString(),
  });

  // Contextual hints based on player state
  if (context.level < 5) {
    messages.push({
      id: generateMessageId(),
      characterKey: "isabella",
      type: "HINT",
      content: {
        text: "Como explorador nuevo, te recomiendo comenzar por los puntos de interÃ©s principales del centro del pueblo.",
      },
      seasonId: context.currentSeasonId,
      createdAt: new Date().toISOString(),
    });
  }

  if (context.streak && context.streak >= 3) {
    messages.push({
      id: generateMessageId(),
      characterKey: "realito",
      type: "CELEBRATION",
      content: {
        text: `Â¡Racha de ${context.streak} dÃ­as! Tu constancia fortalece el espÃ­ritu de Real del Monte.`,
        emotion: "enthusiastic",
      },
      seasonId: context.currentSeasonId,
      createdAt: new Date().toISOString(),
    });
  }

  if (context.energy !== undefined && context.energy <= 20) {
    messages.push({
      id: generateMessageId(),
      characterKey: "realito",
      type: "WARNING",
      content: {
        text: "Tu energÃ­a estÃ¡ baja. TÃ³mate un descanso y disfruta de un paste mientras te recuperas.",
        emotion: "concerned",
      },
      seasonId: context.currentSeasonId,
      createdAt: new Date().toISOString(),
    });
  }

  if (context.collectionsCompleted > 0) {
    messages.push({
      id: generateMessageId(),
      characterKey: "isabella",
      type: "CELEBRATION",
      content: {
        text: `Has completado ${context.collectionsCompleted} colecciÃ³n${context.collectionsCompleted > 1 ? "es" : ""}. Tu contribuciÃ³n al patrimonio digital es valiosa.`,
      },
      seasonId: context.currentSeasonId,
      createdAt: new Date().toISOString(),
    });
  }

  // Seasonal ambient
  messages.push({
    id: generateMessageId(),
    characterKey: "isabella",
    type: "SEASONAL",
    content: {
      text: "La temporada actual de MinerÃ­a Colonial ofrece experiencias Ãºnicas en los tÃºneles histÃ³ricos. Â¡No te las pierdas!",
    },
    seasonId: context.currentSeasonId,
    createdAt: new Date().toISOString(),
  });

  return messages.slice(0, limit);
}

/**
 * Suggest next actions for a player based on their context.
 */
export function suggestActions(params: {
  context: PlayerContext;
}): { type: string; label: string; description: string; icon: string }[] {
  const { context } = params;
  const suggestions: { type: string; label: string; description: string; icon: string }[] = [];

  if (context.level < 10) {
    suggestions.push({
      type: "DISCOVER_POI",
      label: "Explorar nuevos puntos de interÃ©s",
      description: "Descubre lugares ocultos y gana experiencia.",
      icon: "ðŸ—ºï¸",
    });
  }

  if (context.collectionsCompleted < 3) {
    suggestions.push({
      type: "COLLECT_ITEM",
      label: "Completar colecciones",
      description: "Busca objetos coleccionables para fortalecer el archivo digital.",
      icon: "ðŸ§©",
    });
  }

  suggestions.push({
    type: "LISTEN_RADIO",
    label: "Escuchar TAMV 92.5",
    description: "Sintoniza la radio del pueblo y gana recompensas.",
    icon: "ðŸ“»",
  });

  suggestions.push({
    type: "CAPTURE_PHOTO",
    label: "Capturar una foto del territorio",
    description: "Cada imagen preserva la memoria visual de Real del Monte.",
    icon: "ðŸ“¸",
  });

  if (context.territoriesVisited >= 5) {
    suggestions.push({
      type: "SHARE_STORY",
      label: "Compartir una historia",
      description: "Tu experiencia puede inspirar a otros exploradores.",
      icon: "ðŸ“–",
    });
  }

  return suggestions.slice(0, 4);
}
