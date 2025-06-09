
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Users, CalendarCheck, BarChart3, ArrowUpRight, DollarSign, Clock, ClipboardList, LineChart, UsersRound, CalendarClock, UserX, FileX2, Repeat } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentActivityItem } from "@/components/dashboard/recent-activity-item";

const OccupancyChart = dynamic(() => import('@/components/dashboard/occupancy-chart').then(mod => mod.OccupancyChart), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false,
});
const PerformanceChart = dynamic(() => import('@/components/dashboard/performance-chart').then(mod => mod.PerformanceChart), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false,
});


export default function DashboardPage() {
  const upcomingAppointments = [
    { id: '1', patientName: 'Alice Wonderland', time: '10:00', psychologist: 'Dr. Silva' },
    { id: '2', patientName: 'Bob O Construtor', time: '11:30', psychologist: 'Dra. Jones' },
    { id: '3', patientName: 'Charlie Brown', time: '14:00', psychologist: 'Dr. Silva' },
  ];

  const recentActivities = [
    { id: 'act1', description: 'Nova paciente "Eva Green" adicionada.', time: 'Há 2 horas', icon: <Users className="w-4 h-4" /> },
    { id: 'act2', description: 'Notas da sessão de "Alice W." finalizadas.', time: 'Há 5 horas', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'act3', description: 'Agendamento com "Bob O." remarcado.', time: 'Há 1 dia', icon: <CalendarCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-bold">Painel</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/schedule/new">
            <CalendarCheck className="mr-2 h-4 w-4" /> Novo Agendamento
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Pacientes Ativos" value="78" icon={<UsersRound className="text-primary" />} trend="+2 esta semana" />
        <StatsCard title="Consultas Hoje" value="8" icon={<CalendarClock className="text-primary" />} trend="2 pendentes" />
        <StatsCard title="Sessões Este Mês" value="45" icon={<LineChart className="text-primary" />} trend="+10% vs mês passado" />
        <StatsCard title="Tarefas Abertas" value="12" icon={<Activity className="text-primary" />} trend="3 atrasadas" />
        <StatsCard title="Ausências no Mês" value="3" icon={<UserX className="text-primary" />} trend="-1 vs mês passado" />
        <StatsCard title="Cancelamentos no Mês" value="5" icon={<FileX2 className="text-primary" />} trend="+2 vs mês passado" />
        <StatsCard title="Remarcações no Mês" value="7" icon={<Repeat className="text-primary" />} trend="Estável" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Ocupação da Agenda</CardTitle>
            <CardDescription>Tendências de ocupação semanal</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <OccupancyChart />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Desempenho dos Psicólogos</CardTitle>
            <CardDescription>Sessões concluídas por psicólogo</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PerformanceChart />
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(appt => (
                <div key={appt.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                  <div>
                    <p className="font-semibold">{appt.patientName}</p>
                    <p className="text-sm text-muted-foreground">{appt.psychologist}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appt.time}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-accent" asChild>
                        <Link href={`/patients/${appt.id}`}>Ver Detalhes</Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">Nenhum próximo agendamento.</p>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map(activity => (
                <RecentActivityItem key={activity.id} description={activity.description} time={activity.time} icon={activity.icon} />
              ))
            ) : (
              <p className="text-muted-foreground">Nenhuma atividade recente.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-muted-foreground flex items-center">
          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" /> {trend}
        </p>}
      </CardContent>
    </Card>
  );
}
