
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, PlusCircle, Search, Filter, MoreHorizontal, Edit, Trash2, CalendarPlus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data for therapeutic groups
export const mockTherapeuticGroups = [
  { id: "grp1", name: "Grupo de Apoio à Ansiedade", psychologist: "Dr. Silva", membersCount: 8, schedule: "Terças, 18:00 - 19:30", nextSession: "2024-08-06T18:00:00Z" },
  { id: "grp2", name: "Habilidades Sociais para Adolescentes", psychologist: "Dra. Jones", membersCount: 6, schedule: "Quintas, 16:00 - 17:00", nextSession: "2024-08-08T16:00:00Z" },
  { id: "grp3", name: "Grupo de Luto e Perdas", psychologist: "Dr. Silva", membersCount: 5, schedule: "Segundas, 10:00 - 11:30", nextSession: "2024-08-05T10:00:00Z" },
];

export default function TherapeuticGroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Grupos Terapêuticos</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/groups/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Grupo
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Gerenciar Grupos Terapêuticos</CardTitle>
          <CardDescription>Visualize, crie e gerencie os grupos terapêuticos da clínica.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <input placeholder="Buscar grupos..." className="w-full bg-transparent pl-8 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockTherapeuticGroups.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Nome do Grupo</TableHead>
                    <TableHead className="min-w-[150px]">Psicólogo(a) Responsável</TableHead>
                    <TableHead className="text-center">Membros</TableHead>
                    <TableHead className="min-w-[180px]">Horário Fixo</TableHead>
                    <TableHead className="min-w-[150px]">Próxima Sessão</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTherapeuticGroups.map(group => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.name}</TableCell>
                      <TableCell>{group.psychologist}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{group.membersCount}</Badge>
                      </TableCell>
                      <TableCell>{group.schedule}</TableCell>
                      <TableCell>{group.nextSession ? format(new Date(group.nextSession), "P 'às' HH:mm", { locale: ptBR }) : "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações para {group.name}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/schedule/new?groupId=${group.id}&type=group`}>
                                <CalendarPlus className="mr-2 h-4 w-4" /> Agendar Sessão Avulsa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/groups/edit/${group.id}`}>
                                <Edit className="mr-2 h-4 w-4" /> Editar Grupo
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir Grupo
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum grupo terapêutico encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">Comece criando um novo grupo.</p>
               <Button asChild className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/groups/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Grupo
                  </Link>
                </Button>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
