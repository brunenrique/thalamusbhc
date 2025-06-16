
"use client";

import React, { useCallback, useState } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';

import useClinicalStore from '@/stores/clinicalStore';
import ABCCardNode from './ABCCardNode';
import SchemaNode from './SchemaNode'; 
import EdgeLabelModal from './EdgeLabelModal'; 
import type { ClinicalNodeData, ConnectionLabel, SchemaData, ABCCardData } from '@/types/clinicalTypes';
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
    nodes, 
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
  } = useClinicalStore();

  const { fitView, zoomIn, zoomOut, getViewport } = useReactFlow();
  const { toast } = useToast();
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  React.useEffect(() => {
    fetchClinicalData('mockPatientId'); 
  }, [fetchClinicalData]);


  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdgeBase: Edge = {
        id: `edge-${params.source}-${params.target}-${Date.now()}`, 
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      };
      openLabelEdgeModal(newEdgeBase);
    },
    [openLabelEdgeModal]
  );

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node<ClinicalNodeData>) => {
      if (node.positionAbsolute) {
        if (node.type === 'abcCard') {
          updateCardPosition(node.id, node.positionAbsolute);
        } else if (node.type === 'schemaNode') {
          updateSchemaPosition(node.id, node.positionAbsolute);
        }
      }
    },
    [updateCardPosition, updateSchemaPosition]
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
      const generated = await runAnalysis(cards, schemas);
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


  return (
    <div style={{ height: '100%', width: '100%' }} className="border rounded-md shadow-sm bg-muted/10 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={storeOnNodesChange}
        onEdgesChange={storeOnEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
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
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls showInteractive={false} className="shadow-md" />
        <MiniMap nodeStrokeWidth={3} zoomable pannable className="shadow-md rounded-md border" />
        
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
