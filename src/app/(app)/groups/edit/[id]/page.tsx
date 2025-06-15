
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GroupForm from "@/components/forms/group-form";
import { mockTherapeuticGroups } from "@/app/(app)/groups/page";
import type { GroupFormValues } from "@/components/forms/group-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Edit, FileWarning } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EditGroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const [groupData, setGroupData] = useState<GroupFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (groupId) {
      const foundGroup = mockTherapeuticGroups.find(g => g.id === groupId);
      if (foundGroup) {
        setGroupData({
          name: foundGroup.name,
          description: foundGroup.description || "",
          psychologistId: foundGroup.psychologistId,
          patientIds: foundGroup.participants.map(p => p.id),
          dayOfWeek: foundGroup.dayOfWeek, // Use o novo campo
          startTime: foundGroup.startTime, // Use o novo campo
          endTime: foundGroup.endTime,   // Use o novo campo
          meetingAgenda: foundGroup.meetingAgenda || "",
        });
      } else {
        setError("Grupo não encontrado.");
      }
      setLoading(false);
    } else {
      setError("ID do grupo não fornecido.");
      setLoading(false);
    }
  }, [groupId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Edit className="h-7 w-7 text-primary animate-pulse" />
          <h1 className="text-3xl font-headline font-bold">Carregando Grupo...</h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex justify-end"><Skeleton className="h-10 w-24" /></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !groupData) {
    return (
      <div className="space-y-6 text-center py-10">
        <FileWarning className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-headline font-bold text-destructive">
          {error || "Grupo não encontrado"}
        </h1>
        <p className="text-muted-foreground">
          Não foi possível carregar o grupo para edição.
        </p>
        <Button variant="outline" asChild>
          <Link href="/groups">Voltar para Grupos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Edit className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Editar Grupo: {groupData.name}</h1>
      </div>
      <GroupForm initialData={groupData} groupId={groupId} />
    </div>
  );
}
