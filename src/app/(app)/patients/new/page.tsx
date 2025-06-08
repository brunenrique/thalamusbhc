
import PatientForm from "@/components/patients/patient-form";
import { UserPlus } from "lucide-react";

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
