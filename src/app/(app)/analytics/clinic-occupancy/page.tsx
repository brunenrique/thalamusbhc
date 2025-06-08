
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartBig, CalendarRange, Filter, Users, Download } from "lucide-react";
import { OccupancyChart } from "@/components/dashboard/occupancy-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const getOccupancyBadgeVariant = (occupancy: string): "default" | "secondary" | "outline" | "destructive" => {
    if (occupancy === "N/A") return "outline";
    const percentage = parseFloat(occupancy);
    if (percentage >= 90) return "default"; 
    if (percentage >= 70) return "secondary"; 
    if (percentage >= 40) return "outline"; 
    return "destructive"; 
  };

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
          {mockOccupancyData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Dia</TableHead>
                    <TableHead className="min-w-[120px]">Data</TableHead>
                    <TableHead className="min-w-[150px]">Psicólogo(a)</TableHead>
                    <TableHead className="text-center min-w-[100px]">Total Horários</TableHead>
                    <TableHead className="text-center min-w-[100px]">Agendados</TableHead>
                    <TableHead className="text-center min-w-[100px]">Bloqueados</TableHead>
                    <TableHead className="text-right min-w-[100px]">Ocupação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOccupancyData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.day}</TableCell>
                      <TableCell>{format(new Date(item.date), "P", { locale: ptBR })}</TableCell>
                      <TableCell>{item.psychologist}</TableCell>
                      <TableCell className="text-center">{item.totalSlots}</TableCell>
                      <TableCell className="text-center">{item.bookedSlots}</TableCell>
                      <TableCell className="text-center">{item.blockedSlots}</TableCell>
                      <TableCell className="text-right">
                          <Badge variant={getOccupancyBadgeVariant(item.occupancy)} className="whitespace-nowrap">
                              {item.occupancy}
                          </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <BarChartBig className="mx-auto h-12 w-12" />
              <p className="mt-2">Nenhum dado de ocupação disponível para os critérios selecionados.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
