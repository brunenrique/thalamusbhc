"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, PlusCircle, Pencil } from 'lucide-react';
import { useClinicalStore } from '@/stores/clinicalStore';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createQuickNote } from '@/services/quickNoteService';

const QuickNoteForm: React.FC = () => {
  const {
    isQuickNoteFormOpen,
    closeQuickNoteForm,
    quickNoteFormTarget,
  } = useClinicalStore();
  const addQuickNote = useClinicalStore((s) => s.addQuickNote);
  const { toast } = useToast();
  const params = useParams();
  const patientId = Array.isArray(params.patientId) ? params.patientId[0] : params.patientId;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [note, setNote] = useState('');
  const noteToEdit = quickNoteFormTarget?.noteIdToEdit;

  const handleSubmit = async () => {
    if (!note.trim() || !patientId) return;
    try {
      const id = await createQuickNote(patientId, {
        text: note.trim(),
        title: quickNoteFormTarget?.defaultText,
        linkedCardId: quickNoteFormTarget?.cardId,
      });
      addQuickNote({
        id,
        text: note.trim(),
        title: quickNoteFormTarget?.defaultText,
        linkedCardId: quickNoteFormTarget?.cardId,
        createdAt: new Date().toISOString(),
      });
      toast({ title: 'Anotação salva' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Erro ao salvar anotação', variant: 'destructive' });
    }
    closeQuickNoteForm();
  };

  useEffect(() => {
    setDialogOpen(isQuickNoteFormOpen);
    if (!isQuickNoteFormOpen) setNote('');
  }, [isQuickNoteFormOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeQuickNoteForm();
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {noteToEdit ? "Editar Anotação Rápida (Simplificada)" : "Nova Anotação Rápida (Simplificada)"}
          </DialogTitle>
          <DialogDescription>
            Quick Note Form Test
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <textarea
            aria-label="Conteúdo da anotação"
            className="w-full border rounded-md p-2 text-sm"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <div className="w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 text-sm font-medium w-full"
                aria-label="Cancelar anotação"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </DialogClose>
          <Button
            type="button"
            aria-label={noteToEdit ? 'Salvar anotação' : 'Adicionar anotação'}
            className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2 text-sm font-medium w-full sm:w-auto"
            onClick={handleSubmit}
          >
            {noteToEdit ? <Pencil className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {noteToEdit ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickNoteForm;
