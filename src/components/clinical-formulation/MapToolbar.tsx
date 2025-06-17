
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Share2,
  PanelLeftOpen,
  PanelLeftClose,
  // ListChecks, // Replaced by HelpCircle for FormulationGuide
  StickyNote,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Lightbulb,
  Save,
  RotateCcw,
  Users,
  HelpCircle, // Para o Guia de Formulação
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
  selectedFlowNodes: Node[];
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

  const commonButtonClass = "h-7 w-7";
  const commonIconClass = "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm p-1 rounded-lg shadow-md border border-border">
      <Button variant="ghost" size="icon" className={commonButtonClass} onClick={toggleSchemaPanelVisibility} title={isSchemaPanelVisible ? "Ocultar Painel de Esquemas" : "Mostrar Painel de Esquemas"}>
        {isSchemaPanelVisible ? <PanelLeftClose className={commonIconClass} /> : <PanelLeftOpen className={commonIconClass} />}
      </Button>
      <Button variant="ghost" size="icon" className={commonButtonClass} onClick={toggleFormulationGuidePanelVisibility} title={isFormulationGuidePanelVisible ? "Ocultar Guia de Formulação" : "Mostrar Guia de Formulação"}>
        <HelpCircle className={commonIconClass} />
      </Button>
      <Button variant="ghost" size="icon" className={commonButtonClass} onClick={toggleQuickNotesPanelVisibility} title={isQuickNotesPanelVisible ? "Ocultar Notas Rápidas" : "Mostrar Notas Rápidas"}>
        <StickyNote className={commonIconClass} />
      </Button>

      <Button variant="ghost" size="icon" className={commonButtonClass} onClick={() => openABCForm()} title="Novo Card ABC">
        <PlusCircle className={commonIconClass} />
      </Button>
      <Button variant="ghost" size="icon" className={commonButtonClass} onClick={() => openSchemaForm()} title="Novo Esquema/Regra">
        <Share2 className={commonIconClass} />
      </Button>

      <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className={commonButtonClass} disabled={selectedAbcCardIds.length === 0} title="Criar Grupo Temático">
            <Users className={commonIconClass} />
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

      <Button variant="ghost" size="icon" className={commonButtonClass} onClick={() => openQuickNoteForm()} title="Adicionar Nota Rápida ao Mapa">
        <StickyNote className={commonIconClass} />
      </Button>

      <div className="flex items-center gap-1 p-1 border rounded-md bg-muted/50 h-7">
        <Slider
          id="emotion-intensity-slider"
          min={0}
          max={100}
          step={10}
          value={[emotionIntensityFilter]}
          onValueChange={(value) => setEmotionIntensityFilter(value[0])}
          className="w-20"
          title={`Filtrar cards com intensidade emocional no antecedente >= ${emotionIntensityFilter}`}
        />
        <span className="text-xs text-muted-foreground w-5 text-right">{emotionIntensityFilter}</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setEmotionIntensityFilter(0)} title="Resetar filtro de intensidade">
            <RotateCcw className="h-3 w-3"/>
        </Button>
      </div>

      <Button variant="ghost" size="icon" onClick={toggleFullscreen} title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"} className={commonButtonClass}>
        {isFullscreen ? <Minimize className={commonIconClass} /> : <Maximize className={commonIconClass} />}
      </Button>
      <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Aumentar Zoom" className={commonButtonClass}>
        <ZoomIn className={commonIconClass} />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Diminuir Zoom" className={commonButtonClass}>
        <ZoomOut className={commonIconClass} />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleGenerateInsights} disabled={isGeneratingInsights} title="Gerar Insights de IA" className={commonButtonClass}>
        <Lightbulb className={commonIconClass} /> {isGeneratingInsights && <span className="text-xs ml-0.5">...</span>}
      </Button>
      <Button variant="default" size="icon" onClick={handleSaveLayout} className="bg-accent hover:bg-accent/90 text-accent-foreground h-7 w-7" title="Salvar estudo de caso">
        <Save className={commonIconClass} />
      </Button>
    </div>
  );
}
