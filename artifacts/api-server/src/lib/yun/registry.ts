// ────────────────────────────────────────────────────────────────
// YUN Registry — Heptacapa Identity System
// Materializes ADR-YUN-0001's identity model.
// ────────────────────────────────────────────────────────────────

import { randomUUID } from "node:crypto";
import type {
  YunNode,
  NodeType,
  NodeStatus,
  YunDomain,
  FederationId,
  YunLicense,
  LicenseType,
} from "./types";
import { FEDERATIONS } from "./types";

// ── Types ──────────────────────────────────────────────────────

export interface YunAgent {
  agentId: string;
  name: string;
  type: "human" | "ai" | "hybrid";
  domain: YunDomain;
  federationId: FederationId;
  roles: string[];
  licenseIds: string[];
  adrBindings: string[];
  status: NodeStatus;
  publicKey: string;
  pqPublicKey?: string;
  metadata: Record<string, unknown>;
  registeredAt: number;
  lastSeenAt: number;
}

export interface YunService {
  serviceId: string;
  name: string;
  kind: "radio" | "api" | "panel" | "commerce" | "wiki" | "perception" | "opinion" | "resonance";
  nodeId: string;
  domain: YunDomain;
  federationId: FederationId;
  status: NodeStatus;
  endpoint?: string;
  metadata: Record<string, unknown>;
  registeredAt: number;
}

export interface YunRole {
  roleId: string;
  name: string;
  level: "read" | "write" | "admin" | "governance";
  domain: YunDomain;
  federationId: FederationId;
  permissions: string[];
}

export interface YunIdentityBinding {
  entityId: string;
  entityType: "node" | "agent" | "ai" | "service";
  adrIds: string[];
  licenseIds: string[];
  roles: string[];
  federations: FederationId[];
  boundAt: number;
}

// ── Registry ───────────────────────────────────────────────────

export class YunRegistry {
  private nodes = new Map<string, YunNode>();
  private agents = new Map<string, YunAgent>();
  private aiAgents = new Map<string, YunAgent>();
  private services = new Map<string, YunService>();
  private roles = new Map<string, YunRole>();
  private licenses = new Map<string, YunLicense>();
  private bindings = new Map<string, YunIdentityBinding>();

  constructor() {
    this.initializeRoles();
    this.initializeLicenses();
  }

  // ── Node Management ──────────────────────────────────────────

  registerNode(params: {
    name: string;
    type: NodeType;
    domain: YunDomain;
    federationId: FederationId;
    publicKey: string;
    pqPublicKey?: string;
    metadata?: Record<string, unknown>;
  }): YunNode {
    const nodeId = `NODE-${randomUUID().slice(0, 8)}`;
    const now = Date.now();

    const node: YunNode = {
      nodeId,
      name: params.name,
      type: params.type,
      domain: params.domain,
      federationId: params.federationId,
      status: "active",
      publicKey: params.publicKey,
      pqPublicKey: params.pqPublicKey,
      registeredAt: now,
      lastSeenAt: now,
      metadata: params.metadata ?? {},
    };

    this.nodes.set(nodeId, node);
    this.createBinding(nodeId, "node", [], [], []);
    return node;
  }

  getNode(nodeId: string): YunNode | undefined {
    return this.nodes.get(nodeId);
  }

  updateNodeStatus(nodeId: string, status: NodeStatus): void {
    const node = this.nodes.get(nodeId);
    if (node) node.status = status;
  }

  touchNode(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (node) node.lastSeenAt = Date.now();
  }

  // ── Agent Management ─────────────────────────────────────────

