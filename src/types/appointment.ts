export type AppointmentStatus =
  | "Scheduled"
  | "Completed"
  | "CancelledByPatient"
  | "CancelledByClinic"
  | "Blocked"
  | "Confirmed"
  | "NoShow"
  | "Rescheduled";

export interface Appointment {
  id: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  patient: string;
  type: string;
  psychologistId: string;
  status: AppointmentStatus;
  blockReason?: string;
  notes?: string;
}

export type AppointmentsByDate = Record<string, Appointment[]>;
