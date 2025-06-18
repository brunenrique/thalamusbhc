"use client";

import React from "react";
import type { NodeProps } from "reactflow";

interface ChainCardData {
  steps: { question: string; answer?: string }[];
}

const ChainCardNode: React.FC<NodeProps<ChainCardData>> = ({ data }) => {
  if (!data) {
    return <div className="p-2 text-xs text-muted-foreground">Dados indisponíveis</div>;
  }

  return (
    <div className="p-3 border rounded bg-card text-sm space-y-1">
      {data.steps.map((step, idx) => (
        <div key={`${idx}-${step.question}`}
             className="flex flex-col">
          <span className="font-medium">{step.question}</span>
          <span className="ml-1">{step.answer || "-"}</span>
        </div>
      ))}
    </div>
  );
};

export default ChainCardNode;
