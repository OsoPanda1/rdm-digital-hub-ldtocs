import { z } from 'zod'

import { getServerConfig } from '../config.server'

const greetingInput = z.object({ name: z.string().min(1) })

export async function getGreeting(input: { data: unknown }) {
  const data = greetingInput.parse(input.data)
  const config = getServerConfig()
  return {
    greeting: `Hello, ${data.name}!`,
    mode: config.nodeEnv ?? 'unknown',
  }
}
