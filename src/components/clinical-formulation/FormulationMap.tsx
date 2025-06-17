
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
import SchemaPanel from './SchemaPanel';
import FormulationGuidePanel from './FormulationGuidePanel';
import QuickNotesPanel from './QuickNotesPanel';
import QuickNoteForm from './QuickNoteForm';
import NodeContextMenu from './NodeContextMenu';
import type { ClinicalNodeData, ConnectionLabel, SchemaData, ABCCardData, ClinicalNodeType, QuickNote } from '@/types/clinicalTypes';
import { isABCCardData, isSchemaData } from '@/types/clinicalTypes';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/shared/utils';
import { Button } from '@/components/ui/button';
import { 
    PanelLeftOpen, PanelLeftClose, HelpCircle, StickyNote, Maximize, Minimize, ZoomIn, ZoomOut, Settings, ListTree, CheckSquare,
    PlusCircle, Share2, Users, Lightbulb, Save, RotateCcw, GripVertical, GripHorizontal 
} from 'lucide-react';
import ABCForm from './ABCForm';
import SchemaForm from './SchemaForm';
import EdgeLabelModal from './EdgeLabelModal';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
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
import { Separator } from '@/components/ui/separator';

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
    openABCForm,
    openSchemaForm,
    openQuickNoteForm,
    createGroupFromSelectedNodes,
    selectedFlowNodes: storeSelectedNodes,
    toolbarOrientation, 
    toggleToolbarOrientation,
  } = useClinicalStore();

  const { fitView, zoomIn, zoomOut, getViewport, getNodes, getEdges: rfGetEdges } = useReactFlow();
  const { toast } = useToast();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const [selectedFlowNodes, setSelectedFlowNodes] = useState<Node[]>(storeSelectedNodes || []);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState(groupBorderColors[0].value);


   useEffect(() => {
    useClinicalStore.setState({ selectedFlowNodes });
  }, [selectedFlowNodes]);


  useEffect(() => {
    fetchClinicalData('mockPatientId');

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
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
      if (node.type === 'schemaNode') {
        return showSchemaNodes;
      }
      return true;
    });
  }, [storeNodes, activeColorFilters, showSchemaNodes, emotionIntensityFilter]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdgeBase: Edge = {
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        type: 'smoothstep',
        animated: true,
      };
      openLabelEdgeModal(newEdgeBase);
    },
    [openLabelEdgeModal]
  );

  const handleSaveLayout = () => {
    storeSetViewport(getViewport());
    const currentFlowNodes = getNodes();
    currentFlowNodes.forEach(flowNode => {
        if (flowNode.type === 'abcCard') {
            getClinicalStoreState().updateCardPosition(flowNode.id, flowNode.position);
        } else if (flowNode.type === 'schemaNode') {
            getClinicalStoreState().updateSchemaPosition(flowNode.id, flowNode.position);
        }
    });
    saveClinicalData('mockPatientId');
    toast({ title: "Estudo Salvo", description: "O layout e os dados do estudo de caso foram salvos." });
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    setInsights(["Gerando insights... Por favor, aguarde."]);
    try {
      const currentCards = getClinicalStoreState().cards;
      const currentSchemas = getClinicalStoreState().schemas;
      await new Promise(resolve => setTimeout(resolve, 1000));
      const generated = [`Análise simulada: ${currentCards.length} cards e ${currentSchemas.length} esquemas.`];
      setInsights(generated);
      toast({
        title: "Insights Gerados (Simulado)",
        description: "A análise simulada foi concluída e os insights foram atualizados.",
      });
    } catch (error) {
      console.error("Erro ao gerar insights:", error);
      setInsights(["Ocorreu um erro ao gerar os insights. Tente novamente."]);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível gerar os insights. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleNodeContextMenu = useCallback(
    (event: NodeMouseEvent, node: Node<ClinicalNodeData>) => {
      event.preventDefault();
      if (node.id && node.type) {
        openContextMenu(node.id, node.type as ClinicalNodeType, { x: event.clientX, y: event.clientY });
      }
    },
    [openContextMenu]
  );

  const onPaneClick = useCallback(() => {
    if (isContextMenuOpen) {
      closeContextMenu();
    }
  }, [isContextMenuOpen, closeContextMenu]);

  const onEdgeDoubleClick = useCallback(
    (_event: EdgeMouseEvent, edge: Edge<ConnectionLabel | undefined>) => {
      openLabelEdgeModal(edge);
    },
    [openLabelEdgeModal]
  );

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch(err => {
        toast({ title: "Erro Tela Cheia", description: `Não foi possível ativar: ${err.message}`, variant: "destructive" });
      });
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelectedFlowNodes(params.nodes);
    useClinicalStore.setState({ selectedFlowNodes: params.nodes });
  }, []);

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
    <div ref={mapContainerRef} className={cn("h-full w-full border rounded-md shadow-sm bg-muted/10 relative", isFullscreen && "fixed inset-0 z-[100] bg-background")} onContextMenu={(e) => e.preventDefault()}>
      
      <ReactFlow
        nodes={displayedNodes}
        edges={edges}
        onNodesChange={storeOnNodesChange}
        onEdgesChange={storeOnEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, duration: 300 }}
        defaultViewport={initialViewport}
        onMoveEnd={(_event, viewport) => storeSetViewport(viewport)}
        minZoom={0.1}
        maxZoom={2}
        selectionMode={SelectionMode.Partial}
        deleteKeyCode={['Backspace', 'Delete']}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={onPaneClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onSelectionChange={handleSelectionChange}
        proOptions={{ hideAttribution: true }}
        className="h-full w-full"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        
         <Panel 
          position={toolbarOrientation === 'horizontal' ? 'top-center' : 'left-center'} 
          className="p-1 bg-background/90 backdrop-blur-sm shadow-md border border-border rounded-lg !z-20"
        >
            <div className={cn(
                "flex items-center gap-1",
                toolbarOrientation === 'horizontal' 
                    ? "flex-row flex-nowrap overflow-x-auto" 
                    : "flex-col w-auto p-0.5" 
            )}>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleToolbarOrientation} title={toolbarOrientation === 'horizontal' ? "Menu Vertical" : "Menu Horizontal"}>
                    {toolbarOrientation === 'horizontal' ? <GripVertical className="h-3.5 w-3.5" /> : <GripHorizontal className="h-3.5 w-3.5" />}
                </Button>

                {toolbarOrientation === 'vertical' && <Separator orientation="horizontal" className="my-0.5 w-full" />}

                <Button variant="outline" size="icon" className="h-7 w-7" onClick={toggleSchemaPanelVisibility} title={isSchemaPanelVisible ? "Ocultar Esquemas" : "Mostrar Esquemas"}>
                    {isSchemaPanelVisible ? <PanelLeftClose className="h-3.5 w-3.5" /> : <ListTree className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={toggleFormulationGuidePanelVisibility} title={isFormulationGuidePanelVisible ? "Ocultar Guia" : "Mostrar Guia"}>
                    <CheckSquare className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={toggleQuickNotesPanelVisibility} title={isQuickNotesPanelVisible ? "Ocultar Notas" : "Mostrar Notas"}>
                    <StickyNote className="h-3.5 w-3.5" />
                </Button>

                {toolbarOrientation === 'vertical' && <Separator orientation="horizontal" className="my-0.5 w-full" />}
                {toolbarOrientation === 'horizontal' && <div className="h-5 w-px bg-border mx-0.5"></div>}
                
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => openABCForm()} title="Novo Card ABC">
                    <PlusCircle className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => openSchemaForm()} title="Novo Esquema/Regra">
                    <Share2 className="h-3.5 w-3.5" />
                </Button>
                 <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
                    <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-7 w-7" disabled={(selectedFlowNodes || []).filter(node => node.type === 'abcCard').length === 0} title="Criar Grupo Temático">
                        <Users className="h-3.5 w-3.5" />
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Criar Novo Grupo Temático</DialogTitle>
                            <DialogDescription>Dê um nome e escolha uma cor para o grupo de cards selecionados ({(selectedFlowNodes || []).filter(node => node.type === 'abcCard').length} card(s)).</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 py-2">
                            <div>
                            <Label htmlFor="group-name-toolbar">Nome do Grupo</Label>
                            <Input id="group-name-toolbar" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Ex: Ciclo de Evitação"/>
                            </div>
                            <div>
                            <Label htmlFor="group-color-toolbar">Cor da Borda do Grupo</Label>
                            <Select value={newGroupColor} onValueChange={setNewGroupColor}>
                                <SelectTrigger id="group-color-toolbar">
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
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => openQuickNoteForm()} title="Adicionar Nota Rápida">
                    <StickyNote className="h-3.5 w-3.5" />
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
                        title={`Intensidade Emocional (Antecedente) >= ${emotionIntensityFilter}`}
                    />
                    <span className={cn("text-[9px] text-muted-foreground w-4 text-right px-0.5", toolbarOrientation === 'vertical' && "text-center w-full")}>{emotionIntensityFilter}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setEmotionIntensityFilter(0)} title="Resetar filtro">
                        <RotateCcw className="h-2.5 w-2.5"/>
                    </Button>
                </div>

                {toolbarOrientation === 'vertical' && <Separator orientation="horizontal" className="my-0.5 w-full" />}
                {toolbarOrientation === 'horizontal' && <div className="h-5 w-px bg-border mx-0.5"></div>}
                
                <Button variant="outline" size="icon" onClick={handleGenerateInsights} disabled={isGeneratingInsights} title="Gerar Insights de IA" className="h-7 w-7">
                    <Lightbulb className="h-3.5 w-3.5" /> {isGeneratingInsights && <span className="text-[9px] animate-pulse">...</span>}
                </Button>
                <Button variant="default" size="icon" onClick={handleSaveLayout} className="bg-accent hover:bg-accent/90 text-accent-foreground h-7 w-7" title="Salvar Estudo">
                    <Save className="h-3.5 w-3.5" />
                </Button>

                {toolbarOrientation === 'vertical' && <Separator orientation="horizontal" className="my-0.5 w-full" />}
                {toolbarOrientation === 'horizontal' && <div className="h-5 w-px bg-border mx-0.5"></div>}

                <Button variant="outline" size="icon" onClick={toggleFullscreen} title={isFullscreen ? "Sair Tela Cheia" : "Tela Cheia"} className="h-7 w-7">
                    {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => zoomIn({ duration: 300 })} title="Aumentar Zoom" className="h-7 w-7">
                    <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => zoomOut({ duration: 300 })} title="Diminuir Zoom" className="h-7 w-7">
                    <ZoomOut className="h-3.5 w-3.5" />
                </Button>
            </div>
        </Panel>
        
        <Controls showInteractive={false} className="shadow-md !bottom-2 !left-2" position="bottom-left" />

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
};

const FormulationMapWrapper: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FormulationMap />
    </ReactFlowProvider>
  );
}

export default FormulationMapWrapper;
