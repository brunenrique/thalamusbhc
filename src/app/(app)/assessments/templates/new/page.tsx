
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import logger from '@/lib/logger';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Save, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const assessmentTemplateFormSchema = z.object({
  name: z.string().min(3, { message: "O nome do modelo deve ter pelo menos 3 caracteres." }),
  description: z.string().optional(),
  category: z.string().optional(),
  questions: z.string().min(10, { message: "Por favor, adicione pelo menos uma pergunta." }),
});

type AssessmentTemplateFormValues = z.infer<typeof assessmentTemplateFormSchema>;

export default function NewAssessmentTemplatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<AssessmentTemplateFormValues>({
    resolver: zodResolver(assessmentTemplateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      questions: "",
    },
  });

  async function onSubmit(data: AssessmentTemplateFormValues) {
    setIsLoading(true);
    logger.info({ action: 'create_assessment_template_simulated', meta: { data } });
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    setIsLoading(false);
    toast({
      title: "Modelo de Avaliação Criado (Simulado)",
      description: `O modelo "${data.name}" foi criado com sucesso.`,
    });

    router.push("/assessments"); // Ou para uma página de listagem de modelos, se existir
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <PlusCircle className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Criar Novo Modelo de Avaliação</h1>
      </div>

      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <FileText className="mr-2 h-6 w-6 text-primary" />
                Detalhes do Modelo
              </CardTitle>
              <CardDescription>
                Defina as informações e perguntas para o seu novo modelo de avaliação.
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
                      <Input placeholder="Ex: Inventário de Ansiedade Breve" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Uma breve descrição sobre o propósito deste modelo..." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ansiedade, Depressão, Geral" {...field} />
                    </FormControl>
                    <FormDescription>Ajuda a organizar seus modelos.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="questions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perguntas *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite cada pergunta em uma nova linha.\nEx:\n1. Como você tem se sentido ultimamente?\n2. Com que frequência você se sente ansioso(a)?" 
                        {...field} 
                        rows={10} 
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormDescription>
                      No futuro, você poderá adicionar tipos de resposta e opções de pontuação aqui.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Salvando Modelo..." : "Salvar Modelo"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
