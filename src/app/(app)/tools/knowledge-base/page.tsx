
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrainCog, Search, FileText, BookOpenText } from "lucide-react";
import Link from "next/link";

const mockArticles = [
  { id: "kb1", title: "Understanding CBT Techniques", category: "Therapeutic Approaches", lastUpdated: "2024-07-15", summary: "An overview of core Cognitive Behavioral Therapy techniques..." },
  { id: "kb2", title: "Managing Transference in Therapy", category: "Clinical Skills", lastUpdated: "2024-06-20", summary: "Strategies for identifying and managing transference..." },
  { id: "kb3", title: "Ethical Considerations in Telehealth", category: "Ethics & Legal", lastUpdated: "2024-05-01", summary: "Key ethical guidelines for providing remote therapy services..." },
];

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BrainCog className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Knowledge Base</h1>
      </div>
      <CardDescription>
        Access a curated library of articles, clinical guidelines, and frequently asked questions.
      </CardDescription>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-8" />
            </div>
            <Button variant="outline">Filter by Category</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockArticles.map(article => (
            <Card key={article.id} className="shadow-xs hover:shadow-sm transition-shadow">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">
                        <Link href={`/tools/knowledge-base/${article.id}`} className="hover:text-accent">
                            {article.title}
                        </Link>
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Category: {article.category} | Last Updated: {article.lastUpdated}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
                </CardContent>
                <CardFooter>
                    <Button variant="link" asChild className="p-0 h-auto text-accent">
                        <Link href={`/tools/knowledge-base/${article.id}`}>Read More <ChevronRightIcon className="ml-1 h-4 w-4" /></Link>
                    </Button>
                </CardFooter>
            </Card>
          ))}
          {mockArticles.length === 0 && (
             <div className="text-center py-10 text-muted-foreground">
                <BookOpenText className="mx-auto h-12 w-12" />
                <p className="mt-2">No articles found. Start by adding content to the knowledge base.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
