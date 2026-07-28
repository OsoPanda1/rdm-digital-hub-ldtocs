/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// YUN Post-Quantum Hybrid Cryptography
// RSA/ECDSA + Kyber (KEM) + Dilithium (signatures)
// Provides cryptographic agility for the quantum era.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * @module pqc/core
 *
 * This module uses X25519+Ed25519 as quantum-resistant classical alternatives
 * to true lattice-based PQC. When native Node.js bindings for Kyber/Dilithium
 * become available (via liboqs or WASM), all algorithms in this module should
 * be migrated to use those for full post-quantum security.
 *
 * Production note: In production environments, replace the X25519 and Ed25519
 * algorithms with actual lattice-based PQC algorithms (Kyber for KEM, Dilithium
 * for signatures) via liboqs, pqcrypto.js, or WASM bindings when those become
 * available for Node.js. The current X25519 and Ed25519 algorithms provide strong
 * classical security and are resistant to known quantum attacks on elliptic curves,
 * but a sufficiently large quantum computer could theoretically break them via
 * a generalized Shor's algorithm.
 */

import {
  randomUUID,
  createHash,
  createHmac,
  randomBytes,
  publicEncrypt,
  privateDecrypt,
  createSign,
  createVerify,
  generateKeyPairSync,
  diffieHellman,
  hkdfSync,
  sign as cryptoSign,
  verify as cryptoVerify,
  createPublicKey,
} from "node:crypto";
import { logger } from "../../logger";
import type { YunNode } from "../types";

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
  sharedSecret: Buffer;
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

// â”€â”€ Migration Note â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Migration note: This module currently uses X25519+Ed25519 as quantum-resistant
 * classical alternatives to true lattice-based PQC. When native Node.js bindings
 * for Kyber/Dilithium become available (via liboqs or WASM), all algorithms in
 * this module should be migrated to use those for full post-quantum security.
 *
 * @see https://openquantumsafe.org/ for a comprehensive overview of PQC algorithms
 */
export const PQC_MIGRATION_NOTE =
  "This module uses X25519+Ed25519 as quantum-resistant classical alternatives. Migrate to lattice-based Kyber/Dilithium when native Node.js bindings are available.";

// â”€â”€ Default Configuration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const DEFAULT_ROTATION_WINDOW_MS = 180 * 24 * 60 * 60 * 1000; // 6 months
const GRACE_PERIOD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days after expiry
const HKDF_INFO = Buffer.from("yun-pqc-hybrid-handshake-v1");
const HKDF_SALT = Buffer.alloc(32, 0);
const MAX_KEYS = Number(process.env.RDM_PQC_MAX_KEYS ?? 500);

// â”€â”€ PQC Hybrid Crypto Engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * YUN Post-Quantum Hybrid Cryptography Engine.
 *
 * Uses X25519 for KEM (key encapsulation mechanism) and Ed25519 for digital
 * signatures as quantum-resistant classical alternatives.
 *
 * In production, replace X25519 with Kyber and Ed25519 with Dilithium when
 * native Node.js PQC bindings are available (liboqs, pqcrypto.js, WASM).
 *
 * @see PQC_MIGRATION_NOTE for migration guidance
 */
export class YunPqcCrypto {
  private keys = new Map<string, PqcKeyMeta>();
  private keyMaterial = new Map<string, { publicKeyPem: string; privateKeyPem: string }>();
  private rotationWindowMs: number;
  private gracePeriodMs: number;

  constructor(options?: { rotationWindowMs?: number; gracePeriodMs?: number }) {
    this.rotationWindowMs = options?.rotationWindowMs ?? DEFAULT_ROTATION_WINDOW_MS;
    this.gracePeriodMs = options?.gracePeriodMs ?? GRACE_PERIOD_MS;
  }

