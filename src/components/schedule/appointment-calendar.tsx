
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock, User, PlusCircle, Edit, Trash2, FileText, CheckCircle, AlertTriangle, XCircle, Check, Ban, UserCheck, UserX, RepeatIcon, GripVertical, CalendarX2, Users as UsersIcon } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, isSameMonth, isSameDay, parse, getDay, parseISO } from 'date-fns';
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
import InfoDisplay from '@/components/ui/info-display';
import { mockTherapeuticGroups } from '@/app/(app)/groups/page'; // Import mock group data
import type { Group as TherapeuticGroup } from '@/app/(app)/groups/[id]/page'; // Import Group type


const mockPsychologists = [
  { id: "psy1", name: "Dr. Silva" },
  { id: "psy2", name: "Dra. Jones" },
  { id: "all", name: "Todos os Psicólogos" },
];

const baseMockAppointments: AppointmentsByDate = {
  "2024-08-15": [
    { id: "appt1", patientId: "1", startTime: "10:00", endTime: "11:00", patient: "Alice Wonderland", type: "Consulta", psychologistId: "psy1", status: "Confirmed", notes: "Sessão inicial com Alice." },
    { id: "appt2", patientId: "2", startTime: "14:00", endTime: "15:00", patient: "Bob O Construtor", type: "Acompanhamento", psychologistId: "psy2", status: "Completed", notes: "Revisão de progresso." },
  ],
  "2024-08-16": [
    { id: "appt3", startTime: "09:00", endTime: "10:00", patient: "Autocuidado", type: "Blocked Slot", psychologistId: "psy1", status: "Blocked", blockReason: "Tempo Pessoal" },
  ],
  "2024-08-20": [
    { id: "appt4", patientId: "3", startTime: "11:00", endTime: "12:00", patient: "Charlie Brown", type: "Sessão de Terapia", psychologistId: "psy1", status: "CancelledByPatient" },
  ],
};

export const getInitialMockAppointments = (): AppointmentsByDate => {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayAppointments = [
    { id: "apptToday1", patientId: "apptToday1", startTime: "15:00", endTime: "16:00", patient: "Paciente Teste Hoje", type: "Consulta Teste", psychologistId: "psy1", status: "Scheduled" as AppointmentStatus, notes: "Consulta de rotina."},
    { id: "apptToday2", patientId: "4", startTime: "17:00", endTime: "17:30", patient: "Diana Prince", type: "Revisão", psychologistId: "psy2", status: "NoShow" as AppointmentStatus}
  ];
  const initialData = JSON.parse(JSON.stringify(baseMockAppointments));
  if (initialData[todayStr]) {
    initialData[todayStr] = [...initialData[todayStr], ...todayAppointments];
  } else {
    initialData[todayStr] = [...todayAppointments];
  }
  const aFewDaysAgo = format(subDays(new Date(), 3), "yyyy-MM-dd");
  if (!initialData[aFewDaysAgo]) initialData[aFewDaysAgo] = [];
  initialData[aFewDaysAgo] = [...initialData[aFewDaysAgo], { id: "apptOld1", patientId: "apptOld1", startTime: "10:30", endTime: "11:30", patient: "Old Patient", type: "Follow-up", psychologistId: "psy1", status: "Completed"}];
  const aFewDaysAhead = format(addDays(new Date(), 3), "yyyy-MM-dd");
   if (!initialData[aFewDaysAhead]) initialData[aFewDaysAhead] = [];
  initialData[aFewDaysAhead] = [...initialData[aFewDaysAhead], { id: "apptFuture1", patientId: "apptFuture1", startTime: "16:00", endTime: "17:00", patient: "Future Patient", type: "Initial Consultation", psychologistId: "psy2", status: "Confirmed"}];
  return initialData;
};

const dayOfWeekMapping: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
};

