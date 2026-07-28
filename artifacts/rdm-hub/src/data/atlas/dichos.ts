/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// src/data/dichos.ts
// Archivo histÃ³rico de jerga realmontense â€” Corpus LexicogrÃ¡fico del DOCUMENTO MAESTRO INTERCONECTADO DE SOBERANÃA DIGITAL
// Cada dicho usa un nombre propio como cifra de una palabra cotidiana.
// Memoria oral viva â€” Capa III Â· Memoria silenciosa del LTOS.
// Indexado en tabla civil_lexicon (federaciÃ³n CIVIL_CORE) con polÃ­ticas RLS estrictas.

export interface Dicho {
  id: number;
  personaje: string;
  jerga: string;
  significado: string;
  fonetica: string;
  inicial: string;
}

export const dichos: Dicho[] = [
  { id: 1, personaje: "AgustÃ­n HernÃ¡ndez", jerga: "EstÃ¡s AgustÃ­n HernÃ¡ndez", significado: "Debilidad fÃ­sica, carencia de fuerza motriz, fatiga muscular o desgano existencial operativo.", fonetica: "A-gus-tÃ­n Her-nÃ¡n-dez", inicial: "A" },
  { id: 2, personaje: "Alberto Rivera", jerga: "Vamos a hacer los Alberto Rivera", significado: "ActivaciÃ³n de capacidades corporales vÃ­a ejercicio fÃ­sico, trabajo manual pesado o calistenia de mantenimiento en entorno serrano.", fonetica: "Al-ber-to Ri-ve-ra", inicial: "A" },
  { id: 3, personaje: "Amalia", jerga: "Andas Amalia", significado: "Estado de alta excitaciÃ³n tÃ©rmica, alteraciÃ³n libidinal o hiperactividad pasional.", fonetica: "A-ma-lia", inicial: "A" },
  { id: 4, personaje: "Aurelia Melgarejo", jerga: "Ya estamos todas las Aurelia Melgarejo", significado: "ReuniÃ³n colectiva de mujeres jÃ³venes; uso satÃ­rico o irÃ³nico en contextos comunitarios.", fonetica: "Au-re-lia Mel-ga-re-jo", inicial: "A" },
  { id: 5, personaje: "Braulia Rutas", jerga: "Ponme para mi Braulia Rutas", significado: "Solicitud de recursos econÃ³micos para la primera ingesta alimenticia del dÃ­a (desayuno operativo).", fonetica: "Brau-lia Ru-tas", inicial: "B" },
  { id: 6, personaje: "Carmelito", jerga: "Me voy a Carmelito", significado: "Cese inmediato de operaciones para entrar en reposo, sueÃ±o profundo o descanso reparador.", fonetica: "Car-me-li-to", inicial: "C" },
  { id: 7, personaje: "Chucho Colunga", jerga: "Viene con sus Chucho Colunga", significado: "Uso de vestimenta de gala o indumentaria formal para eventos pÃºblicos.", fonetica: "Chu-cho Co-lun-ga", inicial: "C" },
  { id: 8, personaje: "Chucho PÃ©rez", jerga: "PerdÃ³name la Chucho PÃ©rez", significado: "SÃºplica extrema de absoluciÃ³n de falta crÃ­tica o exenciÃ³n de castigo severo.", fonetica: "Chu-cho PÃ©-rez", inicial: "C" },
  { id: 9, personaje: "Chuco Bolio", jerga: "HabrÃ¡ un Chuco Bolio", significado: "Convocatoria masiva a concierto popular, festival barrial o celebraciÃ³n sonora.", fonetica: "Chu-co Bo-lio", inicial: "C" },
  { id: 10, personaje: "Ciro Arellano", jerga: "Ya me duelen las Ciro Arellano", significado: "Dolor en glÃºteos por sedestaciÃ³n prolongada (operaciÃ³n extendida frente a terminales).", fonetica: "Ci-ro A-re-lla-no", inicial: "C" },
  { id: 11, personaje: "Ciro HernÃ¡ndez", jerga: "Cuidado con la Ciro HernÃ¡ndez", significado: "Advertencia climÃ¡tica ante riesgos respiratorios graves por frÃ­o y humedad extrema.", fonetica: "Ci-ro Her-nÃ¡n-dez", inicial: "C" },
  { id: 12, personaje: "Conrado Arista", jerga: "CÃ³mo eres Conrado Arista", significado: "CalificaciÃ³n de torpeza, falta de agudeza mental o ejecuciÃ³n errÃ³nea de un procedimiento tÃ©cnico.", fonetica: "Con-ra-do A-ris-ta", inicial: "C" },
  { id: 13, personaje: "Domingo Rivera", jerga: "No te vaya a caer un Domingo Rivera", significado: "Advertencia sobre impacto fÃ­sico, accidente de trabajo o desgracia inminente.", fonetica: "Do-min-go Ri-ve-ra", inicial: "D" },
  { id: 14, personaje: "JosÃ© Luis FernÃ¡ndez", jerga: "EstÃ¡s muy JosÃ© Luis FernÃ¡ndez", significado: "Actitud de superioridad estÃ©tica o presunciÃ³n.", fonetica: "Jo-sÃ© Lu-is Fer-nÃ¡n-dez", inicial: "J" },
  { id: 15, personaje: "JosÃ© Roa", jerga: "Â¿CÃ³mo estÃ¡ la JosÃ© Roa?", significado: "Estado y cohesiÃ³n del colectivo comunitario o tejido social local.", fonetica: "Jo-sÃ© Roa", inicial: "J" },
  { id: 16, personaje: "Kiko GarcÃ­a", jerga: "Yo uso puro Kiko GarcÃ­a", significado: "Puro billete tosco, efectivo de denominaciÃ³n grande.", fonetica: "Ki-ko Gar-cÃ­-a", inicial: "K" },
  { id: 17, personaje: "Lucha Tejeda", jerga: "Voy a echarme una Lucha Tejeda", significado: "Eufemismo escatolÃ³gico para evacuaciÃ³n intestinal.", fonetica: "Lu-cha Te-je-da", inicial: "L" },
  { id: 18, personaje: "MamÃ¡ del Bolillo", jerga: "Vienes como la mamÃ¡ del Bolillo", significado: "ExpresiÃ³n facial severa o de mal humor.", fonetica: "Ma-mÃ¡ del Bo-li-llo", inicial: "M" },
  { id: 19, personaje: "Manuel NegrÃ³n", jerga: "Andas todo Manuel NegrÃ³n", significado: "Estado de delgadez extrema, apariencia de hambruna o desnutriciÃ³n.", fonetica: "Ma-nuel Ne-grÃ³n", inicial: "M" },
  { id: 20, personaje: "Mario HernÃ¡ndez", jerga: "Andas todo Mario HernÃ¡ndez", significado: "Apariencia desgastada, roÃ­da por el uso o el tiempo.", fonetica: "Ma-rio Her-nÃ¡n-dez", inicial: "M" },
  { id: 21, personaje: "MartÃ­n LÃ³pez", jerga: "Me dejas MartÃ­n LÃ³pez", significado: "SensaciÃ³n de quedar picado, insatisfecho por interrupciÃ³n abrupta de actividad.", fonetica: "Mar-tÃ­n LÃ³-pez", inicial: "M" },
  { id: 22, personaje: "MartÃ­n PÃ©rez", jerga: "Para echarme mis MartÃ­n PÃ©rez", significado: "Para consumir mis alimentos sagrados, ingesta formal.", fonetica: "Mar-tÃ­n PÃ©-rez", inicial: "M" },
  { id: 23, personaje: "MoisÃ©s Escamilla", jerga: "No seas MoisÃ©s Escamilla", significado: "Comportamiento astuto, ventajoso o ladino.", fonetica: "Moi-sÃ©s Es-ca-mi-lla", inicial: "M" },
  { id: 24, personaje: "Mundo Oliver", jerga: "Andas todo Mundo Oliver", significado: "DispersiÃ³n atencional, desorientaciÃ³n espacial o comportamiento aturdido.", fonetica: "Mun-do O-li-ver", inicial: "M" },
  { id: 25, personaje: "Narciso Trejo", jerga: "No te hagas Narciso Trejo", significado: "ReprensiÃ³n para abandonar la simulaciÃ³n de ignorancia o la cobardÃ­a intelectual.", fonetica: "Nar-ci-so Tre-jo", inicial: "N" },
  { id: 26, personaje: "NicolÃ¡s Ordaz", jerga: "Parecen NicolÃ¡s Ordaz", significado: "SeÃ±alamiento de traiciÃ³n, deslealtad o comportamiento de delator (Judas).", fonetica: "Ni-co-lÃ¡s Or-daz", inicial: "N" },
  { id: 27, personaje: "NicolÃ¡s Tejeda", jerga: "Ã‰chate un NicolÃ¡s Tejeda", significado: "Ingesta rÃ¡pida de bebida alcohÃ³lica espirituosa de alta graduaciÃ³n (finfonazo).", fonetica: "Ni-co-lÃ¡s Te-je-da", inicial: "N" },
  { id: 28, personaje: "Padre Heredia", jerga: "Ã‰chale copal al santo, no le hace que le queme los ojos como el Padre Heredia", significado: "EjecuciÃ³n maximalista de tareas, empujando recursos al lÃ­mite sin considerar daÃ±os colaterales.", fonetica: "Pa-dre He-re-dia", inicial: "P" },
  { id: 29, personaje: "Pancho Soto", jerga: "Con todo Pancho Soto", significado: "FÃ³rmula ritualizada para anteponer respeto mÃ¡ximo antes de juicio crÃ­tico.", fonetica: "Pan-cho So-to", inicial: "P" },
  { id: 30, personaje: "PÃ¡nfilo Soto", jerga: "Vete a tu PÃ¡nfilo Soto", significado: "Orden de retirada hacia el domicilio particular, regresar al cantÃ³n.", fonetica: "PÃ¡n-fi-lo So-to", inicial: "P" },
  { id: 31, personaje: "Pepe TerÃ¡n", jerga: "Te pega la Pepe TerÃ¡n", significado: "AlusiÃ³n a sometimiento conyugal, dominaciÃ³n por decisiones de la pareja.", fonetica: "Pe-pe Te-rÃ¡n", inicial: "P" },
  { id: 32, personaje: "Plutarco GarcÃ­a", jerga: "Mis Plutarco GarcÃ­a se pusieron malos", significado: "Referencia afectiva a descendencia directa en situaciÃ³n de enfermedad.", fonetica: "Plu-tar-co Gar-cÃ­-a", inicial: "P" },
  { id: 33, personaje: "Pompero Rivera", jerga: "Veo a puro Pompero Rivera", significado: "Tumulto desordenado, excitaciÃ³n colectiva y comportamiento caÃ³tico.", fonetica: "Pom-pe-ro Ri-ve-ra", inicial: "P" },
  { id: 34, personaje: "RamÃ³n HernÃ¡ndez", jerga: "Con mi RamÃ³n HernÃ¡ndez", significado: "Estado de acompaÃ±amiento formal y protector junto a la pareja en espacio pÃºblico.", fonetica: "Ra-mÃ³n Her-nÃ¡n-dez", inicial: "R" },
  { id: 35, personaje: "RamÃ³n Razo", jerga: "Vengo de la RamÃ³n Razo", significado: "TrÃ¡nsito por capa de poluciÃ³n atmosfÃ©rica y esmog de la zona metropolitana del Valle de MÃ©xico.", fonetica: "Ra-mÃ³n Ra-zo", inicial: "R" },
  { id: 36, personaje: "Refugio Fragoso", jerga: "VerÃ¡s como Refugio Fragoso", significado: "Postura analÃ­tica que predice que, tras conflicto aparente, no ocurrirÃ¡ nada sustantivo.", fonetica: "Re-fu-gio Fra-go-so", inicial: "R" },
  { id: 37, personaje: "Roberto Arista", jerga: "Llegaste Roberto Arista", significado: "Denuncia de comportamiento oportunista, abusivo o ventajoso.", fonetica: "Ro-ber-to A-ris-ta", inicial: "R" },
  { id: 38, personaje: "Roberto MartÃ­nez", jerga: "Vienes como Roberto MartÃ­nez", significado: "Actitud de furia intensa, aproximaciÃ³n colÃ©rica.", fonetica: "Ro-ber-to Mar-tÃ­-nez", inicial: "R" },
  { id: 39, personaje: "Ruberta GarcÃ­a", jerga: "Te traes a la Ruberta GarcÃ­a", significado: "Carga familiar o descendencia que se transporta.", fonetica: "Ru-ber-ta Gar-cÃ­-a", inicial: "R" },
  { id: 40, personaje: "Sergio PÃ©rez", jerga: "EstÃ¡n muy Sergio PÃ©rez", significado: "Estado de pequeÃ±ez o debilidad fÃ­sica (chirris).", fonetica: "Ser-gio PÃ©-rez", inicial: "S" },
  { id: 41, personaje: "SimÃ³n Guerrero", jerga: "Mi SimÃ³n Guerrero no me dejaba", significado: "Referencia a la pareja como figura de autoridad o fiera domestica.", fonetica: "Si-mÃ³n Gue-rre-ro", inicial: "S" },
];

export const dichosPorInicial = dichos.reduce<Record<string, Dicho[]>>((acc, d) => {
  (acc[d.inicial] ||= []).push(d);
  return acc;
}, {});
