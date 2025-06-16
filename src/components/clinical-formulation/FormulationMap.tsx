
"use client";

import React, { useCallback, useState, useEffect, useMemo } from 'react';
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
  EdgeMouseEvent, // Import EdgeMouseEvent
} from 'reactflow';
import 'reactflow/dist/style.css';

import useClinicalStore from '@/stores/clinicalStore';
import ABCCardNode from './ABCCardNode';
import SchemaNode from './SchemaNode'; 
import EdgeLabelModal from './EdgeLabelModal'; 
import NodeContextMenu from './NodeContextMenu';
import MapToolbar from './MapToolbar'; // Import MapToolbar
import type { ClinicalNodeData, ConnectionLabel, SchemaData, ABCCardData, ClinicalNodeType } from '@/types/clinicalTypes';
import { isABCCardData, isSchemaData } from '@/types/clinicalTypes';
import { Button } from '../ui/button';
import { Brain, Save, Trash2, ZoomIn, ZoomOut, Maximize, Minimize, Lightbulb } from 'lucide-react'; 
import { runAnalysis } from '@/services/insightEngine'; 
import { useToast } from '@/hooks/use-toast'; 


const nodeTypes = {
  abcCard: ABCCardNode,
  schemaNode: SchemaNode,
};

const initialViewport = { x: 0, y: 0, zoom: 0.9 };

const FormulationMap: React.FC = () => {
  const { 
    nodes: storeNodes, // Renomear para evitar conflito com o estado local do React Flow (se houver)
    edges, 
    onNodesChange: storeOnNodesChange, 
    onEdgesChange: storeOnEdgesChange,
    openLabelEdgeModal,
    setViewport,
    updateCardPosition,
    updateSchemaPosition,
    fetchClinicalData, 
    saveClinicalData, 
    cards, 
    schemas, 
    setInsights, 
    addInsight,
    openContextMenu,
    closeContextMenu,
    isContextMenuOpen,
    activeColorFilters, // Para o filtro
    showSchemaNodes,   // Para o filtro
  } = useClinicalStore();

  const { fitView, zoomIn, zoomOut, getViewport, screenToFlowPosition } = useReactFlow();
  const { toast } = useToast();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    fetchClinicalData('mockPatientId'); 
  }, [fetchClinicalData]);

  const displayedNodes = useMemo(() => {
    return storeNodes.filter(node => {
      if (node.type === 'abcCard' && isABCCardData(node.data)) {
        return activeColorFilters.length === 0 || activeColorFilters.includes(node.data.color);
      }
      if (node.type === 'schemaNode') {
        return showSchemaNodes;
      }
      return true; // Para outros tipos de nós, se houver
    });
  }, [storeNodes, activeColorFilters, showSchemaNodes]);


  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdgeBase: Edge = {
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        type: 'smoothstep', // Default edge type
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
      const currentCards = get().cards; // Obter estado atual do store
      const currentSchemas = get().schemas;
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
      openLabelEdgeModal(edge); // Passa a aresta existente para o modal
    },
    [openLabelEdgeModal]
  );

  return (
    <div style={{ height: '100%', width: '100%' }} className="border rounded-md shadow-sm bg-muted/10 relative" onContextMenu={(e) => e.preventDefault()}>
      <ReactFlow
        nodes={displayedNodes} // Usar os nós filtrados
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
        className="thalamus-flow"
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={onPaneClick}
        onEdgeDoubleClick={onEdgeDoubleClick} // Adicionado handler
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls showInteractive={false} className="shadow-md" />
        <MiniMap nodeStrokeWidth={3} zoomable pannable className="shadow-md rounded-md border" />
        
        <Panel position="top-left" className="p-1.5 !m-0 !bg-transparent !border-none !shadow-none">
            <MapToolbar />
        </Panel>

        <Panel position="top-right" className="p-2 space-x-1.5 flex items-center">
          <Button variant="outline" size="sm" onClick={handleGenerateInsights} disabled={isGeneratingInsights} title="Gerar Insights de IA">
            <Lightbulb className="h-3.5 w-3.5 mr-1" /> {isGeneratingInsights ? "Gerando..." : "Insights IA"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleFitView} title="Ajustar visualização">
            <Maximize className="h-3.5 w-3.5 mr-1" /> Ajustar
          </Button>
           <Button variant="outline" size="sm" onClick={() => zoomIn({duration: 300})} title="Aumentar Zoom">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => zoomOut({duration: 300})} title="Diminuir Zoom">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button variant="default" size="sm" onClick={handleSaveLayout} className="bg-accent hover:bg-accent/90 text-accent-foreground" title="Salvar estudo de caso">
            <Save className="h-3.5 w-3.5 mr-1" /> Salvar Estudo
          </Button>
        </Panel>
      </ReactFlow>
      <EdgeLabelModal />
      <NodeContextMenu />
    </div>
  );
};

const FormulationMapWrapper: React.FC = () => {
  // Access Zustand store state getter if needed for `runAnalysis`
  // For example, if `runAnalysis` needed the most up-to-date state directly
  const getStoreState = useClinicalStore.getState;

  return (
    <ReactFlowProvider>
      <FormulationMap />
    </ReactFlowProvider>
  );
}

export default FormulationMapWrapper;
