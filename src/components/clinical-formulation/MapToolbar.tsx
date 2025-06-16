
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Palette, Eye, EyeOff, Filter } from 'lucide-react';
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
  const { activeColorFilters, setColorFilters, showSchemaNodes, toggleShowSchemaNodes } = useClinicalStore();

  const handleColorFilterChange = (color: ABCCardColor) => {
    const newFilters = activeColorFilters.includes(color)
      ? activeColorFilters.filter(c => c !== color)
      : [...activeColorFilters, color];
    setColorFilters(newFilters);
  };

  return (
    <Card className="w-full shadow-md mb-2">
      <CardHeader className="p-3 border-b">
        <CardTitle className="text-md font-headline flex items-center">
          <Filter className="h-4 w-4 mr-2 text-primary" />
          Filtros do Mapa
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        <div>
          <Label className="text-sm font-medium flex items-center mb-1.5">
            <Palette className="h-4 w-4 mr-1.5 text-muted-foreground" />
            Cores dos Cards ABC
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1.5">
            {colorFilterOptions.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-filter-${opt.value}`}
                  checked={activeColorFilters.includes(opt.value)}
                  onCheckedChange={() => handleColorFilterChange(opt.value)}
                  aria-label={`Filtrar por cor ${opt.label}`}
                />
                <Label
                  htmlFor={`color-filter-${opt.value}`}
                  className="text-xs font-normal flex items-center cursor-pointer"
                >
                  <span className={cn("w-3 h-3 rounded-sm mr-1.5 inline-block border", opt.style.split(' ')[0], opt.style.split(' ')[1])}></span>
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="show-schemas-toggle" className="text-sm font-medium flex items-center">
            {showSchemaNodes 
                ? <Eye className="h-4 w-4 mr-1.5 text-muted-foreground" /> 
                : <EyeOff className="h-4 w-4 mr-1.5 text-muted-foreground" />
            }
            Mostrar Esquemas/Regras
          </Label>
          <Switch
            id="show-schemas-toggle"
            checked={showSchemaNodes}
            onCheckedChange={toggleShowSchemaNodes}
            aria-label="Mostrar ou ocultar nós de esquema"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapToolbar;
