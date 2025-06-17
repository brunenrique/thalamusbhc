
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { XIcon, PlusCircleIcon } from 'lucide-react';
import useClinicalStore from '@/stores/clinicalStore';
import type { ABCCardData, ABCTemplate } from '@/types/clinicalTypes';
import { useTagSuggestions } from '@/hooks/useTagSuggestions'; // Importar o novo hook

const abcFormSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres." }),
  antecedentExternal: z.string().min(1, { message: "Campo obrigatório." }),
  antecedentInternal: z.string().min(1, { message: "Campo obrigatório." }),
  antecedentThoughtBelief: z.number().min(0).max(100).optional(),
  antecedentEmotionIntensity: z.number().min(0).max(100).optional(),
  behavior: z.string().min(1, { message: "Campo obrigatório." }),
  consequenceShortTermGain: z.string().min(1, { message: "Campo obrigatório." }),
  consequenceShortTermCost: z.string().min(1, { message: "Campo obrigatório." }),
  consequenceLongTermValueCost: z.string().min(1, { message: "Campo obrigatório." }),
  tags: z.array(z.string()).optional(),
  color: z.enum(['default', 'red', 'green', 'blue', 'yellow', 'purple']).default('default'),
  notes: z.string().optional(),
});

type ABCFormValues = z.infer<typeof abcFormSchema>;

