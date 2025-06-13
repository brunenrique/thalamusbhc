"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen } from "lucide-react";

const faqs = [
  { id: "faq1", question: "Como realizo o backup do sistema?", answer: "Acesse a ferramenta de Backup no menu de Ferramentas e clique em 'Iniciar Novo Backup'." },
  { id: "faq2", question: "Posso restaurar dados de um backup antigo?", answer: "Sim. Na tela de Backup há uma seção de histórico onde é possível restaurar a partir de um ponto salvo." },
  { id: "faq3", question: "Como adiciono novos usuários?", answer: "Usuários são gerenciados na área de Admin > Aprovações de Usuários. Lá é possível convidar e definir permissões." },
  { id: "faq4", question: "Onde encontro relatórios de métricas?", answer: "O Dashboard de Métricas do Admin reúne informações gerais do sistema como número de pacientes e sessões." },
];

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-headline font-bold">Perguntas Frequentes</h1>
      </div>
      <CardDescription>Encontre respostas rápidas para dúvidas comuns sobre a plataforma.</CardDescription>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
