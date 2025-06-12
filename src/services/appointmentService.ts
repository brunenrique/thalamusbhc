import type { AppointmentsByDate } from '@/types/appointment';

export function hasScheduleConflict(
  appointments: AppointmentsByDate,
  dateKey: string,
  startTime: string,
  endTime: string,
  psychologistId: string,
  isBlockTime: boolean
): boolean {
  const existing = appointments[dateKey] || [];
  return existing.some((appt) => {
    if (appt.psychologistId !== psychologistId) return false;
    if (appt.status === 'CancelledByPatient' || appt.status === 'CancelledByClinic') {
      return false;
    }
    if (!isBlockTime && appt.type === 'Blocked Slot') {
      // Bloqueio impede consulta
      return startTime < appt.endTime && endTime > appt.startTime;
    }
    return startTime < appt.endTime && endTime > appt.startTime;
  });
}
