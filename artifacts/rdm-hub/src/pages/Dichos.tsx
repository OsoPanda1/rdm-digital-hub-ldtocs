/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Quote, Heart, Sparkles, Lightbulb, Users, Clock, 
  Search, Filter, ChevronDown, Volume2, Share2, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Categories of dichos
const CATEGORIES = [
  { id: "all", label: "Todos", icon: "âœ¨" },
  { id: "PERSONAJES", label: "Personajes", icon: "ðŸ‘¤" },
  { id: "BRINDIS", label: "Brindis", icon: "ðŸ»" },
  { id: "HUMOR", label: "Humor", icon: "ðŸ˜‚" },
  { id: "FAMILIA", label: "Familia", icon: "ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦" },
  { id: "COMIDA_BEBIDA", label: "Comida y Bebida", icon: "ðŸ½ï¸" },
  { id: "TRABAJO", label: "Trabajo", icon: "â›ï¸" },
  { id: "VIDA_COTIDIANA", label: "Vida Cotidiana", icon: "ðŸ " },
  { id: "MINERIA", label: "MinerÃ­a", icon: "ðŸ’Ž" },
];

// Complete list of traditional dichos from Real del Monte
const DICHOS = [
  {
    id: "1",
    personaje: "AgustÃ­n HernÃ¡ndez",
    texto: "EstÃ¡s AgustÃ­n HernÃ¡ndez",
    significado: "EstÃ¡s dÃ©bil",
    jergaOriginal: "EstÃ¡s AgustÃ­n HernÃ¡ndez",
    categoria: "VIDA_COTIDIANA",
    likes: 156
  },
  {
    id: "2",
    personaje: "Alberto Rivera",
    texto: "Vamos a hacer los Alberto Rivera",
    significado: "Vamos a hacer los ejercicios",
    jergaOriginal: "Vamos a hacer los Alberto Rivera",
    categoria: "TRABAJO",
    likes: 89
  },
  {
    id: "3",
    personaje: "Amalia",
    texto: "Andas Amalia",
    significado: "Andas caliente",
    jergaOriginal: "Andas Amalia",
    categoria: "HUMOR",
    likes: 234
  },
  {
    id: "4",
    personaje: "Aurelia Melgarejo",
    texto: "Ya estamos todas las Aurelia Melgarejo",
    significado: "Ya estamos todas las muchachas (usado para viejitas)",
    jergaOriginal: "Ya estamos todas las Aurelia Melgarejo",
    categoria: "FAMILIA",
    likes: 178
  },
  {
    id: "5",
    personaje: "Braulia Rutas",
    texto: "Ponme para mi Braulia Rutas",
    significado: "Ponme para mi desayuno",
    jergaOriginal: "Ponme para mi Braulia Rutas",
    categoria: "COMIDA_BEBIDA",
    likes: 145
  },
  {
    id: "6",
    personaje: "Carmelito",
    texto: "Me voy a Carmelito",
    significado: "Me voy a descansar",
    jergaOriginal: "Me voy a Carmelito",
    categoria: "VIDA_COTIDIANA",
    likes: 267
  },
  {
    id: "7",
    personaje: "Chucho Colunga",
    texto: "Viene con sus Chucho Colunga",
    significado: "Viene con sus mejores garritas (ropa elegante)",
    jergaOriginal: "Viene con sus Chucho Colunga",
    categoria: "HUMOR",
    likes: 198
  },
  {
    id: "8",
    personaje: "Chucho PÃ©rez",
    texto: "PerdÃ³name la Chucho PÃ©rez",
    significado: "PerdÃ³name la vida",
    jergaOriginal: "PerdÃ³name la Chucho PÃ©rez",
    categoria: "BRINDIS",
    likes: 156
  },
  {
    id: "9",
    personaje: "Chuco Bolio",
    texto: "HabrÃ¡ un Chuco Bolio",
    significado: "HabrÃ¡ una tocada (fiesta/evento musical)",
    jergaOriginal: "HabrÃ¡ un Chuco Bolio",
    categoria: "PERSONAJES",
    likes: 312
  },
  {
    id: "10",
    personaje: "Ciro Arellano",
    texto: "Ya me duelen las Ciro Arellano",
    significado: "Ya me duelen las sentaderas",
    jergaOriginal: "Ya me duelen las Ciro Arellano",
    categoria: "HUMOR",
    likes: 87
  },
  {
    id: "11",
    personaje: "Ciro HernÃ¡ndez",
    texto: "Cuidado con la Ciro HernÃ¡ndez",
    significado: "Cuidado con la pulmonÃ­a",
    jergaOriginal: "Cuidado con la Ciro HernÃ¡ndez",
    categoria: "VIDA_COTIDIANA",
    likes: 134
  },
  {
    id: "12",
    personaje: "Conrado Arista",
    texto: "CÃ³mo eres Conrado Arista",
    significado: "QuÃ© bruto eres",
    jergaOriginal: "CÃ³mo eres Conrado Arista",
    categoria: "HUMOR",
    likes: 178
  },
  {
    id: "13",
    personaje: "Domingo Rivera",
    texto: "No te vaya a caer un Domingo Rivera",
    significado: "No te vaya a caer un rayo",
    jergaOriginal: "No te vaya a caer un Domingo Rivera",
    categoria: "MINERIA",
    likes: 156
  },
  {
    id: "14",
    personaje: "El Agrarista",
    texto: "Â¡Como dijo el Agrarista! Salud chinga",
    significado: "Brindis rudo minero",
    jergaOriginal: "Â¡Como dijo el Agrarista! Salud chinga",
    categoria: "BRINDIS",
    likes: 289
  },
  {
    id: "15",
    personaje: "FÃ©lix CastaÃ±eda",
    texto: "De a FÃ©lix CastaÃ±eda",
    significado: "De a momento (rÃ¡pido/provisional)",
    jergaOriginal: "De a FÃ©lix CastaÃ±eda",
    categoria: "VIDA_COTIDIANA",
    likes: 98
  },
  {
    id: "16",
    personaje: "Gonzalo Meras",
    texto: "Anda de Gonzalo Meras",
    significado: "Anda de cusco (coqueto/malicioso)",
    jergaOriginal: "Anda de Gonzalo Meras",
    categoria: "HUMOR",
    likes: 145
  },
  {
    id: "17",
    personaje: "Horacio Meneses",
    texto: "Ya me echo la Horacio Meneses",
    significado: "Ya me echo la penÃºltima (copa)",
    jergaOriginal: "Ya me echo la Horacio Meneses",
    categoria: "BRINDIS",
    likes: 267
  },
  {
    id: "18",
    personaje: "JosÃ© GarcÃ­a",
    texto: "No te JosÃ© GarcÃ­a",
    significado: "No te recargues (no te apoyes/no abuses)",
    jergaOriginal: "No te JosÃ© GarcÃ­a",
    categoria: "TRABAJO",
    likes: 198
  },
  {
    id: "19",
    personaje: "JosÃ© Luis FernÃ¡ndez",
    texto: "EstÃ¡s muy JosÃ© Luis FernÃ¡ndez",
    significado: "EstÃ¡s muy chulo",
    jergaOriginal: "EstÃ¡s muy JosÃ© Luis FernÃ¡ndez",
    categoria: "HUMOR",
    likes: 156
  },
  {
    id: "20",
    personaje: "JosÃ© Roa",
    texto: "Â¿CÃ³mo estÃ¡ la JosÃ© Roa?",
    significado: "Â¿CÃ³mo estÃ¡ la raza?",
    jergaOriginal: "Â¿CÃ³mo estÃ¡ la JosÃ© Roa?",
    categoria: "PERSONAJES",
    likes: 312
  },
  {
    id: "21",
    personaje: "Kiko GarcÃ­a",
    texto: "Yo uso puro Kiko GarcÃ­a",
    significado: "Puro billete tosco (dinero en efectivo/grande)",
    jergaOriginal: "Yo uso puro Kiko GarcÃ­a",
    categoria: "COMIDA_BEBIDA",
    likes: 87
  },
  {
    id: "22",
    personaje: "Lolita Carrera",
    texto: "Te veo muy Lolita Carrera",
    significado: "Te veo muy mortificado/preocupado",
    jergaOriginal: "Te veo muy Lolita Carrera",
    categoria: "VIDA_COTIDIANA",
    likes: 134
  },
  {
    id: "23",
    personaje: "Luis Campero",
    texto: "Â¡Salud mulas apartando a mis compadres!",
    significado: "Brindis tradicional de cantina",
    jergaOriginal: "Â¡Salud mulas apartando a mis compadres!",
    categoria: "BRINDIS",
    likes: 178
  },
  {
    id: "24",
    personaje: "MamÃ¡ del Bolillo",
    texto: "Vienes como la mamÃ¡ del Bolillo",
    significado: "Vienes con tu carota (de mal humor)",
    jergaOriginal: "Vienes como la mamÃ¡ del Bolillo",
    categoria: "HUMOR",
    likes: 156
  },
  {
    id: "25",
    personaje: "Manuel NegrÃ³n",
    texto: "Andas todo Manuel NegrÃ³n",
    significado: "Andas todo lambrijo (flaco/hambriento)",
    jergaOriginal: "Andas todo Manuel NegrÃ³n",
    categoria: "HUMOR",
    likes: 289
  },
  {
    id: "26",
    personaje: "Mario HernÃ¡ndez",
    texto: "Andas todo Mario HernÃ¡ndez",
    significado: "Andas todo roido (desgastado)",
    jergaOriginal: "Andas todo Mario HernÃ¡ndez",
    categoria: "VIDA_COTIDIANA",
    likes: 98
  },
  {
    id: "27",
    personaje: "MartÃ­n LÃ³pez",
    texto: "Me dejaste MartÃ­n LÃ³pez",
    significado: "Me dejaste picadito (con ganas de mÃ¡s)",
    jergaOriginal: "Me dejaste MartÃ­n LÃ³pez",
    categoria: "COMIDA_BEBIDA",
    likes: 145
  },
  {
    id: "28",
    personaje: "MartÃ­n PÃ©rez",
    texto: "Para echarme mis MartÃ­n PÃ©rez",
    significado: "Para echarme mis sagrados alimentos",
    jergaOriginal: "Para echarme mis MartÃ­n PÃ©rez",
    categoria: "COMIDA_BEBIDA",
    likes: 267
  },
  {
    id: "29",
    personaje: "MoisÃ©s Escamilla",
    texto: "No seas MoisÃ©s Escamilla",
    significado: "No seas ladinito (astuto/ventajoso)",
    jergaOriginal: "No seas MoisÃ©s Escamilla",
    categoria: "HUMOR",
    likes: 198
  },
  {
    id: "30",
    personaje: "Mundo Oliver",
    texto: "Andas todo Mundo Oliver",
    significado: "Andas todo menso",
    jergaOriginal: "Andas todo Mundo Oliver",
    categoria: "HUMOR",
    likes: 156
  },
  {
    id: "31",
    personaje: "Narciso Trejo",
    texto: "No te hagas Narciso Trejo",
    significado: "No te hagas pendejo",
    jergaOriginal: "No te hagas Narciso Trejo",
    categoria: "HUMOR",
    likes: 312
  },
  {
    id: "32",
    personaje: "NicolÃ¡s Ordaz",
    texto: "Parecen NicolÃ¡s Ordaz",
    significado: "Parecen Judas (traidores/criticones)",
    jergaOriginal: "Parecen NicolÃ¡s Ordaz",
    categoria: "HUMOR",
    likes: 87
  },
  {
    id: "33",
    personaje: "NicolÃ¡s Tejeda",
    texto: "Ã‰chate un NicolÃ¡s Tejeda",
    significado: "Ã‰chate un finfonazo (un trago de alcohol)",
    jergaOriginal: "Ã‰chate un NicolÃ¡s Tejeda",
    categoria: "BRINDIS",
    likes: 134
  },
  {
    id: "34",
    personaje: "Padre Heredia",
    texto: "Ã‰chale copal al santo, no le hace que...",
    significado: "Hacer algo con exageraciÃ³n sin importar daÃ±os",
    jergaOriginal: "Ã‰chale copal al santo, no le hace que...",
    categoria: "PERSONAJES",
    likes: 178
  },
  {
    id: "35",
    personaje: "Pancho Soto",
    texto: "Con todo Pancho Soto",
    significado: "Con todo respeto",
    jergaOriginal: "Con todo Pancho Soto",
    categoria: "PERSONAJES",
    likes: 156
  },
  {
    id: "36",
    personaje: "PÃ¡nfilo Soto",
    texto: "Vete a tu PÃ¡nfilo Soto",
    significado: "Vete a tu casita",
    jergaOriginal: "Vete a tu PÃ¡nfilo Soto",
    categoria: "FAMILIA",
    likes: 289
  },
  {
    id: "37",
    personaje: "Pepe TerÃ¡n",
    texto: "Te pega la Pepe TerÃ¡n",
    significado: "Te pega la vieja (la esposa)",
    jergaOriginal: "Te pega la Pepe TerÃ¡n",
    categoria: "FAMILIA",
    likes: 98
  },
  {
    id: "38",
    personaje: "Plutarco GarcÃ­a",
    texto: "Mis Plutarco GarcÃ­a se pusieron malos",
    significado: "Mis mijitos (hijos) se enfermaron",
    jergaOriginal: "Mis Plutarco GarcÃ­a se pusieron malos",
    categoria: "FAMILIA",
    likes: 145
  },
  {
    id: "39",
    personaje: "Pompero Rivera",
    texto: "Veo a puro Pompero Rivera",
    significado: "Pura mula loca (gente alborotada)",
    jergaOriginal: "Veo a puro Pompero Rivera",
    categoria: "HUMOR",
    likes: 267
  },
  {
    id: "40",
    personaje: "RamÃ³n HernÃ¡ndez",
    texto: "Con mi RamÃ³n HernÃ¡ndez",
    significado: "Con mi sagrada esposa",
    jergaOriginal: "Con mi RamÃ³n HernÃ¡ndez",
    categoria: "FAMILIA",
    likes: 198
  },
  {
    id: "41",
    personaje: "RamÃ³n Razo",
    texto: "Vengo de la RamÃ³n Razo",
    significado: "Vengo de la nube gris (Ciudad de MÃ©xico)",
    jergaOriginal: "Vengo de la RamÃ³n Razo",
    categoria: "PERSONAJES",
    likes: 156
  },
  {
    id: "42",
    personaje: "Refugio Fragoso",
    texto: "VerÃ¡s como Refugio Fragoso",
    significado: "VerÃ¡s como no pasa nada",
    jergaOriginal: "VerÃ¡s como Refugio Fragoso",
    categoria: "PERSONAJES",
    likes: 312
  },
  {
    id: "43",
    personaje: "Roberto Arista",
    texto: "Llegaste Roberto Arista",
    significado: "Llegaste un poquito tarde",
    jergaOriginal: "Llegaste Roberto Arista",
    categoria: "VIDA_COTIDIANA",
    likes: 87
  },
  {
    id: "44",
    personaje: "Roberto MartÃ­nez",
    texto: "Vienes como Roberto MartÃ­nez",
    significado: "Vienes como el diablo (enojado)",
    jergaOriginal: "Vienes como Roberto MartÃ­nez",
    categoria: "HUMOR",
    likes: 134
  },
  {
    id: "45",
    personaje: "Ruberta GarcÃ­a",
    texto: "Te traes a la Ruberta GarcÃ­a",
    significado: "Te traes a la descendencia (a la familia)",
    jergaOriginal: "Te traes a la Ruberta GarcÃ­a",
    categoria: "FAMILIA",
    likes: 178
  },
  {
    id: "46",
    personaje: "Sergio PÃ©rez",
    texto: "EstÃ¡n muy Sergio PÃ©rez",
    significado: "EstÃ¡n muy chirris (pequeÃ±os/dÃ©biles)",
    jergaOriginal: "EstÃ¡n muy Sergio PÃ©rez",
    categoria: "HUMOR",
    likes: 156
  },
  {
    id: "47",
    personaje: "SimÃ³n Guerrero",
    texto: "Mi SimÃ³n Guerrero no me dejaba",
    significado: "Mi fiera (esposa/pareja) no me dejaba",
    jergaOriginal: "Mi SimÃ³n Guerrero no me dejaba",
    categoria: "FAMILIA",
    likes: 289
  }
];

