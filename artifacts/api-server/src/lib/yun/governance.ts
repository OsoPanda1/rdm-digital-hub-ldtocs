// ────────────────────────────────────────────────────────────────
// YUN Governance Console — ADR Management & Quorum Voting
// Materializes CP-005 (Gobernanza Documentada) and
// CP-007 (Gobernanza Federada).
// ────────────────────────────────────────────────────────────────

import { randomUUID } from "node:crypto";
import { QUORUM_RULES } from "./constitution";
import type { ADR, ADRStatus, FederationId, YunDomain } from "./types";

// ── Types ──────────────────────────────────────────────────────

export interface VoteRecord {
  federationId: FederationId;
  voterId: string;
  decision: "approve" | "reject" | "abstain";
  reason: string;
  timestamp: number;
  signature: string;
}

export interface ADRVote {
  adrId: string;
  votes: VoteRecord[];
  requiredQuorum: number;
  status: "pending" | "approved" | "rejected";
  closedAt?: number;
}

export interface ADRProposal {
  adrId: string;
  title: string;
  status: ADRStatus;
  date: string;
  authors: string[];
  context: string;
  decision: string;
  consequences: string;
  alternatives: string[];
  domain: YunDomain;
  proposedBy: string;
  proposedAt: number;
}

// ── Governance Console ─────────────────────────────────────────

export class YunGovernanceConsole {
  private adrs = new Map<string, ADR>();
  private votes = new Map<string, ADRVote>();
  private proposals: ADRProposal[] = [];

  constructor() {
    this.initializeADRs();
  }

  // ── ADR Management ───────────────────────────────────────────

  getADRs(): ADR[] {
    return Array.from(this.adrs.values());
  }

  getADR(adrId: string): ADR | undefined {
    return this.adrs.get(adrId);
  }

  getADRsByStatus(status: ADRStatus): ADR[] {
    return Array.from(this.adrs.values()).filter((a) => a.status === status);
  }

  getADRsByDomain(domain: YunDomain): ADR[] {
    return Array.from(this.adrs.values()).filter((a) =>
      a.title.toLowerCase().includes(domain.toLowerCase()) ||
      a.context.toLowerCase().includes(domain.toLowerCase()),
    );
  }

  proposeADR(proposal: Omit<ADRProposal, "adrId" | "proposedAt">): ADRProposal {
    const adrId = `ADR-YUN-${String(this.proposals.length + 1).padStart(4, "0")}`;
    const fullProposal: ADRProposal = {
      ...proposal,
      adrId,
      proposedAt: Date.now(),
    };

    this.proposals.push(fullProposal);

    // Auto-create ADR record
    this.adrs.set(adrId, {
      adrId,
      title: proposal.title,
      status: "Proposed",
      date: new Date().toISOString(),
      authors: proposal.authors,
      context: proposal.context,
      decision: proposal.decision,
      consequences: proposal.consequences,
      alternatives: proposal.alternatives,
    });

    // Create vote tracking
    this.votes.set(adrId, {
      adrId,
      votes: [],
      requiredQuorum: QUORUM_RULES.policyChange,
      status: "pending",
    });

    return fullProposal;
  }

  // ── Voting ───────────────────────────────────────────────────

