
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListTree } from 'lucide-react'; // Using ListTree as a placeholder icon

interface ActMatrixBuilderProps {
  tabId: string;
}

export default function ActMatrixBuilder({ tabId }: ActMatrixBuilderProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <ListTree className="mr-2 h-6 w-6 text-primary" />
          Matriz da ACT
        </CardTitle>
        <CardDescription>Ferramenta Matriz da ACT - Em Desenvolvimento (Aba ID: {tabId})</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <p className="text-muted-foreground">
          Funcionalidade da Matriz da ACT será implementada aqui.
        </p>
      </CardContent>
    </Card>
  );
}
