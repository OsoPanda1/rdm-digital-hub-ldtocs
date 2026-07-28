/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// ============================================================================
// TAMV — Economy Store: TC, MSR, TAMV balances + 20/30/50 Phoenix rule
// Backend sync, transaction history, localStorage persistence
// ============================================================================
import { create } from "zustand";

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const STORAGE_KEY = "rdm-economy-state";

export type CurrencyType = "TC" | "MSR" | "TAMV";
export type TxType = "credit" | "debit" | "stake" | "reward" | "donation" | "transfer";

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  currency: CurrencyType;
  description: string;
  timestamp: Date;
  msrHash?: string;
}

export interface EconomyState {
  tcBalance: number;
  msrBalance: number;
  tamvBalance: number;
  stakedAmount: number;
  transactions: Transaction[];
  recentTransactions: Transaction[];
  phoenixFund: number;
  infraFund: number;
  reserveFund: number;
  isLoading: boolean;
  lastSynced: Date | null;
  error: string | null;

  addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => void;
  updateBalances: (tc: number, msr: number, tamv: number) => void;
  setStakedAmount: (amount: number) => void;
  distributeFunds: (profit: number) => void;
  syncBalances: () => Promise<void>;
  getTransactions: (currency?: CurrencyType, limit?: number) => Transaction[];
  getBalance: (currency: CurrencyType) => number;
  getTotalValue: () => number;
  getTransactionSummary: () => { totalIn: number; totalOut: number; netChange: number };
  transfer: (from: CurrencyType, to: CurrencyType, amount: number) => boolean;
  fundDistribution: () => { tc: number; msr: number; tamv: number; tcPct: number; msrPct: number; tamvPct: number };
}

interface PersistedState {
  tcBalance: number;
  msrBalance: number;
  tamvBalance: number;
  stakedAmount: number;
  transactions: Transaction[];
  phoenixFund: number;
  infraFund: number;
  reserveFund: number;
}

function loadPersistedState(): PersistedState | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.transactions) {
      parsed.transactions = parsed.transactions.map((t: Transaction) => ({
        ...t,
        timestamp: new Date(t.timestamp),
      }));
    }
    return parsed;
  } catch {
    return null;
  }
}

function persistState(state: Partial<PersistedState>) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be full or unavailable
  }
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "mock-1", type: "reward", amount: 500, currency: "TC", description: "Ingreso por membresía Premium", timestamp: new Date(Date.now() - 86400000 * 5) },
  { id: "mock-2", type: "debit", amount: -50, currency: "TC", description: "Compra en Pastes El Portal", timestamp: new Date(Date.now() - 86400000 * 3) },
  { id: "mock-3", type: "reward", amount: 200, currency: "MSR", description: "Recompensa por racha de 7 días", timestamp: new Date(Date.now() - 86400000 * 2) },
  { id: "mock-4", type: "donation", amount: 1000, currency: "TAMV", description: "Donación recibida", timestamp: new Date(Date.now() - 86400000 * 1) },
  { id: "mock-5", type: "credit", amount: 100, currency: "TC", description: "Publicación destacada en comunidad", timestamp: new Date(Date.now() - 3600000 * 12) },
  { id: "mock-6", type: "transfer", amount: -200, currency: "TC", description: "Intercambio TC → MSR", timestamp: new Date(Date.now() - 3600000 * 6) },
];

const initialPersisted = loadPersistedState();

