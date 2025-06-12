"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Mail, Phone, CalendarDays } from "lucide-react";

export default function MyProfilePage() {
  const patient = {
    name: "Ana Souza",
    email: "ana.souza@example.com",
    phone: "(11) 91234-5678",
    birthDate: "1990-05-15",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserCircle className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Meu Perfil</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{patient.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <InfoRow label="E-mail" value={patient.email} icon={<Mail />} />
          <InfoRow label="Contato" value={patient.phone} icon={<Phone />} />
          <InfoRow label="Data de Nascimento" value={patient.birthDate} icon={<CalendarDays />} />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled>Editar Informações</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
