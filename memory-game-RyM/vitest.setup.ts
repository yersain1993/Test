import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { useGameStore } from './src/features/game/store/useGameStore';

const initialGameState = useGameStore.getInitialState();

afterEach(() => {
  useGameStore.setState(initialGameState, true);
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
