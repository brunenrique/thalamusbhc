"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Save, Sparkles } from "lucide-react";
import { generateSessionNoteTemplate, type GenerateSessionNoteTemplateOutput } from '@/ai/flows/generate-session-note-template';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface TemplateEditorProps {
  templateId?: string; 
  initialName?: string;
  initialContent?: string;
  initialPatientName?: string;
  initialSessionSummary?: string;
}

export default function TemplateEditor({
  templateId,
  initialName = "",
  initialContent = "",
  initialPatientName = "",
  initialSessionSummary = ""
}: TemplateEditorProps) {
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState(initialName);
  const [templateContent, setTemplateContent] = useState(initialContent);
  const [patientName, setPatientName] = useState(initialPatientName);
  const [sessionSummary, setSessionSummary] = useState(initialSessionSummary);
  const [therapistInstructions, setTherapistInstructions] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerateTemplate = async () => {
    if (!patientName || !sessionSummary) {
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
        patientName,
        sessionSummary,
        therapistInstructions,
      });
      setTemplateContent(result.template);
      toast({
        title: "Modelo Gerado",
        description: "A IA gerou um rascunho de modelo.",
      });
    } catch (error) {
      console.error("Erro ao gerar modelo:", error);
      toast({
        title: "Falha na Geração",
        description: "Não foi possível gerar o modelo. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    // Simula chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Salvando modelo:", { templateId, templateName, templateContent });
    toast({
      title: "Modelo Salvo",
      description: `O modelo "${templateName}" foi salvo com sucesso.`,
    });
    setIsSaving(false);
  };

  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Brain className="mr-2 h-6 w-6 text-accent" />
          {templateId ? "Editar Modelo" : "Criar Novo Modelo"}
        </CardTitle>
        <CardDescription>
          Use o assistente de IA para ajudar a rascunhar seu modelo de anotação de sessão ou escreva o seu próprio.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="templateName">Nome do Modelo</Label>
          <Input
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Ex: Notas de Consulta Inicial"
          />
        </div>

        <Card className="bg-muted/30 p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">Assistente de Geração de Modelo com IA</p>
            <div className="grid sm:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <Label htmlFor="patientName">Nome do Paciente (para assistência IA)</Label>
                    <Input id="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Maria Silva" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="sessionSummary">Resumo da Sessão (para assistência IA)</Label>
                    <Input id="sessionSummary" value={sessionSummary} onChange={(e) => setSessionSummary(e.target.value)} placeholder="Breve resumo da sessão..." />
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="therapistInstructions">Instruções Específicas (opcional)</Label>
                <Textarea id="therapistInstructions" value={therapistInstructions} onChange={(e) => setTherapistInstructions(e.target.value)} placeholder="Ex: Focar no humor, incluir seção para plano de tratamento..." rows={2}/>
            </div>
            <Button onClick={handleGenerateTemplate} disabled={isGenerating || !patientName || !sessionSummary} variant="outline">
              {isGenerating ? <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {isGenerating ? "Gerando..." : "Gerar com IA"}
            </Button>
        </Card>
        
        <div className="space-y-2">
          <Label htmlFor="templateContent">Conteúdo do Modelo</Label>
          {isGenerating ? (
            <Skeleton className="h-48 w-full" />
          ): (
            <Textarea
              id="templateContent"
              value={templateContent}
              onChange={(e) => setTemplateContent(e.target.value)}
              placeholder="Digite o conteúdo do seu modelo aqui... \n\nExemplo de Seções:\n- Apresentação do Paciente:\n- Pontos Chave da Discussão:\n- Intervenções Utilizadas:\n- Resposta do Paciente:\n- Avaliação de Risco:\n- Plano para Próxima Sessão:"
              rows={15}
              className="min-h-[300px] font-mono text-sm"
            />
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveTemplate} disabled={isSaving || !templateName || !templateContent} className="ml-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          {isSaving ? <Save className="mr-2 h-4 w-4 animate-pulse" /> : <Save className="mr-2 h-4 w-4" />}
          {isSaving ? "Salvando..." : "Salvar Modelo"}
        </Button>
      </CardFooter>
    </Card>
  );
}
