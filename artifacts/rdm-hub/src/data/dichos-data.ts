/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// ============================================================================
// RDM Digital OS â€” Dichos Personificados de Real del Monte
// 47 expresiones tradicionales del vocabulario minero realmontense
// Fuente: Archivo HistÃ³rico Municipal / quantum-system-tamv
// ============================================================================

export interface Dicho {
  id: string;
  personaje: string;
  texto: string;
  significado: string;
  jergaOriginal: string;
  categoria: DichoCategoria;
  likes: number;
}

export type DichoCategoria =
  | 'PERSONAJES'
  | 'BRINDIS'
  | 'HUMOR'
  | 'FAMILIA'
  | 'COMIDA_BEBIDA'
  | 'TRABAJO'
  | 'VIDA_COTIDIANA'
  | 'MINERIA';

export interface DichoCategoryMeta {
  id: string;
  label: string;
  icon: string;
}

export const DICHO_CATEGORIES: DichoCategoryMeta[] = [
  { id: 'all', label: 'Todos', icon: 'âœ¨' },
  { id: 'PERSONAJES', label: 'Personajes', icon: 'ðŸ‘¤' },
  { id: 'BRINDIS', label: 'Brindis', icon: 'ðŸ»' },
  { id: 'HUMOR', label: 'Humor', icon: 'ðŸ˜‚' },
  { id: 'FAMILIA', label: 'Familia', icon: 'ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦' },
  { id: 'COMIDA_BEBIDA', label: 'Comida y Bebida', icon: 'ðŸ½ï¸' },
  { id: 'TRABAJO', label: 'Trabajo', icon: 'â›ï¸' },
  { id: 'VIDA_COTIDIANA', label: 'Vida Cotidiana', icon: 'ðŸ ' },
  { id: 'MINERIA', label: 'MinerÃ­a', icon: 'ðŸ’Ž' },
];

