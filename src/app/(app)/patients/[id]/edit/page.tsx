
import PatientForm from "@/components/patients/patient-form";
import { UserCog } from "lucide-react";

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
