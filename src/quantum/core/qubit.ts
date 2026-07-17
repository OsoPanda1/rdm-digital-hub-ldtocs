export type Complex = [number, number]

export function add(a: Complex, b: Complex): Complex {
  return [a[0] + b[0], a[1] + b[1]]
}

export function sub(a: Complex, b: Complex): Complex {
  return [a[0] - b[0], a[1] - b[1]]
}

export function mul(a: Complex, b: Complex): Complex {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]
}

export function scale(c: Complex, s: number): Complex {
  return [c[0] * s, c[1] * s]
}

export function conj(c: Complex): Complex {
  return [c[0], -c[1]]
}

export function modSq(c: Complex): number {
  return c[0] * c[0] + c[1] * c[1]
}

export function matMul(m: Complex[][], v: Complex[]): Complex[] {
  return m.map((row) =>
    row.reduce((sum, val, j) => add(sum, mul(val, v[j])), [0, 0] as Complex),
  )
}

export function tensorProduct(a: Complex[], b: Complex[]): Complex[] {
  const result: Complex[] = []
  for (const ca of a) {
    for (const cb of b) {
      result.push(mul(ca, cb))
    }
  }
  return result
}

export function kronN(...vectors: Complex[][]): Complex[] {
  const one: Complex = [1, 0]
  return vectors.reduce((acc, v) => tensorProduct(acc, v), [one])
}

export const ZERO: Complex[] = [[1, 0], [0, 0]]
export const ONE: Complex[] = [[0, 0], [1, 0]]

export function qubitBra(alpha?: Complex, beta?: Complex): Complex[] {
  const a = alpha ?? [1, 0]
  const b = beta ?? [0, 0]
  const mag = Math.sqrt(modSq(a) + modSq(b))
  if (mag === 0) return [[1, 0], [0, 0]]
  return [scale(a, 1 / mag), scale(b, 1 / mag)]
}

export function measure(amplitudes: Complex[]): { outcome: number; amplitude: Complex } {
  const probs = amplitudes.map(modSq)
  const totalProb = probs.reduce((a, b) => a + b, 0)
  const r = Math.random() * totalProb
  let cumulative = 0
  for (let i = 0; i < probs.length; i++) {
    cumulative += probs[i]
    if (r <= cumulative) return { outcome: i, amplitude: amplitudes[i] }
  }
  return { outcome: amplitudes.length - 1, amplitude: amplitudes[amplitudes.length - 1] }
}

export function blochSphere(amplitudes: Complex[]): { theta: number; phi: number; x: number; y: number; z: number } {
  const [alpha, beta] = amplitudes
  const theta = 2 * Math.acos(Math.sqrt(modSq(alpha)))
  const phi = Math.atan2(beta[1], beta[0]) - Math.atan2(alpha[1], alpha[0])
  return {
    theta,
    phi,
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta),
  }
}

export function densityMatrix(amplitudes: Complex[]): Complex[][] {
  const n = amplitudes.length
  const rho: Complex[][] = []
  for (let i = 0; i < n; i++) {
    rho[i] = []
    for (let j = 0; j < n; j++) {
      rho[i][j] = mul(amplitudes[i], conj(amplitudes[j]))
    }
  }
  return rho
}

export function partialTrace(rho: Complex[][], keepQubits: number, totalQubits: number): Complex[][] {
  const dim = 1 << totalQubits
  const keepDim = 1 << keepQubits
  const traceDim = dim / keepDim
  const result: Complex[][] = Array.from({ length: keepDim }, () =>
    Array.from({ length: keepDim }, () => [0, 0] as Complex),
  )
  for (let i = 0; i < keepDim; i++) {
    for (let j = 0; j < keepDim; j++) {
      for (let k = 0; k < traceDim; k++) {
        const I = i + k * keepDim
        const J = j + k * keepDim
        result[i][j] = add(result[i][j], rho[I][J])
      }
    }
  }
  return result
}

export function vonNeumannEntropy(rho: Complex[][]): number {
  const vals = eigvals2x2(rho)
  let entropy = 0
  for (const v of vals) {
    if (v > 0) entropy -= v * Math.log2(v)
  }
  return entropy
}

function eigvals2x2(rho: Complex[][]): number[] {
  const a = rho[0][0][0]
  const d = rho[1][1][0]
  const bc = rho[0][1][0] * rho[1][0][0] - rho[0][1][1] * rho[1][0][1]
  const trace = a + d
  const det = a * d - bc
  const disc = Math.sqrt(Math.max(0, trace * trace - 4 * det))
  return [(trace + disc) / 2, (trace - disc) / 2]
}

export function traceDistance(rho: Complex[][], sigma: Complex[][]): number {
  const n = rho.length
  const diff: Complex[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => sub(rho[i][j], sigma[i][j])),
  )
  const vals = eigvals2x2(diff)
  return 0.5 * vals.reduce((a, b) => a + Math.abs(b), 0)
}