  registerAgent(params: {
    name: string;
    type: "human" | "ai" | "hybrid";
    domain: YunDomain;
    federationId: FederationId;
    roles: string[];
    publicKey: string;
    pqPublicKey?: string;
    adrIds?: string[];
    licenseIds?: string[];
    metadata?: Record<string, unknown>;
  }): YunAgent {
    const agentId = params.type === "ai" ? `AI-${randomUUID().slice(0, 8)}` : `USR-${randomUUID().slice(0, 8)}`;
    const now = Date.now();

    const agent: YunAgent = {
      agentId,
      name: params.name,
      type: params.type,
      domain: params.domain,
      federationId: params.federationId,
      roles: params.roles,
      licenseIds: params.licenseIds ?? [],
      adrBindings: params.adrIds ?? ["ADR-YUN-0001"],
      status: "active",
      publicKey: params.publicKey,
      pqPublicKey: params.pqPublicKey,
      metadata: params.metadata ?? {},
      registeredAt: now,
      lastSeenAt: now,
    };

    if (params.type === "ai") {
      this.aiAgents.set(agentId, agent);
    } else {
      this.agents.set(agentId, agent);
    }

    this.createBinding(agentId, params.type === "ai" ? "ai" : "agent", params.adrIds ?? [], params.licenseIds ?? [], params.roles);
    return agent;
  }

  // ── Service Management ───────────────────────────────────────

  registerService(params: {
    name: string;
    kind: YunService["kind"];
    nodeId: string;
    domain: YunDomain;
    federationId: FederationId;
    endpoint?: string;
    metadata?: Record<string, unknown>;
  }): YunService {
    const serviceId = `SVC-${randomUUID().slice(0, 8)}`;
    const service: YunService = {
      serviceId,
      name: params.name,
      kind: params.kind,
      nodeId: params.nodeId,
      domain: params.domain,
      federationId: params.federationId,
      status: "active",
      endpoint: params.endpoint,
      metadata: params.metadata ?? {},
      registeredAt: Date.now(),
    };

    this.services.set(serviceId, service);
    this.createBinding(serviceId, "service", [], [], []);
    return service;
  }

  // ── Role Management ──────────────────────────────────────────

  getRoles(): YunRole[] {
    return Array.from(this.roles.values());
  }

  getRole(roleId: string): YunRole | undefined {
    return this.roles.get(roleId);
  }

  // ── License Management ───────────────────────────────────────

  getLicenses(): YunLicense[] {
    return Array.from(this.licenses.values());
  }

  issueLicense(params: {
    type: LicenseType;
    domain: YunDomain;
    grantedTo: string;
    permissions: string[];
    restrictions: string[];
    validDays: number;
    issuedBy: FederationId;
  }): YunLicense {
    const licenseId = `LIC-${randomUUID().slice(0, 8)}`;
    const now = Date.now();
    const license: YunLicense = {
      licenseId,
      type: params.type,
      domain: params.domain,
      grantedTo: params.grantedTo,
      permissions: params.permissions,
      restrictions: params.restrictions,
      validFrom: now,
      validUntil: now + params.validDays * 86_400_000,
      issuedBy: params.issuedBy,
    };

    this.licenses.set(licenseId, license);
    return license;
  }

  hasLicense(entityId: string, licenseType: LicenseType): boolean {
    return Array.from(this.licenses.values()).some(
      (l) => l.grantedTo === entityId && l.type === licenseType && l.validUntil > Date.now(),
    );
  }

  // ── Binding Management ───────────────────────────────────────

  getBinding(entityId: string): YunIdentityBinding | undefined {
    return this.bindings.get(entityId);
  }

  addAdrBinding(entityId: string, adrId: string): void {
    const binding = this.bindings.get(entityId);
    if (binding && !binding.adrIds.includes(adrId)) {
      binding.adrIds.push(adrId);
    }
  }

  // ── Query ────────────────────────────────────────────────────

  findNodesByDomain(domain: YunDomain): YunNode[] {
    return Array.from(this.nodes.values()).filter((n) => n.domain === domain);
  }

  findNodesByFederation(federationId: FederationId): YunNode[] {
    return Array.from(this.nodes.values()).filter((n) => n.federationId === federationId);
  }

  findActiveAgents(): YunAgent[] {
    return [...Array.from(this.agents.values()), ...Array.from(this.aiAgents.values())].filter((a) => a.status === "active");
  }

