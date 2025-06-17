
"use client";

import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge as rfAddEdge,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  useReactFlow,
  SelectionMode,
  Panel,
  ReactFlowProvider,
  NodeMouseEvent,
  EdgeMouseEvent,
  OnSelectionChangeParams,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useClinicalStore from '@/stores/clinicalStore';
import ABCCardNode from './ABCCardNode';
import SchemaNode from './SchemaNode';
// Panels that were previously separate components
import SchemaPanel from './SchemaPanel';
import FormulationGuidePanel from './FormulationGuidePanel';
import QuickNotesPanel from './QuickNotesPanel';
// Forms and Modals
import QuickNoteForm from './QuickNoteForm';
import NodeContextMenu from './NodeContextMenu';
import ABCForm from './ABCForm';
import SchemaForm from './SchemaForm';
import EdgeLabelModal from './EdgeLabelModal';
import type { ClinicalNodeData, ConnectionLabel, SchemaData, ABCCardData, ClinicalNodeType, QuickNote } from '@/types/clinicalTypes';
import { isABCCardData, isSchemaData } from '@/types/clinicalTypes';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/shared/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  PanelLeftOpen, PanelLeftClose, HelpCircle as FormulationGuideIcon, CheckSquare, StickyNote, Maximize, Minimize, ZoomIn, ZoomOut, Settings, ListTree,
  PlusCircle, Share2, Users, Lightbulb, Save, RotateCcw, GripVertical, GripHorizontal, MessageSquare
} from 'lucide-react';


const nodeTypes = {
  abcCard: ABCCardNode,
  schemaNode: SchemaNode,
};

const initialViewport = { x: 0, y: 0, zoom: 0.9 };

const groupBorderColors = [
    { label: "Vermelho", value: "border-red-500", badgeBg: "bg-red-500/20" },
    { label: "Verde", value: "border-green-500", badgeBg: "bg-green-500/20" },
    { label: "Azul", value: "border-blue-500", badgeBg: "bg-blue-500/20" },
    { label: "Amarelo", value: "border-yellow-500", badgeBg: "bg-yellow-500/20" },
    { label: "Roxo", value: "border-purple-500", badgeBg: "bg-purple-500/20" },
    { label: "Ciano", value: "border-cyan-500", badgeBg: "bg-cyan-500/20" },
    { label: "Rosa", value: "border-pink-500", badgeBg: "bg-pink-500/20" },
];


