// src/features/patient-hub/components/AssessmentsView.tsx
import * as React from "react";
import { Assessment } from "@/types/patient-hub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Skeleton } from "@/components/atoms/skeleton";

interface AssessmentsViewProps {
  data: Assessment[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({ data, isLoading, isError }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Avaliações</CardTitle>
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
          <CardTitle>Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erro ao carregar as avaliações.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-foreground">Nenhuma avaliação encontrada.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Avaliações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((assessment) => (
          <div key={assessment.id} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
            <div>
              <p className="font-medium text-foreground">{assessment.name}</p>
              <p className="text-sm text-secondary-foreground">{assessment.date} - Pontuação: {assessment.score}</p>
            </div>
            <span className="text-sm font-medium text-primary">{assessment.status}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
