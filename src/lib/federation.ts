export type FederationKey =
  | "MDD_TAMV"
  | "BOOKPI"
  | "PHOENIX"
  | "KAOS"
  | "CHRONOS"
  | "ANUBIS"
  | "DEKATEOTL";

export interface FederationLayer {
  key: FederationKey;
  glyph: string;
  name: string;
  domain: string;
  mantra: string;
  color: string;
}

export const HEPTA_LAYERS: FederationLayer[] = [
  {
    key: "ANUBIS",
    glyph: "𓃣",
    name: "Anubis",
    domain: "Doctrina · Kernel ontológico",
    mantra: "Pesa el corazón del código contra la pluma de la verdad.",
    color: "oklch(0.38 0.05 270)",
  },
  {
    key: "MDD_TAMV",
    glyph: "◈",
    name: "MDD-TAMV",
    domain: "Territorio · Gemelo digital",
    mantra: "Cada calle es un verso del sistema.",
    color: "oklch(0.55 0.13 220)",
  },
  {
    key: "BOOKPI",
    glyph: "✦",
    name: "BookPi",
    domain: "Conocimiento · Tomos & corpus",
    mantra: "La biblioteca escribe a quien la lee.",
    color: "oklch(0.6 0.14 80)",
  },
  {
    key: "PHOENIX",
    glyph: "𓅓",
    name: "Phoenix",
    domain: "Comercio · Ciclo de renacimiento",
    mantra: "Toda transacción es una ceniza fértil.",
    color: "oklch(0.62 0.18 30)",
  },
  {
    key: "KAOS",
    glyph: "Ϟ",
    name: "Kaos",
    domain: "Caos creador · Investigación soberana",
    mantra: "Del desorden, una topografía nueva.",
    color: "oklch(0.5 0.16 330)",
  },
  {
    key: "CHRONOS",
    glyph: "◷",
    name: "Chronos",
    domain: "Tiempo · Timeline civilizatorio",
    mantra: "La memoria es la única materia que no se pierde.",
    color: "oklch(0.55 0.1 180)",
  },
  {
    key: "DEKATEOTL",
    glyph: "✺",
    name: "Dekateotl",
    domain: "Decimación divina · IPFS & pagos",
    mantra: "Diez partes del trabajo regresan a la tierra.",
    color: "oklch(0.58 0.15 130)",
  },
];

export const federationColor = (k: string) =>
  HEPTA_LAYERS.find((l) => l.key === k)?.color ?? "oklch(0.5 0.05 260)";

export const FEDERATION_COLORS: Record<string, string> = Object.fromEntries(
  HEPTA_LAYERS.map((l) => [l.key, l.color]),
);

export const ISABELLA_CORE_IDENTITY = {
  name: "Isabella",
  purpose: "Asistente territorial federada para conocimiento, cultura y servicios de Real del Monte.",
} as const;

export const SECURITY_PROTOCOLS = {
  guardian: { name: "Guardian", level: "high" },
  context: { name: "Context Isolation", level: "medium" },
  sovereignty: { name: "Sovereignty", level: "critical" },
} as const;

export function generateFederationHash(): string {
  return `fed_${Date.now().toString(36)}_${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}`;
}
