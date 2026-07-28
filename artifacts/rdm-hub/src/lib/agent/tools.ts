/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// @ts-nocheck
import { tool } from "ai";
import { z } from "zod";

export const weatherTool = tool({
  description: "Get the weather in Real del Monte or any location (fahrenheit)",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }) => {
    const temperature = Math.round(Math.random() * (90 - 32) + 32);
    const conditions = ["soleado", "nublado", "lluvia ligera", "despejado"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    return { location, temperature, condition, units: "fahrenheit" };
  },
});

export const convertFahrenheitToCelsius = tool({
  description: "Convert a temperature in fahrenheit to celsius",
  inputSchema: z.object({
    temperature: z.number().describe("The temperature in fahrenheit to convert"),
  }),
  execute: async ({ temperature }) => {
    const celsius = Math.round((temperature - 32) * (5 / 9));
    return { celsius };
  },
});

export const rdmPlacesTool = tool({
  description: "Get information about tourist places in Real del Monte, Hidalgo",
  inputSchema: z.object({
    placeName: z.string().describe("The name of the place (e.g., 'Mina Acosta', 'PanteÃ³n InglÃ©s', 'Pastes')"),
  }),
  execute: async ({ placeName }) => {
    const places: Record<string, { desc: string; horario: string }> = {
      "mina acosta": {
        desc: "Mina histÃ³rica del siglo XVIII, actualmente museo de sitio con recorridos guiados",
        horario: "10:00-17:00 (cerrado lunes)",
      },
      "panteÃ³n inglÃ©s": {
        desc: "Cementerio del siglo XIX con tumbas de mineros ingleses, rodeado de leyendas",
        horario: "9:00-18:00",
      },
      pastes: {
        desc: "El paste es el platillo tÃ­pico de Real del Monte, herencia de la minerÃ­a inglesa",
        horario: "Disponible en pastelerÃ­as todo el dÃ­a",
      },
    };
    const key = placeName.toLowerCase();
    const info = places[key];
    if (!info) {
      return { found: false, message: `No tengo informaciÃ³n sobre "${placeName}"` };
    }
    return { found: true, name: placeName, ...info };
  },
});
