// ────────────────────────────────────────────────────────────────
// F5 — Gemelos Digitales
// Representación 3D, monitoreo ambiental, IoT mock
// ────────────────────────────────────────────────────────────────

export interface TwinScene {
  id: string;
  name: string;
  objects: TwinObject[];
  createdAt: string;
}

export interface TwinObject {
  id: string;
  type: string;
  position: { x: number; y: number; z: number };
  metadata: Record<string, unknown>;
}

export interface SensorReading {
  sensorId: string;
  type: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface DigitalTwinsF5 {
  createScene(name: string, objects?: TwinObject[]): Promise<TwinScene>;
  getScene(id: string): Promise<TwinScene | null>;
  addSensor(sceneId: string, sensor: Omit<SensorReading, "timestamp">): Promise<SensorReading>;
  getSensors(sceneId: string): Promise<SensorReading[]>;
  stats(): Promise<{ totalScenes: number; totalSensors: number }>;
}

export function createDigitalTwinsF5(): DigitalTwinsF5 {
  const scenes = new Map<string, TwinScene>();
  const sensors = new Map<string, SensorReading[]>();

  return {
    async createScene(name, objects = []) {
      const scene: TwinScene = {
        id: `twin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        objects,
        createdAt: new Date().toISOString(),
      };
      scenes.set(scene.id, scene);
      return scene;
    },

    async getScene(id) { return scenes.get(id) ?? null; },

    async addSensor(sceneId, sensor) {
      const reading: SensorReading = { ...sensor, timestamp: new Date().toISOString() };
      const existing = sensors.get(sceneId) ?? [];
      existing.push(reading);
      sensors.set(sceneId, existing);
      return reading;
    },

    async getSensors(sceneId) { return sensors.get(sceneId) ?? []; },

    async stats() { return { totalScenes: scenes.size, totalSensors: Array.from(sensors.values()).reduce((s, a) => s + a.length, 0) }; },
  };
}
