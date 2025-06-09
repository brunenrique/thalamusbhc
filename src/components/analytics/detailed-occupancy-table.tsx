
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChartBig } from "lucide-react";

interface OccupancyDataItem {
  day: string;
  date: string;
  psychologist: string;
  totalSlots: number;
  bookedSlots: number;
  blockedSlots: number;
  occupancy: string;
}

interface DetailedOccupancyTableProps {
  data: OccupancyDataItem[];
}

const getOccupancyBadgeVariant = (occupancy: string): "default" | "secondary" | "outline" | "destructive" => {
  if (occupancy === "N/A") return "outline";
  const percentage = parseFloat(occupancy);
  if (percentage >= 90) return "default";
  if (percentage >= 70) return "secondary";
  if (percentage >= 40) return "outline";
  return "destructive";
};

export default function DetailedOccupancyTable({ data }: DetailedOccupancyTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <BarChartBig className="mx-auto h-12 w-12" />
        <p className="mt-2">Nenhum dado de ocupação detalhado disponível para os critérios selecionados.</p>
      </div>
    );
  }

  return (
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
          {data.map((item, index) => (
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
  );
}
