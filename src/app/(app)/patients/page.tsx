"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, Search, Filter, Users } from "lucide-react";
import Link from "next/link";
import PatientListItem from "@/components/patients/patient-list-item";
import { mockPatients } from "@/mocks/patients";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { checkUserRole } from "@/services/authRole";

export default function PatientsPage() {
  const router = useRouter();

  useEffect(() => {
    checkUserRole(['Admin', 'Psychologist', 'Secretary']).then((ok) => {
      if (!ok) router.replace('/');
    });
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Pacientes</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/patients/new">
            <UserPlus className="mr-2 h-4 w-4" /> Adicionar Novo Paciente
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Registros de Pacientes</CardTitle>
          <CardDescription>Gerencie e visualize as informações dos pacientes.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar pacientes..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockPatients.length > 0 ? (
            <div className="space-y-4">
              {mockPatients.map(patient => (
                <PatientListItem key={patient.id} patient={patient} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum paciente encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">Comece adicionando um novo paciente.</p>
              <div className="mt-6">
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/patients/new">
                    <UserPlus className="mr-2 h-4 w-4" /> Adicionar Novo Paciente
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
