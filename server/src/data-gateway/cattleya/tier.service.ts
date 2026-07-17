export type CattleyaTier = "BASE" | "CUIDADO" | "GUARDIAN" | "EMBAJADOR";

export interface TierBenefits {
  discountRate: number;
  cashbackRate: number;
  xpMultiplier: number;
  accessToPremiumMissions: boolean;
  accessToXREarly: boolean;
  invitationToCoDesign: boolean;
}

const TIER_THRESHOLDS: { tier: CattleyaTier; minScore: number }[] = [
  { tier: "EMBAJADOR", minScore: 1700 },
  { tier: "GUARDIAN", minScore: 1300 },
  { tier: "CUIDADO", minScore: 900 },
  { tier: "BASE", minScore: 0 },
];

export const TIER_BENEFITS: Record<CattleyaTier, TierBenefits> = {
  BASE: {
    discountRate: 0,
    cashbackRate: 0,
    xpMultiplier: 1,
    accessToPremiumMissions: false,
    accessToXREarly: false,
    invitationToCoDesign: false,
  },
  CUIDADO: {
    discountRate: 0.03,
    cashbackRate: 0.005,
    xpMultiplier: 1.1,
    accessToPremiumMissions: false,
    accessToXREarly: false,
    invitationToCoDesign: false,
  },
  GUARDIAN: {
    discountRate: 0.07,
    cashbackRate: 0.01,
    xpMultiplier: 1.25,
    accessToPremiumMissions: true,
    accessToXREarly: true,
    invitationToCoDesign: false,
  },
  EMBAJADOR: {
    discountRate: 0.12,
    cashbackRate: 0.02,
    xpMultiplier: 1.5,
    accessToPremiumMissions: true,
    accessToXREarly: true,
    invitationToCoDesign: true,
  },
};

export function computeTier(score: number): { tier: CattleyaTier; benefits: TierBenefits } {
  for (const t of TIER_THRESHOLDS) {
    if (score >= t.minScore) {
      return { tier: t.tier, benefits: TIER_BENEFITS[t.tier] };
    }
  }
  return { tier: "BASE", benefits: TIER_BENEFITS.BASE };
}

export const cattleyaService = {
  computeTier,

  getTier(score: number): CattleyaTier {
    return computeTier(score).tier;
  },

  getBenefits(score: number): TierBenefits {
    return computeTier(score).benefits;
  },

  applyXpMultiplier(score: number, baseXp: number): number {
    const { benefits } = computeTier(score);
    return Math.round(baseXp * benefits.xpMultiplier);
  },
};
