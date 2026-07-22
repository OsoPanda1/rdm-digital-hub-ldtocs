// Lovable-specific auth removed — not available on Replit.
// Auth is handled via Supabase directly.

export const lovable = {
  auth: {
    signInWithOAuth: async (_provider: string, _opts?: unknown) => {
      return { error: new Error('Lovable OAuth not available on Replit. Use Supabase auth directly.') };
    },
  },
};
