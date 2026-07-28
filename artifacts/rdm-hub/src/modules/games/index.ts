/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
export { default as MemoryGame } from "./MemoryGame";
export { default as TriviaGame } from "./TriviaGame";

export const GAMES_LIST = [
  { id: "memory", name: "Memoria Minera", component: "MemoryGame", status: "active" as const, icon: "🧠" },
  { id: "trivia", name: "Trivia RDM", component: "TriviaGame", status: "active" as const, icon: "❓" },
  { id: "sudoku", name: "Sudoku Colonial", component: null, status: "coming-soon" as const, icon: "🔢" },
  { id: "puzzle", name: "Rompecabezas del Malacate", component: null, status: "coming-soon" as const, icon: "🧩" },
];
