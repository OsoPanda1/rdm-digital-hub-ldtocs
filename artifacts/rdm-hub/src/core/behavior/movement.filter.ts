/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
export class MovementFilter {
  private lastSpeed = 0;

  constructor(private alpha = 0.3) {}

  update(rawSpeed: number) {
    this.lastSpeed = this.alpha * rawSpeed + (1 - this.alpha) * this.lastSpeed;
    return this.lastSpeed;
  }

  getAlpha() {
    return this.alpha;
  }
}
