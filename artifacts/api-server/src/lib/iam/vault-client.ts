/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// IAM â€” Vault Client
// Gestión de secretos tipo HashiCorp Vault (local fallback)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface VaultSecret {
  path: string;
  value: string;
  version: number;
  createdAt: string;
}

export interface VaultClient {
  write(path: string, value: string): Promise<VaultSecret>;
  read(path: string): Promise<VaultSecret | null>;
  delete(path: string): Promise<boolean>;
  list(prefix?: string): Promise<VaultSecret[]>;
  rotate(path: string, newValue: string): Promise<VaultSecret>;
  stats(): { totalSecrets: number };
}

export function createVaultClient(): VaultClient {
  const secrets = new Map<string, VaultSecret>();

  return {
    async write(path, value) {
      const existing = secrets.get(path);
      const secret: VaultSecret = {
        path,
        value,
        version: (existing?.version ?? 0) + 1,
        createdAt: new Date().toISOString(),
      };
      secrets.set(path, secret);
      return secret;
    },

    async read(path) { return secrets.get(path) ?? null; },

    async delete(path) { return secrets.delete(path); },

    async list(prefix = "") {
      return Array.from(secrets.values()).filter((s) => s.path.startsWith(prefix));
    },

    async rotate(path, newValue) {
      const existing = secrets.get(path);
      const secret: VaultSecret = {
        path,
        value: newValue,
        version: (existing?.version ?? 0) + 1,
        createdAt: new Date().toISOString(),
      };
      secrets.set(path, secret);
      return secret;
    },

    stats: () => ({ totalSecrets: secrets.size }),
  };
}
