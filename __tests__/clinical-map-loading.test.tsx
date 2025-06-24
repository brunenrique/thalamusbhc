import { render, screen } from '@testing-library/react';
import ClinicalMapClient from '@/app/clinical-map/[patientId]/[tabId]/ClinicalMapClient';
import { useClinicalStore } from '@/stores/clinicalStore';


describe('ClinicalMapClient loading and error states', () => {
  beforeEach(() => {
    useClinicalStore.setState({
      fetchClinicalData: jest.fn(),
      setActiveTab: jest.fn(),
      tabs: [{ id: 't1', type: 'formulation', title: 'T1' }],
      isLoadingClinicalData: false,
      clinicalDataError: null,
      formulationTabData: {},
    });
  });

  it('exibe spinner durante carregamento', () => {
    useClinicalStore.setState({ isLoadingClinicalData: true });
    render(
      <ClinicalMapClient
        patientId="p1"
        tabId="t1"
        initialPatient={null}
        initialMap={null}
      />
    );
    expect(screen.getByText(/carregando dados cl.nicos/i)).toBeInTheDocument();
  });

  it('exibe mensagem de erro se falhar', () => {
    useClinicalStore.setState({ clinicalDataError: 'Erro X' });
    render(
      <ClinicalMapClient
        patientId="p1"
        tabId="t1"
        initialPatient={null}
        initialMap={null}
      />
    );
    expect(screen.getByText(/erro ao carregar dados cl.nicos/i)).toBeInTheDocument();
    expect(screen.getByText('Erro X')).toBeInTheDocument();
  });
});
