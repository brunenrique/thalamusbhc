
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, CalendarDays, Edit, FileText, Brain, CheckCircle, Clock, MessageSquare, Trash2, Users as UsersIconLucide, Home as HomeIconLucide, Share2, UploadCloud, Calendar as CalendarIconShad, Lightbulb, Tag, BarChart3 as BarChart3Icon, ShieldAlert as ShieldAlertIcon, CheckCircle as CheckCircleIcon, TrendingUp, BookOpen, Activity, Users2, ClipboardList, Target, ListChecks, PlusCircle, Archive, AlertTriangle, History as HistoryIcon, Bot, Image as ImageIcon, Save, CalendarCheck, FileArchive, Eye, Pencil, FilePlus2, ClipboardEdit, Send, Sparkles } from "lucide-react";
import CopyButton from "@/components/ui/copy-button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; 
import PatientTimeline from "@/components/patients/patient-timeline";
import SessionNoteCard from "@/components/patients/session-note-card";
import ResourceCard from "@/components/resources/resource-card";
import AssessmentCard from "@/components/assessments/assessment-card";
import InfoDisplay from "@/components/ui/info-display";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { generateSessionInsights, type GenerateSessionInsightsOutput } from '@/ai/flows/generate-session-insights';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import { gerarProntuario } from "@/services/prontuarioService";

// Importações para "O Coração Clínico"
import FormulationMapWrapper from "@/components/clinical-formulation/FormulationMap";
import SchemaPanel from "@/components/clinical-formulation/SchemaPanel";
import InsightPanel from "@/components/clinical-formulation/InsightPanel";
import ABCForm from "@/components/clinical-formulation/ABCForm";
import SchemaForm from "@/components/clinical-formulation/SchemaForm"; 
import EdgeLabelModal from "@/components/clinical-formulation/EdgeLabelModal";
import useClinicalStore from '@/stores/clinicalStore'; // <<< ADICIONADO IMPORT


const PatientProgressChart = dynamic(() => import("@/components/patients/patient-progress-chart"), {
  loading: () => (
    <div className="h-[350px] w-full flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4">
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-4/5 w-full" />
    </div>
  ),
  ssr: false,
});


const mockGlobalClinicResources = [
 { id: "res_global_1", name: "Guia Completo de Mindfulness.pdf", type: "pdf" as const, size: "2.1MB", uploadDate: "2024-07-01", dataAiHint:"documento mindfulness"},
 { id: "res_global_2", name: "Estratégias para Melhorar o Sono.pdf", type: "pdf" as const, size: "1.5MB", uploadDate: "2024-06-15", dataAiHint:"documento sono"},
 { id: "res_global_3", name: "Cartilha sobre Ansiedade Social.docx", type: "docx" as const, size: "350KB", uploadDate: "2024-05-20", dataAiHint:"documento cartilha"},
 { id: "res_global_4", name: "Infográfico: Ciclo da Depressão.png", type: "image" as const, size: "3.0MB", uploadDate: "2024-07-12", dataAiHint:"imagem infográfico"},
];


const mockPatient = {
  id: "1",
  name: "Alice Wonderland",
  email: "alice@example.com",
  phone: "555-1234",
  dob: "1990-05-15",
  avatarUrl: "https://placehold.co/150x150/70C1B3/FFFFFF?text=AW", 
  dataAiHint: "female avatar",
  nextAppointment: "2024-07-22T10:00:00Z",
  lastSession: "2024-07-15",
  assignedPsychologist: "Dr. Silva",
  address: "Rua Principal, 123, Cidade Alegre, BR",
};

const initialSessionNotes = [
  { id: "sn1", date: "2024-07-15", summary: "Sessão focada em mecanismos de enfrentamento para ansiedade. Paciente relata melhora na qualidade do sono após aplicar técnicas de relaxamento que foram ensinadas na sessão anterior. Apresentou-se engajada e participativa. Discutimos a importância da exposição gradual e planejamos pequenos passos para a próxima semana. Tarefa: praticar respiração diafragmática duas vezes ao dia.", keywords: ["ansiedade", "enfrentamento", "sono", "relaxamento", "exposição gradual"], themes: ["gerenciamento de estresse", "técnicas de relaxamento", "TCC"] },
  { id: "sn2", date: "2024-07-08", summary: "Exploramos dinâmicas familiares e padrões de comunicação. Identificamos alguns gatilhos em interações com a mãe que disparam sentimentos de inadequação. Paciente expressou dificuldade em estabelecer limites saudáveis. Trabalhamos role-playing de comunicação assertiva, focando em frases 'Eu sinto...' e pedidos claros. Paciente demonstrou progresso na identificação de pensamentos automáticos negativos relacionados a estas interações.", keywords: ["família", "comunicação", "limites", "assertividade", "pensamentos automáticos"], themes: ["relacionamentos interpessoais", "comunicação assertiva", "dinâmica familiar"] },
  { id: "sn3", date: "2024-07-01", summary: "Primeira sessão. Coleta de histórico, queixa principal relacionada a sintomas ansiosos e dificuldades de relacionamento no trabalho. Aplicado BDI (escore 15). Demonstrou boa receptividade à terapia.", keywords: ["primeira sessão", "histórico", "queixa principal", "ansiedade", "relacionamento interpessoal"], themes: ["avaliação inicial", "estabelecimento de vínculo"] },
];

const initialAssessments = [
  { id: "asm1", name: "Inventário de Depressão de Beck", dateSent: "2024-07-01", status: "Completed" as const, score: "15/63" },
  { id: "asm2", name: "Escala de Ansiedade GAD-7", dateSent: "2024-07-10", status: "Pending" as const },
];

const initialPatientResources = [
 { id: "res1", name: "Guia de Mindfulness.pdf", type: "pdf" as const, size: "1.2MB", sharedDate: "2024-07-02", dataAiHint: "documento mindfulness" },
 { id: "res2", name: "Dicas de Higiene do Sono.pdf", type: "pdf" as const, size: "800KB", sharedDate: "2024-06-20", dataAiHint: "documento sono" },
];

