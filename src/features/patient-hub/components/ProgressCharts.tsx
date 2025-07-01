// src/features/patient-hub/components/ProgressCharts.tsx
import * as React from "react";
import { ProgressChartData } from "@/types/patient-hub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Skeleton } from "@/components/atoms/skeleton";

interface ProgressChartsProps {
  data: Record<string, ProgressChartData[]> | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ data, isLoading, isError }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Gráficos de Progresso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Gráficos de Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erro ao carregar os gráficos de progresso.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Gráficos de Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-foreground">Nenhum gráfico de progresso disponível.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gráficos de Progresso</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Placeholder for chart rendering */}
        {Object.entries(data).map(([key, chartData]) => (
          <div key={key}>
            <h3 className="text-lg font-semibold capitalize mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <div className="h-40 w-full bg-muted rounded-md flex items-center justify-center text-secondary-foreground">
              Gráfico de {key} (Placeholder)
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
