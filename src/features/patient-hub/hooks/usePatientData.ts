import { useQuery } from "@tanstack/react-query";
import { patientApi } from "../services/patient-api";
import { Patient } from "@/types/patient-hub";

export const usePatientData = (patientId: string) => {
  return useQuery<Patient | null, Error>({
    queryKey: ["patientData", patientId],
    queryFn: () => patientApi.fetchPatientData(patientId),
    enabled: !!patientId, // Só executa a query se patientId existir
  });
};
