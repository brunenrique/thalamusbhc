
"use client";

import TaskForm from "@/components/tasks/task-form";
import { mockTasksData, type Task } from "@/app/(app)/tasks/page"; // Importando mock data e tipo
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditTaskPage() {
  const params = useParams();
  const taskId = params.id as string;
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      // Simulação de busca de dados
      const task = mockTasksData.find(t => t.id === taskId);
      if (task) {
        setTaskToEdit(task);
      } else {
        setError("Tarefa não encontrada.");
      }
      setLoading(false);
    }
  }, [taskId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Edit className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Carregando Tarefa...</h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 text-center py-10">
         <Edit className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="text-3xl font-headline font-bold text-destructive">Erro ao Carregar Tarefa</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!taskToEdit) {
     return ( // Fallback caso taskToEdit ainda seja undefined após o loading (pouco provável com a lógica atual)
      <div className="space-y-6 text-center py-10">
        <h1 className="text-xl font-semibold">Tarefa não encontrada.</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* O cabeçalho da página agora é tratado pelo TaskForm */}
      <TaskForm initialData={taskToEdit} isEditMode={true} />
    </div>
  );
}
