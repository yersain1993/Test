import Button from '@/shared/components/ui/Button';
import { useGameStore } from '../store/useGameStore';
import CharacterCard from './game-card/CharacterCard';
import GameOver from './GameOver';
import Loader from '../../../shared/components/ui/Loader';
import type { Difficulty } from '../types/character';

type GridCardProps = {
  isLoading: boolean;
  error: string | null;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: () => void;
};

const DIFFICULTY_OPTIONS: Difficulty[] = ['easy', 'medium', 'hard'];

export default function GridCard({
  isLoading,
  error,
  difficulty,
  setDifficulty,
  startGame,
}: GridCardProps) {
  const cards = useGameStore((s) => s.cards);
  const status = useGameStore((s) => s.status);

  const isPlayed = status === 'playing' ? 'disabled' : 'play';
  const isDifficultyLocked = status === 'preview' || status === 'playing';

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (status === 'finished') {
    return <GameOver />;
  }

  return (
    <section className="h-auto w-full">
      <header className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-start text-[24px] font-bold">Personajes</h2>
        <div className="flex items-center gap-2 rounded-xl border border-[#1f3247] bg-white p-1">
          {DIFFICULTY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDifficulty(option)}
              disabled={isDifficultyLocked}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold uppercase transition ${
                difficulty === option
                  ? 'bg-[#1f3247] text-white'
                  : 'text-[#1f3247] hover:bg-[#e9eef4]'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {option}
            </button>
          ))}
        </div>
      </header>

      {error ? (
        <p className="mb-4 rounded-lg border border-[#c44a4a] bg-[#ffe9e9] px-3 py-2 text-sm text-[#7a1f1f]">
          {error}
        </p>
      ) : null}

      <main className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <CharacterCard key={card.uid} card={card} />
        ))}
      </main>
      <Button variant={isPlayed} className="mt-2" onClick={startGame}>
        Inicio
      </Button>
    </section>
  );
}
