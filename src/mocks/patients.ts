
import type { UserGender } from '@/types/user';

const getDefaultPatientAvatar = (gender?: UserGender, name?: string) => {
  const initials = name ? (name.split(' ')[0][0] + (name.split(' ').length > 1 ? name.split(' ')[name.split(' ').length - 1][0] : '')).toUpperCase() : "P";
  switch (gender) {
    case "masculino":
      return `https://placehold.co/100x100/70C1B3/FFFFFF?text=M-${initials}`;
    case "feminino":
      return `https://placehold.co/100x100/D0BFFF/4F3A76?text=F-${initials}`;
    default:
      return `https://placehold.co/100x100/F5F5F5/4A4A4A?text=N-${initials}`;
  }
};

export const mockPatients = [
  { 
    id: "1", 
    name: "Alice Wonderland", 
    email: "alice@example.com", 
    lastSession: "2024-07-15", 
    nextAppointment: "2024-07-22", 
    gender: "feminino" as UserGender,
    avatarUrl: getDefaultPatientAvatar("feminino", "Alice Wonderland"), 
    dataAiHint: "female avatar" 
  },
  { 
    id: "2", 
    name: "Bob O Construtor", 
    email: "bob@example.com", 
    lastSession: "2024-07-10", 
    nextAppointment: "2024-07-20", 
    gender: "masculino" as UserGender,
    avatarUrl: getDefaultPatientAvatar("masculino", "Bob O Construtor"), 
    dataAiHint: "male avatar" 
  },
  { 
    id: "3", 
    name: "Charlie Brown", 
    email: "charlie@example.com", 
    lastSession: "2024-07-12", 
    nextAppointment: "2024-07-25", 
    gender: "masculino" as UserGender,
    avatarUrl: getDefaultPatientAvatar("masculino", "Charlie Brown"), 
    dataAiHint: "child avatar" 
  },
  { 
    id: "4", 
    name: "Diana Prince", 
    email: "diana@example.com", 
    lastSession: "2024-07-18", 
    nextAppointment: null, 
    gender: "feminino" as UserGender,
    avatarUrl: getDefaultPatientAvatar("feminino", "Diana Prince"), 
    dataAiHint: "female hero" 
  },
];
export type MockPatient = (typeof mockPatients)[number];