const DichosPage = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSaid, setExpandedSaid] = useState<string | null>(null);
  const [likedDichos, setLikedDichos] = useState<Set<string>>(new Set());

  // Filter dichos
  const filteredDichos = DICHOS.filter(dicho => {
    const matchesCategory = selectedCategory === "all" || dicho.categoria === selectedCategory;
    const matchesSearch = 
      dicho.texto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dicho.personaje.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dicho.significado.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle like
  const handleLike = (id: string) => {
    setLikedDichos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Get featured (top liked)
  const featuredDichos = [...DICHOS].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <RDMLayout>
      <div className="min-h-screen bg-background">
        
        {/* Hero Section */}
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden bg-gradient-to-b from-amber-900/20 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.1),transparent_70%)]" />
          
          <div className="container mx-auto px-4 md:px-8 pt-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="border-amber-500 text-amber-500">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Archivo HistÃ³rico
                </Badge>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Dichos{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                  Personificados
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Descubre las expresiones tradicionales de Real del Monte. 
                47 personajes histÃ³ricos conforman el rico vocabulario caracterÃ­stico de este 
                Pueblo MÃ¡gico hidalguense.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explorar Dichos
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por personaje, expresiÃ³n o significado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="CategorÃ­a" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Featured Section */}
          {selectedCategory === "all" && !searchQuery && (
            <section className="mb-12">
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Dichos MÃ¡s Populares
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredDichos.map((dicho, index) => (
                  <motion.div
                    key={dicho.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                            {dicho.personaje}
                          </Badge>
                        </div>
                        <Quote className="w-8 h-8 text-amber-500/30 mb-4" />
                        <p className="font-serif text-lg font-bold text-foreground mb-3">
                          "{dicho.texto}"
                        </p>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {dicho.significado}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {CATEGORIES.find(c => c.id === dicho.categoria)?.icon} {dicho.categoria.replace("_", " ")}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Heart className={`w-4 h-4 ${likedDichos.has(dicho.id) ? "fill-red-500 text-red-500" : ""}`} />
                            {dicho.likes}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Stats */}
          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">{DICHOS.length}</p>
                  <p className="text-sm text-muted-foreground">Personajes Registrados</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">{CATEGORIES.length - 1}</p>
                  <p className="text-sm text-muted-foreground">CategorÃ­as</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">200+</p>
                  <p className="text-sm text-muted-foreground">AÃ±os de Historia</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-600">47</p>
                  <p className="text-sm text-muted-foreground">Dichos Ãšnicos</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Dichos Grid */}
          <section>
            <h2 className="font-serif text-2xl font-bold mb-6">
              {selectedCategory === "all" 
                ? "Ãndice AlfabÃ©tico de Dichos Realmontenses" 
                : CATEGORIES.find(c => c.id === selectedCategory)?.icon + " " + CATEGORIES.find(c => c.id === selectedCategory)?.label
              }
            </h2>
            
            {filteredDichos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Quote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron dichos con esa bÃºsqueda</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredDichos.map((dicho, index) => (
                    <motion.div
                      key={dicho.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className={`h-full cursor-pointer transition-all hover:shadow-lg ${
                          expandedSaid === dicho.id ? "ring-2 ring-amber-500" : ""
                        }`}
                        onClick={() => setExpandedSaid(expandedSaid === dicho.id ? null : dicho.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <Quote className="w-6 h-6 text-amber-500/50 shrink-0" />
                            <Badge variant="outline" className="text-xs shrink-0">
                              {CATEGORIES.find(c => c.id === dicho.categoria)?.icon}
                            </Badge>
                          </div>
                          
                          <div className="mb-2">
                            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                              {dicho.personaje}
                            </Badge>
                          </div>

                          <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                            "{dicho.texto}"
                          </h3>
                          
                          <AnimatePresence>
                            {expandedSaid === dicho.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-muted/30 p-3 rounded-lg mt-3">
                                  <p className="text-xs text-muted-foreground mb-1">Jerga Original:</p>
                                  <p className="font-mono text-sm italic text-foreground mb-2">
                                    "{dicho.jergaOriginal}"
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                                  <strong>Significado:</strong> {dicho.significado}
                                </p>
                                <Badge variant="outline" className="mt-3">
                                  {CATEGORIES.find(c => c.id === dicho.categoria)?.icon} {dicho.categoria.replace("_", " ")}
                                </Badge>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(dicho.id);
                              }}
                              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Heart className={`w-4 h-4 ${likedDichos.has(dicho.id) ? "fill-red-500 text-red-500" : ""}`} />
                              {dicho.likes + (likedDichos.has(dicho.id) ? 1 : 0)}
                            </button>
                            <button className="text-sm text-muted-foreground hover:text-amber-500 transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          {/* Contribute Section */}
          <section className="mt-16">
            <Card className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
              <CardContent className="p-8 text-center">
                <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h3 className="font-serif text-2xl font-bold mb-2">
                  Â¿Conoces algÃºn dicho tradicional?
                </h3>
                <p className="opacity-80 mb-6 max-w-xl mx-auto">
                  AyÃºdanos a preservar la cultura de Real del Monte contribuyendo con 
                  dichos o expresiones tradicionales que conozcas.
                </p>
                <Button 
                  variant="secondary" 
                  className="bg-white text-amber-700 hover:bg-white/90"
                >
                  Contribuir con un Dichos
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>

      </div>
    </RDMLayout>
  );
};

export default DichosPage;
