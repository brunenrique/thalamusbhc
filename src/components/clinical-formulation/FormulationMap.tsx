
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
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  SelectionMode,
  Panel,
  ReactFlowProvider, 
  NodeMouseEvent,
  EdgeMouseEvent, 
} from 'reactflow';
import 'reactflow/dist/style.css';

import useClinicalStore from '@/stores/clinicalStore';
import ABCCardNode from './ABCCardNode';
import SchemaNode from './SchemaNode'; 
import NodeContextMenu from './NodeContextMenu';
import MapToolbar from './MapToolbar'; 
import type { ClinicalNodeData, ConnectionLabel, SchemaData, ABCCardData, ClinicalNodeType } from '@/types/clinicalTypes';
import { isABCCardData, isSchemaData } from '@/types/clinicalTypes';
import { Button } from '../ui/button';
import { Brain, Save, Settings, Maximize, Minimize, Lightbulb, ZoomIn, ZoomOut } from 'lucide-react'; 
import { runAnalysis } from '@/services/insightEngine'; 
import { useToast } from '@/hooks/use-toast'; 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { cn } from '@/shared/utils';


const nodeTypes = {
  abcCard: ABCCardNode,
  schemaNode: SchemaNode,
};

const initialViewport = { x: 0, y: 0, zoom: 0.9 };

const FormulationMap: React.FC = () => {
  const { 
    nodes: storeNodes, 
    edges, 
    onNodesChange: storeOnNodesChange, 
    onEdgesChange: storeOnEdgesChange,
    openLabelEdgeModal,
    setViewport,
    updateCardPosition,
    updateSchemaPosition,
    fetchClinicalData, 
    saveClinicalData, 
    setInsights, 
    addInsight,
    openContextMenu,
    closeContextMenu,
    isContextMenuOpen,
    activeColorFilters, 
    showSchemaNodes,   
    get: getClinicalStoreState,
  } = useClinicalStore();

  const { fitView, zoomIn, zoomOut, getViewport } = useReactFlow();
  const { toast } = useToast();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchClinicalData('mockPatientId'); 
    console.log("LOG: FormulationMap mounted, fetchClinicalData called.");

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [fetchClinicalData]);

  const displayedNodes = useMemo(() => {
    const filtered = storeNodes.filter(node => {
      if (node.type === 'abcCard' && isABCCardData(node.data)) {
        if (activeColorFilters.length === 0) return false;
        return activeColorFilters.includes(node.data.color);
      }
      if (node.type === 'schemaNode') {
        return showSchemaNodes;
      }
      return true; 
    });
    console.log("LOG: Displayed nodes recalculate. Count:", filtered.length, "Filters:", activeColorFilters, "Show Schemas:", showSchemaNodes);
    return filtered;
  }, [storeNodes, activeColorFilters, showSchemaNodes]);


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
    setViewport(getViewport()); 
    saveClinicalData('mockPatientId'); 
  };

  const handleFitView = () => {
    fitView({ padding: 0.1, duration: 300 });
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    setInsights(["Gerando insights... Por favor, aguarde."]); 
    try {
      const currentCards = getClinicalStoreState().cards; 
      const currentSchemas = getClinicalStoreState().schemas;
      const generated = await runAnalysis(currentCards, currentSchemas);
      setInsights(generated);
      toast({
        title: "Insights Gerados",
        description: "A análise foi concluída e os insights foram atualizados.",
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
        alert(`Erro ao tentar entrar em tela cheia: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  console.log("LOG: Rendering FormulationMap. Nodes to pass to ReactFlow:", displayedNodes.length, "Edges:", edges.length);

  return (
    <div ref={mapContainerRef} className={cn("h-full w-full border rounded-md shadow-sm bg-muted/10 relative", isFullscreen && "fixed inset-0 z-50 bg-background")} onContextMenu={(e) => e.preventDefault()}>
      <ReactFlow
        nodes={displayedNodes} 
        edges={edges}
        onNodesChange={storeOnNodesChange}
        onEdgesChange={storeOnEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1, duration: 300 }}
        defaultViewport={initialViewport}
        onMoveEnd={(_event, viewport) => setViewport(viewport)}
        minZoom={0.1}
        maxZoom={2}
        selectionMode={SelectionMode.Partial} 
        deleteKeyCode={['Backspace', 'Delete']}
        attributionPosition="bottom-left"
        className="h-full w-full"
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={onPaneClick}
        onEdgeDoubleClick={onEdgeDoubleClick} 
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls showInteractive={false} className="shadow-md" />
        <MiniMap nodeStrokeWidth={3} zoomable pannable className="shadow-md rounded-md border" />
        
        <Panel position="top-right" className="p-2 space-x-1.5 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="Configurações do Mapa">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 p-0" align="end"> {/* Aumentei a largura para o MapToolbar */}
              <MapToolbar />
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" onClick={toggleFullscreen} title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={() => zoomIn({duration: 300})} title="Aumentar Zoom">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => zoomOut({duration: 300})} title="Diminuir Zoom">
            <ZoomOut className="h-4 w-4" />
          </Button>
           <Button variant="outline" size="sm" onClick={handleGenerateInsights} disabled={isGeneratingInsights} title="Gerar Insights de IA">
            <Lightbulb className="h-3.5 w-3.5 mr-1" /> {isGeneratingInsights ? "Gerando..." : "Insights IA"}
          </Button>
          <Button variant="default" size="sm" onClick={handleSaveLayout} className="bg-accent hover:bg-accent/90 text-accent-foreground" title="Salvar estudo de caso">
            <Save className="h-3.5 w-3.5 mr-1" /> Salvar Estudo
          </Button>
        </Panel>
      </ReactFlow>
      <NodeContextMenu />
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

