"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

interface ChatSummary {
  id: string;
  participant: string;
  lastMessage: string;
  lastDate: string; // ISO
}

const mockChats: ChatSummary[] = [
  { id: "chat1", participant: "Alice Wonderland", lastMessage: "Oi, só confirmando nosso horário", lastDate: "2024-07-20T14:35:00Z" },
  { id: "chat2", participant: "Bob Marley", lastMessage: "Obrigado pela última sessão", lastDate: "2024-07-18T09:10:00Z" },
  { id: "chat3", participant: "Charlie Brown", lastMessage: "Quando será nosso próximo encontro?", lastDate: "2024-07-17T16:45:00Z" },
];

export default function ChatHistoryPage() {
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
          <CardTitle className="font-headline">Conversas Passadas</CardTitle>
        </CardHeader>
        <CardContent>
          {mockChats.length > 0 ? (
            <div className="space-y-3">
              {mockChats.map(chat => (
                <Link key={chat.id} href={`/chat/${chat.id}`} className="block p-3 border rounded-md hover:bg-secondary/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{chat.participant}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{chat.lastMessage}</p>
                    </div>
                    <time className="text-xs text-muted-foreground">
                      {format(new Date(chat.lastDate), "P", { locale: ptBR })}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhuma conversa encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">Inicie um chat para que ele apareça aqui.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
