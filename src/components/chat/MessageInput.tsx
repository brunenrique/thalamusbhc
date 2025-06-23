"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { db } from '@/lib/firebase'; // Alterado de @/services/firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import * as Sentry from '@sentry/nextjs';

interface MessageInputProps {
  chatId: string;
}

export default function MessageInput({ chatId }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState('');
  const { currentUser } = useChatStore();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (newMessage.trim() === '' || !currentUser?.uid || !currentUser?.displayName) {
      if (!currentUser?.uid) {
        toast({
          title: "Erro de Autenticação",
          description: "Você precisa estar logado para enviar mensagens.",
          variant: "destructive",
        });
      }
      return;
    }

    setIsSending(true);
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        senderAvatar: currentUser.avatarUrl || null,
        text: newMessage.trim(),
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error sending message: ", error);
      toast({
        title: "Erro ao Enviar Mensagem",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-3 border-t bg-background">
      <Textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite sua mensagem..."
        className="flex-1 resize-none min-h-[40px] max-h-[120px] text-sm rounded-lg"
        rows={1}
        disabled={!currentUser?.uid || isSending}
        aria-label="Digite sua mensagem"
      />
      <Button
        type="submit"
        size="icon"
        className="h-10 w-10 bg-accent hover:bg-accent/90 text-accent-foreground"
        disabled={!currentUser?.uid || newMessage.trim() === '' || isSending}
        aria-label="Enviar mensagem"
      >
        {isSending ? <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
    </form>
  );
}
