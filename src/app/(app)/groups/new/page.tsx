
"use client";

import GroupForm from "@/components/forms/group-form";
import { Users as UsersIcon } from "lucide-react"; // Renamed to avoid conflict with page name
import Heading from "@/components/ui/heading";

export default function NewGroupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UsersIcon className="h-7 w-7 text-primary" />
        <Heading level={1}>Criar Novo Grupo Terapêutico</Heading>
      </div>
      <GroupForm />
    </div>
  );
}
