import { Complex, add, mul, modSq } from "./qubit"

export type QuantumGate = {
  name: string
  matrix: Complex[][]
  qubits: number
  paramCount: number
}

const I2: Complex[][] = [[[1, 0], [0, 0]], [[0, 0], [1, 0]]]

const H: Complex[][] = [
  [[1 / Math.SQRT2, 0], [1 / Math.SQRT2, 0]],
  [[1 / Math.SQRT2, 0], [-1 / Math.SQRT2, 0]],
]

const X: Complex[][] = [[[0, 0], [1, 0]], [[1, 0], [0, 0]]]
const Y: Complex[][] = [[[0, 0], [0, -1]], [[0, 1], [0, 0]]]
const Z: Complex[][] = [[[1, 0], [0, 0]], [[0, 0], [-1, 0]]]

const S: Complex[][] = [[[1, 0], [0, 0]], [[0, 0], [0, 1]]]
const COS_PI_4 = 0.7071067811865476
const SIN_PI_4 = 0.7071067811865476
const T: Complex[][] = [[[1, 0], [0, 0]], [[0, 0], [COS_PI_4, SIN_PI_4]]]

function Rx(theta: number): Complex[][] {
  const c = Math.cos(theta / 2)
  const s = Math.sin(theta / 2)
  return [[[c, 0], [0, -s]], [[0, -s], [c, 0]]]
}

function Ry(theta: number): Complex[][] {
  const c = Math.cos(theta / 2)
  const s = Math.sin(theta / 2)
  return [[[c, 0], [-s, 0]], [[s, 0], [c, 0]]]
}

function Rz(theta: number): Complex[][] {
  const c = Math.cos(theta / 2)
  const s = Math.sin(theta / 2)
  return [[[c, -s], [0, 0]], [[0, 0], [c, s]]]
}

function Phase(theta: number): Complex[][] {
  return [[[1, 0], [0, 0]], [[0, 0], [Math.cos(theta), Math.sin(theta)]]]
}

export function applyGate(gate: QuantumGate, state: Complex[], targets: number[], params?: number[]): Complex[] {
  if (gate.qubits === 1) {
    return applySingleQubitGate(gate.matrix, state, targets[0])
  }
  if (gate.qubits === 2) {
    return applyTwoQubitGate(gate, state, targets[0], targets[1], params)
  }
  throw new Error(`Unsupported gate qubit count: ${gate.qubits}`)
}

function applySingleQubitGate(gateMatrix: Complex[][], state: Complex[], target: number): Complex[] {
  const nQubits = Math.log2(state.length)
  const result: Complex[] = new Array(state.length).fill([0, 0])
  for (let i = 0; i < state.length; i++) {
    if (modSq(state[i]) === 0) continue
    const bit = (i >> target) & 1
    const pair = bit === 0 ? i : i ^ (1 << target)
    const other = bit === 0 ? i ^ (1 << target) : i
    if (bit === 0) {
      result[i] = add(result[i], mul(gateMatrix[0][0], state[i]))
      result[other] = add(result[other], mul(gateMatrix[1][0] ?? [0, 0], state[i]))
    } else {
      result[other] = add(result[other], mul(gateMatrix[0][1] ?? [0, 0], state[i]))
      result[i] = add(result[i], mul(gateMatrix[1][1] ?? [0, 0], state[i]))
    }
  }
  return result
}

