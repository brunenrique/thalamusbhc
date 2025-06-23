"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, MessagesSquare } from "lucide-react";
import { collection, query, orderBy, onSnapshot, Timestamp, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useChatStore } from "@/stores/chatStore";
import type { Message } from "@/hooks/useChatMessages";
import MessageItem from "@/components/chat/MessageItem";

export default function ChatHistoryPage() {
  const { currentUser } = useChatStore();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!currentUser?.uid) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const messagesRef = collection(db, "chats", currentUser.uid, "messages");
    const q = query(messagesRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Message[] = [];
        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            senderId: data.senderId,
            senderName: data.senderName,
            senderAvatar: data.senderAvatar ?? null,
            text: data.text,
            timestamp: data.timestamp as Timestamp | null,
          });
        });
        setMessages(list.reverse());
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Histórico de Chats</h1>
      </div>
      <CardDescription>
        Revise as conversas anteriores mantidas através do chat da clínica.
      </CardDescription>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Mensagens</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Carregando...</div>
          ) : messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} isOwnMessage={msg.senderId === currentUser?.uid} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <MessagesSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhuma mensagem encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">Inicie um chat para que ele apareça aqui.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
