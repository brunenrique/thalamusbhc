
import { useChatStore } from '@/stores/chatStore';

export interface AuthUser {
  uid: string | null;
  displayName: string | null;
  avatarUrl?: string | null;
  role?: string;
}

export default function useAuth() {
  const currentUser = useChatStore((state) => state.currentUser);

  // Since authentication is disabled, always return a mock user
  // to prevent UI breakages in components expecting a user object.
  const user: AuthUser = {
        uid: 'mock-user-uid',
        displayName: 'Usuário Mock',
        avatarUrl: 'https://placehold.co/40x40/70C1B3/FFFFFF?text=UM',
        role: 'Admin', // Provide a default role for development
      };

  return { user };
}
