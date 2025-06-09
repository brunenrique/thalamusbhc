
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Bell, CheckCheck, Trash2, Settings } from "lucide-react";
import Link from "next/link";
import NotificationItem from "@/components/notifications/notification-item";

const mockNotifications = [
  { id: "notif1", type: "task_assigned" as const, message: "Nova tarefa 'Preparar relatório para João D.' atribuída a você.", date: "2024-07-18T10:00:00Z", read: false, link: "/tasks/task5" },
  { id: "notif2", type: "appointment_reminder" as const, message: "Próximo agendamento com Alice W. em 1 hora.", date: "2024-07-19T09:00:00Z", read: false, link: "/schedule" },
  { id: "notif3", type: "assessment_completed" as const, message: "Bob B. completou o inventário GAD-7.", date: "2024-07-19T14:30:00Z", read: true, link: "/inventories-scales/asm2/results" },
  { id: "notif4", type: "system_update" as const, message: "PsiGuard será atualizado Domingo às 2h. Espere breve indisponibilidade.", date: "2024-07-17T16:00:00Z", read: true },
  { id: "notif5", type: "new_patient_waiting" as const, message: "Nova paciente 'Eva Green' adicionada à lista de espera.", date: "2024-07-20T11:00:00Z", read: false, link: "/waiting-list" },
];

export default function NotificationsPage() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Bell className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Notificações</h1>
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
              {unreadCount} Nova(s)
            </span>
          )}
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <CheckCheck className="mr-2 h-4 w-4" /> Marcar Todas como Lidas
            </Button>
            <Button variant="outline" asChild>
                <Link href="/settings?tab=notifications"> 
                    <Settings className="mr-2 h-4 w-4" /> Config. de Notificações
                </Link>
            </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Notificações Recentes</CardTitle>
          <CardDescription>Mantenha-se atualizado com alertas e mensagens importantes.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockNotifications.length > 0 ? (
            <div className="space-y-3">
              {mockNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhuma notificação</h3>
              <p className="mt-1 text-sm text-muted-foreground">Você está em dia!</p>
            </div>
          )}
        </CardContent>
        {mockNotifications.length > 0 && (
            <CardFooter className="border-t pt-4 flex justify-end">
                <Button variant="destructive" className="bg-destructive/90 hover:bg-destructive text-destructive-foreground">
                    <Trash2 className="mr-2 h-4 w-4" /> Limpar Notificações Lidas
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
