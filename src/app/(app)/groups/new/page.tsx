
"use client";

import GroupForm from "@/components/forms/group-form";
import { Users as UsersIcon } from "lucide-react"; // Renamed to avoid conflict with page name

export default function NewGroupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UsersIcon className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Criar Novo Grupo Terapêutico</h1>
      </div>
      <GroupForm />
    </div>
  );
}
