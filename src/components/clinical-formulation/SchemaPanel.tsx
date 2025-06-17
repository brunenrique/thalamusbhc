
"use client";

import React, { useState } from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Removido Card de @/components/ui/card
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircleIcon, Trash2Icon, Link2Icon, ChevronDownIcon, ChevronUpIcon, EditIcon, Unlink, X } from 'lucide-react'; // Adicionado X
import useClinicalStore from '@/stores/clinicalStore';
import type { SchemaData } from '@/types/clinicalTypes';
import { Badge } from '../ui/badge';
import { Card } from "@/components/ui/card"; // Adicionado Card aqui para consistência

const SchemaPanel: React.FC = () => {
  const { schemas, openSchemaForm, deleteSchema, cards, openABCForm, unlinkCardFromSchema, toggleSchemaPanelVisibility } = useClinicalStore();
  const [newSchemaRule, setNewSchemaRule] = useState('');
  const [expandedSchemaId, setExpandedSchemaId] = useState<string | null>(null);

  const handleAddSchema = () => {
    if (newSchemaRule.trim()) {
      openSchemaForm(undefined, newSchemaRule.trim());
      setNewSchemaRule('');
    }
  };

  const toggleExpandSchema = (schemaId: string) => {
    setExpandedSchemaId(prevId => prevId === schemaId ? null : schemaId);
  };

  return (
    <>
      <CardHeader className="p-3 border-b sticky top-0 bg-card z-10 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="font-headline text-base">Esquemas e Regras</CardTitle>
          <CardDescription className="text-xs">
            Crenças centrais e regras.
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSchemaPanelVisibility} aria-label="Fechar painel de esquemas">
            <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 flex-grow overflow-hidden flex flex-col">
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            value={newSchemaRule}
            onChange={(e) => setNewSchemaRule(e.target.value)}
            placeholder="Nova regra ou esquema..."
            className="h-8 text-xs"
            onKeyPress={(e) => { if (e.key === 'Enter') handleAddSchema(); }}
          />
          <Button onClick={handleAddSchema} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 h-8 px-2 text-xs">
            <PlusCircleIcon className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        
        {schemas.length === 0 && (
            <div className="text-center text-xs text-muted-foreground py-4">
                <p>Nenhum esquema adicionado.</p>
            </div>
        )}

        <ScrollArea className="flex-grow -mx-3 px-3"> 
          <div className="space-y-1.5 pr-0.5">
            {schemas.map((schema) => (
              <Card key={schema.id} className="text-xs bg-muted/30 shadow-xs">
                <div className="p-1.5 flex justify-between items-start">
                  <button 
                    className="flex-1 text-left pr-1 focus:outline-none group"
                    onClick={() => toggleExpandSchema(schema.id)}
                    aria-expanded={expandedSchemaId === schema.id}
                    aria-controls={`schema-details-${schema.id}`}
                  >
                    <p className="font-medium text-[11px] leading-tight group-hover:text-accent">{schema.rule}</p>
                  </button>
                  <div className="flex items-center shrink-0">
                    <Badge variant="secondary" className="mr-1 text-[9px] px-1 py-0">
                      <Link2Icon className="h-2 w-2 mr-0.5"/> {schema.linkedCardIds.length}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground" onClick={() => openSchemaForm(schema.id)} aria-label={`Editar esquema ${schema.rule}`}>
                      <EditIcon className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:text-destructive" onClick={() => deleteSchema(schema.id)} aria-label={`Deletar esquema ${schema.rule}`}>
                      <Trash2Icon className="h-3 w-3" />
                    </Button>
                     <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => toggleExpandSchema(schema.id)} aria-label={expandedSchemaId === schema.id ? "Recolher detalhes" : "Expandir detalhes"}>
                        {expandedSchemaId === schema.id ? <ChevronUpIcon className="h-3.5 w-3.5" /> : <ChevronDownIcon className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>
                {expandedSchemaId === schema.id && (
                  <div id={`schema-details-${schema.id}`} className="border-t p-1.5 space-y-1">
                    <p className="text-[11px] text-muted-foreground italic">{schema.notes || "Sem anotações."}</p>
                    {schema.linkedCardIds.length > 0 && (
                      <div>
                        <p className="text-[10px] font-medium mb-0.5">Cards Vinculados:</p>
                        <ul className="space-y-0.5">
                          {schema.linkedCardIds.map(cardId => {
                            const card = cards.find(c => c.id === cardId);
                            return card ? (
                              <li key={cardId} className="text-[10px] text-muted-foreground flex justify-between items-center group/card-link">
                                <span 
                                  className="hover:text-accent cursor-pointer truncate"
                                  onClick={() => openABCForm(cardId)}
                                  title={`Editar Card: ${card.title}`}
                                >
                                  {card.title}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-4 w-4 opacity-50 group-hover/card-link:opacity-100 text-destructive hover:text-destructive" 
                                  onClick={() => unlinkCardFromSchema(schema.id, cardId)}
                                  title={`Desvincular card "${card.title}"`}
                                >
                                  <Unlink className="h-2.5 w-2.5" />
                                </Button>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    )}
                    {schema.linkedCardIds.length === 0 && (
                        <p className="text-[10px] text-muted-foreground">Nenhum card vinculado.</p>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </>
  );
};

export default SchemaPanel;
