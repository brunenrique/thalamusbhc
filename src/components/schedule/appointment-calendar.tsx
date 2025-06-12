
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock, User, PlusCircle, Edit, Trash2, CheckCircle, AlertTriangle, XCircle, Check, Ban, UserCheck, UserX, RepeatIcon } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, isSameMonth, isSameDay, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from "@/shared/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Appointment, AppointmentsByDate, AppointmentStatus } from "@/types/appointment";

const mockPsychologists = [
  { id: "psy1", name: "Dr. Silva" },
  { id: "psy2", name: "Dra. Jones" },
  { id: "all", name: "Todos os Psicólogos" },
];

const baseMockAppointments: AppointmentsByDate = {
  "2024-08-15": [
    { id: "appt1", startTime: "10:00", endTime: "11:00", patient: "Alice Wonderland", type: "Consulta", psychologistId: "psy1", status: "Confirmed", notes: "Sessão inicial com Alice." },
    { id: "appt2", startTime: "14:00", endTime: "15:00", patient: "Bob O Construtor", type: "Acompanhamento", psychologistId: "psy2", status: "Completed", notes: "Revisão de progresso." },
  ],
  "2024-08-16": [
    { id: "appt3", startTime: "09:00", endTime: "10:00", patient: "Autocuidado", type: "Blocked Slot", psychologistId: "psy1", status: "Blocked", blockReason: "Tempo Pessoal" },
  ],
  "2024-08-20": [
    { id: "appt4", startTime: "11:00", endTime: "12:00", patient: "Charlie Brown", type: "Sessão de Terapia", psychologistId: "psy1", status: "CancelledByPatient" },
  ],
};

export const getInitialMockAppointments = (): AppointmentsByDate => {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayAppointments = [
    { id: "apptToday1", startTime: "15:00", endTime: "16:00", patient: "Paciente Teste Hoje", type: "Consulta Teste", psychologistId: "psy1", status: "Scheduled" as AppointmentStatus, notes: "Consulta de rotina."},
    { id: "apptToday2", startTime: "17:00", endTime: "17:30", patient: "Diana Prince", type: "Revisão", psychologistId: "psy2", status: "NoShow" as AppointmentStatus}
  ];
  const initialData = JSON.parse(JSON.stringify(baseMockAppointments));
  if (initialData[todayStr]) {
    initialData[todayStr] = [...initialData[todayStr], ...todayAppointments];
  } else {
    initialData[todayStr] = [...todayAppointments];
  }
  const aFewDaysAgo = format(subDays(new Date(), 3), "yyyy-MM-dd");
  if (!initialData[aFewDaysAgo]) initialData[aFewDaysAgo] = [];
  initialData[aFewDaysAgo] = [...initialData[aFewDaysAgo], { id: "apptOld1", startTime: "10:30", endTime: "11:30", patient: "Old Patient", type: "Follow-up", psychologistId: "psy1", status: "Completed"}];
  const aFewDaysAhead = format(addDays(new Date(), 3), "yyyy-MM-dd");
   if (!initialData[aFewDaysAhead]) initialData[aFewDaysAhead] = [];
  initialData[aFewDaysAhead] = [...initialData[aFewDaysAhead], { id: "apptFuture1", startTime: "16:00", endTime: "17:00", patient: "Future Patient", type: "Initial Consultation", psychologistId: "psy2", status: "Confirmed"}];
  return initialData;
};

const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
        case "Scheduled": return <Clock className="w-3 h-3 mr-1 inline-block text-inherit" />;
        case "Confirmed": return <UserCheck className="w-3 h-3 mr-1 inline-block text-inherit" />;
        case "Completed": return <CheckCircle className="w-3 h-3 mr-1 inline-block text-inherit" />;
        case "CancelledByPatient": return <UserX className="w-3 h-3 mr-1 inline-block text-inherit" />;
        case "CancelledByClinic": return <Ban className="w-3 h-3 mr-1 inline-block text-inherit" />;
        case "Blocked": return <AlertTriangle className="w-3 h-3 mr-1 inline-block text-inherit" />;
        case "NoShow": return <UserX className="w-3 h-3 mr-1 inline-block text-inherit" />;
        case "Rescheduled": return <RepeatIcon className="w-3 h-3 mr-1 inline-block text-inherit" />;
        default: return <Clock className="w-3 h-3 mr-1 inline-block text-inherit" />;
    }
};

