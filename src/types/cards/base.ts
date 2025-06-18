export interface BaseCard {
  id: string;
  type: string;
  title: string;
  sessionNumber?: number;
  sessionDate?: string;
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
}
