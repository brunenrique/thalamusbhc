import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardList, PlusCircle, Search, Filter } from "lucide-react";
import Link from "next/link";
import AssessmentCard from "@/components/assessments/assessment-card";

const mockAssessments = [
  { id: "asm1", name: "Beck Depression Inventory (BDI)", description: "Measures severity of depression.", patientName: "Alice W.", dateSent: "2024-07-01", status: "Completed", score: "15/63" },
  { id: "asm2", name: "GAD-7 Anxiety Scale", description: "Screens for generalized anxiety disorder.", patientName: "Bob B.", dateSent: "2024-07-10", status: "Pending" },
  { id: "asm3", name: "Rosenberg Self-Esteem Scale", description: "Measures global self-worth.", patientName: "Charlie B.", dateSent: "2024-07-05", status: "Completed", score: "25/30" },
  { id: "asm4", name: "PTSD Checklist (PCL-5)", description: "Assesses symptoms of PTSD.", patientName: "Diana P.", dateSent: "2024-07-18", status: "Sent" },
];


export default function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Assessments</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/assessments/templates/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Template
            </Link>
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/assessments/assign">
              <ClipboardList className="mr-2 h-4 w-4" /> Assign Assessment
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Manage Assessments</CardTitle>
          <CardDescription>Track custom assessment forms and their completion status.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search assessments..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockAssessments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockAssessments.map(assessment => (
                <AssessmentCard key={assessment.id} assessment={assessment} showPatientInfo={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No assessments found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by creating an assessment template or assigning one to a patient.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
