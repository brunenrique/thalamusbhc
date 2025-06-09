
"use client";

import { BarChart3, Users, CalendarCheck, TrendingUp, PieChart as PieChartIcon, Link as LinkIconLucide } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SessionsTrendChart } from "@/components/dashboard/sessions-trend-chart";
import { ProblemDistributionChart } from "@/components/dashboard/problem-distribution-chart"; // Assume this will be created

const mockOverallStats = {
  activePatients: 123,
  sessionsThisMonth: 456,
  avgOccupancyRate: 78,
};

const mockPsychologistStats = {
    sessionsThisMonth: 52,
    activePatients: 25,
    avgSessionDuration: 55,
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Painel Analítico</h1>
      </div>
      <CardDescription>
        Visão geral das métricas chave da clínica e desempenho dos psicólogos.
      </CardDescription>

      {/* General Clinic KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pacientes Ativos (Clínica)</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOverallStats.activePatients}</div>
            <p className="text-xs text-muted-foreground">+5 desde o último mês</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessões Este Mês (Clínica)</CardTitle>
            <CalendarCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOverallStats.sessionsThisMonth}</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ocupação Média da Agenda</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOverallStats.avgOccupancyRate}%</div>
            <p className="text-xs text-muted-foreground">Meta: 85%</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Psychologist KPIs (Example - would be dynamic based on logged-in user) */}
      <Card className="shadow-sm">
        <CardHeader>
            <CardTitle className="font-headline text-xl">Seus Indicadores (Dr. Silva)</CardTitle>
            <CardDescription>Métricas pessoais de desempenho e atividade.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted/30 rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">Suas Sessões Este Mês</h4>
                <p className="text-2xl font-bold">{mockPsychologistStats.sessionsThisMonth}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">Seus Pacientes Ativos</h4>
                <p className="text-2xl font-bold">{mockPsychologistStats.activePatients}</p>
            </div>
             <div className="p-4 bg-muted/30 rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">Duração Média da Sessão</h4>
                <p className="text-2xl font-bold">{mockPsychologistStats.avgSessionDuration} min</p>
            </div>
        </CardContent>
      </Card>


      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Tendência de Sessões (Últimos 6 Meses)</CardTitle>
            <CardDescription>Número total de sessões realizadas mensalmente na clínica.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] bg-muted/30 rounded-lg p-4">
            <SessionsTrendChart />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Distribuição de Queixas Comuns</CardTitle>
            <CardDescription>Principais motivos de consulta reportados pelos pacientes.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] bg-muted/30 rounded-lg p-4 flex items-center justify-center">
            <ProblemDistributionChart />
          </CardContent>
        </Card>
      </div>
      
      {/* Links to Detailed Reports */}
      <Card className="shadow-sm">
        <CardHeader>
            <CardTitle className="font-headline text-xl">Relatórios Detalhados</CardTitle>
            <CardDescription>Acesse análises mais específicas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/analytics/clinic-occupancy">
                    <BarChart3 className="mr-2 h-4 w-4" /> Ver Ocupação da Clínica Detalhada
                </Link>
            </Button>
            {/* Add more links as other detailed reports are created */}
        </CardContent>
      </Card>

    </div>
  );
}
