/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// src/data/atlas/cancionero.ts
// LÃ­rica de Asentamiento Urbanâ€‘Minero â€” CapÃ­tulo II del DOCUMENTO MAESTRO INTERCONECTADO DE SOBERANÃA DIGITAL
// Obra: "De la Tocada al CantÃ³n"
// DirecciÃ³n: Edwin Oswaldo Castillo Trejo (Anubis VillaseÃ±or)
// ParÃ¡metros tÃ©cnicos: 4/4 sincopado, 95 BPM, Si menor natural (Bmin)
// InstrumentaciÃ³n: requinto acÃºstico doble cuerda, tololoche percutido, caja de ritmos digital, charcheo metÃ¡lico sÃ­ncrono
// FunciÃ³n sistÃ©mica: calibraciÃ³n del motor de anÃ¡lisis de Isabella AI ante jerga territorial y ritmos urbanosâ€‘mineros
// Almacenamiento: stems en bucket Supabase con control CIVIL_CORE_

export interface SeccionLetra {
  id: string;
  titulo: string;
  versos: string[];
  entidades?: string[];
}

export interface Cancion {
  id: string;
  titulo: string;
  director: string;
  compas: string;
  bpm: number;
  escala: string;
  instrumentacion: string[];
  secciones: SeccionLetra[];
  metadatos: Record<string, string>;
}

export const deLaTocadaAlCanton: Cancion = {
  id: "cancion-001",
  titulo: "De la Tocada al CantÃ³n",
  director: "Edwin Oswaldo Castillo Trejo (Anubis VillaseÃ±or)",
  compas: "4/4 sincopado estricto",
  bpm: 95,
  escala: "Si menor natural (Bmin)",
  instrumentacion: [
    "Requinto acÃºstico de doble cuerda",
    "Tololoche percutido de baja frecuencia",
    "Caja de ritmos digital de alta respuesta transitoria",
    "Charcheo metÃ¡lico sÃ­ncrono",
  ],
  secciones: [
    {
      id: "intro",
      titulo: "IntroducciÃ³n â€” Llamado Serrano",
      versos: [
        "Requinto afina en la niebla del cerro",
        "Tololoche retumba en el callejÃ³n",
        "Caja de ritmos marca el pulso del hierro",
        "Charcheo anuncia la revoluciÃ³n",
      ],
      entidades: [],
    },
    {
      id: "verso-1",
      titulo: "Verso I â€” CrÃ³nica de Cantina",
      versos: [
        "HabrÃ¡ un Chuco Bolio esta noche en el pueblo",
        "JosÃ© Roa pregunta cÃ³mo estÃ¡ la raza",
        "Ciro HernÃ¡ndez advierte: cuida el cielo",
        "Que el frÃ­o serrano los huesos traspasa",
        "Amalia anda suelta en el viento minero",
        "Conrado Arista no entiende el momento",
      ],
      entidades: ["Chuco Bolio", "JosÃ© Roa", "Ciro HernÃ¡ndez", "Amalia", "Conrado Arista"],
    },
    {
      id: "coro",
      titulo: "Coro â€” De la Tocada al CantÃ³n",
      versos: [
        "De la tocada al cantÃ³n, cantÃ³n",
        "PÃ¡nfilo Soto me llama, es mi rincÃ³n",
        "Con mi RamÃ³n HernÃ¡ndez voy de vuelta",
        "Lucha Tejeda me espera en la puerta",
        "Y si me tardo, Pepe TerÃ¡n me despierta",
      ],
      entidades: ["PÃ¡nfilo Soto", "RamÃ³n HernÃ¡ndez", "Lucha Tejeda", "Pepe TerÃ¡n"],
    },
    {
      id: "verso-2",
      titulo: "Verso II â€” Barrio y Polvo",
      versos: [
        "RamÃ³n Razo respiro del Valle que viene",
        "Polvo y asfalto, memoria que tiene",
        "NicolÃ¡s Ordaz se voltea en la esquina",
        "No sea que la traiciÃ³n se encamina",
        "Narciso Trejo se hace menso en la sombra",
        "Mundo Oliver todo aturdido se asombra",
      ],
      entidades: ["RamÃ³n Razo", "NicolÃ¡s Ordaz", "Narciso Trejo", "Mundo Oliver"],
    },
    {
      id: "coro-2",
      titulo: "Coro II â€” Retorno al CantÃ³n",
      versos: [
        "De la tocada al cantÃ³n, cantÃ³n",
        "PÃ¡nfilo Soto me llama, es mi rincÃ³n",
        "Refugio Fragoso dice: no pasarÃ¡ nada",
        "Pero Roberto Arista ya llegÃ³ avanzada",
        "Pompero Rivera alborota la manada",
      ],
      entidades: ["PÃ¡nfilo Soto", "Refugio Fragoso", "Roberto Arista", "Pompero Rivera"],
    },
    {
      id: "puente",
      titulo: "Puente â€” El Finfonazo",
      versos: [
        "NicolÃ¡s Tejeda, Ã©chate un trago",
        "Padre Heredia quema el Ãºltimo rezago",
        "Domingo Rivera, cuida no te caiga",
        "Que el cerro estÃ¡ oscuro y la niebla desgaiga",
      ],
      entidades: ["NicolÃ¡s Tejeda", "Padre Heredia", "Domingo Rivera"],
    },
    {
      id: "outro",
      titulo: "Outro â€” Niebla y Silencio",
      versos: [
        "El requinto se apaga en la bruma del alba",
        "Tololoche calla, descansa el cantÃ³n",
        "La caja de ritmos su Ãºltimo palpitar",
        "Charcheo se duerme en el viejo callejÃ³n",
        "MaÃ±ana serÃ¡ otro Chuco Bolio",
        "Otra vuelta al sol del mineral",
      ],
      entidades: ["Chuco Bolio"],
    },
  ],
  metadatos: {
    track_id: "tocada-canton-v1",
    genero: "Son minero / Cumbia serrana",
    duracion_estimada: "4:30",
    estado: "composiciÃ³n abierta â€” letra canÃ³nica",
    funcion_sistemica: "calibraciÃ³n de Isabella AI ante jerga territorial y ritmos urbanosâ€‘mineros",
  },
};

export const cancionero: Cancion[] = [deLaTocadaAlCanton];
