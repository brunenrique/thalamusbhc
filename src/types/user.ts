export type UserGender = 'masculino' | 'feminino' | 'outro';

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface CurrentUser {
  uid: string | null;
  displayName: string | null;
  avatarUrl?: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: import('@/constants/roles').UserRole | 'Secretary';
  gender?: UserGender;
  specialty?: string;
  phone?: string;
  clinicName?: string;
  dateRegistered?: string;
  avatarUrl?: string;
}
