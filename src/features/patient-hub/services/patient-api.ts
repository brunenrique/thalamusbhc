import { Patient, MedicalRecord, SessionNote, Assessment, ProgressChartData, Report, HomeworkAssignment, TherapeuticGoal } from "@/types/patient-hub";

// Simulação de um banco de dados em memória
const mockPatients: Record<string, Patient> = {
  "patient123": {
    id: "patient123",
    name: "Maria Silva",
    dob: "1985-03-10",
    gender: "Feminino",
    contact: "(11) 98765-4321",
    email: "maria.silva@example.com",
    address: "Rua das Flores, 123, São Paulo - SP",
    medicalRecordId: "mr456",
    sessionNotes: [
      { id: "sn001", date: "2024-01-15", title: "Primeira Sessão", content: "Conteúdo da primeira sessão..." },
      { id: "sn002", date: "2024-02-20", title: "Sessão de Acompanhamento", content: "Conteúdo da segunda sessão..." },
    ],
    assessments: [
      { id: "as001", name: "Questionário de Ansiedade", date: "2024-01-20", score: 75, status: "Concluído" },
    ],
    progressCharts: {
      anxiety: [
        { date: "2024-01-01", value: 60 },
        { date: "2024-02-01", value: 55 },
        { date: "2024-03-01", value: 50 },
      ],
    },
    reports: [
      { id: "rp001", name: "Relatório Mensal - Fev 2024", date: "2024-02-28", url: "/reports/rp001.pdf" },
    ],
    homeworkAssignments: [
      { id: "hw001", title: "Exercício de Respiração", dueDate: "2024-03-05", status: "Pendente" },
    ],
    therapeuticGoals: [
      { id: "tg001", description: "Reduzir ansiedade em 20%", startDate: "2024-01-01", endDate: "2024-06-30", status: "Em andamento" },
    ],
  },
  "patient124": {
    id: "patient124",
    name: "João Oliveira",
    dob: "1990-07-22",
    gender: "Masculino",
    contact: "(21) 99887-6655",
    email: "joao.oliveira@example.com",
    address: "Av. Principal, 456, Rio de Janeiro - RJ",
    medicalRecordId: "mr457",
    sessionNotes: [
      { id: "sn003", date: "2024-03-01", title: "Sessão Inicial", content: "Conteúdo da sessão inicial..." },
    ],
    assessments: [],
    progressCharts: {},
    reports: [],
    homeworkAssignments: [],
    therapeuticGoals: [],
  },
};

const mockMedicalRecords: Record<string, MedicalRecord> = {
  "mr456": {
    id: "mr456",
    patientId: "patient123",
    allergies: "Nenhuma",
    medications: "Fluoxetina 20mg",
    pastHistory: "Depressão leve em 2020",
    currentConditions: "Ansiedade generalizada",
  },
  "mr457": {
    id: "mr457",
    patientId: "patient124",
    allergies: "Pólen",
    medications: "Nenhum",
    pastHistory: "Nenhum",
    currentConditions: "Estresse",
  },
};

export const patientApi = {
  fetchPatientData: async (patientId: string): Promise<Patient | null> => {
    console.log(`[INFO] Attempting to fetch patient data for ID: ${patientId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const patient = mockPatients[patientId] || null;
        if (patient) {
          console.log(`[INFO] Successfully fetched patient data for ID: ${patientId}`);
          resolve(patient);
        } else {
          console.warn(`[WARN] Patient not found for ID: ${patientId}`);
          resolve(null);
        }
      }, 1000); // Simula um atraso de rede
    });
  },

  fetchMedicalRecord: async (medicalRecordId: string): Promise<MedicalRecord | null> => {
    console.log(`[INFO] Attempting to fetch medical record for ID: ${medicalRecordId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const medicalRecord = mockMedicalRecords[medicalRecordId] || null;
        if (medicalRecord) {
          console.log(`[INFO] Successfully fetched medical record for ID: ${medicalRecordId}`);
          resolve(medicalRecord);
        } else {
          console.warn(`[WARN] Medical record not found for ID: ${medicalRecordId}`);
          resolve(null);
        }
      }, 800); // Simula um atraso de rede
    });
  },

  // Adicione outras funções de API conforme necessário para as outras seções
  // Ex: fetchSessionNotes, fetchAssessments, etc.
};