function applyTwoQubitGate(gate: QuantumGate, state: Complex[], ctrl: number, target: number, params?: number[]): Complex[] {
  if (gate.name === "CNOT") {
    const result = [...state]
    for (let i = 0; i < state.length; i++) {
      const ctrlBit = (i >> ctrl) & 1
      if (ctrlBit === 1) {
        const targetBit = (i >> target) & 1
        const flipped = targetBit === 0 ? i | (1 << target) : i ^ (1 << target)
        result[flipped] = state[i]
        result[i] = [0, 0]
      }
    }
    return result
  }
  if (gate.name === "SWAP") {
    const result = [...state]
    for (let i = 0; i < state.length; i++) {
      const bit1 = (i >> ctrl) & 1
      const bit2 = (i >> target) & 1
      if (bit1 !== bit2) {
        const swapped = i ^ (1 << ctrl) ^ (1 << target)
        result[swapped] = state[i]
        result[i] = [0, 0]
      }
    }
    return result
  }
  if (gate.name === "CZ") {
    const result = [...state]
    for (let i = 0; i < state.length; i++) {
      const ctrlBit = (i >> ctrl) & 1
      const targetBit = (i >> target) & 1
      if (ctrlBit === 1 && targetBit === 1) {
        result[i] = mul(state[i], [-1, 0])
      }
    }
    return result
  }
  if (gate.name === "CRx" || gate.name === "CRy" || gate.name === "CRz") {
    const theta = params?.[0] ?? Math.PI / 4
    const result = [...state]
    for (let i = 0; i < state.length; i++) {
      const ctrlBit = (i >> ctrl) & 1
      if (ctrlBit === 1) {
        const targetBit = (i >> target) & 1
        const pair = targetBit === 0 ? i | (1 << target) : i ^ (1 << target)
        const other = targetBit === 0 ? i ^ (1 << target) : i
        const rGate = gate.name === "CRx" ? Rx(theta) : gate.name === "CRy" ? Ry(theta) : Rz(theta)
        if (targetBit === 0) {
          result[i] = mul(rGate[0][0], state[i])
          result[other] = add(result[other], mul(rGate[1][0] ?? [0, 0], state[i]))
        } else {
          result[other] = add(result[other], mul(rGate[0][1] ?? [0, 0], state[i]))
          result[i] = mul(rGate[1][1] ?? [0, 0], state[i])
        }
      }
    }
    return result
  }
  if (gate.name === "BellState" || gate.name === "GHZ_2") {
    let s = applySingleQubitGate(H, state, ctrl)
    s = applyTwoQubitGate({ name: "CNOT", matrix: [], qubits: 2, paramCount: 0 }, s, ctrl, target)
    return s
  }
  return state
}

export const GATES: Record<string, QuantumGate> = {
  I: { name: "I", matrix: I2, qubits: 1, paramCount: 0 },
  H: { name: "H", matrix: H, qubits: 1, paramCount: 0 },
  X: { name: "X", matrix: X, qubits: 1, paramCount: 0 },
  Y: { name: "Y", matrix: Y, qubits: 1, paramCount: 0 },
  Z: { name: "Z", matrix: Z, qubits: 1, paramCount: 0 },
  S: { name: "S", matrix: S, qubits: 1, paramCount: 0 },
  T: { name: "T", matrix: T, qubits: 1, paramCount: 0 },
  Rx: { name: "Rx", matrix: Rx(0), qubits: 1, paramCount: 1 },
  Ry: { name: "Ry", matrix: Ry(0), qubits: 1, paramCount: 1 },
  Rz: { name: "Rz", matrix: Rz(0), qubits: 1, paramCount: 1 },
  Phase: { name: "Phase", matrix: Phase(0), qubits: 1, paramCount: 1 },
  CNOT: { name: "CNOT", matrix: [], qubits: 2, paramCount: 0 },
  CZ: { name: "CZ", matrix: [], qubits: 2, paramCount: 0 },
  SWAP: { name: "SWAP", matrix: [], qubits: 2, paramCount: 0 },
  CRx: { name: "CRx", matrix: [], qubits: 2, paramCount: 1 },
  CRy: { name: "CRy", matrix: [], qubits: 2, paramCount: 1 },
  CRz: { name: "CRz", matrix: [], qubits: 2, paramCount: 1 },
  BellState: { name: "BellState", matrix: [], qubits: 2, paramCount: 0 },
  GHZ_2: { name: "GHZ_2", matrix: [], qubits: 2, paramCount: 0 },
}

export function getGate(name: string): QuantumGate {
  const gate = GATES[name]
  if (!gate) throw new Error(`Unknown gate: ${name}`)
  return gate
}