  castVote(params: {
    adrId: string;
    federationId: FederationId;
    voterId: string;
    decision: "approve" | "reject" | "abstain";
    reason: string;
    signature: string;
  }): { success: boolean; message: string; currentVotes: number; quorum: number } {
    const voteRecord = this.votes.get(params.adrId);
    if (!voteRecord) {
      return { success: false, message: "ADR not found.", currentVotes: 0, quorum: 0 };
    }

    if (voteRecord.status !== "pending") {
      return { success: false, message: `ADR already ${voteRecord.status}.`, currentVotes: voteRecord.votes.length, quorum: voteRecord.requiredQuorum };
    }

    // Check if federation already voted
    const existingVote = voteRecord.votes.find((v) => v.federationId === params.federationId);
    if (existingVote) {
      return { success: false, message: `Federation ${params.federationId} already voted.`, currentVotes: voteRecord.votes.length, quorum: voteRecord.requiredQuorum };
    }

    const vote: VoteRecord = {
      federationId: params.federationId,
      voterId: params.voterId,
      decision: params.decision,
      reason: params.reason,
      timestamp: Date.now(),
      signature: params.signature,
    };

    voteRecord.votes.push(vote);

    // Check quorum
    const approvals = voteRecord.votes.filter((v) => v.decision === "approve").length;
    const rejections = voteRecord.votes.filter((v) => v.decision === "reject").length;

    if (approvals >= voteRecord.requiredQuorum) {
      voteRecord.status = "approved";
      voteRecord.closedAt = Date.now();
      const adr = this.adrs.get(params.adrId);
      if (adr) adr.status = "Accepted";
    } else if (rejections >= voteRecord.requiredQuorum) {
      voteRecord.status = "rejected";
      voteRecord.closedAt = Date.now();
    }

    return {
      success: true,
      message: "Vote recorded.",
      currentVotes: voteRecord.votes.length,
      quorum: voteRecord.requiredQuorum,
    };
  }

  getVoteStatus(adrId: string): ADRVote | undefined {
    return this.votes.get(adrId);
  }

  // ── License Issuance (Governance-controlled) ─────────────────

  canIssueLicense(federationId: FederationId, domain: YunDomain): boolean {
    // CP-007: License issuance requires matching federation scope
    const federationMap: Record<YunDomain, FederationId[]> = {
      identity: ["FED-1"],
      knowledge: ["FED-2"],
      telemetry: ["FED-3"],
      media: ["FED-4"],
      territorial: ["FED-5"],
      gameplay: ["FED-6"],
      cognitive: ["FED-7"],
      commerce: ["FED-1", "FED-3", "FED-5"],
    };

    return federationMap[domain]?.includes(federationId) ?? false;
  }

  // ── Stats ────────────────────────────────────────────────────

  getGovernanceStats(): {
    totalADRs: number;
    byStatus: Record<ADRStatus, number>;
    pendingVotes: number;
    approvedVotes: number;
    rejectedVotes: number;
  } {
    const adrs = Array.from(this.adrs.values());
    const voteArr = Array.from(this.votes.values());

    return {
      totalADRs: adrs.length,
      byStatus: {
        Proposed: adrs.filter((a) => a.status === "Proposed").length,
        Accepted: adrs.filter((a) => a.status === "Accepted").length,
        Deprecated: adrs.filter((a) => a.status === "Deprecated").length,
        Superseded: adrs.filter((a) => a.status === "Superseded").length,
      },
      pendingVotes: voteArr.filter((v) => v.status === "pending").length,
      approvedVotes: voteArr.filter((v) => v.status === "approved").length,
      rejectedVotes: voteArr.filter((v) => v.status === "rejected").length,
    };
  }

  // ── Private ──────────────────────────────────────────────────

  private initializeADRs(): void {
    const foundationalADR: ADR = {
      adrId: "ADR-YUN-0001",
      title: "YUN Constitutional Framework",
      status: "Accepted",
      date: "2026-07-25",
      authors: ["Edwin Castillo Trejo", "Isabella"],
      context: "Establishes the constitutional realm (YUN) as the foundational governance layer of the TAMV ecosystem, defining 8 immutable principles, identity heptacapa, and operational rules.",
      decision: "YUN operates under 8 constitutional principles: Soberanía del Dato, Desacoplamiento Reactivo, Seguridad Transparente, Resiliencia Degradable, Gobernanza Documentada, Observabilidad Obligatoria, Gobernanza Federada, and Neutralidad Epistémica.",
      consequences: "All TAMV subsystems must comply with YUN principles. Non-compliance results in automatic policy denial. Changes to constitution require 5/7 federation quorum.",
      alternatives: ["Ad-hoc governance without constitutional framework", "External governance model borrowed from existing blockchains"],
    };

    this.adrs.set("ADR-YUN-0001", foundationalADR);
  }
}
