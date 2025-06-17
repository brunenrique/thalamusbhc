
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Share2,
  PanelLeftOpen,
  PanelLeftClose,
  ListChecks,
  StickyNote,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Lightbulb,
  Save,
  SlidersHorizontal,
  RotateCcw,
  Users, // Placeholder for Grouping
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

interface MapToolbarProps {
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleGenerateInsights: () => void;
  isGeneratingInsights: boolean;
  handleSaveLayout: () => void;
  selectedFlowNodes: Node[]; // Nodes currently selected in React Flow
}

const groupBorderColors = [
    { label: "Vermelho", value: "border-red-500", badgeBg: "bg-red-500/20" },
    { label: "Verde", value: "border-green-500", badgeBg: "bg-green-500/20" },
    { label: "Azul", value: "border-blue-500", badgeBg: "bg-blue-500/20" },
    { label: "Amarelo", value: "border-yellow-500", badgeBg: "bg-yellow-500/20" },
    { label: "Roxo", value: "border-purple-500", badgeBg: "bg-purple-500/20" },
    { label: "Ciano", value: "border-cyan-500", badgeBg: "bg-cyan-500/20" },
    { label: "Rosa", value: "border-pink-500", badgeBg: "bg-pink-500/20" },
];


export default function MapToolbar({
  toggleFullscreen,
  isFullscreen,
  handleZoomIn,
  handleZoomOut,
  handleGenerateInsights,
  isGeneratingInsights,
  handleSaveLayout,
  selectedFlowNodes,
}: MapToolbarProps) {
  const {
    openABCForm,
    openSchemaForm,
    isSchemaPanelVisible,
    toggleSchemaPanelVisibility,
    isFormulationGuidePanelVisible,
    toggleFormulationGuidePanelVisibility,
    isQuickNotesPanelVisible,
    toggleQuickNotesPanelVisibility,
    emotionIntensityFilter,
    setEmotionIntensityFilter,
    openQuickNoteForm,
    createGroupFromSelectedNodes,
  } = useClinicalStore();

  const { toast } = useToast();
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState(groupBorderColors[0].value);

  const selectedAbcCardIds = selectedFlowNodes
    .filter(node => node.type === 'abcCard')
    .map(node => node.id);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast({ title: "Nome do Grupo", description: "Por favor, insira um nome para o grupo.", variant: "destructive"});
      return;
    }
    if (selectedAbcCardIds.length < 1) { // Allow grouping even a single card
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
    <div className="flex items-center flex-wrap gap-1.5 bg-background/90 backdrop-blur-sm p-1.5 rounded-lg shadow-md border border-border">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleSchemaPanelVisibility} title={isSchemaPanelVisible ? "Ocultar Painel de Esquemas" : "Mostrar Painel de Esquemas"}>
        {isSchemaPanelVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleFormulationGuidePanelVisibility} title={isFormulationGuidePanelVisible ? "Ocultar Guia de Formulação" : "Mostrar Guia de Formulação"}>
        <ListChecks className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleQuickNotesPanelVisibility} title={isQuickNotesPanelVisible ? "Ocultar Notas Rápidas" : "Mostrar Notas Rápidas"}>
        <StickyNote className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="sm" className="h-8 px-2.5" onClick={() => openABCForm()} title="Novo Card ABC">
        <PlusCircle className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Card</span>
      </Button>
      <Button variant="outline" size="sm" className="h-8 px-2.5" onClick={() => openSchemaForm()} title="Novo Esquema/Regra">
        <Share2 className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Esquema</span>
      </Button>

      <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 px-2.5" disabled={selectedAbcCardIds.length === 0} title="Criar Grupo Temático com Cards Selecionados">
            <Users className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Grupo</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Grupo Temático</DialogTitle>
            <DialogDescription>Dê um nome e escolha uma cor para o grupo de cards selecionados ({selectedAbcCardIds.length} card(s)).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label htmlFor="group-name">Nome do Grupo</Label>
              <Input id="group-name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Ex: Ciclo de Evitação"/>
            </div>
            <div>
              <Label htmlFor="group-color">Cor da Borda do Grupo</Label>
              <Select value={newGroupColor} onValueChange={setNewGroupColor}>
                <SelectTrigger id="group-color">
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

      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openQuickNoteForm()} title="Adicionar Nota Rápida ao Mapa">
        <StickyNote className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1.5 p-1.5 border rounded-md bg-background">
        <Label htmlFor="emotion-intensity-slider" className="text-xs text-muted-foreground whitespace-nowrap hidden md:inline">Int. Emoção (Ant.):</Label>
        <Slider
          id="emotion-intensity-slider"
          min={0}
          max={100}
          step={10}
          value={[emotionIntensityFilter]}
          onValueChange={(value) => setEmotionIntensityFilter(value[0])}
          className="w-20 md:w-24"
          title={`Filtrar cards com intensidade emocional no antecedente >= ${emotionIntensityFilter}`}
        />
        <span className="text-xs text-muted-foreground w-6 text-right">{emotionIntensityFilter}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEmotionIntensityFilter(0)} title="Resetar filtro de intensidade">
            <RotateCcw className="h-3 w-3"/>
        </Button>
      </div>

      <Button variant="outline" size="icon" onClick={toggleFullscreen} title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"} className="h-8 w-8">
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </Button>
      <Button variant="outline" size="icon" onClick={handleZoomIn} title="Aumentar Zoom" className="h-8 w-8">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleZoomOut} title="Diminuir Zoom" className="h-8 w-8">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={handleGenerateInsights} disabled={isGeneratingInsights} title="Gerar Insights de IA" className="h-8 px-2.5">
        <Lightbulb className="h-4 w-4 mr-1" /> {isGeneratingInsights ? "..." : "IA"}
      </Button>
      <Button variant="default" size="sm" onClick={handleSaveLayout} className="bg-accent hover:bg-accent/90 text-accent-foreground h-8 px-2.5" title="Salvar estudo de caso">
        <Save className="h-4 w-4 mr-1" /> <span className="hidden lg:inline">Salvar</span>
      </Button>
    </div>
  );
}
