// api/mcp/index.ts — Vercel Serverless Function
// MCP (Model Context Protocol) server for RDM Digital Hub
// Exposes territorial tools and resources for LLMs

import type { VercelRequest, VercelResponse } from "@vercel/node";

type MCPTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

type MCPResource = {
  uri: string;
  name: string;
  description: string;
  mimeType?: string;
};

const TOOLS: MCPTool[] = [
  {
    name: "rdm_weather",
    description: "Get current weather in Real del Monte, Hidalgo",
    inputSchema: {
      type: "object",
      properties: {
        unit: { type: "string", enum: ["celsius", "fahrenheit"], description: "Temperature unit" },
      },
    },
  },
  {
    name: "rdm_places",
    description: "Get information about tourist places in Real del Monte",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Place name (e.g., 'Mina Acosta', 'Panteon Ingles')" },
      },
      required: ["name"],
    },
  },
];

const RESOURCES: MCPResource[] = [
  {
    uri: "mcp://rdm/territory",
    name: "Territorio RDM",
    description: "Información general del territorio de Real del Monte",
    mimeType: "application/json",
  },
  {
    uri: "mcp://rdm/history",
    name: "Historia RDM",
    description: "Resumen histórico de Real del Monte y su minería",
    mimeType: "application/json",
  },
];

const PLACES: Record<string, unknown> = {
  "mina acosta": {
    name: "Mina Acosta",
    desc: "Mina histórica del siglo XVIII, actualmente museo de sitio",
    location: { lat: 20.139, lng: -98.672 },
  },
  "panteón inglés": {
    name: "Panteón Inglés",
    desc: "Cementerio del siglo XIX con tumbas de mineros ingleses",
    year: 1850,
  },
};

async function handleListTools(): Promise<{ tools: MCPTool[] }> {
  return { tools: TOOLS };
}

async function handleCallTool(name: string, args: Record<string, unknown>): Promise<{ result: unknown }> {
  switch (name) {
    case "rdm_weather": {
      const tempF = Math.round(Math.random() * (90 - 32) + 32);
      const tempC = Math.round((tempF - 32) * (5 / 9));
      const unit = (args.unit as string) || "celsius";
      return {
        result: {
          location: "Real del Monte, Hidalgo",
          temperature: unit === "celsius" ? tempC : tempF,
          unit,
          conditions: ["soleado", "nublado", "lluvia ligera"][Math.floor(Math.random() * 3)],
        },
      };
    }
    case "rdm_places": {
      const key = (args.name as string || "").toLowerCase();
      const info = PLACES[key];
      if (!info) return { result: { error: `No info for "${args.name}"` } };
      return { result: info };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function handleListResources(): Promise<{ resources: MCPResource[] }> {
  return { resources: RESOURCES };
}

async function handleReadResource(uri: string): Promise<{ data: unknown }> {
  switch (uri) {
    case "mcp://rdm/territory":
      return {
        data: {
          name: "Real del Monte",
          state: "Hidalgo",
          country: "México",
          founded: 1572,
          altitude: 2700,
          population: 11841,
        },
      };
    case "mcp://rdm/history":
      return {
        data: {
          summary: "Real del Monte es un pueblo minero fundado en 1572. En el siglo XIX, mineros ingleses introdujeron el paste, que se convirtió en el platillo típico de la región.",
          events: [
            { year: 1552, event: "Descubrimiento de vetas de plata" },
            { year: 1824, event: "Llegada de la Compañía Minera de Real del Monte" },
            { year: 2004, event: "Declarado Pueblo Mágico" },
          ],
        },
      };
    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { method, params } = req.body as {
    method: string;
    params: { name?: string; arguments?: Record<string, unknown>; uri?: string };
    id?: string | number;
  };

  try {
    let result: unknown;

    switch (method) {
      case "mcp.listTools":
        result = await handleListTools();
        break;
      case "mcp.callTool":
        result = await handleCallTool(params?.name || "", params?.arguments || {});
        break;
      case "mcp.listResources":
        result = await handleListResources();
        break;
      case "mcp.readResource":
        result = await handleReadResource(params?.uri || "");
        break;
      default:
        throw new Error(`Unsupported MCP method: ${method}`);
    }

    return res.status(200).json({ jsonrpc: "2.0", result, id: req.body?.id || null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "MCP error";
    return res.status(500).json({
      jsonrpc: "2.0",
      error: { code: -32000, message },
      id: req.body?.id || null,
    });
  }
}
