import { create } from 'zustand';

interface GameState {
  glassBalls: number;
  mission: string;
  isQuizOpen: boolean;
  activeBlockId: string | null;
  playerPosition: [number, number, number];
  
  // Novos estados para a mecânica de voo
  isPiloting: boolean;
  jetPosition: [number, number, number];
  
  addGlassBall: () => void;
  setMission: (mission: string) => void;
  openQuiz: (blockId: string) => void;
  closeQuiz: () => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  
  // Novas funções de voo
  togglePiloting: () => void;
  setJetPosition: (pos: [number, number, number]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  glassBalls: 0,
  mission: 'Missão: Explore a base, encontre o cubo Dourado ou pegue o Caça (Tecla F).',
  isQuizOpen: false,
  activeBlockId: null,
  playerPosition: [0, 0, 0],
  
  isPiloting: false,
  jetPosition: [-15, 0.5, -20], // Posição inicial do caça
  
  addGlassBall: () => set((state) => ({ glassBalls: state.glassBalls + 1 })),
  setMission: (mission) => set({ mission }),
  openQuiz: (blockId) => set({ isQuizOpen: true, activeBlockId: blockId }),
  closeQuiz: () => set({ isQuizOpen: false, activeBlockId: null }),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  
  togglePiloting: () => set((state) => ({ isPiloting: !state.isPiloting })),
  setJetPosition: (pos) => set({ jetPosition: pos }),
}));