const ABCForm: React.FC = () => {
  const {
    isABCFormOpen,
    closeABCForm,
    addCard,
    updateCard,
    editingCardId,
    cards,
    templates
  } = useClinicalStore();

  const editingCard = editingCardId ? cards.find(c => c.id === editingCardId) : null;
  const [currentTags, setCurrentTags] = useState<string[]>(editingCard?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const form = useForm<ABCFormValues>({
    resolver: zodResolver(abcFormSchema),
    defaultValues: {
      title: '',
      antecedentExternal: '',
      antecedentInternal: '',
      antecedentThoughtBelief: 50,
      antecedentEmotionIntensity: 50,
      behavior: '',
      consequenceShortTermGain: '',
      consequenceShortTermCost: '',
      consequenceLongTermValueCost: '',
      tags: [],
      color: 'default',
      notes: '',
    },
  });

  const antecedentExternalValue = form.watch('antecedentExternal');
  const antecedentInternalValue = form.watch('antecedentInternal');
  const behaviorValue = form.watch('behavior');

  const tagSuggestions = useTagSuggestions(
    `${antecedentExternalValue} ${antecedentInternalValue}`,
    behaviorValue,
    currentTags
  );

  useEffect(() => {
    if (editingCard) {
      form.reset({
        title: editingCard.title,
        antecedentExternal: editingCard.antecedent.external,
        antecedentInternal: editingCard.antecedent.internal,
        antecedentThoughtBelief: editingCard.antecedent.thoughtBelief ?? 50,
        antecedentEmotionIntensity: editingCard.antecedent.emotionIntensity ?? 50,
        behavior: editingCard.behavior,
        consequenceShortTermGain: editingCard.consequence.shortTermGain,
        consequenceShortTermCost: editingCard.consequence.shortTermCost,
        consequenceLongTermValueCost: editingCard.consequence.longTermValueCost,
        tags: editingCard.tags || [],
        color: editingCard.color,
        notes: editingCard.notes || '',
      });
      setCurrentTags(editingCard.tags || []);
      setSelectedTemplateId('');
    } else {
      form.reset({
        title: '',
        antecedentExternal: '',
        antecedentInternal: '',
        antecedentThoughtBelief: 50,
        antecedentEmotionIntensity: 50,
        behavior: '',
        consequenceShortTermGain: '',
        consequenceShortTermCost: '',
        consequenceLongTermValueCost: '',
        tags: [],
        color: 'default',
        notes: '',
      });
      setCurrentTags([]);
      setSelectedTemplateId('');
    }
  }, [editingCard, form, isABCFormOpen]);

  const handleAddTag = (tagToAdd?: string) => {
    const tag = tagToAdd || tagInput.trim();
    if (tag && !currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];
      setCurrentTags(newTags);
      form.setValue('tags', newTags);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    setCurrentTags(newTags);
    form.setValue('tags', newTags);
  };
  
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      form.setValue('title', form.getValues('title') || selectedTemplate.name); // Keep existing title if any
      form.setValue('antecedentExternal', selectedTemplate.antecedentGuide);
      form.setValue('behavior', selectedTemplate.behaviorGuide);
      form.setValue('consequenceShortTermGain', selectedTemplate.consequenceGuide);
      // You might want to reset other consequence fields or guide them too
      form.setValue('antecedentInternal', "Pensamentos, sentimentos e sensações internas...");
      form.setValue('consequenceShortTermCost', "Custos/desvantagens imediatas...");
      form.setValue('consequenceLongTermValueCost', "Impacto em valores a longo prazo...");
    } else {
      // Optionally reset fields if "Nenhum Modelo" is selected, or just clear template-specific ones
       if (!editingCard) { // Only reset fully if not editing an existing card
        form.setValue('antecedentExternal', "");
        form.setValue('behavior', "");
        form.setValue('consequenceShortTermGain', "");
      }
    }
  };

  const onSubmit = (values: ABCFormValues) => {
    const cardData: Omit<ABCCardData, 'id' | 'position'> = {
      title: values.title,
      antecedent: {
        external: values.antecedentExternal,
        internal: values.antecedentInternal,
        thoughtBelief: values.antecedentThoughtBelief ?? 0,
        emotionIntensity: values.antecedentEmotionIntensity ?? 0,
      },
      behavior: values.behavior,
      consequence: {
        shortTermGain: values.consequenceShortTermGain,
        shortTermCost: values.consequenceShortTermCost,
        longTermValueCost: values.consequenceLongTermValueCost,
      },
      tags: values.tags || [],
      color: values.color,
      notes: values.notes,
    };

    if (editingCardId) {
      updateCard(editingCardId, cardData);
    } else {
      addCard(cardData);
    }
    form.reset();
    setCurrentTags([]);
    setSelectedTemplateId('');
    closeABCForm();
  };

  return (
    <Dialog open={isABCFormOpen} onOpenChange={(open) => { if (!open) { form.reset(); closeABCForm(); setSelectedTemplateId(''); setCurrentTags([]); } }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">{editingCardId ? 'Editar Card ABC' : 'Novo Card de Análise Funcional (ABC)'}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para descrever a situação.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-1">
            {!editingCardId && (
                 <FormItem>
                    <FormLabel>Usar Modelo (Opcional)</FormLabel>
                    <Select onValueChange={handleTemplateChange} value={selectedTemplateId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um modelo para pré-preencher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhum Modelo</SelectItem>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
            )}

            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Card *</FormLabel>
                <FormControl><Input placeholder="Ex: Crise de ansiedade na apresentação" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <fieldset className="border p-3 rounded-md">
              <legend className="text-sm font-medium px-1">A - Antecedente</legend>
              <div className="space-y-3">
                <FormField control={form.control} name="antecedentExternal" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contexto Externo/Situação *</FormLabel>
                    <FormControl><Textarea placeholder="Onde, quando, com quem?" {...field} rows={2} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="antecedentInternal" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contexto Interno (Pensamentos, Sentimentos, Sensações) *</FormLabel>
                    <FormControl><Textarea placeholder="O que passava pela cabeça? O que sentia?" {...field} rows={2} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="antecedentThoughtBelief" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Crença no Pensamento/Crença (0-100%)</FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value ?? 50]}
                            min={0} max={100} step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-right">{field.value ?? 50}%</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField control={form.control} name="antecedentEmotionIntensity" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Intensidade da Emoção (0-100%)</FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value ?? 50]}
                            min={0} max={100} step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-right">{field.value ?? 50}%</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )} />
                 </div>
              </div>
            </fieldset>

            <FormField control={form.control} name="behavior" render={({ field }) => (
              <FormItem>
                <FormLabel>B - Comportamento (Resposta) *</FormLabel>
                <FormControl><Textarea placeholder="O que foi feito ou dito? (Observável)" {...field} rows={2} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <fieldset className="border p-3 rounded-md">
              <legend className="text-sm font-medium px-1">C - Consequência</legend>
              <div className="space-y-3">
                <FormField control={form.control} name="consequenceShortTermGain" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ganhos / Alívio a Curto Prazo *</FormLabel>
                    <FormControl><Textarea placeholder="O que foi obtido ou evitado imediatamente?" {...field} rows={2} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="consequenceShortTermCost" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custos / Prejuízos a Curto Prazo *</FormLabel>
                    <FormControl><Textarea placeholder="Quais foram as desvantagens imediatas?" {...field} rows={2}/></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="consequenceLongTermValueCost" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custos / Impacto em Valores a Longo Prazo *</FormLabel>
                    <FormControl><Textarea placeholder="Como isso afeta objetivos e valores importantes?" {...field} rows={2}/></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </fieldset>

            <FormItem>
                <FormLabel>Tags (Opcional)</FormLabel>
                <div className="flex items-center gap-2">
                    <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Ex: ansiedade, evitação. Pressione Enter para adicionar."
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAddTag();}}}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => handleAddTag()} aria-label="Adicionar tag">
                        <PlusCircleIcon className="h-4 w-4"/>
                    </Button>
                </div>
                {tagSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 border p-2 rounded-md bg-muted/30">
                    <span className="text-xs text-muted-foreground mr-1">Sugestões:</span>
                    {tagSuggestions.map(suggestion => (
                      <Badge
                        key={suggestion}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleAddTag(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                    {currentTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 focus:outline-none" aria-label={`Remover tag ${tag}`}>
                            <XIcon className="h-3 w-3" />
                        </button>
                    </Badge>
                    ))}
                </div>
            </FormItem>

            <FormField control={form.control} name="color" render={({ field }) => (
              <FormItem>
                <FormLabel>Cor do Card</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="red">Vermelho</SelectItem>
                    <SelectItem value="green">Verde</SelectItem>
                    <SelectItem value="blue">Azul</SelectItem>
                    <SelectItem value="yellow">Amarelo</SelectItem>
                    <SelectItem value="purple">Roxo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Anotações Adicionais (Opcional)</FormLabel>
                <FormControl><Textarea placeholder="Observações, hipóteses, links para outros cards..." {...field} rows={3} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {editingCardId ? 'Salvar Alterações' : 'Adicionar Card'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ABCForm;