const getStatusStyles = (status: AppointmentStatus, isGroupSession?: boolean): string => {
    if (isGroupSession) {
      return "bg-purple-500/15 text-purple-700 dark:text-purple-300 hover:bg-purple-500/25 border-l-4 border-purple-500";
    }
    switch (status) {
        case "Scheduled":
        case "Confirmed":
            return "bg-accent/15 text-accent-foreground hover:bg-accent/25 border-l-4 border-accent";
        case "Completed":
            return "bg-primary/15 text-primary-foreground hover:bg-primary/25 border-l-4 border-primary";
        case "Blocked":
            return "bg-muted/70 text-muted-foreground hover:bg-muted border-l-4 border-slate-400";
        case "CancelledByPatient":
        case "CancelledByClinic":
        case "NoShow":
            return "bg-destructive/10 text-destructive-foreground hover:bg-destructive/20 border-l-4 border-destructive";
        case "Rescheduled":
            return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 dark:bg-yellow-700/25 hover:bg-yellow-500/25 dark:hover:bg-yellow-700/35 border-l-4 border-yellow-500";
        default:
            return "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 border-l-4 border-slate-300";
    }
};

const getStatusIcon = (status: AppointmentStatus, className: string = "w-3.5 h-3.5 mr-1.5 inline-block", isGroupSession?: boolean) => {
    if (isGroupSession) {
      return <UsersIcon className={cn(className, "text-purple-600/80 dark:text-purple-400/80")} />;
    }
    switch (status) {
        case "Scheduled": return <Clock className={cn(className, "text-accent-foreground/80")} />;
        case "Confirmed": return <UserCheck className={cn(className, "text-accent-foreground/80")} />;
        case "Completed": return <CheckCircle className={cn(className, "text-primary-foreground/80")} />;
        case "CancelledByPatient": return <UserX className={cn(className, "text-destructive-foreground/80")} />;
        case "CancelledByClinic": return <Ban className={cn(className, "text-destructive-foreground/80")} />;
        case "Blocked": return <AlertTriangle className={cn(className, "text-muted-foreground/80")} />;
        case "NoShow": return <UserX className={cn(className, "text-destructive-foreground/80")} />;
        case "Rescheduled": return <RepeatIcon className={cn(className, "text-yellow-600/80 dark:text-yellow-400/80")} />;
        default: return <Clock className={cn(className, "text-slate-500/80")} />;
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

const getDayIdFromDate = (date: Date): string => {
  const dayIndex = getDay(date);
  const ids = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return ids[dayIndex];
};

interface AppointmentCalendarProps {
  view: "Month" | "Week" | "Day";
  currentDate: Date;
  filters: {
    psychologistId: string;
    status: string;
    dateFrom?: Date;
    dateTo?: Date;
  };
  workingDaysOfWeek?: string[];
  onAppointmentsUpdate?: (appointments: AppointmentsByDate) => void;
}

const defaultWorkingDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];


function AppointmentCalendarComponent({ view, currentDate, filters, workingDaysOfWeek = defaultWorkingDays, onAppointmentsUpdate }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);
  const [appointmentsState, setAppointmentsState] = useState<AppointmentsByDate>(() => getInitialMockAppointments());
  const { toast } = useToast();

  useEffect(() => {
    setAppointmentsState(getInitialMockAppointments());
  }, []);

  const getAppointmentsForDay = useCallback((dayDate: Date): Appointment[] => {
    const dateStr = format(dayDate, "yyyy-MM-dd");
    const dayJsIndex = dayDate.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const individualAppointments = (appointmentsState[dateStr] || []).filter(appt => {
      const matchesPsychologist = filters.psychologistId === "all" || appt.psychologistId === filters.psychologistId;
      const matchesStatus = filters.status === "All" || appt.status === filters.status;
      const apptDateObj = parse(dateStr, "yyyy-MM-dd", new Date());
      const matchesDateFrom = !filters.dateFrom || apptDateObj >= new Date(new Date(filters.dateFrom).setUTCHours(0,0,0,0));
      const matchesDateTo = !filters.dateTo || apptDateObj <= new Date(new Date(filters.dateTo).setUTCHours(23,59,59,999));
      return matchesPsychologist && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    const groupSessionsForDay: Appointment[] = mockTherapeuticGroups
      .filter(group => {
        const groupDayIndex = dayOfWeekMapping[group.dayOfWeek.toLowerCase()];
        const matchesPsychologist = filters.psychologistId === "all" || group.psychologistId === filters.psychologistId;
        // For status filter, group sessions are typically always 'Scheduled' or a similar active state unless explicitly cancelled.
        // If a specific "GroupSession" status is introduced, filter by it. For now, "All" or "Scheduled" would include them.
        const matchesStatus = filters.status === "All" || filters.status === "Scheduled"; // Adjust if group sessions have other statuses
        return groupDayIndex === dayJsIndex && matchesPsychologist && matchesStatus;
      })
      .map(group => ({
        id: `group-${group.id}-${dateStr}`,
        startTime: group.startTime,
        endTime: group.endTime,
        patient: group.name, // Group name as patient for display
        type: "Sessão em Grupo",
        psychologistId: group.psychologistId,
        status: "Scheduled" as AppointmentStatus, // Or a specific "GroupSession" status
        isGroupSession: true,
        groupId: group.id,
        blockReason: group.name, // For conflict detection
        notes: group.meetingAgenda ? `Roteiro: ${group.meetingAgenda.substring(0, 50)}...` : undefined,
      }));

    return [...individualAppointments, ...groupSessionsForDay].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointmentsState, filters]);


  const handleDeleteAppointment = useCallback((appointmentId: string, appointmentPatient: string, dayDate: Date) => {
    if (appointmentId.startsWith('group-')) {
        toast({ title: "Ação Não Permitida", description: "Sessões de grupo são gerenciadas na página de Grupos.", variant: "default" });
        return;
    }
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
    if (appointment.isGroupSession) {
        toast({ title: "Ação Não Permitida", description: "Status de sessões de grupo não pode ser alterado aqui.", variant: "default" });
        return;
    }
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

  const renderDayCell = useCallback((dayDate: Date, isCurrentMonthView: boolean, cellKey: string | number) => {
    const dayAppointments = getAppointmentsForDay(dayDate);
    const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
    const isToday = isSameDay(dayDate, new Date());
    const dayId = getDayIdFromDate(dayDate);
    const isWorkingDay = workingDaysOfWeek.includes(dayId);

    if (view === "Day" && !isWorkingDay) {
       return (
         <Card
            key={cellKey}
            className="p-2 min-h-[120px] bg-muted/50 border-r border-b rounded-none shadow-none flex flex-col items-center justify-center text-center group relative"
        >
            <CardContent className="p-0 h-full flex flex-col flex-grow items-center justify-center">
                <CalendarX2 className="w-12 h-12 text-muted-foreground mb-2" />
                <p className="font-semibold text-muted-foreground">Dia não trabalhado</p>
                <p className="text-xs text-muted-foreground">{format(dayDate, "EEEE", { locale: ptBR })}</p>
            </CardContent>
         </Card>
       );
    }

    return (
      <Card
        key={cellKey}
        className={cn(
            "p-2 min-h-[120px] border-r border-b rounded-none shadow-none hover:bg-secondary/20 transition-colors flex flex-col group relative",
            !isCurrentMonthView && view === "Month" && "bg-muted/30 text-muted-foreground/50",
            !isWorkingDay && view !== "Day" && "bg-muted/40 text-muted-foreground/60", // Adjusted for Day view
            isSelected && isWorkingDay && "ring-2 ring-accent ring-inset",
            isToday && isWorkingDay && !isSelected && "bg-accent/5 border-accent/30",
            (!isWorkingDay || (!isCurrentMonthView && view === "Month")) && view !== "Day" && "pointer-events-none"
        )}
        onClick={() => isWorkingDay && setSelectedDate(dayDate)}
      >
        <CardContent className="p-0 h-full flex flex-col flex-grow">
          <div className={cn("text-sm font-medium text-center rounded-full w-6 h-6 flex items-center justify-center mb-1 self-start",
            isSelected && isWorkingDay ? 'bg-accent text-accent-foreground font-bold' : 'text-foreground',
            isToday && isWorkingDay && !isSelected && 'bg-accent/60 text-accent-foreground',
            (!isCurrentMonthView || !isWorkingDay) && view === "Month" && 'opacity-50'
          )}>
            {format(dayDate, "d")}
          </div>
          {isWorkingDay ? (
            <>
              <div className="mt-1 space-y-1 text-xs overflow-y-auto flex-grow">
                {dayAppointments.map((appt) => (
                  <Popover key={appt.id}>
                    <PopoverTrigger asChild>
                      <div
                        className={cn(
                          "w-full p-1.5 rounded cursor-pointer shadow-sm transition-all leading-tight",
                          "flex items-center gap-1.5 text-xs",
                          getStatusStyles(appt.status, appt.isGroupSession)
                        )}
                      >
                        {getStatusIcon(appt.status, "w-3 h-3 mr-1", appt.isGroupSession)}
                        <div className="flex-grow truncate">
                          <span className="font-semibold">{appt.startTime}</span>
                          <span className="ml-1">
                            {appt.type === "Blocked Slot" ? `Bloqueio: ${appt.blockReason || 'Motivo não especificado'}` : appt.patient}
                          </span>
                          {filters.psychologistId === "all" && appt.psychologistId && appt.type !== "Blocked Slot" && !appt.isGroupSession && (
                            <span className="text-[0.65rem] opacity-80 ml-0.5">
                              ({mockPsychologists.find(p => p.id === appt.psychologistId)?.name.match(/\b(\w)/g)?.join('') || '??'})
                            </span>
                          )}
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0 shadow-xl rounded-lg border bg-popover">
                        <div className="p-4 space-y-2">
                            <h4 className="font-headline text-md">{appt.type === "Blocked Slot" ? `Horário Bloqueado: ${appt.blockReason}` : appt.patient}</h4>
                            <InfoDisplay label="Tipo" value={appt.type} icon={appt.isGroupSession ? UsersIcon : GripVertical} className="p-0 bg-transparent"/>
                            <InfoDisplay label="Horário" value={`${appt.startTime} - ${appt.endTime}`} icon={Clock} className="p-0 bg-transparent"/>
                            <InfoDisplay label="Status" value={getStatusLabel(appt.status)} icon={() => getStatusIcon(appt.status, "w-4 h-4 mr-1", appt.isGroupSession)} className="p-0 bg-transparent"/>
                            {appt.psychologistId && <InfoDisplay label="Com" value={mockPsychologists.find(p => p.id === appt.psychologistId)?.name || appt.psychologistId} icon={User} className="p-0 bg-transparent"/> }
                            {appt.notes && !appt.isGroupSession && <InfoDisplay label="Notas" value={appt.notes} icon={Edit} className="p-0 bg-transparent"/>}
                            {appt.isGroupSession && appt.notes && <InfoDisplay label="Roteiro (Início)" value={appt.notes} icon={FileText} className="p-0 bg-transparent"/>}
                        </div>
                        <div className="flex flex-col gap-1.5 p-3 border-t bg-muted/30 rounded-b-lg">
                            {appt.isGroupSession && appt.groupId && (
                                <Button size="sm" variant="outline" asChild className="w-full">
                                    <Link href={`/groups/${appt.groupId}`}>
                                        <UsersIcon className="mr-1.5 h-3.5 w-3.5"/> Ver Detalhes do Grupo
                                    </Link>
                                </Button>
                            )}
                            {!appt.isGroupSession && appt.patientId && (
                                <Button size="sm" variant="outline" asChild className="w-full">
                                    <Link href={`/patients/${appt.patientId}?tab=notes&date=${format(dayDate, "yyyy-MM-dd")}`}>
                                        <FileText className="mr-1.5 h-3.5 w-3.5"/> Iniciar Anotação
                                    </Link>
                                </Button>
                            )}
                            <div className="flex gap-2 w-full">
                                <Button size="sm" variant="outline" asChild className="flex-1">
                                  <Link href={appt.isGroupSession ? `/groups/edit/${appt.groupId}` : `/schedule/edit/${appt.id}`}>
                                    <Edit className="mr-1.5 h-3.5 w-3.5"/> {appt.isGroupSession ? "Gerenciar Grupo" : "Editar"}
                                  </Link>
                                </Button>
                                {!appt.isGroupSession && (
                                  <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                      <Button size="sm" variant="destructive" className="flex-1 bg-destructive/90 hover:bg-destructive text-destructive-foreground"><Trash2 className="mr-1.5 h-3.5 w-3.5"/> Excluir</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                      <AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                      <AlertDialogDescription>Tem certeza que deseja excluir o agendamento de {appt.patient} às {appt.startTime} em {format(dayDate, "P", { locale: ptBR })}? Esta ação não pode ser desfeita.</AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteAppointment(appt.id, appt.patient || "Bloqueio", dayDate)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                                      </AlertDialogFooter>
                                  </AlertDialogContent>
                                  </AlertDialog>
                                )}
                            </div>
                            {!appt.isGroupSession && appt.type !== "Blocked Slot" && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button size="sm" variant="outline" className="w-full"><Check className="mr-1.5 h-3.5 w-3.5" /> Marcar Status</Button></DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Atualizar Status</DropdownMenuLabel><DropdownMenuSeparator />
                                {(["Scheduled", "Confirmed", "Completed", "NoShow", "Rescheduled", "CancelledByPatient", "CancelledByClinic"] as AppointmentStatus[]).map(statusOpt => (
                                    <DropdownMenuItem key={statusOpt} onClick={() => handleUpdateStatus(appt, statusOpt, dayDate)} disabled={appt.status === statusOpt}>
                                    {getStatusIcon(statusOpt, "w-4 h-4 mr-2")} {getStatusLabel(statusOpt)}
                                    </DropdownMenuItem>
                                ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            )}
                        </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
              {isWorkingDay && (
                <Button variant="ghost" size="icon" className="absolute bottom-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" asChild>
                  <Link href={`/schedule/new?date=${format(dayDate, "yyyy-MM-dd")}`}><PlusCircle className="h-5 w-5" /><span className="sr-only">Adicionar agendamento</span></Link>
                </Button>
              )}
            </>
          ) : (
            <div className="mt-1 text-xs text-muted-foreground/70 flex items-center justify-center h-full">
              {/* Dia não trabalhado (não na visualização DIÁRIA), não mostra nada extra */}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }, [getAppointmentsForDay, selectedDate, filters.psychologistId, handleDeleteAppointment, handleUpdateStatus, workingDaysOfWeek, view]);

  const renderMonthView = useCallback(() => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthStart = startOfWeek(firstDayOfMonth, { locale: ptBR, weekStartsOn: 1 });
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const monthEnd = endOfWeek(lastDayOfMonth, { locale: ptBR, weekStartsOn: 1 });

    const daysInGrid = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const dayNames = Array.from({ length: 7 }, (_, i) => {
        const tempDate = addDays(startOfWeek(new Date(), { weekStartsOn: 1}), i);
        return format(tempDate, "EEEEEE", { locale: ptBR });
    });

    return (
        <div className="grid grid-cols-7 gap-px bg-border border-l border-t flex-grow">
            {dayNames.map(dayName => (<div key={dayName} className="py-0.5 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b capitalize">{dayName}</div>))}
            {daysInGrid.map((day, index) => renderDayCell(day, isSameMonth(day, currentDate), index))}
        </div>
    );
  }, [currentDate, renderDayCell]);

  const renderWeekView = useCallback(() => {
    const weekStartActual = startOfWeek(currentDate, { weekStartsOn: 1, locale: ptBR });
    const allWeekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStartActual, i));

    return (
         <div className={cn("grid grid-cols-7 gap-px bg-border border-l border-t flex-grow")}>
            {allWeekDays.map(day => (<div key={`header-${day.toString()}`} className="py-0.5 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b capitalize">{format(day, "EEE d", { locale: ptBR })}</div>))}
            {allWeekDays.map((day, index) => renderDayCell(day, true, `week-${index}`))}
        </div>
    );
  }, [currentDate, renderDayCell]);

  const renderDayView = useCallback(() => {
     return (
         <div className="flex flex-col gap-px bg-border border-l border-t flex-grow">
            <div className="py-1 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b capitalize">{format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}</div>
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
