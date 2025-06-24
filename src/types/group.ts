import { z } from 'zod';
import { groupSchema } from '@/schemas/groupSchema';

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

export type Group = z.infer<typeof groupSchema>;
