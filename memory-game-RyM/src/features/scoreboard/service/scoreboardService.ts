import type { Scores } from "../types/score";


export const saveScoreLocalStorage = (scores: Scores[]) => {
    localStorage.setItem("scores", JSON.stringify(scores));
};

export const getScoresLocalStorage = (): Scores[] => {
    const scores = localStorage.getItem("scores");
    return scores ? JSON.parse(scores) : [];
}