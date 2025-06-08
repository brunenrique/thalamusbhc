
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, DownloadCloud, History, Settings2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label"; // Using ShadCN Label now
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


export default function BackupPage() {
  const lastBackupDate = new Date("2024-07-20T02:00:00Z");
  const nextBackupDate = new Date("2024-07-21T02:00:00Z");
  const backupStatus = "Bem-sucedido"; // "Em Progresso", "Falhou"
  const backupProgress = backupStatus === "Em Progresso" ? 65 : (backupStatus === "Bem-sucedido" ? 100 : 0) ; 

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Archive className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Backup e Restauração de Dados</h1>
      </div>
      <CardDescription>
        Gerencie os backups de dados da sua clínica. Garanta que seus dados estejam seguros e possam ser restaurados quando necessário.
      </CardDescription>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Status do Backup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm"><strong>Último Backup:</strong> {format(lastBackupDate, "P 'às' HH:mm", { locale: ptBR })}</p>
            <p className="text-sm"><strong>Status:</strong> <span className={`font-semibold ${backupStatus === "Bem-sucedido" ? "text-green-600" : (backupStatus === "Falhou" ? "text-red-600" : "text-blue-600")}`}>{backupStatus}</span></p>
            <p className="text-sm"><strong>Próximo Backup Agendado:</strong> {format(nextBackupDate, "P 'às' HH:mm", { locale: ptBR })}</p>
            {backupStatus === "Em Progresso" && (
              <div>
                <Label htmlFor="backupProgress" className="text-sm">Progresso Atual:</Label>
                <Progress value={backupProgress} id="backupProgress" className="w-full mt-1" />
                <p className="text-xs text-muted-foreground text-right">{backupProgress}%</p>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <DownloadCloud className="mr-2 h-4 w-4" /> Iniciar Backup Manual
              </Button>
              <Button variant="outline">
                <Settings2 className="mr-2 h-4 w-4" /> Configurações de Backup
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Restaurar Dados</CardTitle>
            <CardDescription>Restaure dados de um ponto de backup anterior.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Selecione um backup do histórico para restaurar. Restaurar dados substituirá os dados atuais pelo backup selecionado. Esta ação é irreversível.
            </p>
            <Button variant="destructive" disabled> 
              <History className="mr-2 h-4 w-4" /> Restaurar do Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Histórico de Backup</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="text-center py-6 text-muted-foreground">
                <History className="mx-auto h-10 w-10" />
                <p className="mt-2">Nenhum histórico de backup disponível ainda.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
