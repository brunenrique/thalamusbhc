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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/atoms/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar";

const patients = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "OM",
    lastVisit: "2023-05-15",
    status: "Ativo",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "JL",
    lastVisit: "2023-05-22",
    status: "Ativo",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "IN",
    lastVisit: "2023-04-30",
    status: "Em Espera",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "WK",
    lastVisit: "2023-06-01",
    status: "Ativo",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "SD",
    lastVisit: "2023-05-18",
    status: "Inativo",
  },
];

const statusVariantMap: { [key: string]: "success" | "secondary" | "outline" } = {
    "Ativo": "success",
    "Em Espera": "secondary",
    "Inativo": "outline",
};

export function PatientsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Pacientes</CardTitle>
          <CardDescription>
            Gerencie seus pacientes e veja seus detalhes.
          </CardDescription>
        </div>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Adicionar Paciente
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">
                Última Visita
              </TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person face" />
                      <AvatarFallback>{patient.initials}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      {patient.name}
                      <div className="text-sm text-muted-foreground hidden md:block">{patient.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[patient.status]}>
                    {patient.status}
                  </Badge>
                </TableCell>
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
                      <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
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
