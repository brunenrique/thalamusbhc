
"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link2Icon } from 'lucide-react';
import useClinicalStore from '@/stores/clinicalStore';
import type { SchemaData } from '@/types/clinicalTypes';
import { cn } from '@/shared/utils';

const SchemaNode: React.FC<NodeProps<SchemaData>> = ({ data, id, selected }) => {
  const { openABCForm } = useClinicalStore(); 
  console.log("LOG: Rendering SchemaNode, ID:", id, "Data:", data);

  return (
    <Card 
        className={cn(
            "w-64 shadow-md hover:shadow-lg transition-shadow duration-150 border-blue-500/40 bg-blue-500/5 text-blue-900 dark:bg-blue-900/10 dark:border-blue-700/50 dark:text-blue-200",
            selected && "ring-2 ring-accent ring-offset-2"
        )}
        style={{minWidth: '240px', maxWidth: '280px'}}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-400" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
      <Handle type="target" position={Position.Left} id={`left-${id}`} className="!bg-slate-400" />
      <Handle type="source" position={Position.Right} id={`right-${id}`} className="!bg-slate-400" />
      
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-semibold leading-tight line-clamp-3">{data.rule}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-xs">
        <div className="flex items-center">
            <Link2Icon className="h-3 w-3 mr-1.5 text-muted-foreground" />
            <span className="text-muted-foreground">Cards Vinculados: </span>
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0.5">
                {data.linkedCardIds?.length || 0}
            </Badge>
        </div>
        {data.notes && <p className="mt-1.5 text-muted-foreground italic line-clamp-2">{data.notes}</p>}
      </CardContent>
    </Card>
  );
};

export default memo(SchemaNode);
