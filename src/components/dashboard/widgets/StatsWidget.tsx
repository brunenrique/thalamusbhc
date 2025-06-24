'use client';
import React, { useEffect, useState } from 'react';
import { Users, CalendarCheck, Clock, TrendingUp, ListChecks } from 'lucide-react';
import StatsCard from '@/components/dashboard/stats-card';
import {
  getTotalPatients,
  getSessionsThisMonth,
  getOpenTasksCount,
} from '@/services/metricsService';

export default function StatsWidget() {
  const [data, setData] = useState({
    activePatients: 0,
    sessionsThisMonth: 0,
    upcomingAppointments: 0,
    avgSessionDuration: 0,
    openTasks: 0,
  });

  useEffect(() => {
    Promise.all([getTotalPatients(), getSessionsThisMonth(), getOpenTasksCount()]).then(
      ([patients, sessions, tasks]) => {
        setData({
          activePatients: patients,
          sessionsThisMonth: sessions,
          upcomingAppointments: 0,
          avgSessionDuration: 0,
          openTasks: tasks,
        });
      }
    );
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatsCard
        title="Pacientes Ativos"
        value={data.activePatients.toString()}
        icon={<Users className="text-primary" />}
        href="/patients"
      />
      <StatsCard
        title="Sessões no Mês"
        value={data.sessionsThisMonth.toString()}
        icon={<CalendarCheck className="text-primary" />}
        href="/schedule"
      />
      <StatsCard
        title="Duração Média"
        value={`${data.avgSessionDuration} min`}
        icon={<Clock className="text-primary" />}
      />
      <StatsCard
        title="Próximos Agendamentos"
        value={data.upcomingAppointments.toString()}
        icon={<TrendingUp className="text-primary" />}
      />
      <StatsCard
        title="Tarefas Pendentes"
        value={data.openTasks.toString()}
        icon={<ListChecks className="text-primary" />}
        href="/tasks"
      />
    </div>
  );
}
