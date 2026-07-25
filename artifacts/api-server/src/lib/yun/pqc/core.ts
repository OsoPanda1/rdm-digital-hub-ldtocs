// ────────────────────────────────────────────────────────────────
// YUN Post-Quantum Hybrid Cryptography
// RSA/ECDSA + Kyber (KEM) + Dilithium (signatures)
// Provides cryptographic agility for the quantum era.
// ────────────────────────────────────────────────────────────────

import { randomUUID, createHash, createHmac, randomBytes, publicEncrypt, privateDecrypt, createSign, createVerify } from "node:crypto";
import type { YunNode } from "../types";

// ── Types ──────────────────────────────────────────────────────

export type PqcAlgorithm = "kyber512" | "kyber768" | "kyber1024" | "dilithium2" | "dilithium3" | "dilithium5";

export type PqcKeyStatus = "active" | "pending_rotation" | "retired" | "revoked";

export interface PqcKeyMeta {
  keyId: string;
  algorithm: PqcAlgorithm;
  createdAt: string;
  expiresAt: string;
  status: PqcKeyStatus;
  ownerId: string;
  usage: "encryption" | "signature" | "both";
}

export interface HybridHandshakeResult {
  sessionId: string;
  classicEncrypted: Buffer;
  pqcEncrypted: Buffer;
  hybridFingerprint: string;
  timestamp: number;
}

export interface HybridSignatureResult {
  signatureId: string;
  classicSignature: string;
  pqcSignature: string;
  hybridHash: string;
  algorithm: string;
  timestamp: number;
}

export interface KeyInventoryEntry {
  keyId: string;
  algorithm: PqcAlgorithm;
  ownerId: string;
  status: PqcKeyStatus;
  createdAt: string;
  expiresAt: string;
  rotationWindowMs: number;
}

// ── Default Configuration ──────────────────────────────────────

const DEFAULT_ROTATION_WINDOW_MS = 180 * 24 * 60 * 60 * 1000; // 6 months
const GRACE_PERIOD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days after expiry

// ── PQC Hybrid Crypto Engine ───────────────────────────────────

export class YunPqcCrypto {
  private keys = new Map<string, PqcKeyMeta>();
  private rotationWindowMs: number;
  private gracePeriodMs: number;

  constructor(options?: { rotationWindowMs?: number; gracePeriodMs?: number }) {
    this.rotationWindowMs = options?.rotationWindowMs ?? DEFAULT_ROTATION_WINDOW_MS;
    this.gracePeriodMs = options?.gracePeriodMs ?? GRACE_PERIOD_MS;
  }

  // ── Key Management ───────────────────────────────────────────

  generateKeyPair(params: {
    algorithm: PqcAlgorithm;
    ownerId: string;
    usage: PqcKeyMeta["usage"];
  }): PqcKeyMeta {
    const now = new Date();
    const expires = new Date(now.getTime() + this.rotationWindowMs);

    const meta: PqcKeyMeta = {
      keyId: `PQC-${randomUUID().slice(0, 8)}`,
      algorithm: params.algorithm,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      status: "active",
      ownerId: params.ownerId,
      usage: params.usage,
    };

    this.keys.set(meta.keyId, meta);
    return meta;
  }

  getKey(keyId: string): PqcKeyMeta | undefined {
    return this.keys.get(keyId);
  }

  revokeKey(keyId: string): boolean {
    const key = this.keys.get(keyId);
    if (!key) return false;
    key.status = "revoked";
    return true;
  }

  // ── Key Rotation ─────────────────────────────────────────────

  shouldRotateKey(keyId: string, now: Date = new Date()): boolean {
    const meta = this.keys.get(keyId);
    if (!meta) return false;
    const exp = new Date(meta.expiresAt);
    return now >= exp || meta.status === "pending_rotation";
  }

  rotateKey(keyId: string): { oldKey: PqcKeyMeta; newKey: PqcKeyMeta } | null {
    const oldKey = this.keys.get(keyId);
    if (!oldKey) return null;

    // Mark old key as pending rotation (grace period active)
    oldKey.status = "pending_rotation";

    // Generate new key with same params
    const newKey = this.generateKeyPair({
      algorithm: oldKey.algorithm,
      ownerId: oldKey.ownerId,
      usage: oldKey.usage,
    });

    return { oldKey, newKey };
  }

  getKeysNeedingRotation(): PqcKeyMeta[] {
    const now = new Date();
    return Array.from(this.keys.values()).filter(
      (k) => k.status === "active" && this.shouldRotateKey(k.keyId, now),
    );
  }

  // ── Hybrid Handshake (Kyber KEM + Classic) ───────────────────

