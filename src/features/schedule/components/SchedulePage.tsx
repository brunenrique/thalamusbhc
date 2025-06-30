"use client";

import * as React from "react";
import { addDays, format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Mock data for appointments
const mockAppointments = [
  {
    date: new Date(),
    patientName: "João da Silva",
    time: "10:00",
  },
  {
    date: new Date(),
    patientName: "Maria Oliveira",
    time: "11:30",
  },
  {
    date: addDays(new Date(), 2),
    patientName: "Carlos Pereira",
    time: "14:00",
  },
  {
    date: addDays(new Date(), 5),
    patientName: "Ana Souza",
    time: "09:00",
  },
];

export function SchedulePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [appointments, setAppointments] =
    React.useState(mockAppointments);

  const selectedDayAppointments = date
    ? appointments.filter((appointment) => isSameDay(appointment.date, date))
    : [];

  const appointmentDays = appointments.map((appointment) => appointment.date);

  return (
    <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-3">
      <div className="col-span-1 flex flex-col gap-4 md:col-span-2">
        <Card>
          <CardContent className="p-2">
            <Calendar
              locale={ptBR}
              mode="single"
              selected={date}
              onSelect={setDate}
              modifiers={{
                scheduled: appointmentDays,
              }}
              modifiersClassNames={{
                scheduled: "bg-primary/20 text-primary-foreground rounded-full",
              }}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Compromissos para {date ? format(date, "PPP", { locale: ptBR }) : "Nenhum dia selecionado"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {selectedDayAppointments.length > 0 ? (
              selectedDayAppointments.map((appointment, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {appointment.patientName}
                    </CardTitle>
                    <CardDescription>{appointment.time}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <p>Nenhum compromisso para este dia.</p>
            )}
          </CardContent>
        </Card>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Novo Agendamento</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input placeholder="Nome do Paciente" />
              <Input type="time" placeholder="Horário" />
              <Button
                onClick={() => {
                  // Lógica para adicionar novo agendamento
                }}
              >
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
