import type { Timestamp } from 'firebase/firestore';

export interface Patient {
  id: string;
  name: string;
  email: string;
  lastSession?: string | null;
  nextAppointment?: string | null;
  avatarUrl?: string;
  dataAiHint?: string;
  lastAppointmentDate?: Timestamp | null;
}
