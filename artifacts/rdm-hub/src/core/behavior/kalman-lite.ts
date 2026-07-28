/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
export interface KalmanLite {
  reset(seed?: number): void;
  update(value: number): number;
}

export class PassthroughKalmanLite implements KalmanLite {
  private estimate = 0;

  reset(seed = 0) {
    this.estimate = seed;
  }

  update(value: number) {
    this.estimate = value;
    return this.estimate;
  }
}
