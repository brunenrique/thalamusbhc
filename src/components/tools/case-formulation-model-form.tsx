
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CaseFormulationTemplate } from "@/app/(app)/tools/case-formulation-models/page";

const formulationCategories = ["TCC", "ACT", "DBT", "Análise do Comportamento", "Psicodinâmica", "Sistêmica", "Outro"];

const caseFormulationModelFormSchema = z.object({
  name: z.string().min(3, { message: "O nome do modelo deve ter pelo menos 3 caracteres." }),
  category: z.string().min(1, { message: "Por favor, selecione ou defina uma categoria." }),
  customCategory: z.string().optional(), // For "Outro" category
  description: z.string().optional(),
  structurePrompt: z.string().min(10, { message: "A estrutura/prompt do modelo deve ter pelo menos 10 caracteres." }),
}).refine(data => {
    if (data.category === "Outro" && (!data.customCategory || data.customCategory.trim() === "")) {
        return false;
    }
    return true;
}, {
    message: "Por favor, especifique a categoria personalizada.",
    path: ["customCategory"],
});

type CaseFormulationModelFormValues = z.infer<typeof caseFormulationModelFormSchema>;

interface CaseFormulationModelFormProps {
  initialData?: CaseFormulationTemplate;
  templateId?: string;
}

export default function CaseFormulationModelForm({ initialData, templateId }: CaseFormulationModelFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const isCustomCategoryInitial = initialData && !formulationCategories.includes(initialData.category);

  const form = useForm<CaseFormulationModelFormValues>({
    resolver: zodResolver(caseFormulationModelFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: isCustomCategoryInitial ? "Outro" : initialData?.category || "",
      customCategory: isCustomCategoryInitial ? initialData?.category : "",
      description: initialData?.description || "",
      structurePrompt: initialData?.structurePrompt || "",
    },
  });

  const selectedCategory = form.watch("category");

  async function onSubmit(data: CaseFormulationModelFormValues) {
    setIsLoading(true);
    const finalCategory = data.category === "Outro" ? data.customCategory : data.category;
    const submissionData = {
        id: templateId || `cfm_${Date.now()}`,
        name: data.name,
        category: finalCategory,
        description: data.description,
        structurePrompt: data.structurePrompt,
        lastUpdated: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    console.log("Dados do Modelo de Formulação (Simulado):", submissionData);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    toast({
      title: templateId ? "Modelo Atualizado (Simulado)" : "Modelo Criado (Simulado)",
      description: `O modelo de formulação "${submissionData.name}" foi ${templateId ? 'atualizado' : 'criado'} com sucesso.`,
    });
    router.push("/tools/case-formulation-models");
  }

  return (
    <Card className="shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">
              {templateId ? "Editar Modelo de Formulação" : "Novo Modelo de Formulação"}
            </CardTitle>
            <CardDescription>
              Defina os detalhes do modelo de formulação de caso. O campo "Estrutura/Prompt para IA" guiará futuras análises automáticas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Modelo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: TCC - Reestruturação Cognitiva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {formulationCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                {selectedCategory === "Outro" && (
                     <FormField
                        control={form.control}
                        name="customCategory"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome da Categoria Personalizada *</FormLabel>
                            <FormControl>
                            <Input placeholder="Ex: Terapia Narrativa" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                )}
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Breve descrição do modelo, seus principais usos ou autores." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="structurePrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Brain className="mr-2 h-4 w-4 text-accent" /> Estrutura / Prompt para IA *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva os componentes chave, perguntas ou estrutura que a IA deve usar para analisar uma sessão com este modelo. Ex:\n1. Situação Desencadeadora:\n2. Pensamentos Automáticos:\n3. Emoções Associadas:\n4. Comportamentos Resultantes:" 
                      {...field} 
                      rows={10} 
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Este campo será crucial para a IA entender como aplicar este modelo na análise de sessões.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? (templateId ? "Salvando..." : "Criando Modelo...") : (templateId ? "Salvar Alterações" : "Criar Modelo")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
