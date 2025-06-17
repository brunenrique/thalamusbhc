
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
import MapToolbar from './MapToolbar'; // Toolbar de ações
import type { ClinicalNodeData, ConnectionLabel, SchemaData, ABCCardData, ClinicalNodeType, QuickNote } from '@/types/clinicalTypes';
import { isABCCardData, isSchemaData } from '@/types/clinicalTypes';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/shared/utils';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelLeftClose, HelpCircle, StickyNote, Maximize, Minimize, ZoomIn, ZoomOut, Settings, ListTree, CheckSquare } from 'lucide-react';
import ABCForm from './ABCForm';
import SchemaForm from './SchemaForm';
import EdgeLabelModal from './EdgeLabelModal';


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
    get: getClinicalStoreState,
    prefillSchemaRule,
  } = useClinicalStore();

  const { fitView, zoomIn, zoomOut, getViewport, getNodes, getEdges } = useReactFlow();
  const { toast } = useToast();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedFlowNodes, setSelectedFlowNodes] = useState<Node[]>([]);

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
    setViewport(getViewport());
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


  return (
    <div ref={mapContainerRef} className={cn("h-full w-full border rounded-md shadow-sm bg-muted/10 relative", isFullscreen && "fixed inset-0 z-[100] bg-background")} onContextMenu={(e) => e.preventDefault()}>
      
      <Panel position="top-center" className="p-1">
         <MapToolbar
            onGenerateInsights={handleGenerateInsights}
            onSaveLayout={handleSaveLayout}
            isGeneratingInsights={isGeneratingInsights}
          />
      </Panel>

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
        onMoveEnd={(_event, viewport) => setViewport(viewport)}
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
        
        <Panel position="top-right" className="p-1">
          <div className="flex flex-wrap items-center gap-1 bg-background/90 backdrop-blur-sm p-1 rounded-lg shadow-md border border-border">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSchemaPanelVisibility} title={isSchemaPanelVisible ? "Ocultar Painel de Esquemas" : "Mostrar Painel de Esquemas"}>
              {isSchemaPanelVisible ? <PanelLeftClose className="h-3.5 w-3.5" /> : <ListTree className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleFormulationGuidePanelVisibility} title={isFormulationGuidePanelVisible ? "Ocultar Guia de Formulação" : "Mostrar Guia de Formulação"}>
              <CheckSquare className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleQuickNotesPanelVisibility} title={isQuickNotesPanelVisible ? "Ocultar Notas Rápidas" : "Mostrar Notas Rápidas"}>
              <StickyNote className="h-3.5 w-3.5" />
            </Button>
             <Button variant="ghost" size="icon" onClick={toggleFullscreen} title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"} className="h-7 w-7">
              {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => zoomIn({ duration: 300 })} title="Aumentar Zoom" className="h-7 w-7">
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => zoomOut({ duration: 300 })} title="Diminuir Zoom" className="h-7 w-7">
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Panel>
        
        <Controls showInteractive={false} className="shadow-md !left-2 !bottom-2 !right-auto !top-auto" />

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