export const useEconomyStore = create<EconomyState>((set, get) => ({
  tcBalance: initialPersisted?.tcBalance ?? 100,
  msrBalance: initialPersisted?.msrBalance ?? 0,
  tamvBalance: initialPersisted?.tamvBalance ?? 0,
  stakedAmount: initialPersisted?.stakedAmount ?? 0,
  transactions: initialPersisted?.transactions ?? MOCK_TRANSACTIONS,
  recentTransactions: initialPersisted?.transactions?.slice(0, 10) ?? MOCK_TRANSACTIONS.slice(0, 10),
  phoenixFund: initialPersisted?.phoenixFund ?? 0,
  infraFund: initialPersisted?.infraFund ?? 0,
  reserveFund: initialPersisted?.reserveFund ?? 0,
  isLoading: false,
  lastSynced: null,
  error: null,

  addTransaction: (tx) => {
    const newTx: Transaction = {
      ...tx,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    set((s) => {
      const transactions = [newTx, ...s.transactions].slice(0, 100);
      const recentTransactions = transactions.slice(0, 10);
      const newState = { transactions, recentTransactions };
      persistState({ ...newState, tcBalance: s.tcBalance, msrBalance: s.msrBalance, tamvBalance: s.tamvBalance, stakedAmount: s.stakedAmount, phoenixFund: s.phoenixFund, infraFund: s.infraFund, reserveFund: s.reserveFund });
      return newState;
    });
  },

  updateBalances: (tcBalance, msrBalance, tamvBalance) => {
    set({ tcBalance, msrBalance, tamvBalance });
    const s = get();
    persistState({ tcBalance, msrBalance, tamvBalance, stakedAmount: s.stakedAmount, transactions: s.transactions, phoenixFund: s.phoenixFund, infraFund: s.infraFund, reserveFund: s.reserveFund });
  },

  setStakedAmount: (stakedAmount) => {
    set({ stakedAmount });
    const s = get();
    persistState({ tcBalance: s.tcBalance, msrBalance: s.msrBalance, tamvBalance: s.tamvBalance, stakedAmount, transactions: s.transactions, phoenixFund: s.phoenixFund, infraFund: s.infraFund, reserveFund: s.reserveFund });
  },

  distributeFunds: (profit) =>
    set((s) => {
      const phoenixFund = s.phoenixFund + profit * 0.2;
      const infraFund = s.infraFund + profit * 0.3;
      const reserveFund = s.reserveFund + profit * 0.5;
      persistState({ tcBalance: s.tcBalance, msrBalance: s.msrBalance, tamvBalance: s.tamvBalance, stakedAmount: s.stakedAmount, transactions: s.transactions, phoenixFund, infraFund, reserveFund });
      return { phoenixFund, infraFund, reserveFund };
    }),

  syncBalances: async () => {
    set({ isLoading: true, error: null });
    try {
      const urls = [`${API_BASE}/v1/yun/status`, `${API_BASE}/v1/economy/status`];
      for (const url of urls) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
          if (res.ok) {
            const json = await res.json();
            const data = json.data || json;
            if (data.tcBalance !== undefined || data.tc !== undefined) {
              const tcBalance = data.tcBalance ?? data.tc ?? get().tcBalance;
              const msrBalance = data.msrBalance ?? data.msr ?? get().msrBalance;
              const tamvBalance = data.tamvBalance ?? data.tamv ?? get().tamvBalance;
              set({ tcBalance, msrBalance, tamvBalance, isLoading: false, lastSynced: new Date() });
              persistState({ tcBalance, msrBalance, tamvBalance, stakedAmount: get().stakedAmount, transactions: get().transactions, phoenixFund: get().phoenixFund, infraFund: get().infraFund, reserveFund: get().reserveFund });
              return;
            }
          }
        } catch {
          continue;
        }
      }
      set({ isLoading: false, lastSynced: new Date() });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : "Sync failed" });
    }
  },

  getTransactions: (currency, limit) => {
    const { transactions } = get();
    let filtered = transactions;
    if (currency) filtered = filtered.filter((t) => t.currency === currency);
    if (limit) filtered = filtered.slice(0, limit);
    return filtered;
  },

  getBalance: (currency) => {
    const s = get();
    switch (currency) {
      case "TC": return s.tcBalance;
      case "MSR": return s.msrBalance;
      case "TAMV": return s.tamvBalance;
      default: return 0;
    }
  },

  getTotalValue: () => {
    const s = get();
    return s.tcBalance + s.msrBalance * 2 + s.tamvBalance * 0.5;
  },

  getTransactionSummary: () => {
    const { transactions } = get();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const recent = transactions.filter((t) => new Date(t.timestamp) >= thirtyDaysAgo);
    let totalIn = 0;
    let totalOut = 0;
    for (const t of recent) {
      if (t.amount > 0) totalIn += t.amount;
      else totalOut += Math.abs(t.amount);
    }
    return { totalIn, totalOut, netChange: totalIn - totalOut };
  },

  transfer: (from, to, amount) => {
    if (amount <= 0 || from === to) return false;
    const s = get();
    const fromBalance = s.getBalance(from);
    if (fromBalance < amount) return false;

    const fromKey = `${from.toLowerCase()}Balance` as "tcBalance" | "msrBalance" | "tamvBalance";
    const toKey = `${to.toLowerCase()}Balance` as "tcBalance" | "msrBalance" | "tamvBalance";
    const fromVal = s[fromKey];
    const toVal = s[toKey];

    set({
      [fromKey]: fromVal - amount,
      [toKey]: toVal + amount,
    } as Partial<EconomyState>);

    s.addTransaction({ type: "transfer", amount: -amount, currency: from, description: `Transferencia ${from} → ${to}` });
    s.addTransaction({ type: "transfer", amount, currency: to, description: `Recepción ${from} → ${to}` });
    return true;
  },

  fundDistribution: () => {
    const s = get();
    const total = s.getTotalValue();
    return {
      tc: total * 0.2,
      msr: total * 0.3,
      tamv: total * 0.5,
      tcPct: 20,
      msrPct: 30,
      tamvPct: 50,
    };
  },
}));
