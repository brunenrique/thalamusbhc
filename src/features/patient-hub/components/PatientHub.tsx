// src/features/patient-hub/components/PatientHub.tsx
"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { usePatientData } from "../hooks/usePatientData";
import { Skeleton } from "@/components/atoms/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";

// Importar os componentes das abas
import { MedicalRecord } from "./MedicalRecord";
import { SessionNotesList } from "./SessionNotesList";
import { AssessmentsView } from "./AssessmentsView";
import { ProgressCharts } from "./ProgressCharts";
import { ReportsSection } from "./ReportsSection";
import { HomeworkAssignments } from "./HomeworkAssignments";
import { TherapeuticGoals } from "./TherapeuticGoals";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";

export const PatientHub: React.FC = () => {
  const params = useParams();
  const patientId = params.patientId as string;

  const { data: patient, isLoading, isError } = usePatientData(patientId);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" /> {/* Tabs skeleton */}
        <Skeleton className="h-64 w-full" /> {/* Content skeleton */}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-destructive">
        <h1 className="text-2xl font-bold mb-4">Erro ao carregar dados do paciente.</h1>
        <p>Não foi possível carregar as informações do paciente. Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-secondary-foreground">
        <h1 className="text-2xl font-bold mb-4">Paciente não encontrado.</h1>
        <p>O paciente com o ID &quot;{patientId}&quot; não foi encontrado.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.name}`} alt={patient.name} />
          <AvatarFallback>{patient.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{patient.name}</h1>
          <p className="text-secondary-foreground">{patient.email} | {patient.contact}</p>
        </div>
      </div>

      <Tabs defaultValue="medical-record" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
          <TabsTrigger value="medical-record">Prontuário</TabsTrigger>
          <TabsTrigger value="session-notes">Sessões</TabsTrigger>
          <TabsTrigger value="assessments">Avaliações</TabsTrigger>
          <TabsTrigger value="progress-charts">Progresso</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="homework">Tarefas</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          {/* Adicionar mais TabsTrigger conforme necessário */}
        </TabsList>
        <TabsContent value="medical-record">
          <MedicalRecord data={patient.medicalRecordId ? { id: patient.medicalRecordId, patientId: patient.id, allergies: "", medications: "", pastHistory: "", currentConditions: "" } : undefined} isLoading={isLoading} isError={isError} />
        </TabsContent>
        <TabsContent value="session-notes">
          <SessionNotesList data={patient.sessionNotes} isLoading={isLoading} isError={isError} />
        </TabsContent>
        <TabsContent value="assessments">
          <AssessmentsView data={patient.assessments} isLoading={isLoading} isError={isError} />
        </TabsContent>
        <TabsContent value="progress-charts">
          <ProgressCharts data={patient.progressCharts} isLoading={isLoading} isError={isError} />
        </TabsContent>
        <TabsContent value="reports">
          <ReportsSection data={patient.reports} isLoading={isLoading} isError={isError} />
        </TabsContent>
        <TabsContent value="homework">
          <HomeworkAssignments data={patient.homeworkAssignments} isLoading={isLoading} isError={isError} />
        </TabsContent>
        <TabsContent value="goals">
          <TherapeuticGoals data={patient.therapeuticGoals} isLoading={isLoading} isError={isError} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
