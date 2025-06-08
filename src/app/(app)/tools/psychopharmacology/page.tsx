
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Pill } from "lucide-react";

// Mock data for demonstration
const mockMedications = [
  { id: "med1", name: "Fluoxetina", class: "ISRS", commonUses: "Depressão, TOC, Transtorno do Pânico", commonSideEffects: "Náusea, Insônia, Sonolência" },
  { id: "med2", name: "Sertralina", class: "ISRS", commonUses: "Depressão, TEPT, Ansiedade Social", commonSideEffects: "Diarreia, Tontura, Boca Seca" },
  { id: "med3", name: "Risperidona", class: "Antipsicótico Atípico", commonUses: "Esquizofrenia, Transtorno Bipolar", commonSideEffects: "Ganho de peso, Sedação, Acatisia" },
];

export default function PsychopharmacologyPage() {
  // State for search query and results would go here
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Guia de Psicofarmacologia</h1>
      </div>
      <CardDescription>
        Pesquise medicamentos para encontrar detalhes sobre sua classe, usos comuns e efeitos colaterais.
      </CardDescription>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar medicamentos (ex: Fluoxetina)" className="pl-8" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Placeholder for search results */}
          {mockMedications.map(med => (
            <Card key={med.id} className="shadow-xs">
              <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center">
                  <Pill className="mr-2 h-5 w-5 text-accent" />
                  {med.name}
                </CardTitle>
                <CardDescription>Classe: {med.class}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm"><strong className="font-medium">Usos Comuns:</strong> {med.commonUses}</p>
                <p className="text-sm mt-1"><strong className="font-medium">Efeitos Colaterais Comuns:</strong> {med.commonSideEffects}</p>
              </CardContent>
            </Card>
          ))}
           {mockMedications.length === 0 && (
             <div className="text-center py-10 text-muted-foreground">
                <Pill className="mx-auto h-12 w-12" />
                <p className="mt-2">Pesquise um medicamento para ver seus detalhes.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
