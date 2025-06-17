
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wand2 } from 'lucide-react'; // Using Wand2 as a placeholder icon

interface HexaflexToolProps {
  tabId: string;
}

export default function HexaflexTool({ tabId }: HexaflexToolProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Wand2 className="mr-2 h-6 w-6 text-primary" />
          Hexaflex (ACT)
        </CardTitle>
        <CardDescription>Ferramenta Hexaflex - Em Desenvolvimento (Aba ID: {tabId})</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <p className="text-muted-foreground">
          Funcionalidade da ferramenta Hexaflex será implementada aqui.
        </p>
      </CardContent>
    </Card>
  );
}
