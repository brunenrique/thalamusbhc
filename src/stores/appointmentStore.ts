import { create } from 'zustand';
import type { Appointment, AppointmentsByDate } from '@/types/appointment';
import { getInitialMockAppointments } from '@/components/schedule/appointment-calendar';

interface AppointmentState {
  appointments: AppointmentsByDate;
  setAppointments: (appointments: AppointmentsByDate) => void;
  addAppointment: (dateKey: string, appointment: Appointment) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: getInitialMockAppointments(),
  setAppointments: (appointments) => set({ appointments }),
  addAppointment: (dateKey, appointment) =>
    set((state) => {
      const existing = state.appointments[dateKey] || [];
      return {
        appointments: {
          ...state.appointments,
          [dateKey]: [...existing, appointment],
        },
      };
    }),
}));
