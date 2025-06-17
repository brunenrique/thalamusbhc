
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Workflow } from 'lucide-react'; // Changed from BarChartSteps to Workflow

interface ChainAnalysisBuilderProps {
  tabId: string;
}

export default function ChainAnalysisBuilder({ tabId }: ChainAnalysisBuilderProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Workflow className="mr-2 h-6 w-6 text-primary" /> {/* Changed icon here */}
          Análise em Cadeia (DBT)
        </CardTitle>
        <CardDescription>Ferramenta para Análise em Cadeia - Em Desenvolvimento (Aba ID: {tabId})</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <p className="text-muted-foreground">
          Funcionalidade de Análise em Cadeia será implementada aqui.
        </p>
      </CardContent>
    </Card>
  );
}

