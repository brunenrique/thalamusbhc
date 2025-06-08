
"use client";
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckSquare, PlusCircle, Search, Filter, CalendarClock, UserCog, AlertTriangle, CheckCircle2, CalendarIcon } from "lucide-react";
import Link from "next/link";
import TaskItem from "@/components/tasks/task-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from '@/components/ui/label';
import { format, isEqual, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const mockTasksData = [
  { id: "task1", title: "Acompanhar Alice W.", dueDate: "2024-07-25", assignedTo: "Dr. Silva", status: "Pendente" as const, priority: "Alta" as const, patientId: "1" },
  { id: "task2", title: "Preparar relatório de avaliação para Bob B.", dueDate: "2024-07-22", assignedTo: "Secretaria", status: "Em Progresso" as const, priority: "Média" as const, patientId: "2" },
  { id: "task3", title: "Revisar entrada de novo paciente - Charlie B.", dueDate: "2024-07-20", assignedTo: "Dra. Jones", status: "Concluída" as const, priority: "Alta" as const, patientId: "3" },
  { id: "task4", title: "Enviar lembrete para Diana P. para avaliação", dueDate: "2024-07-28", assignedTo: "Secretaria", status: "Pendente" as const, priority: "Baixa" as const, patientId: "4" },
  { id: "task5", title: "Atualizar documento de políticas da clínica", dueDate: "2024-08-01", assignedTo: "Admin", status: "Pendente" as const, priority: "Média" as const },
];

type TaskStatus = "Pendente" | "Em Progresso" | "Concluída";
type TaskPriority = "Alta" | "Média" | "Baixa";

const taskStatusOptions = [
    {value: "All", label: "Todos os Status"},
    {value: "Pendente", label: "Pendente"},
    {value: "Em Progresso", label: "Em Progresso"},
    {value: "Concluída", label: "Concluída"},
];
const taskPriorityOptions = [
    {value: "All", label: "Todas as Prioridades"},
    {value: "Alta", label: "Alta"},
    {value: "Média", label: "Média"},
    {value: "Baixa", label: "Baixa"},
];

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    priority: "All",
    assignedTo: "All",
    dueDate: undefined as Date | undefined,
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = () => {
    setFilters({
        status: "All",
        priority: "All",
        assignedTo: "All",
        dueDate: undefined,
    });
    setSearchTerm("");
  }

  const uniqueAssignees = useMemo(() => {
    const assignees = new Set(mockTasksData.map(task => task.assignedTo));
    return ["Todos", ...Array.from(assignees)];
  }, []);

  const filteredTasks = useMemo(() => {
    return mockTasksData.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (task.patientId && `paciente:${task.patientId}`.includes(searchTerm.toLowerCase())) ||
                            task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === "All" || task.status === filters.status;
      const matchesPriority = filters.priority === "All" || task.priority === filters.priority;
      const matchesAssignee = filters.assignedTo === "Todos" || task.assignedTo === filters.assignedTo;
      const matchesDueDate = !filters.dueDate || isEqual(startOfDay(new Date(task.dueDate)), startOfDay(filters.dueDate));
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesDueDate;
    });
  }, [searchTerm, filters]);

  const pendingTasks = filteredTasks.filter(task => task.status === "Pendente" || task.status === "Em Progresso");
  const completedTasks = filteredTasks.filter(task => task.status === "Concluída");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Tarefas</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/tasks/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Tarefa
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Gerenciar Tarefas</CardTitle>
          <CardDescription>Acompanhe e gerencie as tarefas da sua equipe.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar tarefas por título, responsável ou 'paciente:id'..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filtros
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 p-2" align="end">
                <DropdownMenuLabel>Filtrar Tarefas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <div className="space-y-2 px-2 py-1.5">
                    <Label htmlFor="filterStatus">Status</Label>
                    <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                      <SelectTrigger id="filterStatus"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {taskStatusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 px-2 py-1.5">
                    <Label htmlFor="filterPriority">Prioridade</Label>
                    <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
                      <SelectTrigger id="filterPriority"><SelectValue /></SelectTrigger>
                      <SelectContent>
                         {taskPriorityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 px-2 py-1.5">
                    <Label htmlFor="filterAssignee">Responsável</Label>
                    <Select value={filters.assignedTo} onValueChange={(value) => handleFilterChange("assignedTo", value)}>
                      <SelectTrigger id="filterAssignee"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {uniqueAssignees.map(assignee => <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 px-2 py-1.5">
                    <Label htmlFor="filterDueDate">Data de Vencimento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button id="filterDueDate" variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dueDate ? format(filters.dueDate, "P", {locale: ptBR}) : <span>Escolha uma data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent locale={ptBR} mode="single" selected={filters.dueDate} onSelect={(date) => handleFilterChange("dueDate", date)} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {/* O botão de aplicar filtros é opcional, pois os filtros já são aplicados onChange */}
                {/* <DropdownMenuItem>
                    <Button className="w-full" size="sm" onClick={() => console.log("Aplicando filtros de tarefas:", filters)}>Aplicar Filtros</Button>
                </DropdownMenuItem> */}
                 <DropdownMenuItem>
                    <Button className="w-full" size="sm" variant="ghost" onClick={resetFilters}>Limpar Filtros</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">
                <AlertTriangle className="mr-2 h-4 w-4" /> Pendentes ({pendingTasks.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Concluídas ({completedTasks.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              {pendingTasks.length > 0 ? (
                <div className="space-y-4">
                  {pendingTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="mt-2 text-muted-foreground">Nenhuma tarefa pendente corresponde aos seus filtros.</p>
                    { (filters.status !== "All" || filters.priority !== "All" || filters.assignedTo !== "All" || filters.dueDate || searchTerm) &&
                        <Button variant="link" onClick={resetFilters} className="mt-2">Limpar filtros</Button>
                    }
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              {completedTasks.length > 0 ? (
                <div className="space-y-4">
                  {completedTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="mt-2 text-muted-foreground">Nenhuma tarefa concluída corresponde aos seus filtros.</p>
                     { (filters.status !== "All" || filters.priority !== "All" || filters.assignedTo !== "All" || filters.dueDate || searchTerm) &&
                        <Button variant="link" onClick={resetFilters} className="mt-2">Limpar filtros</Button>
                    }
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

