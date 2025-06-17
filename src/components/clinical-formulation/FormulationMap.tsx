
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
// import SchemaPanel from './SchemaPanel';
// import FormulationGuidePanel from './FormulationGuidePanel';
// import QuickNotesPanel from './QuickNotesPanel';
// import QuickNoteForm from './QuickNoteForm';
// import NodeContextMenu from './NodeContextMenu';
// import ABCForm from './ABCForm';
// import SchemaForm from './SchemaForm';
// import EdgeLabelModal from './EdgeLabelModal';
import type { ClinicalNodeData, ConnectionLabel, SchemaData, ABCCardData, ClinicalNodeType, QuickNote } from '@/types/clinicalTypes';
import { isABCCardData, isSchemaData } from '@/types/clinicalTypes';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/shared/utils';
// import { Button } from '@/components/ui/button';
// import { Slider } from '@/components/ui/slider';
// import { Separator } from '@/components/ui/separator';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import {
//   PanelLeftOpen, PanelLeftClose, HelpCircle as FormulationGuideIcon, CheckSquare, StickyNote, Maximize, Minimize, ZoomIn, ZoomOut, Settings, ListTree,
//   PlusCircle, Share2, Users, Lightbulb, Save, RotateCcw, GripVertical, GripHorizontal, MessageSquare
// } from 'lucide-react';
// import MapToolbar from './MapToolbar';


const nodeTypes = {
  abcCard: ABCCardNode,
  schemaNode: SchemaNode,
};

const initialViewport = { x: 0, y: 0, zoom: 0.9 };

// const groupBorderColors = [
//     { label: "Vermelho", value: "border-red-500", badgeBg: "bg-red-500/20" },
//     { label: "Verde", value: "border-green-500", badgeBg: "bg-green-500/20" },
//     { label: "Azul", value: "border-blue-500", badgeBg: "bg-blue-500/20" },
//     // ... other colors
// ];


