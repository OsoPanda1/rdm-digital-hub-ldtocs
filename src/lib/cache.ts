const store = new Map<string, { value: unknown; expiry: number }>();

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const entry = store.get(key);
    if (!entry) return null;
    if (entry.expiry > 0 && Date.now() > entry.expiry) {
      store.delete(key);
      return null;
    }
    return entry.value as T;
  },

  async set(key: string, value: unknown, ttlMs: number = 30000): Promise<void> {
    store.set(key, { value, expiry: Date.now() + ttlMs });
  },

  async del(key: string): Promise<void> {
    store.delete(key);
  },

  async clear(): Promise<void> {
    store.clear();
  },
};
