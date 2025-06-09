
"use client";
import dynamic from "next/dynamic";
import { UserCog } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PatientForm = dynamic(() => import("@/components/forms/patient-form"), {
  loading: () => (
     <div className="space-y-6">
      <Skeleton className="h-8 w-1/3" />
      <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
      <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
      <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-20 w-full" /></div>
      <div className="flex justify-end"><Skeleton className="h-10 w-24" /></div>
    </div>
  ),
  ssr: false,
});

// Mock data for an existing patient - replace with actual data fetching
const mockPatientToEdit = {
  id: "1",
  name: "Alice Wonderland",
  email: "alice@example.com",
  phone: "555-1234",
  dob: "1990-05-15", // ISO string format for Date constructor
  address: "Rua Principal, 123, Cidade Alegre, BR",
  // avatarUrl: "https://placehold.co/150x150/D0BFFF/4F3A76?text=AW",
  // dataAiHint: "female avatar"
};


export default function EditPatientPage({ params }: { params: { id: string } }) {
  // In a real app, fetch patient by params.id
  const patient = mockPatientToEdit; 

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserCog className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Editar Paciente: {patient.name}</h1>
      </div>
      <PatientForm patientData={patient} />
    </div>
  );
}
