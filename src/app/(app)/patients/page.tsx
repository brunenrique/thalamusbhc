import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const patients = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "OM",
    lastVisit: "2023-05-15",
    status: "Active",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "JL",
    lastVisit: "2023-05-22",
    status: "Active",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "IN",
    lastVisit: "2023-04-30",
    status: "On Hold",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "WK",
    lastVisit: "2023-06-01",
    status: "Active",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    avatar: "https://placehold.co/40x40.png",
    initials: "SD",
    lastVisit: "2023-05-18",
    status: "Inactive",
  },
];

export default function PatientsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline">Patients</CardTitle>
          <CardDescription>
            Manage your patients and view their details.
          </CardDescription>
        </div>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Patient
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">
                Last Visit
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
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
                  <Badge variant={patient.status === "Active" ? "success" : "outline"}>
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
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Appointment</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
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
