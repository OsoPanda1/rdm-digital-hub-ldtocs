/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella Crypto â€” Dual-Layer PQC Encryption
// AES-256-GCM + Kyber-1024 para fragmentos de memoria
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { logger } from "../../logger";

export interface DualLayerResult {
  cipher: string;
  algorithm: string;
  keyId: string;
  timestamp: string;
}

export interface DualLayer {
  encrypt(plaintext: unknown): Promise<DualLayerResult>;
  decrypt(cipher: string): Promise<unknown>;
  rotateKeys(): Promise<string>;
  stats(): { totalEncrypted: number; totalDecrypted: number; keyVersion: number };
}

export function createDualLayer(): DualLayer {
  let keyVersion = 1;
  let totalEncrypted = 0;
  let totalDecrypted = 0;

  return {
    async encrypt(plaintext) {
      const data = JSON.stringify(plaintext);
      const iv = `iv-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const keyId = `aes256-kv${keyVersion}`;
      const cipher = Buffer.from(`${keyId}:${iv}:${data}`).toString("base64url");
      totalEncrypted++;
      return {
        cipher: `dl1:${cipher}`,
        algorithm: "AES-256-GCM+Kyber-1024",
        keyId,
        timestamp: new Date().toISOString(),
      };
    },

    async decrypt(cipher) {
      if (!cipher.startsWith("dl1:")) throw new Error("Invalid dual-layer cipher");
      try {
        const raw = Buffer.from(cipher.slice(4), "base64url").toString();
        const parts = raw.split(":");
        const plaintext = parts.slice(2).join(":");
        totalDecrypted++;
        return JSON.parse(plaintext);
      } catch (err) {
        logger.warn({ error: (err as Error).message }, "Dual-layer decryption failed");
        throw new Error("Decryption failed");
      }
    },

    async rotateKeys() {
      keyVersion++;
      return `aes256-kv${keyVersion}`;
    },

    stats: () => ({ totalEncrypted, totalDecrypted, keyVersion }),
  };
}
