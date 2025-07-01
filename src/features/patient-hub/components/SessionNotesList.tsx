// src/features/patient-hub/components/SessionNotesList.tsx
import * as React from "react";
import { SessionNote } from "@/types/patient-hub";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Skeleton } from "@/components/atoms/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SessionNotesListProps {
  data: SessionNote[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const SessionNotesList: React.FC<SessionNotesListProps> = ({ data, isLoading, isError }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Anotações de Sessão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Anotações de Sessão</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erro ao carregar as anotações de sessão.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Anotações de Sessão</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-foreground">Nenhuma anotação de sessão encontrada.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Anotações de Sessão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((note) => (
          <div key={note.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <p className="text-sm text-secondary-foreground">{format(new Date(note.date), "PPP", { locale: ptBR })}</p>
            <h3 className="text-lg font-semibold text-foreground mb-1">{note.title}</h3>
            <p className="text-sm text-secondary-foreground line-clamp-2">{note.content}</p>
            {/* Adicionar link para ver detalhes da anotação */}
            <button className="text-primary text-sm mt-2 hover:underline">Ver mais</button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