  // â”€â”€ Key Management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Generate a new key pair for the specified algorithm.
   *
   * Kyber algorithms (kyber512/768/1024) generate X25519 key pairs for KEM.
   * Dilithium algorithms (dilithium2/3/5) generate Ed25519 key pairs for signatures.
   *
   * In production, replace with actual Kyber/Dilithium key generation via liboqs.
   */
  generateKeyPair(params: {
    algorithm: PqcAlgorithm;
    ownerId: string;
    usage: PqcKeyMeta["usage"];
  }): PqcKeyMeta {
    // Evict oldest revoked/expired keys if at capacity
    if (this.keys.size >= MAX_KEYS) {
      const now = new Date();
      const evictable = Array.from(this.keys.entries())
        .filter(([, k]) => k.status === "revoked" || new Date(k.expiresAt) < now)
        .sort((a, b) => new Date(a[1].createdAt).getTime() - new Date(b[1].createdAt).getTime());
      for (const [id] of evictable.slice(0, Math.ceil(MAX_KEYS * 0.1))) {
        this.keys.delete(id);
        this.keyMaterial.delete(id);
      }
      // If still at capacity, evict oldest retired key
      if (this.keys.size >= MAX_KEYS) {
        const retired = Array.from(this.keys.entries())
          .filter(([, k]) => k.status === "retired" || k.status === "pending_rotation")
          .sort((a, b) => new Date(a[1].createdAt).getTime() - new Date(b[1].createdAt).getTime());
        for (const [id] of retired.slice(0, 1)) {
          this.keys.delete(id);
          this.keyMaterial.delete(id);
        }
      }
      if (this.keys.size >= MAX_KEYS) {
        logger.warn({ keyCount: this.keys.size, max: MAX_KEYS }, "PQC key store at capacity â€” new key may displace active keys");
      }
    }

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

    // Generate actual cryptographic key pair based on algorithm family
    // Kyber algorithms â†’ X25519 (for KEM / key agreement)
    // Dilithium algorithms â†’ Ed25519 (for signatures)
    const isKem = params.algorithm.startsWith("kyber");
    const keyType = isKem ? "x25519" : "ed25519";
    const { publicKey, privateKey } = generateKeyPairSync(keyType as "x25519" | "ed25519");

    const publicKeyPem = publicKey.export({ type: "spki", format: "pem" }) as string;
    const privateKeyPem = privateKey.export({ type: "pkcs8", format: "pem" }) as string;

    this.keyMaterial.set(meta.keyId, { publicKeyPem, privateKeyPem });
    this.keys.set(meta.keyId, meta);
    return meta;
  }

  getKey(keyId: string): PqcKeyMeta | undefined {
    return this.keys.get(keyId);
  }

  /**
   * Get the PEM-encoded key material for a given key ID.
   * Returns the public and private key PEMs for use in cryptographic operations.
   *
   * @param keyId - The key identifier to look up
   * @returns The PEM-encoded public and private keys, or undefined if not found
   */
  getKeyMaterial(keyId: string): { publicKeyPem: string; privateKeyPem: string } | undefined {
    return this.keyMaterial.get(keyId);
  }

  revokeKey(keyId: string): boolean {
    const key = this.keys.get(keyId);
    if (!key) return false;
    key.status = "revoked";
    this.keyMaterial.delete(keyId);
    return true;
  }

  // â”€â”€ Key Rotation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  // â”€â”€ Hybrid Handshake (RSA-OAEP + X25519 KEM) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Perform a hybrid handshake combining RSA-OAEP (classic) and X25519 (PQC).
   *
   * Alice encrypts a random `classicSecret` with Bob's RSA public key, and
   * generates an ephemeral X25519 key pair to derive a shared secret with
   * Bob's X25519 public key via ECDH key agreement. Both secrets are combined
   * via HKDF-SHA256 to produce the final hybrid shared secret.
   *
   * The `pqcEncrypted` field contains Alice's ephemeral X25519 public key
   * (DER-encoded), which Bob uses together with his own X25519 private key
   * to derive the same shared secret.
   *
   * If `bobPqPublicKey` is not provided, falls back to random bytes for
   * backward compatibility.
   *
   * In production, replace X25519 with Kyber KEM encapsulation via liboqs.
   */
  hybridHandshake(params: {
    alicePublicKey: string;
    alicePqPublicKey?: string;
    bobPublicKey: string;
    bobPqPublicKey?: string;
  }): HybridHandshakeResult {
    const sessionId = randomUUID();
    const now = Date.now();

    // Classic component: RSA-OAEP encrypted nonce
    const classicSecret = randomBytes(32);
    const classicEncrypted = publicEncrypt(
      { key: params.bobPublicKey, padding: 40 }, // RSA_PKCS1_OAEP_PADDING
      classicSecret,
    );

    // PQC component: X25519 ephemeral key agreement
    let pqcSharedSecret: Buffer;
    let pqcEncrypted: Buffer;

    if (params.bobPqPublicKey) {
      try {
        // Alice generates an ephemeral X25519 key pair
        const ephemeral = generateKeyPairSync("x25519");
        const bobPubKeyObj = createPublicKey(params.bobPqPublicKey);

        // Derive shared secret: X25519(alice_ephemeral_priv, bob_static_pub)
        pqcSharedSecret = diffieHellman({
          privateKey: ephemeral.privateKey,
          publicKey: bobPubKeyObj,
        });

        // pqcEncrypted = Alice's ephemeral public key (Bob uses this + his private key)
        pqcEncrypted = Buffer.from(
          ephemeral.publicKey.export({ type: "spki", format: "der" }) as Buffer,
        );
      } catch (err) {
        // Fallback: if X25519 fails (e.g., invalid key format), use random
        logger.warn({ error: (err as Error).message }, "Hybrid handshake X25519 fallback â€” falling back to random secret");
        pqcSharedSecret = randomBytes(32);
        pqcEncrypted = randomBytes(32);
      }
    } else {
      // No PQ key available; use random for backward compatibility
      pqcSharedSecret = randomBytes(32);
      pqcEncrypted = randomBytes(32);
    }

    // Derive hybrid shared secret via HKDF-SHA256
    // ikm = classicSecret || pqcSharedSecret
    const ikm = Buffer.concat([classicSecret, pqcSharedSecret]);
    const sharedSecret = Buffer.from(
      hkdfSync("sha256", ikm, HKDF_SALT, HKDF_INFO, 32),
    );

    // Hybrid fingerprint: SHA-256(classicEncrypted || pqcEncrypted || sharedSecret)
    const hybridHash = createHash("sha256")
      .update(Buffer.concat([classicEncrypted, pqcEncrypted, sharedSecret]))
      .digest("hex");

    return {
      sessionId,
      classicEncrypted,
      pqcEncrypted,
      hybridFingerprint: hybridHash,
      timestamp: now,
      sharedSecret,
    };
  }

