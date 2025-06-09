
"use client";

import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import MessageItem from './MessageItem';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useChatStore } from '@/stores/chatStore';
import { AlertTriangle, MessagesSquare } from 'lucide-react';

interface MessageListProps {
  chatId: string;
}

export default function MessageList({ chatId }: MessageListProps) {
  const { messages, loading, error } = useChatMessages(chatId);
  const currentUser = useChatStore((state) => state.currentUser);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4">
        <Skeleton className="h-12 w-3/4 rounded-lg" />
        <Skeleton className="h-16 w-1/2 rounded-lg self-end ml-auto" />
        <Skeleton className="h-10 w-2/3 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-destructive">
        <AlertTriangle className="h-10 w-10 mb-2" />
        <p className="text-sm font-medium">Erro ao carregar mensagens.</p>
        <p className="text-xs text-center">Não foi possível conectar ao chat. Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-muted-foreground">
        <MessagesSquare className="h-12 w-12 mb-2" />
        <p className="text-sm font-medium">Nenhuma mensagem ainda.</p>
        <p className="text-xs">Envie a primeira mensagem para iniciar a conversa!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
       <div ref={viewportRef} className="h-full"> {/* This div becomes the viewport for ScrollArea */}
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isOwnMessage={msg.senderId === currentUser?.uid}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
