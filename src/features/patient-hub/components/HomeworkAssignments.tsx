// src/features/patient-hub/components/HomeworkAssignments.tsx
import * as React from "react";
import { HomeworkAssignment } from "@/types/patient-hub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Skeleton } from "@/components/atoms/skeleton";

interface HomeworkAssignmentsProps {
  data: HomeworkAssignment[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const HomeworkAssignments: React.FC<HomeworkAssignmentsProps> = ({ data, isLoading, isError }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tarefas de Casa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tarefas de Casa</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erro ao carregar as tarefas de casa.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tarefas de Casa</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-foreground">Nenhuma tarefa de casa encontrada.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tarefas de Casa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((assignment) => (
          <div key={assignment.id} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
            <div>
              <p className="font-medium text-foreground">{assignment.title}</p>
              <p className="text-sm text-secondary-foreground">Vencimento: {assignment.dueDate}</p>
            </div>
            <span className="text-sm font-medium text-primary">{assignment.status}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
