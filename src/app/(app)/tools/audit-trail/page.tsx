
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, Filter, UserCircle, Edit3, ShieldAlert, Info, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


const mockAuditLogs = [
  { id: "log1", timestamp: "2024-07-21T10:05:15Z", user: "admin@psiguard.com", action: "Login de Usuário", details: "Login bem-sucedido do IP 192.168.1.10", entity: "Usuário", entityId: "admin001", severity: "Informativo" },
  { id: "log2", timestamp: "2024-07-21T10:15:30Z", user: "dr.silva@psiguard.com", action: "Prontuário Visualizado", details: "Visualizou prontuário de Alice W.", entity: "Paciente", entityId: "pat001", severity: "Informativo" },
  { id: "log3", timestamp: "2024-07-21T10:20:00Z", user: "secretaria@psiguard.com", action: "Agendamento Criado", details: "Novo agendamento para Bob B. em 2024-07-28", entity: "Agendamento", entityId: "appt015", severity: "Informativo" },
  { id: "log4", timestamp: "2024-07-20T15:00:00Z", user: "Sistema", action: "Aprovação de Usuário", details: "Usuário 'novo.psico@example.com' aprovado por admin@psiguard.com", entity: "Usuário", entityId: "usr123", severity: "Médio" },
  { id: "log5", timestamp: "2024-07-20T09:30:45Z", user: "desconhecido@externo.com", action: "Tentativa de Login Falhou", details: "Credenciais inválidas do IP 203.0.113.45", entity: "Sistema", entityId: null, severity: "Alto" },
  { id: "log6", timestamp: "2024-07-22T08:00:10Z", user: "dr.jones@psiguard.com", action: "Configurações Atualizadas", details: "Alterou a duração padrão da sessão para 60 minutos.", entity: "Configurações", entityId: "schedule_settings", severity: "Médio" },
  { id: "log7", timestamp: "2024-07-22T09:15:00Z", user: "admin@psiguard.com", action: "Backup Manual Iniciado", details: "Backup completo dos dados iniciado manualmente.", entity: "Sistema", entityId: null, severity: "Informativo" },
  { id: "log8", timestamp: "2024-07-22T11:05:00Z", user: "dr.silva@psiguard.com", action: "Nota de Sessão Deletada", details: "Nota da sessão de 2024-07-15 para Charlie B. foi deletada.", entity: "Nota de Sessão", entityId: "sn005", severity: "Alto" },
];

type LogSeverity = "Informativo" | "Médio" | "Alto";

const severityMap: Record<LogSeverity, { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    Informativo: { label: "Info", icon: <Info className="h-3.5 w-3.5 mr-1" />, variant: "outline" },
    Médio: { label: "Médio", icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />, variant: "secondary" },
    Alto: { label: "Alto", icon: <ShieldAlert className="h-3.5 w-3.5 mr-1" />, variant: "destructive" }
};


export default function AuditTrailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <History className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Trilha de Auditoria</h1>
      </div>
      <CardDescription>
        Monitore e rastreie todas as atividades significativas do sistema, modificações de dados e ações de usuários para garantir a segurança, conformidade e responsabilidade.
      </CardDescription>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Logs de Atividade do Sistema</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <div className="relative flex-1">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar logs (ex: email, ação, IP, ID da entidade)" className="pl-8" />
                </div>
                <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filtrar (Data, Usuário, Ação, Severidade)
                </Button>
            </div>
        </CardHeader>
        <CardContent>
          {mockAuditLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Data/Hora</TableHead>
                    <TableHead className="min-w-[200px]">Usuário</TableHead>
                    <TableHead className="min-w-[180px]">Ação</TableHead>
                    <TableHead className="min-w-[150px]">Entidade (ID)</TableHead>
                    <TableHead>Detalhes</TableHead>
                    <TableHead className="min-w-[120px]">Severidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAuditLogs.map(log => (
                    <TableRow key={log.id} className="hover:bg-muted/20">
                      <TableCell className="text-xs whitespace-nowrap">{format(new Date(log.timestamp), "Pp", { locale: ptBR })}</TableCell>
                      <TableCell className="text-xs flex items-center gap-1.5">
                          {log.user === "Sistema" || log.user.includes("desconhecido") ? <ShieldAlert className="h-4 w-4 text-muted-foreground"/> : <UserCircle className="h-4 w-4 text-muted-foreground"/> } 
                          {log.user}
                      </TableCell>
                      <TableCell className="text-xs">{log.action}</TableCell>
                      <TableCell className="text-xs">{log.entity}{log.entityId ? ` (${log.entityId})` : ''}</TableCell>
                      <TableCell className="text-xs max-w-md truncate" title={log.details}>{log.details}</TableCell>
                      <TableCell>
                        <Badge variant={severityMap[log.severity as LogSeverity]?.variant || "outline"} className="text-xs whitespace-nowrap">
                          {severityMap[log.severity as LogSeverity]?.icon}
                          {severityMap[log.severity as LogSeverity]?.label || log.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <History className="mx-auto h-12 w-12" />
              <p className="mt-2">Nenhum log de auditoria encontrado para os critérios selecionados.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
