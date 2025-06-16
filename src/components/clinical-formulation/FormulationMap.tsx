
"use client";

import React, { useCallback } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';

import useClinicalStore from '@/stores/clinicalStore';
import ABCCardNode from './ABCCardNode';
import SchemaNode from './SchemaNode'; // Novo componente
import EdgeLabelModal from './EdgeLabelModal'; // Novo componente
import type { ClinicalNodeData, ConnectionLabel, SchemaData, ABCCardData } from '@/types/clinicalTypes';
import { Button } from '../ui/button';
import { Brain, Save, Trash2, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';

const nodeTypes = {
  abcCard: ABCCardNode,
  schemaNode: SchemaNode,
};

// Define initial viewport settings
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
    deleteCard, // For direct deletion from map context menu (future)
    deleteSchema, // For direct deletion from map context menu (future)
    fetchClinicalData, // Para carregar dados mock
    saveClinicalData, // Para simular salvamento
  } = useClinicalStore();

  const { fitView, zoomIn, zoomOut, getViewport, setCenter } = useReactFlow();

  React.useEffect(() => {
    // Carregar dados mock ao montar o componente (apenas para demonstração)
    // Em uma app real, isso seria acionado pela navegação para a página do paciente
    fetchClinicalData('mockPatientId'); 
  }, [fetchClinicalData]);


  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // Abre o modal para adicionar o rótulo
      // Precisamos criar um objeto Edge básico para passar para o modal
      const newEdgeBase: Edge = {
        id: `edge-${params.source}-${params.target}-${Date.now()}`, // Temp ID, store.addEdge pode gerar final
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        // data e label serão definidos no modal
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
    setViewport(getViewport()); // Salva o viewport atual no store
    saveClinicalData('mockPatientId'); // Simula salvar todo o estudo
  };

  const handleFitView = () => {
    fitView({ padding: 0.1, duration: 300 });
  };

  // Placeholder para seleção e deleção múltipla (a ser implementado com mais detalhes)
  const onSelectionChange = useCallback((elements: { nodes: Node[], edges: Edge[] }) => {
    // console.log('Selection changed', elements);
  }, []);

  // Para deleção via tecla Backspace/Delete
  // A lógica de deleção já está no onNodesChange/onEdgesChange da store se eles chamam deleteCard/deleteSchema
  // Se não, precisaríamos de um handler onNodesDelete/onEdgesDelete aqui que chama as funções da store.

  return (
    <div style={{ height: 'calc(100vh - 220px)', width: '100%' }} className="border rounded-md shadow-sm bg-muted/10 relative">
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
        onMoveEnd={(_event, viewport) => setViewport(viewport)} // Salva o viewport ao mover
        minZoom={0.1}
        maxZoom={2}
        selectionMode={SelectionMode.Partial} // Permite seleção de múltiplos nós/arestas
        deleteKeyCode={['Backspace', 'Delete']}
        // onNodesDelete={(deletedNodes) => deletedNodes.forEach(node => node.type === 'abcCard' ? deleteCard(node.id) : deleteSchema(node.id))}
        // onEdgesDelete={(deletedEdges) => deletedEdges.forEach(edge => removeEdge(edge.id))} // se removeEdge estiver no store
        attributionPosition="bottom-left"
        className="thalamus-flow"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls showInteractive={false} className="shadow-md" />
        <MiniMap nodeStrokeWidth={3} zoomable pannable className="shadow-md rounded-md border" />
        
        <Panel position="top-right" className="p-2 space-x-1.5">
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
        {/* Futuro: <MapToolbar /> para filtros e outras ações */}
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
