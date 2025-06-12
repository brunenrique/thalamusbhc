export type AssessmentStatus = 'assigned' | 'in-progress' | 'completed';

export interface Assessment {
  id: string;
  patientId: string;
  templateId: string;
  templateName: string;
  assignedBy: string;
  status: AssessmentStatus;
  createdAt: string; // ISO date
  dueDate?: string; // ISO date
  completedAt?: string; // ISO date
  responses?: Record<string, unknown>;
  score?: number;
}
