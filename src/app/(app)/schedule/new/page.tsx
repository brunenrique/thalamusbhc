
import AppointmentForm from "@/components/forms/appointment-form";
import { CalendarPlus } from "lucide-react";

export default function NewAppointmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarPlus className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Novo Agendamento</h1>
      </div>
      <AppointmentForm />
    </div>
  );
}