  getStats(): {
    nodes: { total: number; active: number; byType: Record<NodeType, number> };
    agents: { human: number; ai: number; hybrid: number };
    services: { total: number; byKind: Record<string, number> };
    licenses: { total: number; active: number };
  } {
    const nodeArr = Array.from(this.nodes.values());
    const agentArr = [...Array.from(this.agents.values()), ...Array.from(this.aiAgents.values())];
    const serviceArr = Array.from(this.services.values());
    const licenseArr = Array.from(this.licenses.values());

    const byType: Record<NodeType, number> = { territorial: 0, service: 0, "agent-human": 0, "agent-ai": 0, external: 0 };
    nodeArr.forEach((n) => byType[n.type]++);

    const byKind: Record<string, number> = {};
    serviceArr.forEach((s) => { byKind[s.kind] = (byKind[s.kind] || 0) + 1; });

    return {
      nodes: {
        total: nodeArr.length,
        active: nodeArr.filter((n) => n.status === "active").length,
        byType,
      },
      agents: {
        human: agentArr.filter((a) => a.type === "human").length,
        ai: agentArr.filter((a) => a.type === "ai").length,
        hybrid: agentArr.filter((a) => a.type === "hybrid").length,
      },
      services: {
        total: serviceArr.length,
        byKind,
      },
      licenses: {
        total: licenseArr.length,
        active: licenseArr.filter((l) => l.validUntil > Date.now()).length,
      },
    };
  }

  // ── Private ──────────────────────────────────────────────────

  private createBinding(entityId: string, entityType: YunIdentityBinding["entityType"], adrIds: string[], licenseIds: string[], roles: string[]): void {
    this.bindings.set(entityId, {
      entityId,
      entityType,
      adrIds: adrIds.length > 0 ? adrIds : ["ADR-YUN-0001"],
      licenseIds,
      roles,
      federations: [],
      boundAt: Date.now(),
    });
  }

  private initializeRoles(): void {
    const baseRoles: YunRole[] = [
      { roleId: "ROL-READER", name: "reader", level: "read", domain: "knowledge", federationId: "FED-2", permissions: ["read"] },
      { roleId: "ROL-OPERATOR", name: "operator", level: "write", domain: "telemetry", federationId: "FED-3", permissions: ["read", "write", "events.publish"] },
      { roleId: "ROL-ADMIN", name: "admin", level: "admin", domain: "identity", federationId: "FED-1", permissions: ["read", "write", "admin", "events.publish", "policy.evaluate"] },
      { roleId: "ROL-AUDITOR", name: "federation_auditor", level: "governance", domain: "cognitive", federationId: "FED-7", permissions: ["read", "write", "admin", "governance", "adr.review", "veto"] },
      { roleId: "ROL-COMMUNITY", name: "community", level: "read", domain: "territorial", federationId: "FED-6", permissions: ["read", "events.publish"] },
    ];
    baseRoles.forEach((r) => this.roles.set(r.roleId, r));
  }

  private initializeLicenses(): void {
    const now = Date.now();
    const yearMs = 365 * 86_400_000;
    const baseLicenses: YunLicense[] = [
      {
        licenseId: "LIC-TAMV-PRCL",
        type: "TAMV-PRCL",
        domain: "territorial",
        grantedTo: "system",
        permissions: ["territory.read", "territory.write", "events.publish"],
        restrictions: ["no_raw_replication"],
        validFrom: now,
        validUntil: now + yearMs * 10,
        issuedBy: "FED-5",
      },
      {
        licenseId: "LIC-TAMV-EOL",
        type: "TAMV-EOL",
        domain: "knowledge",
        grantedTo: "system",
        permissions: ["knowledge.read", "knowledge.write"],
        restrictions: ["attribution_required"],
        validFrom: now,
        validUntil: now + yearMs * 10,
        issuedBy: "FED-2",
      },
      {
        licenseId: "LIC-TAMV-KORIMA",
        type: "TAMV-KORIMA",
        domain: "cognitive",
        grantedTo: "system",
        permissions: ["narrative.generate", "interpret", "neutral_speech"],
        restrictions: ["no_human_decision_override"],
        validFrom: now,
        validUntil: now + yearMs * 10,
        issuedBy: "FED-7",
      },
    ];
    baseLicenses.forEach((l) => this.licenses.set(l.licenseId, l));
  }
}
