import { z } from "zod";

export const fieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  pinned: z.boolean(),
});

export type Field = z.infer<typeof fieldSchema>;

export const fieldsSchema = z.object({
  fields: z.array(fieldSchema),
});

export const DEFAULT_FIELDS: Field[] = [
  { id: "lastPlan", label: "Plano da Última Sessão", pinned: true },
  { id: "goals", label: "Objetivos de Tratamento", pinned: true },
  { id: "alerts", label: "Alertas Clínicos", pinned: true },
  { id: "history", label: "Histórico Médico", pinned: false },
  { id: "meds", label: "Medicações", pinned: false },
];
