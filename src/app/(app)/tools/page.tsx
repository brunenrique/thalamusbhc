
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, BookOpen, BrainCog, HeartPulse, Archive, GitFork, History, ChevronRight } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    title: "Psychopharmacology Guide",
    description: "Quickly search and find details about medications.",
    icon: <BookOpen className="h-6 w-6 text-accent" />,
    href: "/tools/psychopharmacology",
    dataAiHint: "book medicine",
  },
  {
    title: "Knowledge Base",
    description: "Access articles, FAQs, and clinical guidelines.",
    icon: <BrainCog className="h-6 w-6 text-accent" />,
    href: "/tools/knowledge-base",
    dataAiHint: "brain lightbulb",
  },
  {
    title: "Self-Care Resources",
    description: "Tools for stress management and well-being.",
    icon: <HeartPulse className="h-6 w-6 text-accent" />,
    href: "/tools/self-care",
    dataAiHint: "heart care",
  },
  {
    title: "Data Backup",
    description: "Manage and schedule secure data backups.",
    icon: <Archive className="h-6 w-6 text-accent" />,
    href: "/tools/backup",
    dataAiHint: "database archive",
  },
  {
    title: "Session Formulation Tree",
    description: "Visualize and build case formulations.",
    icon: <GitFork className="h-6 w-6 text-accent" />,
    href: "/tools/session-formulation-tree",
    dataAiHint: "mind map tree",
  },
  {
    title: "Audit Trail",
    description: "Track system activities and data changes.",
    icon: <History className="h-6 w-6 text-accent" />,
    href: "/tools/audit-trail",
    dataAiHint: "history log",
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wrench className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Clinical Tools</h1>
      </div>
      <CardDescription>
        A collection of resources and utilities to support your clinical practice and administrative tasks.
      </CardDescription>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.title} className="shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <div className="p-2 bg-muted rounded-md">{tool.icon}</div>
              <div className="flex-1">
                <CardTitle className="font-headline text-xl">{tool.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href={tool.href}>
                  Open Tool <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
