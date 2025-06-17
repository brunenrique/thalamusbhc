
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Share2,
  Users,
  StickyNote,
  Lightbulb,
  Save,
  RotateCcw,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import useClinicalStore from '@/stores/clinicalStore';
import type { Node } from 'reactflow';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';

const groupBorderColors = [
    { label: "Vermelho", value: "border-red-500", badgeBg: "bg-red-500/20" },
    { label: "Verde", value: "border-green-500", badgeBg: "bg-green-500/20" },
    { label: "Azul", value: "border-blue-500", badgeBg: "bg-blue-500/20" },
    { label: "Amarelo", value: "border-yellow-500", badgeBg: "bg-yellow-500/20" },
    { label: "Roxo", value: "border-purple-500", badgeBg: "bg-purple-500/20" },
    { label: "Ciano", value: "border-cyan-500", badgeBg: "bg-cyan-500/20" },
    { label: "Rosa", value: "border-pink-500", badgeBg: "bg-pink-500/20" },
];

interface MapToolbarProps {
  onGenerateInsights: () => Promise<void>;
  onSaveLayout: () => void;
  isGeneratingInsights: boolean;
}

export default function MapToolbar({ onGenerateInsights, onSaveLayout, isGeneratingInsights }: MapToolbarProps) {
  const {
    openABCForm,
    openSchemaForm,
    emotionIntensityFilter,
    setEmotionIntensityFilter,
    openQuickNoteForm,
    createGroupFromSelectedNodes,
    selectedFlowNodes,
  } = useClinicalStore(state => ({
    openABCForm: state.openABCForm,
    openSchemaForm: state.openSchemaForm,
    emotionIntensityFilter: state.emotionIntensityFilter,
    setEmotionIntensityFilter: state.setEmotionIntensityFilter,
    openQuickNoteForm: state.openQuickNoteForm,
    createGroupFromSelectedNodes: state.createGroupFromSelectedNodes,
    selectedFlowNodes: state.selectedFlowNodes,
  }));

  const { toast } = useToast();
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState(groupBorderColors[0].value);

  const selectedAbcCardIds = (selectedFlowNodes || [])
    .filter(node => node.type === 'abcCard')
    .map(node => node.id);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast({ title: "Nome do Grupo", description: "Por favor, insira um nome para o grupo.", variant: "destructive"});
      return;
    }
    if (selectedAbcCardIds.length < 1) {
      toast({ title: "Seleção de Cards", description: "Selecione pelo menos um card ABC para agrupar.", variant: "destructive"});
      return;
    }
    createGroupFromSelectedNodes(newGroupName, newGroupColor, selectedAbcCardIds);
    toast({ title: "Grupo Criado", description: `Grupo "${newGroupName}" criado com os cards selecionados.`});
    setNewGroupName("");
    setNewGroupColor(groupBorderColors[0].value);
    setIsCreateGroupDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-1 p-1.5 rounded-lg bg-background/90 backdrop-blur-sm shadow-md border border-border">
      
      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => openABCForm()} title="Novo Card ABC">
        <PlusCircle className="h-3.5 w-3.5" />
      </Button>
      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => openSchemaForm()} title="Novo Esquema/Regra">
        <Share2 className="h-3.5 w-3.5" />
      </Button>
      <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="h-7 w-7" disabled={selectedAbcCardIds.length === 0} title="Criar Grupo Temático">
            <Users className="h-3.5 w-3.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
           <DialogHeader>
            <DialogTitle>Criar Novo Grupo Temático</DialogTitle>
            <DialogDescription>Dê um nome e escolha uma cor para o grupo de cards selecionados ({selectedAbcCardIds.length} card(s)).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label htmlFor="group-name-map-toolbar">Nome do Grupo</Label>
              <Input id="group-name-map-toolbar" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Ex: Ciclo de Evitação"/>
            </div>
            <div>
              <Label htmlFor="group-color-map-toolbar">Cor da Borda do Grupo</Label>
              <Select value={newGroupColor} onValueChange={setNewGroupColor}>
                <SelectTrigger id="group-color-map-toolbar">
                  <SelectValue placeholder="Escolha uma cor" />
                </SelectTrigger>
                <SelectContent>
                  {groupBorderColors.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${color.badgeBg} border ${color.value}`}></span>
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateGroupDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateGroup} className="bg-accent hover:bg-accent/90 text-accent-foreground">Criar Grupo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => openQuickNoteForm()} title="Adicionar Nota Rápida ao Mapa">
        <StickyNote className="h-3.5 w-3.5" />
      </Button>
      
      <div className="flex items-center gap-0.5 p-0.5 border rounded-md bg-muted/30 h-7">
        <Slider
          min={0} max={100} step={10}
          value={[emotionIntensityFilter]}
          onValueChange={(value) => setEmotionIntensityFilter(value[0])}
          className="w-20" 
          title={`Filtrar cards com intensidade emocional (antecedente) >= ${emotionIntensityFilter}`}
        />
        <span className="text-[9px] text-muted-foreground w-4 text-right px-0.5">{emotionIntensityFilter}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setEmotionIntensityFilter(0)} title="Resetar filtro de intensidade">
          <RotateCcw className="h-2.5 w-2.5"/>
        </Button>
      </div>

      <Button variant="outline" size="icon" onClick={onGenerateInsights} disabled={isGeneratingInsights} title="Gerar Insights de IA" className="h-7 w-7">
        <Lightbulb className="h-3.5 w-3.5" /> {isGeneratingInsights && <span className="text-xs animate-pulse">...</span>}
      </Button>
      <Button variant="default" size="icon" onClick={onSaveLayout} className="bg-accent hover:bg-accent/90 text-accent-foreground h-7 w-7" title="Salvar estudo de caso">
        <Save className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
