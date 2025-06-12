
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Pill, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const mockMedications = [
  { 
    id: "med1", 
    name: "Fluoxetina", 
    class: "ISRS (Inibidor Seletivo da Recaptação de Serotonina)", 
    commonUses: "Depressão maior, Transtorno Obsessivo-Compulsivo (TOC), Bulimia nervosa, Transtorno do pânico, Transtorno Disfórico Pré-Menstrual (TDPM).", 
    commonSideEffects: "Náusea, insônia ou sonolência, diarreia, boca seca, perda de apetite, ansiedade, nervosismo, tremores, diminuição da libido.",
    importantNotes: "Pode levar algumas semanas para sentir o efeito completo. Interações medicamentosas são possíveis, especialmente com IMAOs."
  },
  { 
    id: "med2", 
    name: "Sertralina", 
    class: "ISRS", 
    commonUses: "Depressão maior, TOC, Transtorno do pânico, Transtorno de Estresse Pós-Traumático (TEPT), Fobia social, TDPM.", 
    commonSideEffects: "Náusea, diarreia, tontura, boca seca, insônia ou sonolência, sudorese, tremores, disfunção sexual.",
    importantNotes: "Geralmente bem tolerada, mas pode causar síndrome serotoninérgica em combinação com outros medicamentos serotoninérgicos."
  },
  { 
    id: "med3", 
    name: "Risperidona", 
    class: "Antipsicótico Atípico", 
    commonUses: "Esquizofrenia, Transtorno bipolar (mania aguda e manutenção), Irritabilidade associada ao autismo.", 
    commonSideEffects: "Sonolência, tontura, ganho de peso, aumento do apetite, fadiga, acatisia, sintomas extrapiramidais (em doses mais altas), hiperprolactinemia.",
    importantNotes: "Monitoramento regular de efeitos metabólicos é recomendado. Pode aumentar o risco de eventos cerebrovasculares em idosos com demência."
  },
  { 
    id: "med4", 
    name: "Clonazepam", 
    class: "Benzodiazepínico", 
    commonUses: "Transtornos de ansiedade, Transtorno do pânico, Certos tipos de convulsões (epilepsia).", 
    commonSideEffects: "Sonolência, tontura, fadiga, coordenação prejudicada, dependência e síndrome de abstinência com uso prolongado.",
    importantNotes: "Alto potencial de dependência. Usar com cautela e por curtos períodos, se possível. Desmame gradual é crucial."
  },
  { 
    id: "med5", 
    name: "Venlafaxina", 
    class: "IRSN (Inibidor da Recaptação de Serotonina e Norepinefrina)", 
    commonUses: "Depressão maior, Transtorno de ansiedade generalizada, Fobia social, Transtorno do pânico.", 
    commonSideEffects: "Náusea, tontura, sonolência, boca seca, sudorese, constipação, hipertensão (especialmente em doses mais altas).",
    importantNotes: "Monitorar pressão arterial. Descontinuação abrupta pode causar sintomas de retirada significativos."
  },
];

export default function PsychopharmacologyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);

  const filteredMedications = useMemo(() => {
    if (!searchTerm) return mockMedications;
    return mockMedications.filter(med =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.commonUses.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleAccordionItem = (id: string) => {
    setOpenAccordionItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Guia de Psicofarmacologia</h1>
      </div>
      <CardDescription>
        Pesquise medicamentos para encontrar detalhes sobre sua classe, usos comuns, efeitos colaterais e notas importantes.
      </CardDescription>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar medicamentos (ex: Fluoxetina, ISRS, depressão)" 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredMedications.length > 0 ? (
            <Accordion type="multiple" value={openAccordionItems} onValueChange={setOpenAccordionItems} className="w-full">
              {filteredMedications.map(med => (
                <AccordionItem value={med.id} key={med.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Pill className="h-5 w-5 text-accent" />
                      <span className="font-headline text-lg">{med.name}</span>
                      <Badge variant="secondary">{med.class}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 px-2 space-y-3 bg-muted/30 rounded-b-md">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Usos Comuns:</h4>
                      <p className="text-sm text-muted-foreground">{med.commonUses}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Efeitos Colaterais Comuns:</h4>
                      <p className="text-sm text-muted-foreground">{med.commonSideEffects}</p>
                    </div>
                    {med.importantNotes && (
                       <div>
                        <h4 className="text-sm font-semibold mb-1">Notas Importantes:</h4>
                        <p className="text-sm text-muted-foreground">{med.importantNotes}</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
             <div className="text-center py-10 text-muted-foreground">
                <Pill className="mx-auto h-12 w-12" />
                <p className="mt-2">Nenhum medicamento encontrado para &quot;{searchTerm}&quot;.</p>
                <p className="text-xs">Tente refinar seus termos de busca.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
