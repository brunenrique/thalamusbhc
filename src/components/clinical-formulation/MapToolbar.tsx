
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Palette, Eye, EyeOff, Filter, PlusCircle, Share2 } from 'lucide-react';
import useClinicalStore from '@/stores/clinicalStore';
import type { ABCCardColor } from '@/types/clinicalTypes';
import { cn } from '@/shared/utils';

const colorFilterOptions: { label: string; value: ABCCardColor, style: string }[] = [
  { label: 'Padrão', value: 'default', style: 'bg-card border-border' },
  { label: 'Alerta', value: 'red', style: 'bg-red-500/20 border-red-500/40' },
  { label: 'Positivo', value: 'green', style: 'bg-green-500/20 border-green-500/40' },
  { label: 'Neutro', value: 'blue', style: 'bg-blue-500/20 border-blue-500/40' },
  { label: 'Observação', value: 'yellow', style: 'bg-yellow-500/20 border-yellow-500/40' },
  { label: 'Hipótese', value: 'purple', style: 'bg-purple-500/20 border-purple-500/40' },
];

const MapToolbar: React.FC = () => {
  const { 
    activeColorFilters, 
    setColorFilters, 
    showSchemaNodes, 
    toggleShowSchemaNodes,
    openABCForm,
    openSchemaForm
  } = useClinicalStore();

  const handleColorFilterChange = (color: ABCCardColor) => {
    const newFilters = activeColorFilters.includes(color)
      ? activeColorFilters.filter(c => c !== color)
      : [...activeColorFilters, color];
    setColorFilters(newFilters);
  };

  return (
    <div className="p-3 space-y-4 w-64"> {/* Ajustado padding e largura */}
      <div>
        <Label className="text-sm font-semibold flex items-center mb-2">
          Adicionar Elementos
        </Label>
        <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => openABCForm()}>
                <PlusCircle className="h-4 w-4 mr-2 text-accent"/> Novo Card ABC
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => openSchemaForm()}>
                <Share2 className="h-4 w-4 mr-2 text-accent"/> Novo Esquema/Regra 
            </Button>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold flex items-center">
          <Filter className="h-4 w-4 mr-1.5 text-primary" />
          Filtros de Visualização
        </Label>
      </div>
      <div>
        <Label className="text-xs font-medium flex items-center mb-1.5 text-muted-foreground">
          <Palette className="h-3.5 w-3.5 mr-1.5" />
          Cores dos Cards ABC
        </Label>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {colorFilterOptions.map(opt => (
            <div key={opt.value} className="flex items-center space-x-2">
              <Checkbox
                id={`color-filter-${opt.value}`}
                checked={activeColorFilters.includes(opt.value)}
                onCheckedChange={() => handleColorFilterChange(opt.value)}
                aria-label={`Filtrar por cor ${opt.label}`}
                className="h-3.5 w-3.5"
              />
              <Label
                htmlFor={`color-filter-${opt.value}`}
                className="text-xs font-normal flex items-center cursor-pointer"
              >
                <span className={cn("w-2.5 h-2.5 rounded-sm mr-1.5 inline-block border", opt.style.split(' ')[0], opt.style.split(' ')[1])}></span>
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <Label htmlFor="show-schemas-toggle" className="text-xs font-medium flex items-center text-muted-foreground">
          {showSchemaNodes 
              ? <Eye className="h-3.5 w-3.5 mr-1.5" /> 
              : <EyeOff className="h-3.5 w-3.5 mr-1.5" />
          }
          Mostrar Esquemas/Regras
        </Label>
        <Switch
          id="show-schemas-toggle"
          checked={showSchemaNodes}
          onCheckedChange={toggleShowSchemaNodes}
          aria-label="Mostrar ou ocultar nós de esquema"
          className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-5 w-9 [&>span]:h-4 [&>span]:w-4 [&>span[data-state=checked]]:translate-x-4 [&>span[data-state=unchecked]]:translate-x-0"
        />
      </div>
    </div>
  );
};

export default MapToolbar;
