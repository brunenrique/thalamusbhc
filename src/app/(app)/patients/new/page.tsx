
"use client";
import dynamic from "next/dynamic";
import { UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PatientForm = dynamic(() => import("@/components/patients/patient-form"), {
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


export default function NewPatientPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserPlus className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Adicionar Novo Paciente</h1>
      </div>
      <PatientForm />
    </div>
  );
}
