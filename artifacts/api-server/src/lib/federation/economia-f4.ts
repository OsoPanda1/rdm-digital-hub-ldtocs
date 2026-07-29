/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// F4 â€” Economía Local
// Transacciones territoriales, plusvalía local, BookPI ledger
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface RdmTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  type: "purchase" | "donation" | "exchange" | "reward";
  territory: string;
  createdAt: string;
  ledgerHash: string;
}

export interface EconomiaF4 {
  createTransaction(data: Omit<RdmTransaction, "id" | "createdAt" | "ledgerHash">): Promise<RdmTransaction>;
  getTransactionsByUser(userId: string, limit?: number): Promise<RdmTransaction[]>;
  getTerritoryLedger(territory: string, limit?: number): Promise<RdmTransaction[]>;
  calculatePlusvalia(territory: string): Promise<{ totalVolume: number; uniqueUsers: number; avgTransaction: number }>;
  stats(): Promise<{ totalTransactions: number; totalVolume: number; byType: Record<string, number> }>;
}

function hashTx(data: string): string {
  let h = 0;
  for (let i = 0; i < data.length; i++) h = ((h << 5) - h + data.charCodeAt(i)) | 0;
  return `tx-hash:${Math.abs(h).toString(16).padStart(8, "0")}`;
}

export function createEconomiaF4(): EconomiaF4 {
  const transactions: RdmTransaction[] = [];

  return {
    async createTransaction(data) {
      const tx: RdmTransaction = {
        ...data,
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        ledgerHash: hashTx(`${data.from}:${data.to}:${data.amount}:${Date.now()}`),
      };
      transactions.push(tx);
      return tx;
    },

    async getTransactionsByUser(userId, limit = 20) {
      return transactions.filter((t) => t.from === userId || t.to === userId).slice(-limit);
    },

    async getTerritoryLedger(territory, limit = 50) {
      return transactions.filter((t) => t.territory === territory).slice(-limit);
    },

    async calculatePlusvalia(territory) {
      const txs = transactions.filter((t) => t.territory === territory);
      const users = new Set(txs.flatMap((t) => [t.from, t.to]));
      const totalVolume = txs.reduce((sum, t) => sum + t.amount, 0);
      return {
        totalVolume,
        uniqueUsers: users.size,
        avgTransaction: txs.length > 0 ? totalVolume / txs.length : 0,
      };
    },

    async stats() {
      const byType: Record<string, number> = {};
      let totalVolume = 0;
      for (const t of transactions) {
        byType[t.type] = (byType[t.type] ?? 0) + 1;
        totalVolume += t.amount;
      }
      return { totalTransactions: transactions.length, totalVolume, byType };
    },
  };
}
