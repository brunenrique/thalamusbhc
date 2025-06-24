/* eslint-disable no-unused-vars */
// src/stores/clinicalStore.ts

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  fetchClinicalData as fetchClinicalDataSvc,
  saveClinicalData as saveClinicalDataSvc,
  updateNodes as updateNodesSvc,
  updateEdges as updateEdgesSvc,
} from '@/services/clinicalService';
import { toast } from '@/hooks/use-toast';
import logger from '@/lib/logger';
import type {
  BaseCard,
  Label,
  ClinicalTab,
  ClinicalTabType,
  TabSpecificFormulationData,
  QuickNote,
} from '@/types/clinicalTypes';

type PanelType = 'hexaflex' | 'chain' | 'matrix' | null;

const defaultTabData: TabSpecificFormulationData = {
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
};

interface ClinicalState {
  patientId?: string;
  tabs: ClinicalTab[];
  activeTabId?: string;
  formulationTabData: Record<string, TabSpecificFormulationData>;
  cards: BaseCard[];
  labels: Label[];
  activePanel: PanelType;
  panelState: Record<string, any>;

  isABCFormOpen: boolean;
  editingCardId?: string;
  openABCForm: (cardId?: string) => void;
  closeABCForm: () => void;

  isSchemaFormOpen: boolean;
  editingSchemaId?: string;
  prefillSchemaRule?: string;
  openSchemaForm: (schemaId?: string, prefillRule?: string) => void;
  closeSchemaForm: () => void;

  isQuickNoteFormOpen: boolean;
  quickNoteFormTarget?: { cardId?: string; noteIdToEdit?: string; defaultText?: string };
  openQuickNoteForm: (opts?: {
    cardId?: string;
    noteIdToEdit?: string;
    defaultText?: string;
  }) => void;
  closeQuickNoteForm: () => void;

  isQuickNotesPanelVisible: boolean;
  toggleQuickNotesPanelVisibility: () => void;
  quickNotes: QuickNote[];
  addQuickNote: (note: QuickNote) => void;
  deleteQuickNote: (id: string) => void;

  addCard: (card: BaseCard) => void;
  archiveCard: (cardId: string) => void;
  restoreCard: (cardId: string) => void;

  addLabel: (label: Omit<Label, 'id'>) => void;
  assignLabelToCard: (cardId: string, labelId: string) => void;

  addTab: (type: ClinicalTabType, title: string) => string;
  removeTab: (id: string) => void;
  renameTab: (id: string, title: string) => void;
  setActiveTab: (id: string) => void;

  /** Indica se dados clínicos estão sendo carregados */
  isLoadingClinicalData: boolean;
  /** Mensagem de erro durante operações de clínica */
  clinicalDataError: string | null;
  fetchClinicalData: (patientId: string, tabId: string) => void;
  saveClinicalData: (patientId: string, tabId: string) => void;

  setPatientId: (id: string) => void;

  addNode: (node: any) => Promise<void>;
  updateNode: (id: string, data: any) => Promise<void>;
  deleteNode: (id: string) => Promise<void>;
  addEdge: (edge: any) => Promise<void>;
  deleteEdge: (id: string) => Promise<void>;

  setActivePanel: (panel: PanelType) => void;
  setPanelState: (panel: string, state: any) => void;
}

