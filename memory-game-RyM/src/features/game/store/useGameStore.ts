import { create } from "zustand";
import type { Character } from "../types/character";
import type {Card, GameStatus} from "@/features/game/types/character";
import { buildShuffledCards } from "../utils/buildShuffleCards";

export interface GameState {
    //State
    cards: Card[];
    flippedCards: Card[];
    turns: number;
    matches: number;
    status: GameStatus;

    //Actions
    initGame: (characters: Character[]) => void;
    flipCard: (uid: string) => void;
    resetGame: () => void;
    setStatus: (status: GameStatus) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  cards: [],
  flippedCards: [],
  turns: 0,
  matches: 0,
  status: "idle",

  initGame: (characters) => {
    set({
      cards: buildShuffledCards(characters),
      flippedCards: [],
      turns: 0,
      matches: 0,
      status: "preview", // inicia mostrando las cartas 3s
    });
  },

  flipCard: (uid) => {
    const { cards, flippedCards, turns, matches } = get();

    // Bloquear si ya hay 2 cartas volteadas o la carta ya está matched
    const card = cards.find((c) => c.uid === uid);
    if (!card || card.isMatched || card.isFlipped || flippedCards.length === 2) return;

    const updatedCards = cards.map((c) =>
      c.uid === uid ? { ...c, isFlipped: true } : c
    );
    const newFlipped = [...flippedCards, { ...card, isFlipped: true }];

    set({ cards: updatedCards, flippedCards: newFlipped });

    // Evaluar par cuando hay 2 cartas
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const isMatch = first.characterId === second.characterId;

      setTimeout(() => {
        set((state) => {
          const newMatches = isMatch ? matches + 1 : matches;
          const totalPairs = state.cards.length / 2;

          return {
            turns: turns + 1,
            matches: newMatches,
            flippedCards: [],
            status: newMatches === totalPairs ? "finished" : "playing",
            cards: state.cards.map((c) =>
              c.uid === first.uid || c.uid === second.uid
                ? { ...c, isFlipped: isMatch ? true : false, isMatched: isMatch }
                : c
            ),
          };
        });
      }, 1000);
    }
  },

  resetGame: () => {
    const { cards } = get();
    // Reconstruimos con los mismos personajes pero barajados de nuevo
    const uniqueChars = Object.values(
      cards.reduce((acc, card) => {
        if (!acc[card.characterId]) {
          acc[card.characterId] = {
            id: card.characterId,
            name: card.name,
            image: card.image,
            status: card.status,
            species: card.species,
          };
        }
        return acc;
      }, {} as Record<string, { id: string; name: string; image: string; status: string; species: string }>)
    );

    set({
      cards: buildShuffledCards(uniqueChars),
      flippedCards: [],
      turns: 0,
      matches: 0,
      status: "preview",
    });
  },

  setStatus: (status) => set({ status }),
}));


