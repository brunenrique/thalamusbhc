
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Youtube, LinkIcon, FileText, Headphones } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const selfCareResources = [
  {
    id: "sc1",
    title: "Guided Meditation for Stress Relief",
    type: "Audio",
    source: "Internal Library",
    icon: <Headphones className="h-5 w-5 text-accent" />,
    description: "A 10-minute guided meditation to calm your mind.",
    link: "#", // Placeholder
    dataAiHint: "zen meditation",
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: "sc2",
    title: "Breathing Exercises for Anxiety",
    type: "Video",
    source: "YouTube",
    icon: <Youtube className="h-5 w-5 text-red-500" />,
    description: "Learn simple breathing techniques to manage anxiety.",
    link: "https://www.youtube.com", // Placeholder
    dataAiHint: "yoga breath",
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: "sc3",
    title: "Mindfulness in Daily Life",
    type: "Article",
    source: "PsiGuard Blog",
    icon: <FileText className="h-5 w-5 text-blue-500" />,
    description: "Tips for incorporating mindfulness into your daily routine.",
    link: "#", // Placeholder
    dataAiHint: "person reading",
    imageUrl: "https://placehold.co/600x400.png",
  },
];

export default function SelfCarePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HeartPulse className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Self-Care Resources</h1>
      </div>
      <CardDescription>
        Explore tools and resources designed to support your mental well-being and manage stress.
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
              <CardDescription>Type: {resource.type} | Source: {resource.source}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{resource.description}</p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button asChild variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={resource.link} target="_blank" rel="noopener noreferrer">
                  Access Resource <LinkIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       {selfCareResources.length === 0 && (
             <div className="text-center py-10 text-muted-foreground">
                <HeartPulse className="mx-auto h-12 w-12" />
                <p className="mt-2">No self-care resources available yet. Check back soon!</p>
             </div>
        )}
    </div>
  );
}
