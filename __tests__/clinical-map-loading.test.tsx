import { render, screen } from '@testing-library/react';
import ClinicalMapFullscreenPage from '@/app/clinical-map/[patientId]/[tabId]/page';
import { useClinicalStore } from '@/stores/clinicalStore';

jest.mock('next/navigation', () => ({
  useParams: () => ({ patientId: 'p1', tabId: 't1' }),
}));

describe('ClinicalMap page loading and error states', () => {
  beforeEach(() => {
    useClinicalStore.setState({
      fetchClinicalData: jest.fn(),
      setActiveTab: jest.fn(),
      tabs: [{ id: 't1', type: 'formulation', title: 'T1' }],
      isLoadingClinicalData: false,
      clinicalDataError: null,
    });
  });

  it('exibe spinner durante carregamento', () => {
    useClinicalStore.setState({ isLoadingClinicalData: true });
    render(<ClinicalMapFullscreenPage />);
    expect(screen.getByText(/carregando dados cl.nicos/i)).toBeInTheDocument();
  });

  it('exibe mensagem de erro se falhar', () => {
    useClinicalStore.setState({ clinicalDataError: 'Erro X' });
    render(<ClinicalMapFullscreenPage />);
    expect(screen.getByText(/erro ao carregar dados cl.nicos/i)).toBeInTheDocument();
    expect(screen.getByText('Erro X')).toBeInTheDocument();
  });
});
