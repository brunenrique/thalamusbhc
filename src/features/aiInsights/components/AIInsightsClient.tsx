"use client";

import React, { useState } from "react";
import { Button } from "@/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/atoms/card";
import { Textarea } from "@/atoms/textarea";
import { Badge } from "@/atoms/badge";
import { Wand2, Lightbulb, Loader2, Tags, Newspaper } from "lucide-react";
import { analyzeSessionNotes, SessionInsightsOutput } from "@/features/aiInsights/services/session-insights";

const sampleNotes = `Paciente expressou sentimentos de ansiedade relacionados a prazos de trabalho e situações sociais. Relata dificuldade para dormir e se concentrar. Mencionou um sonho recorrente sobre estar despreparado para um exame. Discutimos mecanismos de enfrentamento, incluindo exercícios de atenção plena e divisão de tarefas em etapas menores. O paciente pareceu receptivo, mas hesitante em praticar os exercícios regularmente. Acompanhamento na próxima semana para revisar o progresso.`;

export function AIInsightsClient() {
  const [sessionNotes, setSessionNotes] = useState(sampleNotes);
  const [insights, setInsights] = useState<SessionInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setInsights(null);
    try {
      const result = await analyzeSessionNotes({ sessionNotes });
      setInsights(result);
    } catch (error) {
      console.error("Failed to analyze session notes:", error);
      // Here you would use a toast to show the error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Wand2 className="size-5" />
            Análise de Anotações da Sessão
          </CardTitle>
          <CardDescription>
            Insira as anotações da sessão abaixo para gerar insights com IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Cole suas anotações da sessão aqui..."
            className="min-h-[300px] text-base"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Analisando..." : "Gerar Insights"}
          </Button>
        </CardFooter>
      </Card>

      <div className="lg:col-span-2">
        {isLoading && (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-lg text-muted-foreground">
                Analisando anotações...
              </p>
            </div>
          </div>
        )}
        {insights && !isLoading && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Tags className="size-5" />
                    Palavras-chave
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {insights.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Newspaper className="size-5" />
                    Temas Identificados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                    {insights.themes.map((theme, index) => (
                        <li key={index}>{theme}</li>
                    ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Lightbulb className="size-5" />
                    Insights Sugeridos
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-foreground">
                <p>{insights.suggestedInsights}</p>
                <p>{insights.symptomEvolutionChartDescription}</p>
              </CardContent>
            </Card>
          </div>
        )}
        {!insights && !isLoading && (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border border-dashed p-8">
                <div className="text-center">
                    <Wand2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Painel de Insights de IA</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Seus insights gerados aparecerão aqui após a análise.
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
