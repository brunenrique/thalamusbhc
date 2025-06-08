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

export default function SettingsForm({ section }: SettingsFormProps) {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Salvando configurações para ${section}...`, new FormData(event.currentTarget));
    toast({
      title: "Configurações Salvas",
      description: `As configurações de ${section.charAt(0).toUpperCase() + section.slice(1)} foram atualizadas.`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {section === "general" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="clinicName">Nome da Clínica</Label>
            <Input id="clinicName" defaultValue="Minha Clínica de Psicologia" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clinicAddress">Endereço da Clínica</Label>
            <Input id="clinicAddress" defaultValue="Rua do Bem-Estar, 123, Cidade Plena" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="enableOnlineBooking" />
            <Label htmlFor="enableOnlineBooking">Habilitar Agendamento Online</Label>
          </div>
        </>
      )}

      {section === "account" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input id="fullName" defaultValue="Dr(a). João Silva" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Endereço de Email</Label>
            <Input id="email" type="email" defaultValue="joao.silva@example.com" />
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
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="workStartTime">Horário Padrão de Início do Trabalho</Label>
                <Input id="workStartTime" type="time" defaultValue="09:00" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="workEndTime">Horário Padrão de Término do Trabalho</Label>
                <Input id="workEndTime" type="time" defaultValue="17:00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionDuration">Duração Padrão da Sessão (minutos)</Label>
            <Input id="sessionDuration" type="number" defaultValue="50" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="externalCalendarSync" />
            <Label htmlFor="externalCalendarSync">Habilitar Integração com Calendário Externo (ex: Google Agenda)</Label>
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
