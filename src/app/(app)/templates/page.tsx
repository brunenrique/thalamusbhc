
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FileText, PlusCircle, Search, Filter, Edit, Trash2, Copy, Brain } from "lucide-react";
import Link from "next/link";
import TemplateEditor from "@/components/forms/template-editor";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const mockTemplates = [
  { id: "tpl1", name: "Nota de Consulta Inicial", description: "Modelo padrão para primeiras sessões.", lastModified: "2024-07-10", category: "Geral", content: "Seção de Queixa Principal:\n\nHistórico do Paciente:\n\nExame do Estado Mental:\n\nDiagnóstico Provisório:\n\nPlano de Tratamento:\n" },
  { id: "tpl2", name: "Acompanhamento Sessão TCC", description: "Modelo para sessões de Terapia Cognitivo-Comportamental.", lastModified: "2024-06-25", category: "TCC", content: "Revisão da Tarefa de Casa:\n\nAvaliação do Humor (escala 0-10):\n\nAgenda da Sessão:\n\nDiscussão dos Pensamentos Automáticos:\n\nDefinição da Nova Tarefa de Casa:\n" },
  { id: "tpl3", name: "Resumo Avaliação Infantil", description: "Para resumir avaliações de psicologia infantil.", lastModified: "2024-07-15", category: "Pediátrico", content: "Dados de Identificação da Criança:\n\nMotivo da Avaliação:\n\nInstrumentos Utilizados:\n\nResultados e Observações Comportamentais:\n\nConclusões e Recomendações:\n" },
  { id: "tpl4", name: "Nota de Progresso - Curta", description: "Nota de progresso rápida para check-ins breves.", lastModified: "2024-07-01", category: "Geral", content: "Atualização do Estado do Paciente:\n\nIntervenção Breve:\n\nPróximos Passos:\n" },
];


export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Modelos Inteligentes</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/templates/new">
            <span>
              <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Modelo
            </span>
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Gerenciar Modelos de Anotação de Sessão</CardTitle>
          <CardDescription>Crie, edite e gerencie modelos de anotação de sessão assistidos por IA.</CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar modelos..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mockTemplates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockTemplates.map(template => (
                <Card key={template.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="font-headline text-lg">{template.name}</CardTitle>
                        <Brain className="h-5 w-5 text-accent" />
                    </div>
                    <CardDescription className="text-xs line-clamp-2">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-xs text-muted-foreground">Categoria: {template.category}</p>
                    <p className="text-xs text-muted-foreground">Última Modificação: {format(new Date(template.lastModified), "P", { locale: ptBR })}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-end gap-1.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Usar modelo ${template.name}`}><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Editar modelo ${template.name}`} asChild>
                      <Link href={`/templates/edit/${template.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" aria-label={`Excluir modelo ${template.name}`}><Trash2 className="h-4 w-4" /></Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <div className="text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum modelo encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">Comece criando um novo modelo de anotação de sessão.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* <TemplateEditor /> */}

    </div>
  );
}
