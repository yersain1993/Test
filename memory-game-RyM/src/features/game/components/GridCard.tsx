import Button from '@/shared/components/ui/Button';
import { useGameStore } from '../store/useGameStore';
import CharacterCard from './game-card/CharacterCard';
import GameOver from './GameOver';

type GridCardProps = {
  isLoading: boolean;
  error: string | null;
  startGame: () => void;
};

export default function GridCard({ isLoading, startGame }: GridCardProps) {
  const cards = useGameStore((s) => s.cards);
  const status = useGameStore((s) => s.status);

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-xl">Cargando personajes...</p>
      </div>
    );
  }

  if (status === 'finished') {
    return <GameOver />;
  }

  return (
    <section className="h-auto w-full">
      <h2 className='font-bold text-[24px] text-start'>Personajes</h2>
      <main className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <CharacterCard key={card.uid} card={card} />
        ))}
      </main>
      <Button variant="play" className='mt-2' onClick={startGame}>
        Inicio
      </Button>
    </section>
  );
}
