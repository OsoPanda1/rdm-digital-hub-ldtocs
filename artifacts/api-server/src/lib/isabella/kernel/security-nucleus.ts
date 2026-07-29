/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Isabella Î© Cognitive Kernel â€” Security Nucleus
// Authorization, data classification, sensitivity, audit, signing, immutable.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import type { SecurityLevel, SecurityDecision, AuditRecord } from "./types";
import { createHmac, randomBytes } from "crypto";
import { logger } from "../../logger";

export interface SecurityNucleus {
  authorize(params: {
    userId: string;
    action: string;
    resource: string;
    level: SecurityLevel;
    input: Record<string, unknown>;
  }): SecurityDecision;
  createAuditRecord(params: {
    requestId: string;
    userId: string;
    action: string;
    inputs: Record<string, unknown>;
    outputs: Record<string, unknown>;
    securityDecision: SecurityDecision;
    constitutionalCompliance: string[];
  }): AuditRecord;
  verifyAuditIntegrity(record: AuditRecord): boolean;
  getAuditHistory(limit: number): AuditRecord[];
  classifyData(data: unknown): { level: SecurityLevel; sensitivity: number; tags: string[] };
}

const auditHistory: AuditRecord[] = [];
const MAX_AUDIT = 5000;
const signingSecret = randomBytes(32).toString("hex");

const SENSITIVE_PATTERNS = [
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/, label: "SSN", level: "top_secret" as SecurityLevel },
  { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, label: "credit-card", level: "secret" as SecurityLevel },
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, label: "email", level: "confidential" as SecurityLevel },
  { pattern: /\bpassword|contraseña|secret|token|api[_-]?key\b/i, label: "credential", level: "secret" as SecurityLevel },
  { pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, label: "ip-address", level: "confidential" as SecurityLevel },
];

function computeIntegrityHash(record: Omit<AuditRecord, "integrityHash">): string {
  const payload = JSON.stringify({
    id: record.id,
    requestId: record.requestId,
    userId: record.userId,
    action: record.action,
    timestamp: record.timestamp,
  });
  return createHmac("sha256", signingSecret).update(payload).digest("hex");
}

export function createSecurityNucleus(): SecurityNucleus {
  return {
    authorize({ userId, action, resource, level, input }) {
      const classification = this.classifyData(input);

      // Determine required level based on action
      let requiredLevel: SecurityLevel = "public";
      if (action.startsWith("delete") || action.startsWith("drop")) requiredLevel = "secret";
      else if (action.startsWith("update") || action.startsWith("write")) requiredLevel = "internal";
      else if (action.startsWith("read")) requiredLevel = "public";

      const levelOrder = ["public", "internal", "confidential", "secret", "top_secret"];
      const userLevelIdx = levelOrder.indexOf(level);
      const requiredLevelIdx = levelOrder.indexOf(
        classification.level > requiredLevel ? classification.level : requiredLevel,
      );

      const authorized = userLevelIdx >= requiredLevelIdx;

      const decision: SecurityDecision = {
        authorized,
        level,
        classification: classification.tags.join(","),
        sensitivity: classification.sensitivity,
        auditRequired: levelOrder.indexOf(level) >= 2 || classification.sensitivity > 0.5,
        signingRequired: levelOrder.indexOf(level) >= 3,
        immutableRecord: levelOrder.indexOf(level) >= 3,
        reasons: authorized
          ? [`User level ${level} meets required ${requiredLevel}`]
          : [`Insufficient permissions: ${level} < ${requiredLevel}`],
      };

      if (!authorized) {
        logger.warn({ userId, action, resource, level, requiredLevel }, "Security: authorization denied");
      }

      return decision;
    },

    createAuditRecord(params) {
      const record: AuditRecord = {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...params,
        timestamp: Date.now(),
        integrityHash: "",
      };
      record.integrityHash = computeIntegrityHash(record);

      auditHistory.push(record);
      if (auditHistory.length > MAX_AUDIT) auditHistory.shift();

      logger.info({
        auditId: record.id,
        action: record.action,
        userId: record.userId,
        authorized: params.securityDecision.authorized,
      }, "Audit record created");

      return record;
    },

    verifyAuditIntegrity(record) {
      const expectedHash = computeIntegrityHash({
        id: record.id,
        requestId: record.requestId,
        userId: record.userId,
        action: record.action,
        inputs: record.inputs,
        outputs: record.outputs,
        securityDecision: record.securityDecision,
        constitutionalCompliance: record.constitutionalCompliance,
        timestamp: record.timestamp,
      });
      return record.integrityHash === expectedHash;
    },

    getAuditHistory(limit) {
      return auditHistory.slice(-limit);
    },

    classifyData(data) {
      const str = typeof data === "string" ? data : JSON.stringify(data);
      const tags: string[] = [];
      let maxLevel: SecurityLevel = "public";
      let sensitivity = 0;

      for (const { pattern, label, level } of SENSITIVE_PATTERNS) {
        if (pattern.test(str)) {
          tags.push(label);
          if (["secret", "top_secret"].includes(level)) {
            maxLevel = level;
            sensitivity = Math.max(sensitivity, 0.9);
          } else if (level === "confidential") {
            if (maxLevel === "public") maxLevel = level;
            sensitivity = Math.max(sensitivity, 0.5);
          }
        }
      }

      return { level: maxLevel, sensitivity, tags };
    },
  };
}
