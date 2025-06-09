
"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartBig, CalendarRange, Filter, Users, Download } from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const OccupancyChart = dynamic(() => import("@/components/dashboard/occupancy-chart").then(mod => mod.OccupancyChart), {
  loading: () => <Skeleton className="h-[350px] w-full" />,
  ssr: false
});

const DetailedOccupancyTable = dynamic(() => import("@/components/analytics/detailed-occupancy-table"), {
  loading: () => (
    <div className="space-y-2 mt-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  ),
  ssr: false,
});


const mockOccupancyData = [
  { day: "Segunda", date: "2024-07-22", psychologist: "Dr. Silva", totalSlots: 8, bookedSlots: 6, blockedSlots: 1, occupancy: "75%" },
  { day: "Terça", date: "2024-07-23", psychologist: "Dr. Silva", totalSlots: 8, bookedSlots: 8, blockedSlots: 0, occupancy: "100%" },
  { day: "Quarta", date: "2024-07-24", psychologist: "Dra. Jones", totalSlots: 7, bookedSlots: 5, blockedSlots: 0, occupancy: "71.4%" },
  { day: "Quinta", date: "2024-07-25", psychologist: "Dr. Silva", totalSlots: 8, bookedSlots: 7, blockedSlots: 1, occupancy: "87.5%" },
  { day: "Sexta", date: "2024-07-26", psychologist: "Dra. Jones", totalSlots: 6, bookedSlots: 3, blockedSlots: 2, occupancy: "50%" },
  { day: "Sábado", date: "2024-07-27", psychologist: "Dra. Eva", totalSlots: 4, bookedSlots: 1, blockedSlots: 3, occupancy: "25%" },
  { day: "Domingo", date: "2024-07-28", psychologist: "Clínica", totalSlots: 0, bookedSlots: 0, blockedSlots: 0, occupancy: "N/A" },
];

export default function ClinicOccupancyPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <BarChartBig className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Ocupação da Clínica</h1>
        </div>
        <Button variant="outline" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Download className="mr-2 h-4 w-4" /> Exportar Relatório
        </Button>
      </div>
      <CardDescription>
        Analise a ocupação semanal e mensal da clínica, considerando agendamentos e horários bloqueados para melhor gerenciamento de recursos.
      </CardDescription>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
                <CardTitle className="font-headline">Visão Geral da Ocupação</CardTitle>
                <CardDescription>Filtre por intervalo de datas e psicólogo(a) para ver dados específicos.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button variant="outline">
                    <CalendarRange className="mr-2 h-4 w-4" /> Esta Semana
                </Button>
                <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" /> Todos Psicólogos
                </Button>
                 <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Mais Filtros
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] mb-8 bg-muted/30 rounded-lg p-4">
            <OccupancyChart />
          </div>
          
          <h3 className="text-xl font-semibold mb-3 font-headline">Dados Detalhados de Ocupação</h3>
          <DetailedOccupancyTable data={mockOccupancyData} />
        </CardContent>
      </Card>
    </div>
  );
}
