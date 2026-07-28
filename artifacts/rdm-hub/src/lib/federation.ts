/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
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
    glyph: "ð“ƒ£",
    name: "Anubis",
    domain: "Doctrina Â· Kernel ontolÃ³gico",
    mantra: "Pesa el corazÃ³n del cÃ³digo contra la pluma de la verdad.",
    color: "oklch(0.38 0.05 270)",
  },
  {
    key: "MDD_TAMV",
    glyph: "â—ˆ",
    name: "MDD-TAMV",
    domain: "Territorio Â· Gemelo digital",
    mantra: "Cada calle es un verso del sistema.",
    color: "oklch(0.55 0.13 220)",
  },
  {
    key: "BOOKPI",
    glyph: "âœ¦",
    name: "BookPi",
    domain: "Conocimiento Â· Tomos & corpus",
    mantra: "La biblioteca escribe a quien la lee.",
    color: "oklch(0.6 0.14 80)",
  },
  {
    key: "PHOENIX",
    glyph: "ð“…“",
    name: "Phoenix",
    domain: "Comercio Â· Ciclo de renacimiento",
    mantra: "Toda transacciÃ³n es una ceniza fÃ©rtil.",
    color: "oklch(0.62 0.18 30)",
  },
  {
    key: "KAOS",
    glyph: "Ïž",
    name: "Kaos",
    domain: "Caos creador Â· InvestigaciÃ³n soberana",
    mantra: "Del desorden, una topografÃ­a nueva.",
    color: "oklch(0.5 0.16 330)",
  },
  {
    key: "CHRONOS",
    glyph: "â—·",
    name: "Chronos",
    domain: "Tiempo Â· Timeline civilizatorio",
    mantra: "La memoria es la Ãºnica materia que no se pierde.",
    color: "oklch(0.55 0.1 180)",
  },
  {
    key: "DEKATEOTL",
    glyph: "âœº",
    name: "Dekateotl",
    domain: "DecimaciÃ³n divina Â· IPFS & pagos",
    mantra: "Diez partes del trabajo regresan a la tierra.",
    color: "oklch(0.58 0.15 130)",
  },
];

export const federationColor = (k: string) =>
  HEPTA_LAYERS.find((l) => l.key === k)?.color ?? "oklch(0.5 0.05 260)";

export const FEDERATION_COLORS: Record<string, string> = Object.fromEntries(
  HEPTA_LAYERS.map((l) => [l.key, l.color]),
);

export const SECURITY_PROTOCOLS: Record<string, { name: string; description: string; color: string }> = {
  FENIX_REX: { name: "Phoenix Rex", description: "RecuperaciÃ³n de datos", color: "oklch(0.62 0.18 30)" },
  INICIACION: { name: "IniciaciÃ³n", description: "Primer nivel de seguridad", color: "oklch(0.55 0.13 220)" },
  HOYO_NEGRO: { name: "Hoyo Negro", description: "ProtecciÃ³n avanzada", color: "oklch(0.5 0.16 330)" },
};

export const ISABELLA_CORE_IDENTITY = {
  name: "Isabella",
  role: "Asistente Territorial",
  federation: "MDD_TAMV" as const,
  version: "1.0.0",
};

export function generateFederationHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `fed_${Math.abs(hash).toString(36)}`;
}
