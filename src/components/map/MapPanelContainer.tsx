import React from 'react';
import { useClinicalStore } from '@/stores/clinicalStore';
import HexaflexPanel from './panels/HexaflexPanel';

// Placeholder components for other panels
const ChainAnalysisPanel: React.FC = () => (
  <div className="p-4 border-l border-border bg-background w-72 overflow-y-auto">
    <h3 className="text-lg font-semibold mb-4">Painel de Análise em Cadeia (Placeholder)</h3>
    <p className="text-muted-foreground">Este é um painel placeholder para a Análise em Cadeia.</p>
  </div>
);
const ActMatrixPanel: React.FC = () => (
  <div className="p-4 border-l border-border bg-background w-72 overflow-y-auto">
    <h3 className="text-lg font-semibold mb-4">Painel da Matriz ACT (Placeholder)</h3>
    <p className="text-muted-foreground">Este é um painel placeholder para a Matriz ACT.</p>
  </div>
);

const MapPanelContainer: React.FC = () => {
  const activePanel = useClinicalStore((state) => state.activePanel);

  return (
    <div className="absolute top-0 right-0 bottom-0 z-10 pointer-events-none">
      {/* Use pointer-events-auto on the actual panels if needed */}
      {(() => {
        switch (activePanel) {
          case 'hexaflex':
            return <HexaflexPanel />;
          case 'chain':
            return <ChainAnalysisPanel />;
          case 'matrix':
            return <ActMatrixPanel />;
          default:
            return null; // No panel active
        }
      })()}
    </div>
  );
};

export default MapPanelContainer;