const FormulationMap: React.FC = () => {
  const {
    nodes: storeNodes,
    edges,
    onNodesChange: storeOnNodesChange,
    onEdgesChange: storeOnEdgesChange,
    openLabelEdgeModal,
    setViewport: storeSetViewport,
    updateCardPosition,
    updateSchemaPosition,
    fetchClinicalData,
    saveClinicalData,
    setInsights,
    openContextMenu,
    closeContextMenu,
    isContextMenuOpen,
    activeColorFilters,
    showSchemaNodes,
    isSchemaPanelVisible,
    toggleSchemaPanelVisibility,
    isFormulationGuidePanelVisible,
    toggleFormulationGuidePanelVisibility,
    isQuickNotesPanelVisible,
    toggleQuickNotesPanelVisibility,
    emotionIntensityFilter,
    setEmotionIntensityFilter,
    get: getClinicalStoreState,
    prefillSchemaRule,
    toolbarOrientation,
    toggleToolbarOrientation,
    openABCForm,
    openSchemaForm,
    openQuickNoteForm,
    createGroupFromSelectedNodes,
    selectedFlowNodes, // Ensure this is available if used for enabling/disabling buttons
    setSelectedFlowNodes, // For onSelectionChange
  } = useClinicalStore();

  const reactFlowInstance = useReactFlow();
  const { toast } = useToast();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // const [selectedFlowNodesState, setSelectedFlowNodesState] = useState<Node[]>([]); // This local state might be redundant if store's selectedFlowNodes is used

  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState(groupBorderColors[0].value);


  useEffect(() => {
    fetchClinicalData('mockPatientId');
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [fetchClinicalData]);

  const displayedNodes = useMemo(() => {
    return storeNodes.filter(node => {
      if (node.type === 'abcCard' && isABCCardData(node.data)) {
        const colorMatch = activeColorFilters.length === 0 || activeColorFilters.includes(node.data.color);
        const intensityMatch = emotionIntensityFilter === 0 || (node.data.antecedent.emotionIntensity ?? 0) >= emotionIntensityFilter;
        return colorMatch && intensityMatch;
      }
      if (node.type === 'schemaNode') return showSchemaNodes;
      return true;
    });
  }, [storeNodes, activeColorFilters, showSchemaNodes, emotionIntensityFilter]);

  const onConnect = useCallback((params: Connection | Edge) => {
    const newEdgeBase: Edge = {
      source: params.source!, target: params.target!, sourceHandle: params.sourceHandle,
      targetHandle: params.targetHandle, type: 'smoothstep', animated: true,
    };
    openLabelEdgeModal(newEdgeBase);
  }, [openLabelEdgeModal]);

  const handleSaveLayout = () => {
    storeSetViewport(reactFlowInstance.getViewport());
    reactFlowInstance.getNodes().forEach(node => {
      if (node.type === 'abcCard') updateCardPosition(node.id, node.position);
      else if (node.type === 'schemaNode') updateSchemaPosition(node.id, node.position);
    });
    saveClinicalData('mockPatientId');
    toast({ title: "Estudo Salvo", description: "O layout e os dados foram salvos." });
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    setInsights(["Gerando insights..."]);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const currentCards = getClinicalStoreState().cards;
      const currentSchemas = getClinicalStoreState().schemas;
      setInsights([`Análise: ${currentCards.length} cards, ${currentSchemas.length} esquemas.`]);
      toast({ title: "Insights Gerados (Simulado)" });
    } catch (error) {
      setInsights(["Erro ao gerar insights."]);
      toast({ title: "Erro na Análise", variant: "destructive" });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleNodeContextMenu = useCallback(
    (event: NodeMouseEvent, node: Node<ClinicalNodeData>) => {
      event.preventDefault();
      if (node.id && node.type) openContextMenu(node.id, node.type as ClinicalNodeType, { x: event.clientX, y: event.clientY });
    }, [openContextMenu]
  );

  const onPaneClick = useCallback(() => {
    if (isContextMenuOpen) closeContextMenu();
  }, [isContextMenuOpen, closeContextMenu]);

  const onEdgeDoubleClick = useCallback(
    (_event: EdgeMouseEvent, edge: Edge<ConnectionLabel | undefined>) => openLabelEdgeModal(edge),
    [openLabelEdgeModal]
  );

  const toggleFullscreenHandler = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) mapContainerRef.current.requestFullscreen().catch(err => toast({ title: "Erro Tela Cheia", description: err.message, variant: "destructive" }));
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  const handleSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelectedFlowNodes(params.nodes);
  }, [setSelectedFlowNodes]);

  const selectedAbcCardIdsForGroup = useMemo(() => (selectedFlowNodes || [])
    .filter(node => node.type === 'abcCard')
    .map(node => node.id), [selectedFlowNodes]);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast({ title: "Nome do Grupo", description: "Por favor, insira um nome para o grupo.", variant: "destructive"});
      return;
    }
    if (selectedAbcCardIdsForGroup.length < 1) {
      toast({ title: "Seleção de Cards", description: "Selecione pelo menos um card ABC para agrupar.", variant: "destructive"});
      return;
    }
    createGroupFromSelectedNodes(newGroupName, newGroupColor, selectedAbcCardIdsForGroup);
    toast({ title: "Grupo Criado", description: `Grupo "${newGroupName}" criado com os cards selecionados.`});
    setNewGroupName("");
    setNewGroupColor(groupBorderColors[0].value);
    setIsCreateGroupDialogOpen(false);
  };

  const commonButtonClass = "h-7 w-7";
  const commonIconClass = "h-3.5 w-3.5";

  // Simplified return for debugging
  return (
    <div ref={mapContainerRef} className={cn("h-full w-full border rounded-md shadow-sm bg-muted/10 relative")}>
      <p>FormulationMap Component Rendered - Debugging "Algo deu errado"</p>
      {/* Keep modals as they are not rendered by default */}
      <NodeContextMenu />
      <QuickNoteForm />
      <ABCForm />
      <SchemaForm prefillRule={prefillSchemaRule || undefined} />
      <EdgeLabelModal />
    </div>
  );

