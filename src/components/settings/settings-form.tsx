
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

interface SettingsFormProps {
  section: "general" | "account" | "appearance" | "notifications" | "schedule";
}

const timezones = [
  { value: "America/Sao_Paulo", label: "Horário de Brasília (GMT-3)" },
  { value: "America/Manaus", label: "Horário do Amazonas (GMT-4)" },
  { value: "America/Noronha", label: "Horário de Noronha (GMT-2)" },
  { value: "Europe/Lisbon", label: "Horário de Lisboa (GMT+0/GMT+1)" },
];

const daysOfWeek = [
  { id: "monday", label: "Segunda-feira" },
  { id: "tuesday", label: "Terça-feira" },
  { id: "wednesday", label: "Quarta-feira" },
  { id: "thursday", label: "Quinta-feira" },
  { id: "friday", label: "Sexta-feira" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
];

const reminderOptions = [
  { value: "none", label: "Nenhum" },
  { value: "1h", label: "1 hora antes" },
  { value: "2h", label: "2 horas antes" },
  { value: "24h", label: "24 horas antes" },
  { value: "48h", label: "48 horas antes" },
];

export default function SettingsForm({ section }: SettingsFormProps) {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log(`Salvando configurações para ${section}...`, new FormData(event.currentTarget));
    toast({
      title: "Configurações Salvas (Simulado)",
      description: `As configurações de ${section.charAt(0).toUpperCase() + section.slice(1)} foram atualizadas.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {section === "general" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="clinicName">Nome da Clínica</Label>
            <Input id="clinicName" defaultValue="PsiGuard Clínica de Bem-Estar" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clinicAddress">Endereço da Clínica</Label>
            <Input id="clinicAddress" defaultValue="Rua da Serenidade, 123, Bairro Harmonia, Cidade Paz" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="clinicTimezone">Fuso Horário Padrão da Clínica</Label>
            <Select defaultValue="America/Sao_Paulo">
              <SelectTrigger id="clinicTimezone">
                <SelectValue placeholder="Selecione o fuso horário" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map(tz => (
                  <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label>Dias Úteis da Clínica</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {daysOfWeek.map(day => (
                    <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox id={`workday-${day.id}`} defaultChecked={day.id !== 'saturday' && day.id !== 'sunday'} />
                        <Label htmlFor={`workday-${day.id}`} className="font-normal">{day.label}</Label>
                    </div>
                ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="enableOnlineBooking" defaultChecked />
            <Label htmlFor="enableOnlineBooking">Permitir Agendamento Online por Pacientes</Label>
          </div>
        </>
      )}

      {section === "account" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input id="fullName" defaultValue="Dr(a). Carlos Silva" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Endereço de Email</Label>
            <Input id="email" type="email" defaultValue="carlos.silva@psiguard.app" />
          </div>
          <Button variant="outline" type="button">Alterar Senha</Button>
        </>
      )}
      
      {section === "appearance" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select defaultValue="system">
              <SelectTrigger id="theme">
                <SelectValue placeholder="Selecione o tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="system">Padrão do Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="fontSize">Tamanho da Fonte</Label>
            <Select defaultValue="medium">
              <SelectTrigger id="fontSize">
                <SelectValue placeholder="Selecione o tamanho da fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Pequeno</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {section === "notifications" && (
        <>
          <p className="font-medium">Notificações por Email</p>
          <div className="flex items-center space-x-2">
            <Checkbox id="appointmentReminders" defaultChecked/>
            <Label htmlFor="appointmentReminders">Lembretes de Agendamento</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="taskUpdates" defaultChecked/>
            <Label htmlFor="taskUpdates">Atualizações e Lembretes de Tarefas</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="assessmentNotifications" defaultChecked/>
            <Label htmlFor="assessmentNotifications">Notificações de Avaliação (Enviada/Concluída)</Label>
          </div>
          <p className="font-medium pt-4">Notificações no Aplicativo</p>
           <div className="flex items-center space-x-2">
            <Switch id="inAppTaskAlerts" defaultChecked />
            <Label htmlFor="inAppTaskAlerts">Alertas de Tarefa</Label>
          </div>
           <div className="flex items-center space-x-2">
            <Switch id="inAppSystemMessages" defaultChecked />
            <Label htmlFor="inAppSystemMessages">Mensagens e Atualizações do Sistema</Label>
          </div>
        </>
      )}

      {section === "schedule" && (
        <>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="workStartTime">Horário Padrão de Início do Expediente</Label>
                <Input id="workStartTime" type="time" defaultValue="09:00" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="workEndTime">Horário Padrão de Término do Expediente</Label>
                <Input id="workEndTime" type="time" defaultValue="18:00" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="sessionDuration">Duração Padrão da Sessão (minutos)</Label>
                <Input id="sessionDuration" type="number" defaultValue="50" min="15" step="5" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="intervalBetweenAppointments">Tempo de Intervalo Padrão Entre Consultas (minutos)</Label>
                <Input id="intervalBetweenAppointments" type="number" defaultValue="10" min="0" step="5" />
            </div>
          </div>
           <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="cancellationNotice">Tempo Mínimo de Antecedência para Cancelamento (horas)</Label>
                <Input id="cancellationNotice" type="number" defaultValue="24" min="1" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="autoReminderTime">Lembrete Automático Principal</Label>
                <Select defaultValue="24h">
                    <SelectTrigger id="autoReminderTime">
                        <SelectValue placeholder="Selecione o tempo do lembrete" />
                    </SelectTrigger>
                    <SelectContent>
                        {reminderOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="externalCalendarSync" defaultChecked />
            <Label htmlFor="externalCalendarSync">Habilitar Integração com Calendário Externo (ex: Google Agenda)</Label>
          </div>
           <div className="flex items-center space-x-2">
            <Switch id="allowPatientSelfReschedule" />
            <Label htmlFor="allowPatientSelfReschedule">Permitir que Pacientes Remarquem/Cancelem Online (dentro das regras)</Label>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Save className="mr-2 h-4 w-4" /> Salvar Alterações
        </Button>
      </div>
    </form>
  );
}