const mockInventoryTemplates = [
  { id: "tpl_bdi", name: "Inventário de Depressão de Beck (BDI)" },
  { id: "tpl_gad7", name: "Escala de Ansiedade GAD-7" },
  { id: "tpl_rosenberg", name: "Escala de Autoestima de Rosenberg" },
  { id: "tpl_pcl5", name: "Checklist de TEPT (PCL-5)" },
];

const mockAvailableInstrumentsForProgress = [
  { id: "bdi", name: "Inventário de Depressão de Beck (BDI)" },
  { id: "gad7", name: "Escala de Ansiedade GAD-7" },
];

const mockPatientProgressData: Record<string, Array<{ date: string; score: number }>> = {
  bdi: [
    { date: "2024-05-01", score: 25 },
    { date: "2024-06-01", score: 18 },
    { date: "2024-07-01", score: 15 },
    { date: "2024-07-15", score: 12 },
  ],
  gad7: [
    { date: "2024-05-15", score: 18 },
    { date: "2024-6-15", score: 14 },
    { date: "2024-07-10", score: 10 },
  ],
};

type TherapeuticGoalStatus = "Em Andamento" | "Alcançado" | "Em Pausa" | "Não Iniciado";
interface TherapeuticGoal {
  id: string;
  title: string;
  description?: string;
  status: TherapeuticGoalStatus;
  targetDate?: string;
}

const mockTherapeuticGoals: TherapeuticGoal[] = [
  { id: "goal1", title: "Reduzir sintomas de ansiedade social", status: "Em Andamento", targetDate: "2024-12-31", description: "Participar de 2 eventos sociais por mês e iniciar conversas." },
  { id: "goal2", title: "Melhorar a qualidade do sono", status: "Alcançado", description: "Dormir 7-8 horas por noite consistentemente e acordar descansado." },
  { id: "goal3", title: "Desenvolver habilidades de comunicação assertiva", status: "Em Pausa", targetDate: "2025-03-31", description: "Expressar necessidades e limites de forma clara e respeitosa em relacionamentos." },
];

type PatientTaskStatus = "A Fazer" | "Concluído" | "Não Feito" | "Sugerido";
interface PatientTask {
  id: string;
  description: string;
  dateProposed: string;
  status: PatientTaskStatus;
  category: "Tarefa" | "Exercício" | "Plano de Ação";
  details?: string;
}
const mockPatientTasks: PatientTask[] = [
  { id: "ptask1", description: "Praticar respiração diafragmática 2x ao dia por 5 min", dateProposed: "2024-07-15", status: "A Fazer", category: "Exercício" },
  { id: "ptask2", description: "Preencher diário de pensamentos automáticos diariamente", dateProposed: "2024-07-08", status: "Concluído", category: "Tarefa" },
  { id: "ptask3", description: "Ler capítulo sobre exposição gradual do material compartilhado", dateProposed: "2024-07-15", status: "A Fazer", category: "Tarefa" },
  { id: "ptask4", description: "Revisar técnicas de relaxamento progressivo (vídeo)", dateProposed: "N/A", status: "Sugerido", category: "Exercício", details: "Pode ser útil para momentos de maior tensão." },
];

interface PsychologicalDocument {
  id: string;
  name: string;
  type: "Laudo" | "Atestado" | "Declaração" | "Relatório de Avaliação" | "Outro" | "Anamnese";
  creationDate: string; 
  lastModified?: string; 
}

const mockPsychologicalDocumentsList: PsychologicalDocument[] = [
  { id: "doc1", name: "Laudo Psicológico Inicial - Alice W.", type: "Laudo", creationDate: "2024-07-05", lastModified: "2024-07-08" },
  { id: "doc2", name: "Atestado de Comparecimento - Alice W.", type: "Atestado", creationDate: "2024-07-15" },
  { id: "doc3", name: "Relatório de Avaliação BDI - Alice W.", type: "Relatório de Avaliação", creationDate: "2024-07-12", lastModified: "2024-07-12"},
];

interface DocumentTemplate {
  id: string;
  name: string;
  type: PsychologicalDocument["type"];
}

const mockDocumentTemplates: DocumentTemplate[] = [
  { id: "tpl_anam_adulto", name: "Anamnese Adulto (Completa)", type: "Anamnese" },
  { id: "tpl_anam_infantil", name: "Anamnese Infantil (Pais/Responsáveis)", type: "Anamnese" },
  { id: "tpl_anam_breve", name: "Anamnese Breve (Triagem)", type: "Anamnese" },
  { id: "tpl_laudo_inicial", name: "Laudo Psicológico Inicial (Padrão)", type: "Laudo" },
  { id: "tpl_atestado_comp", name: "Atestado de Comparecimento", type: "Atestado" },
  { id: "tpl_declaracao_acomp", name: "Declaração de Acompanhamento Psicológico", type: "Declaração" },
  { id: "tpl_rel_bdi", name: "Relatório de Resultados - BDI", type: "Relatório de Avaliação" },
  { id: "tpl_rel_gad7", name: "Relatório de Resultados - GAD-7", type: "Relatório de Avaliação" },
  { id: "tpl_outro", name: "Outro Documento (Personalizado)", type: "Outro" },
];

interface SentAnamnesis {
    id: string;
    templateName: string;
    sentDate: string; 
    status: "Pendente" | "Preenchida";
    filledDate?: string; 
}


