'use client';

import {
  BarChart3,
  Users,
  CalendarCheck,
  TrendingUp,
  PieChart as PieChartIcon,
  UsersRound,
  AlertTriangle,
  SlidersHorizontal,
  ShoppingCart,
  LineChart,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { checkUserRole } from '@/services/authRole';
import { getTotalPatients, getSessionsThisMonth } from '@/services/metricsService';

// --- Dynamic Component Imports ---
const SessionsTrendChart = dynamic(
  () => import('@/components/dashboard/sessions-trend-chart').then((mod) => mod.SessionsTrendChart),
  {
    loading: () => <Skeleton className="h-[350px] w-full" />,
    ssr: false,
  }
);
const ProblemDistributionChart = dynamic(
  () =>
    import('@/components/dashboard/problem-distribution-chart').then(
      (mod) => mod.ProblemDistributionChart
    ),
  {
    loading: () => <Skeleton className="h-[350px] w-full" />,
    ssr: false,
  }
);
const OccupancyChart = dynamic(
  () => import('@/components/dashboard/occupancy-chart').then((mod) => mod.OccupancyChart),
  {
    loading: () => <Skeleton className="h-[350px] w-full" />,
    ssr: false,
  }
);

// --- Type Definitions ---
interface OverallStats {
  activePatients: number;
  sessionsThisMonth: number;
  avgOccupancyRate: number; // Placeholder for now
}

// --- Mock Data (for sections pending integration) ---
const mockPsychologistStats = {
  sessionsThisMonth: 52,
  activePatients: 25,
  avgSessionDuration: 55,
};

const mockAllPsychologistsPerformance = [
  {
    id: 'psy1',
    name: 'Dr. Silva',
    activePatients: 25,
    sessionsThisMonth: 52,
    avgSessionRating: 4.8,
    noShowRate: '5%',
  },
  {
    id: 'psy2',
    name: 'Dra. Jones',
    activePatients: 30,
    sessionsThisMonth: 60,
    avgSessionRating: 4.9,
    noShowRate: '3%',
  },
];

const mockDetailedOccupancyData = [
  {
    day: 'Segunda',
    date: '2024-07-22',
    psychologist: 'Dr. Silva',
    totalSlots: 8,
    bookedSlots: 6,
    blockedSlots: 1,
    occupancy: '75%',
  },
  {
    day: 'Terça',
    date: '2024-07-23',
    psychologist: 'Dr. Silva',
    totalSlots: 8,
    bookedSlots: 8,
    blockedSlots: 0,
    occupancy: '100%',
  },
];

// --- Helper Functions ---
const getOccupancyBadgeVariant = (
  occupancy: string
): 'default' | 'secondary' | 'outline' | 'destructive' => {
  if (occupancy === 'N/A') return 'outline';
  const percentage = parseFloat(occupancy);
  if (percentage >= 90) return 'default';
  if (percentage >= 70) return 'secondary';
  if (percentage >= 40) return 'outline';
  return 'destructive';
};

// --- Component Definition ---
export default function AnalyticsHubPage() {
  const router = useRouter();
  // TODO: Replace with a real role from an auth hook
  const userRole: 'Admin' | 'Psychologist' = 'Admin';

  const [overallStats, setOverallStats] = useState<OverallStats>({
    activePatients: 0,
    sessionsThisMonth: 0,
    avgOccupancyRate: 0,
  });

  useEffect(() => {
    // 1. Check user role for route protection
    checkUserRole(['Admin', 'Psychologist']).then((isAuthorized) => {
      if (!isAuthorized) {
        router.replace('/');
      }
    });

    // 2. Fetch data from Firestore
    const fetchMetrics = async () => {
      // Use Promise.all for parallel fetching
      const [patients, sessions] = await Promise.all([getTotalPatients(), getSessionsThisMonth()]);
      setOverallStats({
        activePatients: patients,
        sessionsThisMonth: sessions,
        avgOccupancyRate: 0, // Placeholder - to be calculated in a future task
      });
    };

    fetchMetrics();
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Relatórios e Análises</h1>
      </div>
      <CardDescription>
        Hub central para visualização de dados estatísticos, gráficos e indicadores da clínica e da
        sua prática.
      </CardDescription>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="clinicPerformance">Desempenho Clínica</TabsTrigger>
          <TabsTrigger value="clinicalAnalysis">Análise Clínica</TabsTrigger>
          <TabsTrigger value="platformUsage">Uso da Plataforma</TabsTrigger>
          {userRole === 'Admin' && <TabsTrigger value="financial">Financeiro</TabsTrigger>}
          {userRole === 'Psychologist' && (
            <TabsTrigger value="myMetrics">Minhas Métricas</TabsTrigger>
          )}
        </TabsList>

        {/* Aba: Visão Geral */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">KPIs Gerais da Clínica</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pacientes Ativos
                  </CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.activePatients}</div>
                  <p className="text-xs text-muted-foreground">+5 desde o último mês</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Sessões no Mês
                  </CardTitle>
                  <CalendarCheck className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.sessionsThisMonth}</div>
                  <p className="text-xs text-muted-foreground">+12% vs mês passado</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Ocupação Média
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallStats.avgOccupancyRate}%</div>
                  <p className="text-xs text-muted-foreground">Meta: 85%</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="font-headline">
                  Tendência de Sessões (Últimos 6 Meses)
                </CardTitle>
                <CardDescription>Número total de sessões realizadas mensalmente.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] bg-muted/30 rounded-lg p-4">
                <SessionsTrendChart />
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="font-headline">Distribuição de Queixas Comuns</CardTitle>
                <CardDescription>Principais motivos de consulta reportados.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                <ProblemDistributionChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba: Desempenho da Clínica */}
        <TabsContent value="clinicPerformance" className="mt-6 space-y-6">
          {userRole === 'Admin' && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                  <UsersRound className="mr-2 h-5 w-5 text-primary" />
                  Desempenho Geral dos Psicólogos
                </CardTitle>
                <CardDescription>Estatísticas de atendimento por psicólogo.</CardDescription>
              </CardHeader>
              <CardContent>
                {mockAllPsychologistsPerformance.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Psicólogo(a)</TableHead>
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
                              <Badge
                                variant={
                                  psy.avgSessionRating >= 4.8
                                    ? 'default'
                                    : psy.avgSessionRating >= 4.5
                                      ? 'secondary'
                                      : 'outline'
                                }
                              >
                                {psy.avgSessionRating.toFixed(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={
                                  parseFloat(psy.noShowRate) > 5 ? 'destructive' : 'secondary'
                                }
                              >
                                {psy.noShowRate}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum dado de desempenho disponível.</p>
                )}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Ocupação da Agenda
              </CardTitle>
              <CardDescription>Análise da utilização dos horários da clínica.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] mb-6 bg-muted/30 rounded-lg p-4">
                <OccupancyChart />
              </div>
              <h3 className="text-lg font-semibold mb-2 font-headline">
                Ocupação Detalhada (Exemplo Semana)
              </h3>
              <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dia</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Psicólogo(a)</TableHead>
                      <TableHead className="text-center">Total Horários</TableHead>
                      <TableHead className="text-center">Agendados</TableHead>
                      <TableHead className="text-center">Bloqueados</TableHead>
                      <TableHead className="text-right">Ocupação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDetailedOccupancyData.map((item) => (
                      <TableRow key={item.date + '-' + item.psychologist}>
                        <TableCell>{item.day}</TableCell>
                        <TableCell>{format(new Date(item.date), 'P', { locale: ptBR })}</TableCell>
                        <TableCell>{item.psychologist}</TableCell>
                        <TableCell className="text-center">{item.totalSlots}</TableCell>
                        <TableCell className="text-center">{item.bookedSlots}</TableCell>
                        <TableCell className="text-center">{item.blockedSlots}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={getOccupancyBadgeVariant(item.occupancy)}>
                            {item.occupancy}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" className="mt-4">
                <Download className="mr-2 h-4 w-4" /> Exportar Relatório de Ocupação
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Métricas de Pacientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">
                Novos Pacientes (Mês/Trimestre/Ano): Placeholder
              </p>
              <p className="text-muted-foreground">Taxa de Retenção de Pacientes: Placeholder</p>
              <p className="text-muted-foreground">Taxa de Desligamento/Alta: Placeholder</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Lista de Espera</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">Número de Pessoas na Lista: 5</p>
              <p className="text-muted-foreground">Tempo Médio de Espera: 12 dias</p>
              <p className="text-muted-foreground">Taxa de Conversão (Lista p/ Ativos): 60%</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Análise Clínica (Agregada) */}
        <TabsContent value="clinicalAnalysis" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <PieChartIcon className="mr-2 h-5 w-5 text-primary" />
                Perfil Clínico Geral
              </CardTitle>
              <CardDescription>
                Dados agregados e anonimizados sobre os pacientes da clínica.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Principais Queixas/Motivos de Consulta: Gráfico de barras (Placeholder)
              </p>
              <p className="text-muted-foreground">
                Distribuição de Diagnósticos (CID/DSM): Gráfico de pizza (Placeholder - requer
                consentimento e tratamento ético)
              </p>
              <p className="text-muted-foreground">
                Prevalência de Temas em Terapia: Lista ou nuvem de palavras (Placeholder)
              </p>
              <p className="text-muted-foreground">
                Tempo Médio de Tratamento (por queixa principal): Tabela/Gráfico (Placeholder)
              </p>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-xs dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700">
                <AlertTriangle className="inline-block h-4 w-4 mr-1.5" />
                <strong>Nota Ética:</strong> Todos os dados clínicos agregados são anonimizados. A
                análise de diagnósticos específicos requer consentimento informado e adesão estrita
                às diretrizes éticas e de privacidade.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Uso da Plataforma */}
        <TabsContent value="platformUsage" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <SlidersHorizontal className="mr-2 h-5 w-5 text-primary" />
                Uso da Plataforma
              </CardTitle>
              <CardDescription>
                Métricas sobre a interação dos usuários com as funcionalidades do Thalamus.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Frequência de Uso dos Módulos (Agenda, Pacientes, etc.): Gráfico (Placeholder)
              </p>
              <p className="text-muted-foreground">
                Adoção de Ferramentas de IA (Geração de Notas, Insights): Percentual/Gráfico
                (Placeholder)
              </p>
              <p className="text-muted-foreground">
                Criação e Utilização de Modelos (Anotação, Documentos): Contagem (Placeholder)
              </p>
              <p className="text-muted-foreground">
                Compartilhamento de Recursos (PDFs, Guias): Volume (Placeholder)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Financeiro (Admin) */}
        {userRole === 'Admin' && (
          <TabsContent value="financial" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
                  Métricas Financeiras (Admin)
                </CardTitle>
                <CardDescription>Visão geral das finanças da clínica.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Receita Total (Mês/Trimestre/Ano): Placeholder
                </p>
                <p className="text-muted-foreground">Receita por Psicólogo: Placeholder</p>
                <p className="text-muted-foreground">Valor Médio por Sessão: Placeholder</p>
                <p className="text-muted-foreground">Taxa de Inadimplência: Placeholder</p>
                <p className="text-red-500 dark:text-red-400">
                  Módulo financeiro em desenvolvimento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Aba: Minhas Métricas (Psicólogo) */}
        {userRole === 'Psychologist' && (
          <TabsContent value="myMetrics" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                  <LineChart className="mr-2 h-5 w-5 text-primary" />
                  Minhas Métricas Pessoais (Dr. Silva)
                </CardTitle>
                <CardDescription>Sua atividade e desempenho na plataforma.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-muted/30 rounded-md">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Suas Sessões Este Mês
                  </h4>
                  <p className="text-2xl font-bold">{mockPsychologistStats.sessionsThisMonth}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-md">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Seus Pacientes Ativos
                  </h4>
                  <p className="text-2xl font-bold">{mockPsychologistStats.activePatients}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-md">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Duração Média da Sessão
                  </h4>
                  <p className="text-2xl font-bold">
                    {mockPsychologistStats.avgSessionDuration} min
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Análise da Sua Prática</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Temas Mais Recorrentes em Suas Sessões: Nuvem de palavras ou lista (Placeholder)
                </p>
                <p className="text-muted-foreground">
                  Tipos de Intervenção Mais Utilizados: Gráfico de pizza (Placeholder)
                </p>
                <p className="text-muted-foreground">
                  Evolução de Sintomas (seus pacientes, anonimizado): Gráfico de linha (Placeholder)
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}