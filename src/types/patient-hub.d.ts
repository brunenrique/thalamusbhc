// src/types/patient-hub.d.ts

export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: string;
  contact: string;
  email: string;
  address: string;
  medicalRecordId: string;
  sessionNotes: SessionNote[];
  assessments: Assessment[];
  progressCharts: Record<string, ProgressChartData[]>;
  reports: Report[];
  homeworkAssignments: HomeworkAssignment[];
  therapeuticGoals: TherapeuticGoal[];
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  allergies: string;
  medications: string;
  pastHistory: string;
  currentConditions: string;
}

export interface SessionNote {
  id: string;
  date: string;
  title: string;
  content: string;
}

export interface Assessment {
  id: string;
  name: string;
  date: string;
  score: number;
  status: string;
}

export interface ProgressChartData {
  date: string;
  value: number;
}

export interface Report {
  id: string;
  name: string;
  date: string;
  url: string;
}

export interface HomeworkAssignment {
  id: string;
  title: string;
  dueDate: string;
  status: string;
}

export interface TherapeuticGoal {
  id: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}
