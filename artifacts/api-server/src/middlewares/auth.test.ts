import { describe, it, expect } from "vitest";
import { verifySupabaseJwt, type JwtPayload } from "./auth";

describe("verifySupabaseJwt", () => {
  const secret = "test-supabase-jwt-secret";

  function createJwt(payload: Partial<JwtPayload>, secretOverride?: string): string {
    const header = { alg: "HS256", typ: "JWT" };
    const fullPayload = {
      sub: "user-123",
      email: "test@example.com",
      aud: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      iss: "https://example.supabase.co",
      ...payload,
    };

    const base64Url = (data: object) =>
      Buffer.from(JSON.stringify(data))
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const signingInput = `${base64Url(header)}.${base64Url(fullPayload)}`;
    const sig = require("crypto")
      .createHmac("sha256", secretOverride ?? secret)
      .update(signingInput)
      .digest("base64url");

    return `${signingInput}.${sig}`;
  }

  it("accepts valid JWT with correct signature", () => {
    const token = createJwt({ sub: "user-42" });
    const result = verifySupabaseJwt(token, secret);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.payload.sub).toBe("user-42");
      expect(result.payload.email).toBe("test@example.com");
    }
  });

  it("rejects JWT with wrong signature", () => {
    const token = createJwt({ sub: "user-42" }, "wrong-secret");
    const result = verifySupabaseJwt(token, secret);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain("Invalid JWT signature");
    }
  });

  it("rejects expired JWT", () => {
    const token = createJwt({ sub: "user-42", exp: Math.floor(Date.now() / 1000) - 3600 });
    const result = verifySupabaseJwt(token, secret);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain("expired");
    }
  });

  it("rejects JWT with wrong algorithm", () => {
    const header = { alg: "none", typ: "JWT" };
    const payload = { sub: "user-42" };
    const base64Url = (data: object) =>
      Buffer.from(JSON.stringify(data))
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    const token = `${base64Url(header)}.${base64Url(payload)}.`;
    const result = verifySupabaseJwt(token, secret);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain("algorithm");
    }
  });

  it("rejects malformed JWT (not 3 parts)", () => {
    const result = verifySupabaseJwt("not.a.valid.jwt.token", secret);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain("structure");
    }
  });

  it("rejects JWT with invalid base64 payload", () => {
    const header = { alg: "HS256", typ: "JWT" };
    const base64Url = (data: object) =>
      Buffer.from(JSON.stringify(data))
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    const token = `${base64Url(header)}.!!!invalid-base64!!!.somesig`;
    const result = verifySupabaseJwt(token, secret);
    expect(result.valid).toBe(false);
  });
});
