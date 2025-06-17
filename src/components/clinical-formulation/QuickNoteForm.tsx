
"use client";

import React, { useState, useEffect } from 'react'; // Adicionado useState e useEffect
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useClinicalStore from '@/stores/clinicalStore';

const QuickNoteForm: React.FC = () => {
  const {
    isQuickNoteFormOpen,
    closeQuickNoteForm,
    quickNoteFormTarget,
  } = useClinicalStore();
  const [dialogOpen, setDialogOpen] = useState(false); // Estado local

  const noteToEdit = quickNoteFormTarget?.noteIdToEdit;

  useEffect(() => {
    setDialogOpen(isQuickNoteFormOpen); // Sincroniza com o store
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
        
        <div className="py-4">
            <p>Conteúdo Simplificado do Formulário de Anotação Rápida.</p>
            <p>Se você vê isto, o diálogo está abrindo.</p>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            {/* closeQuickNoteForm já é chamado por handleOpenChange */}
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="button" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={closeQuickNoteForm}>
            {noteToEdit ? "Salvar (Simples)" : "Adicionar (Simples)"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickNoteForm;
