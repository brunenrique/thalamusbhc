'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import GroupForm, { type GroupFormValues } from '@/components/forms/group-form';
import { fetchGroups } from '@/services/groupService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, FileWarning } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function EditGroupPage() {
  const params = useParams();
  const groupId = params.id as string;

  const [groupData, setGroupData] = useState<GroupFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      setError('ID do grupo não fornecido.');
      setLoading(false);
      return;
    }

    fetchGroups()
      .then((list) => {
        const found = list.find((g) => g.id === groupId);
        if (found) {
          setGroupData({
            name: found.name,
            description: found.description || '',
            psychologistId: found.psychologistId,
            patientIds: found.patientIds || [],
            dayOfWeek: found.dayOfWeek,
            startTime: found.startTime,
            endTime: found.endTime,
            meetingAgenda: found.meetingAgenda || '',
          });
        } else {
          setError('Grupo não encontrado.');
        }
      })
      .catch(() => setError('Erro ao carregar grupo.'))
      .finally(() => setLoading(false));
  }, [groupId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Edit className="h-7 w-7 text-primary animate-pulse" />
          <h1 className="text-3xl font-headline font-bold">Carregando Grupo...</h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-40 w-full" /> {/* For patient selection */}
            <Skeleton className="h-20 w-full" />
            <div className="flex justify-end">
              <Skeleton className="h-10 w-24" />
            </div>
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
          {error || 'Grupo não encontrado'}
        </h1>
        <p className="text-muted-foreground">Não foi possível carregar o grupo para edição.</p>
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
