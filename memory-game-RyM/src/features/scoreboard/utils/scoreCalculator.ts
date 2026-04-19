
export const scoreCalculator = (turns: number): number => {
  const baseScore = 1000;
  const penalty = turns * 10;
  const finalScore = Math.max(baseScore - penalty, 0);
  return finalScore;
}