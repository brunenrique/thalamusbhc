
"use client";

import CaseFormulationModelForm from "@/components/tools/case-formulation-model-form";
import { Network, PlusCircle } from "lucide-react";

export default function NewCaseFormulationModelPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Network className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Criar Novo Modelo de Formulação</h1>
      </div>
      <CaseFormulationModelForm />
    </div>
  );
}
