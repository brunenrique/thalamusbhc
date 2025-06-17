
"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useClinicalStore from '@/stores/clinicalStore';
import type { SchemaData } from '@/types/clinicalTypes';

const schemaFormValidationSchema = z.object({
  rule: z.string().min(5, { message: "A regra/crença deve ter pelo menos 5 caracteres." }).max(200, { message: "A regra/crença não pode exceder 200 caracteres." }),
  notes: z.string().max(500, { message: "As anotações não podem exceder 500 caracteres." }).optional(),
});

type SchemaFormValues = z.infer<typeof schemaFormValidationSchema>;

interface SchemaFormProps {
  prefillRule?: string; 
}

const SchemaForm: React.FC<SchemaFormProps> = ({ prefillRule: initialPrefillRule }) => {
  const { 
    isSchemaFormOpen, 
    closeSchemaForm, 
    addSchema, 
    updateSchema, 
    editingSchemaId, 
    schemas 
  } = useClinicalStore();

  const editingSchema = editingSchemaId ? schemas.find(s => s.id === editingSchemaId) : null;

  const form = useForm<SchemaFormValues>({
    resolver: zodResolver(schemaFormValidationSchema),
    defaultValues: {
      rule: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isSchemaFormOpen) {
      if (editingSchema) {
        form.reset({
          rule: editingSchema.rule,
          notes: editingSchema.notes || '',
        });
      } else if (initialPrefillRule) { 
        form.reset({
          rule: initialPrefillRule,
          notes: '',
        });
      } else { 
        form.reset({ rule: '', notes: '' });
      }
    }
  }, [editingSchema, form, isSchemaFormOpen, initialPrefillRule]);

  const onSubmit = (values: SchemaFormValues) => {
    const schemaData: Omit<SchemaData, 'id' | 'linkedCardIds' | 'position' | 'tabId'> = {
      rule: values.rule,
      notes: values.notes,
    };

    if (editingSchemaId) {
      updateSchema(editingSchemaId, schemaData);
    } else {
      addSchema(schemaData);
    }
    form.reset();
    closeSchemaForm();
  };

  const dialogTitle = editingSchemaId ? 'Editar Esquema/Regra' : 'Novo Esquema/Regra';
  const dialogDescription = editingSchemaId 
    ? 'Modifique a regra ou crença e suas anotações.' 
    : 'Defina uma nova regra ou crença central para o mapa de formulação.';

  return (
    <Dialog open={isSchemaFormOpen} onOpenChange={(open) => { if (!open) { form.reset(); closeSchemaForm(); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
            <FormField control={form.control} name="rule" render={({ field }) => (
              <FormItem>
                <FormLabel>Regra / Crença Central *</FormLabel>
                <FormControl><Input placeholder="Ex: Se eu falhar, sou um fracasso." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Anotações Adicionais (Opcional)</FormLabel>
                <FormControl><Textarea placeholder="Origem, intensidade, evidências contra/a favor..." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {editingSchemaId ? 'Salvar Alterações' : 'Adicionar Esquema'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SchemaForm;
