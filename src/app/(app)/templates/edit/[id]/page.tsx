
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TemplateEditor from "@/components/forms/template-editor";
import { mockTemplates } from "@/app/(app)/templates/page"; // Import mock data
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, FileWarning } from "lucide-react";
import Link from "next/link";

interface TemplateData {
  id: string;
  name: string;
  description?: string;
  category?: string;
  content: string;
}

export default function EditSessionNoteTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (templateId) {
      // Simulate fetching template data
      const foundTemplate = mockTemplates.find(t => t.id === templateId);
      if (foundTemplate) {
        setTemplate(foundTemplate);
      } else {
        setError("Modelo não encontrado.");
      }
      setLoading(false);
    } else {
      setError("ID do modelo não fornecido.");
      setLoading(false);
    }
  }, [templateId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Edit className="h-7 w-7 text-primary animate-pulse" />
          <h1 className="text-3xl font-headline font-bold">Carregando Modelo...</h1>
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="space-y-6 text-center py-10">
        <FileWarning className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-headline font-bold text-destructive">
          {error || "Modelo não encontrado"}
        </h1>
        <p className="text-muted-foreground">
          Não foi possível carregar o modelo para edição.
        </p>
        <Button variant="outline" asChild>
          <Link href="/templates">Voltar para Modelos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Edit className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Editar Modelo de Anotação</h1>
      </div>
      <TemplateEditor
        templateId={template.id}
        initialName={template.name}
        initialContent={template.content}
        // Pass other initial fields if TemplateEditor supports them (e.g., description, category)
        // initialPatientName and initialSessionSummary are typically for AI generation on new templates,
        // so they might not be relevant for editing an existing template structure directly.
      />
    </div>
  );
}
