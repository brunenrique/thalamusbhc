
"use client";

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Palette, Link2, Check } from 'lucide-react';
import useClinicalStore from '@/stores/clinicalStore';
import type { ClinicalNodeType, ABCCardColor } from '@/types/clinicalTypes';
import { cn } from '@/shared/utils';

const cardColorOptions: { label: string; value: ABCCardColor, style: string }[] = [
  { label: 'Padrão', value: 'default', style: 'bg-card border-border' },
  { label: 'Alerta (Vermelho)', value: 'red', style: 'bg-red-500/20 border-red-500/40 text-red-800 dark:text-red-300' },
  { label: 'Positivo (Verde)', value: 'green', style: 'bg-green-500/20 border-green-500/40 text-green-800 dark:text-green-300' },
  { label: 'Neutro (Azul)', value: 'blue', style: 'bg-blue-500/20 border-blue-500/40 text-blue-800 dark:text-blue-300' },
  { label: 'Observação (Amarelo)', value: 'yellow', style: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-800 dark:text-yellow-300' },
  { label: 'Hipótese (Roxo)', value: 'purple', style: 'bg-purple-500/20 border-purple-500/40 text-purple-800 dark:text-purple-300' },
];

const NodeContextMenu: React.FC = () => {
  const {
    isContextMenuOpen,
    contextMenuPosition,
    contextMenuNodeId,
    contextMenuNodeType,
    closeContextMenu,
    openABCForm,
    deleteCard,
    deleteSchema,
    changeCardColor,
    cards, // To get current color for checkmark
  } = useClinicalStore();

  if (!isContextMenuOpen || !contextMenuPosition || !contextMenuNodeId || !contextMenuNodeType) {
    return null;
  }

  const currentCard = contextMenuNodeType === 'abcCard' ? cards.find(c => c.id === contextMenuNodeId) : null;

  const handleEdit = () => {
    if (contextMenuNodeType === 'abcCard' && contextMenuNodeId) {
      openABCForm(contextMenuNodeId);
    } else if (contextMenuNodeType === 'schemaNode') {
      console.info("Editar Esquema (ainda não implementado):", contextMenuNodeId);
    }
    closeContextMenu();
  };

  const handleDelete = () => {
    if (contextMenuNodeType === 'abcCard' && contextMenuNodeId) {
      deleteCard(contextMenuNodeId);
    } else if (contextMenuNodeType === 'schemaNode' && contextMenuNodeId) {
      deleteSchema(contextMenuNodeId);
    }
    closeContextMenu();
  };
  
  const handleSetColor = (color: ABCCardColor) => {
    if (contextMenuNodeType === 'abcCard' && contextMenuNodeId) {
      changeCardColor(contextMenuNodeId, color);
    }
    // closeContextMenu(); // Color change should be quick, no need to close immediately unless desired
  };

  const handleLinkToSchema = () => {
    console.info("Vincular a esquema (ainda não implementado):", contextMenuNodeId);
    closeContextMenu();
  };
  
  const handleLinkCardToSchema = () => {
    console.info("Vincular card a este esquema (ainda não implementado):", contextMenuNodeId);
    closeContextMenu();
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: contextMenuPosition.x,
        top: contextMenuPosition.y,
        zIndex: 1000,
      }}
      onContextMenu={(e) => e.preventDefault()} // Prevent native context menu on our custom one
    >
      <DropdownMenu open={isContextMenuOpen} onOpenChange={(open) => !open && closeContextMenu()}>
        <DropdownMenuTrigger asChild> 
            <button style={{ display: 'none' }} aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent 
            className="w-56" 
            onCloseAutoFocus={(e) => e.preventDefault()} // Prevent focus shift on close
            onPointerDownOutside={closeContextMenu} // Close if clicking outside the menu
        >
          <DropdownMenuLabel>
            {contextMenuNodeType === 'abcCard' ? 'Opções do Card ABC' : 'Opções do Esquema'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>{contextMenuNodeType === 'abcCard' ? 'Editar Card' : 'Editar Esquema'}</span>
          </DropdownMenuItem>

          {contextMenuNodeType === 'abcCard' && (
            <>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="mr-2 h-4 w-4" />
                  <span>Mudar Cor</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {cardColorOptions.map(opt => (
                      <DropdownMenuItem key={opt.value} onClick={() => handleSetColor(opt.value)}>
                        <div className={cn("w-3 h-3 rounded-full mr-2", opt.style.split(' ')[0])} /> {/* Show color swatch */}
                        <span>{opt.label}</span>
                        {currentCard?.color === opt.value && <Check className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={handleLinkToSchema} disabled>
                <Link2 className="mr-2 h-4 w-4" />
                <span>Vincular a Esquema (Em breve)</span>
              </DropdownMenuItem>
            </>
          )}
          
          {contextMenuNodeType === 'schemaNode' && (
             <DropdownMenuItem onClick={handleLinkCardToSchema} disabled>
                <Link2 className="mr-2 h-4 w-4" />
                <span>Vincular Card (Em breve)</span>
              </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Deletar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NodeContextMenu;
