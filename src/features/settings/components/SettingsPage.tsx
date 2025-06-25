import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/atoms/card";
import { Label } from "@/atoms/label";
import { Input } from "@/atoms/input";
import { Button } from "@/atoms/button";

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
       <div className="space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações e preferências da sua conta.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" defaultValue="Dr. Silva" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" defaultValue="d.silva@thalamus.io" />
          </div>
           <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Configurações do Sistema</CardTitle>
          <CardDescription>
            Ajuste as configurações de todo o sistema, como horário de trabalho e duração da sessão.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="work-start">Início do Horário de Trabalho</Label>
                <Input id="work-start" type="time" defaultValue="09:00" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="work-end">Fim do Horário de Trabalho</Label>
                <Input id="work-end" type="time" defaultValue="17:00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duração Padrão da Sessão (minutos)</Label>
            <Input id="duration" type="number" defaultValue="50" />
          </div>
           <Button>Salvar Configurações</Button>
        </CardContent>
      </Card>

    </div>
  );
}
