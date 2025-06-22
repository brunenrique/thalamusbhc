
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/shared/utils';

export default function ChatFloatingButton() {
  const isChatOpen = useChatStore((s) => s.isChatOpen);
  const toggleChat = useChatStore((s) => s.toggleChat);
  const currentUser = useChatStore((s) => s.currentUser);

  if (!currentUser?.uid) {
    return null; // Don't show chat button if user is not logged in
  }

  return (
    <Button
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50 transition-all duration-300 ease-in-out",
        "bg-accent hover:bg-accent/90 text-accent-foreground",
        isChatOpen ? "bg-destructive hover:bg-destructive/90" : ""
      )}
      onClick={toggleChat}
      aria-label={isChatOpen ? "Fechar chat" : "Abrir chat"}
      aria-expanded={isChatOpen}
    >
      {isChatOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
    </Button>
  );
}
