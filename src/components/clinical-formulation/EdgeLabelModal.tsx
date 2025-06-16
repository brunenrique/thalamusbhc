
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import useClinicalStore from '@/stores/clinicalStore';
import type { ConnectionLabel } from '@/types/clinicalTypes';
import { nanoid } from 'nanoid';

const connectionLabels: ConnectionLabel['label'][] = ['reforça', 'causa', 'evita', 'generaliza para', 'opõe-se a', 'contextualiza'];

const EdgeLabelModal: React.FC = () => {
  const { isLabelEdgeModalOpen, closeLabelEdgeModal, pendingEdge, addEdge, updateEdgeLabel } = useClinicalStore();
  const [selectedLabel, setSelectedLabel] = useState<ConnectionLabel['label'] | ''>('');

  useEffect(() => {
    // Reset label when modal opens for a new edge or if pendingEdge changes
    if (isLabelEdgeModalOpen && pendingEdge) {
      // If the pending edge already has data (e.g., editing an existing edge), pre-fill the label
      const existingLabelData = pendingEdge.data as ConnectionLabel | undefined;
      setSelectedLabel(existingLabelData?.label || '');
    } else {
      setSelectedLabel('');
    }
  }, [isLabelEdgeModalOpen, pendingEdge]);

  const handleConfirm = () => {
    if (pendingEdge && selectedLabel) {
      const labelData: ConnectionLabel = { id: pendingEdge.data?.id || nanoid(), label: selectedLabel };
      
      // If it's an existing edge being re-labeled (not typical flow for onConnect, but good for future edits)
      if (pendingEdge.id && pendingEdge.data) {
         updateEdgeLabel(pendingEdge.id, labelData);
      } else {
        // For a new connection from onConnect
        const newEdge = {
            ...pendingEdge,
            id: pendingEdge.id || `edge-${pendingEdge.source}-${pendingEdge.target}-${nanoid(4)}`, // Ensure ID
            data: labelData,
            label: selectedLabel, // Set the visible label for React Flow
            ariaLabel: `Conexão de ${pendingEdge.sourceNode?.data.title || 'origem'} para ${pendingEdge.targetNode?.data.title || 'destino'}: ${selectedLabel}`,
        };
        addEdge(newEdge);
      }
      
      closeLabelEdgeModal();
    }
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
