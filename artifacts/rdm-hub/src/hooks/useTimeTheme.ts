/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
export type TimeTheme = "day" | "evening" | "night";

export function computeTimeTheme(date = new Date()): TimeTheme {
  const hour = date.getHours();

  if (hour >= 6 && hour < 17) {
    return "day";
  }

  if (hour >= 17 && hour < 21) {
    return "evening";
  }

  return "night";
}
