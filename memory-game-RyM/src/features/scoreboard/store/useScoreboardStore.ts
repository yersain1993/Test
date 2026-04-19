import { create } from "zustand";
import type { Scores } from "../types/score";
import { getScoresLocalStorage, saveScoreLocalStorage } from "../service/scoreboardService";

interface ScoreboardState {
  scores: Scores[];
  processedGameIds: string[];

  registerGameResult: (result: { gameId: string; points: number }) => void;
  hydrateScores: () => void;
  getScores: () => Scores[];
  resetScore: () => void;
}

export const useScoreboardStore = create<ScoreboardState>((set, get) => ({
  scores: [],
  processedGameIds: [],
  
  registerGameResult: ({gameId, points}) => {
    const { scores, processedGameIds } = get();

    if (processedGameIds.includes(gameId)) return;

    if(!points) return;

    const newScore = {
        id: crypto.randomUUID(),
        points,
        date: new Date().toISOString(),
    }

    const updatedScores = [...scores, newScore];
    const sortedScores = updatedScores.sort((a, b) => b.points - a.points);
    set({ 
        scores: sortedScores,
        processedGameIds: [...processedGameIds, gameId]
    });

    saveScoreLocalStorage(sortedScores);
  },

  getScores: () => {
    const { scores } = get();
    return scores;
  },
  
  resetScore: () => {
    set({ scores: [], processedGameIds: [] });
    localStorage.removeItem("scores");
  },

  hydrateScores: () =>{
    const localScores = getScoresLocalStorage();
    set({ scores: localScores });
  }
}));