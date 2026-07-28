/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Mexa API â€” Cryptographic Sovereignty Layer (Î©-Core v4.0 Enterprise)
// Capa criptogrÃ¡fica: firma digital, verificaciÃ³n de procedencia,
// mÃ¡scara de federaciÃ³n para los 7 nodos TAMV
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { createHash, randomBytes } from "crypto";
import type { FederationId, FederationMask, SignedPayload, VerificationResult } from "../isabella/types";

const FEDERATIONS: FederationId[] = ["FED-1", "FED-2", "FED-3", "FED-4", "FED-5", "FED-6", "FED-7"];

// â”€â”€ Federation Mask â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function createFederationMask(
  federationId: FederationId,
  nodeId: string,
  secret: string,
): FederationMask {
  if (!FEDERATIONS.includes(federationId)) {
    throw new Error(`FederaciÃ³n invÃ¡lida: ${federationId}`);
  }
  const timestamp = Date.now();
  const raw = `${federationId}:${nodeId}:${timestamp}:${secret}`;
  const signature = createHash("sha256").update(raw).digest("hex");
  return { federationId, nodeId, timestamp, signature };
}

export function verifyFederationMask(
  mask: FederationMask,
  secret: string,
): VerificationResult {
  const raw = `${mask.federationId}:${mask.nodeId}:${mask.timestamp}:${secret}`;
  const expectedSig = createHash("sha256").update(raw).digest("hex");

  if (mask.signature !== expectedSig) {
    return { valid: false, federation: mask.federationId, node: mask.nodeId, reason: "invalid signature" };
  }

  const age = Date.now() - mask.timestamp;
  if (age > 300000) {
    return { valid: false, federation: mask.federationId, node: mask.nodeId, reason: "mask expired (max 5min)" };
  }

  if (!FEDERATIONS.includes(mask.federationId)) {
    return { valid: false, federation: mask.federationId, node: mask.nodeId, reason: "unknown federation" };
  }

  return { valid: true, federation: mask.federationId, node: mask.nodeId };
}

// â”€â”€ Payload Signing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function signPayload(
  payload: unknown,
  mask: FederationMask,
  secret: string,
): SignedPayload {
  const nonce = randomBytes(16).toString("hex");
  const payloadStr = JSON.stringify(payload);
  const hash = createHash("sha256")
    .update(`${payloadStr}:${mask.signature}:${nonce}`)
    .digest("hex");
  return { payload, federationMask: mask, hash, nonce };
}

export function verifySignedPayload(
  signed: SignedPayload,
  secret: string,
): VerificationResult {
  const maskResult = verifyFederationMask(signed.federationMask, secret);
  if (!maskResult.valid) return maskResult;

  const payloadStr = JSON.stringify(signed.payload);
  const expectedHash = createHash("sha256")
    .update(`${payloadStr}:${signed.federationMask.signature}:${signed.nonce}`)
    .digest("hex");

  if (signed.hash !== expectedHash) {
    return {
      valid: false,
      federation: signed.federationMask.federationId,
      node: signed.federationMask.nodeId,
      reason: "payload hash mismatch",
    };
  }

  return { valid: true, federation: signed.federationMask.federationId, node: signed.federationMask.nodeId };
}

// â”€â”€ Mexa API Client â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface MexaApiClient {
  createMask: (fed: FederationId, node: string) => FederationMask;
  sign: (payload: unknown, mask: FederationMask) => SignedPayload;
  verify: (signed: SignedPayload) => VerificationResult;
  health: () => { ok: boolean; federations: string[] };
}

export function createMexaClient(secret?: string): MexaApiClient {
  const key = secret ?? process.env.MEXA_API_SECURE_KEY;
  if (!key) {
    throw new Error(
      "MEXA_API_SECURE_KEY must be set. " +
      "Hardcoded fallback secrets are prohibited (PennyLane security pattern)."
    );
  }

  return {
    createMask: (fed: FederationId, node: string) => createFederationMask(fed, node, key),
    sign: (payload: unknown, mask: FederationMask) => signPayload(payload, mask, key),
    verify: (signed: SignedPayload) => verifySignedPayload(signed, key),
    health: () => ({ ok: true, federations: FEDERATIONS }),
  };
}
