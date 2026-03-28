import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Card, Character } from '../types/character';
import { useGameStore } from './useGameStore';

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

const buildCard = (uid: string, characterId: string): Card => ({
  uid,
  characterId,
  name: uid,
  image: `${uid}.png`,
  status: 'Alive',
  species: 'Human',
  isFlipped: false,
  isMatched: false,
});

describe('useGameStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('initializes game state with cards and default counters', () => {
    useGameStore.getState().initGame(characters);
    const state = useGameStore.getState();

    expect(state.characters).toEqual(characters);
    expect(state.cards).toHaveLength(4);
    expect(state.flippedCards).toEqual([]);
    expect(state.turns).toBe(0);
    expect(state.matches).toBe(0);
    expect(state.status).toBe('idle');
  });

  it('transitions from idle to preview and then to playing on startGame', () => {
    useGameStore.getState().setStatus('idle');
    useGameStore.getState().startGame();

    expect(useGameStore.getState().status).toBe('preview');

    vi.advanceTimersByTime(3000);
    expect(useGameStore.getState().status).toBe('playing');
  });

  it('ignores flipCard when status is not playing', () => {
    const cards = [buildCard('1_a', '1')];
    useGameStore.setState({ cards, status: 'idle', flippedCards: [] });

    useGameStore.getState().flipCard('1_a');

    expect(useGameStore.getState().flippedCards).toEqual([]);
    expect(useGameStore.getState().cards[0].isFlipped).toBe(false);
  });

  it('does not count a turn when flipping the same card twice', () => {
    const cards = [buildCard('1_a', '1'), buildCard('1_b', '1')];
    useGameStore.setState({
      cards,
      status: 'playing',
      flippedCards: [],
      turns: 0,
      matches: 0,
    });

    useGameStore.getState().flipCard('1_a');
    useGameStore.getState().flipCard('1_a');

    vi.advanceTimersByTime(1000);

    const state = useGameStore.getState();
    expect(state.flippedCards).toEqual(['1_a']);
    expect(state.turns).toBe(0);
    expect(state.matches).toBe(0);
  });

  it('ignores flips when two cards are already open', () => {
    const cards = [
      buildCard('1_a', '1'),
      buildCard('1_b', '1'),
      buildCard('2_a', '2'),
    ];
    useGameStore.setState({
      cards,
      status: 'playing',
      flippedCards: [],
      turns: 0,
      matches: 0,
    });

    useGameStore.getState().flipCard('1_a');
    useGameStore.getState().flipCard('1_b');
    useGameStore.getState().flipCard('2_a');

    expect(useGameStore.getState().flippedCards).toEqual(['1_a', '1_b']);
  });

  it('marks cards as matched, increments turn and finishes when all pairs are matched', () => {
    const cards = [buildCard('1_a', '1'), buildCard('1_b', '1')];
    useGameStore.setState({
      cards,
      status: 'playing',
      flippedCards: [],
      turns: 0,
      matches: 0,
    });

    useGameStore.getState().flipCard('1_a');
    useGameStore.getState().flipCard('1_b');
    vi.advanceTimersByTime(1000);

    const state = useGameStore.getState();
    expect(state.turns).toBe(1);
    expect(state.matches).toBe(1);
    expect(state.status).toBe('finished');
    expect(state.cards.every((card) => card.isMatched && card.isFlipped)).toBe(
      true
    );
  });

  it('resets unmatched cards after comparison timeout and keeps status playing', () => {
    const cards = [buildCard('1_a', '1'), buildCard('2_a', '2')];
    useGameStore.setState({
      cards,
      status: 'playing',
      flippedCards: [],
      turns: 0,
      matches: 0,
    });

    useGameStore.getState().flipCard('1_a');
    useGameStore.getState().flipCard('2_a');
    vi.advanceTimersByTime(1000);

    const state = useGameStore.getState();
    expect(state.turns).toBe(1);
    expect(state.matches).toBe(0);
    expect(state.status).toBe('playing');
    expect(state.flippedCards).toEqual([]);
    expect(state.cards.every((card) => !card.isMatched && !card.isFlipped)).toBe(
      true
    );
  });

  it('resetGame rebuilds cards and resets counters', () => {
    useGameStore.getState().initGame(characters);
    useGameStore.setState({
      turns: 4,
      matches: 2,
      status: 'finished',
      flippedCards: ['temp'],
    });

    useGameStore.getState().resetGame();
    const state = useGameStore.getState();

    expect(state.cards).toHaveLength(4);
    expect(state.turns).toBe(0);
    expect(state.matches).toBe(0);
    expect(state.status).toBe('idle');
    expect(state.flippedCards).toEqual([]);
  });
});
