
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock, User, PlusCircle, Edit, Trash2, CheckCircle, AlertTriangle, XCircle, CalendarCog, Check, Ban, UserCheck, UserX, RepeatIcon } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';
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


type AppointmentStatus = 
  | "Scheduled" 
  | "Completed" 
  | "CancelledByPatient" 
  | "CancelledByClinic" 
  | "Blocked" 
  | "Confirmed" 
  | "NoShow" 
  | "Rescheduled";

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

const baseMockAppointments: AppointmentsByDate = {
  "2024-08-15": [
    { id: "appt1", time: "10:00", patient: "Alice Wonderland", type: "Consulta", psychologistId: "psy1", status: "Confirmed" },
    { id: "appt2", time: "14:00", patient: "Bob O Construtor", type: "Acompanhamento", psychologistId: "psy2", status: "Completed" },
  ],
  "2024-08-16": [
    { id: "appt3", time: "09:00", patient: "Autocuidado", type: "Blocked Slot", psychologistId: "psy1", status: "Blocked", blockReason: "Tempo Pessoal" },
  ],
  "2024-08-20": [
    { id: "appt4", time: "11:00", patient: "Charlie Brown", type: "Sessão de Terapia", psychologistId: "psy1", status: "CancelledByPatient" },
  ],
};

const getInitialMockAppointments = (): AppointmentsByDate => {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayAppointments = [
    { id: "apptToday1", time: "15:00", patient: "Paciente Teste Hoje", type: "Consulta Teste", psychologistId: "psy1", status: "Scheduled" as AppointmentStatus},
    { id: "apptToday2", time: "17:00", patient: "Diana Prince", type: "Revisão", psychologistId: "psy2", status: "NoShow" as AppointmentStatus}
  ];

  const initialData = { ...baseMockAppointments };
  if (initialData[todayStr]) {
    initialData[todayStr] = [...initialData[todayStr], ...todayAppointments];
  } else {
    initialData[todayStr] = todayAppointments;
  }
  // Add more variety
  const aFewDaysAgo = format(subDays(new Date(), 3), "yyyy-MM-dd");
  if (!initialData[aFewDaysAgo]) initialData[aFewDaysAgo] = [];
  initialData[aFewDaysAgo].push({ id: "apptOld1", time: "10:30", patient: "Old Patient", type: "Follow-up", psychologistId: "psy1", status: "Completed"});

  const aFewDaysAhead = format(addDays(new Date(), 3), "yyyy-MM-dd");
   if (!initialData[aFewDaysAhead]) initialData[aFewDaysAhead] = [];
  initialData[aFewDaysAhead].push({ id: "apptFuture1", time: "16:00", patient: "Future Patient", type: "Initial Consultation", psychologistId: "psy2", status: "Confirmed"});


  return initialData;
};

export const mockAppointments = getInitialMockAppointments();


const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
        case "Scheduled": return <Clock className="w-3 h-3 mr-1 inline-block text-blue-500" />;
        case "Confirmed": return <UserCheck className="w-3 h-3 mr-1 inline-block text-yellow-600" />;
        case "Completed": return <CheckCircle className="w-3 h-3 mr-1 inline-block text-green-500" />;
        case "CancelledByPatient": return <UserX className="w-3 h-3 mr-1 inline-block text-red-500" />;
        case "CancelledByClinic": return <Ban className="w-3 h-3 mr-1 inline-block text-red-700" />;
        case "Blocked": return <AlertTriangle className="w-3 h-3 mr-1 inline-block text-gray-500" />;
        case "NoShow": return <UserX className="w-3 h-3 mr-1 inline-block text-orange-500" />;
        case "Rescheduled": return <RepeatIcon className="w-3 h-3 mr-1 inline-block text-purple-500" />;
        default: return <Clock className="w-3 h-3 mr-1 inline-block" />;
    }
};

