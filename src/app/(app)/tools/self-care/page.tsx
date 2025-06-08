
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Youtube, LinkIcon, FileText, Headphones } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const selfCareResources = [
  {
    id: "sc1",
    title: "Meditação Guiada para Alívio do Estresse",
    type: "Áudio",
    source: "Biblioteca Interna",
    icon: <Headphones className="h-5 w-5 text-accent" />,
    description: "Uma meditação guiada de 10 minutos para acalmar sua mente.",
    link: "#", 
    dataAiHint: "meditação zen",
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: "sc2",
    title: "Exercícios de Respiração para Ansiedade",
    type: "Vídeo",
    source: "YouTube",
    icon: <Youtube className="h-5 w-5 text-red-500" />,
    description: "Aprenda técnicas simples de respiração para gerenciar a ansiedade.",
    link: "https://www.youtube.com", 
    dataAiHint: "respiração ioga",
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: "sc3",
    title: "Mindfulness na Vida Diária",
    type: "Artigo",
    source: "Blog PsiGuard",
    icon: <FileText className="h-5 w-5 text-blue-500" />,
    description: "Dicas para incorporar mindfulness em sua rotina diária.",
    link: "#", 
    dataAiHint: "pessoa lendo",
    imageUrl: "https://placehold.co/600x400.png",
  },
];

export default function SelfCarePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HeartPulse className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Recursos de Autocuidado</h1>
      </div>
      <CardDescription>
        Explore ferramentas e recursos projetados para apoiar seu bem-estar mental e gerenciar o estresse.
      </CardDescription>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {selfCareResources.map(resource => (
          <Card key={resource.id} className="shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col">
            {resource.imageUrl && (
                 <div className="aspect-video relative rounded-t-md overflow-hidden bg-muted">
                    <Image src={resource.imageUrl} alt={resource.title} layout="fill" objectFit="cover" data-ai-hint={resource.dataAiHint}/>
                </div>
            )}
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                {resource.icon} {resource.title}
              </CardTitle>
              <CardDescription>Tipo: {resource.type} | Fonte: {resource.source}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{resource.description}</p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button asChild variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={resource.link} target="_blank" rel="noopener noreferrer">
                  Acessar Recurso <LinkIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       {selfCareResources.length === 0 && (
             <div className="text-center py-10 text-muted-foreground">
                <HeartPulse className="mx-auto h-12 w-12" />
                <p className="mt-2">Nenhum recurso de autocuidado disponível ainda. Volte em breve!</p>
             </div>
        )}
    </div>
  );
}
