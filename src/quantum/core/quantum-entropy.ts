import { modSq, Complex } from "./qubit"
import { QuantumCircuit } from "./circuit"
import { getGate, applyGate } from "./gates"

export function quantumRandomBytes(length: number): Uint8Array {
  const bits = length * 8
  const nQubits = Math.ceil(Math.log2(bits)) + 1
  const circuit = new QuantumCircuit(nQubits)
  for (let q = 0; q < nQubits; q++) circuit.h(q)
  circuit.run()
  const result = circuit.measureAll(bits)
  const bytes = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    let byte = 0
    for (let b = 0; b < 8; b++) {
      const idx = i * 8 + b
      if (idx < result.outcomes.length) {
        byte |= (result.outcomes[idx] & 1) << b
      }
    }
    bytes[i] = byte
  }
  return bytes
}

export function quantumIdempotencyKey(): string {
  const bytes = quantumRandomBytes(16)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function quantumFingerprint(data: string): string {
  const nQubits = Math.ceil(Math.log2(data.length * 8)) + 1
  const circuit = new QuantumCircuit(nQubits)
  for (let q = 0; q < nQubits; q++) circuit.h(q)
  for (let i = 0; i < data.length; i++) {
    const byte = data.charCodeAt(i)
    for (let b = 0; b < 8; b++) {
      if (byte & (1 << b)) {
        const target = (i * 8 + b) % nQubits
        circuit.x(target)
      }
    }
  }
  circuit.run()
  const result = circuit.measureAll(256)

  const hashBytes = new Uint8Array(32)
  for (let i = 0; i < 32; i++) {
    let byte = 0
    for (let b = 0; b < 8; b++) {
      const idx = i * 8 + b
      if (idx < result.outcomes.length) {
        byte |= (result.outcomes[idx] & 1) << b
      }
    }
    hashBytes[i] = byte
  }

  return Array.from(hashBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function bb84Qubits(bitString: string): { bases: number[]; qubits: number[] } {
  const n = bitString.length
  const circuits = new QuantumCircuit(1)
  const bases: number[] = []
  const qubits: number[] = []

  for (let i = 0; i < n; i++) {
    const base = Math.random() < 0.5 ? 0 : 1
    circuits.reset()
    if (base === 1) circuits.h(0)
    if (bitString[i] === "1") circuits.x(0)
    circuits.run()
    const meas = circuits.measureAll(1)
    bases.push(base)
    qubits.push(meas.outcomes[0] & 1)
  }
  return { bases, qubits }
}

export function errorCorrectRepetition3(values: number[]): number {
  if (values.length < 3) return values[0] ?? 0
  const sum = values.slice(0, 3).reduce((a, b) => a + b, 0)
  return sum >= 2 ? 1 : 0
}

export function shor9QubitEncode(bit: number): number[] {
  const c1 = errorCorrectRepetition3([bit, bit, bit])
  const c2 = errorCorrectRepetition3([c1, c1, c1])
  const c3 = errorCorrectRepetition3([c2, c2, c2])
  return [c1, c2, c3]
}

export function shor9QubitDecode(encoded: number[]): number {
  if (encoded.length < 9) return encoded[0] ?? 0
  const g1 = errorCorrectRepetition3(encoded.slice(0, 3))
  const g2 = errorCorrectRepetition3(encoded.slice(3, 6))
  const g3 = errorCorrectRepetition3(encoded.slice(6, 9))
  return errorCorrectRepetition3([g1, g2, g3])
}
