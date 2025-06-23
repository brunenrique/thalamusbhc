
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FolderArchive, Search, Filter, UploadCloud } from "lucide-react";
import Link from "next/link";
import ResourceCard from "@/components/resources/resource-card";
import { storage } from "@/lib/firebase";
import {
  ref,
  listAll,
  getMetadata,
  getDownloadURL,
} from "firebase/storage";

interface ResourceItem {
  id: string;
  name: string;
  type: "pdf" | "docx" | "image" | "other";
  size: string;
  uploadDate: string;
  downloadUrl: string;
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${bytes}B`;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      try {
        const listRef = ref(storage, "resources");
        const result = await listAll(listRef);
        const items = await Promise.all(
          result.items.map(async (item) => {
            const metadata = await getMetadata(item);
            const url = await getDownloadURL(item);
            const contentType = metadata.contentType || "";
            const type = contentType.includes("pdf")
              ? "pdf"
              : contentType.includes("word") || contentType.includes("msword")
              ? "docx"
              : contentType.startsWith("image")
              ? "image"
              : "other";
            return {
              id: item.fullPath,
              name: metadata.name,
              type,
              size: formatFileSize(Number(metadata.size)),
              uploadDate: metadata.timeCreated,
              downloadUrl: url,
            } as ResourceItem;
          })
        );
        setResources(items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <FolderArchive className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Recursos Compartilhados</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/resources/upload" className="inline-flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            Carregar Novo Recurso
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm border-t border-zinc-200 mt-4 pt-4">
        <CardHeader>
          <CardTitle className="font-headline">Gerenciar PDFs, Guias e Documentos</CardTitle>
          <CardDescription>Carregue, gerencie e compartilhe recursos de forma segura.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 border-t border-zinc-200 mt-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar recursos..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-sm text-muted-foreground">Carregando...</p>
          ) : resources.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} isGlobalList={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <FolderArchive className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum recurso encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">Comece carregando um novo recurso.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
