import { z } from "zod";

export const groupSchema = z.object({
  name: z.string().min(3, "O nome do grupo é obrigatório e deve ter pelo menos 3 caracteres."),
  description: z.string().optional(),
  psychologistId: z.string().min(1, "Selecione um psicólogo responsável."),
  patientIds: z.array(z.string()).min(1, "Selecione pelo menos um paciente."),
  dayOfWeek: z.string().min(1, "Selecione o dia da semana para o grupo."),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:mm)."),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:mm)."),
  meetingAgenda: z.string().optional(),
});
