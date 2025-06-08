
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
// import { Calendar } from "@/components/ui/calendar"; // Shadcn calendar for date picking, not used for display here
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock, User, PlusCircle, Edit, Trash2, CheckCircle, AlertTriangle, XCircle, CalendarCog } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, getDay, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Mock data for appointments - expanded with psychologist and status
// Exportando para ser usado na página de edição
export const mockAppointments: AppointmentsByDate = {
  "2024-08-15": [
    { id: "appt1", time: "10:00", patient: "Alice Wonderland", type: "Consulta", psychologistId: "psy1", status: "Scheduled" },
    { id: "appt2", time: "14:00", patient: "Bob O Construtor", type: "Acompanhamento", psychologistId: "psy2", status: "Completed" },
  ],
  "2024-08-16": [
    { id: "appt3", time: "09:00", patient: "Autocuidado", type: "Blocked Slot", psychologistId: "psy1", status: "Blocked", blockReason: "Tempo Pessoal" },
  ],
  "2024-08-20": [
    { id: "appt4", time: "11:00", patient: "Charlie Brown", type: "Sessão de Terapia", psychologistId: "psy1", status: "Cancelled" },
  ],
   // Adicionando um agendamento para a data atual para facilitar o teste do popover
  [format(new Date(), "yyyy-MM-dd")]: [
    { id: "apptToday1", time: "15:00", patient: "Paciente Teste Hoje", type: "Consulta Teste", psychologistId: "psy1", status: "Scheduled"},
    ...(mockAppointments[format(new Date(), "yyyy-MM-dd")] || []) // Mantém outros agendamentos se existirem
  ]
};


type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled" | "Blocked" | "Confirmed";
export type Appointment = { 
  id: string;
  time: string; 
  patient: string; 
  type: string;
  psychologistId: string;
  status: AppointmentStatus;
  blockReason?: string;
};

type AppointmentsByDate = Record<string, Appointment[]>;

interface AppointmentCalendarProps {
    view: "Month" | "Week" | "Day";
    currentDate: Date;
    filters: {
        psychologistId: string;
        status: string;
        dateFrom?: Date;
        dateTo?: Date;
    };
}

const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
        case "Scheduled": return <Clock className="w-3 h-3 mr-1 inline-block text-blue-500" />;
        case "Confirmed": return <Clock className="w-3 h-3 mr-1 inline-block text-yellow-500" />;
        case "Completed": return <CheckCircle className="w-3 h-3 mr-1 inline-block text-green-500" />;
        case "Cancelled": return <XCircle className="w-3 h-3 mr-1 inline-block text-red-500" />;
        case "Blocked": return <AlertTriangle className="w-3 h-3 mr-1 inline-block text-gray-500" />;
        default: return <Clock className="w-3 h-3 mr-1 inline-block" />;
    }
};
const getStatusBadgeVariant = (status: AppointmentStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case "Completed": return "default";
        case "Scheduled": return "secondary";
        case "Confirmed": return "secondary"; // Could be a different color like yellow/orange
        case "Cancelled": return "destructive";
        case "Blocked": return "outline";
        default: return "outline";
    }
};

const getStatusLabel = (status: AppointmentStatus): string => {
    const labels: Record<AppointmentStatus, string> = {
        Scheduled: "Agendado",
        Completed: "Concluído",
        Cancelled: "Cancelado",
        Blocked: "Bloqueado",
        Confirmed: "Confirmado",
    };
    return labels[status] || status;
}


