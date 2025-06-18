
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  CalendarDays,
  Edit,
  FileText,
  Brain,
  Clock,
  Trash2,
  Users as UsersIconLucide,
  Home as HomeIconLucide,
  Share2,
  UploadCloud,
  Calendar as CalendarIconShad,
  Lightbulb,
  BarChart3 as BarChart3Icon,
  BookOpen,
  ClipboardList,
  PlusCircle,
  Archive,
  History as HistoryIcon,
  Save,
  CalendarCheck,
  FileArchive,
  Eye,
  Pencil,
  FilePlus2,
  ClipboardEdit,
  Send,
  ArrowLeft
} from "lucide-react";
// import CopyButton from "@/components/ui/copy-button"; // Temporarily commented
import Link from "next/link";
import { useRouter, useSearchParams, useParams } from "next/navigation";
// import PatientTimeline from "@/components/patients/patient-timeline"; // Temporarily commented
// import SessionNoteCard from "@/components/patients/session-note-card"; // Temporarily commented
// import ResourceCard from "@/components/resources/resource-card"; // Temporarily commented
// import AssessmentCard from "@/components/assessments/assessment-card"; // Temporarily commented
// import InfoDisplay from "@/components/ui/info-display"; // Temporarily commented
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
  // DialogTrigger, // Temporarily commented if not used by simple placeholders
} from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Temporarily commented
// import { Label } from "@/components/ui/label"; // Temporarily commented
// import { Input } from "@/components/ui/input"; // Temporarily commented
// import { Textarea } from "@/components/ui/textarea"; // Temporarily commented
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
// import { Calendar } from "@/components/ui/calendar"; // Temporarily commented
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // Temporarily commented
// import type { GenerateSessionInsightsOutput } from '@/ai/flows/generate-session-insights'; // Temporarily commented
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Temporarily commented
// import { Skeleton } from "@/components/ui/skeleton"; // Temporarily commented
// import { Badge } from "@/components/ui/badge"; // Temporarily commented
// import dynamic from "next/dynamic";
// import { gerarProntuario } from "@/services/prontuarioService"; // Temporarily commented
// import ChainAnalysisBuilder from '@/components/clinical-tools/ChainAnalysisBuilder'; // Temporarily commented
// import ActMatrixBuilder from '@/components/clinical-tools/ActMatrixBuilder'; // Temporarily commented
// import HexaflexTool from '@/components/clinical-tools/HexaflexTool'; // Temporarily commented
import { useClinicalStore } from '@/stores/clinicalStore';
// import MapCanvas from '@/components/map/MapCanvas'; // Temporarily commented
// import MapPanelContainer from '@/components/map/MapPanelContainer'; // Temporarily commented
// import ErrorBoundary from "@/components/layout/error-boundary"; // Temporarily commented


// FormulationMapWrapper is still imported but won't be used directly in caseStudy tab for now
// const FormulationMapWrapper = dynamic(() => import("@/components/clinical-formulation/FormulationMap"), {
//   loading: () => <Skeleton className="w-full h-[600px] rounded-md bg-muted/30" />,
//   ssr: false,
// });

// const PatientProgressChart = dynamic(() => import("@/components/patients/patient-progress-chart"), {
//   loading: () => (
//     <div className="h-[350px] w-full flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4">
//       <Skeleton className="h-6 w-1/2 mb-2" />
//       <Skeleton className="h-4/5 w-full" />
//     </div>
//   ),
//   ssr: false,
// });


const mockGlobalClinicResources = [
 { id: "res_global_1", name: "Guia Completo de Mindfulness.pdf", type: "pdf" as const, size: "2.1MB", uploadDate: "2024-07-01", dataAiHint:"documento mindfulness"},
 { id: "res_global_2", name: "Estratégias para Melhorar o Sono.pdf", type: "pdf" as const, size: "1.5MB", uploadDate: "2024-06-15", dataAiHint:"documento sono"},
 { id: "res_global_3", name: "Cartilha sobre Ansiedade Social.docx", type: "docx" as const, size: "350KB", uploadDate: "2024-05-20", dataAiHint:"documento cartilha"},
 { id: "res_global_4", name: "Infográfico: Ciclo da Depressão.png", type: "image" as const, size: "3.0MB", uploadDate: "2024-07-12", dataAiHint:"imagem infográfico"},
];


