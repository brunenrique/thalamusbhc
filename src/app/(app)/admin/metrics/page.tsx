
"use client";

import { BarChart3, Users, CalendarCheck, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/stats-card";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { checkUserRole } from "@/services/authRole";

const SessionsTrendChart = dynamic(() => import("@/components/dashboard/sessions-trend-chart").then(mod => mod.SessionsTrendChart), {
  loading: () => <Skeleton className="h-[350px] w-full" />,
  ssr: false
});

const SessionsPerPsychologistChart = dynamic(() => import("@/components/admin/sessions-per-psychologist-chart").then(mod => mod.SessionsPerPsychologistChart), {
  loading: () => <Skeleton className="h-[350px] w-full" />,
  ssr: false
});

const mockAdminMetrics = {
  totalPatients: 157,
  sessionsThisMonth: 523,
  avgSessionDuration: 52, // minutes
};


// Mock data for sessions per psychologist
const sessionsPerPsychologistData = [
  { name: "Dr. Silva", sessions: 180 },
  { name: "Dra. Jones", sessions: 210 },
  { name: "Dra. Eva", sessions: 133 },
];


export default function AdminMetricsPage() {
  const router = useRouter();

  useEffect(() => {
    checkUserRole('Admin').then((ok) => {
      if (!ok) router.replace('/');
    });
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Métricas da Clínica (Admin)</h1>
      </div>
      <CardDescription>
        Visão geral das principais métricas operacionais e de desempenho da clínica.
      </CardDescription>

      {/* General Clinic KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total de Pacientes Ativos" value={mockAdminMetrics.totalPatients.toString()} icon={<Users className="text-primary" />} />
        <StatsCard title="Sessões Realizadas (Este Mês)" value={mockAdminMetrics.sessionsThisMonth.toString()} icon={<CalendarCheck className="text-primary" />} />
        <StatsCard title="Duração Média da Sessão" value={`${mockAdminMetrics.avgSessionDuration} min`} icon={<Clock className="text-primary" />} />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Sessões Criadas por Semana (Último Mês)</CardTitle>
            <CardDescription>Volume de sessões semanais para monitorar a atividade.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] bg-muted/30 rounded-lg p-4">
            {/* Reusing SessionsTrendChart with weekly data for simplicity, can be customized */}
            <SessionsTrendChart /> 
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Sessões por Psicólogo (Este Mês)</CardTitle>
            <CardDescription>Distribuição do volume de sessões entre os psicólogos.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] bg-muted/30 rounded-lg p-4 flex items-center justify-center">
            <SessionsPerPsychologistChart data={sessionsPerPsychologistData} />
          </CardContent>
        </Card>
      </div>
      
      {/* Placeholder for "Average time between sessions" - complex to calculate without backend processing */}
      <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Tempo Médio Entre Sessões por Paciente</CardTitle>
            <CardDescription>(Métrica avançada - Em desenvolvimento / Requer análise de dados)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta métrica requer uma análise mais complexa do histórico de sessões de cada paciente para calcular o intervalo médio entre suas consultas.
              Será implementada em uma futura atualização com processamento de dados adequado.
            </p>
          </CardContent>
      </Card>

    </div>
  );
}
