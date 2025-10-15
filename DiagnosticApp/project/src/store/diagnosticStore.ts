import { create } from 'zustand';
import type { Client, DiagnosticType, DiagnosticAnswers } from '../types';

interface DiagnosticState {
  currentType: DiagnosticType | null;
  currentClient: Client | null;
  currentAnswers: Partial<DiagnosticAnswers>;
  signatureData: string | null;

  setDiagnosticType: (type: DiagnosticType) => void;
  setClient: (client: Client) => void;
  updateAnswers: (answers: Partial<DiagnosticAnswers>) => void;
  setSignature: (data: string) => void;
  reset: () => void;
}

export const useDiagnosticStore = create<DiagnosticState>((set) => ({
  currentType: null,
  currentClient: null,
  currentAnswers: {},
  signatureData: null,

  setDiagnosticType: (type) => set({ currentType: type }),
  setClient: (client) => set({ currentClient: client }),
  updateAnswers: (answers) =>
    set((state) => ({ currentAnswers: { ...state.currentAnswers, ...answers } })),
  setSignature: (data) => set({ signatureData: data }),
  reset: () => set({
    currentType: null,
    currentClient: null,
    currentAnswers: {},
    signatureData: null,
  }),
}));
