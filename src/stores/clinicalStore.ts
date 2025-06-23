// src/stores/clinicalStore.ts
/* eslint-disable no-unused-vars */

import { create } from 'zustand';
import {
  fetchClinicalData as fetchClinicalDataSvc,
  saveClinicalData as saveClinicalDataSvc,
} from '@/services/clinicalService';
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

// Define the colors for each card type

interface ClinicalState {
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
  openSchemaForm: (schemaId?: string, prefillRule?: string) => void;
  closeSchemaForm: () => void;
  prefillSchemaRule?: string;

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

  isLoadingClinicalData: boolean;
  clinicalDataError: string | null;

  addLabel: (label: Omit<Label, 'id'>) => void;
  assignLabelToCard: (cardId: string, labelId: string) => void;

  addTab: (type: ClinicalTabType, title: string) => string;
  removeTab: (id: string) => void;
  renameTab: (id: string, title: string) => void;
  setActiveTab: (id: string) => void;
  fetchClinicalData: (patientId: string, tabId: string) => void;
  saveClinicalData: (patientId: string, tabId: string) => void;

  setActivePanel: (panel: PanelType) => void;
  setPanelState: (panel: string, state: any) => void;
}

export const useClinicalStore = create<ClinicalState>((set, get) => ({
  // ----- Tab Management -----
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
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, title } : t)),
    })),
  setActiveTab: (id) => set({ activeTabId: id }),
  fetchClinicalData: async (patientId, tabId) => {
    set({ isLoadingClinicalData: true, clinicalDataError: null });
    try {
      await fetchClinicalDataSvc(patientId, tabId);
      set((state) => ({
        formulationTabData: {
          ...state.formulationTabData,
          [tabId]: state.formulationTabData[tabId] || { ...defaultTabData },
        },
        isLoadingClinicalData: false,
      }));
    } catch (e) {
      console.error('Erro ao carregar dados clínicos', e);
      set({ isLoadingClinicalData: false, clinicalDataError: 'Falha ao carregar dados clínicos.' });
    }
  },
  saveClinicalData: async (patientId, tabId) => {
    const data = get().formulationTabData[tabId];
    await saveClinicalDataSvc(patientId, tabId, data);
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

  // ----- Existing card/label management -----
  cards: [],
  labels: [],
  activePanel: null,
  panelState: {},

  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),

  archiveCard: (cardId) =>
    set((state) => ({
      cards: state.cards.map((card) => (card.id === cardId ? { ...card, archived: true } : card)),
    })),

  restoreCard: (cardId) =>
    set((state) => ({
      cards: state.cards.map((card) => (card.id === cardId ? { ...card, archived: false } : card)),
    })),

  addLabel: (label) =>
    set((state) => ({
      labels: [...state.labels, { ...label, id: crypto.randomUUID() }],
    })),

  assignLabelToCard: (cardId, labelId) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              labels: card.labels ? [...card.labels, labelId] : [labelId],
            }
          : card
      ),
    })),

  setActivePanel: (panel) => set({ activePanel: panel }),

  setPanelState: (panel, newState) =>
    set((state) => ({
      panelState: { ...state.panelState, [panel]: newState },
    })),
}));
