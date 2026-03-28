import Button from '@/shared/components/ui/Button';
import { useGameStore } from '../store/useGameStore';
import CharacterCard from './game-card/CharacterCard';
import GameOver from './GameOver';
import Loader from '../../../shared/components/ui/Loader';

type GridCardProps = {
  isLoading: boolean;
  error: string | null;
  startGame: () => void;
};

export default function GridCard({ isLoading, startGame }: GridCardProps) {
  const cards = useGameStore((s) => s.cards);
  const status = useGameStore((s) => s.status);

  const isPlayed = status === 'playing' ? 'disabled' : 'play';

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
  console.log(status);

  return (
    <section className="h-auto w-full">
      <h2 className="text-start text-[24px] font-bold">Personajes</h2>
      <main className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
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
