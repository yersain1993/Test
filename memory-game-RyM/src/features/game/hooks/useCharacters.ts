import { useCallback, useEffect, useState } from 'react';
import { fetchCharacters } from '@/features/game/services/rickAndMortyService';
import { useGameStore } from '@/features/game/store/useGameStore';

interface UseCharactersReturn {
  isLoading: boolean;
  error: string | null;
  startGame: () => void;
}

export const useCharacters = (): UseCharactersReturn => {
  const [isLoading, setIsLoading] = useState(true);  // inicia cargando
  const [error, setError] = useState<string | null>(null);
  const initGame = useGameStore((s) => s.initGame);
  const startGame = useGameStore((s) => s.startGame);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const characters = await fetchCharacters(Math.floor(Math.random() * 5) + 1, 6);
      initGame(characters);  // solo inicializa, status queda en 'idle'
    } catch {
      setError('No pudimos cargar los personajes. ¿Reintentamos?');
    } finally {
      setIsLoading(false);
    }
  }, [initGame]);

  useEffect(() => {
    load();
  }, [load]);

  return { isLoading, error, startGame };
};