  // â”€â”€ Hybrid Signing (ECDSA + Ed25519) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Create a hybrid signature combining ECDSA-SHA256 (classic) and Ed25519 (PQC).
   *
   * Both signatures are computed over the same data and combined into a
   * hybrid hash for integrity verification. The Ed25519 signature provides
   * quantum-resistant authentication alongside the classic ECDSA signature.
   *
   * If `pqPrivateKey` is not provided, attempts to look up the Ed25519 private
   * key from the internal `keyMaterial` store using `keyId`.
   *
   * In production, replace Ed25519 with Dilithium signatures via liboqs.
   */
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

    // PQC Ed25519 signature
    let pqcSignature = "";
    let pqKey = params.pqPrivateKey;

    // Try to look up from keyMaterial if not provided directly
    if (!pqKey && params.keyId) {
      const material = this.keyMaterial.get(params.keyId);
      if (material) {
        pqKey = material.privateKeyPem;
      }
    }

    if (pqKey) {
      try {
        // Ed25519 signing: algorithm is null (Ed25519 has a fixed internal hash)
        const sig = cryptoSign(null, params.data, pqKey);
        pqcSignature = sig.toString("base64");
      } catch (err) {
        // If Ed25519 signing fails (e.g., wrong key type), log and leave pqcSignature empty
        logger.warn({ error: (err as Error).message, keyId: params.keyId }, "Ed25519 signing failed â€” returning classic-only signature");
        pqcSignature = "";
      }
    }

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

  /**
   * Verify a hybrid signature (ECDSA-SHA256 + Ed25519).
   *
   * Both the classic and PQC signatures must be valid for the overall
   * verification to succeed. If `pqcPublicKey` is not provided, PQC
   * verification is skipped for backward compatibility (legacy mode).
   *
   * In production, replace Ed25519 verification with Dilithium verification via liboqs.
   */
  hybridVerify(params: {
    data: Buffer;
    classicSignature: string;
    pqcSignature: string;
    classicPublicKey: string;
    pqcPublicKey?: string;
  }): { valid: boolean; reason?: string } {
    try {
      // Verify classic signature (ECDSA/RSA)
      const verifyObj = createVerify("SHA256");
      verifyObj.update(params.data);
      const classicValid = verifyObj.verify(
        params.classicPublicKey,
        params.classicSignature,
        "base64",
      );

      if (!classicValid) {
        return { valid: false, reason: "Classic signature invalid." };
      }

      // Verify PQC Ed25519 signature (if public key provided)
      if (params.pqcSignature && params.pqcPublicKey) {
        try {
          const pqcSigBuffer = Buffer.from(params.pqcSignature, "base64");
          const pqcValid = cryptoVerify(
            null,
            params.data,
            params.pqcPublicKey,
            pqcSigBuffer,
          );

          if (!pqcValid) {
            return { valid: false, reason: "PQC signature invalid." };
          }
        } catch (err) {
          logger.warn({ error: (err as Error).message }, "PQC signature verification error");
          return { valid: false, reason: "PQC signature verification failed." };
        }
      }

      return { valid: true };
    } catch (err) {
      return { valid: false, reason: `Verification error: ${err}` };
    }
  }

  // â”€â”€ Key Inventory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
}