export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = mockPatient;
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || "overview";

  if (!patient) {
    return (
      <div className="space-y-6 text-center py-10">
        <UsersIconLucide className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-headline font-bold text-destructive">
          Paciente não encontrado
        </h1>
        <Button variant="outline" asChild>
          <Link href="/patients">Voltar para Pacientes</Link>
        </Button>
      </div>
    );
  }

  const [sessionNotes, setSessionNotes] = useState(initialSessionNotes);
  const [assessments, setAssessments] = useState<Array<{ id: string; name: string; dateSent: string; status: "Completed" | "Pending" | "Sent"; score?: string }>>(initialAssessments);
  const [patientResources, setPatientResources] = useState<Array<{ id: string; name: string; type: "pdf" | "docx" | "image" | "other"; size: string; sharedDate: string; dataAiHint: string; uploadDate?: string }>>(initialPatientResources);
  const [psychologicalDocuments, setPsychologicalDocuments] = useState<PsychologicalDocument[]>(mockPsychologicalDocumentsList);


  const [selectedInventoryTemplate, setSelectedInventoryTemplate] = useState<string>("");
  const [inventorySendDate, setInventorySendDate] = useState<Date | undefined>(undefined);
  const [resourceShareNotes, setResourceShareNotes] = useState<string>("");

  const [generalPatientInsights, setGeneralPatientInsights] = useState<GenerateSessionInsightsOutput | null>(null);
  const [isLoadingGeneralInsights, setIsLoadingGeneralInsights] = useState(false);
  const [errorGeneralInsights, setErrorGeneralInsights] = useState<string | null>(null);

  const [selectedProgressInstrument, setSelectedProgressInstrument] = useState<string>("bdi");
  const [currentProgressData, setCurrentProgressData] = useState<Array<{ date: Date; score: number }>>([]);
  const [isLoadingProgressChart, setIsLoadingProgressChart] = useState(false);
  const [selectedGlobalResource, setSelectedGlobalResource] = useState<string>("");
  
  const [caseStudyNotes, setCaseStudyNotes] = useState<string>(""); 
  const [supervisionInputText, setSupervisionInputText] = useState<string>(""); 
  const [supervisionResponse, setSupervisionResponse] = useState<string | null>(null); 
  const [isSupervisionLoading, setIsSupervisionLoading] = useState<boolean>(false); 
  const [supervisionError, setSupervisionError] = useState<string | null>(null); 

  const [nextSessionsPlan, setNextSessionsPlan] = useState<string>("");

  const [isCreateDocumentDialogOpen, setIsCreateDocumentDialogOpen] = useState(false);
  const [selectedDocumentTemplateId, setSelectedDocumentTemplateId] = useState<string>("");
  
  const [anamnesisText, setAnamnesisText] = useState<string>("");
  const [selectedAnamnesisTemplateIdToSent, setSelectedAnamnesisTemplateIdToSent] = useState<string>("");
  const [patientWhatsApp, setPatientWhatsApp] = useState<string>(patient.phone || "");
  const [sentAnamneses, setSentAnamneses] = useState<SentAnamnesis[]>([]);


  useEffect(() => {
    setInventorySendDate(new Date());
  }, []);

  useEffect(() => {
    setIsLoadingProgressChart(true);
    const instrumentData = mockPatientProgressData[selectedProgressInstrument] || [];
    setTimeout(() => {
      setCurrentProgressData(instrumentData.map(d => ({ ...d, date: new Date(d.date) })));
      setIsLoadingProgressChart(false);
    }, 500);
  }, [selectedProgressInstrument]);

  const getInitials = useCallback((name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() || '';
    return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
  }, []);

  const handleArchivePatient = useCallback(() => {
    toast({
      title: "Paciente Arquivado (Simulado)",
      description: `${patient.name} foi marcado(a) como arquivado(a).`,
    });
  }, [toast, patient.name]);

  const handleDeletePatient = useCallback(() => {
    toast({
      title: "Paciente Excluído (Simulado)",
      description: `${patient.name} foi excluído(a) permanentemente.`,
      variant: "destructive",
    });
    router.push("/patients");
  }, [toast, patient.name, router]);

  const handleAssignInventory = useCallback(() => {
    if (!selectedInventoryTemplate || !inventorySendDate) {
      toast({ title: "Erro", description: "Selecione um modelo e uma data de envio.", variant: "destructive" });
      return;
    }
    const template = mockInventoryTemplates.find(t => t.id === selectedInventoryTemplate);
    if (!template) {
        toast({ title: "Erro", description: "Modelo de inventário/escala não encontrado.", variant: "destructive" });
        return;
    }
    const newAssessment = {
      id: `asm_${Date.now()}`,
      name: template.name,
      dateSent: format(inventorySendDate, "yyyy-MM-dd"),
      status: "Sent" as const,
    };
    setAssessments(prev => [newAssessment, ...prev].sort((a, b) => new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime()));
    toast({
      title: "Inventário/Escala Atribuído(a)",
      description: `"${template.name}" atribuído(a) a ${patient.name}. Link de preenchimento simulado enviado.`,
    });
    setSelectedInventoryTemplate("");
    setInventorySendDate(new Date());
  }, [selectedInventoryTemplate, inventorySendDate, toast, patient.name, setAssessments]);

  const handleShareResource = useCallback(() => {
    if (!selectedGlobalResource) {
      toast({ title: "Erro", description: "Selecione um recurso para compartilhar.", variant: "destructive" });
      return;
    }
    const resourceToShare = mockGlobalClinicResources.find(r => r.id === selectedGlobalResource);
    if (!resourceToShare) {
      toast({ title: "Erro", description: "Recurso não encontrado na biblioteca da clínica.", variant: "destructive" });
      return;
    }
    const newSharedResource = {
      ...resourceToShare,
      id: `pat_res_${Date.now()}`,
      sharedDate: format(new Date(), "yyyy-MM-dd"),
    };
    setPatientResources(prev => [newSharedResource, ...prev].sort((a,b) => new Date(b.sharedDate!).getTime() - new Date(a.sharedDate!).getTime()));
    toast({
      title: "Recurso Compartilhado",
      description: `Recurso "${resourceToShare.name}" compartilhado com ${patient.name}.`,
    });
    setSelectedGlobalResource("");
    setResourceShareNotes("");
  }, [selectedGlobalResource, toast, patient.name, setPatientResources]);

  const handleGenerateGeneralPatientInsights = useCallback(async () => {
    if (sessionNotes.length === 0) {
      toast({ title: "Sem Anotações", description: "Não há anotações de sessão para gerar insights gerais.", variant: "default" });
      return;
    }
    setIsLoadingGeneralInsights(true);
    setErrorGeneralInsights(null);
    setGeneralPatientInsights(null);

    const mostRecentNote = sessionNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const summaryForInsights = mostRecentNote.summary;

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setGeneralPatientInsights({
        keywords: mostRecentNote.keywords || ["Tópico Simul." , "Outro Tópico"],
        themes: mostRecentNote.themes || ["Tema Simulado A", "Tema Simulado B"],
        symptomEvolution: "Evolução dos sintomas simulada: estável com leve melhora relatada.",
        suggestiveInsights: "Sugestão simulada: Considerar explorar técnicas de relaxamento adicionais.",
        therapeuticMilestones: ["Demonstrou maior auto-consciência sobre gatilhos (simulado)."],
        potentialRiskAlerts: Math.random() > 0.7 ? ["Alerta simulado: Linguagem sugestiva de aumento de estresse detectada."] : [],
        inventoryComparisonInsights: "Comparação simulada: Redução nos escores de ansiedade desde o último inventário.",
      });
      toast({ title: "Insights Gerais Gerados (Simulado)", description: "Insights do paciente foram gerados com base na última anotação de sessão." });
    } catch (e) {
      console.error("Erro ao gerar insights do paciente:", e);
      setErrorGeneralInsights("Não foi possível gerar os insights gerais do paciente. Por favor, tente novamente.");
    } finally {
      setIsLoadingGeneralInsights(false);
    }
  }, [sessionNotes, toast]);

  const handleGenerateProntuario = useCallback(async () => {
    if (sessionNotes.length === 0) {
      toast({
        title: "Sem Anotações",
        description: "Adicione anotações para gerar o prontuário.",
        variant: "default",
      });
      return;
    }
    try {
      await gerarProntuario(patient.id, sessionNotes);
      toast({
        title: "Prontuário Gerado",
        description: "Documento criado via Google Apps Script.",
      });
    } catch (e: any) {
      toast({
        title: "Erro ao Gerar Prontuário",
        description: e.message || "Não foi possível gerar o prontuário.",
        variant: "destructive",
      });
    }
  }, [sessionNotes, patient.id, toast]);

  const handleSaveCaseStudyNotes = useCallback(() => {
    toast({
      title: "Anotações Salvas (Simulado)",
      description: "Suas anotações do estudo de caso foram salvas com sucesso.",
    });
  }, [caseStudyNotes, toast]);

  const handleClinicalSupervisionSubmit = useCallback(async () => {
    if (!supervisionInputText.trim()) {
      toast({
        title: "Material Clínico Vazio",
        description: "Por favor, insira o material clínico para análise.",
        variant: "default",
      });
      return;
    }
    setIsSupervisionLoading(true);
    setSupervisionResponse(null);
    setSupervisionError(null);
    try {
      const response = await fetch('/api/supervisao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicalMaterial: supervisionInputText }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }
      const result = await response.json();
      setSupervisionResponse(result.analysis);
      toast({ title: "Análise de Supervisão Recebida" });
    } catch (error: any) {
      console.error("Erro ao solicitar supervisão clínica:", error);
      setSupervisionError(error.message || "Falha ao obter análise de supervisão.");
      toast({
        title: "Erro na Análise de Supervisão",
        description: error.message || "Não foi possível obter a análise. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSupervisionLoading(false);
    }
  }, [supervisionInputText, toast]);


  const handleSaveNextSessionsPlan = useCallback(() => {
    toast({
      title: "Planejamento Salvo (Simulado)",
      description: "O planejamento para as próximas sessões foi salvo.",
    });
  }, [nextSessionsPlan, toast]);

  const handleCreateDocument = useCallback(() => {
    if (!selectedDocumentTemplateId) {
      toast({ title: "Erro", description: "Por favor, selecione um modelo de documento.", variant: "destructive" });
      return;
    }
    const template = mockDocumentTemplates.find(t => t.id === selectedDocumentTemplateId);
    if (!template) {
      toast({ title: "Erro", description: "Modelo de documento não encontrado.", variant: "destructive" });
      return;
    }

    const newDocument: PsychologicalDocument = {
      id: `doc_${Date.now()}`,
      name: `${template.name} - ${patient.name}`,
      type: template.type,
      creationDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    setPsychologicalDocuments(prev => [newDocument, ...prev].sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()));
    toast({
      title: "Documento Criado (Simulado)",
      description: `O documento "${newDocument.name}" foi criado para ${patient.name}.`,
    });
    setIsCreateDocumentDialogOpen(false);
    setSelectedDocumentTemplateId("");
  }, [selectedDocumentTemplateId, patient.name, toast]);

  const handleSaveAnamnesisText = useCallback(() => {
    if(!anamnesisText.trim()){
        toast({ title: "Anamnese Vazia", description: "Digite o conteúdo da anamnese antes de salvar.", variant: "default"});
        return;
    }
    toast({ title: "Anamnese Salva (Simulado)", description: "A anamnese preenchida pelo profissional foi salva."});
  }, [anamnesisText, toast]);

  const handleSendAnamnesisLink = useCallback(() => {
    if(!selectedAnamnesisTemplateIdToSent){
        toast({ title: "Nenhum Modelo Selecionado", description: "Por favor, selecione um modelo de anamnese para enviar.", variant: "destructive"});
        return;
    }
    if(!patientWhatsApp.trim()){
        toast({ title: "WhatsApp Necessário", description: "Por favor, insira o número de WhatsApp do paciente.", variant: "destructive"});
        return;
    }
    const template = mockDocumentTemplates.find(t => t.id === selectedAnamnesisTemplateIdToSent && t.type === "Anamnese");
    if(!template){
        toast({ title: "Modelo Inválido", description: "O modelo selecionado não é uma anamnese válida.", variant: "destructive"});
        return;
    }

    const newSentAnamnesis: SentAnamnesis = {
        id: `sent_anam_${Date.now()}`,
        templateName: template.name,
        sentDate: new Date().toISOString(),
        status: "Pendente",
    };
    setSentAnamneses(prev => [newSentAnamnesis, ...prev].sort((a,b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()));

    toast({ title: "Link de Anamnese Enviado (Simulado)", description: `Um link para a anamnese "${template.name}" foi enviado para o WhatsApp ${patientWhatsApp}.`});
    setSelectedAnamnesisTemplateIdToSent("");
  }, [selectedAnamnesisTemplateIdToSent, patientWhatsApp, toast]);

  const anamnesisTemplates = useMemo(() => mockDocumentTemplates.filter(t => t.type === "Anamnese"), []);


  const formattedDob = useMemo(() => patient.dob ? format(new Date(patient.dob), "P", { locale: ptBR }) : "N/A", [patient.dob]);
  const formattedNextAppointment = useMemo(() => patient.nextAppointment
    ? format(new Date(patient.nextAppointment), "P 'às' HH:mm", { locale: ptBR })
    : "Não agendado", [patient.nextAppointment]);
  const formattedLastSession = useMemo(() => patient.lastSession
    ? format(new Date(patient.lastSession), "P", { locale: ptBR })
    : "N/A", [patient.lastSession]);

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/patients">← Voltar para Pacientes</Link>
      </Button>
      
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.dataAiHint} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-semibold">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-headline font-bold">{patient.name}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                <span className="flex items-center">
                  <Mail className="mr-1.5 h-4 w-4" /> {patient.email}
                  <CopyButton value={patient.email} className="ml-1" />
                </span>
                <span className="flex items-center">
                  <Phone className="mr-1.5 h-4 w-4" /> {patient.phone}
                  <CopyButton value={patient.phone} className="ml-1" />
                </span>
                <span className="flex items-center"><CalendarDays className="mr-1.5 h-4 w-4" /> Nasc: {formattedDob}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 self-start sm:self-center">
                <Button variant="outline" asChild>
                  <Link href={`/patients/${patient.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" /> Editar Perfil
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-700">
                      <Archive className="mr-2 h-4 w-4" /> Arquivar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Arquivar Paciente?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Arquivar este paciente o removerá das listas ativas, mas preservará seus dados.
                        Esta ação geralmente pode ser desfeita. Tem certeza que deseja arquivar {patient.name}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleArchivePatient} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        Arquivar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-destructive/90 hover:bg-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Paciente Permanentemente?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Todos os dados associados a {patient.name} (prontuários, agendamentos, avaliações) serão permanentemente removidos.
                        Tem certeza que deseja excluir este paciente?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePatient} className="bg-destructive hover:bg-destructive/90">
                        Excluir Permanentemente
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Users2 className="mr-2 h-5 w-5 text-primary"/> Resumo do Paciente</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoDisplay icon={CalendarDays} label="Próximo Agendamento" value={formattedNextAppointment} />
          <InfoDisplay icon={Clock} label="Última Sessão" value={formattedLastSession} />
          <InfoDisplay icon={UsersIconLucide} label="Psicólogo(a) Responsável" value={patient.assignedPsychologist} />
          <InfoDisplay icon={HomeIconLucide} label="Endereço" value={patient.address} className="lg:col-span-1" />
        </CardContent>
      </Card>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-9">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="notes">Anotações</TabsTrigger>
          <TabsTrigger value="instruments">Instrumentos</TabsTrigger>
          <TabsTrigger value="anamnesis"><ClipboardEdit className="inline-block mr-1.5 h-4 w-4" />Anamnese</TabsTrigger>
          <TabsTrigger value="planning">Planejamento</TabsTrigger>
          <TabsTrigger value="caseStudy"> <Brain className="inline-block mr-1.5 h-4 w-4" /> O Coração Clínico</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
          <TabsTrigger value="documents"><FileArchive className="inline-block mr-1.5 h-4 w-4" /> Documentos</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/>Progresso Terapêutico</CardTitle>
                    <CardDescription>Acompanhe a evolução das pontuações dos instrumentos ao longo do tempo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-xs mb-4">
                        <Label htmlFor="progressInstrumentSelect">Selecionar Instrumento:</Label>
                        <Select value={selectedProgressInstrument} onValueChange={setSelectedProgressInstrument}>
                            <SelectTrigger id="progressInstrumentSelect"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {mockAvailableInstrumentsForProgress.map(instrument => (
                                <SelectItem key={instrument.id} value={instrument.id}>{instrument.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {isLoadingProgressChart ? (
                        <div className="h-[300px] w-full flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4"><Skeleton className="h-6 w-1/2 mb-2" /><Skeleton className="h-4/5 w-full" /></div>
                    ) : currentProgressData.length > 0 ? (
                        <div className="h-[300px] w-full bg-muted/30 rounded-lg p-4"><PatientProgressChart data={currentProgressData} instrumentName={mockAvailableInstrumentsForProgress.find(i => i.id === selectedProgressInstrument)?.name || ""} /></div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground"><TrendingUp className="mx-auto h-10 w-10" /><p className="mt-2 text-sm">Nenhum dado de progresso para o instrumento selecionado.</p></div>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Brain className="mr-2 h-5 w-5 text-primary"/>Alertas e Insights Chave da IA</CardTitle>
                    <CardDescription>Destaques importantes gerados pela análise de IA.</CardDescription>
                </CardHeader>
                <CardContent>
                 {!generalPatientInsights && !isLoadingGeneralInsights && !errorGeneralInsights && (
                    <Button onClick={handleGenerateGeneralPatientInsights} variant="outline" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Brain className="mr-2 h-4 w-4" /> Gerar/Atualizar Insights Gerais da IA
                    </Button>
                  )}
                  {isLoadingGeneralInsights && (
                    <div className="space-y-2 p-3 rounded-md bg-muted/50"><Skeleton className="h-5 w-1/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></div>
                  )}
                  {errorGeneralInsights && !isLoadingGeneralInsights && (
                    <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{errorGeneralInsights}</AlertDescription></Alert>
                  )}
                  {generalPatientInsights && !isLoadingGeneralInsights && (
                    <div className="space-y-3">
                      {generalPatientInsights.potentialRiskAlerts && generalPatientInsights.potentialRiskAlerts.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold flex items-center text-destructive mb-1"><ShieldAlertIcon className="mr-2 h-4 w-4" /> Alertas de Risco Potencial:</h4>
                          {generalPatientInsights.potentialRiskAlerts.map((alert, idx) => (<Badge key={idx} variant="destructive" className="mr-1 mb-1">{alert}</Badge>))}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold flex items-center mb-1"><Lightbulb className="mr-2 h-4 w-4 text-muted-foreground"/> Insights Sugestivos Principais:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{generalPatientInsights.suggestiveInsights || "Nenhum insight sugestivo no momento."}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary"/>Últimas Anotações de Sessão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {sessionNotes.slice(0, 2).map(note => (<SessionNoteCard key={note.id} note={note} patientName={patient.name} therapistName={patient.assignedPsychologist} />))}
                    {sessionNotes.length === 0 && <p className="text-muted-foreground text-sm">Nenhuma anotação ainda.</p>}
                    {sessionNotes.length > 2 && <Button variant="link" asChild className="text-accent"><Link href={`/patients/${params.id}?tab=notes`}>Ver todas as anotações</Link></Button>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Target className="mr-2 h-5 w-5 text-primary"/>Metas Terapêuticas Ativas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {mockTherapeuticGoals.filter(g => g.status === "Em Andamento").slice(0,3).map(goal => (
                         <div key={goal.id} className="p-2 border rounded-md bg-secondary/50">
                            <h4 className="font-medium text-sm">{goal.title}</h4>
                            {goal.targetDate && <p className="text-xs text-muted-foreground">Alvo: {format(new Date(goal.targetDate), "P", { locale: ptBR })}</p>}
                         </div>
                    ))}
                    {mockTherapeuticGoals.filter(g => g.status === "Em Andamento").length === 0 && <p className="text-muted-foreground text-sm">Nenhuma meta ativa no momento.</p>}
                     {mockTherapeuticGoals.filter(g => g.status === "Em Andamento").length > 3 && <Button variant="link" asChild className="text-accent"><Link href={`/patients/${params.id}?tab=planning`}>Ver todas as metas</Link></Button>}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="font-headline flex items-center"><MessageSquare className="mr-2 h-5 w-5 text-primary"/> Anotações de Sessão</CardTitle>
                <CardDescription>Registro cronológico das sessões de terapia.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleGenerateProntuario} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <UploadCloud className="mr-2 h-4 w-4" /> Gerar Prontuário
                </Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <FileText className="mr-2 h-4 w-4" /> Nova Anotação
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionNotes.map(note => (
                <SessionNoteCard key={note.id} note={note} patientName={patient.name} therapistName={patient.assignedPsychologist} />
              ))}
              {sessionNotes.length === 0 && <p className="text-muted-foreground">Nenhuma anotação de sessão registrada ainda.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instruments" className="mt-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="font-headline flex items-center"><ClipboardList className="mr-2 h-5 w-5 text-primary"/> Instrumentos Aplicados</CardTitle>
                <CardDescription>Acompanhe e gerencie os inventários e escalas aplicados ao paciente.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <CheckCircle className="mr-2 h-4 w-4" /> Atribuir Novo
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Atribuir Instrumento a {patient.name}</DialogTitle>
                        <DialogDescription>Selecione um modelo e uma data de envio.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="inventory-template" className="text-right col-span-1">Modelo</Label>
                            <Select value={selectedInventoryTemplate} onValueChange={setSelectedInventoryTemplate}>
                                <SelectTrigger id="inventory-template" className="col-span-3"><SelectValue placeholder="Selecione um modelo" /></SelectTrigger>
                                <SelectContent>{mockInventoryTemplates.map(template => (<SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="inventory-date" className="text-right col-span-1">Data Envio</Label>
                             <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                                        <CalendarIconShad className="mr-2 h-4 w-4" />
                                        {inventorySendDate ? format(inventorySendDate, "P", {locale: ptBR}) : <span>Escolha uma data</span>}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={inventorySendDate} onSelect={setInventorySendDate} initialFocus locale={ptBR}/></PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {/* Close logic or use DialogClose */}}>Cancelar</Button>
                      <Button type="button" onClick={handleAssignInventory} disabled={!selectedInventoryTemplate || !inventorySendDate} className="bg-accent hover:bg-accent/90 text-accent-foreground">Atribuir</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {assessments.map(assessment => (<AssessmentCard key={assessment.id} assessment={assessment} />))}
              {assessments.length === 0 && <p className="text-muted-foreground md:col-span-full">Nenhum instrumento atribuído ou concluído.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anamnesis" className="mt-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><ClipboardEdit className="mr-2 h-5 w-5 text-primary"/>Anamnese (Preenchimento Profissional)</CardTitle>
                    <CardDescription>Registre aqui as informações da anamnese coletadas diretamente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="Digite o histórico do paciente, queixa principal, histórico familiar, social, de saúde, etc..."
                        rows={15}
                        className="min-h-[300px]"
                        value={anamnesisText}
                        onChange={(e) => setAnamnesisText(e.target.value)}
                    />
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveAnamnesisText} className="bg-accent hover:bg-accent/90 text-accent-foreground ml-auto">
                        <Save className="mr-2 h-4 w-4" /> Salvar Anamnese
                    </Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                     <CardTitle className="font-headline flex items-center"><Send className="mr-2 h-5 w-5 text-primary"/>Enviar Anamnese ao Paciente</CardTitle>
                    <CardDescription>Selecione um modelo de anamnese e envie um link para o paciente preencher.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="anamnesis-template-select-to-send">Modelo de Anamnese</Label>
                        <Select value={selectedAnamnesisTemplateIdToSent} onValueChange={setSelectedAnamnesisTemplateIdToSent}>
                            <SelectTrigger id="anamnesis-template-select-to-send"><SelectValue placeholder="Selecione um modelo de anamnese" /></SelectTrigger>
                            <SelectContent>
                                {anamnesisTemplates.map(template => (
                                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="patient-whatsapp-anamnesis">WhatsApp do Paciente (para envio do link)</Label>
                        <Input id="patient-whatsapp-anamnesis" placeholder="(XX) XXXXX-XXXX" value={patientWhatsApp} onChange={(e) => setPatientWhatsApp(e.target.value)} />
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button onClick={handleSendAnamnesisLink} className="bg-accent hover:bg-accent/90 text-accent-foreground ml-auto" disabled={!selectedAnamnesisTemplateIdToSent || !patientWhatsApp.trim()}>
                        <Send className="mr-2 h-4 w-4" /> Enviar Link da Anamnese
                    </Button>
                </CardFooter>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><HistoryIcon className="mr-2 h-5 w-5 text-primary"/>Histórico de Anamneses Enviadas/Preenchidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {sentAnamneses.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma anamnese enviada ou preenchida ainda.</p>}
                    {sentAnamneses.map(sa => (
                        <div key={sa.id} className="p-3 border rounded-md bg-secondary/30 flex justify-between items-center hover:shadow-sm transition-shadow">
                            <div>
                                <p className="text-sm font-medium">{sa.templateName}</p>
                                <p className="text-xs text-muted-foreground">Enviada em: {format(new Date(sa.sentDate), "P 'às' HH:mm", { locale: ptBR })}</p>
                            </div>
                            <Badge variant={sa.status === "Preenchida" ? "default" : "outline"} className={sa.status === "Preenchida" ? "bg-green-100 text-green-700 border-green-300" : ""}>
                                {sa.status}
                                {sa.status === "Preenchida" && sa.filledDate && <span className="ml-1 text-xs">({format(new Date(sa.filledDate), "P", { locale: ptBR })})</span>}
                            </Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="planning" className="mt-8 space-y-6">
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="font-headline flex items-center"><Target className="mr-2 h-5 w-5 text-primary" /> Metas Terapêuticas</CardTitle>
                    <CardDescription>Acompanhe as metas definidas para o tratamento.</CardDescription>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground"><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Meta</Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockTherapeuticGoals.length > 0 ? mockTherapeuticGoals.map(goal => (
                    <div key={goal.id} className="p-3 border rounded-md bg-secondary/30 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{goal.title}</h4>
                        <Badge variant={goal.status === "Alcançado" ? "default" : goal.status === "Em Andamento" ? "secondary" : "outline"} className={goal.status === "Alcançado" ? "bg-green-100 text-green-700 border-green-300" : ""}>{goal.status}</Badge>
                      </div>
                      {goal.description && <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>}
                      {goal.targetDate && <p className="text-xs text-muted-foreground mt-1">Data Alvo: {format(new Date(goal.targetDate), "P", { locale: ptBR })}</p>}
                    </div>
                  )) : <p className="text-muted-foreground text-sm">Nenhuma meta terapêutica definida.</p>}
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="font-headline flex items-center">
                      <CalendarCheck className="mr-2 h-5 w-5 text-primary" />
                       Planejamento das Próximas Sessões
                    </CardTitle>
                    <CardDescription>Defina os focos, temas e atividades para as futuras sessões.</CardDescription>
                  </div>
                  <Button onClick={handleSaveNextSessionsPlan} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Save className="mr-2 h-4 w-4" /> Salvar Planejamento
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                      placeholder="Ex:&#10;Sessão 1 (DD/MM): Focar em técnicas de relaxamento e respiração. Introduzir psicoeducação sobre ansiedade.&#10;Sessão 2 (DD/MM): Revisar tarefa de casa. Iniciar identificação de pensamentos automáticos.&#10;Sessão 3 (DD/MM): Aprofundar em reestruturação cognitiva. Praticar com exemplos do paciente."
                      rows={8}
                      className="min-h-[150px]"
                      value={nextSessionsPlan}
                      onChange={(e) => setNextSessionsPlan(e.target.value)}
                  />
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader className="flex flex-row justify-between items-center">
                   <div>
                    <CardTitle className="font-headline flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" /> Plano de Ação e Tarefas</CardTitle>
                    <CardDescription>Exercícios, tarefas e planos propostos ao paciente.</CardDescription>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground"><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Tarefa/Exercício</Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockPatientTasks.filter(task => task.status !== "Sugerido").length > 0 && (
                    <>
                      <h4 className="text-sm font-semibold text-muted-foreground">Atribuídos:</h4>
                      {mockPatientTasks.filter(task => task.status !== "Sugerido").map(task => (
                        <div key={task.id} className="p-3 border rounded-md bg-secondary/30 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium text-sm">{task.category}: {task.description}</h5>
                            <Badge variant={task.status === "Concluído" ? "default" : task.status === "A Fazer" ? "secondary" : "destructive"} className={task.status === "Concluído" ? "bg-green-100 text-green-700 border-green-300" : ""}>{task.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Proposto em: {format(new Date(task.dateProposed), "P", { locale: ptBR })}</p>
                        </div>
                      ))}
                    </>
                  )}
                  {mockPatientTasks.filter(task => task.status === "Sugerido").length > 0 && (
                    <>
                      <h4 className="text-sm font-semibold text-muted-foreground mt-4">Sugestões de Exercícios Futuros:</h4>
                      {mockPatientTasks.filter(task => task.status === "Sugerido").map(task => (
                        <div key={task.id} className="p-3 border rounded-md bg-blue-500/5 hover:shadow-sm transition-shadow">
                          <h5 className="font-medium text-sm text-blue-700 dark:text-blue-400">{task.category}: {task.description}</h5>
                          {task.details && <p className="text-xs text-muted-foreground mt-1">{task.details}</p>}
                           <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1 text-accent hover:text-accent/90">Atribuir este exercício</Button>
                        </div>
                      ))}
                    </>
                  )}
                  {mockPatientTasks.length === 0 && <p className="text-muted-foreground text-sm">Nenhum plano de ação ou tarefa definida.</p>}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="caseStudy" className="mt-6">
            <div className="flex flex-col lg:flex-row gap-4 min-h-[70vh] md:min-h-[600px]">
                <div className="lg:w-72 xl:w-80 shrink-0">
                    <SchemaPanel />
                </div>
                <div className="flex-grow min-w-0 h-full">
                    <FormulationMapWrapper />
                </div>
                <div className="lg:w-72 xl:w-80 shrink-0">
                    <InsightPanel />
                </div>
            </div>
            {/* Modals são renderizados aqui, pois são controlados pelo store e podem ser abertos de qualquer lugar */}
            <ABCForm />
            <SchemaForm prefillRule={useClinicalStore.getState().prefillSchemaRule || undefined} />
            <EdgeLabelModal />
        </TabsContent>
        
        <TabsContent value="resources" className="mt-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row justify-between items-center">
             <div>
                <CardTitle className="font-headline flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary"/> Recursos Compartilhados</CardTitle>
                <CardDescription>Documentos e guias compartilhados com {patient.name}.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild><Button className="bg-accent hover:bg-accent/90 text-accent-foreground"><Share2 className="mr-2 h-4 w-4" /> Compartilhar Novo</Button></DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Compartilhar Recurso com {patient.name}</DialogTitle>
                        <DialogDescription>Selecione um recurso da biblioteca da clínica.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="global-resource-select">Recurso da Clínica</Label>
                            <Select value={selectedGlobalResource} onValueChange={setSelectedGlobalResource}>
                                <SelectTrigger id="global-resource-select"><SelectValue placeholder="Selecione um recurso global" /></SelectTrigger>
                                <SelectContent>{mockGlobalClinicResources.map(res => (<SelectItem key={res.id} value={res.id}>{res.name} ({res.type}, {res.size})</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="resource-share-notes">Notas para o Paciente (Opcional)</Label>
                            <Textarea id="resource-share-notes" value={resourceShareNotes} onChange={(e) => setResourceShareNotes(e.target.value)} placeholder="Ex: Dê uma olhada neste material..." rows={3}/>
                        </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {/* Close */}}>Cancelar</Button>
                      <Button type="button" onClick={handleShareResource} disabled={!selectedGlobalResource} className="bg-accent hover:bg-accent/90 text-accent-foreground">Compartilhar</Button>
                    </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {patientResources.map(resource => (<ResourceCard key={resource.id} resource={resource} />))}
              {patientResources.length === 0 && <p className="text-muted-foreground md:col-span-full">Nenhum recurso compartilhado.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="font-headline flex items-center"><FileArchive className="mr-2 h-5 w-5 text-primary"/> Documentos Psicológicos</CardTitle>
                <CardDescription>Laudos, atestados, declarações e outros documentos do paciente.</CardDescription>
              </div>
              <Dialog open={isCreateDocumentDialogOpen} onOpenChange={setIsCreateDocumentDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setSelectedDocumentTemplateId("")}>
                        <FilePlus2 className="mr-2 h-4 w-4" /> Criar Novo Documento
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Criar Documento para {patient.name}</DialogTitle>
                        <DialogDescription>Selecione um modelo para iniciar a criação do documento.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="document-template-select">Modelo de Documento *</Label>
                            <Select value={selectedDocumentTemplateId} onValueChange={setSelectedDocumentTemplateId}>
                                <SelectTrigger id="document-template-select"><SelectValue placeholder="Selecione um modelo" /></SelectTrigger>
                                <SelectContent>
                                {mockDocumentTemplates.filter(t => t.type !== "Anamnese").map(template => (
                                    <SelectItem key={template.id} value={template.id}>{template.name} ({template.type})</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsCreateDocumentDialogOpen(false)}>Cancelar</Button>
                      <Button type="button" onClick={handleCreateDocument} disabled={!selectedDocumentTemplateId} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        Criar Documento
                      </Button>
                    </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-3">
              {psychologicalDocuments.length > 0 ? (
                psychologicalDocuments.map(doc => (
                  <Card key={doc.id} className="shadow-xs hover:shadow-sm transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-sm">{doc.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Tipo: <Badge variant="outline" className="text-xs">{doc.type}</Badge> | 
                            Criado em: {format(new Date(doc.creationDate), "P", { locale: ptBR })}
                            {doc.lastModified && ` | Modificado em: ${format(new Date(doc.lastModified), "P", { locale: ptBR })}`}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Visualizar ${doc.name}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Editar ${doc.name}`}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" aria-label={`Excluir ${doc.name}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Nenhum documento psicológico registrado para este paciente.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-8">
            <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center"><HistoryIcon className="mr-2 h-5 w-5 text-primary"/> Linha do Tempo do Paciente</CardTitle>
                  <CardDescription>Eventos chave e interações relacionadas ao paciente.</CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientTimeline patientId={params.id} />
                </CardContent>
              </Card>
        </TabsContent>

      </Tabs>
      {/* Modals são renderizados aqui, mas controlados pelo store */}
      <ABCForm />
      <SchemaForm prefillRule={useClinicalStore.getState().prefillSchemaRule || undefined} />
      <EdgeLabelModal />
    </div>
  );
}
    
