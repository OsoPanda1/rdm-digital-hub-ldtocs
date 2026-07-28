/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// F1 â€” Identidad Soberana / IAM
// PKCE/OIDC local, perfiles cÃ­vicos, roles
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface CitizenProfile {
  profileId: string;
  userId: string;
  displayName: string;
  roles: string[];
  trustLevel: number;
  territory: string;
  createdAt: string;
}

export interface RoleAssignment {
  role: "public" | "user" | "operator" | "admin" | "federation_auditor";
  grantedAt: string;
  grantedBy: string;
  expiresAt?: string;
}

export interface IdentityF1 {
  getProfile(userId: string): Promise<CitizenProfile | null>;
  createProfile(data: Omit<CitizenProfile, "profileId" | "createdAt">): Promise<CitizenProfile>;
  assignRole(userId: string, assignment: RoleAssignment): Promise<boolean>;
  verifyCredentials(userId: string): Promise<{ valid: boolean; roles: string[] }>;
  stats(): Promise<{ totalProfiles: number; byRole: Record<string, number> }>;
}

export function createIdentityF1(): IdentityF1 {
  const profiles = new Map<string, CitizenProfile>();
  const roles = new Map<string, RoleAssignment[]>();

  return {
    async getProfile(userId) { return profiles.get(userId) ?? null; },

    async createProfile(data) {
      const profile: CitizenProfile = {
        ...data,
        profileId: `fp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
      };
      profiles.set(data.userId, profile);
      return profile;
    },

    async assignRole(userId, assignment) {
      const existing = roles.get(userId) ?? [];
      existing.push(assignment);
      roles.set(userId, existing);
      const profile = profiles.get(userId);
      if (profile && !profile.roles.includes(assignment.role)) {
        profile.roles.push(assignment.role);
      }
      return true;
    },

    async verifyCredentials(userId) {
      const profile = profiles.get(userId);
      if (!profile) return { valid: false, roles: [] };
      const userRoles = roles.get(userId) ?? [];
      const activeRoles = userRoles
        .filter((r) => !r.expiresAt || new Date(r.expiresAt) > new Date())
        .map((r) => r.role);
      return { valid: activeRoles.length > 0 || profile.roles.includes("public"), roles: activeRoles };
    },

    async stats() {
      const byRole: Record<string, number> = {};
      for (const [, p] of profiles) for (const r of p.roles) byRole[r] = (byRole[r] ?? 0) + 1;
      return { totalProfiles: profiles.size, byRole };
    },
  };
}
