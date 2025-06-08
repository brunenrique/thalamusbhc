
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"; // Shadcn calendar for date picking
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock, User, PlusCircle, Edit, Trash2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, getDay, isSameMonth, isSameDay } from 'date-fns';
import Link from 'next/link';

// Mock data for appointments - expanded with psychologist and status
const mockAppointmentsData = {
  "2024-08-15": [
    { id: "appt1", time: "10:00 AM", patient: "Alice Wonderland", type: "Consultation", psychologistId: "psy1", status: "Scheduled" },
    { id: "appt2", time: "02:00 PM", patient: "Bob The Builder", type: "Follow-up", psychologistId: "psy2", status: "Completed" },
  ],
  "2024-08-16": [
    { id: "appt3", time: "09:00 AM", patient: "Self Care", type: "Blocked Slot", psychologistId: "psy1", status: "Blocked", blockReason: "Personal Time" },
  ],
  "2024-08-20": [
    { id: "appt4", time: "11:00 AM", patient: "Charlie Brown", type: "Therapy Session", psychologistId: "psy1", status: "Cancelled" },
  ],
};

type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled" | "Blocked" | "Confirmed";
type Appointment = { 
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
        case "Confirmed": return "secondary";
        case "Cancelled": return "destructive";
        case "Blocked": return "outline";
        default: return "outline";
    }
};


export default function AppointmentCalendar({ view, currentDate, filters }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);

  const filteredAppointments = useMemo(() => {
    const appointments: AppointmentsByDate = {};
    for (const dateKey in mockAppointmentsData) {
        appointments[dateKey] = (mockAppointmentsData as AppointmentsByDate)[dateKey].filter(appt => {
            const matchesPsychologist = filters.psychologistId === "all" || appt.psychologistId === filters.psychologistId;
            const matchesStatus = filters.status === "All" || appt.status === filters.status;
            // Date range filtering would be more complex for recurring, but for single instances:
            const apptDate = new Date(dateKey + "T00:00:00"); // Ensure date comparison is correct
            const matchesDateFrom = !filters.dateFrom || apptDate >= filters.dateFrom;
            const matchesDateTo = !filters.dateTo || apptDate <= filters.dateTo;
            return matchesPsychologist && matchesStatus && matchesDateFrom && matchesDateTo;
        });
    }
    return appointments;
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
                    <h4 className="font-semibold text-sm">{appt.type === "Blocked Slot" ? `Blocked: ${appt.blockReason}` : appt.patient}</h4>
                    <p className="text-xs text-muted-foreground">{appt.type}</p>
                    <p className="text-xs text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1 inline-block"/>{appt.time}</p>
                    <p className="text-xs text-muted-foreground flex items-center">{getStatusIcon(appt.status)} Status: {appt.status}</p>
                    {appt.psychologistId && <p className="text-xs text-muted-foreground">With: {appt.psychologistId === "psy1" ? "Dr. Smith" : "Dr. Jones"}</p> }
                    <div className="mt-3 flex gap-2">
                        <Button size="xs" variant="outline" asChild><Link href={`/schedule/edit/${appt.id}`}><Edit className="mr-1 h-3 w-3"/> Edit</Link></Button>
                        <Button size="xs" variant="destructive" className="bg-destructive/90 hover:bg-destructive text-destructive-foreground"><Trash2 className="mr-1 h-3 w-3"/> Delete</Button>
                    </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
           <Button variant="ghost" size="icon" className="mt-auto ml-auto h-6 w-6 self-end opacity-30 hover:opacity-100">
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Add appointment</span>
            </Button>
        </CardContent>
      </Card>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
    const monthEnd = endOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
        <div className="grid grid-cols-7 gap-px bg-border border-l border-t flex-grow">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
              <div key={dayName} className="py-2 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b">{dayName}</div>
            ))}
            {days.map((day, index) => renderDayCell(day, isSameMonth(day, currentDate), index))}
        </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Assuming week starts on Monday
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    return (
         <div className="grid grid-cols-7 gap-px bg-border border-l border-t flex-grow">
            {days.map(day => (
                <div key={day.toString()} className="py-2 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b">
                    {format(day, "EEE d")}
                </div>
            ))}
            {days.map((day, index) => renderDayCell(day, true, `week-${index}`))}
        </div>
    );
  };

  const renderDayView = () => {
     return (
         <div className="flex flex-col gap-px bg-border border-l border-t flex-grow">
            <div className="py-2 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b">
                {format(currentDate, "EEEE, MMM d")}
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

    