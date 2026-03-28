import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCharacters } from './useCharacters';
import type { Character } from '../types/character';

const fetchCharactersMock = vi.fn();
const initGameMock = vi.fn();
const startGameMock = vi.fn();

vi.mock('@/features/game/services/rickAndMortyService', () => ({
  fetchCharacters: (...args: unknown[]) => fetchCharactersMock(...args),
}));

vi.mock('@/features/game/store/useGameStore', () => ({
  useGameStore: (selector: (state: { initGame: () => void; startGame: () => void }) => unknown) =>
    selector({
      initGame: initGameMock,
      startGame: startGameMock,
    }),
}));

const characters: Character[] = [
  {
    id: '1',
    name: 'Rick Sanchez',
    image: 'rick.png',
    status: 'Alive',
    species: 'Human',
  },
];

describe('useCharacters', () => {
  it('loads characters successfully and initializes the game', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    fetchCharactersMock.mockResolvedValueOnce(characters);

    const { result } = renderHook(() => useCharacters());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchCharactersMock).toHaveBeenCalledWith(1, 6);
    expect(initGameMock).toHaveBeenCalledWith(characters);
    expect(result.current.error).toBeNull();
  });

  it('sets an error when loading characters fails', async () => {
    fetchCharactersMock.mockRejectedValueOnce(new Error('network'));

    const { result } = renderHook(() => useCharacters());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(
      'No pudimos cargar los personajes. ¿Reintentamos?'
    );
    expect(initGameMock).not.toHaveBeenCalled();
  });

  it('returns startGame from the game store', async () => {
    fetchCharactersMock.mockResolvedValueOnce(characters);

    const { result } = renderHook(() => useCharacters());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.startGame();
    expect(startGameMock).toHaveBeenCalledTimes(1);
  });
});
