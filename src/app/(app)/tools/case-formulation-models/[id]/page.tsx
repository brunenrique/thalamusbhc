"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Network, FileWarning } from "lucide-react";
import Link from "next/link";
import type { CaseFormulationTemplate } from "@/app/(app)/tools/case-formulation-models/page";
import { mockCaseFormulationTemplates } from "@/app/(app)/tools/case-formulation-models/page";

export default function CaseFormulationModelDetailPage() {
  const params = useParams();
  const templateId = params.id as string;

  const [templateData, setTemplateData] = useState<CaseFormulationTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (templateId) {
      const foundTemplate = mockCaseFormulationTemplates.find((t) => t.id === templateId);
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
          <Network className="h-7 w-7 text-primary animate-pulse" />
          <h1 className="text-3xl font-headline font-bold">Carregando Modelo...</h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
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
        <p className="text-muted-foreground">Não foi possível carregar o modelo.</p>
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
        <h1 className="text-3xl font-headline font-bold">{templateData.name}</h1>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-lg">Estrutura do Modelo</CardTitle>
        </CardHeader>
        <CardContent>
          {templateData.description && (
            <p className="mb-4 text-sm text-muted-foreground whitespace-pre-wrap">
              {templateData.description}
            </p>
          )}
          <pre className="whitespace-pre-wrap bg-muted/30 p-4 rounded-md font-mono text-sm">
            {templateData.structurePrompt}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

