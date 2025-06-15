
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
  patientId?: string;
  type: string;
  psychologistId: string;
  status: AppointmentStatus;
  blockReason?: string;
  notes?: string;
  isGroupSession?: boolean;
  groupId?: string;
}

export type AppointmentsByDate = Record<string, Appointment[]>;
