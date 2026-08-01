export interface CategoryMeta {
  label: string;
  emoji: string;
  image: string;
  gradient: string;
  badge: string;
}

// Rutas locales (apps/rdm-hub/public/images) — fotos reales de Real del Monte
const img = (name: string) => `/images/${name}`;

export const CATEGORY_META: Record<string, CategoryMeta> = {
  gastronomia: {
    label: "Gastronomía",
    emoji: "🥧",
    image: img("realito-gastronomia.png"),
    gradient: "from-[#7c3a1d] via-[#b85c3c] to-[#2a1207]",
    badge: "bg-[#b85c3c]/15 text-[#d47554]",
  },
  historia: {
    label: "Historia",
    emoji: "⛏️",
    image: img("realito-historia.png"),
    gradient: "from-[#5a4214] via-[#c8a356] to-[#1a1308]",
    badge: "bg-[#c8a356]/15 text-[#d4b26a]",
  },
  historico: {
    label: "Histórico",
    emoji: "🏛️",
    image: img("hiloche.jpg"),
    gradient: "from-[#4a3728] via-[#a9804f] to-[#1a1209]",
    badge: "bg-[#c8a356]/15 text-[#d4b26a]",
  },
  mineria: {
    label: "Minería",
    emoji: "⚒️",
    image: img("realito-minas.png"),
    gradient: "from-[#3a2a1a] via-[#8a6a3a] to-[#120d06]",
    badge: "bg-[#c8a356]/15 text-[#d4b26a]",
  },
  museo: {
    label: "Museo",
    emoji: "🏺",
    image: img("museo-medicina.jpg"),
    gradient: "from-[#16243a] via-[#1e3a5f] to-[#0a0f18]",
    badge: "bg-[#1e3a5f]/40 text-[#7aa2d4]",
  },
  cultura: {
    label: "Cultura",
    emoji: "🎭",
    image: img("realito-cultura.png"),
    gradient: "from-[#1e2440] via-[#4a3a6a] to-[#0e0d18]",
    badge: "bg-[#6a5aa0]/25 text-[#b3a6e0]",
  },
  arquitectura: {
    label: "Arquitectura",
    emoji: "⛲",
    image: img("plaza-principal.jpg"),
    gradient: "from-[#3a2c18] via-[#b08a4a] to-[#150f07]",
    badge: "bg-[#c8a356]/15 text-[#d4b26a]",
  },
  plaza: {
    label: "Plaza",
    emoji: "🏞️",
    image: img("plaza-principal.jpg"),
    gradient: "from-[#2c3a24] via-[#6a8a5a] to-[#0f140d]",
    badge: "bg-emerald-900/40 text-emerald-300",
  },
  naturaleza: {
    label: "Naturaleza",
    emoji: "🌲",
    image: img("ecoturismo.jpg"),
    gradient: "from-[#1e3a2a] via-[#3f7a52] to-[#0c140e]",
    badge: "bg-emerald-900/40 text-emerald-300",
  },
  turismo: {
    label: "Turismo",
    emoji: "🧭",
    image: img("callejon.jpg"),
    gradient: "from-[#1c3a4a] via-[#2f6a8a] to-[#0a1218]",
    badge: "bg-sky-900/40 text-sky-300",
  },
  tradicion: {
    label: "Tradición",
    emoji: "🕯️",
    image: img("plaza-dos.jpg"),
    gradient: "from-[#3a2a3a] via-[#8a5a8a] to-[#150e15]",
    badge: "bg-purple-900/40 text-purple-300",
  },
  musica: {
    label: "Música",
    emoji: "🎻",
    image: img("plaza.jpg"),
    gradient: "from-[#3a1c2a] via-[#8a3a5a] to-[#14080c]",
    badge: "bg-rose-900/40 text-rose-300",
  },
  hospedaje: {
    label: "Hospedaje",
    emoji: "🛏️",
    image: img("real-1.jpg"),
    gradient: "from-[#1c2a3a] via-[#3a5a8a] to-[#0a1018]",
    badge: "bg-indigo-900/40 text-indigo-300",
  },
  artesanias: {
    label: "Artesanías",
    emoji: "🧶",
    image: img("realito-platerias.png"),
    gradient: "from-[#3a2414] via-[#a05a2a] to-[#160c04]",
    badge: "bg-orange-900/40 text-orange-300",
  },
  default: {
    label: "Real del Monte",
    emoji: "🌄",
    image: img("pueblo.jpg"),
    gradient: "from-[#3a3214] via-[#c8a356] to-[#120e05]",
    badge: "bg-[#c8a356]/15 text-[#d4b26a]",
  },
};

export const LANDSCAPE_HERO = img("pueblo.jpg");
export const LANDSCAPE_ALT = img("mirador-purisima.jpg");
export const STREET_HERO = img("calles.jpg");
export const MINE_HERO = img("mina-acosta.jpg");
export const FOOD_HERO = img("realito-gastronomia.png");
export const CULTURE_HERO = img("realito-cultura.png");
export const ECONOMY_HERO = img("centro.jpg");

export function categoryMeta(cat?: string | null): CategoryMeta {
  if (!cat) return CATEGORY_META.default;
  return CATEGORY_META[cat] ?? CATEGORY_META.default;
}

export function itemImage(cat: string | undefined, customUrl?: string | null): string | null {
  if (customUrl) return customUrl;
  return categoryMeta(cat).image;
}
