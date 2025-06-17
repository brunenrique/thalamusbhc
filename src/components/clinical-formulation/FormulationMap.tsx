
"use client";

import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
// Commenting out React Flow imports for now
// import ReactFlow, {
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge as rfAddEdge,
//   type Connection,
//   type Edge,
//   type Node,
//   BackgroundVariant,
//   useReactFlow,
//   SelectionMode,
//   Panel,
//   ReactFlowProvider,
//   NodeMouseEvent,
//   EdgeMouseEvent,
//   OnSelectionChangeParams,
// } from 'reactflow';
// import 'reactflow/dist/style.css';

// Commenting out store and component imports for now
// import useClinicalStore from '@/stores/clinicalStore';
// import ABCCardNode from './ABCCardNode';
// import SchemaNode from './SchemaNode';
// import SchemaPanel from './SchemaPanel';
// import FormulationGuidePanel from './FormulationGuidePanel';
// import QuickNotesPanel from './QuickNotesPanel';
// import QuickNoteForm from './QuickNoteForm';
// import NodeContextMenu from './NodeContextMenu';
// import ABCForm from './ABCForm';
// import SchemaForm from './SchemaForm';
// import EdgeLabelModal from './EdgeLabelModal';
// import type { ClinicalNodeData, ConnectionLabel, SchemaData, ABCCardData, ClinicalNodeType, QuickNote } from '@/types/clinicalTypes';
// import { isABCCardData, isSchemaData } from '@/types/clinicalTypes';
// import { useToast } from '@/hooks/use-toast';
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
import { ReactFlowProvider } from 'reactflow'; // Keep provider for wrapper


// const nodeTypes = {
//   abcCard: ABCCardNode,
//   schemaNode: SchemaNode,
// };

// const initialViewport = { x: 0, y: 0, zoom: 0.9 };

// const groupBorderColors = [
//     { label: "Vermelho", value: "border-red-500", badgeBg: "bg-red-500/20" },
//     { label: "Verde", value: "border-green-500", badgeBg: "bg-green-500/20" },
//     { label: "Azul", value: "border-blue-500", badgeBg: "bg-blue-500/20" },
//     // ... other colors
// ];


const FormulationMap: React.FC = () => {
  // Commenting out most hooks and state logic
  // const {
  //   nodes: storeNodes,
  //   edges,
  //   onNodesChange: storeOnNodesChange,
  //   onEdgesChange: storeOnEdgesChange,
  //   openLabelEdgeModal,
  //   setViewport: storeSetViewport,
  //   updateCardPosition,
  //   updateSchemaPosition,
  //   fetchClinicalData,
  //   saveClinicalData,
  //   setInsights,
  //   openContextMenu,
  //   closeContextMenu,
  //   isContextMenuOpen,
  //   activeColorFilters,
  //   showSchemaNodes,
  //   isSchemaPanelVisible,
  //   toggleSchemaPanelVisibility,
  //   isFormulationGuidePanelVisible,
  //   toggleFormulationGuidePanelVisibility,
  //   isQuickNotesPanelVisible,
  //   toggleQuickNotesPanelVisibility,
  //   emotionIntensityFilter,
  //   setEmotionIntensityFilter,
  //   get: getClinicalStoreState,
  //   prefillSchemaRule,
  //   toolbarOrientation,
  //   toggleToolbarOrientation,
  //   openABCForm,
  //   openSchemaForm,
  //   openQuickNoteForm,
  //   createGroupFromSelectedNodes,
  //   selectedFlowNodes,
  //   setSelectedFlowNodes,
  // } = useClinicalStore();

  // const reactFlowInstance = useReactFlow(); // This would cause error if ReactFlowProvider is not wrapping
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
  //   console.log("FormulationMap useEffect (simplified)");
  // }, []);

  // const displayedNodes = useMemo(() => {
  //   return []; // Simplified
  // }, []);

  // const onConnect = useCallback((params: Connection | Edge) => {
  //   // Simplified
  // }, []);

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

  return (
    <div /*ref={mapContainerRef}*/ className={cn("h-full w-full border rounded-md shadow-sm bg-muted/10 relative")}>
      <p>FormulationMap Component Rendered (Internal Logic Commented) - Debugging "Algo deu errado"</p>
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
