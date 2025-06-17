
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, CalendarDays, Edit, FileText, Brain, CheckCircle, Clock, MessageSquare, Trash2, Users as UsersIconLucide, Home as HomeIconLucide, Share2, UploadCloud, Calendar as CalendarIconShad, Lightbulb, Tag, BarChart3 as BarChart3Icon, ShieldAlert as ShieldAlertIcon, CheckCircle as CheckCircleIcon, TrendingUp, BookOpen, Activity, Users2, ClipboardList, Target, ListChecks, PlusCircle, Archive, AlertTriangle, History as HistoryIcon, Bot, Image as ImageIcon, Save, CalendarCheck, FileArchive, Eye, Pencil, FilePlus2, ClipboardEdit, Send, Sparkles, ArrowLeft } from "lucide-react";
import CopyButton from "@/components/ui/copy-button";
import Link from "next/link";
import { useRouter, useSearchParams, useParams } from "next/navigation";
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
import useClinicalStore from '@/stores/clinicalStore';
import ABCForm from "@/components/clinical-formulation/ABCForm";
import SchemaForm from "@/components/clinical-formulation/SchemaForm";
import EdgeLabelModal from "@/components/clinical-formulation/EdgeLabelModal";
import FormulationMapWrapper from "@/components/clinical-formulation/FormulationMap";


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


