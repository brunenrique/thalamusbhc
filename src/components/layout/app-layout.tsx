
"use client";

import React, { useEffect } from 'react'; // Added useEffect
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar"; // Removed SidebarTrigger as it's used inside AppHeader
import AppHeader from "@/components/layout/header";
import SidebarNav from "@/components/layout/sidebar-nav";
import { Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import ChatFloatingButton from '@/components/chat/ChatFloatingButton';
import ChatWindow from '@/components/chat/ChatWindow';
import { useChatStore } from '@/stores/chatStore';
import { auth } from '@/services/firebase'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { setCurrentUser, currentUser } = useChatStore(); // Get setCurrentUser from the store
  
  const [defaultOpen, setDefaultOpen] = React.useState(true);

  React.useEffect(() => {
    const sidebarState = document.cookie
      .split('; ')
      .find(row => row.startsWith('sidebar_state='))
      ?.split('=')[1];
    if (sidebarState) {
      setDefaultOpen(sidebarState === 'true');
    }
    if (window.innerWidth < 768) {
      setDefaultOpen(false);
    }
  }, []);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName || "Usuário Anônimo", // Fallback name
          avatarUrl: user.photoURL,
        });
      } else {
        setCurrentUser({ uid: null, displayName: null, avatarUrl: null });
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [setCurrentUser]);
  
  // For local development/testing if Firebase auth is not fully setup
  // This will run once after the initial auth check.
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !auth.currentUser && !currentUser?.uid) {
      setCurrentUser({
         uid: "dev-user-uid",
         displayName: "Dev User",
         avatarUrl: "https://placehold.co/40x40/orange/white?text=DU"
      });
    }
  }, [setCurrentUser, currentUser?.uid]);


  return (
    <SidebarProvider defaultOpen={defaultOpen} open={defaultOpen} onOpenChange={(open) => setDefaultOpen(open)}>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Brain className="w-8 h-8 text-primary" />
            <span className="font-headline text-2xl font-bold text-primary group-data-[collapsible=icon]:hidden">PsiGuard</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav currentPath={pathname} />
        </SidebarContent>
        <SidebarFooter className="p-2 group-data-[collapsible=icon]:hidden">
          {/* Footer content if any, e.g., version */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
        {/* Chat Components */}
        <ChatFloatingButton />
        <ChatWindow />
      </SidebarInset>
    </SidebarProvider>
  );
}
