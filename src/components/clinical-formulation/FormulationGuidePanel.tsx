
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, HelpCircle } from 'lucide-react';
import useClinicalStore from '@/stores/clinicalStore';

const FormulationGuidePanel: React.FC = () => {
  const { formulationGuideQuestions, formulationGuideAnswers, toggleFormulationQuestionAnswer } = useClinicalStore();

  return (
    <>
      <CardHeader className="p-3 border-b sticky top-0 bg-card z-10">
        <CardTitle className="font-headline text-base flex items-center">
          <HelpCircle className="h-4 w-4 mr-2 text-accent" />
          Guia de Formulação
        </CardTitle>
        <CardDescription className="text-xs">
          Perguntas chave para guiar a análise.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full p-3">
          {formulationGuideQuestions.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhuma pergunta guia configurada.</p>
          ) : (
            <ul className="space-y-2.5">
              {formulationGuideQuestions.map((question) => (
                <li key={question.id} className="flex items-start space-x-2 p-1.5 rounded-md hover:bg-muted/50">
                  <Checkbox
                    id={`guide-q-${question.id}`}
                    checked={formulationGuideAnswers[question.id] || false}
                    onCheckedChange={() => toggleFormulationQuestionAnswer(question.id)}
                    className="mt-0.5 shrink-0"
                    aria-labelledby={`guide-q-label-${question.id}`}
                  />
                  <Label
                    htmlFor={`guide-q-${question.id}`}
                    id={`guide-q-label-${question.id}`}
                    className="text-xs font-normal cursor-pointer flex-1"
                  >
                    {question.text}
                  </Label>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </>
  );
};

export default FormulationGuidePanel;
