import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Clock,
  TrendingUp,
  ListChecks,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/dashboard/stats-card";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { getTotalPatients, getSessionsThisMonth, getOpenTasksCount } from "@/services/metricsService";
import { RecentActivityItem } from "@/components/dashboard/recent-activity-item";
import DashboardWeeklySchedule from "@/components/dashboard/dashboard-weekly-schedule";

const SessionsTrendChart = dynamic(
  () =>
    import("@/components/dashboard/sessions-trend-chart").then(
      (mod) => mod.SessionsTrendChart
    ),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false
  }
);

const ProblemDistributionChart = dynamic(
  () =>
    import("@/components/dashboard/problem-distribution-chart").then(
      (mod) => mod.ProblemDistributionChart
    ),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false
  }
);

// Mock data (replace with actual data fetching)
const mockKpis = {
  activePatients: 123,
  sessionsThisMonth: 456,
  avgSessionDuration: 52, // minutes
  upcomingAppointments: 15,
  openTasks: 8
};

const mockRecentActivities = [
  {
    id: "act1",
    icon: <CalendarCheck className="w-4 h-4" />,
    description: "Nova consulta agendada para Alice W.",
    time: "2 minutos atrás"
  },
  {
    id: "act2",
    icon: <Users className="w-4 h-4" />,
    description: "Bob B. adicionado como novo paciente.",
    time: "1 hora atrás"
  },
  {
    id: "act3",
    icon: <ListChecks className="w-4 h-4" />,
    description: "Tarefa 'Preparar relatório de Eva G.' concluída.",
    time: "3 horas atrás"
  },
  {
    id: "act4",
    icon: <AlertTriangle className="w-4 h-4 text-destructive" />,
    description: "Lembrete: Avaliação de Charlie B. pendente.",
    time: "Ontem"
  }
];

export default async function DashboardPage() {
  const [activePatients, sessionsThisMonth, openTasks] = await Promise.all([
    getTotalPatients(),
    getSessionsThisMonth(),
    getOpenTasksCount(),
  ]);

  const userRole = "Psychologist";

  const mockKpis = {
    activePatients,
    sessionsThisMonth,
    avgSessionDuration: 52,
    upcomingAppointments: 15,
    openTasks,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">
          Painel Principal
        </h1>
      </div>
      <CardDescription>
        Visão geral da sua clínica, próximos compromissos e tarefas
        pendentes.
      </CardDescription>

      {/* KPIs Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Pacientes Ativos"
          value={mockKpis.activePatients.toString()}
          icon={<Users className="text-primary" />}
          href="/patients"
        />
        <StatsCard
          title="Sessões no Mês"
          value={mockKpis.sessionsThisMonth.toString()}
          icon={<CalendarCheck className="text-primary" />}
          href="/schedule"
        />
        <StatsCard
          title="Duração Média da Sessão"
          value={`${mockKpis.avgSessionDuration} min`}
          icon={<Clock className="text-primary" />}
          href="/analytics"
        />
        <StatsCard
          title="Próximos Agendamentos"
          value={mockKpis.upcomingAppointments.toString()}
          icon={<TrendingUp className="text-primary" />}
          href="/schedule/today"
        />
        <StatsCard
          title="Tarefas Pendentes"
          value={mockKpis.openTasks.toString()}
          icon={<ListChecks className="text-primary" />}
          href="/tasks"
        />
      </div>

      {/* Main Content Area - Schedule and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardWeeklySchedule />
        </div>

        {/* Recent Activity or Other Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Últimas ações e notificações importantes.
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              {mockRecentActivities.length > 0 ? (
                <div className="space-y-3">
                  {mockRecentActivities.map((activity) => (
                    <RecentActivityItem
                      key={activity.id}
                      {...activity}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma atividade recente.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/notifications" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Ver Todas Notificações
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Charts Section for Admin/Psychologist */}
      {(userRole === "Admin" ||
        userRole === "Psychologist") && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Tendência de Sessões (Últimos 6 Meses)
              </CardTitle>
              <CardDescription>
                Número total de sessões realizadas mensalmente.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] bg-muted/30 rounded-lg p-4">
              <SessionsTrendChart />
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">
                Distribuição de Queixas Comuns
              </CardTitle>
              <CardDescription>
                Principais motivos de consulta reportados.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] bg-muted/30 rounded-lg p-4 flex items-center justify-center">
              <ProblemDistributionChart />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
