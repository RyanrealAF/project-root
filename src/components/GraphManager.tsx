import { useState, useEffect } from 'react';
import KnowledgeGraph from './KnowledgeGraph';

export default function GraphManager() {
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [centerConceptId, setCenterConceptId] = useState<string | undefined>();

  useEffect(() => {
    const handleShowGraph = (event: CustomEvent) => {
      setCenterConceptId(event.detail.conceptId || event.detail.centeredOn);
      setIsGraphOpen(true);
    };

    window.addEventListener('showKnowledgeGraph', handleShowGraph as EventListener);

    return () => {
      window.removeEventListener('showKnowledgeGraph', handleShowGraph as EventListener);
    };
  }, []);

  const handleClose = () => {
    setIsGraphOpen(false);
    setCenterConceptId(undefined);
  };

  return (
    <KnowledgeGraph
      centerConceptId={centerConceptId}
      isOpen={isGraphOpen}
      onClose={handleClose}
    />
  );
}