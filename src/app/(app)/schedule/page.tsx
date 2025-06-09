
"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CalendarDays, PlusCircle, ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import Link from "next/link";
import AppointmentCalendar from "@/components/schedule/appointment-calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar"; 
import { Label } from '@/components/ui/label';
import { format, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const mockPsychologists = [
  { id: "psy1", name: "Dr. Silva" },
  { id: "psy2", name: "Dra. Jones" },
  { id: "all", name: "Todos os Psicólogos" },
];

const appointmentStatuses = [
    {value: "All", label: "Todos"},
    {value: "Scheduled", label: "Agendado"},
    {value: "Confirmed", label: "Confirmado"},
    {value: "Cancelled", label: "Cancelado"},
    {value: "Completed", label: "Concluído"},
    {value: "Blocked", label: "Bloqueado"}
];


export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"Month" | "Week" | "Day">("Week");

  const [filters, setFilters] = useState({
    psychologistId: "all",
    status: "All",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    console.log("Filtros atualizados:", { ...filters, [filterName]: value });
  };
  
  const currentMonthYear = format(currentDate, 'MMMM yyyy', { locale: ptBR });

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (currentView === "Month") {
        newDate.setMonth(currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
    } else if (currentView === "Week") {
        newDate.setDate(currentDate.getDate() + (direction === 'prev' ? -7 : 7));
    } else { 
        newDate.setDate(currentDate.getDate() + (direction === 'prev' ? -1 : 1));
    }
    setCurrentDate(newDate);
  };

  const displayDateRange = () => {
    if (currentView === "Month") return currentMonthYear.charAt(0).toUpperCase() + currentMonthYear.slice(1);
    if (currentView === "Week") {
        const startOfWeekDate = new Date(currentDate);
        // Adjust for week starting on Monday for ptBR locale if getDay is 0 (Sunday)
        const offset = getDay(startOfWeekDate) === 0 ? -6 : 1; 
        startOfWeekDate.setDate(currentDate.getDate() - getDay(currentDate) + offset);
        const endOfWeekDate = new Date(startOfWeekDate);
        endOfWeekDate.setDate(startOfWeekDate.getDate() + 6);
        return `${format(startOfWeekDate, "d MMM", {locale: ptBR})} - ${format(endOfWeekDate, "d MMM, yyyy", {locale: ptBR})}`;
    }
    return format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  }


  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-var(--header-height,4rem)-2rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Agenda de Consultas</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/schedule/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Agendamento
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-card">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}><ChevronLeft className="h-4 w-4" /></Button>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground min-w-[150px] sm:min-w-[240px] text-center capitalize">{displayDateRange()}</h2>
          <Button variant="outline" size="icon" onClick={() => navigateDate('next')}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Hoje</Button>
          <Button variant={currentView === "Day" ? "secondary" : "ghost"} size="sm" onClick={() => setCurrentView("Day")}>Dia</Button>
          <Button variant={currentView === "Week" ? "secondary" : "ghost"} size="sm" onClick={() => setCurrentView("Week")}>Semana</Button>
          <Button variant={currentView === "Month" ? "secondary" : "ghost"} size="sm" onClick={() => setCurrentView("Month")}>Mês</Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Filtrar agendamentos">
                <ListFilter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end">
              <DropdownMenuLabel>Filtrar Por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <div className="space-y-2 px-2 py-1.5">
                  <Label htmlFor="filterPsychologist">Psicólogo(a)</Label>
                  <Select
                    value={filters.psychologistId}
                    onValueChange={(value) => handleFilterChange("psychologistId", value)}
                  >
                    <SelectTrigger id="filterPsychologist">
                      <SelectValue placeholder="Selecione psicólogo(a)" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPsychologists.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 px-2 py-1.5">
                  <Label htmlFor="filterStatus">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange("status", value)}
                  >
                    <SelectTrigger id="filterStatus">
                      <SelectValue placeholder="Selecione status" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentStatuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 px-2 py-1.5">
                    <Label>Intervalo de Datas</Label>
                    <div className="flex gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    {filters.dateFrom ? format(filters.dateFrom, "P", {locale: ptBR}) : <span>De</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <CalendarComponent locale={ptBR} mode="single" selected={filters.dateFrom} onSelect={(date) => handleFilterChange("dateFrom", date)} initialFocus />
                            </PopoverContent>
                        </Popover>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    {filters.dateTo ? format(filters.dateTo, "P", {locale: ptBR}) : <span>Até</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <CalendarComponent locale={ptBR} mode="single" selected={filters.dateTo} onSelect={(date) => handleFilterChange("dateTo", date)} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

              </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Button className="w-full" size="sm" onClick={() => console.log("Aplicando filtros:", filters)}>Aplicar Filtros</Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-grow overflow-auto border rounded-lg shadow-sm bg-card">
        <AppointmentCalendar view={currentView} currentDate={currentDate} filters={filters} />
      </div>
    </div>
  );
}

