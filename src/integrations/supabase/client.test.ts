import { describe, expect, it } from "vitest";
import { hasSupabaseConfig, supabase } from "./client";

describe("Supabase client bootstrap", () => {
  it("requires both public configuration values", () => {
    expect(hasSupabaseConfig({})).toBe(false);
    expect(hasSupabaseConfig({ VITE_SUPABASE_URL: "https://example.supabase.co" })).toBe(false);
    expect(
      hasSupabaseConfig({
        VITE_SUPABASE_URL: "https://example.supabase.co",
        VITE_SUPABASE_PUBLISHABLE_KEY: "public-key",
      }),
    ).toBe(true);
  });

  it("allows safe client access when configuration is absent", () => {
    expect(() => supabase.auth).not.toThrow();
  });
});
