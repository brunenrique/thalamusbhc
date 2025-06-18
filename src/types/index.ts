
export type TaskStatus = "Pendente" | "Em Progresso" | "Concluída";
export type TaskPriority = "Alta" | "Média" | "Baixa";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  assignedTo: string;
  status: TaskStatus;
  priority: TaskPriority;
  patientId?: string;
}
export * from './assessment';
export * from './cards';