export const useClinicalStore = create<ClinicalState>()(
  persist(
    (set, get) => ({
      // ----- Tab Management -----
      patientId: undefined,
      tabs: [{ id: 'initialTab', type: 'formulation', title: 'Formulação Inicial' }],
      activeTabId: 'initialTab',
      formulationTabData: {},
      isLoadingClinicalData: false,
      clinicalDataError: null,

      addTab: (type, title) => {
        const id = crypto.randomUUID();
        set((state) => ({
          tabs: [...state.tabs, { id, type, title }],
          activeTabId: id,
        }));
        return id;
      },
      removeTab: (id) =>
        set((state) => ({
          tabs: state.tabs.filter((t) => t.id !== id),
          activeTabId: state.activeTabId === id ? state.tabs[0]?.id : state.activeTabId,
        })),
      renameTab: (id, title) =>
        set((state) => ({ tabs: state.tabs.map((t) => (t.id === id ? { ...t, title } : t)) })),
      setActiveTab: (id) => set({ activeTabId: id }),
      setPatientId: (id) => set({ patientId: id }),

      fetchClinicalData: async (patientId, tabId) => {
        set({ isLoadingClinicalData: true, clinicalDataError: null });
        try {
          await fetchClinicalDataSvc(patientId, tabId);
          set((state) => ({
            formulationTabData: {
              ...state.formulationTabData,
              [tabId]: state.formulationTabData[tabId] || { ...defaultTabData },
            },
          }));
        } catch (error: any) {
          logger.error({ action: 'fetch_clinical_data', meta: { error } });
          set({ clinicalDataError: error?.message ?? 'Falha ao carregar dados clínicos.' });
        } finally {
          set({ isLoadingClinicalData: false });
        }
      },
      saveClinicalData: async (patientId, tabId) => {
        set({ isLoadingClinicalData: true, clinicalDataError: null });
        try {
          const data = get().formulationTabData[tabId];
          await saveClinicalDataSvc(patientId, tabId, data);
        } catch (error: any) {
          set({ clinicalDataError: error?.message ?? String(error) });
        } finally {
          set({ isLoadingClinicalData: false });
        }
      },

      prefillSchemaRule: undefined,

      isABCFormOpen: false,
      editingCardId: undefined,
      openABCForm: (cardId) => set({ isABCFormOpen: true, editingCardId: cardId }),
      closeABCForm: () => set({ isABCFormOpen: false, editingCardId: undefined }),

      isSchemaFormOpen: false,
      editingSchemaId: undefined,
      openSchemaForm: (schemaId, prefillRule) =>
        set({ isSchemaFormOpen: true, editingSchemaId: schemaId, prefillSchemaRule: prefillRule }),
      closeSchemaForm: () =>
        set({ isSchemaFormOpen: false, editingSchemaId: undefined, prefillSchemaRule: undefined }),

      isQuickNoteFormOpen: false,
      quickNoteFormTarget: undefined,
      openQuickNoteForm: (opts) => set({ isQuickNoteFormOpen: true, quickNoteFormTarget: opts }),
      closeQuickNoteForm: () => set({ isQuickNoteFormOpen: false, quickNoteFormTarget: undefined }),

      isQuickNotesPanelVisible: false,
      toggleQuickNotesPanelVisibility: () =>
        set((s) => ({ isQuickNotesPanelVisible: !s.isQuickNotesPanelVisible })),
      quickNotes: [],
      addQuickNote: (note) => set((state) => ({ quickNotes: [...state.quickNotes, note] })),
      deleteQuickNote: (id) =>
        set((state) => ({ quickNotes: state.quickNotes.filter((n) => n.id !== id) })),

      addNode: async (newNode) => {
        const { activeTabId, patientId, formulationTabData } = get();
        if (!activeTabId || !patientId) return;
        const previousNodes = formulationTabData[activeTabId]?.nodes || [];
        const newNodes = [...previousNodes, newNode];
        set({
          formulationTabData: {
            ...formulationTabData,
            [activeTabId]: { ...formulationTabData[activeTabId], nodes: newNodes },
          },
        });
        try {
          await updateNodesSvc(patientId, activeTabId, newNodes);
        } catch (error) {
          console.error('Falha ao salvar o novo nó:', error);
          set({
            formulationTabData: {
              ...formulationTabData,
              [activeTabId]: { ...formulationTabData[activeTabId], nodes: previousNodes },
            },
          });
          toast({
            title: 'Erro de Sincronização',
            description: 'Sua última alteração não pôde ser salva. Verifique sua conexão e tente novamente.',
            variant: 'destructive',
          });
        }
      },

      updateNode: async (id, data) => {
        const { activeTabId, patientId, formulationTabData } = get();
        if (!activeTabId || !patientId) return;
        const previousNodes = formulationTabData[activeTabId]?.nodes || [];
        const newNodes = previousNodes.map((n: any) => (n.id === id ? { ...n, ...data } : n));
        set({
          formulationTabData: {
            ...formulationTabData,
            [activeTabId]: { ...formulationTabData[activeTabId], nodes: newNodes },
          },
        });
        try {
          await updateNodesSvc(patientId, activeTabId, newNodes);
        } catch (error) {
          console.error('Falha ao atualizar o nó:', error);
          set({
            formulationTabData: {
              ...formulationTabData,
              [activeTabId]: { ...formulationTabData[activeTabId], nodes: previousNodes },
            },
          });
          toast({
            title: 'Erro de Sincronização',
            description: 'Sua última alteração não pôde ser salva. Verifique sua conexão e tente novamente.',
            variant: 'destructive',
          });
        }
      },

      deleteNode: async (id) => {
        const { activeTabId, patientId, formulationTabData } = get();
        if (!activeTabId || !patientId) return;
        const previousNodes = formulationTabData[activeTabId]?.nodes || [];
        const newNodes = previousNodes.filter((n: any) => n.id !== id);
        set({
          formulationTabData: {
            ...formulationTabData,
            [activeTabId]: { ...formulationTabData[activeTabId], nodes: newNodes },
          },
        });
        try {
          await updateNodesSvc(patientId, activeTabId, newNodes);
        } catch (error) {
          console.error('Falha ao remover o nó:', error);
          set({
            formulationTabData: {
              ...formulationTabData,
              [activeTabId]: { ...formulationTabData[activeTabId], nodes: previousNodes },
            },
          });
          toast({
            title: 'Erro de Sincronização',
            description: 'Sua última alteração não pôde ser salva. Verifique sua conexão e tente novamente.',
            variant: 'destructive',
          });
        }
      },

      addEdge: async (edge) => {
        const { activeTabId, patientId, formulationTabData } = get();
        if (!activeTabId || !patientId) return;
        const previousEdges = formulationTabData[activeTabId]?.edges || [];
        const newEdges = [...previousEdges, edge];
        set({
          formulationTabData: {
            ...formulationTabData,
            [activeTabId]: { ...formulationTabData[activeTabId], edges: newEdges },
          },
        });
        try {
          await updateEdgesSvc(patientId, activeTabId, newEdges);
        } catch (error) {
          console.error('Falha ao salvar a nova conexão:', error);
          set({
            formulationTabData: {
              ...formulationTabData,
              [activeTabId]: { ...formulationTabData[activeTabId], edges: previousEdges },
            },
          });
          toast({
            title: 'Erro de Sincronização',
            description: 'Sua última alteração não pôde ser salva. Verifique sua conexão e tente novamente.',
            variant: 'destructive',
          });
        }
      },

      deleteEdge: async (id) => {
        const { activeTabId, patientId, formulationTabData } = get();
        if (!activeTabId || !patientId) return;
        const previousEdges = formulationTabData[activeTabId]?.edges || [];
        const newEdges = previousEdges.filter((e: any) => e.id !== id);
        set({
          formulationTabData: {
            ...formulationTabData,
            [activeTabId]: { ...formulationTabData[activeTabId], edges: newEdges },
          },
        });
        try {
          await updateEdgesSvc(patientId, activeTabId, newEdges);
        } catch (error) {
          console.error('Falha ao remover a conexão:', error);
          set({
            formulationTabData: {
              ...formulationTabData,
              [activeTabId]: { ...formulationTabData[activeTabId], edges: previousEdges },
            },
          });
          toast({
            title: 'Erro de Sincronização',
            description: 'Sua última alteração não pôde ser salva. Verifique sua conexão e tente novamente.',
            variant: 'destructive',
          });
        }
      },

      // ----- Existing card/label management -----
      cards: [],
      labels: [],
      activePanel: null,
      panelState: {},

      addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
      archiveCard: (cardId) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === cardId ? { ...card, archived: true } : card
          ),
        })),
      restoreCard: (cardId) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === cardId ? { ...card, archived: false } : card
          ),
        })),

      addLabel: (label) =>
        set((state) => ({ labels: [...state.labels, { ...label, id: crypto.randomUUID() }] })),
      assignLabelToCard: (cardId, labelId) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === cardId
              ? { ...card, labels: card.labels ? [...card.labels, labelId] : [labelId] }
              : card
          ),
        })),

      setActivePanel: (panel) => set({ activePanel: panel }),
      setPanelState: (panel, newState) =>
        set((state) => ({ panelState: { ...state.panelState, [panel]: newState } })),
    }),
    {
      name: 'clinical-map-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
