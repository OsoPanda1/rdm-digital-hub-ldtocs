export interface Route {
  id: string
  name: string
  description: string
  category: string
  duration: string
  distance: number
}

export const routes: Route[] = [
  { id: "r1", name: "Ruta del Paste", description: "Recorrido gastronómico por las pasteurías tradicionales del centro. Incluye degustación en 5 pasteurías.", category: "gastronomia", duration: "4 horas", distance: 2.5 },
  { id: "r2", name: "Ruta Minera", description: "Historia viva de las minas de Real del Monte: Mina de Acosta, Purísima y San Juan.", category: "historia", duration: "6 horas", distance: 5.0 },
  { id: "r3", name: "Ruta Cultural", description: "Museos, galerías y patrimonio arquitectónico del centro histórico.", category: "cultura", duration: "3 horas", distance: 2.0 },
  { id: "r4", name: "Ruta Ecoturística", description: "Prismas Basálticos, Peña del Aire y Mirador del Hiloche. Senderismo y naturaleza.", category: "naturaleza", duration: "8 horas", distance: 12.0 },
  { id: "r5", name: "Ruta de las Leyendas", description: "Recorrido nocturno por callejones escuchando las leyendas del pueblo minero.", category: "turismo", duration: "2 horas", distance: 1.5 },
  { id: "r6", name: "Ruta de la Cera", description: "Talleres artesanales de velas y cerería tradicional.", category: "tradicion", duration: "3 horas", distance: 1.0 },
  { id: "r7", name: "Ruta del Pulque", description: "Degustación de pulque artesanal en haciendas pulqueras.", category: "gastronomia", duration: "5 horas", distance: 15.0 },
  { id: "r8", name: "Ruta Fotográfica", description: "Los mejores miradores y puntos fotográficos del Pueblo Mágico.", category: "turismo", duration: "4 horas", distance: 3.0 },
]

export const historiaEntries = [
  { year: "1550", event: "Descubrimiento de vetas de plata en la región" },
  { year: "1727", event: "Fundación del Real del Monte como real de minas" },
  { year: "1743", event: "Construcción de la Parroquia de Nuestra Señora de la Asunción" },
  { year: "1824", event: "Llegada de la Compañía Británica de Minas — 200 mineros de Cornualles" },
  { year: "1862", event: "Construcción del Panteón Inglés en el Cerro del Hiloche" },
  { year: "1900", event: "Auge de la producción de plata — Real del Monte entre los mayores productores del mundo" },
  { year: "1947", event: "Nacionalización de las minas — creación de la Compañía de Real del Monte y Pachuca" },
  { year: "1985", event: "Cierre definitivo de la Mina de Acosta" },
  { year: "2004", event: "Declarado Pueblo Mágico por la Secretaría de Turismo" },
  { year: "2024", event: "Lanzamiento del RDM Digital Hub — Nodo Cero Isabella" },
]
