
"use client";

import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // All sidebar, header, and chat functionalities have been removed
  // for debugging a Turbopack error.
  // The currentUser logic from useChatStore and Firebase auth listeners
  // have also been removed as they are tied to the chat components.

  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        The AppHeader, Sidebar, and Chat components have been removed.
        The main content is now rendered directly.
      */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