export default function AppointmentCalendar({ view, currentDate, filters }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);

  const filteredAppointments = useMemo(() => {
    const appointmentsResult: AppointmentsByDate = {};
    for (const dateKey in mockAppointments) { // Usar o mockAppointments diretamente
        appointmentsResult[dateKey] = (mockAppointments as AppointmentsByDate)[dateKey].filter(appt => {
            const matchesPsychologist = filters.psychologistId === "all" || appt.psychologistId === filters.psychologistId;
            const matchesStatus = filters.status === "All" || appt.status === filters.status;
            
            // Adicionando um offset de fuso horário para evitar problemas com datas
            const apptDateUTC = new Date(dateKey);
            const apptDate = new Date(apptDateUTC.getUTCFullYear(), apptDateUTC.getUTCMonth(), apptDateUTC.getUTCDate());

            const matchesDateFrom = !filters.dateFrom || apptDate >= new Date(new Date(filters.dateFrom).setUTCHours(0,0,0,0));
            const matchesDateTo = !filters.dateTo || apptDate <= new Date(new Date(filters.dateTo).setUTCHours(23,59,59,999));
            
            return matchesPsychologist && matchesStatus && matchesDateFrom && matchesDateTo;
        });
    }
    return appointmentsResult;
  }, [filters]);


  const getAppointmentsForDay = (dayDate: Date): Appointment[] => {
    const dateStr = format(dayDate, "yyyy-MM-dd");
    return filteredAppointments[dateStr] || [];
  };

  const renderDayCell = (dayDate: Date, isCurrentMonth: boolean, cellKey: string | number) => {
    const dayAppointments = getAppointmentsForDay(dayDate);
    const isSelected = selectedDate && isSameDay(dayDate, selectedDate);

    return (
      <Card 
        key={cellKey} 
        className={cn(
            "p-2 min-h-[100px] bg-card border-r border-b rounded-none shadow-none hover:bg-secondary/30 transition-colors flex flex-col",
            !isCurrentMonth && "bg-muted/30 text-muted-foreground",
            isSelected && "ring-2 ring-primary ring-inset"
        )}
        onClick={() => setSelectedDate(dayDate)}
      >
        <CardContent className="p-0 h-full flex flex-col flex-grow">
          <div className={cn("text-sm font-medium", isSelected ? 'text-primary font-bold' : 'text-foreground', !isCurrentMonth && 'opacity-60')}>
            {format(dayDate, "d")}
          </div>
          <div className="mt-1 space-y-1 text-xs overflow-y-auto flex-grow">
            {dayAppointments.map((appt) => (
              <Popover key={appt.id}>
                <PopoverTrigger asChild>
                   <Badge 
                     variant={getStatusBadgeVariant(appt.status)} 
                     className="w-full truncate block cursor-pointer py-1 text-xs"
                   >
                    {getStatusIcon(appt.status)}
                    {appt.time} - {appt.type === "Blocked Slot" ? appt.blockReason : appt.patient}
                   </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 shadow-lg rounded-lg">
                    <h4 className="font-semibold text-sm">{appt.type === "Blocked Slot" ? `Bloqueado: ${appt.blockReason}` : appt.patient}</h4>
                    <p className="text-xs text-muted-foreground">{appt.type}</p>
                    <p className="text-xs text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1 inline-block"/>{appt.time}</p>
                    <p className="text-xs text-muted-foreground flex items-center">{getStatusIcon(appt.status)} Status: {getStatusLabel(appt.status)}</p>
                    {appt.psychologistId && <p className="text-xs text-muted-foreground">Com: {appt.psychologistId === "psy1" ? "Dr. Silva" : "Dra. Jones"}</p> }
                    <div className="mt-3 flex gap-2">
                        <Button size="xs" variant="outline" asChild><Link href={`/schedule/edit/${appt.id}`}><Edit className="mr-1 h-3 w-3"/> Editar</Link></Button>
                        <Button size="xs" variant="destructive" className="bg-destructive/90 hover:bg-destructive text-destructive-foreground"><Trash2 className="mr-1 h-3 w-3"/> Excluir</Button>
                    </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
           <Button variant="ghost" size="icon" className="mt-auto ml-auto h-6 w-6 self-end opacity-30 hover:opacity-100">
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Adicionar agendamento</span>
            </Button>
        </CardContent>
      </Card>
    );
  };

  const renderMonthView = () => {
    // Ajuste para startOfWeek para respeitar o locale ptBR (semana começa na Segunda)
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthStart = startOfWeek(firstDayOfMonth, { locale: ptBR, weekStartsOn: 1 });
    
    // Ajuste para endOfWeek para respeitar o locale ptBR
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const monthEnd = endOfWeek(lastDayOfMonth, { locale: ptBR, weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const dayNames = Array.from({ length: 7 }, (_, i) => format(addDays(monthStart, i), "EEEEEE", { locale: ptBR }));


    return (
        <div className="grid grid-cols-7 gap-px bg-border border-l border-t flex-grow">
            {dayNames.map(dayName => (
              <div key={dayName} className="py-2 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b capitalize">{dayName}</div>
            ))}
            {days.map((day, index) => renderDayCell(day, isSameMonth(day, currentDate), index))}
        </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1, locale: ptBR }); 
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    return (
         <div className="grid grid-cols-7 gap-px bg-border border-l border-t flex-grow">
            {days.map(day => (
                <div key={day.toString()} className="py-2 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b capitalize">
                    {format(day, "EEE d", { locale: ptBR })}
                </div>
            ))}
            {days.map((day, index) => renderDayCell(day, true, `week-${index}`))}
        </div>
    );
  };

  const renderDayView = () => {
     return (
         <div className="flex flex-col gap-px bg-border border-l border-t flex-grow">
            <div className="py-2 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b capitalize">
                {format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </div>
            {renderDayCell(currentDate, true, "day-view")}
        </div>
    );
  };


  return (
    <div className="p-0 sm:p-1 md:p-2 h-full flex flex-col">
      {view === "Month" && renderMonthView()}
      {view === "Week" && renderWeekView()}
      {view === "Day" && renderDayView()}
    </div>
  );
}