const FormulationMap: React.FC = () => {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    onNodesChange: storeOnNodesChange,
    onEdgesChange: storeOnEdgesChange,
    addEdge: storeAddEdge,
    // openLabelEdgeModal,
    // setViewport: storeSetViewport,
    // updateCardPosition,
    // updateSchemaPosition,
    // fetchClinicalData,
    // saveClinicalData,
    // setInsights,
    // openContextMenu,
    // closeContextMenu,
    // isContextMenuOpen,
    // activeColorFilters,
    // showSchemaNodes,
    // isSchemaPanelVisible,
    // toggleSchemaPanelVisibility,
    // isFormulationGuidePanelVisible,
    // toggleFormulationGuidePanelVisibility,
    // isQuickNotesPanelVisible,
    // toggleQuickNotesPanelVisibility,
    // emotionIntensityFilter,
    // setEmotionIntensityFilter,
    // get: getClinicalStoreState,
    // prefillSchemaRule,
    // toolbarOrientation,
    // toggleToolbarOrientation,
    // openABCForm,
    // openSchemaForm,
    // openQuickNoteForm,
    // createGroupFromSelectedNodes,
    // selectedFlowNodes,
    // setSelectedFlowNodes,
  } = useClinicalStore();

  // const reactFlowInstance = useReactFlow(); 
  // const { toast } = useToast();
  // const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  // const [isFullscreen, setIsFullscreen] = useState(false);
  // const mapContainerRef = useRef<HTMLDivElement>(null);

  // const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  // const [newGroupName, setNewGroupName] = useState("");
  // const [newGroupColor, setNewGroupColor] = useState(groupBorderColors[0].value);


  // useEffect(() => {
  //   // fetchClinicalData('mockPatientId');
  //   // const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
  //   // document.addEventListener('fullscreenchange', handleFullscreenChange);
  //   // return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  //   // console.log("FormulationMap useEffect (simplified)");
  // }, []);

  // const displayedNodes = useMemo(() => {
  //   // Simplified
  //   return storeNodes; 
  // }, [storeNodes]);

  const onConnectInternal = useCallback(
    (params: Connection | Edge) => {
      // For now, let's use the store's addEdge which should handle creating label data
      const newEdge = { 
        ...params, 
        id: `edge-${params.source}-${params.target}-${Math.random().toString(36).substring(7)}`, // Basic unique ID
        type: 'smoothstep', // Or your default edge type
        // data: { label: 'relaciona-se com' } // Example, this will be handled by openLabelEdgeModal later
      } as Edge<ConnectionLabel|undefined>; // Cast to allow undefined data initially
      storeAddEdge(newEdge); // Add to store, which will then trigger openLabelEdgeModal if needed
    },
    [storeAddEdge]
  );

  // const handleSaveLayout = () => {
  //   // Simplified
  // };

  // const handleGenerateInsights = async () => {
  //  // Simplified
  // };

  // const handleNodeContextMenu = useCallback(
  //   (event: NodeMouseEvent, node: Node<ClinicalNodeData>) => {
  //     // Simplified
  //   }, []
  // );

  // const onPaneClick = useCallback(() => {
  //   // Simplified
  // }, []);

  // const onEdgeDoubleClick = useCallback(
  //   (_event: EdgeMouseEvent, edge: Edge<ConnectionLabel | undefined>) => {
  //       // Simplified
  //   }, []
  // );

  // const toggleFullscreenHandler = () => {
  //   // Simplified
  // };

  // const handleSelectionChange = useCallback((params: OnSelectionChangeParams) => {
  //   // Simplified
  // }, []);

  // const selectedAbcCardIdsForGroup = useMemo(() => [], []);

  // const handleCreateGroup = () => {
  //   // Simplified
  // };

  // const commonButtonClass = "h-7 w-7";
  // const commonIconClass = "h-3.5 w-3.5";

  // If storeNodes or storeEdges are undefined, React Flow might throw an error.
  // Providing empty arrays as a fallback.
  const nodesToRender = storeNodes || [];
  const edgesToRender = storeEdges || [];

  return (
    <div /*ref={mapContainerRef}*/ className={cn("h-full w-full border rounded-md shadow-sm bg-muted/10 relative")}>
      {/* <p>FormulationMap Component Rendered (Internal Logic Commented) - Debugging "Algo deu errado"</p> */}
       <ReactFlow
          nodes={nodesToRender}
          edges={edgesToRender}
          onNodesChange={storeOnNodesChange}
          onEdgesChange={storeOnEdgesChange}
          onConnect={onConnectInternal}
          nodeTypes={nodeTypes}
          fitView
          // fitViewOptions={{ padding: 0.2 }}
          // defaultViewport={initialViewport}
          // onMoveEnd={(_event, viewport) => storeSetViewport(viewport)}
          // onNodeContextMenu={handleNodeContextMenu}
          // onPaneClick={onPaneClick}
          // onEdgeDoubleClick={onEdgeDoubleClick}
          // proOptions={{ hideAttribution: true }}
          // selectionMode={SelectionMode.Partial}
          // onSelectionChange={handleSelectionChange}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          {/* <Controls position="bottom-left"/> */}
          {/* <Panel position="top-center" className="p-1">
            <MapToolbar
              toolbarOrientation={toolbarOrientation}
              toggleToolbarOrientation={toggleToolbarOrientation}
              onGenerateInsights={handleGenerateInsights}
              onSaveLayout={handleSaveLayout}
              isGeneratingInsights={isGeneratingInsights}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreenHandler}
              selectedFlowNodes={selectedFlowNodes || []}
            />
          </Panel> */}
          {/* <Panel position="left" className={cn("bg-card border rounded-lg shadow-lg h-auto max-h-[calc(100%-110px)] w-64 transition-transform duration-300 ease-in-out flex flex-col", isSchemaPanelVisible ? "translate-x-0" : "-translate-x-full opacity-50 pointer-events-none")}>
             <SchemaPanel />
          </Panel>
          <Panel position="right" className={cn("bg-card border rounded-lg shadow-lg h-auto max-h-[calc(100%-110px)] w-64 transition-transform duration-300 ease-in-out flex flex-col", isFormulationGuidePanelVisible ? "translate-x-0" : "translate-x-full opacity-50 pointer-events-none")}>
            <FormulationGuidePanel />
          </Panel>
          <Panel position="bottom-right" className={cn("bg-card border rounded-lg shadow-lg h-auto max-h-[40%] w-72 transition-transform duration-300 ease-in-out flex flex-col", isQuickNotesPanelVisible ? "translate-y-0" : "translate-y-full opacity-50 pointer-events-none")}>
            <QuickNotesPanel />
          </Panel> */}
        </ReactFlow>
      {/* Modals can remain as they are conditionally rendered
      <NodeContextMenu />
      <QuickNoteForm />
      <ABCForm />
      <SchemaForm />
      <EdgeLabelModal /> */}
    </div>
  );
};

const FormulationMapWrapper: React.FC = () => (
  <ReactFlowProvider>
    <FormulationMap />
  </ReactFlowProvider>
);

export default FormulationMapWrapper;
