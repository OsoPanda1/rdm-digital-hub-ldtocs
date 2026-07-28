// ══════════════════════════════════════════════════════════════════════════════
// Isabella Ω Cognitive Kernel — Knowledge Graph
// Entity-relationship graph for territorial intelligence.
// ══════════════════════════════════════════════════════════════════════════════

import type {
  KnowledgeEntity,
  KnowledgeRelation,
  GraphQuery,
  EntityKind,
} from "./types";
import { logger } from "../../logger";

const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function sanitizeKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    if (FORBIDDEN_KEYS.has(key)) continue;
    clean[key] = obj[key];
  }
  return clean;
}

export interface KnowledgeGraph {
  addEntity(entity: Omit<KnowledgeEntity, "id" | "createdAt" | "updatedAt">): KnowledgeEntity;
  addRelation(relation: Omit<KnowledgeRelation, "id" | "createdAt">): KnowledgeRelation;
  getEntity(id: string): KnowledgeEntity | undefined;
  getRelations(entityId: string): KnowledgeRelation[];
  queryGraph(q: GraphQuery): { entities: KnowledgeEntity[]; relations: KnowledgeRelation[] };
  searchEntities(query: string, kinds?: EntityKind[]): KnowledgeEntity[];
  updateEntity(id: string, updates: Partial<KnowledgeEntity>): boolean;
  deleteEntity(id: string): boolean;
  getStats(): { entityCount: number; relationCount: number; byKind: Record<EntityKind, number> };
}

const entities = new Map<string, KnowledgeEntity>();
const relations = new Map<string, KnowledgeRelation>();

function getRelatedEntities(entityId: string, depth: number, maxResults: number, minWeight: number): {
  entities: Set<string>;
  relations: KnowledgeRelation[];
} {
  const visited = new Set<string>();
  const resultEntities = new Set<string>();
  const resultRelations: KnowledgeRelation[] = [];
  const queue: Array<{ id: string; currentDepth: number }> = [{ id: entityId, currentDepth: 0 }];

  while (queue.length > 0 && resultEntities.size < maxResults) {
    const { id, currentDepth } = queue.shift()!;
    if (visited.has(id) || currentDepth > depth) continue;
    visited.add(id);

    if (id !== entityId) resultEntities.add(id);

    for (const rel of relations.values()) {
      if (rel.sourceId === id || (rel.bidirectional && rel.targetId === id)) {
        if (rel.weight >= minWeight) {
          const nextId = rel.sourceId === id ? rel.targetId : rel.sourceId;
          if (!visited.has(nextId)) {
            resultRelations.push(rel);
            queue.push({ id: nextId, currentDepth: currentDepth + 1 });
          }
        }
      }
    }
  }

  return { entities: resultEntities, relations: resultRelations };
}

export function createKnowledgeGraph(): KnowledgeGraph {
  return {
    addEntity(partial) {
      const entity: KnowledgeEntity = {
        id: `entity-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ...partial,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      entities.set(entity.id, entity);
      logger.debug({ entityId: entity.id, kind: entity.kind, name: entity.name }, "Entity added");
      return entity;
    },

    addRelation(partial) {
      const rel: KnowledgeRelation = {
        id: `rel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ...partial,
        createdAt: Date.now(),
      };
      relations.set(rel.id, rel);
      logger.debug({ relationId: rel.id, source: rel.sourceId, target: rel.targetId }, "Relation added");
      return rel;
    },

    getEntity(id) {
      return entities.get(id);
    },

    getRelations(entityId) {
      return Array.from(relations.values()).filter(
        (r) => r.sourceId === entityId || r.targetId === entityId,
      );
    },

    queryGraph(q) {
      const { entities: relatedIds, relations: foundRelations } = getRelatedEntities(
        q.startEntityId,
        q.maxDepth,
        q.maxResults,
        q.minWeight,
      );

      const foundEntities = Array.from(relatedIds)
        .map((id) => entities.get(id))
        .filter((e): e is KnowledgeEntity => e !== undefined);

      // Add the start entity
      const startEntity = entities.get(q.startEntityId);
      if (startEntity) foundEntities.unshift(startEntity);

      // Filter by relation types
      const filteredRelations = q.relationTypes
        ? foundRelations.filter((r) => q.relationTypes!.includes(r.type))
        : foundRelations;

      return {
        entities: foundEntities.slice(0, q.maxResults),
        relations: filteredRelations,
      };
    },

    searchEntities(query, kinds) {
      const lower = query.toLowerCase();
      return Array.from(entities.values()).filter((e) => {
        if (kinds && !kinds.includes(e.kind)) return false;
        return (
          e.name.toLowerCase().includes(lower) ||
          e.description.toLowerCase().includes(lower) ||
          Object.values(e.properties).some(
            (v) => typeof v === "string" && v.toLowerCase().includes(lower),
          )
        );
      });
    },

    updateEntity(id, updates) {
      const entity = entities.get(id);
      if (!entity) return false;
      Object.assign(entity, sanitizeKeys(updates as Record<string, unknown>), { updatedAt: Date.now() });
      return true;
    },

    deleteEntity(id) {
      const deleted = entities.delete(id);
      if (deleted) {
        // Remove related relations
        for (const [relId, rel] of relations) {
          if (rel.sourceId === id || rel.targetId === id) {
            relations.delete(relId);
          }
        }
      }
      return deleted;
    },

    getStats() {
      const byKind = {} as Record<EntityKind, number>;
      for (const entity of entities.values()) {
        byKind[entity.kind] = (byKind[entity.kind] ?? 0) + 1;
      }
      return {
        entityCount: entities.size,
        relationCount: relations.size,
        byKind,
      };
    },
  };
}
