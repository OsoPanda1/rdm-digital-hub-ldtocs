export type Place = {
  id: string;
  name: string;
  category: "museo" | "historico" | "mineria" | "arquitectura" | "gastronomia" | "naturaleza" | "plaza";
  description: string;
  location: { lat: number; lng: number };
  images?: string[];
  status: "active" | "inactive";
  createdAt: string;
};

export type Route = {
  id: string;
  name: string;
  description: string;
  places: string[];
  duration: string;
  difficulty: "easy" | "medium" | "hard";
};

export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  type: "cultural" | "gastronomia" | "turismo" | "festividad" | "tradicion";
  description?: string;
};
