import { useScoreboardStore } from '../store/useScoreboardStore';
export default function ScoreBoard() {
  const scores = useScoreboardStore((s) => s.getScores());

  return (
    <section className="w-full rounded-lg bg-gray-100 p-4">
      <h1>Scoreboard</h1>
      <div className='h-full flex items-center justify-around gap-2'>
        <span className="text-gray-600">Ranking</span>
        <span className="text-gray-600">Puntaje</span>
      </div>
      <main className="mt-4 flex flex-col gap-2">
        {scores.map((score, index) => (
          <div
            key={score.id}
            className="flex items-center justify-around gap-2"
          >
            <span className="text-sm font-bold text-gray-700">
              {index + 1}.
            </span>
            <span className='font-medium'>
              {score.points}
            </span>
          </div>
        ))}
      </main>
    </section>
  );
}
