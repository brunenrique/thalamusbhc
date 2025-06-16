
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircleIcon, Trash2Icon, Link2Icon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import useClinicalStore from '@/stores/clinicalStore';
import type { SchemaData } from '@/types/clinicalTypes';
import { Badge } from '@/components/ui/badge';

const SchemaPanel: React.FC = () => {
  const { schemas, addSchema, deleteSchema, cards, openABCForm } = useClinicalStore();
  const [newSchemaRule, setNewSchemaRule] = useState('');
  const [expandedSchemaId, setExpandedSchemaId] = useState<string | null>(null);

  const handleAddSchema = () => {
    if (newSchemaRule.trim()) {
      addSchema({ rule: newSchemaRule.trim(), notes: '' });
      setNewSchemaRule('');
    }
  };

  const toggleExpandSchema = (schemaId: string) => {
    setExpandedSchemaId(prevId => prevId === schemaId ? null : schemaId);
  };

  return (
    <Card className="h-full flex flex-col shadow-md">
      <CardHeader className="p-4 border-b">
        <CardTitle className="font-headline text-lg">Esquemas e Regras</CardTitle>
        <CardDescription className="text-xs">Crenças centrais e regras que podem estar influenciando os comportamentos.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow overflow-hidden flex flex-col">
        <div className="flex gap-2 mb-3">
          <Input
            type="text"
            value={newSchemaRule}
            onChange={(e) => setNewSchemaRule(e.target.value)}
            placeholder="Nova regra ou esquema..."
            className="h-9 text-sm"
            onKeyPress={(e) => { if (e.key === 'Enter') handleAddSchema(); }}
          />
          <Button onClick={handleAddSchema} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
            <PlusCircleIcon className="h-4 w-4 mr-1.5" /> Adicionar
          </Button>
        </div>
        
        {schemas.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-6">
                <p>Nenhum esquema adicionado ainda.</p>
                <p className="text-xs">Adicione crenças ou regras relevantes para a formulação.</p>
            </div>
        )}

        <ScrollArea className="flex-grow -mx-4 px-4"> {/* Negative margin + padding to extend scroll area */}
          <div className="space-y-2 pr-1">
            {schemas.map((schema) => (
              <Card key={schema.id} className="text-xs bg-muted/30 shadow-sm">
                <div className="p-2 flex justify-between items-start">
                  <button 
                    className="flex-1 text-left pr-2 focus:outline-none group"
                    onClick={() => toggleExpandSchema(schema.id)}
                    aria-expanded={expandedSchemaId === schema.id}
                    aria-controls={`schema-details-${schema.id}`}
                  >
                    <p className="font-medium leading-snug group-hover:text-accent">{schema.rule}</p>
                  </button>
                  <div className="flex items-center shrink-0">
                    <Badge variant="secondary" className="mr-1.5 text-[10px] px-1.5 py-0.5">
                      <Link2Icon className="h-2.5 w-2.5 mr-1"/> {schema.linkedCardIds.length}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => deleteSchema(schema.id)} aria-label={`Deletar esquema ${schema.rule}`}>
                      <Trash2Icon className="h-3.5 w-3.5" />
                    </Button>
                     <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleExpandSchema(schema.id)} aria-label={expandedSchemaId === schema.id ? "Recolher detalhes" : "Expandir detalhes"}>
                        {expandedSchemaId === schema.id ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                {expandedSchemaId === schema.id && (
                  <div id={`schema-details-${schema.id}`} className="border-t p-2 space-y-1.5">
                    <p className="text-xs text-muted-foreground italic">{schema.notes || "Sem anotações adicionais."}</p>
                    {schema.linkedCardIds.length > 0 && (
                      <div>
                        <p className="text-[11px] font-medium mb-0.5">Cards Vinculados:</p>
                        <ul className="list-disc list-inside pl-1 space-y-0.5">
                          {schema.linkedCardIds.map(cardId => {
                            const card = cards.find(c => c.id === cardId);
                            return card ? (
                              <li key={cardId} className="text-[11px] text-muted-foreground hover:text-accent cursor-pointer" onClick={() => openABCForm(cardId)}>
                                {card.title}
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SchemaPanel;
