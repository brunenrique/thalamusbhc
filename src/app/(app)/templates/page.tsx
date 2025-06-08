import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, PlusCircle, Search, Filter, Edit, Trash2, Copy, Brain } from "lucide-react";
import Link from "next/link";
import TemplateEditor from "@/components/templates/template-editor";

const mockTemplates = [
  { id: "tpl1", name: "Initial Consultation Note", description: "Standard template for first sessions.", lastModified: "2024-07-10", category: "General" },
  { id: "tpl2", name: "CBT Session Follow-up", description: "Template for Cognitive Behavioral Therapy sessions.", lastModified: "2024-06-25", category: "CBT" },
  { id: "tpl3", name: "Child Assessment Summary", description: "For summarizing child psychology assessments.", lastModified: "2024-07-15", category: "Pediatric" },
  { id: "tpl4", name: "Progress Note - Short Form", description: "Quick progress note for brief check-ins.", lastModified: "2024-07-01", category: "General" },
];


export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Intelligent Templates</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/templates/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Template
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Manage Session Note Templates</CardTitle>
          <CardDescription>Create, edit, and manage AI-assisted session note templates.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search templates..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockTemplates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockTemplates.map(template => (
                <Card key={template.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="font-headline text-lg">{template.name}</CardTitle>
                        <Brain className="h-5 w-5 text-accent" title="AI-Assisted"/>
                    </div>
                    <CardDescription className="text-xs line-clamp-2">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-xs text-muted-foreground">Category: {template.category}</p>
                    <p className="text-xs text-muted-foreground">Last Modified: {new Date(template.lastModified).toLocaleDateString()}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-end gap-1.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Use Template"><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Edit Template"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" aria-label="Delete Template"><Trash2 className="h-4 w-4" /></Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <div className="text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No templates found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new session note template.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Example of a Template Editor section if creating/editing on the same page */}
      {/* For a real app, this would likely be on a /templates/new or /templates/[id]/edit page */}
      {/* <TemplateEditor /> */}

    </div>
  );
}
