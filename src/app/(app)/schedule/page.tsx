
"use client";
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { CalendarDays, PlusCircle, ChevronLeft, ChevronRight, ListFilter, Download, ShieldAlert, MapPin } from "lucide-react"; // Adicionado MapPin
import Link from "next/link";
import AppointmentCalendar, { type AppointmentsByDate, getInitialMockAppointments } from "@/components/schedule/appointment-calendar";
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
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, parse, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { generateICS } from '@/lib/ics-generator';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card'; // Import Card

const mockPsychologists = [
  { id: "psy1", name: "Dr. Silva" },
  { id: "psy2", name: "Dra. Jones" },
  { id: "all", name: "Todos os Psicólogos" }, // Mantido para flexibilidade, mas a seleção será por calendário
];

const mockLocations = [
    { id: "loc1", name: "Unidade Central" },
    { id: "loc2", name: "Unidade Norte" },
    { id: "all", name: "Todos os Locais" },
];

const appointmentStatuses = [
    {value: "All", label: "Todos"},
    {value: "Scheduled", label: "Agendado"},
    {value: "Confirmed", label: "Confirmado"},
    {value: "Completed", label: "Realizada"},
    {value: "CancelledByPatient", label: "Cancelado (Paciente)"},
    {value: "CancelledByClinic", label: "Cancelado (Clínica)"},
    {value: "NoShow", label: "Falta"},
    {value: "Rescheduled", label: "Remarcado"},
    {value: "Blocked", label: "Bloqueado"}
] as const;

type AppointmentStatusFilter = typeof appointmentStatuses[number]["value"];

type IndividualScheduleFilters = {
  psychologistId: string;
  status: AppointmentStatusFilter;
};

type GlobalScheduleFilters = {
  locationId: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
};

// Mock: Simula a busca das configurações de dias de trabalho do usuário/clínica
const getMockUserWorkingDays = (): string[] => {
  return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
};


