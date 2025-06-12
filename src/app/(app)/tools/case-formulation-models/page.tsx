
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Network, PlusCircle, Search, Filter, Edit, Trash2, MoreHorizontal, Brain } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export interface CaseFormulationTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  structurePrompt: string;
  lastUpdated: string;
}

const mockCaseFormulationTemplates: CaseFormulationTemplate[] = [
  { id: "cfm1", name: "TCC - Beck (Padrão)", category: "TCC", description: "Modelo padrão baseado nos princípios de Aaron Beck.", structurePrompt: "Situação:\nPensamentos Automáticos:\nEmoções:\Sentimentos Fisiológicos:\nComportamentos:\nCrenças Subjacentes/Regras:\nCrenças Centrais:", lastUpdated: "2024-07-20" },
  { id: "cfm2", name: "Análise Funcional (ACT)", category: "ACT", description: "Modelo para análise funcional dentro da Terapia de Aceitação e Compromisso.", structurePrompt: "Comportamento Problema:\nContexto (Antecedentes):\nFunção do Comportamento (Consequências Imediatas e de Longo Prazo):\nValores Relevantes:\nAções Comprometidas Alternativas:", lastUpdated: "2024-07-15" },
  { id: "cfm3", name: "Formulação de Caso DBT", category: "DBT", description: "Modelo para formulação de caso em Terapia Comportamental Dialética.", structurePrompt: "Diagnóstico e Sintomas Primários:\nComportamentos Disfuncionais Alvo:\nFatores Predisponentes (Biossociais):\nEventos Precipitantes:\nFatores de Manutenção:\nMetas de Tratamento (Hierarquia DBT):", lastUpdated: "2024-07-10" },
  { id: "cfm4", name: "Análise Comportamental Clínica (ACC)", category: "Análise do Comportamento", description: "Modelo para análise comportamental clínica detalhada.", structurePrompt: "Queixa Principal (em termos comportamentais):\nHistórico de Aquisição e Manutenção do Comportamento:\nVariáveis Contextuais Atuais:\nContingências em Operação:\nHipóteses Funcionais:\nPlano de Intervenção:", lastUpdated: "2024-07-05" },
];

export default function CaseFormulationModelsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [templates, setTemplates] = useState<CaseFormulationTemplate[]>(mockCaseFormulationTemplates); // For deletion simulation

  const filteredTemplates = useMemo(() => {
    return templates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, templates]);

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Modelo Excluído (Simulado)",
      description: `O modelo "${templateName}" foi excluído.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Network className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-headline font-bold">Modelos de Formulação de Caso</h1>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/tools/case-formulation-models/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Modelo
          </Link>
        </Button>
      </div>
      <CardDescription>
        Crie, gerencie e utilize modelos estruturados para formulação de casos clínicos. Estes modelos poderão ser usados pela IA para análises de sessão.
      </CardDescription>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Gerenciar Modelos</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar modelos por nome, categoria ou descrição..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filtrar por Categoria
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="font-headline text-lg">{template.name}</CardTitle>
                        <Brain className="h-5 w-5 text-accent flex-shrink-0" title="Pode ser usado com IA"/>
                    </div>
                    <Badge variant="secondary" className="w-fit mt-1">{template.category}</Badge>
                    <CardDescription className="text-xs mt-1 line-clamp-2 h-8">{template.description || "Sem descrição."}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-xs text-muted-foreground">Última Modificação: {format(new Date(template.lastUpdated), "P", { locale: ptBR })}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Editar modelo ${template.name}`} asChild>
                      <Link href={`/tools/case-formulation-models/edit/${template.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" aria-label={`Excluir modelo ${template.name}`}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Modelo?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tem certeza que deseja excluir o modelo &quot;{template.name}&quot;? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTemplate(template.id, template.name)} className="bg-destructive hover:bg-destructive/90">
                                Excluir
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <div className="text-center py-10">
              <Network className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum modelo de formulação encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">Comece criando um novo modelo.</p>
                <Button asChild className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/tools/case-formulation-models/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Modelo
                  </Link>
                </Button>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
