
import { create, type StateCreator } from 'zustand';
import type { User, CurrentUser } from '@/types/user';

interface ChatState {
  isChatOpen: boolean;
  currentChatId: string; // For future multi-chat support, default to "global"
  currentUser: CurrentUser;
  onlineUsers: User[]; // Mocked for now
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  setCurrentChatId: (chatId: string) => void;
  setCurrentUser: (user: CurrentUser) => void;
  setOnlineUsers: (users: User[]) => void; // For mocking
}

const chatStore: StateCreator<ChatState> = (set, get) => ({
  isChatOpen: false,
  currentChatId: "global", // Default chat channel
  currentUser: { uid: null, displayName: null, avatarUrl: null }, // Initialize with null
  onlineUsers: [ // Mock data
    { id: 'user1', name: 'Dr. Admin', avatar: 'https://placehold.co/40x40/D0BFFF/4F3A76?text=DA' },
    { id: 'user2', name: 'Alice P.', avatar: 'https://placehold.co/40x40/70C1B3/FFFFFF?text=AP' },
  ],
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),
  setCurrentChatId: (chatId: string) => set({ currentChatId: chatId }),
  setCurrentUser: (user: CurrentUser) => set({ currentUser: user }),
  setOnlineUsers: (users: User[]) => set({ onlineUsers: users }), // For updating mock users
});

export const useChatStore = create<ChatState>(chatStore);

// Example: How to set the current user after authentication
// Somewhere in your auth flow (e.g., after successful login):
// import { auth } from '@/lib/firebase'; // your firebase auth instance
// import { useChatStore } from '@/stores/chatStore';
//
// auth.onAuthStateChanged(user => {
//   if (user) {
//     useChatStore.getState().setCurrentUser({
//       uid: user.uid,
//       displayName: user.displayName || "Usuário Anônimo",
//       avatarUrl: user.photoURL
//     });
//     // For testing, you can also simulate a logged-in user if Firebase auth isn't fully set up in dev
//     // useChatStore.getState().setCurrentUser({ uid: "test-user-uid", displayName: "Test User", avatarUrl: "https://placehold.co/40x40.png" });
//   } else {
//     useChatStore.getState().setCurrentUser({ uid: null, displayName: null, avatarUrl: null });
//   }
// });
