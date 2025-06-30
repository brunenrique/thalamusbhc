// src/features/patient-hub/components/TherapeuticGoals.tsx
import * as React from "react";
import { TherapeuticGoal } from "@/types/patient-hub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Skeleton } from "@/components/atoms/skeleton";

interface TherapeuticGoalsProps {
  data: TherapeuticGoal[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const TherapeuticGoals: React.FC<TherapeuticGoalsProps> = ({ data, isLoading, isError }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Metas Terapêuticas</CardTitle>
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
          <CardTitle>Metas Terapêuticas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erro ao carregar as metas terapêuticas.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Metas Terapêuticas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-foreground">Nenhuma meta terapêutica encontrada.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Metas Terapêuticas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((goal) => (
          <div key={goal.id} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
            <div>
              <p className="font-medium text-foreground">{goal.description}</p>
              <p className="text-sm text-secondary-foreground">{goal.startDate} - {goal.endDate}</p>
            </div>
            <span className="text-sm font-medium text-primary">{goal.status}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
