"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import AppointmentCalendar, {
  type AppointmentsByDate,
  getInitialMockAppointments,
} from "@/components/schedule/appointment-calendar";
import {
  format,
  startOfWeek,
  addDays,
  subDays,
  eachDayOfInterval,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardWeeklySchedule() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [appointmentsData, setAppointmentsData] = useState<AppointmentsByDate>(() =>
    getInitialMockAppointments()
  );

  useEffect(() => {
    setCurrentDate(new Date());
    // Possível fetch futuro para dados dinâmicos de agenda
  }, []);

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate((prevDate) => {
      if (!prevDate) return null;
      return direction === 'prev'
        ? subDays(prevDate, 7)
        : addDays(prevDate, 7);
    });
  };

  const displayDateRange = () => {
    if (!currentDate) return "Carregando...";
    const start = startOfWeek(currentDate, { weekStartsOn: 1, locale: ptBR });
    const end = addDays(start, 6);
    return `${format(start, "d MMM", { locale: ptBR })} - ${format(
      end,
      "d MMM, yyyy",
      { locale: ptBR }
    )}`;
  };

  const handleAppointmentsUpdate = useCallback(
    (updatedAppointments: AppointmentsByDate) => {
      setAppointmentsData(updatedAppointments);
      // Possível sincronização com backend ou store
    },
    []
  );

  const sessionsThisWeek = useMemo(() => {
    if (!currentDate) return [];
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = addDays(start, 6);
    const days = eachDayOfInterval({ start, end });

    return days.flatMap((d) => {
      const key = format(d, "yyyy-MM-dd");
      return appointmentsData[key] || [];
    });
  }, [currentDate, appointmentsData]);

  if (!currentDate) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Agenda da Semana</CardTitle>
          <CardDescription>Carregando dados da agenda...</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const dashboardFilters = {
    psychologistId: "all",
    status: "All",
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <CardTitle className="font-headline">Agenda da Semana</CardTitle>
          <CardDescription className="capitalize">
            {displayDateRange()}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("prev")}
            aria-label="Semana anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("next")}
            aria-label="Próxima semana"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/schedule">Ver Agenda Completa</Link>
          </Button>
        </div>
      </CardHeader>

      {sessionsThisWeek.length ? (
        <CardContent className="h-[500px] p-0 sm:p-1 md:p-2">
          <AppointmentCalendar
            view="Week"
            currentDate={currentDate}
            filters={dashboardFilters}
            onAppointmentsUpdate={handleAppointmentsUpdate}
          />
        </CardContent>
      ) : (
        <CardContent className="h-[200px] flex items-center justify-center">
          <p>Sem sessões esta semana.</p>
        </CardContent>
      )}
    </Card>
  );
}
