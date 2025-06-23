
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import logger from '@/lib/logger';
import { Save, SlidersHorizontal } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SettingsFormProps {
  section: "general" | "account" | "appearance" | "notifications" | "schedule" | "modules";
}

const timezones = [
  { value: "America/Sao_Paulo", label: "Horário de Brasília (GMT-3)" },
  { value: "America/Manaus", label: "Horário do Amazonas (GMT-4)" },
  { value: "America/Noronha", label: "Horário de Noronha (GMT-2)" },
  { value: "Europe/Lisbon", label: "Horário de Lisboa (GMT+0/GMT+1)" },
];

// Consistent day mapping: id for logic, label for display
const daysOfWeekMap = [
  { id: "sunday", label: "Domingo", defaultChecked: false, defaultStartTime: "10:00", defaultEndTime: "14:00" },
  { id: "monday", label: "Segunda-feira", defaultChecked: true, defaultStartTime: "09:00", defaultEndTime: "18:00" },
  { id: "tuesday", label: "Terça-feira", defaultChecked: true, defaultStartTime: "09:00", defaultEndTime: "18:00" },
  { id: "wednesday", label: "Quarta-feira", defaultChecked: true, defaultStartTime: "09:00", defaultEndTime: "18:00" },
  { id: "thursday", label: "Quinta-feira", defaultChecked: true, defaultStartTime: "09:00", defaultEndTime: "18:00" },
  { id: "friday", label: "Sexta-feira", defaultChecked: true, defaultStartTime: "09:00", defaultEndTime: "18:00" },
  { id: "saturday", label: "Sábado", defaultChecked: false, defaultStartTime: "10:00", defaultEndTime: "14:00" },
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

  const [workingDays, setWorkingDays] = React.useState<Record<string, boolean>>(
    daysOfWeekMap.reduce((acc, day) => {
      acc[day.id] = day.defaultChecked;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleWorkingDayChange = (dayId: string, checked: boolean) => {
    setWorkingDays(prev => ({ ...prev, [dayId]: checked }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would persist these settings
    logger.info({ action: 'save_settings_simulated', meta: { workingDays } });
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
            <Input id="clinicName" defaultValue="Thalamus Clínica de Bem-Estar" />
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
            <Label>Dias Úteis da Clínica (Geral)</Label>
            <Card className="p-3 bg-muted/20">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {daysOfWeekMap.map(day => (
                      <div key={`clinic-workday-${day.id}`} className="flex items-center space-x-2">
                          <Checkbox id={`clinic-workday-${day.id}`} defaultChecked={day.defaultChecked} />
                          <Label htmlFor={`clinic-workday-${day.id}`} className="font-normal">{day.label}</Label>
                      </div>
                  ))}
              </div>
            </Card>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="enableOnlineBooking" defaultChecked aria-checked={true} />
            <Label htmlFor="enableOnlineBooking">Permitir Agendamento Online por Pacientes (pode ser gerenciado em Funcionalidades)</Label>
          </div>
        </>
      )}

      {section === "account" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input id="fullName" defaultValue="Dr(a). Alex Silva" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Endereço de Email</Label>
            <Input id="email" type="email" defaultValue="alex.silva@thalamus.app" />
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
            <Switch id="inAppTaskAlerts" defaultChecked aria-checked={true} />
            <Label htmlFor="inAppTaskAlerts">Alertas de Tarefa</Label>
          </div>
           <div className="flex items-center space-x-2">
            <Switch id="inAppSystemMessages" defaultChecked aria-checked={true} />
            <Label htmlFor="inAppSystemMessages">Mensagens e Atualizações do Sistema</Label>
          </div>
        </>
      )}

      {section === "schedule" && (
        <>
          <Card className="bg-muted/20 p-4">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg">Horários Gerais da Clínica</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="workStartTime">Horário Padrão de Início do Expediente (Clínica)</Label>
                    <Input id="workStartTime" type="time" defaultValue="09:00" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="workEndTime">Horário Padrão de Término do Expediente (Clínica)</Label>
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
                <Switch id="externalCalendarSync" defaultChecked aria-checked={true} />
                <Label htmlFor="externalCalendarSync">Habilitar Integração com Calendário Externo (ex: Google Agenda)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="allowPatientSelfReschedule" aria-checked={false} />
                <Label htmlFor="allowPatientSelfReschedule">Permitir que Pacientes Remarquem/Cancelem Online (dentro das regras)</Label>
              </div>
            </CardContent>
          </Card>
          
          <Separator />

          <Card className="bg-muted/20 p-4">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg">Minha Disponibilidade Semanal Padrão</CardTitle>
              <CardDescription>Defina seus dias e horários de trabalho. Isso determinará quais dias são visíveis e ativos na sua agenda.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {daysOfWeekMap.map((day) => (
                <div key={`availability-${day.id}`} className="p-3 border rounded-md bg-background shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`workday-active-${day.id}`} className="text-base font-medium">{day.label}</Label>
                    <Switch
                      id={`workday-active-${day.id}`}
                      checked={workingDays[day.id]}
                      onCheckedChange={(checked) => handleWorkingDayChange(day.id, !!checked)}
                      aria-label={`Trabalha na ${day.label}`}
                    />
                  </div>
                  {workingDays[day.id] && (
                    <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t">
                      <div className="space-y-1">
                        <Label htmlFor={`workday-start-${day.id}`} className="text-xs">Início</Label>
                        <Input id={`workday-start-${day.id}`} type="time" defaultValue={day.defaultStartTime} className="h-8 text-sm"/>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`workday-end-${day.id}`} className="text-xs">Fim</Label>
                        <Input id={`workday-end-${day.id}`} type="time" defaultValue={day.defaultEndTime} className="h-8 text-sm"/>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
          <Separator />
          {/* Seção "Preferências de Visualização da Agenda" removida */}
        </>
      )}

      {section === "modules" && (
        <>
          <p className="text-lg font-semibold">Controle de Funcionalidades</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
              <div className="space-y-0.5">
                <Label htmlFor="enableAIAnalysis" className="text-base font-medium">Análise de IA para Notas de Sessão</Label>
                <p className="text-xs text-muted-foreground">
                  Habilita sugestões e insights automáticos baseados no conteúdo das suas anotações de sessão.
                </p>
              </div>
              <Switch id="enableAIAnalysis" defaultChecked aria-checked={true} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
              <div className="space-y-0.5">
                <Label htmlFor="enableAIReports" className="text-base font-medium">Geração de Relatórios com IA</Label>
                <p className="text-xs text-muted-foreground">
                  Permite que a IA ajude a rascunhar relatórios de progresso, cartas de encaminhamento, etc.
                </p>
              </div>
              <Switch id="enableAIReports" defaultChecked aria-checked={true} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
              <div className="space-y-0.5">
                <Label htmlFor="enableFinancialModule" className="text-base font-medium">Módulo Financeiro</Label>
                <p className="text-xs text-muted-foreground">
                  Gerencie pagamentos, faturas e despesas (Funcionalidade em breve).
                </p>
              </div>
              <Switch id="enableFinancialModule" disabled aria-checked={false} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
              <div className="space-y-0.5">
                <Label htmlFor="enablePatientPortal" className="text-base font-medium">Portal do Paciente</Label>
                <p className="text-xs text-muted-foreground">
                  Permite que pacientes acessem informações, agendem consultas e preencham avaliações online (Funcionalidade em breve).
                </p>
              </div>
              <Switch id="enablePatientPortal" disabled aria-checked={false} />
            </div>
            
            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
              <div className="space-y-0.5">
                <Label htmlFor="enableOnlineBookingFeature" className="text-base font-medium">Agendamento Online por Pacientes</Label>
                <p className="text-xs text-muted-foreground">
                  Permite que pacientes solicitem ou marquem agendamentos através de um link público ou portal.
                </p>
              </div>
              <Switch id="enableOnlineBookingFeature" defaultChecked aria-checked={true} />
            </div>

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
