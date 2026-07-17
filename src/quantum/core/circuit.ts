import { Complex, qubitBra, ZERO, ONE, kronN, measure, blochSphere, densityMatrix, partialTrace, traceDistance, vonNeumannEntropy } from "./qubit"
import { getGate, applyGate, GATES, QuantumGate } from "./gates"

export type GateOp = {
  name: string
  targets: number[]
  params?: number[]
}

export type MeasurementResult = {
  outcomes: number[]
  counts: Record<string, number>
  probabilities: number[]
  shots: number
}

export class QuantumCircuit {
  readonly numQubits: number
  private ops: GateOp[] = []
  private state: Complex[]

  constructor(numQubits: number) {
    this.numQubits = numQubits
    this.state = kronN(...Array(numQubits).fill(ZERO))
  }

  get depth(): number {
    return this.ops.length
  }

  gate(name: string, targets: number[], params?: number[]): this {
    this.assertTargets(targets)
    this.ops.push({ name, targets, params })
    return this
  }

  h(target: number): this { return this.gate("H", [target]) }
  x(target: number): this { return this.gate("X", [target]) }
  y(target: number): this { return this.gate("Y", [target]) }
  z(target: number): this { return this.gate("Z", [target]) }
  s(target: number): this { return this.gate("S", [target]) }
  t(target: number): this { return this.gate("T", [target]) }
  rx(target: number, theta: number): this { return this.gate("Rx", [target], [theta]) }
  ry(target: number, theta: number): this { return this.gate("Ry", [target], [theta]) }
  rz(target: number, theta: number): this { return this.gate("Rz", [target], [theta]) }
  cnot(control: number, target: number): this { return this.gate("CNOT", [control, target]) }
  cz(control: number, target: number): this { return this.gate("CZ", [control, target]) }
  swap(a: number, b: number): this { return this.gate("SWAP", [a, b]) }
  bell(a: number, b: number): this { return this.gate("BellState", [a, b]) }
  phase(target: number, theta: number): this { return this.gate("Phase", [target], [theta]) }

  toJSON(): { qubits: number; depth: number; gates: GateOp[] } {
    return { qubits: this.numQubits, depth: this.depth, gates: [...this.ops] }
  }

  run(): Complex[] {
    this.state = kronN(...Array(this.numQubits).fill(ZERO))
    for (const op of this.ops) {
      const gate = getGate(op.name)
      this.state = applyGate(gate, this.state, op.targets, op.params)
    }
    return this.state
  }

  reset(): void {
    this.state = kronN(...Array(this.numQubits).fill(ZERO))
    this.ops = []
  }

  getState(): Complex[] {
    return this.state
  }

  measureAll(shots: number = 1024): MeasurementResult {
    const probs = this.state.map((c) => c[0] * c[0] + c[1] * c[1])
    const totalProb = probs.reduce((a, b) => a + b, 0)
    const counts: Record<string, number> = {}
    const outcomes: number[] = []

    for (let s = 0; s < shots; s++) {
      let r = Math.random() * totalProb
      let cumulative = 0
      for (let i = 0; i < probs.length; i++) {
        cumulative += probs[i]
        if (r <= cumulative) {
          outcomes.push(i)
          const key = i.toString(2).padStart(this.numQubits, "0")
          counts[key] = (counts[key] ?? 0) + 1
          break
        }
      }
    }

    return {
      outcomes,
      counts,
      probabilities: probs.map((p) => p / totalProb),
      shots,
    }
  }

  computeBloch(qubitIndex: number): ReturnType<typeof blochSphere> {
    const rho = densityMatrix(this.state)
    const reduced = partialTrace(rho, qubitIndex, this.numQubits)
    const singleState = [reduced[0][0], reduced[0][1]] as Complex[]
    return blochSphere(singleState)
  }

  entropy(): number {
    const rho = densityMatrix(this.state)
    return vonNeumannEntropy(rho)
  }

  fidelity(other: Complex[]): number {
    const overlap = this.state.reduce((acc, c, i) => {
      return acc + c[0] * other[i][0] + c[1] * other[i][1]
    }, 0)
    return overlap * overlap
  }

  private assertTargets(targets: number[]): void {
    for (const t of targets) {
      if (t < 0 || t >= this.numQubits) {
        throw new Error(`Target qubit ${t} out of range (0-${this.numQubits - 1})`)
      }
    }
  }
}

export function hadamardTest(circuit: QuantumCircuit, targetQubit: number): number {
  circuit.reset()
  circuit.h(targetQubit)
  circuit.run()
  const state = circuit.getState()
  const prob1 = state.reduce((sum, c, i) => {
    const bit = (i >> targetQubit) & 1
    return sum + (bit === 1 ? c[0] * c[0] + c[1] * c[1] : 0)
  }, 0)
  circuit.reset()
  return 2 * prob1 - 1
}

export function randomCircuit(nQubits: number, depth: number): QuantumCircuit {
  const oneQubitGates = ["H", "X", "Y", "Z", "S", "T", "Rx", "Ry", "Rz"]
  const twoQubitGates = ["CNOT", "CZ", "SWAP"]
  const circuit = new QuantumCircuit(nQubits)
  for (let d = 0; d < depth; d++) {
    for (let q = 0; q < nQubits; q++) {
      if (Math.random() < 0.5) {
        const gName = oneQubitGates[Math.floor(Math.random() * oneQubitGates.length)]
        const params = GATES[gName]?.paramCount > 0 ? [Math.random() * 2 * Math.PI] : undefined
        circuit.gate(gName, [q], params)
      }
    }
    if (nQubits >= 2 && Math.random() < 0.3) {
      const ctrl = Math.floor(Math.random() * nQubits)
      let target = Math.floor(Math.random() * (nQubits - 1))
      if (target >= ctrl) target++
      const gName = twoQubitGates[Math.floor(Math.random() * twoQubitGates.length)]
      circuit.gate(gName, [ctrl, target])
    }
  }
  return circuit
}


