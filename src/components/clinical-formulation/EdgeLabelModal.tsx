
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useClinicalStore } from '@/stores/clinicalStore';
import type { ConnectionLabel } from '@/types/clinicalTypes';
import { nanoid } from 'nanoid';
import type { Edge, Connection } from 'reactflow';

const connectionLabels: ConnectionLabel['label'][] = ['reforça', 'causa', 'evita', 'generaliza para', 'opõe-se a', 'contextualiza'];

const EdgeLabelModal: React.FC = () => {
  const { isLabelEdgeModalOpen, closeLabelEdgeModal, pendingEdge, addEdge, updateEdgeLabel } = useClinicalStore();
  const [selectedLabel, setSelectedLabel] = useState<ConnectionLabel['label'] | ''>('');

  useEffect(() => {
    if (isLabelEdgeModalOpen && pendingEdge) {
      // Check if pendingEdge is a full Edge object (has 'id') and data
      if ('id' in pendingEdge && pendingEdge.data) {
        const existingLabelData = pendingEdge.data as ConnectionLabel;
        setSelectedLabel(existingLabelData.label || '');
      } else {
        // New connection or edge without pre-existing label data
        setSelectedLabel('');
      }
    } else {
      setSelectedLabel(''); // Reset when modal is closed or no pendingEdge
    }
  }, [isLabelEdgeModalOpen, pendingEdge]);

  const handleConfirm = () => {
    if (!pendingEdge || !selectedLabel) return;

    // Check if pendingEdge is a full Edge object (has 'id')
    if ('id' in pendingEdge && pendingEdge.id) { // Existing Edge or Edge object from a new connection
      const edgeToUpdateOrAdd = pendingEdge as Edge<ConnectionLabel | undefined>;
      const labelData: ConnectionLabel = { 
          id: edgeToUpdateOrAdd.data?.id || nanoid(), // reuse or create label id
          label: selectedLabel 
      };
      
      // If it's an existing edge with data, update it
      if (edgeToUpdateOrAdd.data) {
        updateEdgeLabel(edgeToUpdateOrAdd.id, labelData);
      } else { // It's a new edge (e.g. from onConnect, but somehow passed as Edge object, or onEdgeDoubleClick on an unlabeled edge)
        const newEdge: Edge<ConnectionLabel> = {
            ...edgeToUpdateOrAdd,
            id: edgeToUpdateOrAdd.id, // Use existing ID if provided
            data: labelData,
            label: selectedLabel,
            type: edgeToUpdateOrAdd.type || 'smoothstep', // Default type
            ariaLabel: `Conexão de ${edgeToUpdateOrAdd.sourceNode?.data.title || 'origem'} para ${edgeToUpdateOrAdd.targetNode?.data.title || 'destino'}: ${selectedLabel}`,
        };
        addEdge(newEdge); // Treat as adding a new fully formed edge, or let addEdge handle if it's an update
      }
    } else if ('source' in pendingEdge && 'target' in pendingEdge) { // New Connection object from onConnect
        const connection = pendingEdge as Connection;
        const labelData: ConnectionLabel = { id: nanoid(), label: selectedLabel };
        const newEdge: Edge<ConnectionLabel> = {
            id: `edge-${connection.source}-${connection.target}-${nanoid(4)}`,
            source: connection.source,
            target: connection.target,
            sourceHandle: connection.sourceHandle,
            targetHandle: connection.targetHandle,
            data: labelData,
            label: selectedLabel,
            type: 'smoothstep', // Or your default edge type
            ariaLabel: `Conexão de ${connection.sourceNode?.data.title || 'origem'} para ${connection.targetNode?.data.title || 'destino'}: ${selectedLabel}`,
        };
        addEdge(newEdge);
    }
    closeLabelEdgeModal();
  };
  
  if (!pendingEdge) return null;

  return (
    <Dialog open={isLabelEdgeModalOpen} onOpenChange={(open) => { if (!open) closeLabelEdgeModal(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Rotular Conexão</DialogTitle>
          <DialogDescription>
            Como estes dois elementos se relacionam?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="connection-label-select">Tipo de Relação</Label>
          <Select onValueChange={(value) => setSelectedLabel(value as ConnectionLabel['label'])} value={selectedLabel}>
            <SelectTrigger id="connection-label-select">
              <SelectValue placeholder="Selecione um rótulo" />
            </SelectTrigger>
            <SelectContent>
              {connectionLabels.map(label => (
                <SelectItem key={label} value={label}>{label.charAt(0).toUpperCase() + label.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="button" onClick={handleConfirm} disabled={!selectedLabel} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Confirmar Rótulo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EdgeLabelModal;
