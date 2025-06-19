
"use client";

import React, { useEffect } from 'react'; 
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar"; 
import AppHeader from "@/components/layout/header";
import SidebarNav from "@/components/layout/sidebar-nav";
import { Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import ChatFloatingButton from '@/components/chat/ChatFloatingButton';
import ChatWindow from '@/components/chat/ChatWindow';
import { useChatStore } from '@/stores/chatStore';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth'; 
// import useAuth from "@/hooks/use-auth"; // Not needed here as auth state is managed by chatStore/onAuthStateChanged
// import { checkUserRole } from "@/services/authRole"; // Role checks are disabled
// import { useRouter } from "next/navigation"; // Not needed if role checks are disabled
// import { APP_ROUTES } from "@/lib/routes"; // Not needed if role checks are disabled


interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  // const { user } = useAuth(); // useAuth provides a mock user, auth state for chat is handled below
  // const router = useRouter(); // Router not needed if role-based redirects are disabled
  const { setCurrentUser, currentUser } = useChatStore(); 
  
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName || "Usuário Anônimo", 
          avatarUrl: user.photoURL,
        });
      } else {
        setCurrentUser({ uid: null, displayName: null, avatarUrl: null });
      }
    });
    return () => unsubscribe(); 
  }, [setCurrentUser]);
  
  useEffect(() => {
    // Ensures a mock user is set for chat in development if Firebase auth is not active
    if (process.env.NODE_ENV === 'development' && !auth.currentUser && !currentUser?.uid) {
      setCurrentUser({
         uid: "dev-user-uid",
         displayName: "Dev User",
         avatarUrl: "https://placehold.co/40x40/orange/white?text=DU"
      });
    }
  }, [setCurrentUser, currentUser?.uid]);

  // useEffect(() => {
  //   const isAdminRoute = pathname.startsWith(APP_ROUTES.adminMetrics) || 
  //                        pathname.startsWith(APP_ROUTES.toolsBackup) ||
  //                        pathname.startsWith(APP_ROUTES.toolsAuditTrail);
    
  //   if (isAdminRoute) {
  //     checkUserRole("Admin").then(isAllowed => {
  //       if (!isAllowed) {
  //         router.replace('/'); 
  //       }
  //     });
  //   }
  // }, [pathname, router]);


  return (
    <SidebarProvider defaultOpen={defaultOpen} open={defaultOpen} onOpenChange={(open) => setDefaultOpen(open)}>
      <Sidebar collapsible="icon" variant="floating" side="left" asChild>
        <nav className="flex flex-col" role="navigation">
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Brain className="w-8 h-8 text-sidebar-primary" />
            <span className="font-headline text-2xl font-bold text-sidebar-primary group-data-[collapsible=icon]:hidden">Thalamus</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav currentPath={pathname} />
        </SidebarContent>
        <SidebarFooter className="p-2 group-data-[collapsible=icon]:hidden">
          {/* Footer content if any, e.g., version */}
        </SidebarFooter>
        </nav>
      </Sidebar>
      <SidebarInset>
        <header role="banner">
          <AppHeader />
        </header>
        <main role="main" className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto min-w-0">
          {children}
        </main>
        <footer role="contentinfo" className="sr-only" />
        <ChatFloatingButton />
        <ChatWindow />
      </SidebarInset>
    </SidebarProvider>
  );
}
