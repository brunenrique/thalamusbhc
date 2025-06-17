
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
import MapToolbar from './MapToolbar';
import type { ClinicalNodeData, ConnectionLabel, SchemaData, ABCCardData, ClinicalNodeType, QuickNote } from '@/types/clinicalTypes';
import { isABCCardData, isSchemaData } from '@/types/clinicalTypes';
import { useToast } from '@/hooks/use-toast';
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
    openContextMenu,
    closeContextMenu,
    isContextMenuOpen,
    activeColorFilters,
    showSchemaNodes,
    isSchemaPanelVisible,
    isFormulationGuidePanelVisible,
    isQuickNotesPanelVisible,
    emotionIntensityFilter,
    get: getClinicalStoreState,
  } = useClinicalStore();

  const { fitView, zoomIn, zoomOut, getViewport, getNodes, getEdges } = useReactFlow();
  const { toast } = useToast();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedFlowNodes, setSelectedFlowNodes] = useState<Node[]>([]);


  useEffect(() => {
    fetchClinicalData('mockPatientId');

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [fetchClinicalData]);

  const displayedNodes = useMemo(() => {
    const filtered = storeNodes.filter(node => {
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
    return filtered;
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
      // Removido: const generated = await runAnalysis(currentCards, currentSchemas);
      // Simulação de uma análise que não depende de runAnalysis
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
  }, []);

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
        onSelectionChange={handleSelectionChange}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls showInteractive={false} className="shadow-md !right-2 !top-2 !left-auto !bottom-auto" />
        
        <Panel position="top-center" className="p-1">
            <MapToolbar
                toggleFullscreen={toggleFullscreen}
                isFullscreen={isFullscreen}
                handleZoomIn={() => zoomIn({ duration: 300 })}
                handleZoomOut={() => zoomOut({ duration: 300 })}
                handleGenerateInsights={handleGenerateInsights}
                isGeneratingInsights={isGeneratingInsights}
                handleSaveLayout={handleSaveLayout}
                selectedFlowNodes={selectedFlowNodes}
            />
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

