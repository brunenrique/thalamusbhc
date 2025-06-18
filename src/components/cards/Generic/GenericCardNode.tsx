"use client";

import React from "react";
import type { NodeProps } from "reactflow";

export interface GenericCardNodeData {
  fields?: Record<string, string>;
}

const GenericCardNode: React.FC<NodeProps<GenericCardNodeData>> = ({ data }) => {
  if (!data?.fields) {
    return <div className="p-2 text-xs text-muted-foreground">Configuração incompleta</div>;
  }

  return (
    <div className="p-3 border rounded bg-card text-sm space-y-1">
      {Object.entries(data.fields).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="font-medium mr-2">{key}:</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};

export default GenericCardNode;
