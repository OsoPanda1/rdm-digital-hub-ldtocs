import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Render4DRequest: describe una operación de gemelo 4D.
 * Se mantiene la forma actual, pero con payload más rico. [web:205]
 */
interface Render4DRequest {
  operation: "create-hypercube" | "rotate-4d" | "project-to-3d" | "color-map";
  payload: Record<string, unknown>;
  context?: { userId?: string; sessionId?: string; quality?: "draft" | "medium" | "high" };
}

/**
 * Hamming distance para construcción de hipercubo (4D, 16 vértices, 32 aristas).
 * Sigue siendo la base topológica; no se toca. [web:205]
 */
function hammingDistance(a: number, b: number): number {
  let distance = 0;
  let xor = a ^ b;
  while (xor) {
    distance += xor & 1;
    xor >>= 1;
  }
  return distance;
}

/**
 * Matriz de rotación general en 4D:
 * planes: "xy", "xz", "xw", "yz", "yw", "zw".
 * Inspirado en enfoques de num‑linalg y sistemas de proyección de GCVideo/Snogray. [page:1][page:2]
 */
function generateRotationMatrix4D(angle: number, plane: string = "xy"): number[][] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // Matriz identidad 4x4
  const matrix: number[][] = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];

  // índices de coordenadas: 0=x, 1=y, 2=z, 3=w
  const planeMap: Record<
    string,
    { a: number; b: number }
  > = {
    xy: { a: 0, b: 1 },
    xz: { a: 0, b: 2 },
    xw: { a: 0, b: 3 },
    yz: { a: 1, b: 2 },
    yw: { a: 1, b: 3 },
    zw: { a: 2, b: 3 },
  };

  const p = planeMap[plane] ?? planeMap["xy"];
  const { a, b } = p;

  matrix[a][a] = cos;
  matrix[a][b] = -sin;
  matrix[b][a] = sin;
  matrix[b][b] = cos;

  return matrix;
}

/**
 * Aplica una matriz de 4x4 a un vértice 4D.
 */
function applyMatrix4D(
  vertex: { x: number; y: number; z: number; w: number },
  m: number[][],
): { x: number; y: number; z: number; w: number } {
  const v = [vertex.x, vertex.y, vertex.z, vertex.w];

  const r = [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3],
    m[3][0] * v[0] + m[3][1] * v[1] + m[3][2] * v[2] + m[3][3] * v[3],
  ];

  return { x: r[0], y: r[1], z: r[2], w: r[3] };
}

/**
 * Mapear frecuencia a color RGB en espectro visible (380–700 nm),
 * similar a conversiones de color space en proyectos de video digital. [page:1]
 */
function frequencyToRGB(
  frequency: number,
): { r: number; g: number; b: number } {
  const wavelength = 380 + (frequency % 321);
  let r = 0;
  let g = 0;
  let b = 0;

  if (wavelength >= 380 && wavelength < 440) {
    r = Math.abs(wavelength - 440) / (440 - 380);
    b = 1;
  } else if (wavelength >= 440 && wavelength < 490) {
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength >= 490 && wavelength < 510) {
    g = 1;
    b = Math.abs(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1;
    g = Math.abs(wavelength - 645) / (645 - 580);
  } else if (wavelength >= 645 && wavelength <= 700) {
    r = 1;
  }

  return {
    r: Math.floor(r * 255),
    g: Math.floor(g * 255),
    b: Math.floor(b * 255),
  };
}

/**
 * Construye el hipercubo 4D (teseracto) con topología explícita. [web:205]
 */
function createHypercube() {
  const vertices: Array<{
    id: number;
    x: number;
    y: number;
    z: number;
    w: number;
  }> = [];

  for (let i = 0; i < 16; i++) {
    vertices.push({
      id: i,
      x: i & 1 ? 1 : -1,
      y: i & 2 ? 1 : -1,
      z: i & 4 ? 1 : -1,
      w: i & 8 ? 1 : -1,
    });
  }

  const edges: Array<{ from: number; to: number }> = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      if (hammingDistance(i, j) === 1) {
        edges.push({ from: i, to: j });
      }
    }
  }

  return {
    type: "hypercube-4d",
    vertexCount: vertices.length,
    edgeCount: edges.length,
    vertices,
    edges,
    topology: {
      cells_0d: 16,
      cells_1d: 32,
      cells_2d: 24,
      cells_3d: 8,
      cells_4d: 1,
    },
  };
}

/**
 * Rotación 4D aplicada opcionalmente sobre un set de vértices (si se envían).
 * Permite calidad de rotación según nivel (draft/medium/high). [page:2][web:205]
 */
