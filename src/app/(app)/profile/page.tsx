
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Edit, Lock, Bell, Briefcase, CalendarDays, Mail, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data for the logged-in user
const mockUserProfile = {
  id: "usr123",
  name: "Dr. Carlos Silva",
  email: "carlos.silva@psiguard.app",
  avatarUrl: "https://placehold.co/150x150/70C1B3/FFFFFF?text=CS",
  dataAiHint: "male doctor",
  role: "Psychologist" as "Psychologist" | "Admin" | "Secretary",
  specialty: "Terapia Cognitivo-Comportamental",
  phone: "(11) 98765-4321",
  dateRegistered: "2023-05-10T10:00:00Z",
  clinicName: "PsiGuard Clínica Central",
};

const getRoleLabel = (role: string): string => {
  const roleMap: Record<string, string> = {
    Psychologist: "Psicólogo(a)",
    Secretary: "Secretário(a)",
    Admin: "Administrador(a)",
  };
  return roleMap[role] || role;
};

export default function ProfilePage() {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() || '';
    return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserCircle className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Meu Perfil</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="items-center text-center p-6 sm:p-8 bg-muted/30">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
            <AvatarImage src={mockUserProfile.avatarUrl} alt={mockUserProfile.name} data-ai-hint={mockUserProfile.dataAiHint} />
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-semibold">
              {getInitials(mockUserProfile.name)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="font-headline text-2xl sm:text-3xl mt-4">{mockUserProfile.name}</CardTitle>
          <CardDescription className="text-base">{getRoleLabel(mockUserProfile.role)}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">Informações de Contato</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <InfoRow icon={<Mail />} label="Email" value={mockUserProfile.email} />
            <InfoRow icon={<Phone />} label="Telefone" value={mockUserProfile.phone || "Não informado"} />
          </div>
          
          <Separator className="my-6" />

          <h3 className="text-lg font-semibold text-foreground mb-3">Detalhes Profissionais</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {mockUserProfile.role === "Psychologist" && (
              <InfoRow icon={<Briefcase />} label="Especialidade" value={mockUserProfile.specialty || "Não informada"} />
            )}
            <InfoRow icon={<ShieldCheck />} label="Função no Sistema" value={getRoleLabel(mockUserProfile.role)} />
            <InfoRow icon={<Briefcase />} label="Clínica" value={mockUserProfile.clinicName} />
            <InfoRow icon={<CalendarDays />} label="Membro Desde" value={format(new Date(mockUserProfile.dateRegistered), "P", { locale: ptBR })} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 p-6 border-t">
          <Button variant="default" asChild className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/settings?tab=account">
              <Edit className="mr-2 h-4 w-4" /> Editar Perfil
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/settings?tab=account"> {/* Placeholder: eventually /profile/change-password */}
              <Lock className="mr-2 h-4 w-4" /> Alterar Senha
            </Link>
          </Button>
           <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/settings?tab=notifications">
              <Bell className="mr-2 h-4 w-4" /> Preferências de Notificação
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start">
      <span className="text-muted-foreground mr-2 mt-0.5">{icon}</span>
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
