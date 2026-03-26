import { useCharacters } from '../hooks/useCharacters';
import { useGameStore } from '../store/useGameStore';
import type { Character } from '../types/character';
import BackCharacterCard from './game-card/BackCharacterCard';
import CharacterCard from './game-card/CharacterCard';

type GridCardProps = {
  characters: Character[];
};

export default function GridCard({ characters }: GridCardProps) {
  const { isLoading, error, retry } = useCharacters();
  const { turns, matches, status } = useGameStore();

  if (isLoading)
    return (
      <div className="">
        <BackCharacterCard />
      </div>
    );
  if (error)
    return (
      <div className="flex h-72 w-53 items-center justify-center rounded bg-red-200">
        Error al cargar.{' '}
        <button
          onClick={retry}
          className="ml-2 rounded bg-red-500 px-2 py-1 text-white"
        >
          Reintentar
        </button>
      </div>
    );
  if (status === 'finished')
    return (
      <div className="flex h-72 w-53 items-center justify-center rounded bg-green-200">
        ¡Juego terminado! Turns: {turns}, Matches: {matches}
      </div>
    );

  return (
    <section className="h-auto w-full">
      <h2 className="w-full text-start text-2xl font-bold">Personajes</h2>
      <main className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {characters.map((char: Character) => (
          <CharacterCard key={char.id} character={char} />
        ))}
      </main>
    </section>
  );
}
