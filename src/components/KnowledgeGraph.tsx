import { useState, useEffect, useRef } from 'react';
import { buildKnowledgeGraph, getRelatedNodes, type ConceptNode } from '../data/knowledge-graph';

interface KnowledgeGraphProps {
  centerConceptId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function KnowledgeGraph({ centerConceptId, isOpen, onClose }: KnowledgeGraphProps) {
  const [nodes, setNodes] = useState<ConceptNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (isOpen && centerConceptId) {
      loadGraph(centerConceptId);
    }
  }, [isOpen, centerConceptId]);

  const loadGraph = async (centerId: string) => {
    setLoading(true);
    try {
      const graph = await buildKnowledgeGraph();
      const relatedNodes = getRelatedNodes(graph, centerId, 2);
      setNodes(relatedNodes);
    } catch (error) {
      console.error('Failed to load graph:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node: ConceptNode) => {
    if (node.type === 'document') {
      // Navigate to document
      const [collection, slug] = node.id.split('-', 2);
      window.location.href = `/${collection}/${slug}`;
    } else {
      setSelectedNode(node);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-6xl max-h-4xl bg-charcoal border border-bronze/20 rounded-lg m-4 overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-charcoal-light border-b border-bronze/20 p-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-bronze">Knowledge Graph</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Graph Content */}
        <div className="pt-16 h-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-bronze">Loading knowledge graph...</div>
            </div>
          ) : (
            <div className="relative h-full">
              {/* Simple node visualization for now */}
              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {nodes.map(node => (
                    <div
                      key={node.id}
                      onClick={() => handleNodeClick(node)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        node.type === 'document'
                          ? 'bg-charcoal border-bronze/50 hover:border-bronze'
                          : 'bg-charcoal-light border-bronze/20 hover:border-bronze/50'
                      }`}
                    >
                      <div className="text-xs text-bronze uppercase tracking-wider mb-1">
                        {node.type}
                      </div>
                      <div className="text-white font-medium text-sm mb-2">
                        {node.phrase}
                      </div>
                      {node.excerpt && (
                        <div className="text-gray-400 text-xs line-clamp-2">
                          {node.excerpt}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        {node.connections.length} connections
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Node Detail Panel */}
              {selectedNode && (
                <div className="absolute bottom-0 left-0 right-0 bg-charcoal-light border-t border-bronze/20 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-bronze mb-2">{selectedNode.phrase}</h3>
                      {selectedNode.definition && (
                        <p className="text-gray-300 mb-3">{selectedNode.definition}</p>
                      )}
                      <div className="text-sm text-gray-400">
                        {selectedNode.connections.length} connections
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedNode(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}