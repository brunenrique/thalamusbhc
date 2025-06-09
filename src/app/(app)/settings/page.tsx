
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, UserCog, Clock, Palette, BellDot, Briefcase, SlidersHorizontal } from "lucide-react";
import SettingsForm from "@/components/settings/settings-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Configurações do Sistema</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general"><Briefcase className="mr-2 h-4 w-4" /> Geral</TabsTrigger>
          <TabsTrigger value="account"><UserCog className="mr-2 h-4 w-4" /> Conta</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4" /> Aparência</TabsTrigger>
          <TabsTrigger value="notifications"><BellDot className="mr-2 h-4 w-4" /> Notificações</TabsTrigger>
          <TabsTrigger value="schedule"><Clock className="mr-2 h-4 w-4" /> Agenda</TabsTrigger>
          <TabsTrigger value="modules"><SlidersHorizontal className="mr-2 h-4 w-4" /> Funcionalidades</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Configurações Gerais</CardTitle>
              <CardDescription>Configure parâmetros gerais da clínica e do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm section="general" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Configurações da Conta</CardTitle>
              <CardDescription>Gerencie os detalhes e preferências da sua conta pessoal.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm section="account" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Aparência</CardTitle>
              <CardDescription>Personalize a aparência da aplicação.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm section="appearance" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Preferências de Notificação</CardTitle>
              <CardDescription>Gerencie como você recebe notificações.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm section="notifications" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Configurações da Agenda</CardTitle>
              <CardDescription>Ajuste horários de trabalho, duração de sessões e integrações de calendário.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm section="schedule" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline">Gerenciar Funcionalidades</CardTitle>
              <CardDescription>Ative ou desative módulos e funcionalidades da plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm section="modules" />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
