'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  MoreHorizontal,
  CalendarPlus,
  Trash2,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { GroupRecord } from '@/services/groupService';
import { fetchGroups } from '@/services/groupService';
import RequireRole from '@/components/RequireRole';
import { USER_ROLES } from '@/constants/roles';

export default function TherapeuticGroupsPage() {
  const [groups, setGroups] = useState<GroupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups()
      .then(setGroups)
      .catch(() => setError('Erro ao carregar grupos.'))
      .finally(() => setLoading(false));
  }, []);

  const dayOfWeekDisplay: Record<string, string> = {
    monday: 'Segundas',
    tuesday: 'Terças',
    wednesday: 'Quartas',
    thursday: 'Quintas',
    friday: 'Sextas',
    saturday: 'Sábados',
    sunday: 'Domingos',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Grupos Terapêuticos</h1>
        </div>
        <RequireRole role={USER_ROLES.ADMIN}>
          <Button variant="primary" asChild>
            <Link href="/groups/new" className="inline-flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Criar Novo Grupo
            </Link>
          </Button>
        </RequireRole>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Gerenciar Grupos Terapêuticos</CardTitle>
          <CardDescription>
            Visualize, crie e gerencie os grupos terapêuticos da clínica.
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Buscar grupos..."
                className="w-full bg-transparent pl-8 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : groups.length > 0 ? (
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
                  {groups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">
                        <Link href={`/groups/${group.id}`} className="hover:underline text-accent">
                          {group.name}
                        </Link>
                      </TableCell>
                      <TableCell>{group.psychologistId}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{group.patientIds?.length || 0}</Badge>
                      </TableCell>
                      <TableCell>{`${dayOfWeekDisplay[group.dayOfWeek] || group.dayOfWeek}, ${group.startTime} - ${group.endTime}`}</TableCell>
                      <TableCell>
                        {group.nextSession
                          ? format(new Date(group.nextSession), "P 'às' HH:mm", { locale: ptBR })
                          : 'N/A'}
                      </TableCell>
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
                                <span className="inline-flex items-center gap-2">
                                  <CalendarPlus className="h-4 w-4" />
                                  Agendar Sessão Avulsa
                                </span>
                              </Link>
                            </DropdownMenuItem>
                            <RequireRole role={USER_ROLES.ADMIN}>
                              <DropdownMenuItem asChild>
                                <Link href={`/groups/edit/${group.id}`}>
                                  <span className="inline-flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                    Editar Grupo
                                  </span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <Trash2 className="mr-2 h-4 w-4" /> Excluir Grupo
                              </DropdownMenuItem>
                            </RequireRole>
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
              <h3 className="mt-2 text-sm font-medium text-foreground">
                Nenhum grupo terapêutico encontrado
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">Comece criando um novo grupo.</p>
              <RequireRole role={USER_ROLES.ADMIN}>
                <Button
                  asChild
                  className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Link href="/groups/new" className="inline-flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Criar Novo Grupo
                  </Link>
                </Button>
              </RequireRole>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
