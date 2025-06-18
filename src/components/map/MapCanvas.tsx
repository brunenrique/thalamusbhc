'use client';
import React, { useMemo, useRef, useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import CardRouter from '@/components/cards/common/CardRouter';
import type { BaseCard } from '@/types/cards';

const nodeTypes = {
  card: ({ data }: any) => <CardRouter card={data.card} />,
};

interface MapCanvasProps {
  cards: BaseCard[];
}

const MapCanvas: React.FC<MapCanvasProps> = ({ cards }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  const nodes = useMemo(() =>
    cards.map((card, idx) => ({
      id: card.id,
      type: 'card',
      position: { x: idx * 180, y: 0 },
      data: { card },
    })), [cards]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px]"
      role="application"
      tabIndex={0}
    >
      {loadError ? (
        <div className="flex items-center justify-center h-full text-sm">
          Não foi possível carregar o mapa.
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={[]}
          nodeTypes={nodeTypes}
          fitView
          zoomOnScroll
          onError={() => setLoadError(true)}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      )}
    </div>
  );
};

export default MapCanvas;
