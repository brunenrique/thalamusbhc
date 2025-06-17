
"use client";

import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  // useNodesState, // Commented out as we get nodes from store directly now
  // useEdgesState, // Commented out as we get edges from store directly now
  // addEdge as rfAddEdge, // Store manages edges
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

import useClinicalStore, { allCardColors } from '@/stores/clinicalStore';
import ABCCardNode from './ABCCardNode';
import SchemaNode from './SchemaNode';
import NodeContextMenu from './NodeContextMenu';
import ABCForm from './ABCForm';
import SchemaForm from './SchemaForm';
import EdgeLabelModal from './EdgeLabelModal';
import QuickNoteForm from './QuickNoteForm';
// import SchemaPanel from './SchemaPanel'; // SchemaPanel comentado para depuração
// import InsightPanel from './InsightPanel'; 
// import FormulationGuidePanel from './FormulationGuidePanel'; // FormulationGuidePanel comentado para depuração
// import QuickNotesPanel from './QuickNotesPanel'; // QuickNotesPanel comentado para depuração


import type { ClinicalNodeData, ConnectionLabel, SchemaData, ABCCardData, ClinicalNodeType, QuickNote, CardGroupInfo, ABCCardColor, FormulationGuideQuestion, TabSpecificFormulationData } from '@/types/clinicalTypes';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  PanelLeftOpen, PanelLeftClose, HelpCircle as FormulationGuideIcon, CheckSquare, StickyNote, Maximize, Minimize, ZoomIn, ZoomOut, Settings, ListTree,
  PlusCircle, Share2, Users, Lightbulb, Save, RotateCcw, GripVertical, GripHorizontal, MessageSquare, Palette, Check, Eye, Layers
} from 'lucide-react';
import { Card } from '@/components/ui/card';


const nodeTypes = {
  abcCard: ABCCardNode,
  schemaNode: SchemaNode,
};

const groupBorderColors = [
    { label: "Vermelho", value: "border-red-500", badgeBg: "bg-red-500/20" },
    { label: "Verde", value: "border-green-500", badgeBg: "bg-green-500/20" },
    { label: "Azul", value: "border-blue-500", badgeBg: "bg-blue-500/20" },
    { label: "Amarelo", value: "border-yellow-500", badgeBg: "bg-yellow-500/20" },
    { label: "Roxo", value: "border-purple-500", badgeBg: "bg-purple-500/20" },
    { label: "Ciano", value: "border-cyan-500", badgeBg: "bg-cyan-500/20" },
    { label: "Rosa", value: "border-pink-500", badgeBg: "bg-pink-500/20" },
];

