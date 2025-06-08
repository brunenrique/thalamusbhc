
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, Filter, UserCircle, Edit3, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


const mockAuditLogs = [
  { id: "log1", timestamp: "2024-07-21T10:05:15Z", user: "admin@psiguard.com", action: "Login de Usuário", details: "Login bem-sucedido do IP 192.168.1.10", entity: "Usuário", entityId: "admin001", severity: "Info" },
  { id: "log2", timestamp: "2024-07-21T10:15:30Z", user: "dr.silva@psiguard.com", action: "Prontuário Visualizado", details: "Visualizou prontuário de Alice W.", entity: "Paciente", entityId: "pat001", severity: "Info" },
  { id: "log3", timestamp: "2024-07-21T10:20:00Z", user: "secretaria@psiguard.com", action: "Agendamento Criado", details: "Novo agendamento para Bob B. em 2024-07-28", entity: "Agendamento", entityId: "appt015", severity: "Info" },
  { id: "log4", timestamp: "2024-07-20T15:00:00Z", user: "Sistema", action: "Aprovação de Usuário", details: "Usuário 'novo.psico@example.com' aprovado por admin@psiguard.com", entity: "Usuário", entityId: "usr123", severity: "Média" },
  { id: "log5", timestamp: "2024-07-20T09:30:45Z", user: "desconhecido@externo.com", action: "Tentativa de Login Falhou", details: "Credenciais inválidas do IP 203.0.113.45", entity: "Sistema", entityId: null, severity: "Alta" },
];

const severityLabels: Record<string, string> = {
    Info: "Info",
    Medium: "Média",
    High: "Alta"
}

export default function AuditTrailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <History className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Trilha de Auditoria</h1>
      </div>
      <CardDescription>
        Rastreie atividades do sistema, modificações de dados e ações de usuários para segurança e conformidade.
      </CardDescription>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Logs de Atividade</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <div className="relative flex-1">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar logs (ex: email do usuário, ação, IP)" className="pl-8" />
                </div>
                <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filtros (Data, Usuário, Tipo de Ação)
                </Button>
            </div>
        </CardHeader>
        <CardContent>
          {mockAuditLogs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead>Severidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAuditLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs">{format(new Date(log.timestamp), "Pp", { locale: ptBR })}</TableCell>
                    <TableCell className="flex items-center gap-1 text-xs">
                        {log.severity === "Alta" ? <ShieldAlert className="h-4 w-4 text-destructive"/> : <UserCircle className="h-4 w-4 text-muted-foreground"/> } 
                        {log.user}
                    </TableCell>
                    <TableCell className="text-xs">{log.action}</TableCell>
                    <TableCell className="text-xs">{log.entity}{log.entityId ? ` (${log.entityId})` : ''}</TableCell>
                    <TableCell className="text-xs max-w-sm truncate">{log.details}</TableCell>
                    <TableCell>
                      <Badge variant={
                        log.severity === "Alta" ? "destructive" : 
                        log.severity === "Média" ? "secondary" : "outline"
                      } className="text-xs">
                        {severityLabels[log.severity] || log.severity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
