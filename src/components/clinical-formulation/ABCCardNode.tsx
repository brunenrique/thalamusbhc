
"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit3Icon, Trash2Icon, PaletteIcon, LinkIcon as LinkIconLucide, ExternalLinkIcon } from 'lucide-react';
import useClinicalStore from '@/stores/clinicalStore';
import type { ABCCardData } from '@/types/clinicalTypes';
import { cn } from '@/shared/utils';

const cardColorStyles = {
  default: 'bg-card border-border',
  red: 'bg-red-500/10 border-red-500/30 text-red-900 dark:bg-red-900/20 dark:border-red-700/50 dark:text-red-200',
  green: 'bg-green-500/10 border-green-500/30 text-green-900 dark:bg-green-900/20 dark:border-green-700/50 dark:text-green-200',
  blue: 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:bg-blue-900/20 dark:border-blue-700/50 dark:text-blue-200',
  yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-700/50 dark:text-yellow-200',
  purple: 'bg-purple-500/10 border-purple-500/30 text-purple-900 dark:bg-purple-900/20 dark:border-purple-700/50 dark:text-purple-200',
};

const ABCCardNode: React.FC<NodeProps<ABCCardData>> = ({ data, id, selected }) => {
  const { deleteCard, openABCForm, schemas } = useClinicalStore();
  const { setNodes } = useReactFlow();

  const isLinkedToSchema = schemas.some(schema => schema.linkedCardIds.includes(id));

  const cardStyle = cardColorStyles[data.color] || cardColorStyles.default;

  // Mini-slider visual (não interativo, apenas display)
  const IntensityBar = ({ value, label }: { value?: number; label: string }) => (
    <div className="text-xs">
      <span className="font-medium">{label}: </span>
      <div className="w-16 h-1.5 bg-muted rounded-full inline-block align-middle ml-1 mr-0.5">
        <div className="h-full bg-primary rounded-full" style={{ width: `${value || 0}%` }}></div>
      </div>
      <span className="text-muted-foreground">({value || 0}%)</span>
    </div>
  );

  return (
    <Card 
      className={cn(
        "w-72 shadow-md hover:shadow-lg transition-shadow duration-150", 
        cardStyle,
        selected && "ring-2 ring-accent ring-offset-2"
      )}
      style={{minWidth: '280px', maxWidth: '320px'}}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-400" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-400" />
      <Handle type="target" position={Position.Left} id={`left-${id}`} className="!bg-slate-400" />
      <Handle type="source" position={Position.Right} id={`right-${id}`} className="!bg-slate-400" />

      <CardHeader className="p-3 space-y-1">
        <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">{data.title}</CardTitle>
            {isLinkedToSchema && <LinkIconLucide className="h-3 w-3 text-muted-foreground flex-shrink-0" title="Vinculado a um Esquema" />}
        </div>
      </CardHeader>
      <CardContent className="p-3 text-xs space-y-2">
        <div>
          <p className="font-medium">A:</p>
          <p className="pl-2 text-muted-foreground line-clamp-2">Ext: {data.antecedent.external}</p>
          <p className="pl-2 text-muted-foreground line-clamp-2">Int: {data.antecedent.internal}</p>
          <div className="pl-2 mt-0.5 space-y-0.5">
             <IntensityBar value={data.antecedent.thoughtBelief} label="Crença" />
             <IntensityBar value={data.antecedent.emotionIntensity} label="Emoção" />
          </div>
        </div>
        <div>
          <p className="font-medium">B:</p>
          <p className="pl-2 text-muted-foreground line-clamp-2">{data.behavior}</p>
        </div>
        <div>
          <p className="font-medium">C:</p>
          <p className="pl-2 text-muted-foreground line-clamp-2">Curto (Ganho): {data.consequence.shortTermGain}</p>
          <p className="pl-2 text-muted-foreground line-clamp-2">Curto (Custo): {data.consequence.shortTermCost}</p>
          <p className="pl-2 text-muted-foreground line-clamp-2">Longo Prazo (Valores): {data.consequence.longTermValueCost}</p>
        </div>
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {data.tags.map(tag => <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5">{tag}</Badge>)}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 border-t flex justify-end gap-1">
        {/* <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => console.log('Change color for', id)}><PaletteIcon className="h-3.5 w-3.5" /></Button> */}
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openABCForm(id)} aria-label={`Editar card ${data.title}`}>
            <Edit3Icon className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => deleteCard(id)} aria-label={`Deletar card ${data.title}`}>
            <Trash2Icon className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default memo(ABCCardNode);
