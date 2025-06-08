import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, Search, Filter, Users } from "lucide-react";
import Link from "next/link";
import PatientListItem from "@/components/patients/patient-list-item";

const mockPatients = [
  { id: "1", name: "Alice Wonderland", email: "alice@example.com", lastSession: "2024-07-15", nextAppointment: "2024-07-22", avatarUrl: "https://placehold.co/100x100/D0BFFF/4F3A76?text=AW", dataAiHint: "female avatar" },
  { id: "2", name: "Bob The Builder", email: "bob@example.com", lastSession: "2024-07-10", nextAppointment: "2024-07-20", avatarUrl: "https://placehold.co/100x100/70C1B3/FFFFFF?text=BB", dataAiHint: "male avatar" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", lastSession: "2024-07-12", nextAppointment: "2024-07-25", avatarUrl: "https://placehold.co/100x100/D0BFFF/4F3A76?text=CB", dataAiHint: "child avatar" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", lastSession: "2024-07-18", nextAppointment: null, avatarUrl: "https://placehold.co/100x100/70C1B3/FFFFFF?text=DP", dataAiHint: "female hero" },
];

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Patients</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/patients/new">
            <UserPlus className="mr-2 h-4 w-4" /> Add New Patient
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Patient Records</CardTitle>
          <CardDescription>Manage and view patient information.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patients..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
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
              <h3 className="mt-2 text-sm font-medium text-foreground">No patients found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by adding a new patient.</p>
              <div className="mt-6">
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/patients/new">
                    <UserPlus className="mr-2 h-4 w-4" /> Add New Patient
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
