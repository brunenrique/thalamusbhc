"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"; // Shadcn calendar for date picking
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock, User, PlusCircle } from 'lucide-react';

// Mock data for appointments
const mockAppointments = {
  "2024-08-15": [
    { time: "10:00 AM", patient: "Alice Wonderland", type: "Consultation" },
    { time: "02:00 PM", patient: "Bob The Builder", type: "Follow-up" },
  ],
  "2024-08-20": [
    { time: "11:00 AM", patient: "Charlie Brown", type: "Therapy Session" },
  ],
};

type Appointment = { time: string; patient: string; type: string };
type AppointmentsByDate = Record<string, Appointment[]>;

export default function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // This is a very simplified "month view". A real calendar is much more complex.
  // We'll generate a grid for the days of the month.
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0 (Sun) - 6 (Sat)
  
  const numDays = daysInMonth(currentMonth);
  const startOffset = firstDayOfMonth(currentMonth);
  const calendarDays = Array(startOffset).fill(null).concat(Array.from({ length: numDays }, (_, i) => i + 1));

  const getAppointmentsForDay = (day: number | null): Appointment[] => {
    if (!day) return [];
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return (mockAppointments as AppointmentsByDate)[dateStr] || [];
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {/* This is a conceptual month grid. A real calendar would use a library or more complex logic. */}
      <div className="grid grid-cols-7 gap-px bg-border border-l border-t flex-grow">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
          <div key={dayName} className="py-2 text-center text-xs font-medium text-muted-foreground bg-card border-r border-b">{dayName}</div>
        ))}
        {calendarDays.map((day, index) => (
          <Card 
            key={index} 
            className={`p-2 min-h-[100px] bg-card border-r border-b rounded-none shadow-none hover:bg-secondary/30 transition-colors ${day ? 'cursor-pointer' : 'bg-muted/50'}`}
            onClick={() => day && setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
          >
            <CardContent className="p-0 h-full flex flex-col">
              {day && (
                <>
                  <div className={`text-sm font-medium ${selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth() ? 'text-primary font-bold' : 'text-foreground'}`}>
                    {day}
                  </div>
                  <div className="mt-1 space-y-1 text-xs overflow-y-auto flex-grow">
                    {getAppointmentsForDay(day).map((appt, idx) => (
                      <Popover key={idx}>
                        <PopoverTrigger asChild>
                           <Badge variant="default" className="w-full truncate block cursor-pointer bg-primary/80 hover:bg-primary text-primary-foreground">
                            <Clock className="w-3 h-3 mr-1 inline-block" /> {appt.time} - {appt.patient}
                           </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3">
                            <h4 className="font-semibold text-sm">{appt.patient}</h4>
                            <p className="text-xs text-muted-foreground">{appt.type}</p>
                            <p className="text-xs text-muted-foreground"><Clock className="w-3 h-3 mr-1 inline-block"/>{appt.time}</p>
                            <Button size="sm" variant="outline" className="w-full mt-2">View Details</Button>
                        </PopoverContent>
                      </Popover>
                    ))}
                  </div>
                   <Button variant="ghost" size="icon" className="mt-auto ml-auto h-6 w-6 self-end opacity-50 hover:opacity-100">
                      <PlusCircle className="h-4 w-4" />
                      <span className="sr-only">Add appointment</span>
                    </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {/* For precise date selection, we can use the shadcn Calendar component in a popover or sidebar */}
      {/* <div className="mt-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-md border bg-card"
        />
      </div> */}
    </div>
  );
}
