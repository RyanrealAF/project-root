// Knowledge Graph Data Structure
export interface ConceptNode {
  id: string;
  phrase: string;
  definition?: string;
  type: 'concept' | 'document';
  category?: string;
  excerpt?: string;
  connections: string[];
  strength?: number; // 0-1, calculated based on shared connections
}

export interface KnowledgeGraph {
  nodes: ConceptNode[];
  edges: Array<{
    from: string;
    to: string;
    type: 'direct' | 'thematic' | 'conceptual';
    strength: number;
  }>;
}

// Build knowledge graph from content collections
export async function buildKnowledgeGraph(): Promise<KnowledgeGraph> {
  const nodes: ConceptNode[] = [];
  const edges: KnowledgeGraph['edges'] = [];

  // Import all collections dynamically
  const collections = ['doctrine', 'archive', 'curriculum', 'identity', 'dispatch'];

  for (const collectionName of collections) {
    try {
      const { getCollection } = await import('astro:content');
      const collection = await getCollection(collectionName as any);

      collection.forEach(entry => {
        // Add document node
        nodes.push({
          id: `${collectionName}-${entry.slug}`,
          phrase: entry.data.title,
          type: 'document',
          category: entry.data.category,
          excerpt: entry.data.excerpt,
          connections: [],
        });

        // Add concept nodes and connections
        if (entry.data.concepts) {
          entry.data.concepts.forEach((concept: any) => {
            // Check if concept node already exists
            let conceptNode = nodes.find(n => n.id === concept.id);
            if (!conceptNode) {
              conceptNode = {
                id: concept.id,
                phrase: concept.phrase,
                definition: concept.definition,
                type: 'concept',
                connections: [],
              };
              nodes.push(conceptNode);
            }

            // Add connection from document to concept
            edges.push({
              from: `${collectionName}-${entry.slug}`,
              to: concept.id,
              type: 'direct',
              strength: 0.9,
            });

            // Add connections between concepts
            concept.connections.forEach((connectedId: string) => {
              if (!edges.find(e => (e.from === concept.id && e.to === connectedId) || (e.from === connectedId && e.to === concept.id))) {
                edges.push({
                  from: concept.id,
                  to: connectedId,
                  type: 'conceptual',
                  strength: 0.7,
                });
              }
            });
          });
        }
      });
    } catch (error) {
      console.error(`Failed to load collection ${collectionName}:`, error);
    }
  }

  // Calculate connection strengths and populate node connections
  nodes.forEach(node => {
    const nodeEdges = edges.filter(e => e.from === node.id || e.to === node.id);
    node.connections = nodeEdges.map(e => e.from === node.id ? e.to : e.from);
    node.strength = nodeEdges.reduce((sum, edge) => sum + edge.strength, 0) / Math.max(nodeEdges.length, 1);
  });

  return { nodes, edges };
}

// Get concept data for hover popups
export function getConceptData(graph: KnowledgeGraph, conceptId: string) {
  const node = graph.nodes.find(n => n.id === conceptId);
  if (!node) return null;

  return {
    id: node.id,
    phrase: node.phrase,
    definition: node.definition,
    type: node.type,
    excerpt: node.excerpt,
    connections: node.connections.slice(0, 5), // Limit for performance
    connectionCount: node.connections.length,
  };
}

// Get related nodes for graph visualization
export function getRelatedNodes(graph: KnowledgeGraph, centerId: string, maxDepth = 2) {
  const visited = new Set<string>();
  const result: ConceptNode[] = [];
  const queue = [{ id: centerId, depth: 0 }];

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    if (visited.has(id) || depth > maxDepth) continue;

    visited.add(id);
    const node = graph.nodes.find(n => n.id === id);
    if (node) {
      result.push(node);

      // Add connected nodes to queue
      graph.edges
        .filter(e => e.from === id || e.to === id)
        .forEach(edge => {
          const connectedId = edge.from === id ? edge.to : edge.from;
          if (!visited.has(connectedId)) {
            queue.push({ id: connectedId, depth: depth + 1 });
          }
        });
    }
  }

  return result;
}