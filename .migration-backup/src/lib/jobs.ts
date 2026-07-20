const queue: Array<{ job: string; payload: unknown; delay: number; runAt: number }> = [];

export function enqueue(job: string, payload: unknown, delayMs: number = 0): void {
  queue.push({ job, payload, delay: delayMs, runAt: Date.now() + delayMs });
}

export function dequeue(): typeof queue[0] | undefined {
  const now = Date.now();
  const idx = queue.findIndex((item) => item.runAt <= now);
  if (idx === -1) return undefined;
  return queue.splice(idx, 1)[0];
}

export function queueSize(): number {
  return queue.length;
}

export function clearQueue(): void {
  queue.length = 0;
}
