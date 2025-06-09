
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock, User, PlusCircle, Edit, Trash2, CheckCircle, AlertTriangle, XCircle, CalendarCog, Check, Ban, UserCheck, UserX, RepeatIcon } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, isSameMonth, isSameDay, parse } from 'date-fns';
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
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  patient: string; 
  type: string;
  psychologistId: string;
  status: AppointmentStatus;
  blockReason?: string;
  notes?: string; // Added for ICS description
};

export type AppointmentsByDate = Record<string, Appointment[]>; // Date string "yyyy-MM-dd" as key

interface AppointmentCalendarProps {
  view: "Month" | "Week" | "Day";
  currentDate: Date;
  filters: {
    psychologistId: string;
    status: string;
    dateFrom?: Date;
    dateTo?: Date;
  };
  onAppointmentsUpdate?: (appointments: AppointmentsByDate) => void; // Callback for updates
}


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

// Function to dynamically generate mock appointments around the current date
export const getInitialMockAppointments = (): AppointmentsByDate => {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayAppointments = [
    { id: "apptToday1", startTime: "15:00", endTime: "16:00", patient: "Paciente Teste Hoje", type: "Consulta Teste", psychologistId: "psy1", status: "Scheduled" as AppointmentStatus, notes: "Consulta de rotina."},
    { id: "apptToday2", startTime: "17:00", endTime: "17:30", patient: "Diana Prince", type: "Revisão", psychologistId: "psy2", status: "NoShow" as AppointmentStatus}
  ];

  // Create a deep copy to avoid modifying the original baseMockAppointments
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

// Keep a reference to the initially generated mock data for other components to import
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
        case "Completed": return "default"; 
        case "Scheduled": return "secondary";
        case "Confirmed": return "secondary"; 
        case "CancelledByPatient": 
        case "CancelledByClinic": 
        case "NoShow": 
            return "destructive"; 
        case "Blocked": return "outline"; 
        case "Rescheduled": return "outline"; 
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


function AppointmentCalendarComponent({ view, currentDate, filters, onAppointmentsUpdate }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);
  // Use a local state for appointments, initialized from a global/prop or fetched
  const [appointmentsState, setAppointmentsState] = useState<AppointmentsByDate>(() => getInitialMockAppointments());

  const { toast } = useToast();
  
  // Update local state if the global mockAppointments source changes or props change.
  // This effect might be more complex if `globalMockAppointments` itself is dynamic.
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
        }).sort((a, b) => a.startTime.localeCompare(b.startTime)); // Sort by start time
    }
    return appointmentsResult;
  }, [filters, appointmentsState]);


  const getAppointmentsForDay = (dayDate: Date): Appointment[] => {
    const dateStr = format(dayDate, "yyyy-MM-dd");
    return filteredAppointments[dateStr] || [];
  };

  const handleDeleteAppointment = (appointmentId: string, appointmentPatient: string, dayDate: Date) => {
    const dateStr = format(dayDate, "yyyy-MM-dd");
    const updatedAppointmentsForDate = (appointmentsState[dateStr] || []).filter(appt => appt.id !== appointmentId);
    
    setAppointmentsState(prev => {
        const newState = {
            ...prev,
            [dateStr]: updatedAppointmentsForDate
        };
        if (onAppointmentsUpdate) {
            onAppointmentsUpdate(newState);
        }
        return newState;
    });

    toast({
      title: "Agendamento Excluído",
      description: `O agendamento de ${appointmentPatient} foi excluído.`,
    });
  };

  const handleUpdateStatus = (appointment: Appointment, newStatus: AppointmentStatus, dayDate: Date) => {
    const dateStr = format(dayDate, "yyyy-MM-dd");
    
    setAppointmentsState(prev => {
        const updatedAppointmentsForDate = (prev[dateStr] || []).map(appt => 
            appt.id === appointment.id ? { ...appt, status: newStatus } : appt
        );
        const newState = {
            ...prev,
            [dateStr]: updatedAppointmentsForDate
        };
        if (onAppointmentsUpdate) {
            onAppointmentsUpdate(newState);
        }
        return newState;
    });
    
    toast({
      title: "Status do Agendamento Atualizado",
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
            // isToday && "border-2 border-accent" // Removed to avoid double border effect with selected
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
                   <Badge 
                     variant={getStatusBadgeVariant(appt.status)} 
                     className="w-full truncate block cursor-pointer py-1 text-xs"
                   >
                    {getStatusIcon(appt.status)}
                    {appt.startTime} - {appt.type === "Blocked Slot" ? appt.blockReason : appt.patient}
                   </Badge>
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
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o agendamento de {appt.patient} às {appt.startTime} em {format(dayDate, "P", { locale: ptBR })}? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAppointment(appt.id, appt.patient, dayDate)} className="bg-destructive hover:bg-destructive/90">
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
        const dayIndex = (i + 0) % 7; // Monday is 0 if weekStartsOn: 1
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

const AppointmentCalendar = React.memo(AppointmentCalendarComponent);
export default AppointmentCalendar;


// Helper to populate mockPsychologists if not already defined in schedule/appointment-form
const mockPsychologists = [
  { id: "psy1", name: "Dr. Silva" },
  { id: "psy2", name: "Dra. Jones" },
  { id: "all", name: "Todos os Psicólogos" },
];

