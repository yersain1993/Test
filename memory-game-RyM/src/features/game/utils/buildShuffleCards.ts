import type { Card, Character } from '../types/character';

export const buildShuffledCards = (characters: Character[]): Card[] => {
  const cards: Card[] = characters.flatMap((char) => [
    {
      uid: `${char.id}_a`,
      characterId: char.id,
      name: char.name,
      image: char.image,
      status: char.status,
      species: char.species,
      isFlipped: false,
      isMatched: false,
    },
    {
      uid: `${char.id}_b`,
      characterId: char.id,
      name: char.name,
      image: char.image,
      status: char.status,
      species: char.species,
      isFlipped: false,
      isMatched: false,
    },
  ]);

  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};
