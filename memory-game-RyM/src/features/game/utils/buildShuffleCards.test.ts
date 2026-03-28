import { describe, expect, it, vi } from 'vitest';
import type { Character } from '../types/character';
import { buildShuffledCards } from './buildShuffleCards';

const characters: Character[] = [
  {
    id: '1',
    name: 'Rick Sanchez',
    image: 'rick.png',
    status: 'Alive',
    species: 'Human',
  },
  {
    id: '2',
    name: 'Morty Smith',
    image: 'morty.png',
    status: 'Alive',
    species: 'Human',
  },
];

describe('buildShuffledCards', () => {
  it('returns an empty array when there are no characters', () => {
    expect(buildShuffledCards([])).toEqual([]);
  });

  it('builds two cards per character with the expected shape', () => {
    const cards = buildShuffledCards([characters[0]]);

    expect(cards).toHaveLength(2);
    expect(cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          uid: '1_a',
          characterId: '1',
          name: 'Rick Sanchez',
          image: 'rick.png',
          status: 'Alive',
          species: 'Human',
          isFlipped: false,
          isMatched: false,
        }),
        expect.objectContaining({
          uid: '1_b',
          characterId: '1',
          name: 'Rick Sanchez',
          image: 'rick.png',
          status: 'Alive',
          species: 'Human',
          isFlipped: false,
          isMatched: false,
        }),
      ])
    );
  });

  it('shuffles cards using Math.random (deterministic with mocked random)', () => {
    const randomSpy = vi
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.5);

    const cards = buildShuffledCards(characters);

    expect(cards.map((card) => card.uid)).toEqual(['2_a', '1_b', '1_a', '2_b']);
    expect(randomSpy).toHaveBeenCalled();
  });
});
