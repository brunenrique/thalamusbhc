
"use client";

import React, { useState, useEffect } from 'react'; // Adicionado useState e useEffect
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useClinicalStore } from '@/stores/clinicalStore';

const ABCForm: React.FC = () => {
  const { isABCFormOpen, closeABCForm, editingCardId } = useClinicalStore();
  const [dialogOpen, setDialogOpen] = useState(false); // Estado local

  useEffect(() => {
    setDialogOpen(isABCFormOpen); // Sincroniza com o store
  }, [isABCFormOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeABCForm(); // Chama a ação do store para fechar
    }
    // setDialogOpen(open) é tratado pelo Dialog, que chamará onOpenChange
    // Não precisamos de setDialogOpen(open) aqui explicitamente se o Dialog já faz isso via onOpenChange
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{editingCardId ? 'Editar Card ABC (Simplificado)' : 'Novo Card ABC (Simplificado)'}</DialogTitle>
          <DialogDescription>
            ABC Form Test
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
            <p>Conteúdo Simplificado do Formulário ABC.</p>
            <p>Se você vê isso, o diálogo está abrindo.</p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            {/* closeABCForm já é chamado por handleOpenChange */}
            <Button type="button" variant="outline">Cancelar</Button>
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
