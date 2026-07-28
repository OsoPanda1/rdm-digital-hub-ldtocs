/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
export interface IClock {
  now(): number;
}

export class Clock implements IClock {
  now() {
    return Date.now();
  }
}

export class FixedClock implements IClock {
  constructor(private current: number) {}

  now() {
    return this.current;
  }

  advance(ms: number) {
    this.current += ms;
  }
}
