import { useChatStore } from '@/stores/chatStore';

export interface AuthUser {
  uid: string | null;
  displayName: string | null;
  avatarUrl?: string | null;
  role?: string;
}

export default function useAuth() {
  const currentUser = useChatStore((state) => state.currentUser);

  const user: AuthUser = currentUser.uid
    ? { ...currentUser, role: 'admin' }
    : {
        uid: 'mock-user',
        displayName: 'Usuário Demo',
        avatarUrl: 'https://placehold.co/40x40',
        role: 'admin',
      };

  return { user };
}

