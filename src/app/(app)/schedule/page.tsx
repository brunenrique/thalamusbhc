import { Button } from "@/components/ui/button";
import { CalendarDays, PlusCircle, ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import Link from "next/link";
import AppointmentCalendar from "@/components/schedule/appointment-calendar";

export default function SchedulePage() {
  // Placeholder for current date logic
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-var(--header-height,4rem)-2rem)]"> {/* Adjust height based on your header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Appointments Schedule</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/schedule/new">
            <PlusCircle className="mr-2 h-4 w-4" /> New Appointment
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-card">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
          <h2 className="text-xl font-semibold text-foreground">{currentMonthYear}</h2>
          <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Today</Button>
          {/* View toggles: Day, Week, Month */}
          <Button variant="ghost" size="sm">Day</Button>
          <Button variant="secondary" size="sm">Week</Button>
          <Button variant="ghost" size="sm">Month</Button>
          <Button variant="outline" size="icon" aria-label="Filter appointments">
            <ListFilter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-auto border rounded-lg shadow-sm bg-card">
        <AppointmentCalendar />
      </div>
    </div>
  );
}
