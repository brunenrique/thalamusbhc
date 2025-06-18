
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, PlusCircle, Pencil } from 'lucide-react';
import { useClinicalStore } from '@/stores/clinicalStore';

const QuickNoteForm: React.FC = () => {
  const {
    isQuickNoteFormOpen,
    closeQuickNoteForm,
    quickNoteFormTarget,
  } = useClinicalStore();
  const [dialogOpen, setDialogOpen] = useState(false); // Estado local
  const [note, setNote] = useState('');

  const noteToEdit = quickNoteFormTarget?.noteIdToEdit;

  const handleSubmit = () => {
    if (!note.trim()) return;
    closeQuickNoteForm();
  };

  useEffect(() => {
    setDialogOpen(isQuickNoteFormOpen); // Sincroniza com o store
    if (!isQuickNoteFormOpen) setNote('');
  }, [isQuickNoteFormOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeQuickNoteForm(); // Chama a ação do store para fechar
    }
    // setDialogOpen(open) é tratado pelo Dialog, que chamará onOpenChange
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">{noteToEdit ? "Editar Anotação Rápida (Simplificada)" : "Nova Anotação Rápida (Simplificada)"}</DialogTitle>
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
            {/* closeQuickNoteForm já é chamado por handleOpenChange */}
            <Button type="button" variant="outline" className="flex items-center gap-2 text-sm font-medium" aria-label="Cancelar anotação">
              <X className="h-4 w-4" /> Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            aria-label={noteToEdit ? 'Salvar anotação' : 'Adicionar anotação'}
            className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-2 text-sm font-medium"
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
