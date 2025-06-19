export interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
  dataAiHint?: string;
}

export interface GroupResource {
  id: string;
  name: string;
  type: "pdf" | "docx" | "image" | "link" | "other";
  url?: string;
  uploadDate: string;
  description?: string;
  dataAiHint?: string;
}

export interface Group {
  id: string;
  name: string;
  psychologist: string;
  psychologistId: string;
  membersCount: number;
  schedule: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  nextSession?: string;
  description?: string;
  participants: Participant[];
  meetingAgenda?: string;
  resources?: GroupResource[];
}
