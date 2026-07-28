/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState, useEffect } from "react";

/**
 * Returns true after `delayMs` milliseconds, useful for showing
 * "taking longer than expected..." messages without flickering.
 *
 * Resets when `isLoading` transitions from false → true.
 */
export function useLoadingTimeout(isLoading: boolean, delayMs = 5000): boolean {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTimedOut(false);
      return;
    }
    const timer = setTimeout(() => setTimedOut(true), delayMs);
    return () => clearTimeout(timer);
  }, [isLoading, delayMs]);

  return timedOut;
}
