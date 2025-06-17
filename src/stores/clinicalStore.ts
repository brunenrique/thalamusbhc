// src/stores/clinicalStore.ts

import { create } from "zustand";
import { BaseCard, Label } from "@/types/clinicalTypes";

type PanelType = "hexaflex" | "chain" | "matrix" | null;

interface ClinicalState {
  cards: BaseCard[];
  labels: Label[];
  activePanel: PanelType;
  panelState: Record<string, any>;
  addCard: (card: BaseCard) => void;
  archiveCard: (cardId: string) => void;
  restoreCard: (cardId: string) => void;

  addLabel: (label: Omit<Label, "id">) => void;
  assignLabelToCard: (cardId: string, labelId: string) => void;

  setActivePanel: (panel: PanelType) => void;
  setPanelState: (panel: string, state: any) => void;
}

export const useClinicalStore = create<ClinicalState>((set) => ({
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