export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view1, setView1] = useState<"Week" | "Month" | "Day">("Week");
  const [view2, setView2] = useState<"Week" | "Month" | "Day">("Week");

  const [appointmentsData, setAppointmentsData] = useState<AppointmentsByDate>(() => getInitialMockAppointments());
  const { toast } = useToast();
  const [configuredWorkingDays, setConfiguredWorkingDays] = useState<string[]>([]);

  useEffect(() => {
    const userWorkingDays = getMockUserWorkingDays();
    setConfiguredWorkingDays(userWorkingDays);
  }, []);

  const [globalFilters, setGlobalFilters] = useState<GlobalScheduleFilters>({
    locationId: "all",
    dateFrom: undefined,
    dateTo: undefined,
  });

  const [filters1, setFilters1] = useState<IndividualScheduleFilters>({
    psychologistId: "psy1", // Default para o primeiro psicólogo
    status: "All",
  });

  const [filters2, setFilters2] = useState<IndividualScheduleFilters>({
    psychologistId: "psy2", // Default para o segundo psicólogo
    status: "All",
  });

  const handleGlobalFilterChange = <K extends keyof GlobalScheduleFilters>(
    filterName: K,
    value: GlobalScheduleFilters[K]
  ) => {
    setGlobalFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleFilter1Change = <K extends keyof IndividualScheduleFilters>(
    filterName: K,
    value: IndividualScheduleFilters[K]
  ) => {
    setFilters1(prev => ({ ...prev, [filterName]: value }));
  };
  
  const handleFilter2Change = <K extends keyof IndividualScheduleFilters>(
    filterName: K,
    value: IndividualScheduleFilters[K]
  ) => {
    setFilters2(prev => ({ ...prev, [filterName]: value }));
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    // A navegação de data afeta ambos os calendários, dependendo da visualização *global* (se houvesse uma)
    // ou da visualização do primeiro calendário como referência.
    // Para simplificar, usaremos a visualização do primeiro calendário para determinar o passo.
    const referenceView = view1; 
    if (referenceView === "Month") {
        newDate.setMonth(currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
    } else if (referenceView === "Week") {
        newDate.setDate(currentDate.getDate() + (direction === 'prev' ? -7 : 7));
    } else { 
        newDate.setDate(currentDate.getDate() + (direction === 'prev' ? -1 : 1));
    }
    setCurrentDate(newDate);
  };

  const displayGlobalDateRange = () => {
    // Esta função deve mostrar um range apropriado para a visualização principal/global.
    // Se as visualizações são independentes, pode ser apenas o mês/ano atual.
    const currentMonthYear = format(currentDate, 'MMMM yyyy', { locale: ptBR });
    return currentMonthYear.charAt(0).toUpperCase() + currentMonthYear.slice(1);
  }

  const handleAppointmentsUpdate = useCallback((updatedAppointments: AppointmentsByDate) => {
    setAppointmentsData(updatedAppointments);
  }, []);

  const handleExportICS = () => {
    // Lógica de exportação ICS precisará considerar os filtros de ambos os calendários
    // ou talvez exportar um calendário de cada vez, ou uma união.
    // Por agora, vamos simular uma exportação simples baseada no primeiro calendário e filtros globais.
    let appointmentsToExport: AppointmentsByDate = {};
    const dateKeys = Object.keys(appointmentsData);

    const viewForExport = view1; // ou view2, ou uma seleção
    const filtersForExport = filters1; // ou filters2

    if (viewForExport === "Day") {
        const dayKey = format(currentDate, "yyyy-MM-dd");
        if (appointmentsData[dayKey]) {
            appointmentsToExport[dayKey] = appointmentsData[dayKey];
        }
    } else if (viewForExport === "Week") {
        const weekSt = startOfWeek(currentDate, { weekStartsOn: 1, locale: ptBR });
        const weekEn = endOfWeek(currentDate, { weekStartsOn: 1, locale: ptBR });
        const weekDays = eachDayOfInterval({ start: weekSt, end: weekEn });
        weekDays.forEach(day => {
            const dayKey = format(day, "yyyy-MM-dd");
            if (appointmentsData[dayKey]) {
                appointmentsToExport[dayKey] = appointmentsData[dayKey];
            }
        });
    } else { // Month view
        const monthSt = startOfMonth(currentDate);
        const monthEn = endOfMonth(currentDate);
         dateKeys.forEach(dateKey => {
            const apptDate = parse(dateKey, 'yyyy-MM-dd', new Date());
            if (isWithinInterval(apptDate, { start: monthSt, end: monthEn })) {
                if (appointmentsData[dateKey]) {
                    appointmentsToExport[dateKey] = appointmentsData[dateKey];
                }
            }
        });
    }
    
    const finalAppointmentsToExport: AppointmentsByDate = {};
    for (const dateKey in appointmentsToExport) {
        finalAppointmentsToExport[dateKey] = (appointmentsToExport[dateKey] || []).filter(appt => {
            const matchesPsychologist = filtersForExport.psychologistId === "all" || appt.psychologistId === filtersForExport.psychologistId;
            const matchesStatus = filtersForExport.status === "All" || appt.status === filtersForExport.status;
            // Adicionar filtro de local se os dados do agendamento tiverem `locationId`
            // const matchesLocation = globalFilters.locationId === "all" || appt.locationId === globalFilters.locationId;
            return matchesPsychologist && matchesStatus; // && matchesLocation;
        });
         if (Object.keys(finalAppointmentsToExport[dateKey] || {}).length === 0) {
            delete finalAppointmentsToExport[dateKey];
        }
    }

    if (Object.keys(finalAppointmentsToExport).length === 0) {
      toast({ title: "Nenhum Agendamento", description: "Não há agendamentos para exportar com os filtros aplicados." });
      return;
    }

    const icsString = generateICS(finalAppointmentsToExport);
    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `thalamus_agenda_${viewForExport.toLowerCase()}_${format(currentDate, "yyyyMMdd")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Agenda Exportada", description: "O arquivo .ics foi baixado com sucesso." });
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-var(--header-height,4rem)-2rem)]">
      {/* Cabeçalho e Filtros Globais */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Agenda Comparativa</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/schedule/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Agendamento
          </Link>
        </Button>
      </div>

      <Card className="p-3 sm:p-4 border rounded-lg shadow-sm bg-card">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full xl:w-auto">
                <Button variant="outline" size="icon" onClick={() => navigateDate('prev')} aria-label="Visualização anterior da agenda"><ChevronLeft className="h-4 w-4" /></Button>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground min-w-[150px] sm:min-w-[200px] text-center capitalize">
                {displayGlobalDateRange()}
                </h2>
                <Button variant="outline" size="icon" onClick={() => navigateDate('next')} aria-label="Próxima visualização da agenda"><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Hoje</Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full xl:w-auto">
                <div className="min-w-[150px]">
                    <Select value={globalFilters.locationId} onValueChange={(value) => handleGlobalFilterChange("locationId", value)}>
                        <SelectTrigger className="h-9 text-xs sm:text-sm">
                            <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            <SelectValue placeholder="Filtrar Local" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockLocations.map(loc => <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <Button variant="outline" size="sm" onClick={handleExportICS} title="Exportar visualização atual para .ics" aria-label="Exportar visualização atual da agenda para arquivo ICS">
                    <Download className="mr-0 sm:mr-1 h-4 w-4" /> <span className="hidden sm:inline">Exportar</span>
                </Button>

                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Filtrar agendamentos (status/data)">
                    <ListFilter className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2" align="end">
                    <DropdownMenuLabel>Filtros Globais (Status/Data)</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Os filtros de status serão por calendário individual. Este pode ser para filtros de data */}
                     <DropdownMenuGroup>
                         <div className="space-y-2 px-2 py-1.5">
                            <Label>Intervalo de Datas (Geral)</Label>
                            <div className="flex gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal h-9 text-xs sm:text-sm">
                                            {globalFilters.dateFrom ? format(globalFilters.dateFrom, "P", {locale: ptBR}) : <span>De</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent locale={ptBR} mode="single" selected={globalFilters.dateFrom} onSelect={(date) => handleGlobalFilterChange("dateFrom", date)} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal h-9 text-xs sm:text-sm">
                                            {globalFilters.dateTo ? format(globalFilters.dateTo, "P", {locale: ptBR}) : <span>Até</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent locale={ptBR} mode="single" selected={globalFilters.dateTo} onSelect={(date) => handleGlobalFilterChange("dateTo", date)} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                     </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Button className="w-full" size="sm" onClick={() => { /* Aplicar filtros globais (se houver lógica backend) */ }}>Aplicar Filtros Data</Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
                 <Button variant="outline" size="sm" asChild>
                    <Link href={`/schedule/new?isBlockTime=true&date=${format(currentDate, 'yyyy-MM-dd')}`}>
                        <ShieldAlert className="mr-1.5 h-3.5 w-3.5" /> Bloquear Horário
                    </Link>
                 </Button>
            </div>
        </div>
      </Card>

      {/* Área dos Calendários */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-hidden">
        {/* Calendário 1 */}
        <div className="flex flex-col border rounded-lg shadow-sm bg-card overflow-hidden">
          <div className="p-2 border-b flex flex-col sm:flex-row items-center justify-between gap-2">
            <Select value={filters1.psychologistId} onValueChange={(value) => handleFilter1Change("psychologistId", value)}>
              <SelectTrigger className="h-9 text-xs sm:text-sm w-full sm:w-auto flex-grow-[2]">
                <SelectValue placeholder="Profissional 1" />
              </SelectTrigger>
              <SelectContent>
                {mockPsychologists.filter(p=>p.id !== 'all').map(p => <SelectItem key={`p1-${p.id}`} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex items-center rounded-md border overflow-hidden">
              <Button variant={view1 === "Day" ? "secondary" : "ghost"} size="sm" onClick={() => setView1("Day")} className="rounded-none border-r h-9 text-xs">Dia</Button>
              <Button variant={view1 === "Week" ? "secondary" : "ghost"} size="sm" onClick={() => setView1("Week")} className="rounded-none border-r h-9 text-xs">Semana</Button>
              <Button variant={view1 === "Month" ? "secondary" : "ghost"} size="sm" onClick={() => setView1("Month")} className="rounded-none h-9 text-xs">Mês</Button>
            </div>
          </div>
           <div className="p-2 border-b">
             <Select value={filters1.status} onValueChange={(value) => handleFilter1Change("status", value as AppointmentStatusFilter)}>
                <SelectTrigger className="h-9 text-xs sm:text-sm">
                    <SelectValue placeholder="Status Agds." />
                </SelectTrigger>
                <SelectContent>
                    {appointmentStatuses.map(s => <SelectItem key={`s1-${s.value}`} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
            </Select>
           </div>
          <div className="flex-grow overflow-auto">
            <AppointmentCalendar
              view={view1}
              currentDate={currentDate}
              filters={{...filters1, ...globalFilters, dateFrom: undefined, dateTo: undefined}} // Pass individual + relevant global filters
              workingDaysOfWeek={configuredWorkingDays}
              onAppointmentsUpdate={handleAppointmentsUpdate}
            />
          </div>
        </div>

        {/* Calendário 2 */}
        <div className="flex flex-col border rounded-lg shadow-sm bg-card overflow-hidden">
          <div className="p-2 border-b flex flex-col sm:flex-row items-center justify-between gap-2">
             <Select value={filters2.psychologistId} onValueChange={(value) => handleFilter2Change("psychologistId", value)}>
              <SelectTrigger className="h-9 text-xs sm:text-sm w-full sm:w-auto flex-grow-[2]">
                <SelectValue placeholder="Profissional 2" />
              </SelectTrigger>
              <SelectContent>
                {mockPsychologists.filter(p=>p.id !== 'all').map(p => <SelectItem key={`p2-${p.id}`} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex items-center rounded-md border overflow-hidden">
              <Button variant={view2 === "Day" ? "secondary" : "ghost"} size="sm" onClick={() => setView2("Day")} className="rounded-none border-r h-9 text-xs">Dia</Button>
              <Button variant={view2 === "Week" ? "secondary" : "ghost"} size="sm" onClick={() => setView2("Week")} className="rounded-none border-r h-9 text-xs">Semana</Button>
              <Button variant={view2 === "Month" ? "secondary" : "ghost"} size="sm" onClick={() => setView2("Month")} className="rounded-none h-9 text-xs">Mês</Button>
            </div>
          </div>
           <div className="p-2 border-b">
             <Select value={filters2.status} onValueChange={(value) => handleFilter2Change("status", value as AppointmentStatusFilter)}>
                <SelectTrigger className="h-9 text-xs sm:text-sm">
                    <SelectValue placeholder="Status Agds." />
                </SelectTrigger>
                <SelectContent>
                    {appointmentStatuses.map(s => <SelectItem key={`s2-${s.value}`} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
            </Select>
           </div>
          <div className="flex-grow overflow-auto">
            <AppointmentCalendar
              view={view2}
              currentDate={currentDate}
              filters={{...filters2, ...globalFilters, dateFrom: undefined, dateTo: undefined}} // Pass individual + relevant global filters
              workingDaysOfWeek={configuredWorkingDays}
              onAppointmentsUpdate={handleAppointmentsUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
