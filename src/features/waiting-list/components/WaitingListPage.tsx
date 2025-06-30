import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWaitingListEntries, removeWaitingListEntry, addWaitingListEntry } from "@/features/waiting-list/api";
import { WaitingListEntry } from "@/features/waiting-list/types";
import { patientApi } from "@/features/patient-hub/services/patient-api";
import { Patient } from "@/types/patient-hub";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const WaitingListPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: waitingList, isLoading, isError } = useQuery<WaitingListEntry[]>(
    { queryKey: ["waitingList"], queryFn: getWaitingListEntries }
  );

  const addPatientMutation = useMutation({
    mutationFn: patientApi.addPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({
        title: "Sucesso!",
        description: "Paciente adicionado à lista de pacientes ativos.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao adicionar paciente: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const removeWaitingListEntryMutation = useMutation({
    mutationFn: removeWaitingListEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitingList"] });
      toast({
        title: "Sucesso!",
        description: "Entrada da lista de espera removida.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Falha ao remover entrada: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleMoveToActive = async (entry: WaitingListEntry) => {
    const newPatient: Patient = {
      id: entry.patientId,
      name: entry.patientName,
      contact: entry.contactInfo,
      dob: "", // Placeholder, as DOB is not in WaitingListEntry
      gender: "", // Placeholder
      email: "", // Placeholder
      address: "", // Placeholder
      medicalRecordId: "", // Placeholder
      sessionNotes: [],
      assessments: [],
      progressCharts: {},
      reports: [],
      homeworkAssignments: [],
      therapeuticGoals: [],
    };

    try {
      await addPatientMutation.mutateAsync(newPatient);
      await removeWaitingListEntryMutation.mutateAsync(entry.id);
    } catch (error) {
      console.error("Failed to move patient to active list:", error);
    }
  };

  if (isLoading) return <div>Carregando lista de espera...</div>;
  if (isError) return <div>Erro ao carregar lista de espera.</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gestão da Lista de Espera</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Paciente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Razão</TableHead>
            <TableHead>Data de Entrada</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {waitingList?.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.patientName}</TableCell>
              <TableCell>{entry.contactInfo}</TableCell>
              <TableCell>{entry.reason}</TableCell>
              <TableCell>{new Date(entry.entryDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button onClick={() => handleMoveToActive(entry)}>
                  Mover para Pacientes Ativos
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {waitingList?.length === 0 && (
        <p className="text-center mt-4">Nenhum paciente na lista de espera.</p>
      )}
    </div>
  );
};
