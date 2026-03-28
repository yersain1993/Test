import { create } from 'zustand';
import type { Character, Card, GameStatus } from '../types/character';
import { buildShuffledCards } from '../utils/buildShuffleCards';

interface GameState {
  characters: Character[];
  cards: Card[];
  flippedCards: string[];
  turns: number;
  matches: number;
  status: GameStatus;

  initGame: (characters: Character[]) => void;
  startGame: () => void;
  flipCard: (uid: string) => void;
  resetGame: () => void;
  setStatus: (status: GameStatus) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  characters: [],
  cards: [],
  flippedCards: [],
  turns: 0,
  matches: 0,
  status: 'idle',

  initGame: (characters) => {
    set({
      characters,
      cards: buildShuffledCards(characters),
      flippedCards: [],
      turns: 0,
      matches: 0,
      status: 'idle',
    });
  },

  startGame: () => {
    const { setStatus } = get();
    setStatus('preview');
    setTimeout(() => setStatus('playing'), 3000);
  },

  flipCard: (uid) => {
    const { cards, flippedCards, status } = get();
    if (status !== 'playing') return;

    const card = cards.find((c) => c.uid === uid);
    if (!card || card.isMatched || card.isFlipped || flippedCards.length === 2)
      return;

    const updatedCards = cards.map((c) =>
      c.uid === uid ? { ...c, isFlipped: true } : c
    );
    const newFlipped = [...flippedCards, uid];

    set({ cards: updatedCards, flippedCards: newFlipped });

    if (newFlipped.length === 2) {
      const [firstUid, secondUid] = newFlipped;
      const first = updatedCards.find((c) => c.uid === firstUid)!;
      const second = updatedCards.find((c) => c.uid === secondUid)!;
      const isMatch = first.characterId === second.characterId;

      setTimeout(() => {
        set((state) => {
          const newMatches = isMatch ? state.matches + 1 : state.matches;
          const totalPairs = state.cards.length / 2;

          return {
            turns: state.turns + 1,
            matches: newMatches,
            flippedCards: [],
            status: newMatches === totalPairs ? 'finished' : 'playing',
            cards: state.cards.map((c) =>
              c.uid === firstUid || c.uid === secondUid
                ? { ...c, isFlipped: isMatch, isMatched: isMatch }
                : c
            ),
          };
        });
      }, 1000);
    }
  },

  resetGame: () => {
    const { characters } = get();
    set({
      cards: buildShuffledCards(characters),
      flippedCards: [],
      turns: 0,
      matches: 0,
      status: 'idle',
    });
  },

  setStatus: (status) => set({ status }),
}));
