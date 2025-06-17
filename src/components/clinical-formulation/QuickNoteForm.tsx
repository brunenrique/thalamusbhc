
"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useClinicalStore from '@/stores/clinicalStore';
import type { QuickNote } from '@/types/clinicalTypes';

const quickNoteSchema = z.object({
  title: z.string().optional(),
  text: z.string().min(1, { message: "A anotação não pode estar vazia." }).max(1000, { message: "Máximo de 1000 caracteres."}),
  linkedCardId: z.string().optional(),
});

type QuickNoteFormValues = z.infer<typeof quickNoteSchema>;

const QuickNoteForm: React.FC = () => {
  const {
    isQuickNoteFormOpen,
    closeQuickNoteForm,
    quickNoteFormTarget,
    addQuickNote,
    updateQuickNote,
    quickNotes, // To get existing note if editing
    cards,
  } = useClinicalStore();

  const noteToEdit = quickNoteFormTarget?.noteIdToEdit ? quickNotes.find(n => n.id === quickNoteFormTarget.noteIdToEdit) : null;

  const form = useForm<QuickNoteFormValues>({
    resolver: zodResolver(quickNoteSchema),
    defaultValues: {
      title: "",
      text: "",
      linkedCardId: "",
    },
  });

  useEffect(() => {
    if (isQuickNoteFormOpen) {
      if (noteToEdit) { // Editing existing note
        form.reset({
          title: noteToEdit.title || "",
          text: noteToEdit.text,
          linkedCardId: noteToEdit.linkedCardId || "",
        });
      } else if (quickNoteFormTarget) { // Creating new note, potentially linked
        form.reset({
          title: "",
          text: quickNoteFormTarget.defaultText || "",
          linkedCardId: quickNoteFormTarget.cardId || "",
        });
      } else { // Creating new unlinked note
        form.reset({ title: "", text: "", linkedCardId: "" });
      }
    }
  }, [isQuickNoteFormOpen, quickNoteFormTarget, noteToEdit, form]);

  const onSubmit = (values: QuickNoteFormValues) => {
    const noteData = {
      title: values.title || undefined, // Store as undefined if empty
      text: values.text,
      linkedCardId: values.linkedCardId || undefined, // Store as undefined if empty string
    };

    if (noteToEdit && quickNoteFormTarget?.noteIdToEdit) {
      updateQuickNote(quickNoteFormTarget.noteIdToEdit, noteData);
    } else {
      addQuickNote(noteData);
    }
    closeQuickNoteForm();
    form.reset();
  };

  return (
    <Dialog open={isQuickNoteFormOpen} onOpenChange={(open) => { if (!open) { form.reset(); closeQuickNoteForm(); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">{noteToEdit ? "Editar Anotação Rápida" : "Nova Anotação Rápida"}</DialogTitle>
          <DialogDescription>
            Adicione uma breve anotação ou observação.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Título (Opcional)</FormLabel>
                <FormControl><Input placeholder="Título breve..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="text" render={({ field }) => (
              <FormItem>
                <FormLabel>Anotação *</FormLabel>
                <FormControl><Textarea placeholder="Sua observação aqui..." {...field} rows={4} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="linkedCardId" render={({ field }) => (
              <FormItem>
                <FormLabel>Vincular ao Card (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum card vinculado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {cards.map(card => (
                      <SelectItem key={card.id} value={card.id}>{card.title.substring(0,30)}{card.title.length > 30 ? '...' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {noteToEdit ? "Salvar Alterações" : "Adicionar Anotação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickNoteForm;
