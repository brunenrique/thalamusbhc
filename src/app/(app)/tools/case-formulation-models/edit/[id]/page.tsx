
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CaseFormulationModelForm from "@/components/forms/case-formulation-model-form";
import type { CaseFormulationTemplate } from "@/app/(app)/tools/case-formulation-models/page"; // Import type
import { mockCaseFormulationTemplates } from "@/app/(app)/tools/case-formulation-models/page"; // Import mock data
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Network, Edit, FileWarning } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EditCaseFormulationModelPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [templateData, setTemplateData] = useState<CaseFormulationTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (templateId) {
      const foundTemplate = mockCaseFormulationTemplates.find((t: CaseFormulationTemplate) => t.id === templateId);
      if (foundTemplate) {
        setTemplateData(foundTemplate);
      } else {
        setError("Modelo de formulação não encontrado.");
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
        <Card className="shadow-lg">
          <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <div className="flex justify-end"><Skeleton className="h-10 w-24" /></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !templateData) {
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
          <Link href="/tools/case-formulation-models">Voltar para Modelos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Network className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Editar Modelo de Formulação: {templateData.name}</h1>
      </div>
      <CaseFormulationModelForm initialData={templateData} templateId={templateId} />
    </div>
  );
}
