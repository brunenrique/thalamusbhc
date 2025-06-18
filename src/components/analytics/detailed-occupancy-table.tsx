"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface OccupancyRow {
  id: string;
  day: string;
  date: string;
  psychologist: string;
  totalSlots: number;
  bookedSlots: number;
  blockedSlots: number;
  occupancy: string;
}

interface DetailedOccupancyTableProps {
  dados?: OccupancyRow[];
}

const PAGE_SIZE = 10;

export default function DetailedOccupancyTable({ dados }: DetailedOccupancyTableProps) {
  const [page, setPage] = useState(0);

  if (!dados || dados.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma ocupação registrada.</p>;
  }

  const pageCount = Math.ceil(dados.length / PAGE_SIZE);

  const pageData = useMemo(() => {
    const start = page * PAGE_SIZE;
    return dados.slice(start, start + PAGE_SIZE);
  }, [dados, page]);

  return (
    <div className="overflow-x-auto">
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
          {pageData.map((linha) => (
            <TableRow key={linha.id}>
              <TableCell>{linha.day}</TableCell>
              <TableCell>{linha.date}</TableCell>
              <TableCell>{linha.psychologist}</TableCell>
              <TableCell className="text-center">{linha.totalSlots}</TableCell>
              <TableCell className="text-center">{linha.bookedSlots}</TableCell>
              <TableCell className="text-center">{linha.blockedSlots}</TableCell>
              <TableCell className="text-right">
                <Badge>{linha.occupancy}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pageCount > 1 && (
        <div className="flex justify-end gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Anterior
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page === pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
