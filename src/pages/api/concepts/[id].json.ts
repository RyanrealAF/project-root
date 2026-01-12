import type { APIRoute } from 'astro';
import { buildKnowledgeGraph, getConceptData } from '../../../data/knowledge-graph';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Concept ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const graph = await buildKnowledgeGraph();
    const data = getConceptData(graph, id);

    if (!data) {
      return new Response(JSON.stringify({ error: 'Concept not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};