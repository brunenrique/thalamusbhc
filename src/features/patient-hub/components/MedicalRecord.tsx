// src/features/patient-hub/components/MedicalRecord.tsx
import * as React from "react";
import { MedicalRecord as MedicalRecordType } from "@/types/patient-hub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Skeleton } from "@/components/atoms/skeleton";

interface MedicalRecordProps {
  data: MedicalRecordType | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const MedicalRecord: React.FC<MedicalRecordProps> = ({ data, isLoading, isError }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Prontuário Médico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-[280px]" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Prontuário Médico</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erro ao carregar o prontuário médico.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prontuário Médico</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-foreground">
        <div>
          <p className="font-medium text-secondary-foreground">Alergias:</p>
          <p>{data.allergies}</p>
        </div>
        <div>
          <p className="font-medium text-secondary-foreground">Medicações:</p>
          <p>{data.medications}</p>
        </div>
        <div>
          <p className="font-medium text-secondary-foreground">Histórico:</p>
          <p>{data.pastHistory}</p>
        </div>
        <div>
          <p className="font-medium text-secondary-foreground">Condições Atuais:</p>
          <p>{data.currentConditions}</p>
        </div>
      </CardContent>
    </Card>
  );
};
