
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, FileText, Tag, Lightbulb, BarChart3, Edit, Trash2, AlertTriangleIcon, CheckCircle, ShieldAlert } from "lucide-react";
import { generateSessionInsights, type GenerateSessionInsightsOutput } from '@/ai/flows/generate-session-insights';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '../ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionNote {
  id: string;
  date: string;
  summary: string;
  keywords?: string[];
  themes?: string[];
}

interface SessionNoteCardProps {
  note: SessionNote;
}

export default function SessionNoteCard({ note }: SessionNoteCardProps) {
  const [insights, setInsights] = useState<GenerateSessionInsightsOutput | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsLoadingInsights(true);
    setError(null);
    try {
      const result = await generateSessionInsights({ sessionNotes: note.summary });
      setInsights(result);
    } catch (e) {
      console.error("Falha ao gerar insights:", e);
      setError("Falha ao gerar insights. Por favor, tente novamente.");
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" /> Anotação de Sessão
            </CardTitle>
            <CardDescription>{format(new Date(note.date), "PPP", { locale: ptBR })}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" aria-label="Editar anotação">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label="Excluir anotação">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.summary}</p>

        {!insights && !isLoadingInsights && (
          <Button onClick={handleGenerateInsights} variant="outline" size="sm" className="mt-4">
            <Brain className="mr-2 h-4 w-4" /> Gerar Insights com IA
          </Button>
        )}

        {isLoadingInsights && (
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-2/5" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {insights && (
          <div className="mt-6 space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="text-md font-semibold text-accent flex items-center"><Lightbulb className="mr-2 h-5 w-5" /> Insights da IA</h4>
            
            {insights.potentialRiskAlerts && insights.potentialRiskAlerts.length > 0 && (
              <div>
                <h5 className="text-sm font-medium flex items-center text-destructive"><ShieldAlert className="mr-2 h-4 w-4" /> Alertas de Risco Potencial:</h5>
                <div className="flex flex-wrap gap-1 mt-1">
                  {insights.potentialRiskAlerts.map((alert, idx) => <Badge key={idx} variant="destructive">{alert}</Badge>)}
                </div>
              </div>
            )}

            <div>
              <h5 className="text-sm font-medium flex items-center"><Tag className="mr-2 h-4 w-4 text-muted-foreground" /> Palavras-chave:</h5>
              <div className="flex flex-wrap gap-1 mt-1">
                {insights.keywords.map(kw => <Badge key={kw} variant="secondary">{kw}</Badge>)}
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium flex items-center"><Lightbulb className="mr-2 h-4 w-4 text-muted-foreground" /> Temas:</h5>
              <div className="flex flex-wrap gap-1 mt-1">
                {insights.themes.map(theme => <Badge key={theme} variant="outline">{theme}</Badge>)}
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium flex items-center"><BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" /> Evolução dos Sintomas:</h5>
              <p className="text-xs text-muted-foreground mt-1">{insights.symptomEvolution}</p>
            </div>
            {insights.therapeuticMilestones && insights.therapeuticMilestones.length > 0 && (
                <div>
                    <h5 className="text-sm font-medium flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Marcos Terapêuticos:</h5>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {insights.therapeuticMilestones.map((milestone, idx) => <Badge key={idx} variant="default" className="bg-green-100 text-green-700 border-green-300">{milestone}</Badge>)}
                    </div>
                </div>
            )}
            {insights.inventoryComparisonInsights && (
                <div>
                    <h5 className="text-sm font-medium flex items-center"><BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" /> Insights Comparativos de Inventário:</h5>
                    <p className="text-xs text-muted-foreground mt-1">{insights.inventoryComparisonInsights}</p>
                </div>
            )}
             <div>
              <h5 className="text-sm font-medium flex items-center"><Lightbulb className="mr-2 h-4 w-4 text-muted-foreground" /> Insights Sugestivos:</h5>
              <p className="text-xs text-muted-foreground mt-1">{insights.suggestiveInsights}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
