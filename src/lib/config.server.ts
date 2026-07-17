export function getServerConfig() {
  return { nodeEnv: import.meta.env.MODE }
}
