
"use client";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, CalendarDays, Edit, FileText, Brain, CheckCircle, Clock, Archive, MessageSquare, Trash2, Users as UsersIconLucide, Home as HomeIconLucide, Share2, UploadCloud, Calendar as CalendarIconShad } from "lucide-react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import PatientTimeline from "@/components/patients/patient-timeline";
import SessionNoteCard from "@/components/patients/session-note-card";
import ResourceCard from "@/components/resources/resource-card";
import AssessmentCard from "@/components/assessments/assessment-card";
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
  DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";


// Mock data for global clinic resources (could be imported or fetched)
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
  avatarUrl: "https://placehold.co/150x150/D0BFFF/4F3A76?text=AW",
  dataAiHint: "female avatar",
  nextAppointment: "2024-07-22T10:00:00Z",
  lastSession: "2024-07-15",
  assignedPsychologist: "Dr. Silva",
  address: "Rua Principal, 123, Cidade Alegre, BR",
};

const initialSessionNotes = [
  { id: "sn1", date: "2024-07-15", summary: "Sessão focada em mecanismos de enfrentamento para ansiedade. Paciente relata melhora na qualidade do sono após aplicar técnicas de relaxamento que foram ensinadas na sessão anterior. Apresentou-se engajada e participativa. Discutimos a importância da exposição gradual e planejamos pequenos passos para a próxima semana. Tarefa: praticar respiração diafragmática duas vezes ao dia.", keywords: ["ansiedade", "enfrentamento", "sono", "relaxamento", "exposição gradual"], themes: ["gerenciamento de estresse", "técnicas de relaxamento", "TCC"] },
  { id: "sn2", date: "2024-07-08", summary: "Exploramos dinâmicas familiares e padrões de comunicação. Identificamos alguns gatilhos em interações com a mãe que disparam sentimentos de inadequação. Paciente expressou dificuldade em estabelecer limites saudáveis. Trabalhamos role-playing de comunicação assertiva, focando em frases 'Eu sinto...' e pedidos claros. Paciente demonstrou progresso na identificação de pensamentos automáticos negativos relacionados a estas interações.", keywords: ["família", "comunicação", "limites", "assertividade", "pensamentos automáticos"], themes: ["relacionamentos interpessoais", "comunicação assertiva", "dinâmica familiar"] },
];

const initialAssessments = [
  { id: "asm1", name: "Inventário de Depressão de Beck", dateSent: "2024-07-01", status: "Completed" as const, score: "15/63" },
  { id: "asm2", name: "Escala de Ansiedade GAD-7", dateSent: "2024-07-10", status: "Pending" as const },
];

const initialPatientResources = [
 { id: "res1", name: "Guia de Mindfulness.pdf", type: "pdf" as const, size: "1.2MB", sharedDate: "2024-07-02", dataAiHint: "documento mindfulness" },
 { id: "res2", name: "Dicas de Higiene do Sono.pdf", type: "pdf" as const, size: "800KB", sharedDate: "2024-06-20", dataAiHint: "documento sono" },
];

// Mock data for assessment templates (used in "Assign Assessment" Dialog)
const mockAssessmentTemplates = [
  { id: "tpl_bdi", name: "Inventário de Depressão de Beck (BDI)" },
  { id: "tpl_gad7", name: "Escala de Ansiedade GAD-7" },
  { id: "tpl_rosenberg", name: "Escala de Autoestima de Rosenberg" },
  { id: "tpl_pcl5", name: "Checklist de TEPT (PCL-5)" },
];


