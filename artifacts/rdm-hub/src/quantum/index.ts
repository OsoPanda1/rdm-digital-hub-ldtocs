/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// src/quantum/index.ts â€” Quantum module barrel exports

export {
  PostQuantumCryptoV2,
  getPQC,
  initPQC,
} from "./pqc"

export {
  PennylaneBridge,
  getPennylaneBridge,
} from "./pennylane-bridge"

export type {
  CircuitTemplateName,
} from "./pennylane-bridge"
