"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import DateNotesForm from "@/components/forms/date-notes-form";
import { NotebookPen } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function NotesPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <NotebookPen className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Anotações por Data</h1>
      </div>
      <CardDescription>Escolha uma data no calendário e registre suas notas.</CardDescription>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Selecione a Data</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar locale={ptBR} mode="single" selected={selectedDate} onSelect={setSelectedDate} />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">
              {selectedDate ? `Notas de ${format(selectedDate, "P", { locale: ptBR })}` : "Notas"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DateNotesForm key={selectedDate?.toISOString()} defaultDateTime={selectedDate ?? new Date()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
