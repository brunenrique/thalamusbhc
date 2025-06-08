import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Edit3, Mail, CalendarDays } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Patient {
  id: string;
  name: string;
  email: string;
  lastSession?: string | null;
  nextAppointment?: string | null;
  avatarUrl?: string;
  dataAiHint?: string;
}

interface PatientListItemProps {
  patient: Patient;
}

export default function PatientListItem({ patient }: PatientListItemProps) {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() || '';
    return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
  };

  const formattedNextAppointment = patient.nextAppointment 
    ? format(new Date(patient.nextAppointment), "P", { locale: ptBR }) 
    : null;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.dataAiHint} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link href={`/patients/${patient.id}`} className="block">
                <h3 className="text-lg font-semibold truncate hover:text-accent">{patient.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                <Mail className="h-3 w-3" /> {patient.email}
              </p>
              {formattedNextAppointment && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> Próx.: {formattedNextAppointment}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/patients/${patient.id}/edit`}>
                <Edit3 className="h-4 w-4 " />
                <span className="sr-only sm:not-sr-only sm:ml-2">Editar</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/patients/${patient.id}`}>
                <ChevronRight className="h-5 w-5" />
                 <span className="sr-only">Ver</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
