import React, { createContext, useContext, useState } from 'react';
import type { ClinicalNodeType } from '@/types/clinicalTypes';

interface MapInteractionContextValue {
  isContextMenuOpen: boolean;
  contextMenuPosition: { x: number; y: number } | null;
  contextMenuNodeId: string | null;
  contextMenuNodeType: ClinicalNodeType | null;
  openContextMenu: (
    nodeId: string,
    nodeType: ClinicalNodeType,
    position: { x: number; y: number }
  ) => void;
  closeContextMenu: () => void;
  onEditNode?: (nodeId: string, type: ClinicalNodeType) => void;
  onDeleteNode?: (nodeId: string, type: ClinicalNodeType) => void;
}

const MapInteractionContext = createContext<MapInteractionContextValue | undefined>(
  undefined
);

interface ProviderProps {
  children: React.ReactNode;
  onEditNode?: (nodeId: string, type: ClinicalNodeType) => void;
  onDeleteNode?: (nodeId: string, type: ClinicalNodeType) => void;
}

export const MapInteractionProvider: React.FC<ProviderProps> = ({
  children,
  onEditNode,
  onDeleteNode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [nodeId, setNodeId] = useState<string | null>(null);
  const [nodeType, setNodeType] = useState<ClinicalNodeType | null>(null);

  const openContextMenu = (
    id: string,
    type: ClinicalNodeType,
    pos: { x: number; y: number }
  ) => {
    setNodeId(id);
    setNodeType(type);
    setPosition(pos);
    setIsOpen(true);
  };

  const closeContextMenu = () => {
    setIsOpen(false);
    setPosition(null);
    setNodeId(null);
    setNodeType(null);
  };

  return (
    <MapInteractionContext.Provider
      value={{
        isContextMenuOpen: isOpen,
        contextMenuPosition: position,
        contextMenuNodeId: nodeId,
        contextMenuNodeType: nodeType,
        openContextMenu,
        closeContextMenu,
        onEditNode,
        onDeleteNode,
      }}
    >
      {children}
    </MapInteractionContext.Provider>
  );
};

export const useMapInteraction = () => {
  const context = useContext(MapInteractionContext);
  if (!context) {
    throw new Error('useMapInteraction must be used within MapInteractionProvider');
  }
  return context;
};

export default MapInteractionContext;
