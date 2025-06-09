
"use client";

import { BarChart3, Users, CalendarCheck, TrendingUp, PieChart as PieChartIcon, Link as LinkIconLucide, UsersRound, Activity as ActivityIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";


const SessionsTrendChart = dynamic(() => import("@/components/dashboard/sessions-trend-chart").then(mod => mod.SessionsTrendChart), {
  loading: () => <Skeleton className="h-[350px] w-full" />,
  ssr: false
});
const ProblemDistributionChart = dynamic(() => import("@/components/dashboard/problem-distribution-chart").then(mod => mod.ProblemDistributionChart), {
  loading: () => <Skeleton className="h-[350px] w-full" />,
  ssr: false
});


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

const mockAllPsychologistsPerformance = [
  { id: "psy1", name: "Dr. Silva", activePatients: 25, sessionsThisMonth: 52, avgSessionRating: 4.8, noShowRate: "5%" },
  { id: "psy2", name: "Dra. Jones", activePatients: 30, sessionsThisMonth: 60, avgSessionRating: 4.9, noShowRate: "3%" },
  { id: "psy3", name: "Dra. Eva", activePatients: 22, sessionsThisMonth: 45, avgSessionRating: 4.7, noShowRate: "8%" },
  { id: "psy4", name: "Dr. Carlos", activePatients: 18, sessionsThisMonth: 40, avgSessionRating: 4.6, noShowRate: "10%" },
];


export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Painel Analítico</h1>
      </div>
      <CardDescription>
        Visão geral das métricas chave da clínica, desempenho dos psicólogos e outros relatórios detalhados.
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
      
      {/* Psychologist Performance Overview Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UsersRound className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-xl">Desempenho Geral dos Psicólogos</CardTitle>
          </div>
          <CardDescription>Estatísticas de atendimento e performance por psicólogo.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockAllPsychologistsPerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Psicólogo(a)</TableHead>
                    <TableHead className="text-center">Pacientes Ativos</TableHead>
                    <TableHead className="text-center">Sessões no Mês</TableHead>
                    <TableHead className="text-center">Avaliação Média</TableHead>
                    <TableHead className="text-right">Taxa de Ausência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAllPsychologistsPerformance.map((psy) => (
                    <TableRow key={psy.id}>
                      <TableCell className="font-medium">{psy.name}</TableCell>
                      <TableCell className="text-center">{psy.activePatients}</TableCell>
                      <TableCell className="text-center">{psy.sessionsThisMonth}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={psy.avgSessionRating >= 4.8 ? "default" : psy.avgSessionRating >= 4.5 ? "secondary" : "outline"}>
                          {psy.avgSessionRating.toFixed(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={parseFloat(psy.noShowRate) > 5 ? "destructive" : "secondary"}>
                          {psy.noShowRate}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <UsersRound className="mx-auto h-12 w-12" />
              <p className="mt-2">Nenhum dado de desempenho de psicólogos disponível.</p>
            </div>
          )}
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
            <CardTitle className="font-headline text-xl">Relatórios Detalhados e Administrativos</CardTitle>
            <CardDescription>Acesse análises mais específicas e relatórios administrativos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/analytics/clinic-occupancy">
                    <BarChart3 className="mr-2 h-4 w-4" /> Ver Ocupação da Clínica Detalhada
                </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/analytics/financial-overview"> {/* Placeholder Link */}
                    <ActivityIcon className="mr-2 h-4 w-4" /> Visão Geral Financeira (Em Breve)
                </Link>
            </Button>
             <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/analytics/patient-demographics"> {/* Placeholder Link */}
                    <PieChartIcon className="mr-2 h-4 w-4" /> Demografia de Pacientes (Em Breve)
                </Link>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}