export default function PatientDetailPage() {
  const pageParams = useParams();
  const patientId = pageParams.id as string;

  const patient = mockPatient;
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || "overview";

  const prefillRuleFromStore = useClinicalStore(state => state.prefillSchemaRule);


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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Mocked insights based on the structure of GenerateSessionInsightsOutput
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
    // Simula salvar notas de estudo de caso
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
    // Simula salvar plano das próximas sessões
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
    <div className="flex flex-col h-full space-y-6">
      <Button variant="outline" asChild className="mb-4 self-start">
        <Link href="/patients"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Pacientes</Link>
      </Button>
      
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-background shadow-lg">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint={patient.dataAiHint}/>
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-semibold">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-headline font-bold">{patient.name}</h1>
              <div className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground mt-1">
                <Mail className="mr-1.5 h-4 w-4 opacity-70" /> {patient.email}
                <CopyButton value={patient.email} className="ml-1 h-6 w-6" />
                <span className="mx-2">|</span>
                <Phone className="mr-1.5 h-4 w-4 opacity-70" /> {patient.phone}
                <CopyButton value={patient.phone} className="ml-1 h-6 w-6" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 self-center sm:self-start">
              <Button variant="outline" asChild>
                <Link href={`/patients/${patient.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-amber-600 hover:text-amber-700 hover:border-amber-500 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:border-amber-400">
                    <Archive className="mr-2 h-4 w-4" /> Arquivar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Arquivar Paciente?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Arquivar remove o paciente das listas ativas, mas mantém o histórico. Deseja continuar?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleArchivePatient} className="bg-amber-500 hover:bg-amber-600 text-white">Arquivar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
               <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-destructive/90 hover:bg-destructive text-destructive-foreground">
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Excluir Paciente?</AlertDialogTitle>
                    <AlertDialogDescription>Esta ação é irreversível e todos os dados de {patient.name} serão perdidos. Confirma exclusão?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeletePatient} className="bg-destructive hover:bg-destructive/90">Excluir Permanentemente</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue={initialTab} className="w-full flex flex-col flex-grow">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="overview"><HomeIconLucide className="mr-1.5 h-4 w-4"/>Visão Geral</TabsTrigger>
          <TabsTrigger value="caseStudy"><Brain className="mr-1.5 h-4 w-4"/>O Coração Clínico</TabsTrigger>
          <TabsTrigger value="timeline"><HistoryIcon className="mr-1.5 h-4 w-4"/>Linha do Tempo</TabsTrigger>
          <TabsTrigger value="assessments"><ClipboardList className="mr-1.5 h-4 w-4"/>Avaliações</TabsTrigger>
          <TabsTrigger value="resources"><Share2 className="mr-1.5 h-4 w-4"/>Recursos</TabsTrigger>
          <TabsTrigger value="documents"><FileArchive className="mr-1.5 h-4 w-4"/>Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-headline">Informações Gerais</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoDisplay label="Data de Nascimento" value={formattedDob} icon={CalendarDays} />
              <InfoDisplay label="Psicólogo(a) Designado(a)" value={patient.assignedPsychologist} icon={UsersIconLucide} />
              <InfoDisplay label="Endereço" value={patient.address || "Não informado"} icon={HomeIconLucide} />
              <InfoDisplay label="Próxima Consulta" value={formattedNextAppointment} icon={CalendarCheck} />
              <InfoDisplay label="Última Sessão" value={formattedLastSession} icon={Clock} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Últimas Anotações de Sessão</CardTitle>
              <Button variant="link" className="p-0 h-auto text-accent" asChild>
                <Link href={`/patients/${patient.id}?tab=timeline`}>Ver todas as anotações</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionNotes.length > 0 ? (
                sessionNotes.slice(0, 2).map(note => <SessionNoteCard key={note.id} note={note} patientName={patient.name} therapistName={patient.assignedPsychologist} />)
              ) : <p className="text-muted-foreground">Nenhuma anotação de sessão encontrada.</p>}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Objetivos Terapêuticos</CardTitle>
              <Dialog>
                <DialogTrigger asChild><Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Novo Objetivo</Button></DialogTrigger>
                <DialogContent><DialogHeader><DialogTitle>Novo Objetivo Terapêutico (Simulado)</DialogTitle><DialogDescription>Funcionalidade em desenvolvimento.</DialogDescription></DialogHeader></DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {mockTherapeuticGoals.length > 0 ? (
                <ul className="space-y-3">
                  {mockTherapeuticGoals.map(goal => (
                    <li key={goal.id} className="p-3 border rounded-md bg-muted/30">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{goal.title}</h4>
                        <Badge variant={goal.status === "Alcançado" ? "default" : goal.status === "Em Pausa" ? "outline" : "secondary"}>{goal.status}</Badge>
                      </div>
                      {goal.description && <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>}
                      {goal.targetDate && <p className="text-xs text-muted-foreground mt-0.5">Meta: {format(new Date(goal.targetDate), "P", {locale: ptBR})}</p>}
                    </li>
                  ))}
                </ul>
              ) : <p className="text-muted-foreground">Nenhum objetivo terapêutico definido.</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Tarefas e Exercícios do Paciente</CardTitle>
            </CardHeader>
            <CardContent>
               {mockPatientTasks.length > 0 ? (
                <ul className="space-y-3">
                  {mockPatientTasks.map(task => (
                    <li key={task.id} className="p-3 border rounded-md bg-muted/30">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{task.description}</h4>
                        <Badge variant={task.status === "Concluído" ? "default" : task.status === "Sugerido" ? "outline" : "secondary"}>{task.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Categoria: {task.category} | Proposto em: {task.dateProposed !== "N/A" ? format(new Date(task.dateProposed), "P", {locale: ptBR}) : "N/A"}</p>
                      {task.details && <p className="text-xs text-muted-foreground mt-0.5 italic">{task.details}</p>}
                    </li>
                  ))}
                </ul>
              ) : <p className="text-muted-foreground">Nenhuma tarefa ou exercício atribuído.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Progresso em Instrumentos</CardTitle>
              <Select value={selectedProgressInstrument} onValueChange={setSelectedProgressInstrument}>
                <SelectTrigger className="w-[280px] mt-2 h-9">
                  <SelectValue placeholder="Selecione um instrumento" />
                </SelectTrigger>
                <SelectContent>
                  {mockAvailableInstrumentsForProgress.map(inst => (
                    <SelectItem key={inst.id} value={inst.id}>{inst.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="h-[350px] p-0">
              {isLoadingProgressChart ? (
                <div className="h-full w-full flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4/5 w-full" />
                </div>
              ) : (
                <PatientProgressChart data={currentProgressData} instrumentName={mockAvailableInstrumentsForProgress.find(i=>i.id === selectedProgressInstrument)?.name || "Instrumento"} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="caseStudy" className="mt-6 flex flex-col flex-grow min-h-[80vh]">
            <div className="flex-grow min-h-0 h-full w-full">
                <FormulationMapWrapper />
            </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
            <Card>
                <CardHeader><CardTitle className="font-headline">Linha do Tempo do Paciente</CardTitle></CardHeader>
                <CardContent><PatientTimeline patientId={patient.id} /></CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="assessments" className="mt-6 space-y-6">
            <Card>
                <CardHeader className="flex-row justify-between items-center">
                    <CardTitle className="font-headline">Avaliações e Inventários</CardTitle>
                    <Dialog>
                        <DialogTrigger asChild><Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Atribuir Novo</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader><DialogTitle>Atribuir Inventário/Escala</DialogTitle><DialogDescription>Selecione o modelo e a data de envio.</DialogDescription></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-1"><Label htmlFor="inventoryTemplate">Modelo</Label>
                                <Select value={selectedInventoryTemplate} onValueChange={setSelectedInventoryTemplate}>
                                    <SelectTrigger id="inventoryTemplate"><SelectValue placeholder="Selecione um modelo"/></SelectTrigger>
                                    <SelectContent>{mockInventoryTemplates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                </Select>
                                </div>
                                <div className="space-y-1"><Label htmlFor="inventorySendDate">Data de Envio</Label>
                                <Popover><PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    {inventorySendDate ? format(inventorySendDate, "P", {locale:ptBR}) : <span>Escolha uma data</span>}
                                    <CalendarIconShad className="ml-auto h-4 w-4 opacity-50"/></Button>
                                </PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={inventorySendDate} onSelect={setInventorySendDate} initialFocus locale={ptBR}/></PopoverContent></Popover>
                                </div>
                            </div>
                            <DialogFooter><Button onClick={handleAssignInventory} className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!selectedInventoryTemplate || !inventorySendDate}>Atribuir</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {assessments.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {assessments.map(asm => <AssessmentCard key={asm.id} assessment={asm} />)}
                        </div>
                    ) : <p className="text-muted-foreground">Nenhuma avaliação ou inventário atribuído.</p>}
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6 space-y-6">
            <Card>
                <CardHeader className="flex-row justify-between items-center">
                    <CardTitle className="font-headline">Recursos Compartilhados com {patient.name}</CardTitle>
                    <Dialog>
                        <DialogTrigger asChild><Button variant="outline"><UploadCloud className="mr-2 h-4 w-4"/>Compartilhar da Clínica</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader><DialogTitle>Compartilhar Recurso da Clínica</DialogTitle><DialogDescription>Selecione um recurso da biblioteca da clínica para compartilhar com {patient.name}.</DialogDescription></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-1"><Label htmlFor="clinicResource">Recurso da Clínica</Label>
                                <Select value={selectedGlobalResource} onValueChange={setSelectedGlobalResource}>
                                    <SelectTrigger id="clinicResource"><SelectValue placeholder="Selecione um recurso global"/></SelectTrigger>
                                    <SelectContent>{mockGlobalClinicResources.map(r => <SelectItem key={r.id} value={r.id}>{r.name} ({r.type}, {r.size})</SelectItem>)}</SelectContent>
                                </Select>
                                </div>
                                <div className="space-y-1"><Label htmlFor="resourceShareNotes">Observações (Opcional)</Label>
                                <Textarea id="resourceShareNotes" value={resourceShareNotes} onChange={e => setResourceShareNotes(e.target.value)} placeholder="Ex: Material para a próxima sessão."/></div>
                            </div>
                            <DialogFooter><Button onClick={handleShareResource} className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!selectedGlobalResource}>Compartilhar Recurso</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                 <CardContent>
                    {patientResources.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {patientResources.map(res => <ResourceCard key={res.id} resource={res} isGlobalList={false}/>)}
                        </div>
                    ) : <p className="text-muted-foreground">Nenhum recurso compartilhado com este paciente ainda.</p>}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6 space-y-6">
            <Card>
                <CardHeader className="flex-row justify-between items-center">
                    <CardTitle className="font-headline">Documentos Psicológicos</CardTitle>
                    <Dialog open={isCreateDocumentDialogOpen} onOpenChange={setIsCreateDocumentDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline"><FilePlus2 className="mr-2 h-4 w-4"/>Criar Documento</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Criar Novo Documento para {patient.name}</DialogTitle>
                                <DialogDescription>Selecione um modelo para iniciar ou crie um documento em branco.</DialogDescription>
                            </DialogHeader>
                             <div className="grid gap-4 py-4">
                                <div className="space-y-1">
                                    <Label htmlFor="documentTemplate">Modelo de Documento</Label>
                                    <Select value={selectedDocumentTemplateId} onValueChange={setSelectedDocumentTemplateId}>
                                        <SelectTrigger id="documentTemplate"><SelectValue placeholder="Selecione um modelo de documento"/></SelectTrigger>
                                        <SelectContent>{mockDocumentTemplates.map(t => <SelectItem key={t.id} value={t.id}>{t.name} ({t.type})</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDocumentDialogOpen(false)}>Cancelar</Button>
                                <Button onClick={handleCreateDocument} className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!selectedDocumentTemplateId}>Criar com Modelo</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {psychologicalDocuments.length > 0 ? (
                        <ul className="space-y-3">
                            {psychologicalDocuments.map(doc => (
                                <li key={doc.id} className="p-3 border rounded-md flex items-center justify-between hover:bg-muted/30">
                                    <div>
                                        <p className="font-medium text-sm flex items-center">
                                            {doc.type === "Laudo" && <FileText className="mr-1.5 h-4 w-4 text-blue-500"/>}
                                            {doc.type === "Atestado" && <ClipboardEdit className="mr-1.5 h-4 w-4 text-green-500"/>}
                                            {doc.type === "Declaração" && <Pencil className="mr-1.5 h-4 w-4 text-yellow-600"/>}
                                            {doc.type === "Relatório de Avaliação" && <BarChart3Icon className="mr-1.5 h-4 w-4 text-purple-500"/>}
                                            {doc.type === "Anamnese" && <BookOpen className="mr-1.5 h-4 w-4 text-orange-500"/>}
                                            {doc.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Criado em: {format(new Date(doc.creationDate), "P", {locale:ptBR})}
                                            {doc.lastModified && ` | Modificado em: ${format(new Date(doc.lastModified), "P", {locale:ptBR})}`}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Visualizar/Editar"><Eye className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" title="Excluir"><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-muted-foreground">Nenhum documento psicológico criado para este paciente.</p>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="font-headline">Anamnese</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <Card className="bg-muted/20 p-4">
                        <CardTitle className="text-lg font-semibold mb-2">Preenchimento pelo Profissional</CardTitle>
                        <Textarea 
                            value={anamnesisText} 
                            onChange={(e) => setAnamnesisText(e.target.value)}
                            placeholder="Digite aqui as informações da anamnese coletadas durante a sessão..."
                            rows={8}
                            className="mb-2"
                        />
                        <Button onClick={handleSaveAnamnesisText} className="bg-accent hover:bg-accent/90 text-accent-foreground" size="sm"><Save className="mr-2 h-4 w-4"/>Salvar Anamnese (Profissional)</Button>
                    </Card>

                    <Card className="bg-muted/20 p-4">
                        <CardTitle className="text-lg font-semibold mb-2">Enviar Anamnese para o Paciente Preencher</CardTitle>
                        <div className="grid sm:grid-cols-2 gap-4 mb-3">
                             <div className="space-y-1">
                                <Label htmlFor="anamnesisTemplate">Modelo de Anamnese</Label>
                                <Select value={selectedAnamnesisTemplateIdToSent} onValueChange={setSelectedAnamnesisTemplateIdToSent}>
                                    <SelectTrigger id="anamnesisTemplate"><SelectValue placeholder="Selecione um modelo de anamnese"/></SelectTrigger>
                                    <SelectContent>{anamnesisTemplates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="patientWhatsApp">WhatsApp do Paciente (para envio do link)</Label>
                                <Input id="patientWhatsApp" value={patientWhatsApp} onChange={(e) => setPatientWhatsApp(e.target.value)} placeholder="(XX) XXXXX-XXXX"/>
                            </div>
                        </div>
                        <Button onClick={handleSendAnamnesisLink} className="bg-accent hover:bg-accent/90 text-accent-foreground" size="sm" disabled={!selectedAnamnesisTemplateIdToSent || !patientWhatsApp}><Send className="mr-2 h-4 w-4"/>Enviar Link da Anamnese</Button>
                        
                        {sentAnamneses.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium mb-1.5">Anamneses Enviadas Recentemente:</h4>
                                <ul className="space-y-1.5 text-xs">
                                    {sentAnamneses.slice(0,3).map(sa => (
                                        <li key={sa.id} className="flex justify-between items-center p-1.5 border rounded-sm bg-background">
                                            <span>{sa.templateName} (Enviada: {format(new Date(sa.sentDate), "P p", {locale:ptBR})})</span>
                                            <Badge variant={sa.status === "Preenchida" ? "default" : "secondary"}>{sa.status}</Badge>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Card>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      <ABCForm />
      <SchemaForm prefillRule={prefillRuleFromStore || undefined} />
      <EdgeLabelModal />
    </div>
  );
}
    
