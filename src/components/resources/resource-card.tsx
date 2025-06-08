import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, FileImage, FileArchive, Download, Share2, Trash2, Users, Edit } from "lucide-react";
import Link from "next/link";

interface Resource {
  id: string;
  name: string;
  type: "pdf" | "docx" | "image" | "other";
  size: string;
  uploadDate?: string; // For global list
  sharedDate?: string; // For patient-specific list
  sharedWith?: number; // For global list: number of patients shared with
  dataAiHint?: string;
}

interface ResourceCardProps {
  resource: Resource;
  isGlobalList?: boolean; // Differentiates between global resource list and patient-specific list
}

export default function ResourceCard({ resource, isGlobalList = false }: ResourceCardProps) {
  const getFileIcon = () => {
    switch (resource.type) {
      case "pdf": return <FileText className="h-8 w-8 text-red-500" />;
      case "docx": return <FileText className="h-8 w-8 text-blue-500" />;
      case "image": return <FileImage className="h-8 w-8 text-green-500" />;
      default: return <FileArchive className="h-8 w-8 text-muted-foreground" />;
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getFileIcon()}
          <CardTitle className="font-headline text-md flex-1 leading-tight_">{resource.name}</CardTitle>
        </div>
         {resource.type === "image" && (
            <div className="mt-2 aspect-video relative rounded-md overflow-hidden bg-muted">
                 <Image src={`https://placehold.co/300x200.png`} alt={resource.name} layout="fill" objectFit="cover" data-ai-hint={resource.dataAiHint || "abstract image"}/>
            </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow text-xs text-muted-foreground space-y-1">
        <p>Type: <Badge variant="outline" className="uppercase">{resource.type}</Badge></p>
        <p>Size: {resource.size}</p>
        {isGlobalList && resource.uploadDate && <p>Uploaded: {new Date(resource.uploadDate).toLocaleDateString()}</p>}
        {!isGlobalList && resource.sharedDate && <p>Shared: {new Date(resource.sharedDate).toLocaleDateString()}</p>}
        {isGlobalList && resource.sharedWith !== undefined && (
          <p className="flex items-center"><Users className="mr-1 h-3 w-3" /> Shared with {resource.sharedWith} patient(s)</p>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3">
        <div className="flex w-full justify-end gap-1.5">
          <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Download">
            <Download className="h-4 w-4" />
          </Button>
          {isGlobalList && (
            <>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Share">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Edit">
                <Edit className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
