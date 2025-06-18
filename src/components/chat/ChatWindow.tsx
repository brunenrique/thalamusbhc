
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Users } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { cn } from '@/shared/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function ChatWindow() {
  const { isChatOpen, closeChat, currentChatId, onlineUsers, currentUser } = useChatStore();

  if (!isChatOpen || !currentUser?.uid) {
    return null;
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() || '';
    return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
  };

  return (
    <Card
      className={cn(
        "fixed bottom-[calc(4rem+1.5rem+1.5rem)] right-6 z-40 w-[360px] h-[500px] shadow-xl rounded-lg flex flex-col bg-card border",
        "transition-all duration-300 ease-in-out",
        isChatOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
      role="log"
      aria-live="polite"
    >
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
        <div>
          <CardTitle className="text-base font-semibold font-headline">Chat Global da Clínica</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" /> {onlineUsers.length} online
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={closeChat}
          className="flex items-center gap-2 text-sm font-medium"
          aria-label="Fechar chat"
        >
          <X className="h-4 w-4" /> Fechar
        </Button>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        <div className="p-2 border-b bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground mb-1.5 px-2">Online:</p>
          <div className="flex gap-2 overflow-x-auto pb-1 px-2">
            {onlineUsers.map(user => (
              <div key={user.id} className="flex flex-col items-center w-12" title={user.name}>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="avatar" />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <p className="text-[10px] text-muted-foreground truncate w-full text-center">{user.name.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </div>

        <MessageList chatId={currentChatId} />
      </CardContent>

      <CardFooter className="p-0 border-t">
        <MessageInput chatId={currentChatId} />
      </CardFooter>
    </Card>
  );
}

    