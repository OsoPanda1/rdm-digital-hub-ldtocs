// src/data/video-config.ts
// RDM Digital Hub — Video Embed Configuration
// Replace the youtubeId values with your actual YouTube video IDs.
// Format: the part after v= in youtube.com/watch?v=XXXXX or the part after youtu.be/

export interface PageVideo {
  youtubeId: string;
  title: string;
  caption?: string;
}

export const PAGE_VIDEOS: Record<string, { hero?: PageVideo; mid?: PageVideo }> = {
  // ── Homepage ──────────────────────────────────────────────
  index: {
    hero: {
      youtubeId: "REPLACE_WITH_YOUTUBE_ID",
      title: "Conoce Real del Monte — Pueblo Mágico",
      caption: "Descubre la magia de Real del Monte, Hidalgo",
    },
  },

  // ── Cultura ────────────────────────────────────────────────
  cultura: {
    hero: {
      youtubeId: "REPLACE_WITH_YOUTUBE_ID",
      title: "Cultura y Tradiciones de Real del Monte",
      caption: "Fiestas, tradiciones y el espíritu vivente de nuestra comunidad",
    },
  },

  // ── Historia ───────────────────────────────────────────────
  historia: {
    hero: {
      youtubeId: "REPLACE_WITH_YOUTUBE_ID",
      title: "500 Años de Historia Minera",
      caption: "Del descubrimiento de la Veta Madre a la identidad actual",
    },
  },

  // ── Gastronomía ───────────────────────────────────────────
  gastronomia: {
    mid: {
      youtubeId: "REPLACE_WITH_YOUTUBE_ID",
      title: "Los Pastes de Real del Monte",
      caption: "La tradición pastelera que define nuestra gastronomía",
    },
  },

  // ── Música ────────────────────────────────────────────────
  musica: {
    hero: {
      youtubeId: "REPLACE_WITH_YOUTUBE_ID",
      title: "Música y Sonidos de Real del Monte",
      caption: "Melodías que capturan el espíritu de nuestra tierra",
    },
  },

  // ── Ecoturismo ────────────────────────────────────────────
  ecoturismo: {
    hero: {
      youtubeId: "REPLACE_WITH_YOUTUBE_ID",
      title: "Aventura en la Sierra de Pachuca",
      caption: "Senderismo, naturaleza y paisajes de ensueño",
    },
  },

  // ── Radio / Archivo Sonoro ────────────────────────────────
  "archivo-sonoro": {
    mid: {
      youtubeId: "REPLACE_WITH_YOUTUBE_ID",
      title: "TAMV 92.5 FM — La Voz de Real del Monte",
      caption: "Nuestra radio comunitaria en vivo, 24/7",
    },
  },

  // ── Turismo / Rutas ───────────────────────────────────────
  rutas: {
    hero: {
      youtubeId: "REPLACE_WITH_YOUTUBE_ID",
      title: "Rutas Turísticas de Real del Monte",
      caption: "Recorridos que conectan historia, naturaleza y cultura",
    },
  },

  // ── Mapa ──────────────────────────────────────────────────
  mapa: {
    hero: {
      youtubeId: "REPLACE_WITH_YOUTUBE_ID",
      title: "Mapa Interactivo de Real del Monte",
      caption: "Explora nuestros puntos de interés en tiempo real",
    },
  },

  // ── Arte ──────────────────────────────────────────────────
  arte: {
    hero: {
      youtubeId: "REPLACE_WITH_YOUTUBE_ID",
      title: "Artesanías y Platería de Real del Monte",
      caption: "El arte que nace de la plata y la tradición",
    },
  },

  // ── Comunidad ─────────────────────────────────────────────
  comunidad: {
    hero: {
      youtubeId: "REPLACE_WITH_YOUTUBE_ID",
      title: "Nuestra Comunidad",
      caption: "Las personas que hacen vibrar a Real del Monte",
    },
  },
};

// Helper to get video config for a page
export function getPageVideo(slug: string, slot: "hero" | "mid"): PageVideo | undefined {
  return PAGE_VIDEOS[slug]?.[slot];
}
