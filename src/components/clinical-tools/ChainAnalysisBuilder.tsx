
"use client";

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Workflow, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChainAnalysisBuilderProps {
  tabId: string;
}

export default function ChainAnalysisBuilder({ tabId }: ChainAnalysisBuilderProps) {
  const [steps, setSteps] = useState([{ vulnerability: '', trigger: '', behavior: '' }]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { toast } = useToast();

  const addStep = () => {
    setSteps((prev) => [...prev, { vulnerability: '', trigger: '', behavior: '' }]);
    setTimeout(() => {
      const lastIndex = inputRefs.current.length - 1;
      inputRefs.current[lastIndex]?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: keyof (typeof steps)[0], value: string) => {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasEmpty = steps.some(step => !step.vulnerability || !step.trigger || !step.behavior);
    if (hasEmpty) {
      toast({ title: 'Preencha todos os campos obrigatórios.' , variant: 'destructive' });
      return;
    }
    toast({ title: 'Análise em cadeia salva', description: `Passos: ${steps.length}` });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Workflow className="mr-2 h-6 w-6 text-primary" />
          Análise em Cadeia (DBT)
        </CardTitle>
        <CardDescription>Aba ID: {tabId}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {steps.map((step, idx) => (
            <div key={idx} className="border rounded p-4 space-y-4">
              <Input
                ref={el => (inputRefs.current[idx] = el)}
                tabIndex={idx * 3 + 1}
                autoFocus={idx === steps.length - 1 && steps.length > 1}
                placeholder="Vulnerabilidade" required
                value={step.vulnerability}
                onChange={(e) => handleChange(idx, 'vulnerability', e.target.value)}
              />
              <Input
                tabIndex={idx * 3 + 2}
                placeholder="Gatilho" required
                value={step.trigger}
                onChange={(e) => handleChange(idx, 'trigger', e.target.value)}
              />
              <Textarea
                tabIndex={idx * 3 + 3}
                placeholder="Comportamento" required
                value={step.behavior}
                onChange={(e) => handleChange(idx, 'behavior', e.target.value)}
              />
            </div>
          ))}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={addStep}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar Passo
            </Button>
            <Button type="submit" className="bg-accent text-accent-foreground">
              Salvar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

