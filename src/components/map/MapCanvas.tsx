'use client';
import React, { useMemo } from 'react';
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
  const nodes = useMemo(() =>
    cards.map((card, idx) => ({
      id: card.id,
      type: 'card',
      position: { x: idx * 180, y: 0 },
      data: { card },
    })), [cards]);

  return (
    <div className="w-full h-[600px]">
      <ReactFlow nodes={nodes} edges={[]} nodeTypes={nodeTypes} fitView zoomOnScroll>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default MapCanvas;
