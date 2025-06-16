
"use client";

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Palette, Link2 } from 'lucide-react';
import useClinicalStore from '@/stores/clinicalStore';
import type { ClinicalNodeType } from '@/types/clinicalTypes';

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
  } = useClinicalStore();

  if (!isContextMenuOpen || !contextMenuPosition || !contextMenuNodeId || !contextMenuNodeType) {
    return null;
  }

  const handleEdit = () => {
    if (contextMenuNodeType === 'abcCard' && contextMenuNodeId) {
      openABCForm(contextMenuNodeId);
    } else if (contextMenuNodeType === 'schemaNode') {
      // Placeholder: openSchemaForm(contextMenuNodeId);
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
  
  // Placeholder actions
  const handleChangeColor = () => {
    console.info("Mudar cor (ainda não implementado):", contextMenuNodeId);
    closeContextMenu();
  };

  const handleLinkToSchema = () => {
    console.info("Vincular a esquema (ainda não implementado):", contextMenuNodeId);
    closeContextMenu();
  };
  
  const handleLinkCardToSchema = () => {
    console.info("Vincular card a este esquema (ainda não implementado):", contextMenuNodeId);
    closeContextMenu();
  };

  // Shadcn DropdownMenu doesn't support dynamic positioning well out-of-the-box like a true context menu.
  // We'll use a fixed div positioned at the click coordinates, containing the DropdownMenuContent directly.
  // Note: This approach means the DropdownMenu's standard trigger mechanism is bypassed.
  // For robust focus management and accessibility, a more dedicated context menu solution might be preferred in a complex app.
  // However, for this iteration, we'll keep it simple using Shadcn components.

  return (
    <div
      style={{
        position: 'fixed',
        left: contextMenuPosition.x,
        top: contextMenuPosition.y,
        zIndex: 1000, // Ensure it's above React Flow
      }}
      onMouseLeave={closeContextMenu} // Close if mouse leaves the menu area
    >
      <DropdownMenu open={isContextMenuOpen} onOpenChange={(open) => !open && closeContextMenu()}>
        {/* Dummy Trigger, not actually used for triggering */}
        <DropdownMenuTrigger asChild> 
            <button style={{ display: 'none' }} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" side="right" sideOffset={5}>
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
              <DropdownMenuItem onClick={handleChangeColor} disabled>
                <Palette className="mr-2 h-4 w-4" />
                <span>Mudar Cor (Em breve)</span>
              </DropdownMenuItem>
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
          <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Deletar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NodeContextMenu;
