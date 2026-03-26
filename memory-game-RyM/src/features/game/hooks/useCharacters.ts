import { useEffect, useState } from "react";
import { fetchCharacters } from "@/features/game/services/rickAndMortyService";
import { useGameStore } from "@/features/game/store/useGameStore";

interface UseCharactersReturn {
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export const useCharacters = (): UseCharactersReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initGame = useGameStore((s) => s.initGame);
  const setStatus = useGameStore((s) => s.setStatus);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const characters = await fetchCharacters(
        Math.floor(Math.random() * 5) + 1, // página random para variedad
        6
      );
      initGame(characters);

      // Preview 3 segundos → playing
      setTimeout(() => setStatus("playing"), 3000);
    } catch {
      setError("No pudimos cargar los personajes. ¿Reintentamos?");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { isLoading, error, retry: load };
};