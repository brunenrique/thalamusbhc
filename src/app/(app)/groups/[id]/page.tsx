
"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Users as GroupIcon, User as UserIcon, CalendarDays, Clock, FileText, Edit, Trash2, ArrowLeft, Settings, ListChecks, Users2 as UsersIconLucide } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { mockTherapeuticGroups } from "@/app/(app)/groups/page"; // Import mock data
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
  dataAiHint?: string;
}

interface Group {
  id: string;
  name: string;
  psychologist: string;
  psychologistId: string;
  membersCount: number; // This can be derived from participants.length
  schedule: string; // Display string
  dayOfWeek: string; // e.g., "tuesday"
  startTime: string; // e.g., "18:00"
  endTime: string; // e.g., "19:30"
  nextSession?: string;
  description?: string;
  participants: Participant[];
  meetingAgenda?: string;
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) return names[0][0]?.toUpperCase() || '';
  return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
};

const dayOfWeekDisplay: Record<string, string> = {
  monday: "Segundas",
  tuesday: "Terças",
  wednesday: "Quartas",
  thursday: "Quintas",
  friday: "Sextas",
  saturday: "Sábados",
  sunday: "Domingos",
};


export default function GroupDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const group: Group | undefined = mockTherapeuticGroups.find(g => g.id === params.id);

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <GroupIcon className="w-24 h-24 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">Grupo Não Encontrado</h1>
        <p className="text-muted-foreground mb-6">O grupo que você está procurando não existe ou foi movido.</p>
        <Button asChild variant="outline">
          <Link href="/groups">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Grupos
          </Link>
        </Button>
      </div>
    );
  }

  const handleDeleteGroup = () => {
    toast({
      title: "Grupo Excluído (Simulado)",
      description: `O grupo "${group.name}" foi excluído com sucesso.`,
      variant: "destructive"
    });
    router.push("/groups");
  };

  const formattedNextSession = group.nextSession
    ? format(parseISO(group.nextSession), "PPPp", { locale: ptBR })
    : "Não agendada";

  const displaySchedule = `${dayOfWeekDisplay[group.dayOfWeek] || group.dayOfWeek}, ${group.startTime} - ${group.endTime}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-4 sm:mb-0">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="flex gap-2">
            <Button variant="outline" asChild>
                <Link href={`/groups/edit/${group.id}`}>
                    <Edit className="mr-2 h-4 w-4"/> Editar Grupo
                </Link>
            </Button>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-destructive/90 hover:bg-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir Grupo
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Grupo Permanentemente?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Todos os dados associados ao grupo &quot;{group.name}&quot; serão removidos. Tem certeza?
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteGroup} className="bg-destructive hover:bg-destructive/90">
                        Excluir
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <UsersIconLucide className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-headline font-bold">{group.name}</h1>
              <p className="text-muted-foreground">Psicólogo(a) Responsável: {group.psychologist}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-2 gap-x-6 gap-y-4">
          <InfoItem icon={<CalendarDays />} label="Horário Regular" value={displaySchedule} />
          <InfoItem icon={<Clock />} label="Próxima Sessão (Avulsa/Exemplo)" value={formattedNextSession} />
          <InfoItem icon={<GroupIcon />} label="Contagem de Membros" value={`${group.participants?.length || 0} participante(s)`} />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><UserIcon className="mr-2 h-5 w-5 text-primary" /> Participantes ({(group.participants || []).length})</CardTitle>
          <CardDescription>Membros atuais do grupo terapêutico.</CardDescription>
        </CardHeader>
        <CardContent>
          {(group.participants || []).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(group.participants || []).map(participant => (
                <Link key={participant.id} href={`/patients/${participant.id}`} className="block">
                  <Card className="hover:shadow-md transition-shadow hover:border-accent">
                    <CardContent className="p-3 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatarUrl || `https://placehold.co/100x100.png?text=${getInitials(participant.name)}`} alt={participant.name} data-ai-hint={participant.dataAiHint || "avatar pessoa"} />
                        <AvatarFallback className="bg-secondary text-secondary-foreground">{getInitials(participant.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{participant.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum participante adicionado a este grupo ainda.</p>
          )}
        </CardContent>
        <CardFooter>
            <Button variant="outline" asChild>
                <Link href={`/groups/edit/${group.id}?tab=participants`}>
                    <Settings className="mr-2 h-4 w-4"/> Gerenciar Participantes
                </Link>
            </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Descrição do Grupo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {group.description || "Nenhuma descrição fornecida."}
            </p>
          </div>
        </CardContent>
         <CardFooter>
            <Button variant="outline" asChild>
                <Link href={`/groups/edit/${group.id}?tab=details`}>
                    <Edit className="mr-2 h-4 w-4"/> Editar Descrição
                </Link>
            </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" /> Roteiro dos Encontros</CardTitle>
          <CardDescription>Planejamento e tópicos para as sessões do grupo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-md">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {group.meetingAgenda || "Nenhum roteiro de encontros definido para este grupo."}
            </p>
          </div>
        </CardContent>
         <CardFooter>
            <Button variant="outline" asChild>
                <Link href={`/groups/edit/${group.id}?tab=agenda`}>
                    <Edit className="mr-2 h-4 w-4"/> Editar Roteiro
                </Link>
            </Button>
        </CardFooter>
      </Card>

    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

function InfoItem({ icon, label, value, className }: InfoItemProps) {
  return (
    <div className={`flex items-start gap-3 p-3 bg-secondary/20 rounded-md ${className}`}>
      <span className="text-muted-foreground mt-1">{icon}</span>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="text-foreground text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
