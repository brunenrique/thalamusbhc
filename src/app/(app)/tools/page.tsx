
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, BookOpen, BrainCog, Archive, Network, ChevronRight } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    title: "Guia de Psicofarmacologia",
    description: "Pesquise rapidamente e encontre detalhes sobre medicamentos.",
    icon: <BookOpen className="h-6 w-6 text-accent" />,
    href: "/tools/psychopharmacology",
    dataAiHint: "livro medicina",
  },
  {
    title: "Base de Conhecimento (Drive)",
    description: "Acesse seus documentos e PDFs do Google Drive.",
    icon: <BrainCog className="h-6 w-6 text-accent" />,
    href: "/tools/knowledge-base",
    dataAiHint: "cérebro nuvem",
  },
  {
    title: "Modelos de Formulação de Caso",
    description: "Crie e gerencie modelos para formulação de casos (TCC, ACT, etc.).",
    icon: <Network className="h-6 w-6 text-accent" />,
    href: "/tools/case-formulation-models",
    dataAiHint: "fluxograma mental",
  },
  // Ferramentas Administrativas como Backup e Auditoria foram movidas para o menu de Admin
  // e não são listadas aqui como ferramentas clínicas gerais.
];

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wrench className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Ferramentas Clínicas</h1>
      </div>
      <CardDescription>
        Uma coleção de recursos e utilitários para apoiar sua prática clínica.
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
                  Abrir Ferramenta <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
