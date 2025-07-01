// src/features/patient-hub/components/PatientHub.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PatientHub } from './PatientHub';
import { patientApi } from '../services/patient-api';

// Mock do next/navigation para useParams
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({ patientId: 'patient123' })),
}));

// Mock do patientApi para controlar os dados nos testes
jest.mock('../services/patient-api', () => ({
  patientApi: {
    fetchPatientData: jest.fn(),
    fetchMedicalRecord: jest.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('PatientHub', () => {
  beforeEach(() => {
    queryClient.clear();
    // Resetar mocks antes de cada teste
    (patientApi.fetchPatientData as jest.Mock).mockReset();
    (patientApi.fetchMedicalRecord as jest.Mock).mockReset();
  });

  it('should display loading state initially', () => {
    (patientApi.fetchPatientData as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolve
    renderWithClient(<PatientHub />);

    expect(screen.getByRole('heading', { level: 1, name: /carregando/i })).toBeInTheDocument();
    expect(screen.getByText(/carregando informações do paciente/i)).toBeInTheDocument();
  });

  it('should display error message if data fetching fails', async () => {
    (patientApi.fetchPatientData as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    renderWithClient(<PatientHub />);

    await waitFor(() => {
      expect(screen.getByText(/erro ao carregar dados do paciente/i)).toBeInTheDocument();
    });
  });

  it('should display patient not found message if no patient data', async () => {
    (patientApi.fetchPatientData as jest.Mock).mockResolvedValue(null);
    renderWithClient(<PatientHub />);

    await waitFor(() => {
      expect(screen.getByText(/paciente não encontrado/i)).toBeInTheDocument();
    });
  });

  it('should display patient data and tabs when data is successfully fetched', async () => {
    const mockPatient = {
      id: 'patient123',
      name: 'Maria Silva',
      email: 'maria.silva@example.com',
      contact: '(11) 98765-4321',
      medicalRecordId: 'mr456',
      sessionNotes: [],
      assessments: [],
      progressCharts: {},
      reports: [],
      homeworkAssignments: [],
      therapeuticGoals: [],
    };
    (patientApi.fetchPatientData as jest.Mock).mockResolvedValue(mockPatient);
    (patientApi.fetchMedicalRecord as jest.Mock).mockResolvedValue({
      id: 'mr456',
      patientId: 'patient123',
      allergies: 'Nenhuma',
      medications: 'Fluoxetina',
      pastHistory: 'Depressão',
      currentConditions: 'Ansiedade',
    });

    renderWithClient(<PatientHub />);

    await waitFor(() => {
      expect(screen.getByText('Maria Silva')).toBeInTheDocument();
      expect(screen.getByText('maria.silva@example.com | (11) 98765-4321')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Prontuário' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Sessões' })).toBeInTheDocument();
    });
  });
});
