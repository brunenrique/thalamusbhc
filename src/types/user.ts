export type UserGender = "masculino" | "feminino" | "outro";

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
