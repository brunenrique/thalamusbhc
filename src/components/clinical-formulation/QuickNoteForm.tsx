
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useClinicalStore from '@/stores/clinicalStore';

const QuickNoteForm: React.FC = () => {
  const {
    isQuickNoteFormOpen,
    closeQuickNoteForm,
    quickNoteFormTarget,
  } = useClinicalStore();

  const noteToEdit = quickNoteFormTarget?.noteIdToEdit;


  return (
    <Dialog open={isQuickNoteFormOpen} onOpenChange={(open) => { if (!open) closeQuickNoteForm(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">{noteToEdit ? "Editar Anotação Rápida (Simples)" : "Nova Anotação Rápida (Simples)"}</DialogTitle>
          <DialogDescription>
            Teste de formulário de anotação rápida simplificado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
            <p>Conteúdo Simplificado do Formulário de Anotação Rápida.</p>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={closeQuickNoteForm}>Cancelar</Button>
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
