
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, LightbulbIcon } from 'lucide-react';
import { useClinicalStore } from '@/stores/clinicalStore';
import { Badge } from '@/components/ui/badge';

const InsightPanel: React.FC = () => {
  const insights = useClinicalStore((state) => state.insights);
  // const isLoadingInsights = useClinicalStore((state) => state.isLoadingInsights); // Supondo que você adicione isso no store

  return (
    <Card className="h-full flex flex-col shadow-md">
      <CardHeader className="p-4 border-b">
        <CardTitle className="font-headline text-lg flex items-center">
          <LightbulbIcon className="h-5 w-5 mr-2 text-accent" />
          Insights e Análises
        </CardTitle>
        <CardDescription className="text-xs">
          Observações e padrões identificados pela IA ou pelo profissional.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-4">
          {/* {isLoadingInsights && <p className="text-sm text-muted-foreground">Gerando insights...</p>} */}
          {!insights || insights.length === 0 || (insights.length === 1 && insights[0] === "Clique em 'Gerar Insights' para análise.") ? (
            <div className="text-center text-sm text-muted-foreground py-6">
              <Brain className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>{insights.length > 0 ? insights[0] : "Nenhum insight disponível."}</p>
              <p className="text-xs mt-1">Clique em "Gerar Insights de IA" no mapa.</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {insights.map((insight, index) => (
                <li key={index} className="text-sm text-foreground p-2.5 bg-muted/40 rounded-md border border-border shadow-xs">
                  {insight}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default InsightPanel;
