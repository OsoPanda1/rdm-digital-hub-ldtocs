import { z } from "zod";

const serverSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_NODE_ID: z.string().default("nd-0000"),
  NEXT_PUBLIC_NODE_NAME: z.string().default("Nodo Cero"),
});

function parseEnv() {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_NODE_ID: process.env.NEXT_PUBLIC_NODE_ID,
    NEXT_PUBLIC_NODE_NAME: process.env.NEXT_PUBLIC_NODE_NAME,
  });
  if (!parsed.success) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing env vars: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);
    }
    console.warn("Missing client env vars:", parsed.error.flatten().fieldErrors);
    return { NEXT_PUBLIC_SUPABASE_URL: "", NEXT_PUBLIC_SUPABASE_ANON_KEY: "", NEXT_PUBLIC_NODE_ID: "nd-0000", NEXT_PUBLIC_NODE_NAME: "Nodo Cero" };
  }
  return parsed.data;
}

export const env = parseEnv();

export function getServerEnv() {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    console.warn("Missing server env vars:", parsed.error.flatten().fieldErrors);
  }
  return parsed.data ?? {};
}
