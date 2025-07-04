"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Save, Sparkles } from "lucide-react";
import { generateSessionNoteTemplate } from '@/services/aiService';
import type { GenerateSessionNoteTemplateOutput } from '@/ai/flows/generate-session-note-template';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Sentry from '@sentry/nextjs';
import logger from '@/lib/logger';

interface TemplateEditorProps {
  templateId?: string; 
  initialName?: string;
  initialContent?: string;
  initialPatientName?: string;
  initialSessionSummary?: string;
}

const templateFormSchema = z.object({
  templateName: z.string().min(3, { message: "O nome do modelo deve ter pelo menos 3 caracteres." }),
  templateContent: z.string().min(10, { message: "O conteúdo do modelo deve ter pelo menos 10 caracteres." }),
  patientNameForAI: z.string().optional(),
  sessionSummaryForAI: z.string().optional(),
  therapistInstructions: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

export default function TemplateEditor({
  templateId,
  initialName = "",
  initialContent = "",
  initialPatientName = "", // Used for AI generation context if creating new
  initialSessionSummary = "" // Used for AI generation context if creating new
}: TemplateEditorProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [templateName, setTemplateName] = useState(initialName);
  const [templateContent, setTemplateContent] = useState(initialContent);
  
  // AI Generation specific states
  const [patientNameForAI, setPatientNameForAI] = useState(initialPatientName);
  const [sessionSummaryForAI, setSessionSummaryForAI] = useState(initialSessionSummary);
  const [therapistInstructions, setTherapistInstructions] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

    const form = useForm<TemplateFormValues>({
        resolver: zodResolver(templateFormSchema),
        defaultValues: {
            templateName: initialName || "",
            templateContent: initialContent || "",
            patientNameForAI: initialPatientName || "",
            sessionSummaryForAI: initialSessionSummary || "",
            therapistInstructions: "",
        },
    });

  // Update state if initial props change (e.g., when navigating to edit page)
  useEffect(() => {
    setTemplateName(initialName);
    setTemplateContent(initialContent);
    // Reset AI fields if editing an existing template, unless they are also passed initially
    if (templateId) {
        setPatientNameForAI(initialPatientName || "");
        setSessionSummaryForAI(initialSessionSummary || "");
    }
  }, [initialName, initialContent, templateId, initialPatientName, initialSessionSummary]);


  const handleGenerateTemplate = async () => {
    if (!patientNameForAI || !sessionSummaryForAI) {
      toast({
        title: "Informação Faltando",
        description: "Por favor, forneça Nome do Paciente e Resumo da Sessão para gerar um modelo.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result: GenerateSessionNoteTemplateOutput = await generateSessionNoteTemplate({
        patientName: patientNameForAI,
        sessionSummary: sessionSummaryForAI,
        therapistInstructions,
      });
      setTemplateContent(result.template); // Overwrites current content with AI generated
      if (!templateName && patientNameForAI) { // Suggest a template name if not already set
        setTemplateName(`Modelo para ${patientNameForAI}`);
      }
      toast({
        title: "Modelo Gerado por IA",
        description: "Um rascunho de modelo foi gerado e preenchido no editor.",
      });
    } catch (error) {
      Sentry.captureException(error);
      logger.error({ action: 'ai_template_error', meta: { error } });
      toast({
        title: "Falha na Geração com IA",
        description: "Não foi possível gerar o modelo. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

    const handleSaveTemplate = async (data: TemplateFormValues) => {
        if (!data.templateName || !data.templateContent) {
            toast({
                title: "Campos Obrigatórios",
                description: "O nome e o conteúdo do modelo não podem estar vazios.",
                variant: "destructive",
            });
            return;
        }
        setIsSaving(true);
        // Simula chamada de API
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
            title: templateId ? "Modelo Atualizado" : "Modelo Criado",
            description: `O modelo "${data.templateName}" foi ${templateId ? 'atualizado' : 'criado'} com sucesso.`,
        });
        setIsSaving(false);
        router.push("/templates"); // Redirect to templates list after saving
    };

  return (
    <Card className="shadow-lg mt-8">
        <Form {...form}>
            <form role="form" onSubmit={form.handleSubmit(handleSaveTemplate)}>
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center">
                        <Brain className="mr-2 h-6 w-6 text-accent" />
                        {templateId ? `Editando: ${initialName}` : "Criar Novo Modelo"}
                    </CardTitle>
                    <CardDescription>
                        {templateId ? "Modifique os detalhes do modelo abaixo." : "Use o assistente de IA para ajudar a rascunhar seu modelo de anotação de sessão ou escreva o seu próprio."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="templateName">Nome do Modelo *</Label>
                        <Input
                            id="templateName"
                            {...form.register("templateName")}
                            placeholder="Ex: Notas de Consulta Inicial"
                        />
                    </div>

                    {!templateId && (
                        <Card className="bg-muted/30 p-4 space-y-3">
                            <p className="text-sm font-medium text-foreground">Assistente de Geração de Modelo com IA</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="patientNameForAI">Nome do Paciente (para assistência IA)</Label>
                                    <Input id="patientNameForAI" {...form.register("patientNameForAI")} placeholder="Maria Silva" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="sessionSummaryForAI">Resumo da Sessão (para assistência IA)</Label>
                                    <Input id="sessionSummaryForAI" {...form.register("sessionSummaryForAI")} placeholder="Breve resumo da sessão..." />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="therapistInstructions">Instruções Específicas (opcional)</Label>
                                <Textarea id="therapistInstructions" {...form.register("therapistInstructions")} placeholder="Ex: Focar no humor, incluir seção para plano de tratamento..." rows={2} />
                            </div>
                            <Button onClick={handleGenerateTemplate} disabled={isGenerating || !form.getValues("patientNameForAI") || !form.getValues("sessionSummaryForAI")} variant="outline">
                                {isGenerating ? <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                {isGenerating ? "Gerando..." : "Gerar com IA"}
                            </Button>
                        </Card>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="templateContent">Conteúdo do Modelo *</Label>
                        {isGenerating ? (
                            <Skeleton key="loading" className="h-48 w-full" />
                        ) : (
                            <Textarea
                                id="templateContent"
                                aria-label="Conteúdo do Modelo"
                                {...form.register("templateContent")}
                                placeholder={
                                  `Digite o conteúdo do seu modelo aqui...\n\nExemplo de Seções:\n- Apresentação do Paciente:\n- Pontos Chave da Discussão:\n- Intervenções Utilizadas:\n- Resposta do Paciente:\n- Avaliação de Risco:\n- Plano para Próxima Sessão:`
                                }
                                rows={15}
                                maxLength={5000}
                                className="min-h-[300px] font-mono text-sm"
                            />
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSaving || !form.getValues("templateName") || !form.getValues("templateContent")} className="ml-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Salvando..." : (templateId ? "Salvar Alterações" : "Criar Modelo")}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
