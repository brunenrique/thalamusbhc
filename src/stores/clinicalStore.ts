// src/stores/clinicalStore.ts

import { create } from "zustand";
import type {
  BaseCard,
  Label,
  ClinicalTab,
  ClinicalTabType,
  TabSpecificFormulationData,
} from "@/types/clinicalTypes";

type PanelType = "hexaflex" | "chain" | "matrix" | null;

// Define the colors for each card type
export const allCardColors: Record<string, string> = {
  abc: "#FFC0CB", // Pink
  chain: "#ADD8E6", // LightBlue
  matrix: "#90EE90", // LightGreen
  generic: "#D3D3D3", // LightGrey
  schema: "#FFB347", // LightOrange
  note: "#B19CD9", // LightPurple
  assessment: "#FFFF99", // LightYellow
  goal: "#A7C7E7", // LightSteelBlue
  intervention: "#C3B1E1", // Plum
  resource: "#ACE1AF", // MintGreen
  session: "#FFDDAF", // Peach
  problem: "#FF6961", // LightCoral
  solution: "#77DD77", // PastelGreen
};

interface ClinicalState {
  tabs: ClinicalTab[];
  activeTabId?: string;
  formulationTabData: Record<string, TabSpecificFormulationData>;
  cards: BaseCard[];
  labels: Label[];
  activePanel: PanelType;
  panelState: Record<string, any>;
  addCard: (card: BaseCard) => void;
  archiveCard: (cardId: string) => void;
  restoreCard: (cardId: string) => void;

  addLabel: (label: Omit<Label, "id">) => void;
  assignLabelToCard: (cardId: string, labelId: string) => void;

  addTab: (type: ClinicalTabType, title: string) => string;
  removeTab: (id: string) => void;
  renameTab: (id: string, title: string) => void;
  setActiveTab: (id: string) => void;
  fetchClinicalData: (patientId: string, tabId: string) => void;

  setActivePanel: (panel: PanelType) => void;
  setPanelState: (panel: string, state: any) => void;
}

export const useClinicalStore = create<ClinicalState>((set, get) => ({
  // ----- Tab Management -----
  tabs: [
    { id: "initialTab", type: "formulation", title: "Formulação Inicial" },
  ],
  activeTabId: "initialTab",
  formulationTabData: {},

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
      activeTabId:
        state.activeTabId === id ? state.tabs[0]?.id : state.activeTabId,
    })),
  renameTab: (id, title) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, title } : t)),
    })),
  setActiveTab: (id) => set({ activeTabId: id }),
  fetchClinicalData: (patientId, tabId) => {
    console.log("fetchClinicalData", patientId, tabId);
    set((state) => ({
      formulationTabData: {
        ...state.formulationTabData,
        [tabId]:
          state.formulationTabData[tabId] || {
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
    }));
  },

  prefillSchemaRule: undefined,

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
    set((state) => ({
      labels: [...state.labels, { ...label, id: crypto.randomUUID() }],
    })),

  assignLabelToCard: (cardId, labelId) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              labels: card.labels
                ? [...card.labels, labelId]
                : [labelId],
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
