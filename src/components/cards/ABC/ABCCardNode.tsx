
"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit3Icon, Trash2Icon, PaletteIcon, LinkIcon as LinkIconLucide, ExternalLinkIcon, Users } from 'lucide-react';
import { useClinicalStore } from '@/stores/clinicalStore';
import type { ABCCardData, ABCCardColor } from '@/types/clinicalTypes';
import { cn } from '@/shared/utils';
import { highlightKeywords } from '@/utils/highlightKeywords';
import { CLINICAL_KEYWORDS } from '@/constants/keywords';

const cardColorStyles: Record<ABCCardColor, string> = {
  default: 'bg-card border-border text-card-foreground',
  red: 'bg-red-500/10 border-red-500/30 text-red-900 dark:bg-red-900/20 dark:border-red-700/50 dark:text-red-200',
  green: 'bg-green-500/10 border-green-500/30 text-green-900 dark:bg-green-900/20 dark:border-green-700/50 dark:text-green-200',
  blue: 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:bg-blue-900/20 dark:border-blue-700/50 dark:text-blue-200',
  yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-700/50 dark:text-yellow-200',
  purple: 'bg-purple-500/10 border-purple-500/30 text-purple-900 dark:bg-purple-900/20 dark:border-purple-700/50 dark:text-purple-200',
};

const groupColorToBorderClass: Record<string, string> = {
    "border-red-500": "border-red-500",
    "border-green-500": "border-green-500",
    "border-blue-500": "border-blue-500",
    "border-yellow-500": "border-yellow-500",
    "border-purple-500": "border-purple-500",
    "border-cyan-500": "border-cyan-500",
    "border-pink-500": "border-pink-500",
};


const ABCCardNode: React.FC<NodeProps<ABCCardData>> = ({ data, id, selected }) => {
  if (!data) {
    return (
      <div className="p-2 text-xs text-muted-foreground">Dados do card indisponíveis</div>
    );
  }
  const { schemas } = useClinicalStore();
  // console.log("LOG: Rendering ABCCardNode, ID:", id, "Data:", data);

  const isLinkedToSchema = schemas.some(schema => schema.linkedCardIds.includes(id));

  const cardStyle = cardColorStyles[data.color] || cardColorStyles.default;
  const textColorClass = data.color === 'default' ? 'text-card-foreground' :
                        data.color === 'red' ? 'text-red-900 dark:text-red-200' :
                        data.color === 'green' ? 'text-green-900 dark:text-green-200' :
                        data.color === 'blue' ? 'text-blue-900 dark:text-blue-200' :
                        data.color === 'yellow' ? 'text-yellow-900 dark:text-yellow-200' :
                        data.color === 'purple' ? 'text-purple-900 dark:text-purple-200' :
                        'text-card-foreground';

  const intensityBarColor = data.color === 'default' ? 'bg-primary' :
                            data.color === 'red' ? 'bg-red-500' :
                            data.color === 'green' ? 'bg-green-500' :
                            data.color === 'blue' ? 'bg-blue-500' :
                            data.color === 'yellow' ? 'bg-yellow-500' :
                            data.color === 'purple' ? 'bg-purple-500' :
                            'bg-primary';

  const groupBorderStyle = data.groupInfo ? groupColorToBorderClass[data.groupInfo.color] || 'border-primary' : '';


  const IntensityBar = ({ value, label }: { value?: number; label: string }) => (
    <div className={cn("text-xs", textColorClass)}>
      <span className="font-medium">{label}: </span>
      <div className="w-16 h-1.5 bg-muted rounded-full inline-block align-middle ml-1 mr-0.5">
        <div className={cn("h-full rounded-full", intensityBarColor)} style={{ width: `${value || 0}%` }}></div>
      </div>
      <span className="opacity-80">({value || 0}%)</span>
    </div>
  );

  const highlightClassName = "bg-yellow-100 dark:bg-yellow-700/30 dark:text-yellow-300 rounded px-0.5 font-medium";

  return (
    <Card
      className={cn(
        "w-72 shadow-md hover:shadow-lg transition-shadow duration-150 react-flow__node-default",
        cardStyle,
        selected && "ring-2 ring-accent ring-offset-2",
        data.groupInfo && `${groupBorderStyle} border-2` // Apply group border
      )}
      style={{minWidth: '280px', maxWidth: '320px'}}
    >
      <Handle type="target" position={Position.Top} id={`top-${id}`} />
      <Handle type="source" position={Position.Bottom} id={`bottom-${id}`} />
      <Handle type="target" position={Position.Left} id={`left-${id}`} />
      <Handle type="source" position={Position.Right} id={`right-${id}`} />

      <CardHeader className="p-3 space-y-1">
        <div className="flex justify-between items-start">
            <CardTitle className={cn("text-sm font-semibold line-clamp-2 leading-tight", textColorClass)}>{data.title}</CardTitle>
            <div className="flex items-center gap-1.5">
                {data.groupInfo && <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" title={`Grupo: ${data.groupInfo.name}`} />}
                {isLinkedToSchema && <LinkIconLucide className="h-3 w-3 text-muted-foreground flex-shrink-0" title="Vinculado a um Esquema" />}
            </div>
        </div>
        {data.groupInfo && (
            <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0.5 w-fit", data.groupInfo.color.replace('border-', 'text-').replace('-500', '-700 dark:text-'.concat(data.groupInfo.color.split('-')[1]).concat('-300')), data.groupInfo.color.replace('border-','bg-').concat('/10'))} title={data.groupInfo.name}>
                {data.groupInfo.name}
            </Badge>
        )}
      </CardHeader>
      <CardContent className="p-3 text-xs space-y-2">
        <div className={textColorClass}>
          <p className="font-medium">A:</p>
          <p className="pl-2 opacity-90 line-clamp-2">Ext: {highlightKeywords(data.antecedent.external, CLINICAL_KEYWORDS, highlightClassName)}</p>
          <p className="pl-2 opacity-90 line-clamp-2">Int: {highlightKeywords(data.antecedent.internal, CLINICAL_KEYWORDS, highlightClassName)}</p>
          <div className="pl-2 mt-0.5 space-y-0.5">
             <IntensityBar value={data.antecedent.thoughtBelief} label="Crença" />
             <IntensityBar value={data.antecedent.emotionIntensity} label="Emoção" />
          </div>
        </div>
        <div className={textColorClass}>
          <p className="font-medium">B:</p>
          <p className="pl-2 opacity-90 line-clamp-2">{highlightKeywords(data.behavior, CLINICAL_KEYWORDS, highlightClassName)}</p>
        </div>
        <div className={textColorClass}>
          <p className="font-medium">C:</p>
          <p className="pl-2 opacity-90 line-clamp-2">Curto (Ganho): {highlightKeywords(data.consequence.shortTermGain, CLINICAL_KEYWORDS, highlightClassName)}</p>
          <p className="pl-2 opacity-90 line-clamp-2">Curto (Custo): {highlightKeywords(data.consequence.shortTermCost, CLINICAL_KEYWORDS, highlightClassName)}</p>
          <p className="pl-2 opacity-90 line-clamp-2">Longo Prazo (Valores): {highlightKeywords(data.consequence.longTermValueCost, CLINICAL_KEYWORDS, highlightClassName)}</p>
        </div>
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {data.tags.map(tag => <Badge key={tag} variant="secondary" className={cn("text-[10px] px-1.5 py-0.5", data.color !== 'default' ? 'bg-opacity-20' : '')}>{tag}</Badge>)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(ABCCardNode);
