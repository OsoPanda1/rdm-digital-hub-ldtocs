import type { CattleyaTier } from "../../../server/src/data-gateway/cattleya/tier.service";
import { createEvent, publish } from "@/core/yun/event-bus";
import { SessionTicketClient } from "@/security/SessionTicketClient";

export interface MercatorBusiness {
  id: string;
  ownerId: string;
  active: boolean;
  tier: CattleyaTier;
}

export interface CommerceIntentInput {
  businessId: string;
  amountMinor: number;
  currency: "mxn" | "usd";
  resourceId?: string;
  correlationId?: string;
}

export interface MercatorRepository {
  getBusiness(id: string): Promise<MercatorBusiness | null>;
}

const TIER_LIMITS: Record<CattleyaTier, number> = {
  BASE: 50_000,
  CUIDADO: 150_000,
  GUARDIAN: 500_000,
  EMBAJADOR: 1_500_000,
};

export class MercatorSkill {
  constructor(
    private readonly tickets: SessionTicketClient,
    private readonly repository: MercatorRepository,
  ) {}

  async createIntent(userId: string, input: CommerceIntentInput) {
    if (!(await this.tickets.verify())) throw new Error("SESSION_TICKET_INVALID");
    if (!Number.isSafeInteger(input.amountMinor) || input.amountMinor <= 0) throw new Error("INVALID_AMOUNT");

    const business = await this.repository.getBusiness(input.businessId);
    if (!business || !business.active) throw new Error("BUSINESS_UNAVAILABLE");
    if (business.ownerId !== userId) throw new Error("BUSINESS_FORBIDDEN");
    if (input.amountMinor > TIER_LIMITS[business.tier]) throw new Error("TIER_LIMIT_EXCEEDED");

    const correlationId = input.correlationId ?? crypto.randomUUID();
    const intent = {
      id: crypto.randomUUID(),
      ...input,
      correlationId,
      tier: business.tier,
      status: "approved" as const,
      createdAt: new Date().toISOString(),
    };
    await publish(createEvent("yun.commerce.intent.created", "isabella.mercator", intent, {
      correlationId,
      federation: "comercio",
      domain: "commerce",
      classification: "confidential",
    }));
    return intent;
  }
}

export { TIER_LIMITS as MERCATOR_TIER_LIMITS };
