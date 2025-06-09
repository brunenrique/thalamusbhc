
"use client";

import TemplateEditor from "@/components/templates/template-editor";
import { FilePlus2 } from "lucide-react";

export default function NewSessionNoteTemplatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FilePlus2 className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Criar Novo Modelo de Anotação</h1>
      </div>
      <TemplateEditor />
    </div>
  );
}
