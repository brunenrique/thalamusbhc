
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitFork, PlusCircle, Download, Upload, ZoomIn, ZoomOut } from "lucide-react";

export default function SessionFormulationTreePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <GitFork className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Árvore de Formulação de Sessão</h1>
      </div>
      <CardDescription>
        Construa e gerencie visualmente formulações de caso usando um diagrama de árvore interativo.
      </CardDescription>

      <Card className="shadow-sm">
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle className="font-headline">Editor de Formulação</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Novo Nó</Button>
            <Button variant="outline" size="sm"><ZoomIn className="mr-2 h-4 w-4" /> Ampliar</Button>
            <Button variant="outline" size="sm"><ZoomOut className="mr-2 h-4 w-4" /> Reduzir</Button>
            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Exportar</Button>
            <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> Importar</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg bg-muted/50 min-h-[500px] flex items-center justify-center">
            <div className="text-center text-muted-foreground p-8">
              <GitFork className="mx-auto h-16 w-16 mb-4" />
              <p className="text-lg font-medium">Tela da Árvore de Formulação</p>
              <p className="text-sm">A ferramenta de diagramação interativa será implementada aqui.</p>
              <p className="text-xs mt-2">(Imagine uma tela para criar nós e conexões)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
            <CardTitle className="font-headline">Formulações Salvas</CardTitle>
            <CardDescription>Acesse e gerencie suas formulações de caso salvas anteriormente.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center py-10 text-muted-foreground">
                <GitFork className="mx-auto h-12 w-12" />
                <p className="mt-2">Nenhuma formulação salva ainda.</p>
                <Button variant="link" className="mt-2">Carregar Formulação de Exemplo</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