function rotate4D(payload: Record<string, unknown>) {
  const angle = (payload.angle as number) ?? 0.1;
  const plane = (payload.plane as string) ?? "xy";
  const quality = (payload.quality as "draft" | "medium" | "high") ?? "medium";

  const rotationMatrix = generateRotationMatrix4D(angle, plane);

  const source =
    (payload.vertices as Array<{
      id: number;
      x: number;
      y: number;
      z: number;
      w: number;
    }> | undefined) ?? createHypercube().vertices;

  // Calidad: decide si retornamos sólo la matriz (draft) o vértices rotados (medium/high).
  const rotatedVertices =
    quality === "draft"
      ? undefined
      : source.map((v) => ({ id: v.id, ...applyMatrix4D(v, rotationMatrix) }));

  return {
    status: "rotated",
    angle,
    plane,
    rotationMatrix,
    rotationApplied: true,
    quality,
    vertexCount: rotatedVertices?.length ?? source.length,
    vertices: rotatedVertices,
  };
}

/**
 * Proyección 4D->3D:
 * - method: "schlegel" (proyección en una celda) o "perspective" (proy. homográfica).
 * - distance: controla el punto de vista en w.
 * Inspirado en patrones de proyección de render engines y num‑linalg. [page:1][page:2]
 */
function projectTo3D(payload: Record<string, unknown>) {
  const method = (payload.method as string) ?? "schlegel";
  const distance = (payload.distance as number) ?? 2;
  const vertices4D =
    (payload.vertices as Array<{
      x: number;
      y: number;
      z: number;
      w: number;
    }> | undefined) ?? createHypercube().vertices;

  const projection =
    method === "perspective"
      ? vertices4D.map((v) => {
          const factor = distance / (distance - v.w);
          return {
            x: v.x * factor,
            y: v.y * factor,
            z: v.z * factor,
          };
        })
      : // schlegel: proyectamos sobre una celda y comprimimos w.
        vertices4D.map((v) => ({
          x: v.x + v.w * 0.2,
          y: v.y + v.w * 0.2,
          z: v.z,
        }));

  return {
    status: "projected",
    method,
    projectionType: "3D",
    distance,
    vertices: projection,
    vertexCount: projection.length,
    metadata: {
      preservesTopology: method === "schlegel",
      visibilityOptimized: true,
      renderReady: true,
    },
  };
}

/**
 * Mapeo de color con gradiente y perfil.
 * Puede usarse para colorear vértices, aristas o capas según frecuencia. [page:1]
 */
function colorMap(payload: Record<string, unknown>) {
  const frequency = (payload.frequency as number) ?? 440;
  const colorScheme = (payload.colorScheme as string) ?? "spectrum";

  const baseColor = frequencyToRGB(frequency);

  const gradient = [
    frequencyToRGB(frequency - 50),
    baseColor,
    frequencyToRGB(frequency + 50),
  ].map((c) => `rgb(${c.r}, ${c.g}, ${c.b})`);

  return {
    status: "colored",
    colorScheme,
    baseColor: `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`,
    gradient,
    frequency,
  };
}

/**
 * Validación mínima del body para evitar crash por payload corrupto.
 */
function validateRequestBody(body: unknown): Render4DRequest {
  if (
    !body ||
    typeof body !== "object" ||
    !("operation" in body) ||
    !("payload" in body)
  ) {
    throw new Error("Invalid Render4DRequest payload");
  }
  return body as Render4DRequest;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();

  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Cell-Type", "Render4D");
  res.setHeader("X-Cell-Version", "2.0.0");

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "Use POST for render-4d operations",
      },
    });
  }

  try {
    const { operation, payload, context } = validateRequestBody(req.body);

    const validOps = [
      "create-hypercube",
      "rotate-4d",
      "project-to-3d",
      "color-map",
    ] as const;

    if (!operation || !validOps.includes(operation)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_OPERATION",
          message: `Operation '${operation}' not supported. Use: ${validOps.join(", ")}`,
        },
      });
    }

    let result: Record<string, unknown>;

    switch (operation) {
      case "create-hypercube":
        result = createHypercube();
        break;
      case "rotate-4d":
        result = rotate4D(payload || {});
        break;
      case "project-to-3d":
        result = projectTo3D(payload || {});
        break;
      case "color-map":
        result = colorMap(payload || {});
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    const executionTime = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      data: result,
      performance: {
        executionTime,
        startTime,
      },
      timestamp: new Date().toISOString(),
      context: {
        userId: context?.userId,
        sessionId: context?.sessionId,
        quality: context?.quality ?? "medium",
      },
    });
  } catch (err) {
    const executionTime = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return res.status(500).json({
      success: false,
      error: {
        code: "RENDER_4D_ERROR",
        message: errorMessage,
      },
      performance: { executionTime },
      timestamp: new Date().toISOString(),
    });
  }
}
