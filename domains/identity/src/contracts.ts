export type Profile = {
  id: string;
  email: string;
  username?: string;
  role: "user" | "business" | "admin" | "federation";
  federationId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type AuthSession = {
  sessionId: string;
  userId: string;
  token: string;
  expiresAt: string;
};
