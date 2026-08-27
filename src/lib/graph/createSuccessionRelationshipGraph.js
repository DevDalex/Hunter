import Graph from 'graphology';

const ensureNode = (graph, id, attributes = {}) => {
  if (!id) return;
  if (!graph.hasNode(id)) graph.addNode(id, { id, ...attributes });
};

export function createSuccessionRelationshipGraph(relationships = [], entityLookup = new Map()) {
  const graph = new Graph({ type: 'mixed', multi: true, allowSelfLoops: false });

  for (const relation of relationships) {
    const source = relation?.sourceEntityId;
    const target = relation?.targetEntityId;
    if (!source || !target || source === target) continue;

    ensureNode(graph, source, entityLookup.get(source) || {});
    ensureNode(graph, target, entityLookup.get(target) || {});

    const attributes = {
      id: relation.id,
      name: relation.name,
      relationshipType: relation.relationshipType,
      subtype: relation.subtype,
      sentiment: relation.sentiment,
      status: relation.status,
      certainty: relation.certainty,
      chapterRange: relation.chapterRange,
      strength: relation.strength,
    };

    if (relation.direction === 'bidirectional' || relation.direction === 'undirected') {
      graph.addUndirectedEdgeWithKey(relation.id, source, target, attributes);
    } else {
      graph.addDirectedEdgeWithKey(relation.id, source, target, attributes);
    }
  }

  return graph;
}

export function relationshipNeighborhood(graph, entityId, depth = 1) {
  if (!graph?.hasNode(entityId)) return new Set();
  const limit = Math.max(0, Math.min(4, Number(depth) || 0));
  const visited = new Set([entityId]);
  let frontier = new Set([entityId]);

  for (let hop = 0; hop < limit; hop += 1) {
    const next = new Set();
    for (const node of frontier) {
      for (const neighbor of graph.neighbors(node)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          next.add(neighbor);
        }
      }
    }
    frontier = next;
    if (!frontier.size) break;
  }

  visited.delete(entityId);
  return visited;
}
