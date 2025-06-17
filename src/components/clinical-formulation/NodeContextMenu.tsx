
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
import { Edit, Trash2, Palette, Link2, Check, Unlink, Users as UsersIcon, Tag } from 'lucide-react';
import { useClinicalStore } from '@/stores/clinicalStore';
import type { ClinicalNodeType, ABCCardColor, SchemaData, ABCCardData } from '@/types/clinicalTypes';
import { cn } from '@/shared/utils';

const cardColorOptions: { label: string; value: ABCCardColor, style: string }[] = [
  { label: 'Padrão', value: 'default', style: 'bg-card border-border' },
  { label: 'Alerta (Vermelho)', value: 'red', style: 'bg-red-500/20 border-red-500/40 text-red-800 dark:text-red-300' },
  { label: 'Positivo (Verde)', value: 'green', style: 'bg-green-500/20 border-green-500/40 text-green-800 dark:text-green-300' },
  { label: 'Neutro (Azul)', value: 'blue', style: 'bg-blue-500/20 border-blue-500/40 text-blue-800 dark:text-blue-300' },
  { label: 'Observação (Amarelo)', value: 'yellow', style: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-800 dark:text-yellow-300' },
  { label: 'Hipótese (Roxo)', value: 'purple', style: 'bg-purple-500/20 border-purple-500/40 text-purple-800 dark:text-purple-300' },
];

// Example group colors - these should match what's selectable in the group creation dialog
const groupContextColors = [
    { label: "Grupo Vermelho", value: "border-red-500", style: "bg-red-500/20" },
    { label: "Grupo Verde", value: "border-green-500", style: "bg-green-500/20" },
    { label: "Grupo Azul", value: "border-blue-500", style: "bg-blue-500/20" },
];


const NodeContextMenu: React.FC = () => {
  const {
    isContextMenuOpen,
    contextMenuPosition,
    contextMenuNodeId,
    contextMenuNodeType,
    closeContextMenu,
    openABCForm,
    openSchemaForm,
    deleteCard,
    deleteSchema,
    changeCardColor,
    cards,
    schemas,
    linkCardToSchema,
    unlinkCardFromSchema,
    cardGroups, // Get group definitions
    assignCardToGroup, // Assign card to a group by its info
    removeCardFromItsGroup, // Remove card from its current group
  } = useClinicalStore();

  if (!isContextMenuOpen || !contextMenuPosition || !contextMenuNodeId || !contextMenuNodeType) {
    return null;
  }

  const currentCard = contextMenuNodeType === 'abcCard' ? cards.find(c => c.id === contextMenuNodeId) : null;
  const currentSchema = contextMenuNodeType === 'schemaNode' ? schemas.find(s => s.id === contextMenuNodeId) : null;

  const handleEdit = () => {
    if (contextMenuNodeType === 'abcCard' && contextMenuNodeId) {
      openABCForm(contextMenuNodeId);
    } else if (contextMenuNodeType === 'schemaNode' && contextMenuNodeId) {
      openSchemaForm(contextMenuNodeId);
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
  };

  const handleToggleLinkToSchema = (schemaId: string) => {
    if (currentCard) {
      const schema = schemas.find(s => s.id === schemaId);
      if (schema && schema.linkedCardIds.includes(currentCard.id)) {
        unlinkCardFromSchema(schemaId, currentCard.id);
      } else {
        linkCardToSchema(schemaId, currentCard.id);
      }
    }
  };

  const handleToggleLinkToCard = (cardId: string) => {
    if (currentSchema) {
      if (currentSchema.linkedCardIds.includes(cardId)) {
        unlinkCardFromSchema(currentSchema.id, cardId);
      } else {
        linkCardToSchema(currentSchema.id, cardId);
      }
    }
  };

  const handleAssignToGroup = (group: (typeof cardGroups)[0] | null) => {
    if (currentCard) {
      if (group) {
        assignCardToGroup(currentCard.id, { id: group.id, name: group.name, color: group.color });
      } else { // Remove from group
        removeCardFromItsGroup(currentCard.id);
      }
    }
    closeContextMenu();
  };


  const nodeTitle = contextMenuNodeType === 'abcCard'
    ? (currentCard?.title || 'Card ABC')
    : (currentSchema?.rule || 'Esquema');


  return (
    <div
      style={{
        position: 'fixed',
        left: contextMenuPosition.x,
        top: contextMenuPosition.y,
        zIndex: 1000, // Ensure context menu is above React Flow UI
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <DropdownMenu open={isContextMenuOpen} onOpenChange={(open) => !open && closeContextMenu()}>
        <DropdownMenuTrigger asChild>
            <button style={{ display: 'none' }} aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
            className="w-60"
            onCloseAutoFocus={(e) => e.preventDefault()}
            onPointerDownOutside={closeContextMenu}
        >
          <DropdownMenuLabel className="truncate" title={nodeTitle}>
            {contextMenuNodeType === 'abcCard' ? 'Card: ' : 'Esquema: '}
            {nodeTitle.length > 25 ? `${nodeTitle.substring(0, 25)}...` : nodeTitle}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            <span>{contextMenuNodeType === 'abcCard' ? 'Editar Card' : 'Editar Esquema'}</span>
          </DropdownMenuItem>

          {contextMenuNodeType === 'abcCard' && currentCard && (
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
                        <div className={cn("w-3 h-3 rounded-full mr-2", opt.style.split(' ')[0])} />
                        <span>{opt.label}</span>
                        {currentCard?.color === opt.value && <Check className="ml-auto h-4 w-4" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Link2 className="mr-2 h-4 w-4" />
                  <span>Vincular/Desvincular Esquema</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="max-h-60 overflow-y-auto">
                    {schemas.length === 0 && <DropdownMenuItem disabled>Nenhum esquema disponível</DropdownMenuItem>}
                    {schemas.map(schema => {
                      const isAlreadyLinked = schema.linkedCardIds.includes(currentCard.id);
                      return (
                        <DropdownMenuItem key={schema.id} onClick={() => handleToggleLinkToSchema(schema.id)}>
                          {isAlreadyLinked ? <Unlink className="mr-2 h-3.5 w-3.5 text-destructive" /> : <Link2 className="mr-2 h-3.5 w-3.5 text-green-600" />}
                          <span className="truncate" title={schema.rule}>{schema.rule}</span>
                          {isAlreadyLinked && <Check className="ml-auto h-4 w-4 text-accent" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <UsersIcon className="mr-2 h-4 w-4" />
                  <span>Gerenciar Grupo Temático</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="max-h-60 overflow-y-auto">
                    <DropdownMenuItem onClick={() => handleAssignToGroup(null)}>
                      <Unlink className="mr-2 h-3.5 w-3.5 text-destructive" />
                      <span>Remover do Grupo Atual</span>
                      {!currentCard.groupInfo && <Check className="ml-auto h-4 w-4 opacity-50" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {cardGroups.length === 0 && <DropdownMenuItem disabled>Nenhum grupo temático criado</DropdownMenuItem>}
                    {cardGroups.map(group => (
                      <DropdownMenuItem key={group.id} onClick={() => handleAssignToGroup(group)}>
                        <div className={cn("w-3 h-3 rounded-full mr-2", group.color.replace('border-','bg-').concat('/30'), group.color)} />
                        <span className="truncate" title={group.name}>{group.name}</span>
                        {currentCard.groupInfo?.id === group.id && <Check className="ml-auto h-4 w-4 text-accent" />}
                      </DropdownMenuItem>
                    ))}
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => { /* Logic to open 'Create New Group' dialog for this card */ }}>
                        <Tag className="mr-2 h-3.5 w-3.5" /> Criar Novo Grupo para Este Card...
                     </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </>
          )}

          {contextMenuNodeType === 'schemaNode' && currentSchema && (
             <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Link2 className="mr-2 h-4 w-4" />
                  <span>Vincular/Desvincular Card</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="max-h-60 overflow-y-auto">
                     {cards.length === 0 && <DropdownMenuItem disabled>Nenhum card ABC disponível</DropdownMenuItem>}
                     {cards.map(card => {
                        const isAlreadyLinked = currentSchema.linkedCardIds.includes(card.id);
                        return (
                            <DropdownMenuItem key={card.id} onClick={() => handleToggleLinkToCard(card.id)}>
                                {isAlreadyLinked ? <Unlink className="mr-2 h-3.5 w-3.5 text-destructive" /> : <Link2 className="mr-2 h-3.5 w-3.5 text-green-600" />}
                                <span className="truncate" title={card.title}>{card.title}</span>
                                {isAlreadyLinked && <Check className="ml-auto h-4 w-4 text-accent" />}
                            </DropdownMenuItem>
                        );
                     })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
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
