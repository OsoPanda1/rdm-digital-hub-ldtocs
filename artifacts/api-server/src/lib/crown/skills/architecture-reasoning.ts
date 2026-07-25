// ────────────────────────────────────────────────────────────────
// SKILL 9 — Architecture Reasoning Engine
// Grafo semántico del ecosistema TAMV, razonamiento estructural
// y detección de deudas técnicas y puntos de falla
// ────────────────────────────────────────────────────────────────

import type { SkillDefinition } from "../types";

export const ArchitectureReasoningDefinition: SkillDefinition = {
  skillId: "architecture-reasoning",
  name: "Architecture Reasoning Engine",
  description: "Semantic graph of TAMV ecosystem, structural reasoning, and technical debt/fault point detection",
  version: "1.0.0",
  federationRequired: [],
  hexagonZone: "interior",
  inputSchema: "ArchQueryRequest | ArchAnalyzeRequest",
  outputSchema: "ArchQueryResult | ArchAnalyzeResult",
};

interface ArchNode {
  id: string;
  type: "module" | "service" | "database" | "api" | "ui" | "external";
  name: string;
  dependencies: string[];
  metrics: { lines: number; complexity: number; lastModified: string };
}

interface ArchEdge {
  from: string;
  to: string;
  type: "depends_on" | "calls" | "reads_from" | "writes_to" | "extends";
}

interface ArchAnalyzeRequest {
  moduleId: string;
  depth?: number;
}

interface DependencyInfo {
  node: ArchNode;
  path: string[];
  risk: number;
}

interface ArchAnalyzeResult {
  moduleId: string;
  dependencies: DependencyInfo[];
  dependents: ArchNode[];
  circularDeps: string[][];
  debtScore: number;
  recommendations: string[];
}

interface ArchQueryRequest {
  type?: ArchNode["type"];
  search?: string;
}

export interface ArchitectureReasoningEngine {
  addNode(node: Omit<ArchNode, "dependencies"> & { dependencies?: string[] }): ArchNode;
  addEdge(edge: ArchEdge): void;
  getNode(id: string): ArchNode | undefined;
  analyze(request: ArchAnalyzeRequest): ArchAnalyzeResult;
  query(request: ArchQueryRequest): ArchNode[];
  getCircularDeps(): string[][];
  getDebtScore(): number;
  stats(): { totalNodes: number; totalEdges: number; avgComplexity: number; debtScore: number };
}

export function createArchitectureReasoningEngine(): ArchitectureReasoningEngine {
  const nodes = new Map<string, ArchNode>();
  const edges: ArchEdge[] = [];

  function findAllPaths(from: string, to: string, visited = new Set<string>()): string[][] {
    if (from === to) return [[to]];
    visited.add(from);
    const paths: string[][] = [];
    const outEdges = edges.filter((e) => e.from === from);
    for (const edge of outEdges) {
      if (!visited.has(edge.to)) {
        const subPaths = findAllPaths(edge.to, to, new Set(visited));
        for (const sp of subPaths) paths.push([from, ...sp]);
      }
    }
    return paths;
  }

  function findCircularDeps(): string[][][] {
    const circular: string[][][] = [];
    for (const [id] of nodes) {
      const paths = findAllPaths(id, id);
      for (const p of paths) {
        if (p.length > 1 && !circular.some((c) => c.join(",") === p.join(","))) circular.push([p]);
      }
    }
    return circular;
  }

  return {
    addNode(node) {
      const full: ArchNode = { ...node, dependencies: node.dependencies ?? [] };
      nodes.set(full.id, full);
      return full;
    },

    addEdge(edge) { edges.push(edge); },

    getNode(id) { return nodes.get(id); },

    analyze(request) {
      const node = nodes.get(request.moduleId);
      if (!node) return { moduleId: request.moduleId, dependencies: [], dependents: [], circularDeps: [], debtScore: 0, recommendations: ["Module not found"] };

      const depth = request.depth ?? 3;
      const deps: DependencyInfo[] = [];
      const visited = new Set<string>();

      function traverse(depId: string, path: string[], currentDepth: number) {
        if (currentDepth > depth || visited.has(depId)) return;
        visited.add(depId);
        const dep = nodes.get(depId);
        if (!dep) return;
        const risk = dep.metrics.complexity > 10 ? 0.8 : dep.metrics.complexity > 5 ? 0.5 : 0.2;
        deps.push({ node: dep, path: [...path, depId], risk });
        for (const nextDep of dep.dependencies) traverse(nextDep, [...path, depId], currentDepth + 1);
      }

      for (const dep of node.dependencies) traverse(dep, [request.moduleId], 1);

      const dependents = Array.from(nodes.values()).filter((n) => n.dependencies.includes(request.moduleId));
      const circular = findCircularDeps().filter((c) => c[0]!.includes(request.moduleId));
      const debtScore = deps.reduce((s, d) => s + d.risk, 0) / Math.max(1, deps.length);

      const recommendations: string[] = [];
      if (circular.length > 0) recommendations.push("Break circular dependencies");
      if (deps.some((d) => d.risk > 0.7)) recommendations.push("Refactor high-risk dependencies");
      if (node.metrics.complexity > 10) recommendations.push("Reduce module complexity");
      if (recommendations.length === 0) recommendations.push("Architecture is healthy");

      return { moduleId: request.moduleId, dependencies: deps, dependents, circularDeps: circular, debtScore, recommendations };
    },

    query(request) {
      let result = Array.from(nodes.values());
      if (request.type) result = result.filter((n) => n.type === request.type);
      if (request.search) {
        const search = request.search.toLowerCase();
        result = result.filter((n) => n.name.toLowerCase().includes(search) || n.id.toLowerCase().includes(search));
      }
      return result;
    },

    getCircularDeps() { return findCircularDeps(); },

    getDebtScore() {
      const allNodes = Array.from(nodes.values());
      if (allNodes.length === 0) return 0;
      return allNodes.reduce((s, n) => s + n.metrics.complexity / 20, 0) / allNodes.length;
    },

    stats() {
      const total = nodes.size;
      const avgComplexity = total > 0 ? Array.from(nodes.values()).reduce((s, n) => s + n.metrics.complexity, 0) / total : 0;
      return { totalNodes: total, totalEdges: edges.length, avgComplexity, debtScore: this.getDebtScore() };
    },
  };
}