export const DICHOS_COMPLETOS: Dicho[] = [
  { id: '1', personaje: 'AgustÃ­n HernÃ¡ndez', texto: 'EstÃ¡s AgustÃ­n HernÃ¡ndez', significado: 'EstÃ¡s dÃ©bil', jergaOriginal: 'EstÃ¡s AgustÃ­n HernÃ¡ndez', categoria: 'VIDA_COTIDIANA', likes: 156 },
  { id: '2', personaje: 'Alberto Rivera', texto: 'Vamos a hacer los Alberto Rivera', significado: 'Vamos a hacer los ejercicios', jergaOriginal: 'Vamos a hacer los Alberto Rivera', categoria: 'TRABAJO', likes: 89 },
  { id: '3', personaje: 'Amalia', texto: 'Andas Amalia', significado: 'Andas caliente', jergaOriginal: 'Andas Amalia', categoria: 'HUMOR', likes: 234 },
  { id: '4', personaje: 'Aurelia Melgarejo', texto: 'Ya estamos todas las Aurelia Melgarejo', significado: 'Ya estamos todas las muchachas (usado para viejitas)', jergaOriginal: 'Ya estamos todas las Aurelia Melgarejo', categoria: 'FAMILIA', likes: 178 },
  { id: '5', personaje: 'Braulia Rutas', texto: 'Ponme para mi Braulia Rutas', significado: 'Ponme para mi desayuno', jergaOriginal: 'Ponme para mi Braulia Rutas', categoria: 'COMIDA_BEBIDA', likes: 145 },
  { id: '6', personaje: 'Carmelito', texto: 'Me voy a Carmelito', significado: 'Me voy a descansar', jergaOriginal: 'Me voy a Carmelito', categoria: 'VIDA_COTIDIANA', likes: 198 },
  { id: '7', personaje: 'Cayetano MuÃ±oz', texto: 'Te voy a poner tu Cayetano MuÃ±oz', significado: 'Te voy a dar tu castigo', jergaOriginal: 'Te voy a poner tu Cayetano MuÃ±oz', categoria: 'HUMOR', likes: 267 },
  { id: '8', personaje: 'Chata Reyes', texto: 'Tienes cara de Chata Reyes', significado: 'Tienes cara de tonta', jergaOriginal: 'Tienes cara de Chata Reyes', categoria: 'HUMOR', likes: 134 },
  { id: '9', personaje: 'Conchita Rivera', texto: 'No seas Conchita Rivera', significado: 'No seas chismosa', jergaOriginal: 'No seas Conchita Rivera', categoria: 'PERSONAJES', likes: 312 },
  { id: '10', personaje: 'Crescencia GarcÃ­a', texto: 'Es como la Crescencia GarcÃ­a', significado: 'Es muy gritona', jergaOriginal: 'Es como la Crescencia GarcÃ­a', categoria: 'PERSONAJES', likes: 178 },
  { id: '11', personaje: 'Daniel Rivera', texto: 'No te hagas Daniel Rivera', significado: 'No te hagas tonto', jergaOriginal: 'No te hagas Daniel Rivera', categoria: 'HUMOR', likes: 289 },
  { id: '12', personaje: 'Dieguito', texto: 'No seas un Dieguito', significado: 'No seas llorÃ³n', jergaOriginal: 'No seas un Dieguito', categoria: 'FAMILIA', likes: 167 },
  { id: '13', personaje: 'Dolores TerÃ¡n', texto: 'Te andan las Dolores TerÃ¡n', significado: 'Te andan los espantos', jergaOriginal: 'Te andan las Dolores TerÃ¡n', categoria: 'PERSONAJES', likes: 245 },
  { id: '14', personaje: 'Don Victoriano', texto: 'No te creas Don Victoriano', significado: 'No te creas importante', jergaOriginal: 'No te creas Don Victoriano', categoria: 'PERSONAJES', likes: 198 },
  { id: '15', personaje: 'Eduviges TerÃ¡n', texto: 'Pareces Eduviges TerÃ¡n', significado: 'Pareces vieja (arrugada)', jergaOriginal: 'Pareces Eduviges TerÃ¡n', categoria: 'HUMOR', likes: 156 },
  { id: '16', personaje: 'Elena', texto: 'Te voy a mandar con tu Elena', significado: 'Te voy a mandar con tu mamÃ¡', jergaOriginal: 'Te voy a mandar con tu Elena', categoria: 'FAMILIA', likes: 187 },
  { id: '17', personaje: 'Eusebio Almaraz', texto: 'Pareces un Eusebio Almaraz', significado: 'Pareces un borracho', jergaOriginal: 'Pareces un Eusebio Almaraz', categoria: 'BRINDIS', likes: 234 },
  { id: '18', personaje: 'Federico GarcÃ­a', texto: 'Te fuiste como Federico GarcÃ­a', significado: 'Te fuiste sin pagar', jergaOriginal: 'Te fuiste como Federico GarcÃ­a', categoria: 'HUMOR', likes: 267 },
  { id: '19', personaje: 'Fernando DomÃ­nguez', texto: 'Me cayÃ³ como Fernando DomÃ­nguez', significado: 'Me cayÃ³ como patada', jergaOriginal: 'Me cayÃ³ como Fernando DomÃ­nguez', categoria: 'VIDA_COTIDIANA', likes: 145 },
  { id: '20', personaje: 'Gabriel HernÃ¡ndez', texto: 'Echarse un Gabriel HernÃ¡ndez', significado: 'Echarse una cerveza', jergaOriginal: 'Echarse un Gabriel HernÃ¡ndez', categoria: 'BRINDIS', likes: 298 },
  { id: '21', personaje: 'Guadalupe Rivera', texto: 'Eres una Guadalupe Rivera', significado: 'Eres una chiquillada', jergaOriginal: 'Eres una Guadalupe Rivera', categoria: 'FAMILIA', likes: 134 },
  { id: '22', personaje: 'Hermenegildo', texto: 'No me vengas con tus Hermenegildo', significado: 'No me vengas con tus cuentos', jergaOriginal: 'No me vengas con tus Hermenegildo', categoria: 'PERSONAJES', likes: 198 },
  { id: '23', personaje: 'Ignacio MuÃ±oz', texto: 'EstÃ¡s como Ignacio MuÃ±oz', significado: 'EstÃ¡s loco', jergaOriginal: 'EstÃ¡s como Ignacio MuÃ±oz', categoria: 'HUMOR', likes: 312 },
  { id: '24', personaje: 'Josefina PÃ©rez', texto: 'Eres una Josefina PÃ©rez', significado: 'Eres muy limpia (obsesiva)', jergaOriginal: 'Eres una Josefina PÃ©rez', categoria: 'PERSONAJES', likes: 145 },
  { id: '25', personaje: 'Juan HernÃ¡ndez', texto: 'AllÃ¡ va Juan HernÃ¡ndez', significado: 'AllÃ¡ va el borracho', jergaOriginal: 'AllÃ¡ va Juan HernÃ¡ndez', categoria: 'BRINDIS', likes: 178 },
  { id: '26', personaje: 'Juanita Rivera', texto: 'No seas una Juanita Rivera', significado: 'No seas coqueta', jergaOriginal: 'No seas una Juanita Rivera', categoria: 'PERSONAJES', likes: 267 },
  { id: '27', personaje: 'Leonardo GarcÃ­a', texto: 'Vas como Leonardo GarcÃ­a', significado: 'Vas muy rÃ¡pido', jergaOriginal: 'Vas como Leonardo GarcÃ­a', categoria: 'VIDA_COTIDIANA', likes: 134 },
  { id: '28', personaje: 'Lola MartÃ­nez', texto: 'No me hagas una Lola MartÃ­nez', significado: 'No me hagas un escÃ¡ndalo', jergaOriginal: 'No me hagas una Lola MartÃ­nez', categoria: 'PERSONAJES', likes: 289 },
  { id: '29', personaje: 'Manuel PÃ©rez', texto: 'Eres un Manuel PÃ©rez', significado: 'Eres un flojo', jergaOriginal: 'Eres un Manuel PÃ©rez', categoria: 'TRABAJO', likes: 198 },
  { id: '30', personaje: 'MarÃ­a GarcÃ­a', texto: 'Andas como MarÃ­a GarcÃ­a', significado: 'Andas de enamorada', jergaOriginal: 'Andas como MarÃ­a GarcÃ­a', categoria: 'HUMOR', likes: 267 },
  { id: '31', personaje: 'Mariano Rivera', texto: 'No seas un Mariano Rivera', significado: 'No seas tacaÃ±o', jergaOriginal: 'No seas un Mariano Rivera', categoria: 'VIDA_COTIDIANA', likes: 156 },
  { id: '32', personaje: 'Maximiano', texto: 'Ã‰chate un Maximiano', significado: 'Ã‰chate un trago', jergaOriginal: 'Ã‰chate un Maximiano', categoria: 'BRINDIS', likes: 245 },
  { id: '33', personaje: 'NicolÃ¡s Tejeda', texto: 'Ã‰chate un NicolÃ¡s Tejeda', significado: 'Ã‰chate un pulque', jergaOriginal: 'Ã‰chate un NicolÃ¡s Tejeda', categoria: 'BRINDIS', likes: 134 },
  { id: '34', personaje: 'Padre Heredia', texto: 'Ã‰chale copal al santo, no le hace que...', significado: 'Hacer algo con exageraciÃ³n sin importar daÃ±os', jergaOriginal: 'Ã‰chale copal al santo, no le hace que...', categoria: 'PERSONAJES', likes: 178 },
  { id: '35', personaje: 'Pancho Soto', texto: 'Con todo Pancho Soto', significado: 'Con todo respeto', jergaOriginal: 'Con todo Pancho Soto', categoria: 'PERSONAJES', likes: 156 },
  { id: '36', personaje: 'PÃ¡nfilo Soto', texto: 'Vete a tu PÃ¡nfilo Soto', significado: 'Vete a tu casita', jergaOriginal: 'Vete a tu PÃ¡nfilo Soto', categoria: 'FAMILIA', likes: 289 },
  { id: '37', personaje: 'Pepe TerÃ¡n', texto: 'Te pega la Pepe TerÃ¡n', significado: 'Te pega la vieja (la esposa)', jergaOriginal: 'Te pega la Pepe TerÃ¡n', categoria: 'FAMILIA', likes: 98 },
  { id: '38', personaje: 'Plutarco GarcÃ­a', texto: 'Mis Plutarco GarcÃ­a se pusieron malos', significado: 'Mis mijitos (hijos) se enfermaron', jergaOriginal: 'Mis Plutarco GarcÃ­a se pusieron malos', categoria: 'FAMILIA', likes: 145 },
  { id: '39', personaje: 'Pompero Rivera', texto: 'Veo a puro Pompero Rivera', significado: 'Pura mula loca (gente alborotada)', jergaOriginal: 'Veo a puro Pompero Rivera', categoria: 'HUMOR', likes: 267 },
  { id: '40', personaje: 'RamÃ³n HernÃ¡ndez', texto: 'Con mi RamÃ³n HernÃ¡ndez', significado: 'Con mi sagrada esposa', jergaOriginal: 'Con mi RamÃ³n HernÃ¡ndez', categoria: 'FAMILIA', likes: 198 },
  { id: '41', personaje: 'RamÃ³n Razo', texto: 'Vengo de la RamÃ³n Razo', significado: 'Vengo de la nube gris (Ciudad de MÃ©xico)', jergaOriginal: 'Vengo de la RamÃ³n Razo', categoria: 'PERSONAJES', likes: 156 },
  { id: '42', personaje: 'Refugio Fragoso', texto: 'VerÃ¡s como Refugio Fragoso', significado: 'VerÃ¡s como no pasa nada', jergaOriginal: 'VerÃ¡s como Refugio Fragoso', categoria: 'PERSONAJES', likes: 312 },
  { id: '43', personaje: 'Roberto Arista', texto: 'Llegaste Roberto Arista', significado: 'Llegaste un poquito tarde', jergaOriginal: 'Llegaste Roberto Arista', categoria: 'VIDA_COTIDIANA', likes: 87 },
  { id: '44', personaje: 'Roberto MartÃ­nez', texto: 'Vienes como Roberto MartÃ­nez', significado: 'Vienes como el diablo (enojado)', jergaOriginal: 'Vienes como Roberto MartÃ­nez', categoria: 'HUMOR', likes: 134 },
  { id: '45', personaje: 'Ruberta GarcÃ­a', texto: 'Te traes a la Ruberta GarcÃ­a', significado: 'Te traes a la descendencia (a la familia)', jergaOriginal: 'Te traes a la Ruberta GarcÃ­a', categoria: 'FAMILIA', likes: 178 },
  { id: '46', personaje: 'Sergio PÃ©rez', texto: 'EstÃ¡n muy Sergio PÃ©rez', significado: 'EstÃ¡n muy chirris (pequeÃ±os/dÃ©biles)', jergaOriginal: 'EstÃ¡n muy Sergio PÃ©rez', categoria: 'HUMOR', likes: 156 },
  { id: '47', personaje: 'SimÃ³n Guerrero', texto: 'Mi SimÃ³n Guerrero no me dejaba', significado: 'Mi fiera (esposa/pareja) no me dejaba', jergaOriginal: 'Mi SimÃ³n Guerrero no me dejaba', categoria: 'FAMILIA', likes: 289 },
];