export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = mockPatient; 
  const router = useRouter();
  const { toast } = useToast();

  const [sessionNotes, setSessionNotes] = useState(initialSessionNotes);
  const [assessments, setAssessments] = useState(initialAssessments);
  const [patientResources, setPatientResources] = useState(initialPatientResources);

  const [selectedAssessmentTemplate, setSelectedAssessmentTemplate] = useState<string>("");
  const [assessmentSendDate, setAssessmentSendDate] = useState<Date | undefined>(undefined);

  const [selectedGlobalResource, setSelectedGlobalResource] = useState<string>("");
  const [resourceShareNotes, setResourceShareNotes] = useState<string>("");

  useEffect(() => {
    setAssessmentSendDate(new Date());
  }, []);


  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() || '';
    return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
  };

  const handleArchivePatient = () => {
    console.log(`Arquivando paciente ${patient.id}... (Simulado)`);
    toast({
      title: "Paciente Arquivado (Simulado)",
      description: `${patient.name} foi marcado(a) como arquivado(a).`,
    });
  };
  
  const handleDeletePatient = () => {
    console.log(`Excluindo paciente ${patient.id}... (Simulado)`);
    toast({
      title: "Paciente Excluído (Simulado)",
      description: `${patient.name} foi excluído(a) permanentemente.`,
      variant: "destructive",
    });
    router.push("/patients");
  };

  const handleAssignAssessment = () => {
    if (!selectedAssessmentTemplate || !assessmentSendDate) {
      toast({ title: "Erro", description: "Selecione um modelo e uma data de envio.", variant: "destructive" });
      return;
    }
    const template = mockAssessmentTemplates.find(t => t.id === selectedAssessmentTemplate);
    if (!template) {
        toast({ title: "Erro", description: "Modelo de avaliação não encontrado.", variant: "destructive" });
        return;
    }
    const newAssessment = {
      id: `asm_${Date.now()}`,
      name: template.name,
      dateSent: format(assessmentSendDate, "yyyy-MM-dd"),
      status: "Sent" as const,
    };
    setAssessments(prev => [newAssessment, ...prev].sort((a, b) => new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime()));
    toast({
      title: "Avaliação Atribuída",
      description: `"${template.name}" atribuída a ${patient.name}. Link de preenchimento simulado enviado.`,
    });
    setSelectedAssessmentTemplate("");
    setAssessmentSendDate(new Date());
  };

  const handleShareResource = () => {
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
  };


  const formattedDob = patient.dob ? format(new Date(patient.dob), "P", { locale: ptBR }) : "N/A";
  const formattedNextAppointment = patient.nextAppointment 
    ? format(new Date(patient.nextAppointment), "P 'às' HH:mm", { locale: ptBR }) 
    : "Não agendado";
  const formattedLastSession = patient.lastSession 
    ? format(new Date(patient.lastSession), "P", { locale: ptBR }) 
    : "N/A";


  return (
    <div className="space-y-6">
      <Card className="shadow-sm overflow-hidden">
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
                <span className="flex items-center"><Mail className="mr-1.5 h-4 w-4" /> {patient.email}</span>
                <span className="flex items-center"><Phone className="mr-1.5 h-4 w-4" /> {patient.phone}</span>
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="session_notes">Anotações</TabsTrigger>
          <TabsTrigger value="assessments">Avaliações</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Visão Geral do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <InfoItem icon={<CalendarDays className="text-accent" />} label="Próximo Agendamento" value={formattedNextAppointment} />
              <InfoItem icon={<Clock className="text-accent" />} label="Última Sessão" value={formattedLastSession} />
              <InfoItem icon={<UsersIconLucide className="text-accent h-5 w-5" />} label="Psicólogo(a) Responsável" value={patient.assignedPsychologist} />
              <InfoItem icon={<HomeIconLucide className="text-accent h-5 w-5" />} label="Endereço" value={patient.address} className="md:col-span-2"/>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session_notes" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="font-headline">Anotações de Sessão</CardTitle>
                <CardDescription>Registro cronológico das sessões de terapia.</CardDescription>
              </div>
              <Button variant="outline" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <FileText className="mr-2 h-4 w-4" /> Nova Anotação
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionNotes.map(note => (
                <SessionNoteCard key={note.id} note={note} patientName={patient.name} therapistName={patient.assignedPsychologist} />
              ))}
              {sessionNotes.length === 0 && <p className="text-muted-foreground">Nenhuma anotação de sessão registrada ainda.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="font-headline">Avaliações</CardTitle>
                <CardDescription>Acompanhe e gerencie as avaliações do paciente.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <CheckCircle className="mr-2 h-4 w-4" /> Atribuir Avaliação
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Atribuir Avaliação a {patient.name}</DialogTitle>
                        <DialogDescription>
                            Selecione um modelo de avaliação e uma data de envio.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="assessment-template" className="text-right col-span-1">
                                Modelo
                            </Label>
                            <Select value={selectedAssessmentTemplate} onValueChange={setSelectedAssessmentTemplate}>
                                <SelectTrigger id="assessment-template" className="col-span-3">
                                    <SelectValue placeholder="Selecione um modelo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockAssessmentTemplates.map(template => (
                                        <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="assessment-date" className="text-right col-span-1">
                                Data Envio
                            </Label>
                             <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIconShad className="mr-2 h-4 w-4" />
                                        {assessmentSendDate ? format(assessmentSendDate, "P", {locale: ptBR}) : <span>Escolha uma data</span>}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={assessmentSendDate}
                                        onSelect={setAssessmentSendDate}
                                        initialFocus
                                        locale={ptBR}
                                    />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="button" onClick={handleAssignAssessment} disabled={!selectedAssessmentTemplate || !assessmentSendDate}>Atribuir</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {assessments.map(assessment => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
              {assessments.length === 0 && <p className="text-muted-foreground md:col-span-full">Nenhuma avaliação atribuída ou concluída.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Linha do Tempo do Paciente</CardTitle>
              <CardDescription>Eventos chave e interações relacionadas ao paciente.</CardDescription>
            </CardHeader>
            <CardContent>
              <PatientTimeline patientId={params.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
             <div>
                <CardTitle className="font-headline">Recursos Compartilhados com {patient.name}</CardTitle>
                <CardDescription>Documentos e guias compartilhados com este paciente.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                   <Button variant="outline" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Share2 className="mr-2 h-4 w-4" /> Compartilhar Novo Recurso
                   </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Compartilhar Recurso com {patient.name}</DialogTitle>
                        <DialogDescription>
                            Selecione um recurso da biblioteca da clínica para compartilhar com este paciente.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="global-resource-select">Recurso da Clínica</Label>
                            <Select value={selectedGlobalResource} onValueChange={setSelectedGlobalResource}>
                                <SelectTrigger id="global-resource-select">
                                    <SelectValue placeholder="Selecione um recurso global" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockGlobalClinicResources.map(res => (
                                        <SelectItem key={res.id} value={res.id}>{res.name} ({res.type}, {res.size})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="resource-share-notes">Notas para o Paciente (Opcional)</Label>
                            <Textarea
                                id="resource-share-notes"
                                value={resourceShareNotes}
                                onChange={(e) => setResourceShareNotes(e.target.value)}
                                placeholder="Ex: Dê uma olhada neste material antes da nossa próxima sessão."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                        <DialogClose asChild>
                            <Button type="button" onClick={handleShareResource} disabled={!selectedGlobalResource}>
                                Compartilhar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {patientResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
              {patientResources.length === 0 && <p className="text-muted-foreground md:col-span-full">Nenhum recurso compartilhado com este paciente ainda.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  className?: string;
}

function InfoItem({ icon, label, value, className }: InfoItemProps) {
  return (
    <div className={`flex items-start gap-3 p-3 bg-secondary/30 rounded-md ${className}`}>
      <span className="text-muted-foreground mt-1">{icon}</span>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-foreground">{value || "N/A"}</p>
      </div>
    </div>
  );
}


    