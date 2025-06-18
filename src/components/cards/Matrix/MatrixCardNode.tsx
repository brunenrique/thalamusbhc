"use client";

import React from "react";
import type { NodeProps } from "reactflow";

interface MatrixCardData {
  matrix?: string[][];
}

const MatrixCardNode: React.FC<NodeProps<MatrixCardData>> = ({ data }) => {
  if (!data?.matrix) {
    return <div className="p-2 text-xs text-muted-foreground">Dados não informados</div>;
  }

  const columns = data.matrix[0]?.length || 0;

  return (
    <div className="p-3 border rounded bg-card text-sm space-y-1">
      {data.matrix.map((row, rowIndex) => (
        <div key={rowIndex} className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
          {row.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="p-1 border text-center" aria-label={`Linha ${rowIndex + 1} coluna ${colIndex + 1}`}>{cell || "-"}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MatrixCardNode;