/*
  // Original return statement - commented out for debugging
  return (
    <div ref={mapContainerRef} className={cn("h-full w-full border rounded-md shadow-sm bg-muted/10 relative", isFullscreen && "fixed inset-0 z-[100] bg-background")} onContextMenu={(e) => e.preventDefault()}>
      <ReactFlow
        nodes={displayedNodes} edges={edges} onNodesChange={storeOnNodesChange} onEdgesChange={storeOnEdgesChange}
        onConnect={onConnect} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2, duration: 300 }}
        defaultViewport={initialViewport} onMoveEnd={(_event, viewport) => storeSetViewport(viewport)}
        minZoom={0.1} maxZoom={2} selectionMode={SelectionMode.Partial} deleteKeyCode={['Backspace', 'Delete']}
        onNodeContextMenu={handleNodeContextMenu} onPaneClick={onPaneClick} onEdgeDoubleClick={onEdgeDoubleClick}
        onSelectionChange={handleSelectionChange} proOptions={{ hideAttribution: true }} className="h-full w-full"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls showInteractive={false} className="shadow-md !bottom-2 !left-2" position="bottom-left" />

        <Panel 
            position={toolbarOrientation === 'horizontal' ? 'top-center' : 'left-center'} 
            className={cn(
                "p-0 bg-transparent shadow-none border-none !z-20", 
                toolbarOrientation === 'vertical' && "h-fit" // Adjust panel height for vertical toolbar
            )}
        >
            <div
                className={cn(
                    "bg-background/90 backdrop-blur-sm shadow-lg border border-border rounded-lg flex items-center p-1",
                    toolbarOrientation === 'horizontal'
                    ? "flex-row flex-nowrap gap-1 overflow-x-auto max-w-full mx-auto" 
                    : "flex-col gap-1.5 w-auto items-stretch" 
                )}
            >
                 <Button variant="ghost" size="icon" className={cn(commonButtonClass, "cursor-pointer")} onClick={toggleToolbarOrientation} title={toolbarOrientation === 'horizontal' ? "Menu Vertical (Esquerda)" : "Menu Horizontal (Topo)"}>
                    {toolbarOrientation === 'horizontal' ? <GripVertical className={commonIconClass} /> : <GripHorizontal className={commonIconClass} />}
                </Button>

                {toolbarOrientation === 'vertical' && <Separator orientation="horizontal" className="my-0.5 w-full" />}
                {toolbarOrientation === 'horizontal' && <div className="h-5 w-px bg-border mx-0.5"></div>}

                <Button variant="outline" size="icon" className={commonButtonClass} onClick={toggleSchemaPanelVisibility} title={isSchemaPanelVisible ? "Ocultar Esquemas" : "Mostrar Esquemas"}>
                    {isSchemaPanelVisible ? <PanelLeftClose className={commonIconClass} /> : <ListTree className={commonIconClass} />}
                </Button>
                <Button variant="outline" size="icon" className={commonButtonClass} onClick={toggleFormulationGuidePanelVisibility} title={isFormulationGuidePanelVisible ? "Ocultar Guia" : "Mostrar Guia"}>
                    {isFormulationGuidePanelVisible ? <PanelLeftClose className={commonIconClass} /> : <FormulationGuideIcon className={commonIconClass} />}
                </Button>
                <Button variant="outline" size="icon" className={commonButtonClass} onClick={toggleQuickNotesPanelVisibility} title={isQuickNotesPanelVisible ? "Ocultar Notas Rápidas" : "Mostrar Notas Rápidas"}>
                    {isQuickNotesPanelVisible ? <PanelLeftClose className={commonIconClass} /> : <MessageSquare className={commonIconClass} />}
                </Button>

                {toolbarOrientation === 'vertical' && <Separator orientation="horizontal" className="my-0.5 w-full" />}
                {toolbarOrientation === 'horizontal' && <div className="h-5 w-px bg-border mx-0.5"></div>}
                
                <Button variant="outline" size="icon" className={commonButtonClass} onClick={() => openABCForm()} title="Novo Card ABC">
                    <PlusCircle className={commonIconClass} />
                </Button>
                <Button variant="outline" size="icon" className={commonButtonClass} onClick={() => openSchemaForm()} title="Novo Esquema/Regra">
                    <Share2 className={commonIconClass} />
                </Button>
                <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
                    <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className={commonButtonClass} disabled={selectedAbcCardIdsForGroup.length === 0} title="Criar Grupo Temático">
                        <Users className={commonIconClass} />
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Criar Novo Grupo Temático</DialogTitle>
                        <DialogDescription>Dê um nome e escolha uma cor para o grupo de cards selecionados ({selectedAbcCardIdsForGroup.length} card(s)).</DialogDescription>
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
                <Button variant="outline" size="icon" className={commonButtonClass} onClick={() => openQuickNoteForm()} title="Adicionar Nota Rápida">
                    <StickyNote className={commonIconClass} />
                </Button>
                
                {toolbarOrientation === 'vertical' && <Separator orientation="horizontal" className="my-0.5 w-full" />}
                {toolbarOrientation === 'horizontal' && <div className="h-5 w-px bg-border mx-0.5"></div>}
                
                <div className={cn(
                    "flex items-center gap-0.5 p-0.5 border rounded-md bg-muted/30 h-7",
                    toolbarOrientation === 'vertical' && "flex-col w-full py-1 items-stretch"
                )}>
                    <Slider
                    min={0} max={100} step={10}
                    value={[emotionIntensityFilter]}
                    onValueChange={(value) => setEmotionIntensityFilter(value[0])}
                    className={cn("w-16", toolbarOrientation === 'vertical' && "w-full h-2 my-1 px-1")}
                    title={`Filtrar por Intensidade Emocional (Antecedente) >= ${emotionIntensityFilter}`}
                    />
                    <span className={cn("text-[9px] text-muted-foreground w-4 text-right px-0.5", toolbarOrientation === 'vertical' && "text-center w-full")}>{emotionIntensityFilter}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setEmotionIntensityFilter(0)} title="Resetar filtro de intensidade">
                    <RotateCcw className="h-2.5 w-2.5"/>
                    </Button>
                </div>

                {toolbarOrientation === 'vertical' && <Separator orientation="horizontal" className="my-0.5 w-full" />}
                {toolbarOrientation === 'horizontal' && <div className="h-5 w-px bg-border mx-0.5"></div>}
                
                <Button variant="outline" size="icon" onClick={handleGenerateInsights} disabled={isGeneratingInsights} title="Gerar Insights de IA" className={commonButtonClass}>
                    <Lightbulb className={commonIconClass} /> {isGeneratingInsights && <span className="text-[9px] animate-pulse">...</span>}
                </Button>
                <Button variant="default" size="icon" onClick={handleSaveLayout} className={cn("bg-accent hover:bg-accent/90 text-accent-foreground", commonButtonClass)} title="Salvar Estudo">
                    <Save className={commonIconClass} />
                </Button>

                {toolbarOrientation === 'vertical' && <Separator orientation="horizontal" className="my-0.5 w-full" />}
                {toolbarOrientation === 'horizontal' && <div className="h-5 w-px bg-border mx-0.5"></div>}

                <Button variant="outline" size="icon" onClick={toggleFullscreenHandler} title={isFullscreen ? "Sair Tela Cheia" : "Tela Cheia"} className={commonButtonClass}>
                    {isFullscreen ? <Minimize className={commonIconClass} /> : <Maximize className={commonIconClass} />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => reactFlowInstance.zoomIn({duration: 300})} title="Aumentar Zoom" className={commonButtonClass}>
                    <ZoomIn className={commonIconClass} />
                </Button>
                <Button variant="outline" size="icon" onClick={() => reactFlowInstance.zoomOut({duration: 300})} title="Diminuir Zoom" className={commonButtonClass}>
                    <ZoomOut className={commonIconClass} />
                </Button>
            </div>
        </Panel>

        {isSchemaPanelVisible && (
            <Panel position="left-center" className="m-2 !z-10 w-72 max-w-xs max-h-[calc(100vh-6rem)] bg-card border rounded-lg shadow-xl flex flex-col">
                <SchemaPanel />
            </Panel>
        )}
        {isFormulationGuidePanelVisible && (
            <Panel position="right-center" className="m-2 !z-10 w-72 max-w-xs max-h-[calc(100vh-6rem)] bg-card border rounded-lg shadow-xl flex flex-col">
                <FormulationGuidePanel />
            </Panel>
        )}
        {isQuickNotesPanelVisible && (
            <Panel position="bottom-right" className="m-2 !z-10 w-80 max-w-sm max-h-[40vh] bg-card border rounded-lg shadow-xl flex flex-col">
                <QuickNotesPanel />
            </Panel>
        )}
      </ReactFlow>
      
      <NodeContextMenu />
      <QuickNoteForm />
      <ABCForm />
      <SchemaForm prefillRule={prefillSchemaRule || undefined} />
      <EdgeLabelModal />
    </div>
  );
*/
};

const FormulationMapWrapper: React.FC = () => (
  <ReactFlowProvider>
    <FormulationMap />
  </ReactFlowProvider>
);

export default FormulationMapWrapper;
