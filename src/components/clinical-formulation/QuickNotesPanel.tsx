
"use client";

import React from 'react';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; // Removido CardFooter
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StickyNote, Edit, Trash2, PlusCircle, Link as LinkIcon, X } from 'lucide-react'; // Adicionado X
import { useClinicalStore } from '@/stores/clinicalStore';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from '../ui/badge';

const QuickNotesPanel: React.FC = () => {
  const { quickNotes, deleteQuickNote, openQuickNoteForm, cards, toggleQuickNotesPanelVisibility } = useClinicalStore();

  return (
    <>
      <CardHeader className="p-3 border-b sticky top-0 bg-card z-10 flex-row justify-between items-center">
        <div className="flex-1">
          <CardTitle className="font-headline text-base flex items-center">
            <StickyNote className="h-4 w-4 mr-2 text-accent" />
            Anotações Rápidas
          </CardTitle>
          <CardDescription className="text-xs">
            Observações e lembretes.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => openQuickNoteForm()}
              aria-label="Adicionar Nova Anotação Rápida"
            >
                <PlusCircle className="h-4 w-4" /> Nova Nota
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-sm font-medium"
              onClick={toggleQuickNotesPanelVisibility}
              aria-label="Fechar painel de anotações rápidas"
            >
                <X className="h-4 w-4" /> Fechar
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-3">
          {quickNotes.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhuma anotação rápida adicionada.</p>
          ) : (
            <ul className="space-y-2">
              {quickNotes.slice().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((note) => {
                const linkedCard = note.linkedCardId ? cards.find(c => c.id === note.linkedCardId) : null;
                return (
                  <li key={note.id} className="p-2 border rounded-md bg-muted/30 shadow-xs">
                    {note.title && <p className="text-xs font-semibold mb-0.5">{note.title}</p>}
                    <p className="text-xs text-foreground whitespace-pre-wrap">{note.text}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true, locale: ptBR })}
                        {linkedCard && (
                          <Badge variant="outline" className="ml-1.5 text-[9px] px-1 py-0 cursor-pointer hover:bg-accent/10" onClick={() => openQuickNoteForm({ cardId: linkedCard.id, defaultText: `Relacionado a: ${linkedCard.title}`})} title={`Vinculado a: ${linkedCard.title}`}>
                            <LinkIcon className="h-2 w-2 mr-0.5"/> {linkedCard.title.substring(0,10)}...
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-0.5">
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => openQuickNoteForm({ noteIdToEdit: note.id })} title="Editar nota">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive hover:text-destructive" title="Excluir nota">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Anotação?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta anotação rápida? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteQuickNote(note.id)} className="bg-destructive hover:bg-destructive/90">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </>
  );
};

export default QuickNotesPanel;
