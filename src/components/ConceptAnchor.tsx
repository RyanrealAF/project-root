import { useState, useEffect } from 'react';

interface ConceptAnchorProps {
  id: string;
  phrase: string;
  children?: React.ReactNode;
}

export default function ConceptAnchor({ id, phrase, children }: ConceptAnchorProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<any>(null);

  const handleMouseEnter = async () => {
    // Fetch related concepts and documents
    try {
      const response = await fetch(`/api/concepts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPopupData(data);
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Failed to load concept data:', error);
    }
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const handleClick = () => {
    // Show full knowledge graph overlay
    const event = new CustomEvent('showKnowledgeGraph', {
      detail: { conceptId: id, centeredOn: id }
    });
    window.dispatchEvent(event);
  };

  return (
    <span className="relative inline-block">
      <span
        className="cursor-pointer border-b border-bronze/50 hover:border-bronze transition-colors concept-anchor"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        data-concept-id={id}
      >
        {children || phrase}
      </span>

      {showPopup && popupData && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-80 bg-charcoal border border-bronze/20 rounded-lg shadow-xl p-4">
          <div className="text-sm text-bronze uppercase tracking-wider mb-2">
            {popupData.type || 'Concept'} • {popupData.connections?.length || 0} connections
          </div>
          <div className="text-white font-medium mb-2">{phrase}</div>
          {popupData.excerpt && (
            <div className="text-gray-400 text-sm mb-3 line-clamp-3">
              {popupData.excerpt}
            </div>
          )}
          {popupData.connections && popupData.connections.length > 0 && (
            <div className="text-xs text-gray-500 mb-3">
              Connected to: {popupData.connections.slice(0, 3).join(', ')}
              {popupData.connections.length > 3 && ` +${popupData.connections.length - 3} more`}
            </div>
          )}
          <div className="flex gap-2">
            <button
              className="text-bronze hover:text-white text-sm transition-colors"
              onClick={() => {
                setShowPopup(false);
                handleClick();
              }}
            >
              Explore Web →
            </button>
          </div>
        </div>
      )}
    </span>
  );
}