
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';

interface HexaflexToolProps {
  tabId: string;
}

const PROCESSES = [
  'Defusão',
  'Aceitação',
  'Presença',
  'Eu Contexto',
  'Valores',
  'Ação'
];

export default function HexaflexTool({ tabId }: HexaflexToolProps) {
  return (
    <Card className="h-full flex flex-col" aria-label="Ferramenta Hexaflex">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Wand2 className="mr-2 h-6 w-6 text-primary" aria-hidden="true" />
          Hexaflex (ACT)
        </CardTitle>
        <CardDescription>Aba ID: {tabId}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow grid grid-cols-2 sm:grid-cols-3 gap-4 place-items-center">
        {PROCESSES.map((p) => (
          <div
            key={p}
            className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-center text-sm p-2"
            role="img"
            aria-label={p}
          >
            {p}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
