import { act } from '@testing-library/react';
import {
  fetchClinicalData as fetchSvc,
  saveClinicalData as saveSvc,
  updateNodes as updateNodesSvc,
} from '@/services/clinicalService';
import { useClinicalStore } from '@/stores/clinicalStore';

jest.mock('@/services/clinicalService');

describe('useClinicalStore async state', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('manage loading and error on fetchClinicalData success', async () => {
    (fetchSvc as jest.Mock).mockResolvedValue(undefined);

    const promise = useClinicalStore.getState().fetchClinicalData('p1', 't1');
    expect(useClinicalStore.getState().isLoadingClinicalData).toBe(true);
    await act(async () => {
      await promise;
    });
    expect(useClinicalStore.getState().isLoadingClinicalData).toBe(false);
    expect(useClinicalStore.getState().clinicalDataError).toBeNull();
  });

  it('manage loading and error on fetchClinicalData failure', async () => {
    (fetchSvc as jest.Mock).mockRejectedValue(new Error('erro'));

    const promise = useClinicalStore.getState().fetchClinicalData('p1', 't1');
    expect(useClinicalStore.getState().isLoadingClinicalData).toBe(true);
    await act(async () => {
      await promise;
    });
    expect(useClinicalStore.getState().isLoadingClinicalData).toBe(false);
    expect(useClinicalStore.getState().clinicalDataError).toBe('erro');
  });

  it('manage loading and error on saveClinicalData failure', async () => {
    (saveSvc as jest.Mock).mockRejectedValue(new Error('falhou'));

    const promise = useClinicalStore.getState().saveClinicalData('p1', 't1');
    expect(useClinicalStore.getState().isLoadingClinicalData).toBe(true);
    await act(async () => {
      await promise;
    });
    expect(useClinicalStore.getState().isLoadingClinicalData).toBe(false);
    expect(useClinicalStore.getState().clinicalDataError).toBe('falhou');
  });

  it('rollback nodes on addNode failure', async () => {
    (updateNodesSvc as jest.Mock).mockRejectedValue(new Error('fail'));

    useClinicalStore.setState({
      patientId: 'p1',
      activeTabId: 't1',
      formulationTabData: {
        t1: {
          cards: [],
          schemas: [],
          nodes: [],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 1 },
          insights: [],
          formulationGuideAnswers: {},
          quickNotes: [],
          cardGroups: [],
          activeColorFilters: [],
          showSchemaNodes: true,
          emotionIntensityFilter: 0,
        },
      },
    });

    await act(async () => {
      await useClinicalStore.getState().addNode({ id: 'n1' });
    });

    expect(useClinicalStore.getState().formulationTabData.t1.nodes).toEqual([]);
  });
});
