import type { Timestamp } from 'firebase/firestore';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  identifier?: string;
  dob?: Timestamp | null;
  notes?: string;
  lastSession?: string | null;
  nextAppointment?: string | null;
  avatarUrl?: string;
  dataAiHint?: string;
  lastAppointmentDate?: Timestamp | null;
}
