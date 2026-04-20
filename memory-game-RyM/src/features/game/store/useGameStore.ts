import { create } from 'zustand';
import type { Character, Card, GameStatus } from '../types/character';
import { buildShuffledCards } from '../utils/buildShuffleCards';

interface GameState {
  characters: Character[];
  cards: Card[];
  flippedCards: string[];
  turns: number;
  matches: number;
  timerId?: number | null;
  status: GameStatus;
  isTimeOver: boolean;
  elapsedTime: number;

  initGame: (characters: Character[]) => void;
  startGame: () => void;
  flipCard: (uid: string) => void;
  resetGame: () => void;
  setStatus: (status: GameStatus) => void;
  timmer: (initialTime: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  characters: [],
  cards: [],
  flippedCards: [],
  turns: 0,
  matches: 0,
  status: 'idle',
  elapsedTime: 60,
  isTimeOver: false,

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

  timmer: (initialTime) => {
    const { timerId } = get();

    if (timerId !== null) window.clearInterval(timerId);

    set({ elapsedTime: initialTime, isTimeOver: false });

    const id = window.setInterval(() => {
      const { elapsedTime, status } = get();

      if (status !== 'playing') return;

      if (elapsedTime <= 1) {
        window.clearInterval(id);
        set({
          elapsedTime: 0,
          isTimeOver: true,
          status: 'finished',
          timerId: null,
        });
        return;
      }

      set({ elapsedTime: elapsedTime - 1 });
    }, 1000);

    set({ timerId: id });
  },

  stopTimer: () => {
    const { timerId } = get();
    if (timerId !== null) {
      window.clearInterval(timerId);
      set({ timerId: null });
    }
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
