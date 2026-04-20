import { useCallback, useEffect, useState } from 'react';
import { fetchCharacters } from '@/features/game/services/rickAndMortyService';
import { useGameStore } from '@/features/game/store/useGameStore';
import {
  DIFFICULTY_CARD_LIMIT,
  type Difficulty,
} from '@/features/game/types/character';

interface UseCharactersReturn {
  isLoading: boolean;
  error: string | null;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: () => void;
}

export const useCharacters = (): UseCharactersReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const initGame = useGameStore((s) => s.initGame);
  const startGame = useGameStore((s) => s.startGame);

  const load = useCallback(async (selectedDifficulty: Difficulty) => {
    setIsLoading(true);
    setError(null);
    try {
      const characters = await fetchCharacters(
        Math.floor(Math.random() * 5) + 1,
        DIFFICULTY_CARD_LIMIT[selectedDifficulty]
      );
      initGame(characters);
    } catch {
      setError('No pudimos cargar los personajes. ¿Reintentamos?');
    } finally {
      setIsLoading(false);
    }
  }, [initGame]);

  useEffect(() => {
    load(difficulty);
  }, [difficulty, load]);

  return { isLoading, error, difficulty, setDifficulty, startGame };
};