const cardColorDisplayOptions: { label: string; value: ABCCardColor; style: string }[] = [
  { label: 'Padrão', value: 'default', style: 'bg-card border-border' },
  { label: 'Alerta (Vermelho)', value: 'red', style: 'bg-red-500/20 border-red-500/40 text-red-800 dark:text-red-300' },
  { label: 'Positivo (Verde)', value: 'green', style: 'bg-green-500/20 border-green-500/40 text-green-800 dark:text-green-300' },
  { label: 'Neutro (Azul)', value: 'blue', style: 'bg-blue-500/20 border-blue-500/40 text-blue-800 dark:text-blue-300' },
  { label: 'Observação (Amarelo)', value: 'yellow', style: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-800 dark:text-yellow-300' },
  { label: 'Hipótese (Roxo)', value: 'purple', style: 'bg-purple-500/20 border-purple-500/40 text-purple-800 dark:text-purple-300' },
];


const FormulationMap: React.FC = () => {
  const {
    formulationTabData,
    activeTabId,
    onNodesChange: storeOnNodesChange,
    onEdgesChange: storeOnEdgesChange,
    addEdge: storeAddEdge,
    openLabelEdgeModal,
    setViewport: storeSetViewport,
    saveClinicalData,
    setInsights,
    openContextMenu,
    isContextMenuOpen,
    openABCForm,
    openSchemaForm,
    openQuickNoteForm,
    isSchemaPanelVisible,
    toggleSchemaPanelVisibility,
    isFormulationGuidePanelVisible,
    toggleFormulationGuidePanelVisibility,
    isQuickNotesPanelVisible,
    toggleQuickNotesPanelVisibility,
    createGroupFromSelectedNodes,
    selectedFlowNodes,
    setSelectedFlowNodes,
    get: getClinicalStore,
    setColorFilters,
    setAllColorFilters,
    toggleShowSchemaNodes,
    toolbarOrientation,
    toggleToolbarOrientation,
    setEmotionIntensityFilter,
    formulationGuideQuestions: initialFormulationGuideQuestions,
  } = useClinicalStore();

  const reactFlowInstance = useReactFlow();
  const { toast } = useToast();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState(groupBorderColors[0].value);

  const activeTabData = useMemo(() => {
    if (!activeTabId || !formulationTabData[activeTabId]) {
      const defaultData = {
        cards: [],
        schemas: [],
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        insights: ["Clique em 'Gerar Insights' para análise."],
        formulationGuideAnswers: initialFormulationGuideQuestions.reduce((acc, q) => { acc[q.id] = false; return acc; }, {} as Record<string, boolean>),
        quickNotes: [],
        cardGroups: [],
        activeColorFilters: [...allCardColors],
        showSchemaNodes: true,
        emotionIntensityFilter: 0,
      };
      // console.warn(`No data for activeTabId: ${activeTabId}. Using default. FormulationTabData:`, formulationTabData);
      return defaultData as TabSpecificFormulationData;
    }
    // console.log(`Data for activeTabId: ${activeTabId}`, formulationTabData[activeTabId]);
    return formulationTabData[activeTabId];
  }, [activeTabId, formulationTabData, initialFormulationGuideQuestions]);


  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const onConnectInternal = useCallback(
    (params: Connection | Edge) => {
      openLabelEdgeModal(params);
    },
    [openLabelEdgeModal]
  );

  const handleSaveLayout = () => {
    if (activeTabId) {
      saveClinicalData('mockPatientId', activeTabId);
      toast({ title: "Layout Salvo", description: "O layout do mapa foi salvo com sucesso." });
    }
  };

  const handleGenerateInsights = async () => {
    if (!activeTabId) return;
    setIsGeneratingInsights(true);
    
    const { cards, schemas } = activeTabData; 
    
    setTimeout(() => {
        const currentInsights = [
            `Análise para ${getClinicalStore().tabs.find(t => t.id === activeTabId)?.title || 'aba atual'}:`,
            `Total de ${cards.length} cards e ${schemas.length} esquemas.`,
            "Padrão de evitação identificado em situações sociais simuladas.",
            "Crença central 'Não sou bom o suficiente' parece ativa (simulado).",
        ];
        setInsights(currentInsights); 
        setIsGeneratingInsights(false);
        toast({ title: "Insights Gerados (Simulado)", description: "Novos insights foram adicionados ao painel." });
    }, 1200);
  };

  const handleNodeContextMenu = useCallback(
    (event: NodeMouseEvent, node: Node<ClinicalNodeData>) => {
      event.preventDefault();
      openContextMenu(node.id, node.type as ClinicalNodeType, { x: event.clientX, y: event.clientY });
    }, [openContextMenu]
  );

  const onPaneClick = useCallback(() => {
    useClinicalStore.getState().closeContextMenu();
  }, []);

  const onEdgeDoubleClick = useCallback(
    (_event: EdgeMouseEvent, edge: Edge<ConnectionLabel | undefined>) => {
        openLabelEdgeModal(edge);
    }, [openLabelEdgeModal]
  );

  const toggleFullscreenHandler = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setSelectedFlowNodes(params.nodes);
  }, [setSelectedFlowNodes]);

  const selectedAbcCardIdsForGroup = useMemo(() => 
    (selectedFlowNodes || []).filter(node => node.type === 'abcCard').map(node => node.id),
    [selectedFlowNodes]
  );

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


  const filteredNodes = useMemo(() => {
    let nodesToDisplay = activeTabData.nodes;

    if (!activeTabData.showSchemaNodes) {
      nodesToDisplay = nodesToDisplay.filter(node => node.type !== 'schemaNode');
    }

    const allColorsActive = activeTabData.activeColorFilters.length === allCardColors.length;
    if (!allColorsActive && activeTabData.activeColorFilters.length > 0) { 
      nodesToDisplay = nodesToDisplay.filter(node => {
        if (node.type === 'abcCard' && isABCCardData(node.data)) {
          return activeTabData.activeColorFilters.includes(node.data.color);
        }
        return true; 
      });
    }
    
    if (activeTabData.emotionIntensityFilter > 0) {
      nodesToDisplay = nodesToDisplay.filter(node => {
        if (node.type === 'abcCard' && isABCCardData(node.data)) {
          return (node.data.antecedent.emotionIntensity ?? 0) >= activeTabData.emotionIntensityFilter;
        }
        return true;
      });
    }
    return nodesToDisplay;
  }, [activeTabData.nodes, activeTabData.showSchemaNodes, activeTabData.activeColorFilters, activeTabData.emotionIntensityFilter]);

  const handleColorFilterChange = (colorValue: ABCCardColor, checked: boolean) => {
    const newFilters = checked
      ? [...activeTabData.activeColorFilters, colorValue]
      : activeTabData.activeColorFilters.filter(c => c !== colorValue);
    setColorFilters(newFilters);
  };

  const currentNodes = filteredNodes || [];
  const currentEdges = activeTabData.edges || [];
  const currentViewport = activeTabData.viewport || { x:0, y:0, zoom:1 };


  return (
    <div ref={mapContainerRef} className={cn("h-full w-full border rounded-md shadow-sm bg-muted/10 relative")}>
       <ReactFlow
          nodes={currentNodes}
          edges={currentEdges}
          onNodesChange={storeOnNodesChange}
          onEdgesChange={storeOnEdgesChange}
          onConnect={onConnectInternal}
          nodeTypes={nodeTypes}
          defaultViewport={currentViewport}
          onMoveEnd={(_event, viewport) => storeSetViewport(viewport)}
          onNodeContextMenu={handleNodeContextMenu}
          onPaneClick={onPaneClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          proOptions={{ hideAttribution: true }}
          selectionMode={SelectionMode.Partial}
          onSelectionChange={handleSelectionChange}
          fitView={currentNodes.length === 0} 
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls position="bottom-left" showInteractive={false}/>
          
          
          <Panel 
            position={toolbarOrientation === 'horizontal' ? 'top-center' : 'left-center'} 
            className={cn(
              "!m-0 bg-transparent border-none shadow-none",
              toolbarOrientation === 'vertical' ? "h-fit !left-2 !top-1/2 !-translate-y-1/2" : "w-fit !top-2 !left-1/2 !-translate-x-1/2"
            )}
          >
            <div
              className={cn(
                "bg-background/90 backdrop-blur-sm shadow-xl border border-border rounded-lg flex items-center p-1",
                toolbarOrientation === 'horizontal'
                  ? "flex-row flex-nowrap items-center gap-1 overflow-x-auto max-w-[calc(100vw-4rem)]"
                  : "flex-col items-stretch gap-1.5 w-auto p-1.5"
              )}
            >
              <Button variant="ghost" size="icon" className={cn(commonButtonClass, "cursor-pointer")} onClick={toggleToolbarOrientation} title={toolbarOrientation === 'horizontal' ? "Menu Vertical (Esquerda)" : "Menu Horizontal (Topo)"}>
                {toolbarOrientation === 'horizontal' ? <GripVertical className={commonIconClass} /> : <GripHorizontal className={commonIconClass} />}
              </Button>

              {toolbarOrientation === 'vertical' ? <Separator orientation="horizontal" className="my-0.5 w-full" /> : <Separator orientation="vertical" className="h-5 w-px mx-0.5" />}
              
              <Button variant="outline" size="icon" className={commonButtonClass} onClick={toggleSchemaPanelVisibility} title={isSchemaPanelVisible ? "Ocultar Painel de Esquemas" : "Mostrar Painel de Esquemas"}>
                {isSchemaPanelVisible ? <PanelLeftClose className={commonIconClass} /> : <ListTree className={commonIconClass} />}
              </Button>
              <Button variant="outline" size="icon" className={commonButtonClass} onClick={toggleFormulationGuidePanelVisibility} title={isFormulationGuidePanelVisible ? "Ocultar Guia de Formulação" : "Mostrar Guia de Formulação"}>
                 {isFormulationGuidePanelVisible ? <PanelLeftClose className={commonIconClass} /> : <FormulationGuideIcon className={commonIconClass} />}
              </Button>
              <Button variant="outline" size="icon" className={commonButtonClass} onClick={toggleQuickNotesPanelVisibility} title={isQuickNotesPanelVisible ? "Ocultar Painel de Notas Rápidas" : "Mostrar Painel de Notas Rápidas"}>
                 {isQuickNotesPanelVisible ? <PanelLeftClose className={commonIconClass} /> : <MessageSquare className={commonIconClass} />}
              </Button>

              {toolbarOrientation === 'vertical' ? <Separator orientation="horizontal" className="my-0.5 w-full" /> : <Separator orientation="vertical" className="h-5 w-px mx-0.5" />}
              
              <Button variant="outline" size="icon" className={commonButtonClass} onClick={() => openABCForm()} title="Novo Card ABC">
                <PlusCircle className={commonIconClass} />
              </Button>
              <Button variant="outline" size="icon" className={commonButtonClass} onClick={() => openSchemaForm()} title="Novo Esquema/Regra">
                <Share2 className={commonIconClass} />
              </Button>
              <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className={commonButtonClass} disabled={(selectedFlowNodes || []).filter(node => node.type === 'abcCard').length === 0} title="Criar Grupo Temático">
                    <Users className={commonIconClass} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Grupo Temático</DialogTitle>
                    <DialogDescription>Dê um nome e escolha uma cor para o grupo de cards selecionados ({(selectedFlowNodes || []).filter(node => node.type === 'abcCard').length} card(s)).</DialogDescription>
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
                                <span className={cn("w-3 h-3 rounded-full border", color.value, color.badgeBg)}></span>
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
              
              {toolbarOrientation === 'vertical' ? <Separator orientation="horizontal" className="my-0.5 w-full" /> : <Separator orientation="vertical" className="h-5 w-px mx-0.5" />}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className={commonButtonClass} title="Controlar Visibilidade de Elementos">
                        <Layers className={commonIconClass} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                    <DropdownMenuLabel>Visibilidade de Elementos</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={activeTabData.showSchemaNodes}
                        onCheckedChange={toggleShowSchemaNodes}
                    >
                        Mostrar Esquemas/Regras
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Palette className="mr-2 h-3.5 w-3.5"/>
                            Filtrar Cards por Cor
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-52">
                                {cardColorDisplayOptions.map((colorOpt) => (
                                <DropdownMenuCheckboxItem
                                    key={colorOpt.value}
                                    checked={activeTabData.activeColorFilters.includes(colorOpt.value)}
                                    onCheckedChange={(checked) => handleColorFilterChange(colorOpt.value, !!checked)}
                                >
                                    <div className={cn("w-3 h-3 rounded-full mr-2 border", colorOpt.style.split(' ')[0], colorOpt.style.split(' ')[1])} />
                                    {colorOpt.label}
                                </DropdownMenuCheckboxItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setAllColorFilters(true)}>Mostrar Todos os Cards</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setAllColorFilters(false)}>Ocultar Todos os Cards</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className={cn(
                "flex items-center gap-0.5 p-0.5 border rounded-md bg-muted/30 h-7",
                toolbarOrientation === 'vertical' && "flex-col w-full py-1 items-stretch"
              )}>
                <Slider
                  min={0} max={100} step={10}
                  value={[activeTabData.emotionIntensityFilter]}
                  onValueChange={(value) => setEmotionIntensityFilter(value[0])}
                  className={cn("w-16", toolbarOrientation === 'vertical' && "w-full h-2 my-1 px-1")}
                  title={`Filtrar por Intensidade Emocional (Antecedente) >= ${activeTabData.emotionIntensityFilter}`}
                />
                <span className={cn("text-[9px] text-muted-foreground w-4 text-right px-0.5", toolbarOrientation === 'vertical' && "text-center w-full")}>{activeTabData.emotionIntensityFilter}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setEmotionIntensityFilter(0)} title="Resetar filtro de intensidade">
                  <RotateCcw className="h-2.5 w-2.5"/>
                </Button>
              </div>

              {toolbarOrientation === 'vertical' ? <Separator orientation="horizontal" className="my-0.5 w-full" /> : <Separator orientation="vertical" className="h-5 w-px mx-0.5" />}
              
              <Button variant="outline" size="icon" onClick={handleGenerateInsights} disabled={isGeneratingInsights} title="Gerar Insights de IA" className={commonButtonClass}>
                <Lightbulb className={commonIconClass} /> {isGeneratingInsights && <span className="text-[9px] animate-pulse">...</span>}
              </Button>
              <Button variant="default" size="icon" onClick={handleSaveLayout} className={cn("bg-accent hover:bg-accent/90 text-accent-foreground", commonButtonClass)} title="Salvar Estudo">
                <Save className={commonIconClass} />
              </Button>

              {toolbarOrientation === 'vertical' ? <Separator orientation="horizontal" className="my-0.5 w-full" /> : <Separator orientation="vertical" className="h-5 w-px mx-0.5" />}

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
          
          
          {/* {isSchemaPanelVisible && (
            <Panel position="top-left" className="!m-0 p-0 shadow-xl border rounded-lg bg-card w-72 h-[calc(100%-5rem)] flex flex-col">
                <SchemaPanel />
            </Panel>
          )} */}
          {/* {isFormulationGuidePanelVisible && (
            <Panel position="top-right" className="!m-0 p-0 shadow-xl border rounded-lg bg-card w-72 h-[calc(100%-5rem)] flex flex-col">
                <FormulationGuidePanel />
            </Panel>
          )} */}
          {/* {isQuickNotesPanelVisible && (
             <Panel position="bottom-right" className="!m-0 p-0 shadow-xl border rounded-lg bg-card w-72 h-2/5 max-h-[400px] flex flex-col">
                <QuickNotesPanel />
            </Panel>
          )} */}
          
          {/* <Panel position="bottom-left" className="!m-0 p-0 shadow-xl border rounded-lg bg-card w-72 h-2/5 max-h-[400px] flex flex-col">
            <InsightPanel />
          </Panel> */}
        </ReactFlow>
      
      
      <NodeContextMenu />
      <QuickNoteForm />
      <ABCForm />
      <SchemaForm prefillRule={useClinicalStore.getState().prefillSchemaRule || undefined}/>
      <EdgeLabelModal />
      
    </div>
  );
};

const FormulationMapWrapper: React.FC = () => (
  <ReactFlowProvider>
    <FormulationMap />
  </ReactFlowProvider>
);

export default FormulationMapWrapper;
    

    