export const mockPatient = {
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

// Simplified data structures
const initialSessionNotes = [
  { id: "sn1", date: "2024-07-15", summary: "Sessão focada em mecanismos de enfrentamento para ansiedade..." },
];
const initialAssessments = [
  { id: "asm1", name: "Inventário de Depressão de Beck", dateSent: "2024-07-01", status: "Completed" as const, score: "15/63" },
];
const initialPatientResources = [
 { id: "res1", name: "Guia de Mindfulness.pdf", type: "pdf" as const, size: "1.2MB", sharedDate: "2024-07-02", dataAiHint: "documento mindfulness" },
];
const mockPsychologicalDocumentsList: any[] = [ // Simplified type
  { id: "doc1", name: "Laudo Psicológico Inicial - Alice W.", type: "Laudo", creationDate: "2024-07-05" },
];


export default function PatientDetailPage() {
  const pageParams = useParams();
  // const patientId = pageParams.id as string;

  const patient = mockPatient;
  const patientAge = 34; // Simplified
  const lastClinicalFocus = "Mecanismos de enfrentamento para ansiedade"; // Simplified
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || "overview";
  
  // const clinicalStore = useClinicalStore() as any; // Temporarily comment out store usage if problematic
  // const tabs: ClinicalTab[] = clinicalStore.tabs ?? [];
  // const activeTabId: string | undefined = clinicalStore.activeTabId;
  // const fetchClinicalData: ((patientId: string, tabId: string) => void) | undefined = clinicalStore.fetchClinicalData;
  // const activeClinicalTab = useMemo(
  //   () => tabs.find((t: ClinicalTab) => t.id === activeTabId),
  //   [tabs, activeTabId]
  // ) as ClinicalTab | undefined;

  // useEffect(() => {
  //   if (activeTabId && typeof fetchClinicalData === 'function') {
  //     fetchClinicalData(patientId, activeTabId);
  //   }
  // }, [activeTabId, patientId, fetchClinicalData]);


  const [sessionNotes, _setSessionNotes] = useState(initialSessionNotes);
  const [_assessments, _setAssessments] = useState<Array<{ id: string; name: string; dateSent: string; status: "Completed" | "Pending" | "Sent"; score?: string }>>(initialAssessments);
  const [_patientResources, _setPatientResources] = useState<Array<any>>(initialPatientResources); // Simplified type
  const [_psychologicalDocuments, _setPsychologicalDocuments] = useState<any[]>(mockPsychologicalDocumentsList); // Simplified type


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

  // Comment out most complex logic for now
  const formattedDob = useMemo(() => patient.dob ? format(new Date(patient.dob), "P", { locale: ptBR }) : "N/A", [patient.dob]);
  const formattedNextAppointment = useMemo(() => patient.nextAppointment
    ? format(new Date(patient.nextAppointment), "P 'às' HH:mm", { locale: ptBR })
    : "Não agendado", [patient.nextAppointment]);
  const formattedLastSession = useMemo(() => patient.lastSession
    ? format(new Date(patient.lastSession), "P", { locale: ptBR })
    : "N/A", [patient.lastSession]);


  return (
    <div className="flex flex-col h-full space-y-6 pt-16">
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-2">
        <div className="font-semibold">{patient.name}, {patientAge} anos</div>
        <div className="text-sm text-muted-foreground">Último foco clínico: {lastClinicalFocus}</div>
      </div>
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
                {/* <CopyButton value={patient.email} className="ml-1 h-6 w-6" /> */}
                <span className="mx-2">|</span>
                <Phone className="mr-1.5 h-4 w-4 opacity-70" /> {patient.phone}
                {/* <CopyButton value={patient.phone} className="ml-1 h-6 w-6" /> */}
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
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5"> {/* Adjusted grid-cols */}
          <TabsTrigger value="overview"><HomeIconLucide className="mr-1.5 h-4 w-4"/>Visão Geral</TabsTrigger>
          <TabsTrigger value="timeline"><HistoryIcon className="mr-1.5 h-4 w-4"/>Linha do Tempo</TabsTrigger>
          <TabsTrigger value="formulations"><Lightbulb className="mr-1.5 h-4 w-4"/>Formulações</TabsTrigger>
          <TabsTrigger value="assessments"><ClipboardList className="mr-1.5 h-4 w-4"/>Avaliações</TabsTrigger>
          <TabsTrigger value="resources"><Share2 className="mr-1.5 h-4 w-4"/>Recursos</TabsTrigger>
          <TabsTrigger value="documents"><FileArchive className="mr-1.5 h-4 w-4"/>Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-headline">Informações Gerais</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0 overflow-auto">
              <div><span className="font-medium">Data de Nascimento:</span> {formattedDob}</div>
              <div><span className="font-medium">Psicólogo(a):</span> {patient.assignedPsychologist}</div>
              <div><span className="font-medium">Endereço:</span> {patient.address || "Não informado"}</div>
              <div><span className="font-medium">Próxima Consulta:</span> {formattedNextAppointment}</div>
              <div><span className="font-medium">Última Sessão:</span> {formattedLastSession}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Últimas Anotações de Sessão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionNotes.length > 0 ? (
                sessionNotes.slice(0, 2).map(note => <div key={note.id}>{note.summary}</div>)
              ) : <p className="text-muted-foreground">Nenhuma anotação de sessão encontrada.</p>}
            </CardContent>
          </Card>
          <div>Visão Geral - Placeholder para Progresso e Tarefas</div>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-6">
            <div className="p-6 text-center text-muted-foreground">Placeholder para Linha do Tempo.</div>
        </TabsContent>

        <TabsContent value="formulations" className="mt-6 relative">
            <div className="p-6 text-center text-muted-foreground">Placeholder para Formulações.</div>
        </TabsContent>

        <TabsContent value="assessments" className="mt-6 space-y-6">
            <div className="p-6 text-center text-muted-foreground">Placeholder para Avaliações.</div>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6 space-y-6">
            <div className="p-6 text-center text-muted-foreground">Placeholder para Recursos.</div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6 space-y-6">
            <div className="p-6 text-center text-muted-foreground">Placeholder para Documentos.</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
    
