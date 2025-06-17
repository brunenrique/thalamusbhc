
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import useClinicalStore from '@/stores/clinicalStore';

const ABCForm: React.FC = () => {
  const { isABCFormOpen, closeABCForm, editingCardId } = useClinicalStore();

  return (
    <Dialog open={isABCFormOpen} onOpenChange={(open) => { if (!open) closeABCForm(); }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{editingCardId ? 'Editar Card ABC (Simples)' : 'Novo Card ABC (Simples)'}</DialogTitle>
          <DialogDescription>
            Teste de formulário ABC simplificado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
            <p>Conteúdo Simplificado do Formulário ABC.</p>
            <p>Se você vê isso, o mecanismo de abertura do diálogo está funcionando.</p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={closeABCForm}>Cancelar</Button>
          </DialogClose>
          <Button type="button" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={closeABCForm}>
            {editingCardId ? 'Salvar (Simples)' : 'Adicionar (Simples)'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ABCForm;