const getStatusBadgeVariant = (status: AppointmentStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case "Completed": return "default"; // Greenish or positive
        case "Scheduled": return "secondary";
        case "Confirmed": return "secondary"; // Yellowish
        case "CancelledByPatient": 
        case "CancelledByClinic": 
        case "NoShow": 
            return "destructive"; // Reddish
        case "Blocked": return "outline"; // Neutral
        case "Rescheduled": return "outline"; // Neutral or Purpleish if we have a variant
        default: return "outline";
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


export default function AppointmentCalendar({ view, currentDate, filters }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);
  const { toast } = useToast();

  const filteredAppointments = useMemo(() => {
    const appointmentsResult: AppointmentsByDate = {};
    const currentMockAppointments = getInitialMockAppointments(); 
    for (const dateKey in currentMockAppointments) { 
        appointmentsResult[dateKey] = (currentMockAppointments as AppointmentsByDate)[dateKey].filter(appt => {
            const matchesPsychologist = filters.psychologistId === "all" || appt.psychologistId === filters.psychologistId;
            const matchesStatus = filters.status === "All" || appt.status === filters.status;
            
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

  const handleDeleteAppointment = (appointmentId: string, appointmentPatient: string, appointmentDate: string) => {
    console.log(`Excluindo agendamento ${appointmentId} - ${appointmentPatient} em ${appointmentDate} (Simulado)`);
    // Here you would typically update your state or call an API
    toast({
      title: "Agendamento Excluído (Simulado)",
      description: `O agendamento de ${appointmentPatient} foi excluído.`,
    });
  };

  const handleUpdateStatus = (appointment: Appointment, newStatus: AppointmentStatus, dayDate: Date) => {
     console.log(`Atualizando status do agendamento ${appointment.id} para ${newStatus} (Simulado)`);
    // Here you would typically update your state or call an API
    toast({
      title: "Status do Agendamento Atualizado (Simulado)",
      description: `Status de ${appointment.patient} em ${format(dayDate, "P", { locale: ptBR })} alterado para ${getStatusLabel(newStatus)}.`,
    });
  };

  const renderDayCell = (dayDate: Date, isCurrentMonth: boolean, cellKey: string | number) => {
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
            isToday && "border-2 border-accent"
        )}
        onClick={() => setSelectedDate(dayDate)}
      >
        <CardContent className="p-0 h-full flex flex-col flex-grow">
          <div className={cn("text-sm font-medium text-center rounded-full w-6 h-6 flex items-center justify-center mb-1", 
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
                   <Badge 
                     variant={getStatusBadgeVariant(appt.status)} 
                     className="w-full truncate block cursor-pointer py-1 text-xs"
                   >
                    {getStatusIcon(appt.status)}
                    {appt.time} - {appt.type === "Blocked Slot" ? appt.blockReason : appt.patient}
                   </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3 shadow-lg rounded-lg">
                    <h4 className="font-semibold text-sm mb-0.5">{appt.type === "Blocked Slot" ? `Bloqueado: ${appt.blockReason}` : appt.patient}</h4>
                    <p className="text-xs text-muted-foreground mb-0.5">{appt.type}</p>
                    <p className="text-xs text-muted-foreground flex items-center mb-0.5"><Clock className="w-3 h-3 mr-1 inline-block"/>{appt.time}</p>
                    <p className="text-xs text-muted-foreground flex items-center mb-2">{getStatusIcon(appt.status)} Status: {getStatusLabel(appt.status)}</p>
                    {appt.psychologistId && <p className="text-xs text-muted-foreground mb-2">Com: {appt.psychologistId === "psy1" ? "Dr. Silva" : "Dra. Jones"}</p> }
                    
                    <div className="flex gap-2 mb-2">
                        <Button size="xs" variant="outline" asChild><Link href={`/schedule/edit/${appt.id}`}><Edit className="mr-1 h-3 w-3"/> Editar</Link></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="xs" variant="destructive" className="bg-destructive/90 hover:bg-destructive text-destructive-foreground"><Trash2 className="mr-1 h-3 w-3"/> Excluir</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o agendamento de {appt.patient} às {appt.time} em {format(dayDate, "P", { locale: ptBR })}? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAppointment(appt.id, appt.patient, format(dayDate, "P", { locale: ptBR }))} className="bg-destructive hover:bg-destructive/90">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    {appt.type !== "Blocked Slot" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="xs" variant="outline" className="w-full">
                            <Check className="mr-1 h-3 w-3" /> Marcar Status
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Atualizar Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
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
              <Link href={`/schedule/new?date=${format(dayDate, "yyyy-MM-dd")}`}>
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Adicionar agendamento</span>
              </Link>
            </Button>
        </CardContent>
      </Card>
    );
  };

  const renderMonthView = () => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthStart = startOfWeek(firstDayOfMonth, { locale: ptBR, weekStartsOn: 1 });
    
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const monthEnd = endOfWeek(lastDayOfMonth, { locale: ptBR, weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const dayNames = Array.from({ length: 7 }, (_, i) => {
        const dayIndex = (i + 1) % 7; // Adjust for weekStartsOn: 1 (Monday)
        return format(addDays(monthStart, dayIndex), "EEEEEE", { locale: ptBR });
    });

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

    