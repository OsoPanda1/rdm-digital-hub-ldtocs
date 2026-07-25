// ────────────────────────────────────────────────────────────────
// IAM — Passkeys / WebAuthn
// Autenticación passwordless para admins y usuarios críticos
// ────────────────────────────────────────────────────────────────

export interface PasskeyCredential {
  credentialId: string;
  userId: string;
  publicKey: string;
  counter: number;
  createdAt: string;
}

export interface PasskeyChallenge {
  challengeId: string;
  userId: string;
  challenge: string;
  expiresAt: string;
}

export interface Passkeys {
  generateChallenge(userId: string): Promise<PasskeyChallenge>;
  registerCredential(userId: string, credential: Omit<PasskeyCredential, "credentialId" | "createdAt">): Promise<PasskeyCredential>;
  verifyCredential(credentialId: string): Promise<boolean>;
  listByUser(userId: string): Promise<PasskeyCredential[]>;
  stats(): Promise<{ totalCredentials: number; totalChallenges: number }>;
}

export function createPasskeys(): Passkeys {
  const credentials = new Map<string, PasskeyCredential>();
  const challenges = new Map<string, PasskeyChallenge>();
  let challengeCounter = 0;

  return {
    async generateChallenge(userId) {
      const challenge: PasskeyChallenge = {
        challengeId: `chal-${Date.now()}-${(challengeCounter++).toString(36)}`,
        userId,
        challenge: Buffer.from(`challenge-${userId}-${Date.now()}`).toString("base64url"),
        expiresAt: new Date(Date.now() + 300000).toISOString(),
      };
      challenges.set(challenge.challengeId, challenge);
      return challenge;
    },

    async registerCredential(userId, data) {
      const cred: PasskeyCredential = {
        ...data,
        credentialId: `cred-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
      };
      credentials.set(cred.credentialId, cred);
      return cred;
    },

    async verifyCredential(credentialId) {
      return credentials.has(credentialId);
    },

    async listByUser(userId) {
      return Array.from(credentials.values()).filter((c) => c.userId === userId);
    },

    async stats() { return { totalCredentials: credentials.size, totalChallenges: challenges.size }; },
  };
}
