import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FolderArchive, PlusCircle, Search, Filter, UploadCloud } from "lucide-react";
import Link from "next/link";
import ResourceCard from "@/components/resources/resource-card";

const mockResources = [
 { id: "res1", name: "Mindfulness Guide for Anxiety.pdf", type: "pdf", size: "1.2MB", uploadDate: "2024-07-02", sharedWith: 5, dataAiHint:"document mindfulness"},
 { id: "res2", name: "Sleep Hygiene Best Practices.pdf", type: "pdf", size: "800KB", uploadDate: "2024-06-20", sharedWith: 12, dataAiHint:"document sleep" },
 { id: "res3", name: "Cognitive Restructuring Worksheet.docx", type: "docx", size: "50KB", uploadDate: "2024-05-15", sharedWith: 3, dataAiHint:"document worksheet" },
 { id: "res4", name: "Trauma Informed Care Principles.png", type: "image", size: "2.5MB", uploadDate: "2024-07-10", sharedWith: 8, dataAiHint:"image infographic" },
];


export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <FolderArchive className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Shared Resources</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/resources/upload">
            <UploadCloud className="mr-2 h-4 w-4" /> Upload New Resource
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Manage PDFs, Guides, and Documents</CardTitle>
          <CardDescription>Upload, manage, and share resources securely.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search resources..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockResources.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mockResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} isGlobalList={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <FolderArchive className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No resources found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by uploading a new resource.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
