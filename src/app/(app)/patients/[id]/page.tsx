import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, CalendarDays, Edit, FileText, Brain, CheckCircle, Clock, Archive, MessageSquare } from "lucide-react";
import Link from "next/link";
import PatientTimeline from "@/components/patients/patient-timeline";
import SessionNoteCard from "@/components/patients/session-note-card";
import ResourceCard from "@/components/resources/resource-card"; // Assuming this component exists
import AssessmentCard from "@/components/assessments/assessment-card"; // Assuming this component exists

// Mock data - replace with actual data fetching
const mockPatient = {
  id: "1",
  name: "Alice Wonderland",
  email: "alice@example.com",
  phone: "555-1234",
  dob: "1990-05-15",
  avatarUrl: "https://placehold.co/150x150/D0BFFF/4F3A76?text=AW",
  dataAiHint: "female avatar",
  nextAppointment: "2024-07-22 at 10:00 AM",
  lastSession: "2024-07-15",
  assignedPsychologist: "Dr. Smith",
  address: "123 Main St, Anytown, USA",
};

const mockSessionNotes = [
  { id: "sn1", date: "2024-07-15", summary: "Discussed coping mechanisms for anxiety...", keywords: ["anxiety", "coping"], themes: ["stress management"] },
  { id: "sn2", date: "2024-07-08", summary: "Explored family dynamics and communication patterns.", keywords: ["family", "communication"], themes: ["interpersonal relationships"] },
];

const mockAssessments = [
  { id: "asm1", name: "Beck Depression Inventory", dateSent: "2024-07-01", status: "Completed", score: "15/63" },
  { id: "asm2", name: "GAD-7 Anxiety Scale", dateSent: "2024-07-10", status: "Pending" },
];

const mockResources = [
 { id: "res1", name: "Mindfulness Guide.pdf", type: "pdf", size: "1.2MB", sharedDate: "2024-07-02", dataAiHint: "document mindfulness" },
 { id: "res2", name: "Sleep Hygiene Tips.pdf", type: "pdf", size: "800KB", sharedDate: "2024-06-20", dataAiHint: "document sleep" },
];


export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = mockPatient; // Fetch patient by params.id

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() || '';
    return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.dataAiHint} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-semibold">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-headline font-bold">{patient.name}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                <span className="flex items-center"><Mail className="mr-1.5 h-4 w-4" /> {patient.email}</span>
                <span className="flex items-center"><Phone className="mr-1.5 h-4 w-4" /> {patient.phone}</span>
                <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4" /> DOB: {patient.dob}</span>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/patients/${patient.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="session_notes">Session Notes</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Patient Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <InfoItem icon={<CalendarDays className="text-accent" />} label="Next Appointment" value={patient.nextAppointment || "Not scheduled"} />
              <InfoItem icon={<Clock className="text-accent" />} label="Last Session" value={patient.lastSession} />
              <InfoItem icon={<UsersIcon className="text-accent" />} label="Assigned Psychologist" value={patient.assignedPsychologist} />
              <InfoItem icon={<HomeIcon className="text-accent" />} label="Address" value={patient.address} className="md:col-span-2"/>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session_notes" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="font-headline">Session Notes</CardTitle>
                <CardDescription>Chronological record of therapy sessions.</CardDescription>
              </div>
              <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> New Note</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSessionNotes.map(note => (
                <SessionNoteCard key={note.id} note={note} />
              ))}
              {mockSessionNotes.length === 0 && <p className="text-muted-foreground">No session notes recorded yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="font-headline">Assessments</CardTitle>
                <CardDescription>Track and manage patient assessments.</CardDescription>
              </div>
               <Button variant="outline"><CheckCircle className="mr-2 h-4 w-4" /> Assign Assessment</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAssessments.map(assessment => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
              {mockAssessments.length === 0 && <p className="text-muted-foreground">No assessments assigned or completed.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Patient Timeline</CardTitle>
              <CardDescription>Key events and interactions related to the patient.</CardDescription>
            </CardHeader>
            <CardContent>
              <PatientTimeline patientId={params.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
             <div>
                <CardTitle className="font-headline">Shared Resources</CardTitle>
                <CardDescription>Documents and guides shared with the patient.</CardDescription>
              </div>
               <Button variant="outline"><Archive className="mr-2 h-4 w-4" /> Share Resource</Button>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
              {mockResources.length === 0 && <p className="text-muted-foreground md:col-span-full">No resources shared yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  className?: string;
}

function InfoItem({ icon, label, value, className }: InfoItemProps) {
  return (
    <div className={`flex items-start gap-3 p-3 bg-secondary/30 rounded-md ${className}`}>
      <span className="text-muted-foreground mt-1">{icon}</span>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-foreground">{value || "N/A"}</p>
      </div>
    </div>
  );
}

// Dummy icons if not in lucide, or to avoid direct lucide import in page level
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
