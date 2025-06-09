
"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCog, FolderKanban, FileText, Search, Filter, Download, ExternalLink } from "lucide-react"; // Changed BookOpenText to FolderKanban
import { Input } from "@/components/ui/input";
import Link from "next/link";

// Mock data for Drive files - replace with actual API call result
const mockDriveFiles = [
  { id: "drive_pdf_1", name: "Manual_TCC_Completo.pdf", type: "pdf", lastModified: "2024-07-20", size: "5.2MB", shared: true, dataAiHint: "documento manual" },
  { id: "drive_pdf_2", name: "Artigo_Mindfulness_Estresse.pdf", type: "pdf", lastModified: "2024-06-15", size: "1.8MB", shared: false, dataAiHint: "documento artigo" },
  { id: "drive_img_1", name: "Infografico_Ansiedade.png", type: "image", lastModified: "2024-05-10", size: "3.1MB", shared: true, dataAiHint: "imagem infográfico" },
  { id: "drive_folder_1", name: "Recursos para Pacientes", type: "folder", lastModified: "2024-07-22", dataAiHint: "pasta documentos" },
];

const getFileIcon = (type: string) => {
  if (type === 'pdf') return <FileText className="h-5 w-5 text-red-500" />;
  if (type === 'image') return <FileText className="h-5 w-5 text-green-500" />; // Could be FileImage
  if (type === 'folder') return <FolderKanban className="h-5 w-5 text-yellow-600" />;
  return <FileText className="h-5 w-5 text-muted-foreground" />;
};


export default function KnowledgeBaseDrivePage() {
  const [isConnected, setIsConnected] = React.useState(false); // Simulate Drive connection status
  const [driveFiles, setDriveFiles] = React.useState<typeof mockDriveFiles>([]);

  const handleConnectDrive = () => {
    // Simulate API call to connect and fetch files
    setIsConnected(true);
    setDriveFiles(mockDriveFiles); 
    // In a real app, this would initiate OAuth flow and then fetch files
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BrainCog className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Base de Conhecimento (Google Drive)</h1>
      </div>
      <CardDescription>
        Conecte sua conta Google Drive para acessar, visualizar e baixar seus documentos e PDFs diretamente no PsiGuard.
      </CardDescription>

      {!isConnected ? (
        <Card className="shadow-sm text-center">
          <CardHeader>
            <CardTitle className="font-headline">Conectar ao Google Drive</CardTitle>
            <CardDescription>
              Autorize o PsiGuard a acessar seus arquivos do Google Drive para uma integração transparente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleConnectDrive} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.51,5.363l-2.939,5.09H22L12,21.545L6.49,12.273H2l2.939-5.09L9.021,12.5l2.979-5.159L14.979,12.5Z"/>
              </svg>
              Conectar com Google Drive
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              PsiGuard solicitará apenas permissão para visualizar arquivos que você selecionar ou que estejam em pastas específicas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <CardTitle className="font-headline">Seus Documentos do Drive</CardTitle>
                <Button variant="outline" size="sm" onClick={() => {setIsConnected(false); setDriveFiles([])}}>
                    Desconectar Drive
                </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar em seus documentos do Drive..." className="pl-8" />
                </div>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Filtrar por Tipo
                </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {driveFiles.length > 0 ? (
              driveFiles.map(file => (
                <Card key={file.id} className="shadow-xs hover:shadow-sm transition-shadow">
                  <CardContent className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Modificado: {file.lastModified} {file.size ? `| Tamanho: ${file.size}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Baixar arquivo">
                        <Download className="h-4 w-4" />
                      </Button>
                       {file.type !== 'folder' && (
                         <Button variant="ghost" size="icon" asChild className="h-7 w-7" aria-label="Abrir no Google Drive">
                           <Link href="#" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                           </Link>
                         </Button>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <FolderKanban className="mx-auto h-12 w-12" />
                <p className="mt-2">Nenhum arquivo encontrado ou o Drive não está conectado.</p>
                <p className="text-sm">Verifique suas permissões ou tente reconectar.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