  hybridHandshake(params: {
    alicePublicKey: string;
    alicePqPublicKey?: string;
    bobPublicKey: string;
    bobPqPublicKey?: string;
  }): HybridHandshakeResult {
    const sessionId = randomUUID();
    const now = Date.now();

    // Classic component: RSA/ECDSA encrypted nonce
    const classicSecret = randomBytes(32);
    const classicEncrypted = publicEncrypt(
      { key: params.bobPublicKey, padding: 40 }, // RSA_PKCS1_OAEP_PADDING
      classicSecret,
    );

    // PQC component: simulated Kyber encapsulation (placeholder for real Kyber)
    const pqcSecret = randomBytes(32);
    const pqcEncrypted = this.simulateKyberEncapsulate(pqcSecret, params.bobPqPublicKey);

    // Hybrid fingerprint: SHA-256(classic || pqc)
    const hybridHash = createHash("sha256")
      .update(Buffer.concat([classicSecret, pqcSecret]))
      .digest("hex");

    return {
      sessionId,
      classicEncrypted,
      pqcEncrypted,
      hybridFingerprint: hybridHash,
      timestamp: now,
    };
  }

  // ── Hybrid Signing (Dilithium + ECDSA) ───────────────────────

  hybridSign(params: {
    data: Buffer;
    classicPrivateKey: string;
    pqPrivateKey?: string;
    keyId?: string;
  }): HybridSignatureResult {
    const now = Date.now();

    // Classic ECDSA/RSA signature
    const classicSign = createSign("SHA256");
    classicSign.update(params.data);
    const classicSignature = classicSign.sign(params.classicPrivateKey, "base64");

    // PQC Dilithium signature (simulated — placeholder for real Dilithium)
    const pqcSignature = this.simulateDilithiumSign(params.data, params.pqPrivateKey);

    // Hybrid hash: SHA-256(classicSig || pqcSig)
    const hybridHash = createHash("sha256")
      .update(classicSignature + pqcSignature)
      .digest("hex");

    return {
      signatureId: `SIG-${randomUUID().slice(0, 8)}`,
      classicSignature,
      pqcSignature,
      hybridHash,
      algorithm: `hybrid:${params.keyId || "unknown"}`,
      timestamp: now,
    };
  }

  hybridVerify(params: {
    data: Buffer;
    classicSignature: string;
    pqcSignature: string;
    classicPublicKey: string;
  }): { valid: boolean; reason?: string } {
    try {
      // Verify classic signature
      const verify = createVerify("SHA256");
      verify.update(params.data);
      const classicValid = verify.verify(params.classicPublicKey, params.classicSignature, "base64");

      if (!classicValid) {
        return { valid: false, reason: "Classic signature invalid." };
      }

      // PQC verification (simulated)
      const pqcValid = this.simulateDilithiumVerify(params.data, params.pqcSignature);

      if (!pqcValid) {
        return { valid: false, reason: "PQC signature invalid." };
      }

      return { valid: true };
    } catch (err) {
      return { valid: false, reason: `Verification error: ${err}` };
    }
  }

  // ── Key Inventory ────────────────────────────────────────────

  getInventory(): KeyInventoryEntry[] {
    return Array.from(this.keys.values()).map((k) => ({
      keyId: k.keyId,
      algorithm: k.algorithm,
      ownerId: k.ownerId,
      status: k.status,
      createdAt: k.createdAt,
      expiresAt: k.expiresAt,
      rotationWindowMs: this.rotationWindowMs,
    }));
  }

  getInventoryStats(): {
    total: number;
    active: number;
    pendingRotation: number;
    retired: number;
    revoked: number;
    byAlgorithm: Record<PqcAlgorithm, number>;
  } {
    const keys = Array.from(this.keys.values());
    const byAlgorithm = {} as Record<PqcAlgorithm, number>;
    keys.forEach((k) => { byAlgorithm[k.algorithm] = (byAlgorithm[k.algorithm] || 0) + 1; });

    return {
      total: keys.length,
      active: keys.filter((k) => k.status === "active").length,
      pendingRotation: keys.filter((k) => k.status === "pending_rotation").length,
      retired: keys.filter((k) => k.status === "retired").length,
      revoked: keys.filter((k) => k.status === "revoked").length,
      byAlgorithm,
    };
  }

  // ── Private Helpers ──────────────────────────────────────────

  private simulateKyberEncapsulate(secret: Buffer, _pqPublicKey?: string): Buffer {
    // Simulated Kyber encapsulation — in production, use a real Kyber library
    // (e.g., pqcrypto.js, liboqs, or WebAssembly-based Kyber)
    const encrypted = randomBytes(secret.length);
    // XOR with a hash of the "public key" to simulate encapsulation
    const keyHash = createHash("sha256").update(_pqPublicKey || "default").digest();
    for (let i = 0; i < secret.length; i++) {
      encrypted[i] = secret[i] ^ keyHash[i % keyHash.length];
    }
    return encrypted;
  }

  private simulateDilithiumSign(data: Buffer, _pqPrivateKey?: string): string {
    // Simulated Dilithium signature — in production, use liboqs or pqcrypto
    const hash = createHash("sha256").update(data).update(_pqPrivateKey || "default").digest("base64");
    return `dilithium:${hash}`;
  }

  private simulateDilithiumVerify(data: Buffer, pqSignature: string): boolean {
    // Simulated verification — always returns true for placeholder
    return pqSignature.startsWith("dilithium:");
  }
}
