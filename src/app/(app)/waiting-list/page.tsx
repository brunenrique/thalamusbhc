
"use client"; // Ensure this is a client component

import React from 'react'; // Import React if not already imported
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ListChecks, UserPlus, Search, Filter, MoreHorizontal, CalendarPlus, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const mockWaitingList = [
  { id: "wl1", name: "Edward Mãos de Tesoura", requestedPsychologist: "Qualquer", requestedPsychologistId: "any", dateAdded: "2024-06-01", priority: "Alta", notes: "Prefere agendamentos pela manhã." },
  { id: "wl2", name: "Fiona Gallagher", requestedPsychologist: "Dr. Silva", requestedPsychologistId: "psy1", dateAdded: "2024-06-15", priority: "Média", notes: "Precisa de horários à noite." },
  { id: "wl3", name: "George Jetson", requestedPsychologist: "Dra. Jones", requestedPsychologistId: "psy2", dateAdded: "2024-07-01", priority: "Baixa", notes: "Flexível com horários." },
  { id: "wl4", name: "Harry Potter", requestedPsychologist: "Qualquer", requestedPsychologistId: "any", dateAdded: "2024-07-10", priority: "Alta", notes: "Encaminhamento urgente." },
];

const priorityLabels: Record<string, string> = {
    Alta: "Alta",
    Média: "Média",
    Baixa: "Baixa",
};


export default function WaitingListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <ListChecks className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Lista de Espera</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/waiting-list/add">
            <UserPlus className="mr-2 h-4 w-4" /> Adicionar à Lista de Espera
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Gerenciar Lista de Espera de Pacientes</CardTitle>
          <CardDescription>Visualize e aloque pacientes da lista de espera.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar na lista de espera..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockWaitingList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Psicólogo(a) Solicitado(a)</TableHead>
                  <TableHead>Data de Adição</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWaitingList.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.requestedPsychologist}</TableCell>
                    <TableCell>{format(new Date(item.dateAdded), "P", { locale: ptBR })}</TableCell>
                    <TableCell>
                      <Badge variant={item.priority === "Alta" ? "destructive" : item.priority === "Média" ? "secondary" : "outline"}>
                        {priorityLabels[item.priority] || item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={item.notes}>{item.notes}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/schedule/new?patientName=${encodeURIComponent(item.name)}&psychologistId=${item.requestedPsychologistId || 'any'}`}>
                              <CalendarPlus className="mr-2 h-4 w-4" />
                              Alocar Horário
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            {/* Placeholder for edit functionality */}
                            <Link href={`/waiting-list/edit/${item.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar Entrada
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover da Lista
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center py-10">
              <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Lista de espera vazia</h3>
              <p className="mt-1 text-sm text-muted-foreground">Nenhum paciente está atualmente na lista de espera.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
