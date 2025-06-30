"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/atoms/table";
import { Badge } from "@/atoms/badge";
import { Button } from "@/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/atoms/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar";
import { Input } from "@/atoms/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/atoms/dialog";
import { AddPatientForm } from "./AddPatientForm";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const patients = [
  {
    id: "patient123",
    name: "Olivia Martin",
    birthDate: "1990-05-21",
    email: "olivia.martin@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "OM",
    lastVisit: "2023-05-15",
    status: "Ativo",
  },
  {
    id: "patient124",
    name: "Jackson Lee",
    birthDate: "1985-10-30",
    email: "jackson.lee@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "JL",
    lastVisit: "2023-05-22",
    status: "Ativo",
  },
  {
    id: "patient125",
    name: "Isabella Nguyen",
    birthDate: "1992-02-14",
    email: "isabella.nguyen@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "IN",
    lastVisit: "2023-04-30",
    status: "Em Espera",
  },
  {
    id: "patient126",
    name: "William Kim",
    birthDate: "1988-12-02",
    email: "will@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "WK",
    lastVisit: "2023-06-01",
    status: "Ativo",
  },
  {
    id: "patient127",
    name: "Sofia Davis",
    birthDate: "1995-08-17",
    email: "sofia.davis@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "SD",
    lastVisit: "2023-05-18",
    status: "Inativo",
  },
];

const fetchPatients = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return patients;
};

export function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });

  const filteredPatients = data?.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Pacientes</CardTitle>
          <CardDescription>
            Gerencie seus pacientes e veja seus detalhes.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Pesquisar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Adicionar Paciente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Paciente</DialogTitle>
                <DialogDescription>
                  Preencha os campos abaixo para adicionar um novo paciente.
                </DialogDescription>
              </DialogHeader>
              <AddPatientForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Completo</TableHead>
              <TableHead>Data de Nascimento</TableHead>
              <TableHead className="hidden md:table-cell">
                Última Consulta
              </TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
            {filteredPatients?.map((patient) => (
              <TableRow key={patient.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={patient.avatar}
                        alt={patient.name}
                        data-ai-hint="person face"
                      />
                      <AvatarFallback>{patient.initials}</AvatarFallback>
                    </Avatar>
                    <Link href={`/patients/${patient.id}`} className="font-medium hover:underline">
                      {patient.name}
                      <div className="text-sm text-muted-foreground hidden md:block">
                        {patient.email}
                      </div>
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{patient.birthDate}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {patient.lastVisit}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Alternar menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/patients/${patient.id}`}>Ver Detalhes</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Agendar Consulta</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