const getStatusLabel = (status: AppointmentStatus): string => {
    const labels: Record<AppointmentStatus, string> = {
        Scheduled: "Agendado",
        Completed: "Realizada",
        CancelledByPatient: "Cancelado (Paciente)",
        CancelledByClinic: "Cancelado (Clínica)",
        Blocked: "Bloqueado",
        Confirmed: "Confirmado",
        NoShow: "Falta",
        Rescheduled: "Remarcado",
    };
    return labels[status] || status;
}

interface AppointmentCalendarProps {
  view: "Month" | "Week" | "Day";
  currentDate: Date;
  filters: {
    psychologistId: string;
    status: string;
    dateFrom?: Date;
    dateTo?: Date;
  };
  onAppointmentsUpdate?: (appointments: AppointmentsByDate) => void;
}

function AppointmentCalendarComponent({ view, currentDate, filters, onAppointmentsUpdate }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);
  const [appointmentsState, setAppointmentsState] = useState<AppointmentsByDate>(() => getInitialMockAppointments());
  const { toast } = useToast();
  
  useEffect(() => {
    setAppointmentsState(getInitialMockAppointments());
  }, []);

  const filteredAppointments = useMemo(() => {
    const appointmentsResult: AppointmentsByDate = {};
    for (const dateKey in appointmentsState) { 
        const dateAppointments = appointmentsState[dateKey] || [];
        appointmentsResult[dateKey] = dateAppointments.filter(appt => {
            const matchesPsychologist = filters.psychologistId === "all" || appt.psychologistId === filters.psychologistId;
            const matchesStatus = filters.status === "All" || appt.status === filters.status;
            const apptDateUTC = parse(dateKey, "yyyy-MM-dd", new Date());
            const apptDate = new Date(apptDateUTC.getUTCFullYear(), apptDateUTC.getUTCMonth(), apptDateUTC.getUTCDate());
            const matchesDateFrom = !filters.dateFrom || apptDate >= new Date(new Date(filters.dateFrom).setUTCHours(0,0,0,0));
            const matchesDateTo = !filters.dateTo || apptDate <= new Date(new Date(filters.dateTo).setUTCHours(23,59,59,999));
            return matchesPsychologist && matchesStatus && matchesDateFrom && matchesDateTo;
        }).sort((a, b) => a.startTime.localeCompare(b.startTime)); 
    }
    return appointmentsResult;
  }, [filters, appointmentsState]);

  const getAppointmentsForDay = useCallback((dayDate: Date): Appointment[] => {
    const dateStr = format(dayDate, "yyyy-MM-dd");
    return filteredAppointments[dateStr] || [];
  }, [filteredAppointments]);

  const handleDeleteAppointment = useCallback((appointmentId: string, appointmentPatient: string, dayDate: Date) => {
    const dateStr = format(dayDate, "yyyy-MM-dd");
    setAppointmentsState(prev => {
        const updatedAppointmentsForDate = (prev[dateStr] || []).filter(appt => appt.id !== appointmentId);
        const newState = { ...prev, [dateStr]: updatedAppointmentsForDate };
        if (onAppointmentsUpdate) onAppointmentsUpdate(newState);
        return newState;
    });
    toast({ title: "Agendamento Excluído", description: `O agendamento de ${appointmentPatient} foi excluído.` });
  }, [onAppointmentsUpdate, toast]);

  const handleUpdateStatus = useCallback((appointment: Appointment, newStatus: AppointmentStatus, dayDate: Date) => {
    const dateStr = format(dayDate, "yyyy-MM-dd");
    setAppointmentsState(prev => {
        const updatedAppointmentsForDate = (prev[dateStr] || []).map(appt => 
            appt.id === appointment.id ? { ...appt, status: newStatus } : appt
        );
        const newState = { ...prev, [dateStr]: updatedAppointmentsForDate };
        if (onAppointmentsUpdate) onAppointmentsUpdate(newState);
        return newState;
    });
    toast({ title: "Status Atualizado", description: `Status de ${appointment.patient} alterado para ${getStatusLabel(newStatus)}.` });
  }, [onAppointmentsUpdate, toast]);

  const renderDayCell = useCallback((dayDate: Date, isCurrentMonth: boolean, cellKey: string | number) => {
    const dayAppointments = getAppointmentsForDay(dayDate);
    const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
    const isToday = isSameDay(dayDate, new Date());

    return (
      <Card 
        key={cellKey} 
        className={cn(
            "p-2 min-h-[120px] bg-card border-r border-b rounded-none shadow-none hover:bg-secondary/30 transition-colors flex flex-col",
            !isCurrentMonth && "bg-muted/30 text-muted-foreground",
            isSelected && "ring-2 ring-primary ring-inset",
            isToday && !isSelected && "bg-accent/10 border-accent" 
        )}
        onClick={() => setSelectedDate(dayDate)}
      >
        <CardContent className="p-0 h-full flex flex-col flex-grow">
          <div className={cn("text-sm font-medium text-center rounded-full w-6 h-6 flex items-center justify-center mb-1 self-start", 
            isSelected ? 'bg-primary text-primary-foreground font-bold' : 'text-foreground', 
            isToday && !isSelected && 'bg-accent text-accent-foreground',
            !isCurrentMonth && 'opacity-60'
          )}>
            {format(dayDate, "d")}
          </div>
          <div className="mt-1 space-y-1 text-xs overflow-y-auto flex-grow">
            {dayAppointments.map((appt) => (
              <Popover key={appt.id}>
                <PopoverTrigger asChild>
                  <div
                    className={cn(
                      "w-full p-1.5 rounded cursor-pointer text-[0.7rem] shadow-sm transition-colors leading-tight",
                      "flex items-center gap-1",
                      appt.status === "Blocked" ? "bg-muted/70 text-muted-foreground hover:bg-muted" :
                      appt.status === "Completed" ? "bg-green-500/10 text-green-700 dark:text-green-300 dark:bg-green-700/20 hover:bg-green-500/20 dark:hover:bg-green-700/30" :
                      appt.status === "Scheduled" || appt.status === "Confirmed" ? "bg-accent/10 text-accent-foreground hover:bg-accent/20" :
                      appt.status === "CancelledByPatient" || appt.status === "CancelledByClinic" || appt.status === "NoShow" ? "bg-destructive/10 text-destructive dark:text-destructive-foreground/70 dark:bg-destructive/20 hover:bg-destructive/20 dark:hover:bg-destructive/30" :
                      "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    )}
                  >
                    {getStatusIcon(appt.status)}
                    <div className="flex-grow truncate">
                      <span className="font-semibold">{appt.startTime}</span>
                      <span className="ml-1">
                        {appt.type === "Blocked Slot" ? `Bloq: ${appt.blockReason}` : appt.patient}
                      </span>
                      {filters.psychologistId === "all" && appt.psychologistId && appt.type !== "Blocked Slot" && (
                        <span className="text-[0.65rem] opacity-80 ml-0.5">
                          ({mockPsychologists.find(p => p.id === appt.psychologistId)?.name.match(/\b(\w)/g)?.join('') || '??'})
                        </span>
                      )}
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3 shadow-lg rounded-lg">
                    <h4 className="font-semibold text-sm mb-0.5">{appt.type === "Blocked Slot" ? `Bloqueado: ${appt.blockReason}` : appt.patient}</h4>
                    <p className="text-xs text-muted-foreground mb-0.5">{appt.type}</p>
                    <p className="text-xs text-muted-foreground flex items-center mb-0.5"><Clock className="w-3 h-3 mr-1 inline-block"/>{appt.startTime} - {appt.endTime}</p>
                    <p className="text-xs text-muted-foreground flex items-center mb-2">{getStatusIcon(appt.status)} Status: {getStatusLabel(appt.status)}</p>
                    {appt.psychologistId && <p className="text-xs text-muted-foreground mb-2">Com: {mockPsychologists.find(p => p.id === appt.psychologistId)?.name || appt.psychologistId}</p> }
                    {appt.notes && <p className="text-xs text-muted-foreground mb-2">Notas: {appt.notes}</p>}
                    <div className="flex gap-2 mb-2">
                        <Button size="xs" variant="outline" asChild><Link href={`/schedule/edit/${appt.id}`}><Edit className="mr-1 h-3 w-3"/> Editar</Link></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="xs" variant="destructive" className="bg-destructive/90 hover:bg-destructive text-destructive-foreground"><Trash2 className="mr-1 h-3 w-3"/> Excluir</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>Tem certeza que deseja excluir o agendamento de {appt.patient} às {appt.startTime} em {format(dayDate, "P", { locale: ptBR })}? Esta ação não pode ser desfeita.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAppointment(appt.id, appt.patient, dayDate)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    {appt.type !== "Blocked Slot" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button size="xs" variant="outline" className="w-full"><Check className="mr-1 h-3 w-3" /> Marcar Status</Button></DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Atualizar Status</DropdownMenuLabel><DropdownMenuSeparator />
                          {(["Scheduled", "Confirmed", "Completed", "NoShow", "Rescheduled", "CancelledByPatient", "CancelledByClinic"] as AppointmentStatus[]).map(statusOpt => (
                            <DropdownMenuItem key={statusOpt} onClick={() => handleUpdateStatus(appt, statusOpt, dayDate)} disabled={appt.status === statusOpt}>
                              {getStatusIcon(statusOpt)} {getStatusLabel(statusOpt)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </PopoverContent>
              </Popover>
            ))}
          </div>
           <Button variant="ghost" size="icon" className="mt-auto ml-auto h-6 w-6 self-end opacity-30 hover:opacity-100" asChild>
              <Link href={`/schedule/new?date=${format(dayDate, "yyyy-MM-dd")}`}><PlusCircle className="h-4 w-4" /><span className="sr-only">Adicionar agendamento</span></Link>
            </Button>
        </CardContent>
      </Card>
    );
  }, [getAppointmentsForDay, selectedDate, filters.psychologistId, handleDeleteAppointment, handleUpdateStatus]); 

  const renderMonthView = useCallback(() => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthStart = startOfWeek(firstDayOfMonth, { locale: ptBR, weekStartsOn: 1 });
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const monthEnd = endOfWeek(lastDayOfMonth, { locale: ptBR, weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const dayNames = Array.from({ length: 7 }, (_, i) => format(addDays(monthStart, i), "EEEEEE", { locale: ptBR }));

    return (
        <div className="grid grid-cols-7 gap-px bg-border border-l border-t flex-grow">
            {dayNames.map(dayName => (<div key={dayName} className="py-2 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b capitalize">{dayName}</div>))}
            {days.map((day, index) => renderDayCell(day, isSameMonth(day, currentDate), index))}
        </div>
    );
  }, [currentDate, renderDayCell]);

  const renderWeekView = useCallback(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1, locale: ptBR }); 
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    return (
         <div className="grid grid-cols-7 gap-px bg-border border-l border-t flex-grow">
            {days.map(day => (<div key={day.toString()} className="py-2 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b capitalize">{format(day, "EEE d", { locale: ptBR })}</div>))}
            {days.map((day, index) => renderDayCell(day, true, `week-${index}`))}
        </div>
    );
  }, [currentDate, renderDayCell]);

  const renderDayView = useCallback(() => {
     return (
         <div className="flex flex-col gap-px bg-border border-l border-t flex-grow">
            <div className="py-2 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b capitalize">{format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}</div>
            {renderDayCell(currentDate, true, "day-view")}
        </div>
    );
  }, [currentDate, renderDayCell]);

  return (
    <div className="p-0 sm:p-1 md:p-2 h-full flex flex-col">
      {view === "Month" && renderMonthView()}
      {view === "Week" && renderWeekView()}
      {view === "Day" && renderDayView()}
    </div>
  );
}

const AppointmentCalendar = React.memo(AppointmentCalendarComponent);
export default AppointmentCalendar;
