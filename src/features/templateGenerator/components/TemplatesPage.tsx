"use client";

import React, { useState } from "react";
import { Button } from "@/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/atoms/card";
import { Textarea } from "@/atoms/textarea";
import { Input } from "@/atoms/input";
import { Label } from "@/atoms/label";
import { Wand2, Sparkles, Loader2, FileText } from "lucide-react";
import { createSessionNoteTemplate, CreateSessionNoteTemplateOutput } from "@/features/templateGenerator/services/session-note-template-creation";

export function TemplatesPage() {
  const [formData, setFormData] = useState({
    templateName: "Modelo de Sessão TCC",
    psychologistStyle: "Terapia Cognitivo-Comportamental (TCC), colaborativa, orientada a objetivos.",
    sessionType: "Terapia Individual",
    keywords: "ansiedade, padrões de pensamento negativos, reestruturação cognitiva",
  });
  const [template, setTemplate] = useState<CreateSessionNoteTemplateOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleGenerate = async () => {
    setIsLoading(true);
    setTemplate(null);
    try {
      const result = await createSessionNoteTemplate(formData);
      setTemplate(result);
    } catch (error) {
      console.error("Failed to create template:", error);
      // Use toast for error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Wand2 className="size-5" />
            Gerador de Modelos
          </CardTitle>
          <CardDescription>
            Crie modelos de anotações de sessão com a ajuda da IA.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">Nome do Modelo</Label>
            <Input id="templateName" value={formData.templateName} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="psychologistStyle">Seu Estilo/Modalidade</Label>
            <Textarea id="psychologistStyle" value={formData.psychologistStyle} onChange={handleInputChange} placeholder="ex: Psicodinâmico, focado em soluções..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionType">Tipo de Sessão</Label>
            <Input id="sessionType" value={formData.sessionType} onChange={handleInputChange} placeholder="ex: Terapia de casal, avaliação infantil..." />
          </div>
           <div className="space-y-2">
            <Label htmlFor="keywords">Palavras-chave</Label>
            <Input id="keywords" value={formData.keywords} onChange={handleInputChange} placeholder="ex: trauma, luto, desenvolvimento" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Gerando..." : "Criar Modelo"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <FileText className="size-5" />
                Modelo Gerado
            </CardTitle>
            <CardDescription>
                Revise e edite o modelo gerado por IA abaixo.
            </CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border border-dashed p-8">
                <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">
                    Construindo seu modelo...
                </p>
                </div>
            </div>
            ) : (
            <Textarea
                value={template ? template.templateContent : "Seu modelo gerado aparecerá aqui..."}
                readOnly={!template}
                className="min-h-[450px] text-base"
                placeholder="Seu modelo gerado aparecerá aqui..."
            />
           )}
        </CardContent>
         {template && !isLoading && (
            <CardFooter className="justify-end gap-2">
                <Button variant="outline">Copiar</Button>
                <Button>Salvar Modelo</Button>
            </CardFooter>
         )}
      </Card>
    </div>
  );
}
