
"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/useChatMessages';

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0][0]?.toUpperCase() || '';
  return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
};

export default function MessageItem({ message, isOwnMessage }: MessageItemProps) {
  const formattedTimestamp = message.timestamp
    ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true, locale: ptBR })
    : 'Enviando...';

  return (
    <div className={cn("flex gap-2.5 py-2", isOwnMessage ? "justify-end" : "justify-start")}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.senderAvatar || undefined} alt={message.senderName} data-ai-hint="avatar" />
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            {getInitials(message.senderName)}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-3 py-2 text-sm shadow-sm",
          isOwnMessage
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card text-card-foreground rounded-bl-none border"
        )}
      >
        {!isOwnMessage && (
          <p className="text-xs font-semibold mb-0.5 text-accent">{message.senderName}</p>
        )}
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <p className={cn("text-xs mt-1", isOwnMessage ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left")}>
          {formattedTimestamp}
        </p>
      </div>
      {isOwnMessage && (
         <Avatar className="h-8 w-8">
          <AvatarImage src={message.senderAvatar || undefined} alt={message.senderName} data-ai-hint="avatar" />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {getInitials(message.senderName)}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
