import Button from '@/shared/components/ui/Button';
import { useGameStore } from '../store/useGameStore';
import { useAuth } from '@/features/auth/context/userContext';

export default function GameOver() {
  const turns = useGameStore((s) => s.turns);
  const resetGame = useGameStore((s) => s.resetGame);

  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-[#1f3247]">¡Felicitaciones!</h2>
      <div className="text-center">
        <p className="text-xl">
          Terminaste el juego con <span className="font-bold">{turns}</span>{' '}
          turnos
        </p>
      </div>
      <div className="flex w-full gap-4">
        <Button variant="play" onClick={resetGame} className="flex-1">
          Repetir
        </Button>
        <Button variant="home" onClick={logout} className="flex-1">
          Inicio
        </Button>
      </div>
    </div>
  );
}
