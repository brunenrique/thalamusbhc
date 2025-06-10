export const mockPatients = [
  { id: "1", name: "Alice Wonderland", email: "alice@example.com", lastSession: "2024-07-15", nextAppointment: "2024-07-22", avatarUrl: "https://placehold.co/100x100/D0BFFF/4F3A76?text=AW", dataAiHint: "female avatar" },
  { id: "2", name: "Bob O Construtor", email: "bob@example.com", lastSession: "2024-07-10", nextAppointment: "2024-07-20", avatarUrl: "https://placehold.co/100x100/70C1B3/FFFFFF?text=BB", dataAiHint: "male avatar" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", lastSession: "2024-07-12", nextAppointment: "2024-07-25", avatarUrl: "https://placehold.co/100x100/D0BFFF/4F3A76?text=CB", dataAiHint: "child avatar" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", lastSession: "2024-07-18", nextAppointment: null, avatarUrl: "https://placehold.co/100x100/70C1B3/FFFFFF?text=DP", dataAiHint: "female hero" },
];
export type MockPatient = (typeof mockPatients)[number];
