import { z } from "zod"

const greetingSchema = z.object({ name: z.string().min(1) })

export async function getGreeting(input: { name: string }): Promise<{ greeting: string; mode: string }> {
  const data = greetingSchema.parse(input)
  return { greeting: `Hello, ${data.name}!`, mode: import.meta.env.MODE ?? "unknown" }
}
