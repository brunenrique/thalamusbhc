// src/features/patient-hub/components/ReportsSection.tsx
import * as React from "react";
import { Report } from "@/types/patient-hub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Skeleton } from "@/components/atoms/skeleton";

interface ReportsSectionProps {
  data: Report[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({ data, isLoading, isError }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Relatórios</CardTitle>
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
          <CardTitle>Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erro ao carregar os relatórios.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-foreground">Nenhum relatório encontrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Relatórios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((report) => (
          <div key={report.id} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
            <div>
              <p className="font-medium text-foreground">{report.name}</p>
              <p className="text-sm text-secondary-foreground">{report.date}</p>
            </div>
            <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-medium">
              Ver
            </a>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
