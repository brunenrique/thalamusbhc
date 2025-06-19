export type Group = {
  id: string;
  name: string;
  dayOfWeek: string; // ex: "monday", "tuesday", etc.
  startTime: string; // ex: "14:00"
  endTime: string;   // ex: "15:00"
  psychologistId: string;
  meetingAgenda?: string;
};
